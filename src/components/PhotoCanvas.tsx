import React, { useRef, useEffect, useState } from 'react'
import { Photo } from '../contexts/PhotoContext'

interface PhotoCanvasProps {
  photo: Photo
  showBeforeAfter?: boolean
}

const PhotoCanvas: React.FC<PhotoCanvasProps> = ({ photo, showBeforeAfter = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 })

  // Apply adjustments to the canvas
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      // Set canvas size to match container
      const containerRect = container.getBoundingClientRect()
      canvas.width = containerRect.width
      canvas.height = containerRect.height

      // Calculate image dimensions to fit in canvas while maintaining aspect ratio
      const imgAspect = img.width / img.height
      const canvasAspect = canvas.width / canvas.height
      
      let drawWidth, drawHeight
      if (imgAspect > canvasAspect) {
        drawWidth = canvas.width * zoom
        drawHeight = (canvas.width / imgAspect) * zoom
      } else {
        drawHeight = canvas.height * zoom
        drawWidth = (canvas.height * imgAspect) * zoom
      }

      // Center the image with pan offset
      const x = (canvas.width - drawWidth) / 2 + pan.x
      const y = (canvas.height - drawHeight) / 2 + pan.y

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      if (showBeforeAfter) {
        // Split view: original on left, edited on right
        const splitX = canvas.width / 2
        
        // Draw original (left half)
        ctx.save()
        ctx.beginPath()
        ctx.rect(0, 0, splitX, canvas.height)
        ctx.clip()
        ctx.filter = 'none'
        ctx.drawImage(img, x, y, drawWidth, drawHeight)
        ctx.restore()
        
        // Draw edited (right half)
        ctx.save()
        ctx.beginPath()
        ctx.rect(splitX, 0, splitX, canvas.height)
        ctx.clip()
        
        const { adjustments } = photo
        
        // Use the same individual filter logic as the main view
        const filters = []
        
        if (adjustments.exposure !== 0) {
          filters.push(`brightness(${1 + adjustments.exposure / 3})`)
        }
        if (adjustments.contrast !== 0) {
          filters.push(`contrast(${1 + adjustments.contrast / 80})`)
        }
        if (adjustments.highlights !== 0) {
          const highlightStrength = Math.abs(adjustments.highlights) / 200
          if (adjustments.highlights > 0) {
            filters.push(`brightness(${1 + highlightStrength})`)
          } else {
            filters.push(`brightness(${1 - highlightStrength * 0.3})`)
          }
        }
        if (adjustments.shadows !== 0) {
          const shadowStrength = adjustments.shadows / 150
          filters.push(`brightness(${1 + shadowStrength * 0.5})`)
        }
        if (adjustments.whites !== 0) {
          filters.push(`brightness(${1 + adjustments.whites / 300})`)
        }
        if (adjustments.blacks !== 0) {
          filters.push(`brightness(${1 + adjustments.blacks / 400})`)
        }
        if (adjustments.clarity !== 0) {
          filters.push(`contrast(${1 + adjustments.clarity / 300})`)
        }
        if (adjustments.vibrance !== 0) {
          filters.push(`saturate(${1 + adjustments.vibrance / 200})`)
        }
        if (adjustments.saturation !== 0) {
          filters.push(`saturate(${1 + adjustments.saturation / 100})`)
        }
        if (adjustments.luminance !== 0) {
          filters.push(`brightness(${1 + adjustments.luminance / 200})`)
        }
        if (adjustments.temperature !== 0) {
          const tempStrength = Math.abs(adjustments.temperature) / 100
          if (adjustments.temperature > 0) {
            filters.push(`sepia(${tempStrength * 0.3}) hue-rotate(15deg)`)
          } else {
            filters.push(`sepia(${tempStrength * 0.2}) hue-rotate(-30deg)`)
          }
        }
        if (adjustments.tint !== 0) {
          filters.push(`hue-rotate(${adjustments.tint / 2}deg)`)
        }
        if (adjustments.hue !== 0) {
          filters.push(`hue-rotate(${adjustments.hue}deg)`)
        }
        
        ctx.filter = filters.length > 0 ? filters.join(' ') : 'none'
        ctx.drawImage(img, x, y, drawWidth, drawHeight)
        ctx.restore()
        
        // Draw divider line
        ctx.beginPath()
        ctx.moveTo(splitX, 0)
        ctx.lineTo(splitX, canvas.height)
        ctx.strokeStyle = '#0088ff'
        ctx.lineWidth = 2
        ctx.stroke()
        
        // Add labels
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
        ctx.fillRect(10, 10, 80, 30)
        ctx.fillRect(splitX + 10, 10, 80, 30)
        
        ctx.fillStyle = 'white'
        ctx.font = '12px Inter'
        ctx.fillText('BEFORE', 15, 30)
        ctx.fillText('AFTER', splitX + 15, 30)
      } else {
        // Apply image adjustments as individual filters
        const { adjustments } = photo
        
        // Create distinct effects for each adjustment
        const filters = []
        
        // Exposure - primary brightness control
        if (adjustments.exposure !== 0) {
          filters.push(`brightness(${1 + adjustments.exposure / 3})`)
        }
        
        // Contrast - primary contrast control
        if (adjustments.contrast !== 0) {
          filters.push(`contrast(${1 + adjustments.contrast / 80})`)
        }
        
        // Highlights - use invert trick for highlight-specific adjustment
        if (adjustments.highlights !== 0) {
          const highlightStrength = Math.abs(adjustments.highlights) / 200
          if (adjustments.highlights > 0) {
            filters.push(`brightness(${1 + highlightStrength})`)
          } else {
            filters.push(`brightness(${1 - highlightStrength * 0.3})`)
          }
        }
        
        // Shadows - opposite of highlights  
        if (adjustments.shadows !== 0) {
          const shadowStrength = adjustments.shadows / 150
          filters.push(`brightness(${1 + shadowStrength * 0.5})`)
        }
        
        // Whites - subtle brightness in highlights
        if (adjustments.whites !== 0) {
          filters.push(`brightness(${1 + adjustments.whites / 300})`)
        }
        
        // Blacks - affects dark tones
        if (adjustments.blacks !== 0) {
          filters.push(`brightness(${1 + adjustments.blacks / 400})`)
        }
        
        // Clarity - micro-contrast using contrast
        if (adjustments.clarity !== 0) {
          filters.push(`contrast(${1 + adjustments.clarity / 300})`)
        }
        
        // Vibrance - smart saturation (more subtle)
        if (adjustments.vibrance !== 0) {
          filters.push(`saturate(${1 + adjustments.vibrance / 200})`)
        }
        
        // Saturation - full saturation control
        if (adjustments.saturation !== 0) {
          filters.push(`saturate(${1 + adjustments.saturation / 100})`)
        }
        
        // Luminance - brightness with color preservation
        if (adjustments.luminance !== 0) {
          filters.push(`brightness(${1 + adjustments.luminance / 200})`)
        }
        
        // Temperature - warm/cool color shift
        if (adjustments.temperature !== 0) {
          const tempStrength = Math.abs(adjustments.temperature) / 100
          if (adjustments.temperature > 0) {
            // Warm (orange/red)
            filters.push(`sepia(${tempStrength * 0.3}) hue-rotate(15deg)`)
          } else {
            // Cool (blue)
            filters.push(`sepia(${tempStrength * 0.2}) hue-rotate(-30deg)`)
          }
        }
        
        // Tint - green/magenta shift
        if (adjustments.tint !== 0) {
          filters.push(`hue-rotate(${adjustments.tint / 2}deg)`)
        }
        
        // Hue - color wheel rotation
        if (adjustments.hue !== 0) {
          filters.push(`hue-rotate(${adjustments.hue}deg)`)
        }
        
        ctx.filter = filters.length > 0 ? filters.join(' ') : 'none'
        
        // Draw the image
        ctx.drawImage(img, x, y, drawWidth, drawHeight)
      }
      
      // Reset filter for overlay elements
      ctx.filter = 'none'
    }
    
    img.src = photo.url
  }, [photo, zoom, pan, showBeforeAfter])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setLastMousePos({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    
    const deltaX = e.clientX - lastMousePos.x
    const deltaY = e.clientY - lastMousePos.y
    
    setPan(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }))
    
    setLastMousePos({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1
    setZoom(prev => Math.max(0.1, Math.min(5, prev * zoomFactor)))
  }

  const resetView = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  return (
    <div 
      ref={containerRef}
      className="flex-1 bg-lr-darkest relative overflow-hidden"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      />
      
      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 bg-lr-dark bg-opacity-80 rounded px-3 py-2 flex items-center space-x-2">
        <button
          onClick={() => setZoom(prev => Math.max(0.1, prev * 0.8))}
          className="text-sm px-2 py-1 hover:bg-lr-darker rounded"
        >
          -
        </button>
        <span className="text-sm min-w-16 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom(prev => Math.min(5, prev * 1.25))}
          className="text-sm px-2 py-1 hover:bg-lr-darker rounded"
        >
          +
        </button>
        <button
          onClick={resetView}
          className="text-sm px-2 py-1 hover:bg-lr-darker rounded"
        >
          Fit
        </button>
      </div>
      
      {/* Photo info overlay */}
      <div className="absolute top-4 left-4 bg-lr-dark bg-opacity-80 rounded px-3 py-2">
        <div className="text-sm font-medium">{photo.name}</div>
        {photo.metadata && (
          <div className="text-xs text-lr-gray">
            {photo.metadata.width} × {photo.metadata.height} • {photo.metadata.format}
          </div>
        )}
      </div>
    </div>
  )
}

export default PhotoCanvas