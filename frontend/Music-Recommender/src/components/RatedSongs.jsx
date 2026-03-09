import React from 'react'
import {motion} from 'framer-motion'
import SongCard from './SongCard'

export function RatedSongs({ratings, onRate}) {
    const ratedSongsArray = Object.values(ratings)
    const likedSongs = ratedSongsArray.filter(item => item.rating === 'Like')
    const dislikedSongs = ratedSongsArray.filter(item => item.rating === 'Dislike')

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="rated-songs-container"
        >
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rated-songs-title"
            >
                Your Rated Songs
            </motion.h1>
        
        <div className="rated-section">
                <h2 className="rated-section-title">Liked Songs ({likedSongs.length})</h2>
                {likedSongs.length > 0 ? (
                    <div className="results-grid">
                        {likedSongs.map(item => (
                            <SongCard 
                                key={item.song.id}
                                song={item.song}
                                onRate={onRate}
                                userRating={item.rating}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="empty-message">No liked songs yet. Start rating!</p>
                )}
            </div>

            <div className="rated-section">
                <h2 className="rated-section-title">Disliked Songs ({dislikedSongs.length})</h2>
                {dislikedSongs.length > 0 ? (
                    <div className="results-grid">
                        {dislikedSongs.map(item => (
                            <SongCard 
                                key={item.song.id}
                                song={item.song}
                                onRate={onRate}
                                userRating={item.rating}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="empty-message">No disliked songs yet.</p>
                )}
            </div>
        </motion.div>
    )
}