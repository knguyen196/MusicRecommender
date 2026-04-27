# Flask API exposes endpoints for music/podcast search, recommendations, and mood-based browsing
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

print("Loading song dataset for search")
with open('song_dataset.pkl', 'rb') as f:
    song_dataset = pickle.load(f)
print(f"Loaded {len(song_dataset)} songs for searching")

@app.route('/api/podcasts/search', methods=['POST'])
def search_podcasts():
    try:
        import pandas as pd
        data = request.get_json()
        query = data.get('query', '').strip().lower()

        if not query:
            return jsonify({"results": []}), 200

        df = pd.read_csv('top_podcasts.csv')
        mask = (
            df['show.name'].str.lower().str.contains(query, na=False) |
            df['show.publisher'].str.lower().str.contains(query, na=False) |
            df['show.description'].str.lower().str.contains(query, na=False) |
            df['category'].str.lower().str.contains(query, na=False)
        )

        results = []
        for idx, row in df[mask].head(30).iterrows():
            results.append({
                "id": f"p{idx + 1}",
                "title": row['show.name'],
                "artist": row['show.publisher'],
                "album": "Podcast",
                "image": row.get('show.artwork')
            })

        return jsonify({"results": results}), 200

    except Exception as e:
        print(f"Podcast search error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/api/search', methods=['POST'])
def search_songs():
    try:
        data = request.get_json()
        query = data.get('query', '').strip().lower()

        if not query:
            return jsonify({"error": "Query is required"}), 400

        results = []
        seen_songs = set()

        for song in song_dataset:
            song_name = song['name'].lower()
            artist_name = song['artist'].lower()
            song_key = f"{song_name}|||{artist_name}"

            if song_key in seen_songs:
                continue

            if query in song_name or query in artist_name:
                results.append(song)
                seen_songs.add(song_key)

            if len(results) >= 30:
                break

        formatted_results = []
        for song in results:
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
            preview_url = None
            album_name = rec.get("album", "Unknown")

            if deezer_data and len(deezer_data) > 0:
                image_url = deezer_data[0].get('cover_url')
                preview_url = deezer_data[0].get('preview_url')
                album_name = deezer_data[0].get('album', album_name)

            formatted_recs.append({
                "id": rec.get("spotify_id", str(hash(rec['name'] + rec['artist']))),
                "title": rec["name"],
                "artist": rec["artist"],
                "album": album_name,
                "image": image_url,
                "preview_url": preview_url,
                "similarity": rec["score"],
                "reason": rec.get("reason", "")
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

        liked_titles = [p['title'] for p in liked_podcasts]
        aggregated_scores = {}
        aggregated_reasons = {}
        for liked in liked_podcasts:
            recs = podcast_recommender.recommend(
                podcast_name=liked['title'],
                liked_podcast_names=liked_titles,
                weight=weight,
                top_n=20
            )
            for rec in recs:
                aggregated_scores[rec['name']] = aggregated_scores.get(rec['name'], 0) + rec['score']
                if rec['name'] not in aggregated_reasons:
                    aggregated_reasons[rec['name']] = rec.get('reason', '')

        recommendations = [
            {"name": name, "score": round(score, 3), "reason": aggregated_reasons.get(name, "")}
            for name, score in sorted(aggregated_scores.items(), key=lambda x: x[1], reverse=True)[:10]
        ]

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
                    "image": row.get('show.artwork'),
                    "score": rec["score"],
                    "reason": rec.get("reason", "")
                })
            else:
                formatted_recs.append({
                    "id": f"p{len(formatted_recs)}",
                    "title": rec["name"],
                    "artist": "Unknown",
                    "album": "Podcast",
                    "image": None,
                    "score": rec["score"],
                    "reason": rec.get("reason", "")
                })

        return jsonify({"recommendations": formatted_recs}), 200

    except Exception as e:
        print(f"Podcast recommendation error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/api/podcasts/browse/<category>', methods=['GET'])
def browse_podcasts_by_category(category):
    try:
        import pandas as pd
        df = pd.read_csv('top_podcasts.csv')
        matched = df[df['category'].str.lower() == category.lower()]
        filtered = matched.sample(min(30, len(matched))) if not matched.empty else matched

        podcasts = []
        for idx, row in filtered.iterrows():
            podcasts.append({
                "id": f"p{idx + 1}",
                "title": row['show.name'],
                "artist": row['show.publisher'],
                "album": "Podcast",
                "image": row.get('show.artwork')
            })

        return jsonify({"podcasts": podcasts}), 200

    except Exception as e:
        print(f"Browse podcasts by category error: {e}")
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
                "image": row.get('show.artwork')
            })

        return jsonify({"podcasts": podcasts}), 200

    except Exception as e:
        print(f"Browse podcasts error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/api/browse/mood/<mood>', methods=['GET'])
def browse_by_mood(mood):
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

MOOD_TO_PODCAST_CATEGORY = {
    'high-energy': ['Sports', 'Comedy', 'News'],
    'chill': ['Science', 'Education', 'Health'],
    'fast-tempo': ['Sports', 'Comedy', 'Technology'],
    'slow-tempo': ['History', 'Education', 'Science'],
    'bright': ['Comedy', 'Technology', 'Business'],
    'dark': ['True Crime', 'History', 'News']
}

@app.route('/api/podcasts/recommend/from-music', methods=['POST'])
def recommend_podcasts_from_music():
    try:
        data = request.get_json()
        ratings = data.get('ratings', {})

        liked_songs = []
        for song_id, rating_data in ratings.items():
            if rating_data.get('rating') == 'Like':
                song = rating_data.get('song', {})
                liked_songs.append({
                    'id': song_id,
                    'name': song.get('title'),
                    'artist': song.get('artist')
                })

        if not liked_songs:
            return jsonify({"error": "No liked songs found"}), 400

        mood_scores = {}
        for song in liked_songs:
            matching_song = next((s for s in song_dataset if s['spotify_id'] == song['id']), None)

            if matching_song:
                features = matching_song['features']
                tempo = features[15]
                brightness = features[13]
                energy = features[28]

                import numpy as np
                tempos = [s['features'][15] for s in song_dataset]
                brightness_vals = [s['features'][13] for s in song_dataset]
                energy_vals = [s['features'][28] for s in song_dataset]

                tempo_p75 = np.percentile(tempos, 75)
                tempo_p25 = np.percentile(tempos, 25)
                bright_p75 = np.percentile(brightness_vals, 75)
                bright_p25 = np.percentile(brightness_vals, 25)
                energy_p75 = np.percentile(energy_vals, 75)
                energy_p25 = np.percentile(energy_vals, 25)

                if energy >= energy_p75:
                    mood_scores['high-energy'] = mood_scores.get('high-energy', 0) + 1
                if energy <= energy_p25:
                    mood_scores['chill'] = mood_scores.get('chill', 0) + 1
                if tempo >= tempo_p75:
                    mood_scores['fast-tempo'] = mood_scores.get('fast-tempo', 0) + 1
                if tempo <= tempo_p25:
                    mood_scores['slow-tempo'] = mood_scores.get('slow-tempo', 0) + 1
                if brightness >= bright_p75:
                    mood_scores['bright'] = mood_scores.get('bright', 0) + 1
                if brightness <= bright_p25:
                    mood_scores['dark'] = mood_scores.get('dark', 0) + 1

        if not mood_scores:
            top_moods = ['chill']
        else:
            sorted_moods = sorted(mood_scores.items(), key=lambda x: x[1], reverse=True)

            if len(sorted_moods) >= 3:
                top_moods = [mood for mood, _ in sorted_moods[:3]]
            elif len(sorted_moods) >= 2:
                top_moods = [mood for mood, _ in sorted_moods[:2]]
            else:
                top_moods = [sorted_moods[0][0]]

        podcast_categories = []
        for mood in top_moods:
            categories = MOOD_TO_PODCAST_CATEGORY.get(mood, [])
            podcast_categories.extend(categories)

        podcast_categories = list(dict.fromkeys(podcast_categories))

        if not podcast_categories:
            podcast_categories = ['Technology']

        import pandas as pd
        df = pd.read_csv('top_podcasts.csv')

        recommended_podcasts = df[df['category'].isin(podcast_categories)].head(10)

        mood_str = ', '.join(top_moods).replace('-', ' ')
        formatted_recs = []
        for idx, row in recommended_podcasts.iterrows():
            category = row.get('category', '')
            reason = f"Matches your {mood_str} music taste"
            if category:
                reason += f" · {category}"
            formatted_recs.append({
                "id": f"p{idx}",
                "title": row['show.name'],
                "artist": row['show.publisher'],
                "album": "Podcast",
                "image": row.get('show.artwork'),
                "reason": reason
            })

        return jsonify({
            "recommendations": formatted_recs,
            "moods": top_moods,
            "categories": podcast_categories
        }), 200

    except Exception as e:
        print(f"Cross-modal recommendation error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("Starting Flask API on http://localhost:5000")
    print("CORS enabled for React frontend")
    app.run(debug=True, port=5000)
