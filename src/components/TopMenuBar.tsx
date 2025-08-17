import React, { useState, useRef, useEffect } from 'react'
import { FileImage, Download, Upload, Settings, HelpCircle } from 'lucide-react'
import { usePhotos } from '../contexts/PhotoContext'
import { usePhotoExport } from '../hooks/usePhotoExport'

const TopMenuBar: React.FC = () => {
  const { state, dispatch, defaultAdjustments } = usePhotos()
  const { exportPhoto, exportMultiplePhotos } = usePhotoExport()
  const [isExporting, setIsExporting] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.accept = 'image/*'
    
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement
      if (target.files) {
        const files = Array.from(target.files)
        const newPhotos = files.map((file) => ({
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

        // Add the photos to the state
        dispatch({ type: 'ADD_PHOTOS', photos: newPhotos })
      }
    }
    
    input.click()
  }

  const handleExport = async () => {
    if (!state.currentPhoto && state.photos.length === 0) {
      alert('No photos to export')
      return
    }

    setIsExporting(true)
    try {
      if (state.currentPhoto) {
        await exportPhoto(state.currentPhoto, 'jpeg')
      } else {
        // Export all photos if no specific photo is selected
        const selectedPhotos = state.photos.filter(p => p.isSelected)
        if (selectedPhotos.length > 0) {
          await exportMultiplePhotos(selectedPhotos, 'jpeg')
        } else {
          await exportMultiplePhotos(state.photos, 'jpeg')
        }
      }
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const handleSettings = () => {
    alert('Settings panel coming soon!')
  }

  const handleHelp = () => {
    alert('Lightroom Clone Help\n\nKeyboard Shortcuts:\n- Space: Switch modules\n- G: Grid view\n- D: Develop module\n- R: Reset adjustments\n\nDrag and drop photos to import.\nDouble-click photos to edit.')
  }

  // Handle dropdown menu functionality
  const handleMenuClick = (menuName: string) => {
    setActiveDropdown(activeDropdown === menuName ? null : menuName)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Menu item handlers
  const handleMenuAction = (action: string) => {
    setActiveDropdown(null)
    
    switch (action) {
      case 'new-collection':
        const name = prompt('Enter collection name:')
        if (name) {
          dispatch({ 
            type: 'ADD_COLLECTION', 
            collection: { id: crypto.randomUUID(), name, photoIds: [] }
          })
        }
        break
      case 'import':
        handleImport()
        break
      case 'export':
        handleExport()
        break
      case 'undo':
        // TODO: Implement undo functionality
        alert('Undo functionality coming soon!')
        break
      case 'redo':
        // TODO: Implement redo functionality
        alert('Redo functionality coming soon!')
        break
      case 'select-all':
        dispatch({ type: 'SELECT_ALL_PHOTOS' })
        break
      case 'deselect-all':
        dispatch({ type: 'DESELECT_ALL_PHOTOS' })
        break
      case 'delete-selected':
        if (confirm('Delete selected photos?')) {
          dispatch({ type: 'DELETE_SELECTED_PHOTOS' })
        }
        break
      case 'auto-adjust':
        if (state.currentPhoto) {
          const autoAdjustments = {
            exposure: Math.random() * 0.5 - 0.25,
            contrast: Math.random() * 20 - 10,
            shadows: Math.random() * 30 + 10,
            highlights: Math.random() * -20 - 10,
            vibrance: Math.random() * 20 + 5,
          }
          dispatch({
            type: 'UPDATE_ADJUSTMENTS',
            photoId: state.currentPhoto.id,
            adjustments: autoAdjustments
          })
        }
        break
      case 'reset':
        if (state.currentPhoto) {
          dispatch({
            type: 'UPDATE_ADJUSTMENTS',
            photoId: state.currentPhoto.id,
            adjustments: { ...defaultAdjustments }
          })
        }
        break
      case 'fullscreen':
        if (document.fullscreenElement) {
          document.exitFullscreen()
        } else {
          document.documentElement.requestFullscreen()
        }
        break
      case 'zoom-fit':
        // This would trigger a fit-to-screen in PhotoCanvas
        window.dispatchEvent(new CustomEvent('photoCanvas:fit'))
        break
      case 'zoom-100':
        window.dispatchEvent(new CustomEvent('photoCanvas:zoom100'))
        break
      default:
        alert(`${action} functionality coming soon!`)
    }
  }

  // Define dropdown menu types
  type MenuItem = 
    | { label: string; action: string; shortcut?: string }
    | { label: '---' }

  // Define dropdown menus
  const dropdownMenus: Record<string, MenuItem[]> = {
    File: [
      { label: 'New Collection...', action: 'new-collection' },
      { label: 'Import Photos...', action: 'import', shortcut: 'Ctrl+Shift+I' },
      { label: 'Export...', action: 'export', shortcut: 'Ctrl+E' },
      { label: '---' },
      { label: 'Exit', action: 'exit' }
    ],
    Edit: [
      { label: 'Undo', action: 'undo', shortcut: 'Ctrl+Z' },
      { label: 'Redo', action: 'redo', shortcut: 'Ctrl+Y' },
      { label: '---' },
      { label: 'Select All', action: 'select-all', shortcut: 'Ctrl+A' },
      { label: 'Deselect All', action: 'deselect-all', shortcut: 'Ctrl+D' },
      { label: '---' },
      { label: 'Delete Selected', action: 'delete-selected', shortcut: 'Delete' }
    ],
    Library: [
      { label: 'Grid View', action: 'grid-view', shortcut: 'G' },
      { label: 'Loupe View', action: 'loupe-view', shortcut: 'E' },
      { label: '---' },
      { label: 'Find Photos', action: 'find-photos', shortcut: 'Ctrl+F' },
      { label: 'Filter Photos', action: 'filter-photos' }
    ],
    Photo: [
      { label: 'Auto Adjust', action: 'auto-adjust', shortcut: 'Ctrl+U' },
      { label: 'Reset', action: 'reset', shortcut: 'Ctrl+R' },
      { label: '---' },
      { label: 'Rotate Left', action: 'rotate-left', shortcut: 'Ctrl+[' },
      { label: 'Rotate Right', action: 'rotate-right', shortcut: 'Ctrl+]' },
      { label: '---' },
      { label: 'Flag as Pick', action: 'flag-pick', shortcut: 'P' },
      { label: 'Flag as Reject', action: 'flag-reject', shortcut: 'X' }
    ],
    Metadata: [
      { label: 'Edit Metadata', action: 'edit-metadata' },
      { label: 'Read Metadata', action: 'read-metadata' },
      { label: '---' },
      { label: 'Add Keywords', action: 'add-keywords', shortcut: 'Ctrl+K' },
      { label: 'Remove Keywords', action: 'remove-keywords' }
    ],
    View: [
      { label: 'Fit to Screen', action: 'zoom-fit', shortcut: 'Ctrl+0' },
      { label: 'Actual Size', action: 'zoom-100', shortcut: 'Ctrl+1' },
      { label: '---' },
      { label: 'Fullscreen', action: 'fullscreen', shortcut: 'F' },
      { label: 'Show Info', action: 'show-info', shortcut: 'I' }
    ],
    Window: [
      { label: 'Minimize', action: 'minimize' },
      { label: 'Bring All to Front', action: 'bring-to-front' },
      { label: '---' },
      { label: 'Library', action: 'show-library' },
      { label: 'Develop', action: 'show-develop' }
    ]
  }

  return (
    <div className="bg-lr-darker border-b border-lr-dark px-4 py-2 flex items-center justify-between">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <FileImage className="w-5 h-5 text-lr-blue" />
          <span className="font-semibold text-sm">Lightroom Clone</span>
        </div>
        
        <nav className="flex items-center space-x-4 relative" ref={dropdownRef}>
          {Object.keys(dropdownMenus).map((menuName) => (
            <div key={menuName} className="relative">
              <button 
                onClick={() => handleMenuClick(menuName)}
                className={`text-sm hover:text-lr-blue transition-colors flex items-center space-x-1 ${
                  activeDropdown === menuName ? 'text-lr-blue' : ''
                }`}
              >
                <span>{menuName}</span>
              </button>
              
              {activeDropdown === menuName && (
                <div className="absolute top-full left-0 mt-1 bg-lr-dark border border-lr-gray rounded shadow-lg min-w-48 z-50">
                  {dropdownMenus[menuName as keyof typeof dropdownMenus].map((item, index) => (
                    item.label === '---' ? (
                      <div key={index} className="border-t border-lr-gray my-1" />
                    ) : (
                      <button
                        key={index}
                        onClick={() => handleMenuAction((item as { action: string }).action)}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-lr-darker transition-colors flex items-center justify-between"
                      >
                        <span>{item.label}</span>
                        {'shortcut' in item && item.shortcut && (
                          <span className="text-lr-gray text-xs">{item.shortcut}</span>
                        )}
                      </button>
                    )
                  ))}
                </div>
              )}
            </div>
          ))}
          <button 
            onClick={handleHelp}
            className="text-sm hover:text-lr-blue transition-colors"
          >
            Help
          </button>
        </nav>
      </div>
      
      <div className="flex items-center space-x-2">
        <button onClick={handleImport} className="toolbar-button" title="Import Photos">
          <Upload className="w-4 h-4" />
        </button>
        <button 
          onClick={handleExport} 
          disabled={isExporting}
          className={`toolbar-button ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`} 
          title="Export Photos"
        >
          <Download className="w-4 h-4" />
        </button>
        <button onClick={handleSettings} className="toolbar-button" title="Settings">
          <Settings className="w-4 h-4" />
        </button>
        <button onClick={handleHelp} className="toolbar-button" title="Help">
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default TopMenuBar