import React, { useEffect, useRef } from 'react'
import { Photo } from '../contexts/PhotoContext'

interface HistogramProps {
  photo?: Photo | null
}

const Histogram: React.FC<HistogramProps> = ({ photo }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !photo) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Create a temporary image to analyze
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      // Create a small canvas to sample the image
      const sampleCanvas = document.createElement('canvas')
      const sampleCtx = sampleCanvas.getContext('2d')
      if (!sampleCtx) return

      // Sample at a smaller size for performance
      const sampleSize = 64
      sampleCanvas.width = sampleSize
      sampleCanvas.height = sampleSize

      // Draw image to sample canvas
      sampleCtx.drawImage(img, 0, 0, sampleSize, sampleSize)
      
      try {
        const imageData = sampleCtx.getImageData(0, 0, sampleSize, sampleSize)
        const data = imageData.data

        // Initialize histogram arrays
        const redHist = new Array(256).fill(0)
        const greenHist = new Array(256).fill(0)
        const blueHist = new Array(256).fill(0)

        // Calculate histogram
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]
          
          redHist[r]++
          greenHist[g]++
          blueHist[b]++
        }

        // Find max value for normalization
        const maxR = Math.max(...redHist)
        const maxG = Math.max(...greenHist)
        const maxB = Math.max(...blueHist)
        const maxValue = Math.max(maxR, maxG, maxB)

        if (maxValue === 0) return

        // Draw histogram
        const width = canvas.width
        const height = canvas.height
        const barWidth = width / 256

        // Draw background
        ctx.fillStyle = '#1a1a1a'
        ctx.fillRect(0, 0, width, height)

        // Draw grid lines
        ctx.strokeStyle = '#333'
        ctx.lineWidth = 1
        for (let i = 0; i <= 4; i++) {
          const y = (height / 4) * i
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(width, y)
          ctx.stroke()
        }

        // Draw histograms with blend mode
        ctx.globalCompositeOperation = 'screen'

        // Red histogram
        ctx.fillStyle = 'rgba(255, 0, 0, 0.6)'
        for (let i = 0; i < 256; i++) {
          const barHeight = (redHist[i] / maxValue) * height
          ctx.fillRect(i * barWidth, height - barHeight, barWidth, barHeight)
        }

        // Green histogram
        ctx.fillStyle = 'rgba(0, 255, 0, 0.6)'
        for (let i = 0; i < 256; i++) {
          const barHeight = (greenHist[i] / maxValue) * height
          ctx.fillRect(i * barWidth, height - barHeight, barWidth, barHeight)
        }

        // Blue histogram
        ctx.fillStyle = 'rgba(0, 0, 255, 0.6)'
        for (let i = 0; i < 256; i++) {
          const barHeight = (blueHist[i] / maxValue) * height
          ctx.fillRect(i * barWidth, height - barHeight, barWidth, barHeight)
        }

        ctx.globalCompositeOperation = 'source-over'
      } catch (error) {
        // Handle CORS or other errors by showing a placeholder
        console.warn('Could not analyze image for histogram:', error)
        drawPlaceholderHistogram(ctx, canvas.width, canvas.height)
      }
    }

    img.onerror = () => {
      drawPlaceholderHistogram(ctx, canvas.width, canvas.height)
    }

    img.src = photo.url
  }, [photo])

  const drawPlaceholderHistogram = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Clear canvas
    ctx.clearRect(0, 0, width, height)
    
    // Draw background
    ctx.fillStyle = '#1a1a1a'
    ctx.fillRect(0, 0, width, height)

    // Draw sample histogram shape
    ctx.fillStyle = 'rgba(100, 100, 100, 0.5)'
    ctx.beginPath()
    for (let i = 0; i <= width; i++) {
      const x = i
      // Create a bell curve-like shape
      const normalizedX = (i / width) * 6 - 3
      const y = height - (Math.exp(-normalizedX * normalizedX / 2) * height * 0.8)
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.lineTo(width, height)
    ctx.lineTo(0, height)
    ctx.closePath()
    ctx.fill()

    // Add text
    ctx.fillStyle = '#666'
    ctx.font = '10px Inter'
    ctx.textAlign = 'center'
    ctx.fillText('RGB', width / 2, height / 2)
  }

  return (
    <div className="w-full h-24 bg-lr-dark rounded overflow-hidden">
      <canvas 
        ref={canvasRef}
        width={240}
        height={96}
        className="w-full h-full"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  )
}

export default Histogram