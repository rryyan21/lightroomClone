import { useCallback } from 'react'
import { Photo } from '../contexts/PhotoContext'

export const usePhotoExport = () => {
  const exportPhoto = useCallback(async (photo: Photo, format: 'jpeg' | 'png' = 'jpeg') => {
    try {
      // Create a canvas to apply adjustments and export
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Canvas context not available')

      // Load the original image
      const img = new Image()
      img.crossOrigin = 'anonymous'
      
      return new Promise<void>((resolve, reject) => {
        img.onload = () => {
          // Set canvas dimensions
          canvas.width = img.width
          canvas.height = img.height

          // Apply adjustments as CSS filters
          const { adjustments } = photo
          const filters = [
            `brightness(${1 + adjustments.exposure / 100})`,
            `contrast(${1 + adjustments.contrast / 100})`,
            `saturate(${1 + (adjustments.saturation + adjustments.vibrance) / 200})`,
            `hue-rotate(${adjustments.hue}deg)`,
            // Add more filter conversions as needed
          ]
          
          ctx.filter = filters.join(' ')
          
          // Draw the image with filters applied
          ctx.drawImage(img, 0, 0)
          
          // Convert to blob and download
          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('Failed to create blob'))
              return
            }
            
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `${photo.name.split('.')[0]}_edited.${format}`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
            
            resolve()
          }, `image/${format}`, format === 'jpeg' ? 0.9 : undefined)
        }
        
        img.onerror = () => reject(new Error('Failed to load image'))
        img.src = photo.url
      })
    } catch (error) {
      console.error('Export failed:', error)
      throw error
    }
  }, [])

  const exportMultiplePhotos = useCallback(async (photos: Photo[], format: 'jpeg' | 'png' = 'jpeg') => {
    try {
      for (const photo of photos) {
        await exportPhoto(photo, format)
        // Add small delay to prevent browser from blocking multiple downloads
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    } catch (error) {
      console.error('Batch export failed:', error)
      throw error
    }
  }, [exportPhoto])

  return {
    exportPhoto,
    exportMultiplePhotos
  }
}