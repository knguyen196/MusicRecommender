import * as React from 'react'
import { cn } from '@/lib/utils'
import { Play, Pause, SkipBack, SkipForward, Heart, MoreHorizontal, Shuffle, Repeat, Volume2 } from 'lucide-react'

// ============ Design Tokens for Music Cards (includes app theme teal) ============
const musicColors = {
  vibrant: {
    pink: 'from-pink-500 to-rose-500',
    orange: 'from-orange-500 to-amber-500',
    green: 'from-emerald-500 to-teal-500',
    purple: 'from-purple-500 to-fuchsia-500',
    red: 'from-red-500 to-rose-500',
    cyan: 'from-cyan-500 to-teal-500',
    teal: 'from-[rgb(var(--deep-teal))] to-[rgb(var(--muted-teal))]',
  },
  glow: {
    pink: 'shadow-pink-500/30',
    orange: 'shadow-orange-500/30',
    green: 'shadow-emerald-500/30',
    purple: 'shadow-purple-500/30',
    red: 'shadow-red-500/30',
    cyan: 'shadow-cyan-500/30',
    teal: 'shadow-[0_0_30px_rgba(var(--deep-teal),0.3)]',
  },
}

// ============ Audio Visualizer Component ============
export function AudioVisualizer({
  isPlaying,
  color = 'teal',
  className,
  barCount = 4,
}) {
  const vibrantClass = musicColors.vibrant[color] ?? musicColors.vibrant.teal
  return (
    <div className={cn('flex items-end justify-center gap-0.5 h-6', className)}>
      {Array.from({ length: barCount }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'w-1 rounded-full bg-gradient-to-t',
            vibrantClass,
            'transition-all duration-150',
            isPlaying ? 'animate-bounce' : ''
          )}
          style={{
            height: isPlaying ? `${Math.random() * 60 + 40}%` : '30%',
            animationDelay: `${i * 100}ms`,
            animationDuration: '400ms',
          }}
        />
      ))}
    </div>
  )
}

// ============ Main Music Card Component ============
export function MusicCard({
  title,
  artist,
  albumArt,
  duration = '3:45',
  isPlaying = false,
  isLiked = false,
  color = 'teal',
  onPlay,
  onLike,
  className,
}) {
  const [hovered, setHovered] = React.useState(false)
  const [liked, setLiked] = React.useState(isLiked)
  const vibrantClass = musicColors.vibrant[color] ?? musicColors.vibrant.teal

  const handleLike = () => {
    setLiked(!liked)
    onLike?.()
  }

  const pauseIconColorClass =
    color === 'pink' ? 'text-rose-500' : color === 'orange' ? 'text-amber-500' : 'text-gray-800'

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl p-4',
        'bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-900/90 dark:to-gray-800/70',
        'backdrop-blur-xl border border-white/20 dark:border-white/10',
        'shadow-lg hover:shadow-2xl transition-all duration-300',
        'hover:scale-[1.02] hover:-translate-y-1',
        'w-64 cursor-pointer',
        className
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Album Art */}
      <div className="relative mb-4 aspect-square rounded-xl overflow-hidden shadow-lg">
        {!albumArt && (
          <div className={cn('absolute inset-0 bg-gradient-to-br', vibrantClass, 'opacity-80')} />
        )}

        {albumArt ? (
          <img src={albumArt} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={cn(
                'w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm',
                'flex items-center justify-center',
                'transition-all duration-300',
                hovered && 'scale-110 bg-white/30'
              )}
            >
              <MusicNoteIcon className="w-8 h-8 text-white" />
            </div>
          </div>
        )}

        {/* Play Button Overlay */}
        <div
          className={cn(
            'absolute inset-0 bg-black/30 flex items-center justify-center',
            'transition-opacity duration-200',
            isPlaying ? 'opacity-100' : hovered ? 'opacity-100' : 'opacity-0'
          )}
        >
          <button
            onClick={(e) => {
              e.stopPropagation()
              onPlay?.()
            }}
            className={cn(
              'w-14 h-14 rounded-full bg-white shadow-xl',
              'flex items-center justify-center',
              'transform transition-all duration-200',
              'hover:scale-110 active:scale-95',
              isPlaying && 'animate-pulse'
            )}
          >
            {isPlaying ? (
              <Pause className={cn('w-6 h-6', pauseIconColorClass)} />
            ) : (
              <Play className="w-6 h-6 text-gray-800 ml-1" />
            )}
          </button>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm">
          <span className="text-xs text-white font-medium">{duration}</span>
        </div>
      </div>

      {/* Song Info */}
      <div className="space-y-1">
        <h3 className="font-bold text-gray-900 dark:text-white truncate text-lg">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{artist}</p>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleLike()
            }}
            className={cn(
              'p-2 rounded-full transition-all duration-200',
              'hover:bg-gray-100 dark:hover:bg-gray-800',
              liked && 'text-red-500'
            )}
          >
            <Heart className={cn('w-4 h-4', liked && 'fill-current')} />
          </button>

          <AudioVisualizer isPlaying={isPlaying} color={color} barCount={3} />
        </div>

        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// ============ Featured Music Card (Larger) ============
