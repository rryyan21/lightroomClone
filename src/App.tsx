import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import TopMenuBar from './components/TopMenuBar'
import ModuleSelector from './components/ModuleSelector'
import LibraryModule from './components/LibraryModule'
import DevelopModule from './components/DevelopModule'
import SlideshowModule from './components/SlideshowModule'
import PrintModule from './components/PrintModule'
import WebModule from './components/WebModule'
import { PhotoProvider } from './contexts/PhotoContext'
import './App.css'

export type Module = 'library' | 'develop' | 'slideshow' | 'print' | 'web'

function App() {
  const [currentModule, setCurrentModule] = useState<Module>('library')

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement) return

      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault()
          // Toggle between Library and Develop
          setCurrentModule(prev => prev === 'library' ? 'develop' : 'library')
          break
        case 'g':
          e.preventDefault()
          setCurrentModule('library')
          break
        case 'd':
          e.preventDefault()
          setCurrentModule('develop')
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const renderModule = () => {
    switch (currentModule) {
      case 'library':
        return <LibraryModule />
      case 'develop':
        return <DevelopModule />
      case 'slideshow':
        return <SlideshowModule />
      case 'print':
        return <PrintModule />
      case 'web':
        return <WebModule />
      default:
        return <LibraryModule />
    }
  }

  return (
    <PhotoProvider>
      <Router>
        <div className="h-screen flex flex-col bg-lr-darkest text-lr-light">
          <TopMenuBar />
          
          <div className="flex-1 flex flex-col">
            <ModuleSelector 
              currentModule={currentModule} 
              onModuleChange={setCurrentModule} 
            />
            
            <div className="flex-1 overflow-hidden">
              <Routes>
                <Route path="/" element={renderModule()} />
                <Route path="/library" element={<LibraryModule />} />
                <Route path="/develop" element={<DevelopModule />} />
                <Route path="/slideshow" element={<SlideshowModule />} />
                <Route path="/print" element={<PrintModule />} />
                <Route path="/web" element={<WebModule />} />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </PhotoProvider>
  )
}

export default App