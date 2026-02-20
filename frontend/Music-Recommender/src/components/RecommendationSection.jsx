import { useState } from 'react'
import { motion } from 'framer-motion'
import { SearchBar } from './SearchBar'
import SongCard from './SongCard'
import ballads1 from './ui/dummyimages/ballads1.png'
import nectar from './ui/dummyimages/nectar.png'
import smithereens from './ui/dummyimages/smithereens.jpg'
import pissinthewind from './ui/dummyimages/pissinthewind.jpg'

// Dummy data
const DUMMY_SONGS = [
  { id: 1, title: "Glimpse of Us", artist: "Joji", album: "Smithereens", image: smithereens },
  { id: 2, title: "SLOW DANCING IN THE DARK", artist: "Joji", album: "BALLADS 1", image: ballads1 },
  { id: 3, title: "Die For You", artist: "Joji", album: "Smithereens", image: smithereens },
  { id: 4, title: "YEAH RIGHT", artist: "Joji", album: "BALLADS 1", image: ballads1 },
  { id: 5, title: "Sanctuary", artist: "Joji", album: "Nectar", image: nectar },
  { id: 6, title: "Like You Do", artist: "Joji", album: "Nectar", image: nectar },
  { id: 7, title: "NIGHT RIDER", artist: "Joji", album: "Smithereens", image: smithereens },
  { id: 8, title: "Dior", artist: "Joji", album: "Piss In The Wind", image: pissinthewind }
];

export function RecommendationSection({ searchQuery, setSearchQuery }) {
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState([])

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
          <div className = "results-grid">
            {searchResults.map(song =>(
              <SongCard
                key={song.id}
                song={song}
                onRate={(song) => console.log('Rated:', song)}
                />
            ))}
            </div>
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

