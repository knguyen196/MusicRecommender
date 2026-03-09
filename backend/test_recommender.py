from recommender import MusicRecommender

recommender = MusicRecommender()

results = recommender.recommend("The Hills")

print("\nRecommended Songs:\n")

for song in results:
    print(
        f"{song['name']} - {song['artist']} "
        f"(Similarity: {song['similarity']}) "
    )