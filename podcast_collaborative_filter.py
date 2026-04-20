import pandas as pd


class PodcastCollaborativeFiltering:
    def __init__(self, history_path="podcast_user_history.csv"):
        self.history = pd.read_csv(history_path)

    def recommend(self, user_id, top_n=5):
        user_history = self.history[self.history["user_id"] == user_id]

        if user_history.empty:
            # fallback: most popular
            popular = (
                self.history.groupby("podcast_name")["listen_count"]
                .sum()
                .sort_values(ascending=False)
                .head(top_n)
                .index
                .tolist()
            )
            return popular

        listened = set(user_history["podcast_name"])

        candidates = (
            self.history[~self.history["podcast_name"].isin(listened)]
            .groupby("podcast_name")["listen_count"]
            .sum()
            .sort_values(ascending=False)
        )

        return candidates.head(top_n).index.tolist()