import requests
import pandas as pd
import time

def fetch_itunes_podcasts():
    """Fetch real podcasts from iTunes RSS feeds"""
    
    # iTunes podcast chart URLs by genre
    GENRE_URLS = {
        'Technology': 'https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1318/json',
        'True Crime': 'https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1488/json',
        'Business': 'https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1321/json',
        'Comedy': 'https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1303/json',
        'Science': 'https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1315/json',
        'Health': 'https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1512/json',
        'Music': 'https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json',
        'News': 'https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1489/json',
        'Sports': 'https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1545/json',
        'Education': 'https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1304/json'
    }
    
    all_podcasts = []
    
    for category, url in GENRE_URLS.items():
        print(f"Fetching {category} podcasts...")
        
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            for entry in data['feed']['entry']:
                podcast = {
                    'show.name': entry['im:name']['label'],
                    'show.publisher': entry['im:artist']['label'],
                    'show.description': entry.get('summary', {}).get('label', '')[:300],
                    'category': category,
                    'show.artwork': entry['im:image'][-1]['label'] if 'im:image' in entry else '',
                    'itunes_id': entry['id']['attributes']['im:id']
                }
                all_podcasts.append(podcast)
            
            print(f"Fetched {len(data['feed']['entry'])} podcasts from {category}")
            time.sleep(0.5)
            
        except Exception as e:
            print(f"Error fetching {category}: {e}")
    
  
    df = pd.DataFrame(all_podcasts)
    df = df.drop_duplicates(subset=['show.name'], keep='first')
    

    df.to_csv('real_podcasts.csv', index=False)
    
    print(f"\n✓ SUCCESS!")
    print(f"✓ {len(df)} unique real podcasts saved to real_podcasts.csv")
    print(f"✓ File size: ~{len(df) * 200 / 1024:.1f} KB")
    print(f"\nBreakdown by category:")
    print(df['category'].value_counts().to_dict())
    
    return df

if __name__ == "__main__":
    df = fetch_itunes_podcasts()