import React, { useState } from 'react'
import { usePhotos } from '../contexts/PhotoContext'
import PhotoCanvas from './PhotoCanvas'
import DevelopSidebar from './DevelopSidebar'
import Filmstrip from './Filmstrip'
import DevelopToolbar from './DevelopToolbar'

const DevelopModule: React.FC = () => {
  const { state } = usePhotos()
  const [showBeforeAfter, setShowBeforeAfter] = useState(false)

  return (
    <div className="flex-1 flex flex-col">
      <DevelopToolbar 
        showBeforeAfter={showBeforeAfter}
        setShowBeforeAfter={setShowBeforeAfter}
      />
      
      <div className="flex-1 flex min-h-0">
        {/* Left sidebar - Navigator and Presets */}
        <div className="w-64 bg-lr-darker border-r border-lr-dark flex flex-col">
          <div className="p-4">
            <h2 className="text-sm font-semibold text-lr-gray uppercase tracking-wide mb-4">
              Navigator
            </h2>
            <div className="w-full h-32 bg-lr-dark rounded mb-4 flex items-center justify-center">
              <span className="text-lr-gray text-xs">Preview</span>
            </div>
          </div>
          
          <div className="flex-1 p-4">
            <h3 className="text-sm font-semibold text-lr-gray uppercase tracking-wide mb-4">
              Presets
            </h3>
            <div className="space-y-2">
              {state.presets.map((preset) => (
                <button
                  key={preset.id}
                  className="w-full text-left text-sm py-1 px-2 rounded hover:bg-lr-dark transition-colors"
                >
                  {preset.name}
                </button>
              ))}
              {state.presets.length === 0 && (
                <p className="text-lr-gray text-xs">No presets available</p>
              )}
            </div>
          </div>
        </div>

        {/* Main canvas area */}
        <div className="flex-1 flex flex-col">
          {state.currentPhoto ? (
            <PhotoCanvas 
              photo={state.currentPhoto} 
              showBeforeAfter={showBeforeAfter}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-lr-darkest">
              <div className="text-center">
                <p className="text-lr-gray mb-4">No photo selected</p>
                <p className="text-sm text-lr-gray">
                  Select a photo from the library to begin editing
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar - Adjustment panels */}
        <DevelopSidebar />
      </div>
      
      {/* Bottom filmstrip */}
      <Filmstrip />
    </div>
  )
}

export default DevelopModule