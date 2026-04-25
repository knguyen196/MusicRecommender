import pickle
import pandas as pd
import random

DATASET_PATH = "song_dataset.pkl"
OUTPUT_PATH = "user_history.csv"

NUM_USERS = 200
MAX_SONGS_PER_USER = 40

# Load songs
with open(DATASET_PATH, "rb") as f:
    dataset = pickle.load(f)

song_names = [song["name"] for song in dataset]

rows = []

for user_id in range(1, NUM_USERS + 1):

    num_songs = random.randint(10, MAX_SONGS_PER_USER)

    listened = random.sample(song_names, num_songs)

    for song in listened:

        play_count = random.randint(1, 20)

        rows.append({
            "user_id": user_id,
            "song_name": song,
            "play_count": play_count
        })

df = pd.DataFrame(rows)

df.to_csv(OUTPUT_PATH, index=False)

print("Generated user_history.csv")
print(df.head())