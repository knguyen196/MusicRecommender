from flask import Flask, request, jsonify
from flask_cors import CORS
from deezer_api import DeezerClient
from music_hybrid_recommender import MusicHybridRecommender
from podcast_hybrid_recommender import PodcastHybridRecommender
import pickle

app = Flask(__name__)
CORS(app)

deezer = DeezerClient()
hybrid_recommender = MusicHybridRecommender()
podcast_recommender = PodcastHybridRecommender()

# Load the dataset for local search
print("Loading song dataset for search")
with open('song_dataset.pkl', 'rb') as f:
    song_dataset = pickle.load(f)
print(f"Loaded {len(song_dataset)} songs for searching")

@app.route('/api/search', methods=['POST'])
def search_songs():
    try:
        data = request.get_json()
        query = data.get('query', '').strip().lower()
        
        if not query:
            return jsonify({"error": "Query is required"}), 400
        
        # Search local dataset and prevent duplicates by name+artist
        results = []
        seen_songs = set()  # Track song name + artist combinations
        
        for song in song_dataset:
            song_name = song['name'].lower()
            artist_name = song['artist'].lower()
            
            # Create unique key from name + artist
            song_key = f"{song_name}|||{artist_name}"
            
            # Skip if we've already added this song name+artist combo
            if song_key in seen_songs:
                continue
            
            # Match if query appears in song name or artist
            if query in song_name or query in artist_name:
                results.append(song)
                seen_songs.add(song_key)  # Mark as added
            
            # Limit to 30 results
            if len(results) >= 30:
                break
        
        # Enrich with Deezer images AND albums
        formatted_results = []
        for song in results:
            # Try to get image AND album from Deezer
            deezer_data = deezer.search_tracks(f"{song['name']} {song['artist']}", limit=1)
            
            image_url = None
            preview_url = None
            album_name = "Unknown"  # Default if Deezer doesn't find it
            
            if deezer_data and len(deezer_data) > 0:
                image_url = deezer_data[0].get('cover_url')
                preview_url = deezer_data[0].get('preview_url')
                album_name = deezer_data[0].get('album', 'Unknown')
            
            formatted_results.append({
                "id": song["spotify_id"],
                "title": song["name"],
                "artist": song["artist"],
                "album": album_name,
                "image": image_url,
                "preview_url": preview_url
            })
        return jsonify({"results": formatted_results}), 200
    
    except Exception as e:
        print(f"Search error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Search failed"}), 500


