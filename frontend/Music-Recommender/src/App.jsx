import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from './components/Navbar'
import { RecommendationSection } from './components/RecommendationSection'
import { BrowseSection } from './components/BrowseSection'
import { AboutSection } from './components/AboutSection'
import { Footer } from './components/Footer'
import { RatedSongs} from './components/RatedSongs'

// Main App Component
function App() {
  const [activeSection, setActiveSection] = useState('recommendation')
  const [searchQuery, setSearchQuery] = useState('')
  const [ratings, setRatings] = useState({})

  const handleRate = (song, rating) => {
    setRatings(prev => ({
      ...prev,
      [song.id]: {song, rating}
    }))
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'browse':
        return <BrowseSection />
      case 'about':
        return <AboutSection />
      case 'rated':
        return <RatedSongs ratings={ratings} onRate={handleRate}/> 
      default:
        return <RecommendationSection searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        ratings = {ratings} onRate = {handleRate} />
    }
  }

  return (
    <div className="page-container">
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <main className="main-content">
        <div className="content-wrapper">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default App
