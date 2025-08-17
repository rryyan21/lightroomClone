# Lightroom Clone

A web-based Adobe Lightroom clone built with React, TypeScript, and modern web technologies. This application provides photo organization, non-destructive editing, and professional-grade image adjustment tools.

## Features

### ✅ Completed

- **Photo Library**: Import and organize photos with drag-and-drop support
- **Develop Module**: Professional adjustment panels (Basic, Presence, White Balance, HSL)
- **Non-destructive Editing**: Real-time adjustments without modifying original files
- **Modern UI**: Dark theme with Lightroom-inspired interface
- **Photo Canvas**: Interactive canvas with zoom, pan, and real-time preview
- **Filmstrip**: Quick photo navigation in develop mode
- **Responsive Design**: Optimized for desktop editing workflows

### 🚧 In Progress

- Import/Export functionality with multiple format support
- Collections and keywords management
- Presets system for saving and applying adjustment combinations
- Local adjustment tools (graduated filters, radial filters, masking)
- Performance optimization for large photo libraries

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Image Processing**: HTML5 Canvas with CSS filters
- **File Handling**: React Dropzone
- **State Management**: React Context + useReducer
- **Icons**: Lucide React

## Quick Start

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Start the development server**:

   ```bash
   npm run dev
   ```

3. **Open your browser** to `http://localhost:3000`

## Usage

### Importing Photos

1. Navigate to the **Library** module
2. Drag and drop photos or click "Import" to select files
3. Supported formats: JPEG, PNG, TIFF, and RAW files

### Editing Photos

1. Select a photo from the library grid
2. Double-click or switch to the **Develop** module
3. Use the adjustment panels on the right to modify your photo:
   - **Basic**: Exposure, Contrast, Highlights, Shadows, Whites, Blacks
   - **Presence**: Clarity, Vibrance, Saturation
   - **White Balance**: Temperature and Tint
   - **HSL**: Hue and Luminance adjustments

### Navigation

- **Zoom**: Mouse wheel to zoom in/out
- **Pan**: Click and drag to move around the photo
- **Reset View**: Click "Fit" to reset zoom and position
- **Filmstrip**: Click thumbnails to switch between photos

## Project Structure

```
src/
├── components/          # React components
│   ├── AdjustmentSlider.tsx    # Reusable slider component
│   ├── DevelopModule.tsx       # Main develop workspace
│   ├── DevelopSidebar.tsx      # Adjustment panels
│   ├── DevelopToolbar.tsx      # Tool selection
│   ├── Filmstrip.tsx           # Photo navigation
│   ├── LibraryModule.tsx       # Photo library and import
│   ├── LibrarySidebar.tsx      # Collections and keywords
│   ├── ModuleSelector.tsx      # Module navigation
│   ├── PhotoCanvas.tsx         # Main photo display
│   ├── PhotoGrid.tsx           # Photo grid view
│   └── TopMenuBar.tsx          # Application menu
├── contexts/           # React contexts
│   └── PhotoContext.tsx       # Photo state management
├── App.tsx            # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Keyboard Shortcuts

- `Space` - Toggle between Library and Develop modules
- `G` - Grid view in Library
- `D` - Develop module
- `R` - Reset current adjustment
- `Cmd/Ctrl + Z` - Undo (coming soon)

## Contributing

This is a demonstration project showcasing modern web development techniques for image editing applications. Feel free to:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Roadmap

- [ ] Export functionality (JPEG, PNG, TIFF)
- [ ] Collections and smart collections
- [ ] Keyword tagging and search
- [ ] Preset system with user-created presets
- [ ] Local adjustments (masks, graduated filters)
- [ ] Tone curve editing
- [ ] Batch editing capabilities
- [ ] Cloud storage integration
- [ ] Performance optimizations for large libraries

## License

MIT License - see LICENSE file for details.

## Acknowledgments

- Inspired by Adobe Lightroom's user interface and workflow
- Built with modern web technologies for educational purposes
- Icons provided by Lucide React