export function FeaturedMusicCard({
  title,
  artist,
  albumArt,
  duration = '3:45',
  isPlaying = false,
  isLiked = false,
  color = 'teal',
  plays = '1.2M',
  onPlay,
  onLike,
  className,
}) {
  const [liked, setLiked] = React.useState(isLiked)
  const vibrantClass = musicColors.vibrant[color] ?? musicColors.vibrant.teal
  const glowClass = musicColors.glow[color] ?? musicColors.glow.teal

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-3xl w-full min-w-[420px] max-w-[520px]',
        'bg-gradient-to-br',
        vibrantClass,
        'shadow-2xl',
        glowClass,
        'hover:shadow-3xl transition-all duration-500',
        'p-1',
        className
      )}
    >
      <div
        className={cn(
          'relative rounded-[1.4rem] overflow-hidden',
          'bg-gray-900 p-6',
          'min-h-[320px]'
        )}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-40 h-40 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 right-0 w-60 h-60 rounded-full bg-white blur-3xl" />
        </div>

        <div className="relative flex flex-col h-full">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-semibold',
                  'bg-white/20 text-white backdrop-blur-sm'
                )}
              >
                Trending
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setLiked(!liked)
                onLike?.()
              }}
              className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
            >
              <Heart className={cn('w-5 h-5 text-white', liked && 'fill-red-500 text-red-500')} />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center py-6">
            <div className="relative">
              <div
                className={cn(
                  'w-40 h-40 rounded-2xl overflow-hidden shadow-2xl',
                  'transform transition-transform duration-500',
                  'group-hover:scale-105 group-hover:rotate-3'
                )}
              >
                {!albumArt && (
                  <div className={cn('absolute inset-0 bg-gradient-to-br', vibrantClass, 'opacity-60')} />
                )}
                {albumArt ? (
                  <img src={albumArt} alt={title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <MusicNoteIcon className="w-12 h-12 text-white/80" />
                  </div>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onPlay?.()
                }}
                className={cn(
                  'absolute -bottom-3 -right-3 w-14 h-14 rounded-full',
                  'bg-white shadow-xl flex items-center justify-center',
                  'transform transition-all duration-300',
                  'hover:scale-110 active:scale-95',
                  'group-hover:translate-y-0 translate-y-2 opacity-0 group-hover:opacity-100'
                )}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-gray-900" />
                ) : (
                  <Play className="w-6 h-6 text-gray-900 ml-0.5" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white truncate">{title}</h2>
            <div className="flex items-center justify-between">
              <p className="text-gray-300">{artist}</p>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <span>🎵 {plays} plays</span>
                <span>{duration}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============ Compact Music Card ============
export function CompactMusicCard({
  title,
  artist,
  albumArt,
  isPlaying = false,
  color = 'teal',
  onPlay,
  className,
}) {
  const vibrantClass = musicColors.vibrant[color] ?? musicColors.vibrant.teal

  return (
    <div
      className={cn(
        'group flex items-center gap-4 p-3 rounded-xl',
        'bg-white dark:bg-gray-800/50',
        'border border-gray-100 dark:border-gray-700/50',
        'shadow-sm hover:shadow-md transition-all duration-200',
        'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800',
        className
      )}
      onClick={onPlay}
    >
      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
        {!albumArt && (
          <div className={cn('absolute inset-0 bg-gradient-to-br', vibrantClass)} />
        )}
        {albumArt ? (
          <img src={albumArt} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MusicNoteIcon className="w-5 h-5 text-white" />
          </div>
        )}

        {isPlaying && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <AudioVisualizer isPlaying={true} color={color} barCount={3} className="h-4" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 dark:text-white truncate text-sm">{title}</h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{artist}</p>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation()
          onPlay?.()
        }}
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center',
          'bg-gradient-to-r',
          vibrantClass,
          'text-white shadow-md',
          'opacity-0 group-hover:opacity-100',
          'transition-all duration-200',
          'hover:scale-110 active:scale-95'
        )}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4 ml-0.5" />
        )}
      </button>
    </div>
  )
}

// ============ Music Player Bar ============
export function MusicPlayerBar({
  title,
  artist,
  albumArt,
  isPlaying = false,
  progress = 35,
  color = 'teal',
  onPlay,
  onPrev,
  onNext,
  className,
}) {
  const vibrantClass = musicColors.vibrant[color] ?? musicColors.vibrant.teal

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50',
        'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl',
        'border-t border-gray-200 dark:border-gray-800',
        'px-4 py-3',
        className
      )}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-800">
        <div
          className={cn('h-full bg-gradient-to-r transition-all duration-300', vibrantClass)}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between max-w-screen-xl mx-auto">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
            {!albumArt && (
              <div className={cn('absolute inset-0 bg-gradient-to-br', vibrantClass)} />
            )}
            {albumArt ? (
              <img src={albumArt} alt={title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <MusicNoteIcon className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h4 className="font-semibold text-gray-900 dark:text-white truncate text-sm">{title}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{artist}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <Shuffle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={onPrev}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <SkipBack className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
          <button
            onClick={onPlay}
            className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center',
              'bg-gradient-to-r shadow-lg',
              vibrantClass,
              'hover:scale-105 active:scale-95 transition-transform'
            )}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-white" />
            ) : (
              <Play className="w-5 h-5 text-white ml-0.5" />
            )}
          </button>
          <button
            onClick={onNext}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <SkipForward className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <Repeat className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="flex items-center gap-2 flex-1 justify-end">
          <Volume2 className="w-4 h-4 text-gray-500" />
          <div className="w-24 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className={cn('h-full w-3/4 bg-gradient-to-r', vibrantClass)} />
          </div>
        </div>
      </div>
    </div>
  )
}

function MusicNoteIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  )
}

export { musicColors }
