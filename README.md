# MusicRecommender
491 Project

## How to Run

### Frontend (React + Vite)

1. Navigate to the frontend directory:
   ```bash
   cd frontend/Music-Recommender
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
   
   This will install all required packages including:
   - React & React DOM
   - Vite (build tool)
   - Framer Motion (animations)
   - Lucide React (icons)
   - Tailwind CSS (styling)

3. Start the development server:
   ```bash
   npm run dev
   ```

4. The app will be available at `http://localhost:5173` (or the port shown in the terminal)

### Backend (Python)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install required Python packages:
   ```bash
   pip install librosa numpy
   ```

3. Run the feature extraction script:
   ```bash
   python feature_extract.py
   ```

   This will extract audio features from `song.mp3` and print the feature values.
