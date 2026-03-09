import React from 'react';

//Component for song cards, handles likes and dislikes

function SongCard({song, onRate, userRating}){
    const handleLike = () => {
        if (onRate){
            onRate(song, 'Like');
        }
    };

    const handleDislike = () => {
        if (onRate){
            onRate(song, 'Dislike');
        }
    };

    const getLike = () => {
        if (userRating === 'Like'){
            return 'heart-button active-like'
        }
        return 'heart-button'
    };

    const getDislike = () => {
        if (userRating === 'Dislike'){
            return 'heart-button active-dislike'
        }
        return 'heart-button'
    };

    return (
        <div className ="song-card">
            <img src ={song.image} alt ={song.album} className ="song-image"/>
            <div className="song-info">
                <h3 className="song-title">{song.title}</h3>
                <p className="song-artist">{song.artist}</p>
                <p className="song-album">{song.album}</p>
            </div>
            <div className = "rating-buttons">
                <button className = {getLike()}
                onClick ={handleLike}
                >
                ❤️  
                </button>
                <button className = {getDislike()}
                onClick = {handleDislike}
                >
                💔
                </button>
            </div>
        </div>
    );
}

export default SongCard;