import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { WeightSlider } from './WeightSlider'
import SongCard from './SongCard'
import ballads1 from './ui/dummyimages/ballads1.png'
import nectar from './ui/dummyimages/nectar.png'
import smithereens from './ui/dummyimages/smithereens.jpg'

const MOCK_RECOMMENDATIONS = [
  { id: 10, title: "Run", artist: "Joji", album: "Nectar", image: nectar },
  { id: 11, title: "Tick Tock", artist: "Joji", album: "BALLADS 1", image: ballads1 },
  { id: 12, title: "Pretty Boy", artist: "Joji", album: "Smithereens", image: smithereens },
  { id: 13, title: "Afterthought", artist: "Joji", album: "Nectar", image: nectar },
]

export function RecommendationsView({ ratings, onRate}){
    const [weight, setWeight] = useState(50)

    const hasRatings = Object.keys(ratings).length > 0

    return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="recommendations-container"
    >
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="recommendations-title"
      >
        Your Personalized Recommendations
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="recommendations-description"
      >
        Based on your listening preferences and similar users
      </motion.p>

      {/* Weight Slider */}
      <WeightSlider weight={weight} setWeight={setWeight} />

      {/* Recommendations */}
      {hasRatings ? (
        <div className="recommendations-section">
          <h2 className="section-heading">Recommended For You</h2>
          <div className="results-grid">
            {MOCK_RECOMMENDATIONS.map(song => (
              <SongCard
                key={song.id}
                song={song}
                onRate={onRate}
                userRating={ratings[song.id]?.rating}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="empty-recommendations">
          <p>Rate some songs to get personalized recommendations!</p>
          <p className="empty-hint">Go to the Search tab and start rating.</p>
        </div>
      )}
    </motion.div>
  )
}