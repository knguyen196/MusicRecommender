import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

export function SearchBar({ searchQuery, setSearchQuery, onSearch }) {
  const inputRef = useRef(null)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="search-container"
    >
      <div className="search-wrapper group">
        <motion.div className="search-glow" />
        <div className="search-input-wrapper">
          <div className="search-icon-wrapper">
            <Search className="w-5 h-5 text-muted-foreground" />
          </div>
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search for music and podcasts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
            className="search-input"
          />
        </div>
      </div>
    </motion.div>
  )
}

