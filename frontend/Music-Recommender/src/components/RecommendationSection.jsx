import { useState } from 'react'
import { motion } from 'framer-motion'
import { SearchBar } from './SearchBar'
import SongCard from './SongCard'
import { AlbumCollapseCard } from './AlbumCollapseCard'
import ballads1 from './ui/dummyimages/ballads1.png'
import nectar from './ui/dummyimages/nectar.png'
import smithereens from './ui/dummyimages/smithereens.jpg'
import pissinthewind from './ui/dummyimages/pissinthewind.jpg'

// Dummy data (popularity 1–100 for "Most popular" sort)
const DUMMY_SONGS = [
  { id: 1, title: "Glimpse of Us", artist: "Joji", album: "Smithereens", image: smithereens, popularity: 92 },
  { id: 2, title: "SLOW DANCING IN THE DARK", artist: "Joji", album: "BALLADS 1", image: ballads1, popularity: 95 },
  { id: 3, title: "Die For You", artist: "Joji", album: "Smithereens", image: smithereens, popularity: 78 },
  { id: 4, title: "YEAH RIGHT", artist: "Joji", album: "BALLADS 1", image: ballads1, popularity: 88 },
  { id: 5, title: "Sanctuary", artist: "Joji", album: "Nectar", image: nectar, popularity: 85 },
  { id: 6, title: "Like You Do", artist: "Joji", album: "Nectar", image: nectar, popularity: 72 },
  { id: 7, title: "NIGHT RIDER", artist: "Joji", album: "Smithereens", image: smithereens, popularity: 65 },
  { id: 8, title: "Dior", artist: "Joji", album: "Piss In The Wind", image: pissinthewind, popularity: 58 }
];

const VIEW_MODES = [
  { id: 'all', label: 'All' },
  { id: 'album', label: 'By album' },
  { id: 'popular', label: 'Most popular' },
  { id: 'liked', label: 'Likes' },
  { id: 'disliked', label: 'Dislikes' }
]

export function RecommendationSection({ searchQuery, setSearchQuery, ratings, onRate }) {
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [viewMode, setViewMode] = useState('all')

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setIsSearching(true)

      setTimeout(() => {
        const results = DUMMY_SONGS.filter(song =>
          song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          song.artist.toLowerCase().includes(searchQuery.toLowerCase())
        )
        setSearchResults(results)
        setIsSearching(false)
      }, 500)
    }
  }

  // Filter by likes/dislikes when view mode is liked or disliked
  const filteredResults = (() => {
    if (viewMode === 'liked') {
      return searchResults.filter(song => ratings[song.id]?.rating === 'Like')
    }
    if (viewMode === 'disliked') {
      return searchResults.filter(song => ratings[song.id]?.rating === 'Dislike')
    }
    return searchResults
  })()

  // Sort by popularity (desc) when "Most popular" is selected
  const sortedResults = viewMode === 'popular'
    ? [...filteredResults].sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))
    : filteredResults

  // Group by album when "By album" is selected
  const byAlbum = viewMode === 'album'
    ? sortedResults.reduce((acc, song) => {
        const album = song.album || 'Unknown'
        if (!acc[album]) acc[album] = []
        acc[album].push(song)
        return acc
      }, {})
    : null

  return (
    <div className="section-container">
      {/* Hero Section */}
      <div className="hero-section">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="hero-title"
        >
          Discover Your Next
          <span className="hero-title-gradient">
            Favorite Sound
          </span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="hero-description"
        >
          Personalized music and podcast recommendations tailored just for you
        </motion.p>
      </div>

      {/* Search Bar */}
      <SearchBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
      />
      
      {/* Search Results */}
      {isSearching && (
        <div className = "loading">
          <p>Searching</p>
          </div>
      )}

      {!isSearching && searchResults.length > 0 && (
        <div className="search-results">
          <h2>Search Results</h2>
          <div className="search-results-controls">
            {VIEW_MODES.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                className={`view-mode-btn ${viewMode === id ? 'view-mode-btn-active' : ''}`}
                onClick={() => setViewMode(id)}
              >
                {label}
              </button>
            ))}
          </div>
          {viewMode === 'album' && byAlbum ? (
            <div className="search-results-by-album">
              {Object.entries(byAlbum).map(([albumName, songs]) => (
                <AlbumCollapseCard
                  key={albumName}
                  albumName={albumName}
                  songs={songs}
                  onRate={onRate}
                  ratings={ratings}
                />
              ))}
            </div>
          ) : sortedResults.length === 0 ? (
            <div className="no-results">
              <p>
                {viewMode === 'liked' && 'No liked songs in these results.'}
                {viewMode === 'disliked' && 'No disliked songs in these results.'}
              </p>
            </div>
          ) : (
            <div className="results-grid">
              {sortedResults.map(song => (
                <SongCard
                  key={song.id}
                  song={song}
                  onRate={onRate}
                  userRating={ratings[song.id]?.rating}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {!isSearching && searchResults.length === 0 && searchQuery.trim() && (
        <div className="no-results">
          <p>No results found for "{searchQuery}"</p>
        </div>
      )}
    </div>
  )
}

