import { useState } from 'react'
import { motion } from 'framer-motion'
import { Music, Podcast, Play, Heart, Clock, TrendingUp, Radio } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { scaleIn } from '../constants'

export function MediaCard({ item, index }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="media-card-wrapper group"
    >
      <Card className={`media-card ${item.type === 'music' ? 'media-card-music' : 'media-card-podcast'}`}>
        <CardContent className="p-0">
          {/* Cover Image */}
          <div className="media-card-cover">
            <motion.img
              src={item.cover}
              alt={item.title}
              className="media-card-image"
              animate={{ scale: isHovered ? 1.08 : 1 }}
              transition={{ duration: 0.4 }}
            />
            
            {/* Gradient Overlay */}
            <div className="media-card-overlay" />
            
            {/* Type Badge */}
            <div className="media-card-badge-wrapper">
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`media-card-badge ${
                  item.type === 'music' 
                    ? 'media-card-badge-music' 
                    : 'media-card-badge-podcast'
                }`}
              >
                {item.type === 'music' ? <Music className="w-3 h-3" /> : <Podcast className="w-3 h-3" />}
                {item.type === 'music' ? 'Song' : 'Podcast'}
              </motion.span>
            </div>

            {/* Play Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
              transition={{ duration: 0.2 }}
              className="media-card-play-button-wrapper"
            >
              <button className="media-card-play-button">
                <Play className="w-6 h-6 text-gray-900 ml-1" fill="currentColor" />
              </button>
            </motion.div>

            {/* Like Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsLiked(!isLiked)}
              className="media-card-like-button"
            >
              <Heart 
                className={`w-4 h-4 transition-colors ${
                  isLiked ? 'media-card-heart-liked' : 'media-card-heart-unliked'
                }`} 
                fill={isLiked ? 'currentColor' : 'none'}
              />
            </motion.button>
          </div>

          {/* Info */}
          <div className="media-card-info">
            <h3 className="media-card-title">
              {item.title}
            </h3>
            <p className="media-card-artist">{item.artist}</p>
            
            <div className="media-card-meta">
              <span className="media-card-meta-item">
                <Clock className="w-3 h-3" />
                {item.duration}
              </span>
              <span className="media-card-meta-item">
                {item.type === 'music' ? (
                  <>
                    <TrendingUp className="w-3 h-3" />
                    {item.plays}
                  </>
                ) : (
                  <>
                    <Radio className="w-3 h-3" />
                    {item.episodes} eps
                  </>
                )}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

