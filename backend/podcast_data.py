import pandas as pd


def load_podcast_data(csv_path: str) -> pd.DataFrame:
    df = pd.read_csv(csv_path, low_memory=False)

    df = df.drop_duplicates().fillna("")

    # Rename columns
    df = df.rename(columns={
        "show.name": "podcast_name",
        "episodeName": "episode_title",
        "show.publisher": "publisher",
        "region": "country",
        "languages": "language"
    })

    # Ensure rank is numeric
    df["rank"] = pd.to_numeric(df["rank"], errors="coerce").fillna(999999)

    #Sort by rank (best episodes first)
    df = df.sort_values("rank", ascending=True)

    #Keep ONE row per podcast
    df = df.drop_duplicates(subset=["podcast_name"], keep="first")

    #Reduce dataset size (optional but recommended)
    df = df.head(5000).reset_index(drop=True)

    #Trim long descriptions (speed boost)
    df["description"] = df["description"].astype(str).str.slice(0, 400)

    #Build features
    df["combined_features"] = (
        df["podcast_name"].astype(str) + " " +
        df["publisher"].astype(str) + " " +
        df["description"].astype(str)
    ).str.strip()

    return df
