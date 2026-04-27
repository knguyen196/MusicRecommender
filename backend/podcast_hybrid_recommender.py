# Hybrid podcast recommender blends TF-IDF description similarity with collaborative filtering
from podcast_recommender import PodcastRecommender
from podcast_collaborative_filter import PodcastCollaborativeFilter
from podcast_data import load_podcast_data


class PodcastHybridRecommender:

    def __init__(self):
        print("Initializing Podcast Hybrid Recommender")
        df = load_podcast_data("top_podcasts.csv")

        self.content_model = PodcastRecommender(df)
        
        try:
            self.cf_model = PodcastCollaborativeFilter()
            self.has_collab = True
            print("Podcast collaborative filtering enabled")
        except:
            self.cf_model = None
            self.has_collab = False
            print("Warning: Collaborative filtering disabled")

    def recommend(self, podcast_name, liked_podcast_names=None, weight=50, top_n=5):
        content_weight = weight / 100
        cf_weight = 1.0 - content_weight

        content_results = self.content_model.recommend(podcast_name, top_n=top_n*2)

        if not self.has_collab or self.cf_model.history.empty:
            return [
                {"name": r["name"], "score": r["score"], "reason": f'Similar to "{podcast_name}"'}
                for r in content_results[:top_n]
            ]

        seeds = liked_podcast_names if liked_podcast_names else [podcast_name]
        cf_results = self.cf_model.recommend_from_podcasts(seeds, top_n=top_n*2)

        scores = {}
        content_names = {r["name"] for r in content_results}
        cf_names = set(cf_results)

        if content_results:
            max_content_score = max(r["score"] for r in content_results)
            for r in content_results:
                normalized_score = r["score"] / max_content_score if max_content_score > 0 else 0
                scores[r["name"]] = content_weight * normalized_score

        for idx, podcast in enumerate(cf_results):
            rank_score = 1.0 - (idx / len(cf_results))
            if podcast in scores:
                scores[podcast] += cf_weight * rank_score
            else:
                scores[podcast] = cf_weight * rank_score

        ranked = sorted(scores.items(), key=lambda x: x[1], reverse=True)

        result = []
        for podcast, score in ranked[:top_n]:
            in_content = podcast in content_names
            in_cf = podcast in cf_names
            if in_content and in_cf:
                reason = f'Similar to "{podcast_name}" · popular with similar listeners'
            elif in_content:
                reason = f'Similar to "{podcast_name}"'
            else:
                reason = "Popular among listeners with similar tastes"
            result.append({"name": podcast, "score": round(score, 3), "reason": reason})

        return result