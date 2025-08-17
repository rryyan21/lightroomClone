import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Plus, Grid3X3, List, Search } from 'lucide-react'
import { usePhotos, Photo } from '../contexts/PhotoContext'
import PhotoGrid from './PhotoGrid'
import LibrarySidebar from './LibrarySidebar'

const LibraryModule: React.FC = () => {
  const { state, dispatch, defaultAdjustments } = usePhotos()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newPhotos: Photo[] = acceptedFiles.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      url: URL.createObjectURL(file),
      file,
      adjustments: { ...defaultAdjustments },
      isSelected: false,
      metadata: {
        width: 0,
        height: 0,
        size: file.size,
        format: file.type.split('/')[1]?.toUpperCase() || 'UNKNOWN',
        dateCreated: new Date(file.lastModified),
      }
    }))

    dispatch({ type: 'ADD_PHOTOS', photos: newPhotos })
  }, [dispatch, defaultAdjustments])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.tiff', '.tif', '.raw', '.cr2', '.nef', '.arw']
    },
    multiple: true
  })

  // Filter photos based on search term and active filter
  const filteredPhotos = state.photos.filter(photo => {
    // Search term filter
    const matchesSearch = photo.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Category filter
    let matchesFilter = true
    switch (activeFilter) {
      case 'all':
        matchesFilter = true
        break
      case 'favorites':
        // For demo purposes, mark photos with "fav" in name as favorites
        matchesFilter = photo.name.toLowerCase().includes('fav')
        break
      case 'recent':
        // Recent photos (last 7 days) - for demo, use file date
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
        matchesFilter = photo.metadata?.dateCreated 
          ? photo.metadata.dateCreated > sevenDaysAgo 
          : false
        break
      case 'quick':
        // Quick collection - for demo, photos with "quick" in name
        matchesFilter = photo.name.toLowerCase().includes('quick')
        break
      default:
        // Collection filters
        const collection = state.collections.find(c => c.id === activeFilter)
        matchesFilter = collection ? collection.photoIds.includes(photo.id) : true
    }
    
    return matchesSearch && matchesFilter
  })

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode)
  }

  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId)
  }

  return (
    <div className="flex-1 flex">
      <LibrarySidebar onFilterChange={handleFilterChange} />
      
      <div className="flex-1 flex flex-col">
        {/* Library Toolbar */}
        <div className="bg-lr-dark border-b border-lr-darker px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              {...getRootProps()}
              className="flex items-center space-x-2 bg-lr-blue text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              <input {...getInputProps()} />
              <Plus className="w-4 h-4" />
              <span>Import</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => handleViewModeChange('grid')}
                className={`toolbar-button ${viewMode === 'grid' ? 'bg-lr-blue text-white' : ''}`}
                title="Grid View"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleViewModeChange('list')}
                className={`toolbar-button ${viewMode === 'list' ? 'bg-lr-blue text-white' : ''}`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-lr-gray" />
              <input
                type="text"
                placeholder="Search photos..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="bg-lr-darker border border-lr-gray rounded pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-lr-blue"
              />
            </div>
            
            <span className="text-sm text-lr-gray">
              {filteredPhotos.length} of {state.photos.length} photos
            </span>
          </div>
        </div>

        {/* Photo Grid Area */}
        <div className="flex-1 overflow-auto">
          {state.photos.length === 0 ? (
            <div 
              {...getRootProps()}
              className={`h-full flex items-center justify-center border-2 border-dashed transition-colors ${
                isDragActive 
                  ? 'border-lr-blue bg-lr-blue/10' 
                  : 'border-lr-gray hover:border-lr-blue hover:bg-lr-blue/5'
              }`}
            >
              <input {...getInputProps()} />
              <div className="text-center">
                <Plus className="w-12 h-12 text-lr-gray mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Import Your Photos</h3>
                <p className="text-lr-gray mb-4">
                  Drag and drop images here, or click to select files
                </p>
                <button className="bg-lr-blue text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors">
                  Select Photos
                </button>
              </div>
            </div>
          ) : filteredPhotos.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Search className="w-12 h-12 text-lr-gray mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No photos found</h3>
                <p className="text-lr-gray">
                  Try adjusting your search terms
                </p>
              </div>
            </div>
          ) : (
            <PhotoGrid photos={filteredPhotos} viewMode={viewMode} />
          )}
        </div>
      </div>
    </div>
  )
}

export default LibraryModule