import pandas as pd


class PodcastCollaborativeFiltering:
    def __init__(self, history_path="podcast_user_history.csv"):
        try:
            self.history = pd.read_csv(history_path)
        except FileNotFoundError:
            self.history = pd.DataFrame(columns=["user_id", "podcast_name", "listen_count"])
            print(f"Warning: {history_path} not found, collaborative filtering disabled")

    def recommend(self, user_id, top_n=5):
        if self.history.empty:
            return []
        
        user_history = self.history[self.history["user_id"] == user_id]

        if user_history.empty:
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