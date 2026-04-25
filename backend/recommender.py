import pickle
import numpy as np
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import StandardScaler
from difflib import get_close_matches

DATASET_PATH = "song_dataset.pkl"


class MusicRecommender:
    def __init__(self):
        # Load dataset
        with open(DATASET_PATH, "rb") as f:
            self.dataset = pickle.load(f)

        # Extract metadata
        self.song_names = [song["name"] for song in self.dataset]
        self.artists = [song["artist"] for song in self.dataset]

        # Extract features
        features = [song["features"] for song in self.dataset]
        self.X = np.array(features)

        # Normalize features
        self.scaler = StandardScaler()
        self.X_scaled = self.scaler.fit_transform(self.X)

        # KNN model
        self.model = NearestNeighbors(
            n_neighbors=6,
            metric="cosine"
        )
        self.model.fit(self.X_scaled)

    def recommend(self, song_name):
        # Fuzzy match to find closest song name
        matches = get_close_matches(song_name, self.song_names, n=1, cutoff=0.6)

        if not matches:
            print(f"No close match found for '{song_name}'.")
            return []

        matched_name = matches[0]
        index = self.song_names.index(matched_name)

        print(f"Matched input to: {matched_name} by {self.artists[index]}")

        # Get vector for the matched song
        song_vector = self.X_scaled[index].reshape(1, -1)

        # Find nearest neighbors
        distances, indices = self.model.kneighbors(song_vector)

        recommendations = []

        for idx, dist in zip(indices[0][1:], distances[0][1:]):
            similarity = 1 - dist

            recommendations.append({
                "name": self.song_names[idx],
                "artist": self.artists[idx],
                "similarity": round(similarity, 3),
            })

        return recommendations


if __name__ == "__main__":
    rec = MusicRecommender()

    while True:
        user_input = input("\nEnter a song name (or 'quit' to exit): ").strip()

        if user_input.lower() == "quit":
            break

        results = rec.recommend(user_input)

        if not results:
            print("No recommendations found.")
            continue

        print("\nRecommended songs:")
        for r in results:
            print(f"- {r['name']} by {r['artist']} (similarity: {r['similarity']})")