@app.route('/api/recommend', methods=['POST'])
def get_recommendations():
    try:
        data = request.get_json()
        ratings = data.get('ratings', {})
        weight = data.get('weight', 50)
        
        if not ratings:
            return jsonify({"error": "No ratings provided"}), 400
        
        if not isinstance(weight, (int, float)) or weight < 0 or weight > 100:
            return jsonify({"error": "Weight must be between 0 and 100"}), 400
        
        # Extract liked AND disliked songs with full metadata
        liked_songs = []
        disliked_songs = []

        for song_id, rating_data in ratings.items():
            song = rating_data.get('song', {})
            rating_value = rating_data.get('rating')
            
            if rating_value == 'Like':
                liked_songs.append({
                    'id': song_id,
                    'name': song.get('title'),
                    'artist': song.get('artist')
                })
            elif rating_value == 'Dislike':
                disliked_songs.append({
                    'id': song_id,
                    'name': song.get('title'),
                    'artist': song.get('artist')
                })

        if not liked_songs and not disliked_songs:
            return jsonify({"error": "No rated songs found"}), 400
        
        # Get recommendations
        recommendations = hybrid_recommender.recommend_by_names(
            liked_songs=liked_songs,
            disliked_songs=disliked_songs,
            weight=weight,
            top_n=10
        )
        
        formatted_recs = []
        for rec in recommendations:
            deezer_data = deezer.search_tracks(f"{rec['name']} {rec['artist']}", limit=1)
            
            image_url = None
            preview_url = None  # Add this
            album_name = rec.get("album", "Unknown")
            
            if deezer_data and len(deezer_data) > 0:
                image_url = deezer_data[0].get('cover_url')
                preview_url = deezer_data[0].get('preview_url')  # Add this
                album_name = deezer_data[0].get('album', album_name)
            
            formatted_recs.append({
                "id": rec.get("spotify_id", str(hash(rec['name'] + rec['artist']))),
                "title": rec["name"],
                "artist": rec["artist"],
                "album": album_name,
                "image": image_url,
                "preview_url": preview_url,  # Add this
                "similarity": rec["score"]
            })
        
        return jsonify({"recommendations": formatted_recs}), 200
    
    except Exception as e:
        print(f"Recommendation error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

@app.route('/api/podcasts/recommend', methods=['POST'])
def get_podcast_recommendations():
    try:
        data = request.get_json()
        ratings = data.get('ratings', {})
        weight = data.get('weight', 50)
        
        if not ratings:
            return jsonify({"error": "No ratings provided"}), 400
        
        liked_podcasts = []
        for podcast_id, rating_data in ratings.items():
            if not str(podcast_id).startswith('p'):
                continue
                
            if rating_data.get('rating') == 'Like':
                podcast = rating_data.get('podcast', rating_data.get('song', {}))
                
                title = podcast.get('title')
                host = podcast.get('artist')
                
                if title:
                    liked_podcasts.append({
                        'id': podcast_id,
                        'title': title,
                        'host': host or 'Unknown'
                    })
        
        if not liked_podcasts:
            return jsonify({"error": "No liked podcasts found"}), 400
        
        print(f"Liked podcasts (filtered): {liked_podcasts}")
        
        # Get recommendations
        podcast_name = liked_podcasts[0]['title']
        recommendations = podcast_recommender.recommend(
            user_id=1,
            podcast_name=podcast_name,
            top_n=10
        )
        
        # Load podcast data to get host information
        import pandas as pd
        df = pd.read_csv('top_podcasts.csv')
        
        formatted_recs = []
        for rec in recommendations:
            podcast_row = df[df['show.name'] == rec['name']].head(1)
            
            if not podcast_row.empty:
                row = podcast_row.iloc[0]
                formatted_recs.append({
                    "id": f"p{len(formatted_recs)}",
                    "title": row['show.name'],
                    "artist": row['show.publisher'],
                    "image": None,
                    "score": rec["score"]
                })
            else:
                formatted_recs.append({
                    "id": f"p{len(formatted_recs)}",
                    "title": rec["name"],
                    "artist": "Unknown",
                    "album": "Podcast",
                    "image": None,
                    "score": rec["score"]
                })
        
        return jsonify({"recommendations": formatted_recs}), 200
    
    except Exception as e:
        print(f"Podcast recommendation error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/api/podcasts/browse', methods=['GET'])
def browse_podcasts():
    try:
        import pandas as pd
        
        df = pd.read_csv('top_podcasts.csv')
        
        podcasts = []
        for idx, row in df.head(30).iterrows():
            podcasts.append({
                "id": f"p{idx + 1}",
                "title": row['show.name'],
                "artist": row['show.publisher'],
                "album": "Podcast",
                "image": None
            })
        
        return jsonify({"podcasts": podcasts}), 200
    
    except Exception as e:
        print(f"Browse podcasts error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/api/browse/mood/<mood>', methods=['GET'])
def browse_by_mood(mood):
    """Browse songs by audio-derived mood categories"""
    try:
        import numpy as np
        
        
        tempos = [song['features'][15] for song in song_dataset]
        brightness = [song['features'][13] for song in song_dataset]
        energy = [song['features'][28] for song in song_dataset]
        
        tempo_p25 = np.percentile(tempos, 25)
        tempo_p75 = np.percentile(tempos, 75)
        energy_p25 = np.percentile(energy, 25)
        energy_p75 = np.percentile(energy, 75)
        bright_p25 = np.percentile(brightness, 25)
        bright_p75 = np.percentile(brightness, 75)
        
        
        filtered_songs = []
        
        for song in song_dataset:
            tempo = song['features'][15]
            bright = song['features'][13]
            rms = song['features'][28]
            
            matches = False
            
            if mood == 'high-energy' and rms >= energy_p75:
                matches = True
            elif mood == 'chill' and rms <= energy_p25:
                matches = True
            elif mood == 'fast-tempo' and tempo >= tempo_p75:
                matches = True
            elif mood == 'slow-tempo' and tempo <= tempo_p25:
                matches = True
            elif mood == 'bright' and bright >= bright_p75:
                matches = True
            elif mood == 'dark' and bright <= bright_p25:
                matches = True
            
            if matches:
                filtered_songs.append(song)
        
    
        import random
        if len(filtered_songs) > 30:
            filtered_songs = random.sample(filtered_songs, 30)
        
        
        formatted_results = []
        for song in filtered_songs:
            deezer_data = deezer.search_tracks(f"{song['name']} {song['artist']}", limit=1)
            
            image_url = None
            preview_url = None
            album_name = "Unknown"
            
            if deezer_data and len(deezer_data) > 0:
                image_url = deezer_data[0].get('cover_url')
                preview_url = deezer_data[0].get('preview_url')
                album_name = deezer_data[0].get('album', 'Unknown')
            
            formatted_results.append({
                "id": song["spotify_id"],
                "title": song["name"],
                "artist": song["artist"],
                "album": album_name,
                "image": image_url,
                "preview_url": preview_url
            })
        
        return jsonify({"songs": formatted_results}), 200
    
    except Exception as e:
        print(f"Browse by mood error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("Starting Flask API on http://localhost:5000")
    print("CORS enabled for React frontend")
    app.run(debug=True, port=5000)