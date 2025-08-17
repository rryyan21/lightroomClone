import React from 'react'
import { Module } from '../App'

interface ModuleSelectorProps {
  currentModule: Module
  onModuleChange: (module: Module) => void
}

const ModuleSelector: React.FC<ModuleSelectorProps> = ({ currentModule, onModuleChange }) => {
  const modules: { id: Module; name: string }[] = [
    { id: 'library', name: 'Library' },
    { id: 'develop', name: 'Develop' },
    { id: 'slideshow', name: 'Slideshow' },
    { id: 'print', name: 'Print' },
    { id: 'web', name: 'Web' },
  ]

  return (
    <div className="bg-lr-dark border-b border-lr-darker px-4 py-3">
      <div className="flex items-center justify-center space-x-8">
        {modules.map((module) => (
          <button
            key={module.id}
            onClick={() => onModuleChange(module.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors rounded ${
              currentModule === module.id
                ? 'bg-lr-blue text-white'
                : 'text-lr-gray hover:text-lr-light'
            }`}
          >
            {module.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default ModuleSelector