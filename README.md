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

### One-command install (recommended)

From the repo root:

```bash
chmod +x scripts/install.sh
./scripts/install.sh
```

This will:
- Create a backend virtual environment at `backend/.venv`
- Install backend dependencies from `backend/requirements.txt`
- Install frontend dependencies in `frontend/Music-Recommender`

### Backend Setup
 
1. Navigate to backend:
```bash
cd backend
```
 
2. Install dependencies:
```bash
pip install -r requirements.txt
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

## UI Pages (Frontend)

The frontend is a single-page React app. The `Navbar` switches between pages by updating `activeSection` in `App.jsx`. Your likes/dislikes are stored in the browser (`localStorage` key: `songRatings`) and are shared across all pages.

### Search
- **Component**: `frontend/Music-Recommender/src/components/SearchSection.jsx`
- **What it does**: Search **music and podcasts at the same time**, then filter results with tabs (**All / Music / Podcasts**).
- **Key interactions**:
  - Enter a query and press Enter / click Search.
  - Rate any result with **Like** / **Dislike** (updates your global ratings).
- **Backend calls**:
  - `POST /api/search` (music)
  - `POST /api/podcasts/search` (podcasts)

### Recommendations
- **Component**: `frontend/Music-Recommender/src/components/RecommendationsView.jsx`
- **What it does**: Generates personalized recommendations from your ratings.
- **Key interactions**:
  - Switch tabs: **Music** vs **Podcasts**
  - Adjust the **weight slider** (controls the blend between content-based vs collaborative)
  - For podcasts: click **“Get Podcast Recommendations Based on My Music Taste”** for cross-modal discovery
- **Backend calls**:
  - `POST /api/recommend` (music recommendations)
  - `POST /api/podcasts/recommend` (podcast recommendations)
  - `POST /api/podcasts/recommend/from-music` (music → podcast cross-modal)

### Browse
- **Component**: `frontend/Music-Recommender/src/components/BrowseSection.jsx`
- **What it does**: Explore curated sets of items without searching.
- **Key interactions**:
  - **Music moods** (6 categories): High Energy, Chill, Fast Tempo, Slow Tempo, Bright, Dark
  - **Podcast categories** (10 categories): Technology, True Crime, Science, Business, Health, Comedy, History, News, Sports, Education
  - Select a category to load items; use **Back to Categories** to return
- **Backend calls**:
  - `GET /api/browse/mood/<mood>` (music by mood)
  - `GET /api/podcasts/browse/<category>` (podcasts by category)

### My Ratings
- **Component**: `frontend/Music-Recommender/src/components/RatedSongs.jsx`
- **What it does**: Shows everything you’ve rated, split into **Liked** and **Disliked** lists.
- **Key interactions**:
  - Update a rating (toggle Like/Dislike) or remove it (by toggling off)
- **Data source**: Uses the app’s saved `ratings` state (no backend calls).

### About
- **Component**: `frontend/Music-Recommender/src/components/AboutSection.jsx`
- **What it does**: Explains the hybrid recommender approach and the music → podcast discovery idea in plain language.

### Navigation
- **Component**: `frontend/Music-Recommender/src/components/Navbar.jsx`
- **Tabs**: Search, Recommendations, Browse, My Ratings, About

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
