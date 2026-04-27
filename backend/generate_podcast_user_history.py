import pandas as pd
import random

DATASET_PATH = "top_podcasts.csv"
OUTPUT_PATH = "podcast_user_history.csv"

NUM_USERS = 200
MAX_PODCASTS_PER_USER = 40


df = pd.read_csv(
    DATASET_PATH,
    low_memory=False,
    usecols=["show.name", "category"]
)

df = df.rename(columns={"show.name": "podcast_name"})
df["category"] = pd.to_numeric(df["category"], errors="coerce").fillna(999999)

# unique podcasts
unique_podcasts = (
    df.sort_values("category")
      .drop_duplicates(subset=["podcast_name"])
      .reset_index(drop=True)
)

podcast_names = unique_podcasts["podcast_name"].astype(str).tolist()

rows = []

for user_id in range(1, NUM_USERS + 1):

    num_podcasts = random.randint(10, min(MAX_PODCASTS_PER_USER, len(podcast_names)))
    listened = random.sample(podcast_names, num_podcasts)

    for podcast in listened:
        listen_count = random.randint(0, 5)

        rows.append({
            "user_id": user_id,
            "podcast_name": podcast,
            "listen_count": listen_count
        })

df = pd.DataFrame(rows)
df.to_csv(OUTPUT_PATH, index=False)

print("Generated podcast_user_history.csv")
print(df.head())
