import React from 'react'
import { Photo, usePhotos } from '../contexts/PhotoContext'

interface PhotoGridProps {
  photos: Photo[]
  viewMode?: 'grid' | 'list'
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ photos, viewMode = 'grid' }) => {
  const { dispatch } = usePhotos()

  const handlePhotoClick = (photoId: string) => {
    dispatch({ type: 'SELECT_PHOTO', photoId })
  }

  const handlePhotoDoubleClick = (photoId: string) => {
    dispatch({ type: 'SELECT_PHOTO', photoId })
    // Navigate to develop module (would typically use router)
    window.location.hash = '#/develop'
  }

  if (viewMode === 'list') {
    return (
      <div className="p-4">
        <div className="space-y-2">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className={`flex items-center p-3 rounded hover:bg-lr-dark transition-colors cursor-pointer ${
                photo.isSelected ? 'bg-lr-blue/20 ring-1 ring-lr-blue' : ''
              }`}
              onClick={() => handlePhotoClick(photo.id)}
              onDoubleClick={() => handlePhotoDoubleClick(photo.id)}
            >
              <img
                src={photo.url}
                alt={photo.name}
                className="w-16 h-12 object-cover rounded mr-4"
                loading="lazy"
              />
              
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{photo.name}</div>
                {photo.metadata && (
                  <div className="text-sm text-lr-gray">
                    {photo.metadata.width}×{photo.metadata.height} • {photo.metadata.format} • {(photo.metadata.size / 1024 / 1024).toFixed(1)}MB
                  </div>
                )}
              </div>
              
              <div className="text-sm text-lr-gray">
                {photo.metadata?.dateCreated?.toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="photo-grid">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className={`photo-thumbnail ${photo.isSelected ? 'ring-2 ring-lr-blue' : ''}`}
          onClick={() => handlePhotoClick(photo.id)}
          onDoubleClick={() => handlePhotoDoubleClick(photo.id)}
        >
          <img
            src={photo.url}
            alt={photo.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          
          {/* Photo overlay with metadata */}
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-end">
            <div className="w-full p-2 text-white text-xs opacity-0 hover:opacity-100 transition-opacity">
              <div className="font-medium truncate">{photo.name}</div>
              {photo.metadata && (
                <div className="text-xs text-gray-300">
                  {photo.metadata.width}×{photo.metadata.height} • {photo.metadata.format}
                </div>
              )}
            </div>
          </div>

          {/* Selection indicator */}
          {photo.isSelected && (
            <div className="absolute top-2 right-2 w-4 h-4 bg-lr-blue rounded-full border-2 border-white" />
          )}
        </div>
      ))}
    </div>
  )
}

export default PhotoGrid