# Content-based podcast recommender uses TF-IDF on show descriptions to find similar podcasts
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel


class PodcastRecommender:
    def __init__(self, df: pd.DataFrame):
        self.df = df.copy().reset_index(drop=True)

        self.podcast_names = self.df["show.name"].astype(str).tolist()


        self.df["show.description"] = self.df["show.description"].fillna("")

        self.vectorizer = TfidfVectorizer(
            stop_words="english",
            max_features=20000
        )


        self.tfidf_matrix = self.vectorizer.fit_transform(self.df["show.description"])

    def recommend(self, podcast_name: str, top_n: int = 5):
        matches = [
            name for name in self.podcast_names
            if podcast_name.lower() in name.lower()
        ]

        if not matches:
            print(f"No match found for '{podcast_name}'")
            return []

        matched_name = matches[0]
        idx = self.podcast_names.index(matched_name)

        cosine_scores = linear_kernel(
            self.tfidf_matrix[idx:idx+1],
            self.tfidf_matrix
        ).flatten()

        similar_indices = cosine_scores.argsort()[::-1]

        results = []
        seen = set()

        for i in similar_indices:
            if i == idx:
                continue

            name = self.df.iloc[i]["show.name"]

            if name in seen:
                continue

            seen.add(name)

            results.append({
                "name": name,
                "score": float(cosine_scores[i])
            })

            if len(results) >= top_n:
                break

        return results