from spotify_api import SpotifyClient
from deezer_api import DeezerClient
from feature_extract import extract_features
from dataset_manager import save_dataset, load_dataset

import requests
import time
from pathlib import Path

PREVIEW_DIR = Path(__file__).parent / "previews"
spotify = SpotifyClient()
deezer = DeezerClient()

PROGRESS_FILE = "backend/last_index.txt"

def safe_download(url, retries=3, delay=1):
    for attempt in range(retries):
        try:
            return requests.get(url, timeout=10)
        except requests.exceptions.SSLError:
            print(f"SSL error on attempt {attempt+1}, retrying...")
            time.sleep(delay)
        except requests.exceptions.RequestException as e:
            print(f"Network error: {e}, retrying...")
            time.sleep(delay)
    return None
def load_progress():
    try:
        with open(PROGRESS_FILE, "r") as f:
            return int(f.read().strip())
    except:
        return 0

def save_progress(index):
    with open(PROGRESS_FILE, "w") as f:
        f.write(str(index))

def load_artist_list(path="backend/artist_list.txt"):
    with open(path, "r", encoding="utf-8") as f:
        return [line.strip() for line in f if line.strip()]


dataset = load_dataset()
artists = load_artist_list()

start_index = load_progress()

for i, artist_name in enumerate(artists):
    if i < start_index:
        continue  # resume from last saved index

    print(f"\n=== Searching tracks for: {artist_name} (#{i}) ===")

    spotify_tracks = spotify.search_tracks(artist_name, limit=5)

    for track in spotify_tracks:

        print("Name:", track["name"])
        print("Artist:", track["artist"])

        if any(d["spotify_id"] == track["spotify_id"] for d in dataset):
            print("Song already analyzed, skipping")
            print("=" * 25)
            continue

        preview_url = deezer.find_preview(track["name"], track["artist"])

        if preview_url is None:
            print("No preview available")
            print("=" * 25)
            continue

        preview_path = PREVIEW_DIR / f"preview_{track['spotify_id']}.mp3"

        r = safe_download(preview_url)

        if r is None:
            print("Failed to download preview after retries, skipping track")
            print("=" * 25)
            continue

        with open(preview_path, "wb") as f:
            f.write(r.content)

        audio_features = extract_features(preview_path)
        preview_path.unlink()

        track_entry = {
            "spotify_id": track["spotify_id"],
            "name": track["name"],
            "artist": track["artist"],
            "features": audio_features.tolist()
        }

        dataset.append(track_entry)

        print("Features extracted")
        print("=" * 25)

    save_dataset(dataset)
    save_progress(i + 1)
    print(f"Progress saved after artist: {artist_name}")

print("Final dataset size:", len(dataset))
