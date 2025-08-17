import React, { useState } from 'react'
import { 
  Crop, 
  RotateCw, 
  Eye, 
  Zap, 
  CircleDot, 
  Square, 
  Brush,
  Eraser
} from 'lucide-react'
import { usePhotos } from '../contexts/PhotoContext'

interface DevelopToolbarProps {
  showBeforeAfter: boolean
  setShowBeforeAfter: (show: boolean) => void
}

const DevelopToolbar: React.FC<DevelopToolbarProps> = ({ 
  showBeforeAfter, 
  setShowBeforeAfter 
}) => {
  const { state, dispatch, defaultAdjustments } = usePhotos()
  const [activeTool, setActiveTool] = useState<string | null>(null)
  const handleToolClick = (toolName: string) => {
    const newActiveTool = activeTool === toolName ? null : toolName
    setActiveTool(newActiveTool)
    
    // Tool-specific logic
    if (newActiveTool && state.currentPhoto) {
      switch (toolName) {
        case 'Crop':
          alert('Crop Tool: Click and drag to select crop area. Press Enter to apply or Esc to cancel.')
          break
        case 'Straighten':
          // Auto straighten with a small random adjustment for demo
          const straightenAngle = (Math.random() - 0.5) * 4 // Random between -2 and 2 degrees
          dispatch({
            type: 'UPDATE_ADJUSTMENTS',
            photoId: state.currentPhoto.id,
            adjustments: { 
              hue: state.currentPhoto.adjustments.hue + straightenAngle 
            }
          })
          break
        case 'Red Eye':
          alert('Red Eye Tool: Click on red eyes to automatically correct them.')
          break
        case 'Graduated Filter':
          alert('Graduated Filter: Click and drag to create a gradient mask for selective adjustments.')
          break
        case 'Radial Filter':
          alert('Radial Filter: Click and drag to create a radial mask for selective adjustments.')
          break
        case 'Masking':
          alert('Masking Tool: Paint to create custom masks for selective adjustments.')
          break
        case 'Adjustment Brush':
          alert('Adjustment Brush: Paint to apply localized adjustments.')
          break
        case 'Eraser':
          alert('Eraser: Click to remove masks or adjustments in specific areas.')
          break
        default:
          console.log(`Activated tool: ${toolName}`)
      }
    }
  }

  const handleReset = () => {
    if (!state.currentPhoto) return
    
    dispatch({
      type: 'UPDATE_ADJUSTMENTS',
      photoId: state.currentPhoto.id,
      adjustments: { ...defaultAdjustments }
    })
  }

  const handleAuto = () => {
    if (!state.currentPhoto) return
    
    // Simple auto-adjust algorithm
    const autoAdjustments = {
      exposure: Math.random() * 0.5 - 0.25, // Random between -0.25 and 0.25
      contrast: Math.random() * 20 - 10, // Random between -10 and 10
      shadows: Math.random() * 30 + 10, // Random between 10 and 40
      highlights: Math.random() * -20 - 10, // Random between -30 and -10
      vibrance: Math.random() * 20 + 5, // Random between 5 and 25
    }
    
    dispatch({
      type: 'UPDATE_ADJUSTMENTS',
      photoId: state.currentPhoto.id,
      adjustments: autoAdjustments
    })
  }

  const handleBeforeAfter = () => {
    setShowBeforeAfter(!showBeforeAfter)
  }

  const tools = [
    { icon: Crop, name: 'Crop', active: activeTool === 'Crop' },
    { icon: RotateCw, name: 'Straighten', active: activeTool === 'Straighten' },
    { icon: Eye, name: 'Red Eye', active: activeTool === 'Red Eye' },
    { icon: Zap, name: 'Graduated Filter', active: activeTool === 'Graduated Filter' },
    { icon: CircleDot, name: 'Radial Filter', active: activeTool === 'Radial Filter' },
    { icon: Square, name: 'Masking', active: activeTool === 'Masking' },
    { icon: Brush, name: 'Adjustment Brush', active: activeTool === 'Adjustment Brush' },
    { icon: Eraser, name: 'Eraser', active: activeTool === 'Eraser' },
  ]

  return (
    <div className="bg-lr-dark border-b border-lr-darker px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        {tools.map((tool, index) => (
          <button
            key={index}
            onClick={() => handleToolClick(tool.name)}
            className={`p-2 rounded transition-colors ${
              tool.active 
                ? 'bg-lr-blue text-white' 
                : 'hover:bg-lr-darker text-lr-gray hover:text-lr-light'
            }`}
            title={tool.name}
          >
            <tool.icon className="w-4 h-4" />
          </button>
        ))}
      </div>
      
      <div className="flex items-center space-x-4">
        <button 
          onClick={handleBeforeAfter}
          className={`text-sm transition-colors ${
            showBeforeAfter ? 'text-lr-blue' : 'hover:text-lr-blue'
          }`}
        >
          Before/After
        </button>
        <div className="w-px h-4 bg-lr-gray" />
        <button 
          onClick={handleReset}
          className="text-sm hover:text-lr-blue transition-colors"
          disabled={!state.currentPhoto}
        >
          Reset
        </button>
        <button 
          onClick={handleAuto}
          className="text-sm hover:text-lr-blue transition-colors"
          disabled={!state.currentPhoto}
        >
          Auto
        </button>
      </div>
    </div>
  )
}

export default DevelopToolbar