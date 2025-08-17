import React, { useState } from 'react'
import { usePhotos, PhotoAdjustments } from '../contexts/PhotoContext'
import AdjustmentSlider from './AdjustmentSlider'
import Histogram from './Histogram'
import { RotateCcw, Copy, Clipboard } from 'lucide-react'

const DevelopSidebar: React.FC = () => {
  const { state, dispatch } = usePhotos()
  const currentPhoto = state.currentPhoto
  const [copiedSettings, setCopiedSettings] = useState<PhotoAdjustments | null>(null)

  if (!currentPhoto) {
    return (
      <div className="w-80 bg-lr-darker border-l border-lr-dark p-4">
        <div className="text-center text-lr-gray">
          Select a photo to see adjustments
        </div>
      </div>
    )
  }

  const updateAdjustment = (key: string, value: number) => {
    dispatch({
      type: 'UPDATE_ADJUSTMENTS',
      photoId: currentPhoto.id,
      adjustments: { [key]: value }
    })
  }

  const resetAdjustments = () => {
    dispatch({
      type: 'UPDATE_ADJUSTMENTS',
      photoId: currentPhoto.id,
      adjustments: {
        exposure: 0,
        contrast: 0,
        highlights: 0,
        shadows: 0,
        whites: 0,
        blacks: 0,
        clarity: 0,
        vibrance: 0,
        saturation: 0,
        temperature: 0,
        tint: 0,
        hue: 0,
        luminance: 0,
        toneCurve: [
          { x: 0, y: 0 },
          { x: 0.25, y: 0.25 },
          { x: 0.5, y: 0.5 },
          { x: 0.75, y: 0.75 },
          { x: 1, y: 1 }
        ]
      }
    })
  }

  const copySettings = () => {
    if (currentPhoto) {
      setCopiedSettings({ ...currentPhoto.adjustments })
      // Visual feedback
      const button = document.querySelector('[title="Copy Settings"]')
      if (button) {
        button.classList.add('bg-lr-blue', 'text-white')
        setTimeout(() => {
          button.classList.remove('bg-lr-blue', 'text-white')
        }, 200)
      }
    }
  }

  const pasteSettings = () => {
    if (currentPhoto && copiedSettings) {
      dispatch({
        type: 'UPDATE_ADJUSTMENTS',
        photoId: currentPhoto.id,
        adjustments: { ...copiedSettings }
      })
      // Visual feedback
      const button = document.querySelector('[title="Paste Settings"]')
      if (button) {
        button.classList.add('bg-lr-blue', 'text-white')
        setTimeout(() => {
          button.classList.remove('bg-lr-blue', 'text-white')
        }, 200)
      }
    }
  }

  return (
    <div className="w-80 bg-lr-darker border-l border-lr-dark overflow-y-scroll flex-shrink-0" style={{ height: 'calc(100vh - 120px)' }}>
      {/* Histogram */}
      <div className="adjustment-group">
        <h3 className="text-sm font-semibold text-lr-gray uppercase tracking-wide mb-3">
          Histogram
        </h3>
        <Histogram photo={currentPhoto} />
      </div>

      {/* Quick Actions */}
      <div className="adjustment-group">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-lr-gray uppercase tracking-wide">
            Quick Actions
          </h3>
          <div className="flex space-x-1">
            <button
              onClick={resetAdjustments}
              className="p-1 hover:bg-lr-dark rounded"
              title="Reset All"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button 
              onClick={copySettings}
              className="p-1 hover:bg-lr-dark rounded transition-colors" 
              title="Copy Settings"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button 
              onClick={pasteSettings}
              disabled={!copiedSettings}
              className={`p-1 hover:bg-lr-dark rounded transition-colors ${
                !copiedSettings ? 'opacity-50 cursor-not-allowed' : ''
              }`} 
              title="Paste Settings"
            >
              <Clipboard className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Basic Panel */}
      <div className="adjustment-group">
        <h3 className="text-sm font-semibold text-lr-gray uppercase tracking-wide mb-3">
          Basic
        </h3>
        
        <AdjustmentSlider
          label="Exposure"
          value={currentPhoto.adjustments.exposure}
          min={-5}
          max={5}
          step={0.01}
          onChange={(value) => updateAdjustment('exposure', value)}
        />
        
        <AdjustmentSlider
          label="Contrast"
          value={currentPhoto.adjustments.contrast}
          min={-100}
          max={100}
          step={1}
          onChange={(value) => updateAdjustment('contrast', value)}
        />
        
        <AdjustmentSlider
          label="Highlights"
          value={currentPhoto.adjustments.highlights}
          min={-100}
          max={100}
          step={1}
          onChange={(value) => updateAdjustment('highlights', value)}
        />
        
        <AdjustmentSlider
          label="Shadows"
          value={currentPhoto.adjustments.shadows}
          min={-100}
          max={100}
          step={1}
          onChange={(value) => updateAdjustment('shadows', value)}
        />
        
        <AdjustmentSlider
          label="Whites"
          value={currentPhoto.adjustments.whites}
          min={-100}
          max={100}
          step={1}
          onChange={(value) => updateAdjustment('whites', value)}
        />
        
        <AdjustmentSlider
          label="Blacks"
          value={currentPhoto.adjustments.blacks}
          min={-100}
          max={100}
          step={1}
          onChange={(value) => updateAdjustment('blacks', value)}
        />
      </div>

      {/* Presence Panel */}
      <div className="adjustment-group">
        <h3 className="text-sm font-semibold text-lr-gray uppercase tracking-wide mb-3">
          Presence
        </h3>
        
        <AdjustmentSlider
          label="Clarity"
          value={currentPhoto.adjustments.clarity}
          min={-100}
          max={100}
          step={1}
          onChange={(value) => updateAdjustment('clarity', value)}
        />
        
        <AdjustmentSlider
          label="Vibrance"
          value={currentPhoto.adjustments.vibrance}
          min={-100}
          max={100}
          step={1}
          onChange={(value) => updateAdjustment('vibrance', value)}
        />
        
        <AdjustmentSlider
          label="Saturation"
          value={currentPhoto.adjustments.saturation}
          min={-100}
          max={100}
          step={1}
          onChange={(value) => updateAdjustment('saturation', value)}
        />
      </div>

      {/* White Balance Panel */}
      <div className="adjustment-group">
        <h3 className="text-sm font-semibold text-lr-gray uppercase tracking-wide mb-3">
          White Balance
        </h3>
        
        <AdjustmentSlider
          label="Temperature"
          value={currentPhoto.adjustments.temperature}
          min={-100}
          max={100}
          step={1}
          onChange={(value) => updateAdjustment('temperature', value)}
        />
        
        <AdjustmentSlider
          label="Tint"
          value={currentPhoto.adjustments.tint}
          min={-100}
          max={100}
          step={1}
          onChange={(value) => updateAdjustment('tint', value)}
        />
      </div>

      {/* HSL Panel */}
      <div className="adjustment-group">
        <h3 className="text-sm font-semibold text-lr-gray uppercase tracking-wide mb-3">
          HSL / Color
        </h3>
        
        <AdjustmentSlider
          label="Hue"
          value={currentPhoto.adjustments.hue}
          min={-180}
          max={180}
          step={1}
          onChange={(value) => updateAdjustment('hue', value)}
        />
        
        <AdjustmentSlider
          label="Luminance"
          value={currentPhoto.adjustments.luminance}
          min={-100}
          max={100}
          step={1}
          onChange={(value) => updateAdjustment('luminance', value)}
        />
      </div>

      {/* Add padding at bottom for scrolling */}
      <div className="h-32"></div>
    </div>
  )
}

export default DevelopSidebar