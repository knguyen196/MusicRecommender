import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from pathlib import Path

class MusicCollaborativeFilter:
    def __init__(self, ratings_path="music_user_ratings.csv"):
        ratings_file = Path(__file__).parent / ratings_path
        
        if not ratings_file.exists():
            raise FileNotFoundError(
                f"Ratings file not found: {ratings_file}\n"
                "Run generate_music_users.py first to create synthetic users"
            )
        
        self.ratings = pd.read_csv(ratings_file)
        print(f"Loaded {len(self.ratings)} ratings from {len(self.ratings['user_id'].unique())} users")
        
        self.user_item_matrix = self.ratings.pivot_table(
            index='user_id',
            columns='song_id',
            values='rating',
            fill_value=0
        )
        
        print(f"User-item matrix: {self.user_item_matrix.shape[0]} users × {self.user_item_matrix.shape[1]} songs")
    
    def recommend(self, liked_song_ids, disliked_song_ids=None, top_n=10):
        if disliked_song_ids is None:
            disliked_song_ids = []
        
        current_user_ratings = pd.Series(0, index=self.user_item_matrix.columns)
        
        # Set likes to 5
        for song_id in liked_song_ids:
            if song_id in current_user_ratings.index:
                current_user_ratings[song_id] = 5
        
        # Set dislikes to 1
        for song_id in disliked_song_ids:
            if song_id in current_user_ratings.index:
                current_user_ratings[song_id] = 1
        
        total_ratings = len(liked_song_ids) + len(disliked_song_ids)
        overlap_count = ((current_user_ratings > 0).sum())
        
        if overlap_count == 0:
            print("Warning: No rated songs found in collaborative dataset")
            return []
        
        print(f"Collaborative filtering: {overlap_count}/{total_ratings} rated songs in dataset")
        
        current_vector = current_user_ratings.values.reshape(1, -1)
        similarities = cosine_similarity(current_vector, self.user_item_matrix.values)[0]
        
        similar_user_indices = np.argsort(similarities)[::-1]
        similar_users = []
        
        for idx in similar_user_indices:
            if similarities[idx] > 0:
                similar_users.append({
                    'user_id': self.user_item_matrix.index[idx],
                    'similarity': similarities[idx]
                })
            if len(similar_users) >= 20:
                break
        
        if not similar_users:
            print("No similar users found")
            return []
        
        print(f"Found {len(similar_users)} similar users (top similarity: {similar_users[0]['similarity']:.3f})")
        
        song_scores = {}
        
        for user_data in similar_users:
            user_id = user_data['user_id']
            similarity = user_data['similarity']
            
            user_ratings = self.user_item_matrix.loc[user_id]
            liked_songs = user_ratings[user_ratings >= 4].index.tolist()
            
            for song_id in liked_songs:
                if song_id in liked_song_ids or song_id in disliked_song_ids:
                    continue
                
                if song_id not in song_scores:
                    song_scores[song_id] = 0
                song_scores[song_id] += similarity
        
        ranked_songs = sorted(song_scores.items(), key=lambda x: x[1], reverse=True)
        
        recommendations = []
        for song_id, score in ranked_songs[:top_n]:
            recommendations.append({
                "song_id": song_id,
                "score": float(score)
            })
        
        print(f"Collaborative filtering returning {len(recommendations)} recommendations")
        
        return recommendations