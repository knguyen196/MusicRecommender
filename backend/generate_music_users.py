import pickle
import random
import pandas as pd
from pathlib import Path

DATASET_PATH = Path(__file__).parent / "song_dataset.pkl"
OUTPUT_PATH = Path(__file__).parent / "music_user_ratings.csv"

NUM_USERS = 150
MIN_RATINGS_PER_USER = 20
MAX_RATINGS_PER_USER = 80

def generate_synthetic_users():
    print("Loading song dataset")
    with open(DATASET_PATH, "rb") as f:
        dataset = pickle.load(f)
    
    print(f"Loaded {len(dataset)} songs")
    
    song_ids = [song["spotify_id"] for song in dataset]
    
    if len(song_ids) == 0:
        print("Error: No songs in dataset!")
        return
    
    print(f"Generating ratings for {NUM_USERS} users")
    
    rows = []
    
    for user_id in range(1, NUM_USERS + 1):
        num_ratings = random.randint(MIN_RATINGS_PER_USER, MAX_RATINGS_PER_USER)
        rated_songs = random.sample(song_ids, min(num_ratings, len(song_ids)))
        
        for song_id in rated_songs:
            rating = random.choice([1, 5])
            
            rows.append({
                "user_id": user_id,
                "song_id": song_id,
                "rating": rating
            })
        
        if user_id % 25 == 0:
            print(f"  Generated user {user_id}/{NUM_USERS}")
    
    df = pd.DataFrame(rows)
    df.to_csv(OUTPUT_PATH, index=False)
    
    print(f"\nGenerated {len(df)} ratings")
    print(f"Saved to {OUTPUT_PATH}")
    print(f"\nStats:")
    print(f"  Users: {NUM_USERS}")
    print(f"  Total ratings: {len(df)}")
    print(f"  Avg ratings per user: {len(df) / NUM_USERS:.1f}")
    print(f"  Like ratio: {(df['rating'] == 5).sum() / len(df) * 100:.1f}%")


if __name__ == "__main__":
    generate_synthetic_users()