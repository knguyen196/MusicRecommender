from podcast_recommender import PodcastRecommender
from podcast_collaborative_filter import PodcastCollaborativeFiltering
from podcast_data import load_podcast_data


class PodcastHybridRecommender:

    def __init__(self):
        df = load_podcast_data("top_podcasts.csv")

        self.content_model = PodcastRecommender(df)
        self.cf_model = PodcastCollaborativeFiltering()

    def recommend(self, user_id, podcast_name, top_n=5):

        content_results = self.content_model.recommend(podcast_name, top_n=top_n)
        cf_results = self.cf_model.recommend(user_id, top_n=top_n)

        scores = {}

        # Content scores
        for r in content_results:
            scores[r["name"]] = 0.7 * r["similarity"]

        # Collaborative scores
        for podcast in cf_results:
            scores[podcast] = scores.get(podcast, 0) + 0.3

        ranked = sorted(scores.items(), key=lambda x: x[1], reverse=True)

        recommendations = []

        for podcast, score in ranked[:top_n]:
            recommendations.append({
                "name": podcast,
                "score": round(score, 3)
            })

        return recommendations


if __name__ == "__main__":

    hr = PodcastHybridRecommender()

    results = hr.recommend(
        user_id=1,
        podcast_name="Joe Rogan"
    )

    print("\nHybrid Podcast Recommendations:")
    for r in results:
        print("-", r["name"], "| score:", r["score"])