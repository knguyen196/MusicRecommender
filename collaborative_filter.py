import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity


class CollaborativeFiltering:

    def __init__(self, user_history_path="user_history.csv"):

        self.df = pd.read_csv(user_history_path)

        # Create user-song matrix
        self.matrix = self.df.pivot_table(
            index="user_id",
            columns="song_name",
            values="play_count",
            fill_value=0
        )

        # Compute similarity between users
        self.similarity = cosine_similarity(self.matrix)

    def recommend(self, user_id, top_n=5):

        if user_id not in self.matrix.index:
            print("User not found")
            return []

        user_index = self.matrix.index.get_loc(user_id)

        similarity_scores = self.similarity[user_index]

        # Get similar users
        similar_users = similarity_scores.argsort()[::-1][1:6]

        # Aggregate song scores
        song_scores = self.matrix.iloc[similar_users].sum(axis=0)

        listened = self.matrix.iloc[user_index]

        recommendations = song_scores[listened == 0]

        top_songs = recommendations.sort_values(ascending=False).head(top_n)

        results = []

        for song in top_songs.index:
            results.append(song)

        return results


if __name__ == "__main__":

    cf = CollaborativeFiltering()

    recs = cf.recommend(user_id=1)

    print("\nCollaborative Filtering Recommendations:")
    for r in recs:
        print("-", r)