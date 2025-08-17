import React, { createContext, useContext, useReducer, ReactNode } from 'react'

export interface Photo {
  id: string
  name: string
  url: string
  file: File
  metadata?: {
    width: number
    height: number
    size: number
    format: string
    dateCreated: Date
    camera?: string
    lens?: string
    iso?: number
    aperture?: number
    shutterSpeed?: string
    focalLength?: number
  }
  adjustments: PhotoAdjustments
  isSelected: boolean
}

export interface PhotoAdjustments {
  exposure: number
  contrast: number
  highlights: number
  shadows: number
  whites: number
  blacks: number
  clarity: number
  vibrance: number
  saturation: number
  temperature: number
  tint: number
  // HSL adjustments
  hue: number
  luminance: number
  // Tone curve points
  toneCurve: { x: number; y: number }[]
}

interface PhotoState {
  photos: Photo[]
  selectedPhotoId: string | null
  currentPhoto: Photo | null
  collections: Collection[]
  presets: Preset[]
}

interface Collection {
  id: string
  name: string
  photoIds: string[]
}

interface Preset {
  id: string
  name: string
  adjustments: PhotoAdjustments
}

type PhotoAction =
  | { type: 'ADD_PHOTOS'; photos: Photo[] }
  | { type: 'SELECT_PHOTO'; photoId: string }
  | { type: 'UPDATE_ADJUSTMENTS'; photoId: string; adjustments: Partial<PhotoAdjustments> }
  | { type: 'REMOVE_PHOTO'; photoId: string }
  | { type: 'CREATE_COLLECTION'; collection: Collection }
  | { type: 'ADD_COLLECTION'; collection: Collection }
  | { type: 'ADD_PRESET'; preset: Preset }
  | { type: 'APPLY_PRESET'; photoId: string; preset: Preset }
  | { type: 'SELECT_ALL_PHOTOS' }
  | { type: 'DESELECT_ALL_PHOTOS' }
  | { type: 'DELETE_SELECTED_PHOTOS' }

const defaultAdjustments: PhotoAdjustments = {
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

const initialState: PhotoState = {
  photos: [],
  selectedPhotoId: null,
  currentPhoto: null,
  collections: [],
  presets: []
}

function photoReducer(state: PhotoState, action: PhotoAction): PhotoState {
  switch (action.type) {
    case 'ADD_PHOTOS':
      return {
        ...state,
        photos: [...state.photos, ...action.photos]
      }
    
    case 'SELECT_PHOTO':
      const selectedPhoto = state.photos.find(p => p.id === action.photoId) || null
      return {
        ...state,
        selectedPhotoId: action.photoId,
        currentPhoto: selectedPhoto,
        photos: state.photos.map(photo => ({
          ...photo,
          isSelected: photo.id === action.photoId
        }))
      }
    
    case 'UPDATE_ADJUSTMENTS':
      return {
        ...state,
        photos: state.photos.map(photo =>
          photo.id === action.photoId
            ? { ...photo, adjustments: { ...photo.adjustments, ...action.adjustments } }
            : photo
        ),
        currentPhoto: state.currentPhoto?.id === action.photoId
          ? { ...state.currentPhoto, adjustments: { ...state.currentPhoto.adjustments, ...action.adjustments } }
          : state.currentPhoto
      }
    
    case 'REMOVE_PHOTO':
      return {
        ...state,
        photos: state.photos.filter(photo => photo.id !== action.photoId),
        selectedPhotoId: state.selectedPhotoId === action.photoId ? null : state.selectedPhotoId,
        currentPhoto: state.currentPhoto?.id === action.photoId ? null : state.currentPhoto
      }
    
    case 'CREATE_COLLECTION':
      return {
        ...state,
        collections: [...state.collections, action.collection]
      }
    
    case 'ADD_COLLECTION':
      return {
        ...state,
        collections: [...state.collections, action.collection]
      }
    
    case 'ADD_PRESET':
      return {
        ...state,
        presets: [...state.presets, action.preset]
      }
    
    case 'APPLY_PRESET':
      return {
        ...state,
        photos: state.photos.map(photo =>
          photo.id === action.photoId
            ? { ...photo, adjustments: { ...action.preset.adjustments } }
            : photo
        ),
        currentPhoto: state.currentPhoto?.id === action.photoId
          ? { ...state.currentPhoto, adjustments: { ...action.preset.adjustments } }
          : state.currentPhoto
      }
    
    case 'SELECT_ALL_PHOTOS':
      return {
        ...state,
        photos: state.photos.map(photo => ({ ...photo, isSelected: true }))
      }
    
    case 'DESELECT_ALL_PHOTOS':
      return {
        ...state,
        photos: state.photos.map(photo => ({ ...photo, isSelected: false })),
        selectedPhotoId: null,
        currentPhoto: null
      }
    
    case 'DELETE_SELECTED_PHOTOS':
      const remainingPhotos = state.photos.filter(photo => !photo.isSelected)
      const currentPhotoStillExists = state.currentPhoto && remainingPhotos.some(p => p.id === state.currentPhoto!.id)
      return {
        ...state,
        photos: remainingPhotos,
        selectedPhotoId: currentPhotoStillExists ? state.selectedPhotoId : null,
        currentPhoto: currentPhotoStillExists ? state.currentPhoto : null
      }
    
    default:
      return state
  }
}

const PhotoContext = createContext<{
  state: PhotoState
  dispatch: React.Dispatch<PhotoAction>
  defaultAdjustments: PhotoAdjustments
} | null>(null)

export function PhotoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(photoReducer, initialState)

  return (
    <PhotoContext.Provider value={{ state, dispatch, defaultAdjustments }}>
      {children}
    </PhotoContext.Provider>
  )
}

export function usePhotos() {
  const context = useContext(PhotoContext)
  if (!context) {
    throw new Error('usePhotos must be used within a PhotoProvider')
  }
  return context
}