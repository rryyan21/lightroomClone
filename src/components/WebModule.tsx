import React, { useState } from 'react'
import { usePhotos } from '../contexts/PhotoContext'
import { Globe, Upload, Eye, Settings, Monitor, Smartphone, Tablet } from 'lucide-react'

const WebModule: React.FC = () => {
  const { state } = usePhotos()
  const [template, setTemplate] = useState('gallery')
  const [quality, setQuality] = useState(80)
  const [maxSize, setMaxSize] = useState(1920)
  const [devicePreview, setDevicePreview] = useState('desktop')

  const handlePublish = () => {
    if (state.photos.length === 0) {
      alert('No photos to publish')
      return
    }
    alert('Web gallery would be generated and published with current settings')
  }

  const selectedPhotos = state.photos.filter(p => p.isSelected)
  const photosToShow = selectedPhotos.length > 0 ? selectedPhotos : state.photos

  const getDeviceStyle = () => {
    switch (devicePreview) {
      case 'mobile':
        return { maxWidth: '375px', aspectRatio: '9/16' }
      case 'tablet':
        return { maxWidth: '768px', aspectRatio: '4/3' }
      default:
        return { maxWidth: '1200px', aspectRatio: '16/9' }
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-lr-darkest">
      {/* Web Toolbar */}
      <div className="bg-lr-dark border-b border-lr-darker px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold">Web</h2>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handlePublish}
              className="bg-lr-blue text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Publish</span>
            </button>
            <button className="toolbar-button" title="Preview in Browser">
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 bg-lr-darker rounded">
            <button 
              onClick={() => setDevicePreview('desktop')}
              className={`p-2 rounded transition-colors ${devicePreview === 'desktop' ? 'bg-lr-blue text-white' : 'hover:bg-lr-dark'}`}
              title="Desktop Preview"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setDevicePreview('tablet')}
              className={`p-2 rounded transition-colors ${devicePreview === 'tablet' ? 'bg-lr-blue text-white' : 'hover:bg-lr-dark'}`}
              title="Tablet Preview"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setDevicePreview('mobile')}
              className={`p-2 rounded transition-colors ${devicePreview === 'mobile' ? 'bg-lr-blue text-white' : 'hover:bg-lr-dark'}`}
              title="Mobile Preview"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
          <span className="text-sm text-lr-gray">
            {photosToShow.length} photo{photosToShow.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Main Web Area */}
      <div className="flex-1 flex">
        {/* Settings Panel */}
        <div className="w-80 bg-lr-darker border-r border-lr-dark p-4 overflow-y-auto">
          <div className="space-y-6">
            {/* Template Settings */}
            <div>
              <h3 className="text-sm font-semibold text-lr-gray uppercase tracking-wide mb-3 flex items-center">
                <Globe className="w-4 h-4 mr-2" />
                Template
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-lr-gray mb-1">Style</label>
                  <select 
                    value={template}
                    onChange={(e) => setTemplate(e.target.value)}
                    className="w-full bg-lr-dark border border-lr-gray rounded px-2 py-1 text-sm"
                  >
                    <option value="gallery">Gallery</option>
                    <option value="slideshow">Slideshow</option>
                    <option value="portfolio">Portfolio</option>
                    <option value="blog">Photo Blog</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {['Clean', 'Modern', 'Classic', 'Dark'].map((style) => (
                    <button 
                      key={style}
                      className="aspect-video bg-lr-dark border border-lr-gray rounded p-2 hover:border-lr-blue transition-colors text-xs"
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Gallery Settings */}
            <div>
              <h3 className="text-sm font-semibold text-lr-gray uppercase tracking-wide mb-3 flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                Gallery Settings
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-lr-gray mb-1">Columns</label>
                  <select className="w-full bg-lr-dark border border-lr-gray rounded px-2 py-1 text-sm">
                    <option value="3">3 Columns</option>
                    <option value="4">4 Columns</option>
                    <option value="5">5 Columns</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="form-checkbox" defaultChecked />
                    <span className="text-sm">Show Image Info</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="form-checkbox" />
                    <span className="text-sm">Enable Lightbox</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="form-checkbox" />
                    <span className="text-sm">Show EXIF Data</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Image Settings */}
            <div>
              <h3 className="text-sm font-semibold text-lr-gray uppercase tracking-wide mb-3">
                Image Quality
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-lr-gray mb-1">
                    JPEG Quality: {quality}%
                  </label>
                  <input 
                    type="range" 
                    min="60" 
                    max="100" 
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-lr-gray mb-1">Max Dimension</label>
                  <select 
                    value={maxSize}
                    onChange={(e) => setMaxSize(Number(e.target.value))}
                    className="w-full bg-lr-dark border border-lr-gray rounded px-2 py-1 text-sm"
                  >
                    <option value={1024}>1024px</option>
                    <option value={1920}>1920px</option>
                    <option value={2048}>2048px</option>
                    <option value={0}>Original Size</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="form-checkbox" defaultChecked />
                    <span className="text-sm">Web Sharpening</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Upload Settings */}
            <div>
              <h3 className="text-sm font-semibold text-lr-gray uppercase tracking-wide mb-3">
                Upload
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-lr-gray mb-1">Service</label>
                  <select className="w-full bg-lr-dark border border-lr-gray rounded px-2 py-1 text-sm">
                    <option value="ftp">FTP</option>
                    <option value="flickr">Flickr</option>
                    <option value="smugmug">SmugMug</option>
                    <option value="500px">500px</option>
                  </select>
                </div>
                <button className="w-full bg-lr-dark border border-lr-gray rounded px-3 py-2 text-sm hover:border-lr-blue transition-colors">
                  Configure Upload Settings
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex items-center justify-center p-8 bg-gray-100">
            {photosToShow.length > 0 ? (
              <div 
                className="bg-white shadow-2xl rounded-lg overflow-hidden"
                style={getDeviceStyle()}
              >
                {/* Browser header mockup */}
                <div className="bg-gray-200 px-4 py-2 flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="flex-1 bg-white rounded px-2 py-1 text-xs text-gray-600">
                    https://my-gallery.com
                  </div>
                </div>

                {/* Gallery content */}
                <div className="p-4 bg-white">
                  <h1 className="text-xl font-bold mb-4 text-gray-800">My Photo Gallery</h1>
                  <div className={`grid gap-2 ${
                    devicePreview === 'mobile' ? 'grid-cols-2' : 
                    devicePreview === 'tablet' ? 'grid-cols-3' : 'grid-cols-4'
                  }`}>
                    {photosToShow.slice(0, 8).map((photo) => (
                      <div key={photo.id} className="aspect-square overflow-hidden rounded">
                        <img 
                          src={photo.url}
                          alt={photo.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                    ))}
                  </div>
                  {photosToShow.length > 8 && (
                    <div className="text-center mt-4 text-sm text-gray-600">
                      +{photosToShow.length - 8} more photos
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <Globe className="w-16 h-16 text-lr-gray mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No Photos Selected</h3>
                <p className="text-lr-gray">
                  Select photos from the library to create a web gallery
                </p>
              </div>
            )}
          </div>

          {/* Status Bar */}
          <div className="bg-lr-dark border-t border-lr-darker px-4 py-2 flex items-center justify-between text-sm text-lr-gray">
            <div className="flex items-center space-x-4">
              <span>Template: {template}</span>
              <span>Quality: {quality}%</span>
              <span>Max Size: {maxSize > 0 ? `${maxSize}px` : 'Original'}</span>
            </div>
            <span>{devicePreview.charAt(0).toUpperCase() + devicePreview.slice(1)} Preview</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WebModule