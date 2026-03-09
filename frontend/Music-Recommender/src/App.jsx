import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from './components/Navbar'
import { RecommendationSection } from './components/RecommendationSection'
import { BrowseSection } from './components/BrowseSection'
import { AboutSection } from './components/AboutSection'
import { Footer } from './components/Footer'
import { MusicPlayerBar } from './components/MusicCard'

// Main App Component
function App() {
  const [activeSection, setActiveSection] = useState('recommendation')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentTrack, setCurrentTrack] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  const renderSection = () => {
    switch (activeSection) {
      case 'browse':
        return <BrowseSection />
      case 'about':
        return <AboutSection />
      default:
        return (
          <RecommendationSection
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSelectTrack={setCurrentTrack}
          />
        )
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

      {currentTrack && (
        <MusicPlayerBar
          title={currentTrack.title}
          artist={currentTrack.artist}
          albumArt={currentTrack.image}
          isPlaying={isPlaying}
          progress={progress}
          color="cyan"
          onPlay={() => setIsPlaying((p) => !p)}
          onPrev={() => {}}
          onNext={() => {}}
        />
      )}

      <Footer />
    </div>
  )
}

export default App
