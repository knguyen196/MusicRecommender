## Music Recommender System

A personalized music and podcast recommendation system using hybrid filtering techniques. Combines content-based filtering (audio feature analysis) with collaborative filtering (user behavior patterns).
 
## Features
 
- **Hybrid Recommendations** - Adjustable weight slider (0-100%) to blend content-based and collaborative filtering
- **Cross-Modal Discovery** - Get podcast recommendations based on music taste
- **Browse by Mood** - Explore music through 6 audio-derived categories
- **Unified Search** - Search both music and podcasts with filter tabs
- **Audio Previews** - 30-second preview clips via Deezer API

## Tech Stack
 
**Frontend:**
- React 18 + Vite
- Framer Motion
- Lucide React

**Backend:**
- Python 3.11+
- Flask + Flask-CORS
- scikit-learn (KNN, TF-IDF)
- librosa (audio features)
- pandas, numpy
**APIs:**
- Deezer API (previews, artwork)
- Spotify API (dataset collection)
- iTunes RSS (podcasts)
## Installation
 
### Prerequisites
- Node.js 16+
- Python 3.11+
### Backend Setup
 
1. Navigate to backend:
```bash
cd backend
```
 
2. Install dependencies:
```bash
pip install flask flask-cors scikit-learn pandas numpy requests
```
 
3. Start the server:
```bash
python app.py
```
 

### Frontend Setup
 
1. Navigate to frontend:
```bash
cd frontend/Music-Recommender
```
 
2. Install dependencies:
```bash
npm install
```
 
3. Start dev server:
```bash
npm run dev
```
 
Frontend runs on `http://localhost:5173`
 
## Usage
1. Open `http://localhost:5173` in your browser
2. Search for songs and rate them (like/dislike)
3. Go to Recommendations page
4. Adjust the weight slider to tune recommendations
5. Try cross-modal discovery (music → podcasts)

## Dataset
- **4,658 songs** from Spotify API
- **818 podcasts** from iTunes RSS
- **170 music users** + **100 podcast users** (synthetic, patterned)

## API Endpoints
 
**Music:**
- `POST /api/search` - Search songs
- `POST /api/recommend` - Get recommendations
- `GET /api/browse/mood/<mood>` - Browse by mood
**Podcasts:**
- `POST /api/podcasts/search` - Search podcasts
- `POST /api/podcasts/recommend` - Get recommendations
- `GET /api/podcasts/browse` - Browse categories
- `POST /api/podcasts/recommend/from-music` - Cross-modal
