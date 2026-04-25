from recommender import MusicRecommender
from collaborative_filter import CollaborativeFiltering


class HybridRecommender:

    def __init__(self):

        self.content_model = MusicRecommender()

        self.cf_model = CollaborativeFiltering()

    def recommend(self, user_id, song_name, top_n=5):

        content_results = self.content_model.recommend(song_name)

        cf_results = self.cf_model.recommend(user_id, top_n=top_n)

        scores = {}

        # Content scores
        for r in content_results:

            scores[r["name"]] = 0.7 * r["similarity"]

        # Collaborative scores
        for song in cf_results:

            scores[song] = scores.get(song, 0) + 0.3

        ranked = sorted(scores.items(), key=lambda x: x[1], reverse=True)

        recommendations = []

        for song, score in ranked[:top_n]:

            recommendations.append({
                "name": song,
                "score": round(score, 3)
            })

        return recommendations


if __name__ == "__main__":

    hr = HybridRecommender()

    results = hr.recommend(
        user_id=1,
        song_name="Blinding Lights"
    )

    print("\nHybrid Recommendations:")
    for r in results:
        print("-", r["name"], "| score:", r["score"])