import React from 'react'
import { usePhotos } from '../contexts/PhotoContext'

const Filmstrip: React.FC = () => {
  const { state, dispatch } = usePhotos()

  const handlePhotoClick = (photoId: string) => {
    dispatch({ type: 'SELECT_PHOTO', photoId })
  }

  if (state.photos.length === 0) {
    return null
  }

  return (
    <div className="h-24 bg-lr-dark border-t border-lr-darker p-2">
      <div className="flex space-x-2 h-full overflow-x-auto">
        {state.photos.map((photo) => (
          <div
            key={photo.id}
            className={`flex-shrink-0 h-full aspect-[3/2] rounded overflow-hidden cursor-pointer transition-all ${
              photo.isSelected 
                ? 'ring-2 ring-lr-blue' 
                : 'hover:ring-1 hover:ring-lr-gray'
            }`}
            onClick={() => handlePhotoClick(photo.id)}
          >
            <img
              src={photo.url}
              alt={photo.name}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Filmstrip