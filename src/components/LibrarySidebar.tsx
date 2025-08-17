import React, { useState } from 'react'
import { Folder, Star, Heart, Calendar, Camera, Tag } from 'lucide-react'
import { usePhotos } from '../contexts/PhotoContext'

interface LibrarySidebarProps {
  onFilterChange?: (filterId: string) => void
}

const LibrarySidebar: React.FC<LibrarySidebarProps> = ({ onFilterChange }) => {
  const { state } = usePhotos()
  const [activeFilter, setActiveFilter] = useState('all')

  const handleFilterClick = (filterId: string) => {
    setActiveFilter(filterId)
    onFilterChange?.(filterId)
    
    // Show filter feedback
    switch (filterId) {
      case 'all':
        console.log('Showing all photographs')
        break
      case 'quick':
        console.log('Showing quick collection')
        break
      case 'favorites':
        console.log('Showing favorites')
        break
      case 'recent':
        console.log('Showing recent photos')
        break
      default:
        console.log(`Filter activated: ${filterId}`)
    }
  }

  const sidebarSections = [
    {
      title: 'Catalog',
      items: [
        { id: 'all', icon: Folder, label: 'All Photographs', count: state.photos.length },
        { id: 'quick', icon: Star, label: 'Quick Collection', count: 0 },
        { id: 'favorites', icon: Heart, label: 'Favorites', count: 0 },
        { id: 'recent', icon: Calendar, label: 'Recent', count: 0 },
      ]
    },
    {
      title: 'Collections',
      items: state.collections.map(collection => ({
        id: collection.id,
        icon: Folder,
        label: collection.name,
        count: collection.photoIds.length
      }))
    },
    {
      title: 'Publish Services',
      items: [
        { id: 'flickr', icon: Camera, label: 'Flickr', count: 0 },
        { id: 'stock', icon: Camera, label: 'Adobe Stock', count: 0 },
      ]
    }
  ]

  return (
    <div className="w-64 bg-lr-darker border-r border-lr-dark panel-divider">
      <div className="p-4">
        <h2 className="text-sm font-semibold text-lr-gray uppercase tracking-wide mb-4">
          Navigator
        </h2>
        
        {/* Mini preview/navigator would go here */}
        <div className="w-full h-32 bg-lr-dark rounded mb-6 flex items-center justify-center">
          <span className="text-lr-gray text-xs">Navigator Preview</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {sidebarSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6">
            <div className="px-4 py-2 border-b border-lr-dark">
              <h3 className="text-sm font-semibold text-lr-gray uppercase tracking-wide">
                {section.title}
              </h3>
            </div>
            
            <div className="py-2">
              {section.items.map((item, itemIndex) => (
                <button
                  key={itemIndex}
                  onClick={() => handleFilterClick(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-2 text-sm transition-colors text-left ${
                    activeFilter === item.id ? 'bg-lr-blue text-white' : 'hover:bg-lr-dark'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-4 h-4 text-lr-gray" />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-lr-gray text-xs">{item.count}</span>
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Keywords section */}
        <div className="px-4 py-2 border-b border-lr-dark">
          <h3 className="text-sm font-semibold text-lr-gray uppercase tracking-wide">
            Keywords
          </h3>
        </div>
        
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Tag className="w-4 h-4 text-lr-gray" />
            <input
              type="text"
              placeholder="Add keywords..."
              className="flex-1 bg-lr-dark border border-lr-gray rounded px-2 py-1 text-xs focus:outline-none focus:border-lr-blue"
            />
          </div>
          
          <div className="space-y-1">
            {['Landscape', 'Portrait', 'Nature', 'Street'].map((keyword) => (
              <div key={keyword} className="flex items-center justify-between text-xs">
                <span className="text-lr-gray">{keyword}</span>
                <span className="text-lr-gray">0</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LibrarySidebar