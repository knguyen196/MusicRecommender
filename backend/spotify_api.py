import os
import time
import base64
import requests
from dotenv import load_dotenv

load_dotenv()
CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")


class SpotifyClient:
    def __init__(self):
        self.access_token = None
        self.expires_at = 0


    def _get_access_token(self):
        if self.access_token and time.time() < self.expires_at:
            return self.access_token

        auth_string = f"{CLIENT_ID}:{CLIENT_SECRET}"
        auth_base64 = base64.b64encode(auth_string.encode()).decode()

        response = requests.post(
            "https://accounts.spotify.com/api/token",
            headers={
                "Authorization": f"Basic {auth_base64}",
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data={"grant_type": "client_credentials"}
        )

        try:
            token_data = response.json()
        except ValueError:
            print("Failed to decode Spotify token response, retrying...")
            time.sleep(1)
            return self._get_access_token()

        self.access_token = token_data.get("access_token")
        self.expires_at = time.time() + token_data.get("expires_in", 3600)

        return self.access_token

    def search_tracks(self, query, limit=10):
        token = self._get_access_token()

        for attempt in range(5):
            time.sleep(0.25)  

            response = requests.get(
                "https://api.spotify.com/v1/search",
                headers={"Authorization": f"Bearer {token}"},
                params={"q": query, "type": "track", "limit": limit}
            )

            if response.status_code == 429:
                retry_after = int(response.headers.get("Retry-After", 1))
                print(f"Rate limited for '{query}', waiting {retry_after} seconds...")
                time.sleep(retry_after)
                continue

            if response.status_code >= 500:
                wait = 2 ** attempt
                print(f"Spotify server error {response.status_code} for '{query}', retrying in {wait}s...")
                time.sleep(wait)
                continue


            try:
                data = response.json()
            except ValueError:
                wait = 1 + attempt
                print(f"Invalid JSON for '{query}', retrying in {wait}s...")
                time.sleep(wait)
                continue


            if "error" in data:
                print(f"Spotify API error for '{query}': {data['error']}")
                return []

            break

        else:
            print(f"Failed to fetch Spotify data for '{query}' after retries, skipping.")
            return []


        results = []
        for track in data.get("tracks", {}).get("items", []):
            results.append({
                "spotify_id": track["id"],
                "name": track["name"],
                "artist": track["artists"][0]["name"],
                "album": track["album"]["name"],
                "cover_url": track["album"]["images"][0]["url"]
                if track["album"]["images"] else None,
            })

        return results

    def get_audio_features(self, track_id):
        token = self._get_access_token()

        response = requests.get(
            f"https://api.spotify.com/v1/audio-features/{track_id}",
            headers={"Authorization": f"Bearer {token}"}
        )

        try:
            return response.json()
        except ValueError:
            print(f"Invalid audio feature response for track {track_id}")
            return {}
