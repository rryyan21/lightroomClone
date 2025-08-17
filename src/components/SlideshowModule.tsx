import React, { useState } from 'react'
import { usePhotos } from '../contexts/PhotoContext'
import { Play, Pause, SkipBack, SkipForward, Settings, Monitor } from 'lucide-react'

const SlideshowModule: React.FC = () => {
  const { state } = usePhotos()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [slideDuration, setSlideDuration] = useState(3)

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
    if (!isPlaying) {
      alert('Slideshow started! Use arrow keys to navigate manually.')
    }
  }

  const handlePrevious = () => {
    setCurrentIndex(prev => prev > 0 ? prev - 1 : state.photos.length - 1)
  }

  const handleNext = () => {
    setCurrentIndex(prev => prev < state.photos.length - 1 ? prev + 1 : 0)
  }

  const currentPhoto = state.photos[currentIndex]

  return (
    <div className="flex-1 flex flex-col bg-lr-darkest">
      {/* Slideshow Toolbar */}
      <div className="bg-lr-dark border-b border-lr-darker px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold">Slideshow</h2>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handlePrevious}
              className="toolbar-button"
              title="Previous"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button 
              onClick={handlePlayPause}
              className={`toolbar-button ${isPlaying ? 'bg-lr-blue text-white' : ''}`}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button 
              onClick={handleNext}
              className="toolbar-button"
              title="Next"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-lr-gray">Duration:</label>
            <select 
              value={slideDuration}
              onChange={(e) => setSlideDuration(Number(e.target.value))}
              className="bg-lr-darker border border-lr-gray rounded px-2 py-1 text-sm"
            >
              <option value={1}>1s</option>
              <option value={3}>3s</option>
              <option value={5}>5s</option>
              <option value={10}>10s</option>
            </select>
          </div>
          <button className="toolbar-button" title="Slideshow Settings">
            <Settings className="w-4 h-4" />
          </button>
          <button className="toolbar-button" title="Fullscreen">
            <Monitor className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Slideshow Area */}
      <div className="flex-1 flex">
        {/* Preview Panel */}
        <div className="w-64 bg-lr-darker border-r border-lr-dark p-4">
          <h3 className="text-sm font-semibold text-lr-gray uppercase tracking-wide mb-4">
            Preview
          </h3>
          <div className="space-y-3">
            {state.photos.slice(0, 5).map((photo, index) => (
              <button
                key={photo.id}
                onClick={() => setCurrentIndex(index)}
                className={`w-full aspect-video rounded overflow-hidden border-2 transition-colors ${
                  index === currentIndex ? 'border-lr-blue' : 'border-transparent hover:border-lr-gray'
                }`}
              >
                <img 
                  src={photo.url} 
                  alt={photo.name}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
            {state.photos.length > 5 && (
              <div className="text-xs text-lr-gray text-center">
                +{state.photos.length - 5} more photos
              </div>
            )}
          </div>
        </div>

        {/* Main Display */}
        <div className="flex-1 flex items-center justify-center p-8">
          {currentPhoto ? (
            <div className="max-w-full max-h-full">
              <img 
                src={currentPhoto.url}
                alt={currentPhoto.name}
                className="max-w-full max-h-full object-contain rounded shadow-2xl"
              />
              <div className="text-center mt-4">
                <h3 className="text-lg font-medium">{currentPhoto.name}</h3>
                <p className="text-sm text-lr-gray">
                  {currentIndex + 1} of {state.photos.length}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <Monitor className="w-16 h-16 text-lr-gray mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">No Photos for Slideshow</h3>
              <p className="text-lr-gray">
                Import photos to begin creating a slideshow
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {isPlaying && (
        <div className="h-1 bg-lr-dark">
          <div 
            className="h-full bg-lr-blue transition-all ease-linear"
            style={{ 
              width: '50%', // This would animate based on slide progress
              animationDuration: `${slideDuration}s`
            }}
          />
        </div>
      )}
    </div>
  )
}

export default SlideshowModule