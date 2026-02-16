// Mock data for recommendations
export const mockRecommendations = [
  { id: '1', title: 'Midnight Dreams', artist: 'Luna Wave', type: 'music', cover: 'https://picsum.photos/seed/music1/200/200', duration: '3:45', plays: '2.5M' },
  { id: '2', title: 'Tech Today', artist: 'Digital Pulse', type: 'podcast', cover: 'https://picsum.photos/seed/podcast1/200/200', duration: '45:00', episodes: 120 },
  { id: '3', title: 'Ocean Waves', artist: 'Calm Collective', type: 'music', cover: 'https://picsum.photos/seed/music2/200/200', duration: '4:12', plays: '1.8M' },
  { id: '4', title: 'Mind Matters', artist: 'Dr. Sarah Chen', type: 'podcast', cover: 'https://picsum.photos/seed/podcast2/200/200', duration: '32:15', episodes: 85 },
  { id: '5', title: 'Neon Lights', artist: 'City Sounds', type: 'music', cover: 'https://picsum.photos/seed/music3/200/200', duration: '3:58', plays: '3.2M' },
  { id: '6', title: 'Future Forward', artist: 'Innovation Lab', type: 'podcast', cover: 'https://picsum.photos/seed/podcast3/200/200', duration: '28:30', episodes: 200 },
]

export const trendingItems = [
  { id: '7', title: 'Summer Vibes', artist: 'Beach House', type: 'music', cover: 'https://picsum.photos/seed/music4/200/200', duration: '3:22', plays: '5.1M' },
  { id: '8', title: 'True Crime Stories', artist: 'Detective Hour', type: 'podcast', cover: 'https://picsum.photos/seed/podcast4/200/200', duration: '52:00', episodes: 45 },
  { id: '9', title: 'Electric Soul', artist: 'Neon Dreams', type: 'music', cover: 'https://picsum.photos/seed/music5/200/200', duration: '4:05', plays: '4.7M' },
  { id: '10', title: 'Science Weekly', artist: 'Dr. Alex Morgan', type: 'podcast', cover: 'https://picsum.photos/seed/podcast5/200/200', duration: '38:45', episodes: 156 },
]

// Animation variants
export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
}

