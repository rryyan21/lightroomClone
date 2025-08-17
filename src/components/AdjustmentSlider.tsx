import React, { useState } from 'react'

interface AdjustmentSliderProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
}

const AdjustmentSlider: React.FC<AdjustmentSliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  onChange
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState(value.toString())

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value)
    onChange(newValue)
  }

  const handleDoubleClick = () => {
    setIsEditing(true)
    setInputValue(value.toString())
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleInputBlur = () => {
    const newValue = parseFloat(inputValue)
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue)
    } else {
      setInputValue(value.toString())
    }
    setIsEditing(false)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputBlur()
    } else if (e.key === 'Escape') {
      setInputValue(value.toString())
      setIsEditing(false)
    }
  }

  const resetToDefault = () => {
    onChange(0)
  }

  const formatValue = (val: number) => {
    if (step < 1) {
      return val.toFixed(2)
    }
    return Math.round(val).toString()
  }

  return (
    <div className="slider-container">
      <div className="flex items-center justify-between w-full">
        <label className="text-sm text-lr-light min-w-20">{label}</label>
        
        <div className="flex-1 mx-3">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleSliderChange}
            className="adjustment-slider w-full"
          />
        </div>
        
        <div className="min-w-12 text-right">
          {isEditing ? (
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
              className="w-12 bg-lr-dark border border-lr-gray rounded px-1 py-0 text-xs text-center focus:outline-none focus:border-lr-blue"
              autoFocus
            />
          ) : (
            <span
              className="text-xs text-lr-gray cursor-pointer hover:text-lr-light"
              onDoubleClick={handleDoubleClick}
              title="Double-click to edit"
            >
              {formatValue(value)}
            </span>
          )}
        </div>
        
        {value !== 0 && (
          <button
            onClick={resetToDefault}
            className="ml-2 text-xs text-lr-gray hover:text-lr-light"
            title="Reset to default"
          >
            ↺
          </button>
        )}
      </div>
    </div>
  )
}

export default AdjustmentSlider