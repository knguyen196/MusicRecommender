import { motion } from 'framer-motion'
import { Music, Podcast } from 'lucide-react'

export function BrowseSection() {
  const categories = [
    { name: 'Pop', colorClass: 'browse-category-pop', icon: Music },
    { name: 'Rock', colorClass: 'browse-category-rock', icon: Music },
    { name: 'Electronic', colorClass: 'browse-category-electronic', icon: Music },
    { name: 'Jazz', colorClass: 'browse-category-jazz', icon: Music },
    { name: 'Classical', colorClass: 'browse-category-classical', icon: Music },
    { name: 'Hip-Hop', colorClass: 'browse-category-hiphop', icon: Music },
  ]

  const podcastCategories = [
    { name: 'Technology', colorClass: 'browse-category-tech', icon: Podcast },
    { name: 'True Crime', colorClass: 'browse-category-crime', icon: Podcast },
    { name: 'Science', colorClass: 'browse-category-science', icon: Podcast },
    { name: 'Business', colorClass: 'browse-category-business', icon: Podcast },
    { name: 'Health', colorClass: 'browse-category-health', icon: Podcast },
    { name: 'Comedy', colorClass: 'browse-category-comedy', icon: Podcast },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="browse-section"
    >
      <div className="browse-header">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="browse-title"
        >
          Browse by Category
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="browse-description"
        >
          Explore music and podcasts across various genres
        </motion.p>
      </div>

      {/* Music Categories */}
      <div className="browse-category-section">
        <h2 className="browse-category-title">
          <Music className="section-title-icon-rose" />
          Music Genres
        </h2>
        <div className="browse-category-grid">
          {categories.map((cat, index) => (
            <motion.button
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className={`browse-category-button ${cat.colorClass}`}
            >
              <cat.icon className="browse-category-icon" />
              <span className="browse-category-name">{cat.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Podcast Categories */}
      <div className="browse-category-section">
        <h2 className="browse-category-title">
          <Podcast className="section-title-icon-orange" />
          Podcast Categories
        </h2>
        <div className="browse-category-grid">
          {podcastCategories.map((cat, index) => (
            <motion.button
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 + 0.3 }}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className={`browse-category-button ${cat.colorClass}`}
            >
              <cat.icon className="browse-category-icon" />
              <span className="browse-category-name">{cat.name}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

