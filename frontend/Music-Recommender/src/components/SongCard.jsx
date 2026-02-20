import React from 'react';
import './SongCard.css';

function SongCard({song, onRate}){
    const handleRateClick = () => {
        if (onRate){
            onRate(song);
        }
    };

    return (
        <div className ="song-card">
            <img src ={song.image} alt ={song.album} className ="song-image"/>
            <div className="song-info">
                <h3 className="song-title">{song.title}</h3>
                <p className="song-artist">{song.artist}</p>
                <p className="song-album">{song.album}</p>
            </div>
            <button className="rate-button" onClick={handleRateClick}>Rate</button>
        </div>
    );
}

export default SongCard;