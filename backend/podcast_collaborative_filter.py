# Collaborative filter for podcasts finds users with similar listening history
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity


class PodcastCollaborativeFilter:
    def __init__(self, history_path="podcast_user_history.csv"):
        try:
            self.history = pd.read_csv(history_path)
            self._build_user_item_matrix()
        except FileNotFoundError:
            self.history = pd.DataFrame(columns=["user_id", "podcast_name", "listen_count"])
            self.user_item_matrix = None
            print(f"Warning: {history_path} not found, collaborative filtering disabled")

    def _build_user_item_matrix(self):
        if self.history.empty:
            self.user_item_matrix = None
            return

        self.user_item_matrix = self.history.pivot_table(
            index='user_id',
            columns='podcast_name',
            values='listen_count',
            fill_value=0
        )

    def recommend(self, user_id, top_n=5):
        if self.history.empty or self.user_item_matrix is None:
            return []

        if user_id not in self.user_item_matrix.index:
            popular = (
                self.history.groupby("podcast_name")["listen_count"]
                .sum()
                .sort_values(ascending=False)
                .head(top_n)
                .index
                .tolist()
            )
            return popular

        user_row = self.user_item_matrix.loc[user_id].values.reshape(1, -1)
        similarities = cosine_similarity(user_row, self.user_item_matrix.values)[0]

        similar_user_indices = similarities.argsort()[::-1][1:21]
        similar_users = self.user_item_matrix.index[similar_user_indices]

        user_listened = set(self.user_item_matrix.columns[self.user_item_matrix.loc[user_id] > 0])

        recommendations = {}
        for similar_user in similar_users:
            similar_user_podcasts = self.user_item_matrix.loc[similar_user]
            for podcast, count in similar_user_podcasts.items():
                if podcast not in user_listened and count > 0:
                    recommendations[podcast] = recommendations.get(podcast, 0) + count

        sorted_recs = sorted(recommendations.items(), key=lambda x: x[1], reverse=True)
        return [podcast for podcast, _ in sorted_recs[:top_n]]

    def recommend_from_podcasts(self, liked_podcast_names, top_n=5):
        if self.history.empty or self.user_item_matrix is None:
            return []

        liked_lower = {name.lower() for name in liked_podcast_names}

        matching_cols = [
            col for col in self.user_item_matrix.columns
            if any(liked in col.lower() or col.lower() in liked for liked in liked_lower)
        ]

        if not matching_cols:
            return (
                self.history.groupby("podcast_name")["listen_count"]
                .sum()
                .sort_values(ascending=False)
                .head(top_n)
                .index
                .tolist()
            )

        relevant_user_ids = set()
        for col in matching_cols:
            listeners = self.user_item_matrix[self.user_item_matrix[col] > 0].index
            relevant_user_ids.update(listeners)

        recommendations = {}
        for uid in relevant_user_ids:
            for podcast, count in self.user_item_matrix.loc[uid].items():
                if count > 0 and podcast.lower() not in liked_lower:
                    recommendations[podcast] = recommendations.get(podcast, 0) + count

        sorted_recs = sorted(recommendations.items(), key=lambda x: x[1], reverse=True)
        return [podcast for podcast, _ in sorted_recs[:top_n]]
