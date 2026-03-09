# deezer_client.py

import requests

class DeezerClient:
    BASE_URL = "https://api.deezer.com"

    def find_preview(self, track_name, artist_name):
        query = f'{track_name} {artist_name}'

        response = requests.get(
            f"{self.BASE_URL}/search",
            params={"q": query, "limit": 5}
        )

        data = response.json()

        for track in data.get("data", []):
            # basic match check
            if artist_name.lower() in track["artist"]["name"].lower():
                return track.get("preview")

        return None