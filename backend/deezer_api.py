# deezer_api.py

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
    
    def search_tracks(self, query, limit=10):
        """
        Search for tracks on Deezer
        Returns list of tracks with spotify-compatible format
        """
        try:
            response = requests.get(
                f"{self.BASE_URL}/search",
                params={"q": query, "limit": limit}
            )
            
            if response.status_code != 200:
                print(f"Deezer API error: HTTP {response.status_code}")
                return []
            
            data = response.json()
            
            results = []
            for track in data.get("data", []):
                results.append({
                    "spotify_id": str(track["id"]),
                    "name": track["title"],
                    "artist": track["artist"]["name"],
                    "album": track["album"]["title"],
                    "cover_url": track["album"]["cover_medium"],
                    "preview_url": track.get("preview")
                })
            
            return results
            
        except Exception as e:
            print(f"Deezer search error: {e}")
            return []