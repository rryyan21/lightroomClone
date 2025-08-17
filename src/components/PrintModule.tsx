import React, { useState } from 'react'
import { usePhotos } from '../contexts/PhotoContext'
import { Printer, FileText, Layout, Settings as SettingsIcon } from 'lucide-react'

const PrintModule: React.FC = () => {
  const { state } = usePhotos()
  const [paperSize, setPaperSize] = useState('A4')
  const [orientation, setOrientation] = useState('portrait')
  const [layout, setLayout] = useState('single')
  const [resolution, setResolution] = useState(300)

  const handlePrint = () => {
    if (state.photos.length === 0) {
      alert('No photos to print')
      return
    }
    alert('Print functionality would send photos to printer with current settings')
  }

  const selectedPhotos = state.photos.filter(p => p.isSelected)
  const photosToShow = selectedPhotos.length > 0 ? selectedPhotos : state.photos.slice(0, 1)

  return (
    <div className="flex-1 flex flex-col bg-lr-darkest">
      {/* Print Toolbar */}
      <div className="bg-lr-dark border-b border-lr-darker px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold">Print</h2>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handlePrint}
              className="bg-lr-blue text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors flex items-center space-x-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-sm text-lr-gray">
            {photosToShow.length} photo{photosToShow.length !== 1 ? 's' : ''} selected
          </span>
        </div>
      </div>

      {/* Main Print Area */}
      <div className="flex-1 flex">
        {/* Settings Panel */}
        <div className="w-80 bg-lr-darker border-r border-lr-dark p-4 overflow-y-auto">
          <div className="space-y-6">
            {/* Paper Settings */}
            <div>
              <h3 className="text-sm font-semibold text-lr-gray uppercase tracking-wide mb-3 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Paper
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-lr-gray mb-1">Size</label>
                  <select 
                    value={paperSize}
                    onChange={(e) => setPaperSize(e.target.value)}
                    className="w-full bg-lr-dark border border-lr-gray rounded px-2 py-1 text-sm"
                  >
                    <option value="A4">A4 (210 × 297 mm)</option>
                    <option value="A3">A3 (297 × 420 mm)</option>
                    <option value="Letter">Letter (8.5 × 11 in)</option>
                    <option value="Legal">Legal (8.5 × 14 in)</option>
                    <option value="4x6">4×6 in</option>
                    <option value="5x7">5×7 in</option>
                    <option value="8x10">8×10 in</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-lr-gray mb-1">Orientation</label>
                  <select 
                    value={orientation}
                    onChange={(e) => setOrientation(e.target.value)}
                    className="w-full bg-lr-dark border border-lr-gray rounded px-2 py-1 text-sm"
                  >
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Layout Settings */}
            <div>
              <h3 className="text-sm font-semibold text-lr-gray uppercase tracking-wide mb-3 flex items-center">
                <Layout className="w-4 h-4 mr-2" />
                Layout
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-lr-gray mb-1">Type</label>
                  <select 
                    value={layout}
                    onChange={(e) => setLayout(e.target.value)}
                    className="w-full bg-lr-dark border border-lr-gray rounded px-2 py-1 text-sm"
                  >
                    <option value="single">Single Photo</option>
                    <option value="contact">Contact Sheet</option>
                    <option value="package">Picture Package</option>
                    <option value="custom">Custom Package</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button className="aspect-square bg-lr-dark border border-lr-gray rounded p-2 hover:border-lr-blue transition-colors">
                    <div className="w-full h-full border-2 border-dashed border-lr-gray rounded"></div>
                  </button>
                  <button className="aspect-square bg-lr-dark border border-lr-gray rounded p-2 hover:border-lr-blue transition-colors">
                    <div className="grid grid-cols-2 gap-1 w-full h-full">
                      <div className="border border-lr-gray rounded"></div>
                      <div className="border border-lr-gray rounded"></div>
                      <div className="border border-lr-gray rounded"></div>
                      <div className="border border-lr-gray rounded"></div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Print Settings */}
            <div>
              <h3 className="text-sm font-semibold text-lr-gray uppercase tracking-wide mb-3 flex items-center">
                <SettingsIcon className="w-4 h-4 mr-2" />
                Quality
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-lr-gray mb-1">Resolution</label>
                  <select 
                    value={resolution}
                    onChange={(e) => setResolution(Number(e.target.value))}
                    className="w-full bg-lr-dark border border-lr-gray rounded px-2 py-1 text-sm"
                  >
                    <option value={150}>150 DPI (Draft)</option>
                    <option value={300}>300 DPI (Standard)</option>
                    <option value={600}>600 DPI (High Quality)</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="form-checkbox" />
                    <span className="text-sm">High Quality Print</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="form-checkbox" />
                    <span className="text-sm">Print Sharpening</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex items-center justify-center p-8">
            {photosToShow.length > 0 ? (
              <div className="bg-white shadow-2xl" style={{ 
                aspectRatio: orientation === 'portrait' ? '1/1.414' : '1.414/1',
                maxHeight: '80vh',
                maxWidth: '80vw'
              }}>
                {/* Paper preview */}
                <div className="w-full h-full p-8 flex items-center justify-center">
                  {layout === 'single' ? (
                    <img 
                      src={photosToShow[0].url}
                      alt={photosToShow[0].name}
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div className="grid grid-cols-2 gap-4 w-full h-full">
                      {photosToShow.slice(0, 4).map((photo) => (
                        <img 
                          key={photo.id}
                          src={photo.url}
                          alt={photo.name}
                          className="w-full h-full object-cover rounded"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <Printer className="w-16 h-16 text-lr-gray mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No Photos Selected</h3>
                <p className="text-lr-gray">
                  Select photos from the library to print
                </p>
              </div>
            )}
          </div>

          {/* Page Info */}
          <div className="bg-lr-dark border-t border-lr-darker px-4 py-2 flex items-center justify-between text-sm text-lr-gray">
            <div className="flex items-center space-x-4">
              <span>Paper: {paperSize}</span>
              <span>Resolution: {resolution} DPI</span>
              <span>Layout: {layout}</span>
            </div>
            <span>Page 1 of 1</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrintModule