import { useState } from 'react'
import SongCard from './SongCard'

export function AlbumCollapseCard({ albumName, songs, onRate, ratings }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const coverImage = songs[0]?.image
  const trackCount = songs.length

  return (
    <div className={`album-collapse-card ${isExpanded ? 'album-collapse-card-expanded' : ''}`}>
      <button
        type="button"
        className="album-collapse-card-header"
        onClick={() => setIsExpanded(prev => !prev)}
        aria-expanded={isExpanded}
      >
        <div className="album-collapse-card-thumb">
          {coverImage && <img src={coverImage} alt="" />}
        </div>
        <div className="album-collapse-card-info">
          <span className="album-collapse-card-title">{albumName}</span>
          <span className="album-collapse-card-count">
            {trackCount} {trackCount === 1 ? 'track' : 'tracks'}
          </span>
        </div>
        <span className="album-collapse-card-chevron" aria-hidden>
          {isExpanded ? '▼' : '▶'}
        </span>
      </button>
      <div className="album-collapse-card-body">
        <div className="album-collapse-card-songs">
          {songs.map(song => (
            <SongCard
              key={song.id}
              song={song}
              onRate={onRate}
              userRating={ratings[song.id]?.rating}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
