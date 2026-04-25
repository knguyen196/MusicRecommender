import React from "react";

export default function SongCard({ song, onRate, userRating }) {
  const handleRate = (rating) => {
    // If clicking the same rating again, clear it (toggle functionality)
    if (userRating === rating) {
      onRate(song.id, null, song);
    } else {
      onRate(song.id, rating, song);
    }
  };

  return (
    <div className="song-card">
      {song.image ? (
        <img
          src={song.image}
          alt={song.title || song.name}
          className="song-image"
        />
      ) : (
        <div
          className="song-image"
          style={{
            backgroundColor: "#ddd",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#666",
            fontSize: "0.8rem",
          }}
        >
          No Image
        </div>
      )}

      <div className="song-info">
        <p className="song-title">{song.title || song.name}</p>
        <p className="song-artist">{song.artist}</p>
        {song.album && <p className="song-album">{song.album}</p>}
      </div>

      {song.preview_url && (
        <audio controls style={{ width: "100%", marginTop: "8px" }}>
          <source src={song.preview_url} type="audio/mpeg" />
        </audio>
      )}

      <div className="rating-buttons">
        <button
          className={`heart-button ${userRating === "Like" ? "active-like" : ""}`}
          onClick={() => handleRate("Like")}
          title={userRating === "Like" ? "Click to unlike" : "Like"}
        >
          ❤️
        </button>
        <button
          className={`heart-button ${userRating === "Dislike" ? "active-dislike" : ""}`}
          onClick={() => handleRate("Dislike")}
          title={
            userRating === "Dislike" ? "Click to remove dislike" : "Dislike"
          }
        >
          💔
        </button>
      </div>
    </div>
  );
}
