import os
import requests
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("LASTFM_API_KEY")
OUTPUT = Path("backend/artist_list.txt")

LIMIT = 1000  # Last.fm max per request


def fetch_top_artists(limit=1000):
    if not API_KEY:
        raise RuntimeError("Missing LASTFM_API_KEY in .env")

    url = "http://ws.audioscrobbler.com/2.0/"
    params = {
        "method": "chart.gettopartists",
        "api_key": API_KEY,
        "format": "json",
        "limit": limit
    }

    response = requests.get(url, params=params)
    data = response.json()

    if "error" in data:
        raise RuntimeError(f"Last.fm API error: {data['message']}")

    artists = []
    for item in data.get("artists", {}).get("artist", []):
        name = item.get("name")
        if name:
            artists.append(name)

    return artists


def main():
    print("Fetching top artists from Last.fm...")

    artists = fetch_top_artists(LIMIT)

    artists = sorted(set(a.strip() for a in artists if a.strip()))
    print(f"Found {len(artists)} unique artists")

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)

    with open(OUTPUT, "w", encoding="utf-8") as f:
        for artist in artists:
            f.write(artist + "\n")

    print(f"Saved {len(artists)} artists to {OUTPUT}")


if __name__ == "__main__":
    main()