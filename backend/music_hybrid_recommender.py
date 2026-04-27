# Hybrid music recommender blends KNN audio similarity with collaborative filtering
import pickle
from pathlib import Path
from recommender import MusicRecommender
from music_collaborative_filter import MusicCollaborativeFilter

DATASET_PATH = Path(__file__).parent / "song_dataset.pkl"

class MusicHybridRecommender:
    def __init__(self):
        print("Initializing Music Hybrid Recommender")

        with open(DATASET_PATH, "rb") as f:
            self.dataset = pickle.load(f)

        self.song_lookup = {song["spotify_id"]: song for song in self.dataset}

        print("Loading content-based model...")
        self.content_model = MusicRecommender()

        print("Loading collaborative filtering model...")
        self.cf_model = MusicCollaborativeFilter()

        print("Hybrid recommender ready!\n")

    def recommend_by_names(self, liked_songs, disliked_songs=None, weight=50, top_n=10):
        if disliked_songs is None:
            disliked_songs = []

        print(f"\n{'='*60}")
        print(f"Generating hybrid recommendations (by name matching)")
        print(f"  Liked songs: {len(liked_songs)}")
        print(f"  Weight: {weight}% content-based, {100-weight}% collaborative")
        print(f"{'='*60}\n")

        content_weight = weight / 100
        collab_weight = 1 - content_weight

        matched_song_ids = []
        for liked in liked_songs:
            name = liked['name'].lower()
            artist = liked['artist'].lower()

            for song in self.dataset:
                if (song['name'].lower() == name and
                        song['artist'].lower() == artist):
                    matched_song_ids.append(song['spotify_id'])
                    print(f"  ✓ Matched: {song['name']} by {song['artist']}")
                    break

        matched_disliked_ids = []
        for disliked in disliked_songs:
            name = disliked['name'].lower()
            artist = disliked['artist'].lower()

            for song in self.dataset:
                if (song['name'].lower() == name and
                        song['artist'].lower() == artist):
                    matched_disliked_ids.append(song['spotify_id'])
                    print(f"  X Matched dislike: {song['name']} by {song['artist']}")
                    break

        if not matched_song_ids:
            print("  No songs matched in dataset!")
            return []

        total_songs = len(liked_songs) + len(disliked_songs)
        total_matched = len(matched_song_ids) + len(matched_disliked_ids)
        match_rate = total_matched / total_songs if total_songs > 0 else 0

        print(f"\n  Matched {total_matched}/{total_songs} songs in dataset ({match_rate*100:.1f}%)")

        if match_rate < 0.3:
            adjusted_weight = max(weight, 85)
            print(f"  Low match rate - adjusting weight to {adjusted_weight}% content-based")
            weight = adjusted_weight
        elif match_rate < 0.5:
            adjusted_weight = max(weight, 70)
            print(f"  Medium match rate - adjusting weight to {adjusted_weight}% content-based")
            weight = adjusted_weight

        print()

        return self.recommend(matched_song_ids, matched_disliked_ids, weight, top_n)

    def recommend(self, liked_song_ids, disliked_song_ids=None, weight=50, top_n=10):
        if disliked_song_ids is None:
            disliked_song_ids = []
        print(f"\n{'='*60}")
        print(f"Generating hybrid recommendations")
        print(f"  Liked songs: {len(liked_song_ids)}")
        print(f"  Weight: {weight}% content-based, {100-weight}% collaborative")
        print(f"{'='*60}\n")

        content_weight = weight / 100
        collab_weight = 1 - content_weight

        print("Running content-based filtering")
        content_scores = {}
        content_sources = {}

        for song_id in liked_song_ids:
            song_match = None
            for song in self.dataset:
                if song["spotify_id"] == song_id:
                    song_match = song
                    break

            if not song_match:
                print(f"Song {song_id} not in dataset, skipping")
                continue

            try:
                recs = self.content_model.recommend(song_match["name"])

                for rec in recs:
                    rec_song = None
                    for song in self.dataset:
                        if song["name"] == rec["name"] and song["artist"] == rec["artist"]:
                            rec_song = song
                            break

                    if rec_song:
                        spotify_id = rec_song["spotify_id"]
                        similarity = rec["similarity"]

                        if spotify_id not in content_scores:
                            content_scores[spotify_id] = 0
                            content_sources[spotify_id] = f"{song_match['artist']} – {song_match['name']}"
                        content_scores[spotify_id] += similarity

            except Exception as e:
                print(f"Error getting content-based recs: {e}")

        if content_scores:
            for song_id in content_scores:
                content_scores[song_id] /= len(liked_song_ids)

        print(f"Found {len(content_scores)} content-based recommendations")

        print("\nRunning collaborative filtering")
        collab_recs = self.cf_model.recommend(
            liked_song_ids=liked_song_ids,
            disliked_song_ids=disliked_song_ids,
            top_n=50
        )

        collab_scores = {rec["song_id"]: rec["score"] for rec in collab_recs}
        print(f"Found {len(collab_scores)} collaborative recommendations")

        if content_scores:
            max_content = max(content_scores.values())
            if max_content > 0:
                content_scores = {k: v/max_content for k, v in content_scores.items()}

        if collab_scores:
            max_collab = max(collab_scores.values())
            if max_collab > 0:
                collab_scores = {k: v/max_collab for k, v in collab_scores.items()}

        print(f"\nBlending results (weight={weight})...")
        hybrid_scores = {}

        for song_id, score in content_scores.items():
            hybrid_scores[song_id] = content_weight * score

        for song_id, score in collab_scores.items():
            if song_id in hybrid_scores:
                hybrid_scores[song_id] += collab_weight * score
            else:
                hybrid_scores[song_id] = collab_weight * score

        for song_id in liked_song_ids:
            if song_id in hybrid_scores:
                del hybrid_scores[song_id]

        ranked = sorted(hybrid_scores.items(), key=lambda x: x[1], reverse=True)

        recommendations = []

        for song_id, score in ranked[:top_n]:
            if song_id in self.song_lookup:
                song = self.song_lookup[song_id]
                in_content = song_id in content_scores
                in_collab = song_id in collab_scores
                source = content_sources.get(song_id, "your taste")
                if in_content and in_collab:
                    reason = f"Sounds like {source} · popular with similar fans"
                elif in_content:
                    reason = f"Sounds like {source}"
                else:
                    reason = "Popular among listeners with similar taste"
                recommendations.append({
                    "spotify_id": song_id,
                    "name": song["name"],
                    "artist": song["artist"],
                    "score": round(score, 3),
                    "album": song.get("album", "Unknown"),
                    "cover_url": song.get("cover_url"),
                    "reason": reason
                })

        print(f"Returning {len(recommendations)} hybrid recommendations\n")

        return recommendations
