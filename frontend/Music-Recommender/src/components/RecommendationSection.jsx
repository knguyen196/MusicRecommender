import { useState } from 'react'
import { motion } from 'framer-motion'
import { SearchBar } from './SearchBar'
import { MusicCard, FeaturedMusicCard, CompactMusicCard } from './MusicCard'

const CARD_COLORS = ['pink', 'cyan', 'green', 'purple', 'orange', 'red', 'teal']
function cardColor(index) {
  return CARD_COLORS[index % CARD_COLORS.length]
}
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

export function RecommendationSection({ searchQuery, setSearchQuery, onSelectTrack }) {
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
          {/* Featured: first result */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.4 }}
          >
            <h2 className="mb-4 text-xl font-semibold">Featured</h2>
            <div className="flex justify-center">
              <FeaturedMusicCard
                title={searchResults[0].title}
                artist={searchResults[0].artist}
                albumArt={searchResults[0].image}
                duration="0:00"
                color="purple"
                plays="—"
                onPlay={() => onSelectTrack?.(searchResults[0])}
                onLike={() => console.log('Rated:', searchResults[0])}
              />
            </div>
          </motion.div>

          {searchResults.length > 1 && (
            <div className="mb-6">
              <h2 className="mb-3 text-lg font-semibold">Quick picks</h2>
              <div className="flex flex-col gap-2 max-w-md">
                {searchResults.slice(0, 3).map((song, index) => (
                  <motion.div
                    key={`compact-${song.id}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
                  >
                    <CompactMusicCard
                      title={song.title}
                      artist={song.artist}
                      albumArt={song.image}
                      color={cardColor(index)}
                      onPlay={() => onSelectTrack?.(song)}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <h2>Search Results</h2>
          <div className="results-grid">
            {searchResults.map((song, index) => (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <MusicCard
                  title={song.title}
                  artist={song.artist}
                  albumArt={song.image}
                  duration="0:00"
                  color={cardColor(index)}
                  onPlay={() => onSelectTrack?.(song)}
                  onLike={() => console.log('Rated:', song)}
                  className="w-full min-w-0"
                />
              </motion.div>
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

