# Convolution Animator

An interactive educational tool that visualizes step-by-step computation of **linear** and **circular convolution** with real-time animation, graph plotting, and interactive controls.

## 🎯 Overview

Convolution Animator transforms abstract signal processing concepts into interactive visual experiences. Students and engineers can observe how input signals convolve with impulse responses in real time, with adjustable animation speeds, multiple visualization methods, and both algorithms side-by-side.

**Key Equations:**
- **Linear Convolution**: y[n] = Σ x[k]·h[n-k]
- **Circular Convolution**: y[n] = Σ x[k]·h[(n-k) mod N]

## ✨ Features

### Core Functionality
- ✅ **Dual Convolution Algorithms** - Switch between linear and circular convolution
- ✅ **Step-by-Step Animation** - Watch each computation unfold with visual highlighting
- ✅ **Real-Time Graphs** - Canvas-based visualization of x[n], h[n], and y[n] sequences
- ✅ **Speed Control** - Adjustable animation speed (200ms - 4000ms per step)
- ✅ **Sequence Input Methods**:
  - Manual entry (comma-separated numbers)
  - Random generation (integers or decimals)
  - Custom length input (1-20 elements)

### User Interface
- 🎨 **Dark/Light Theme** - Toggle with persistent localStorage
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎮 **Playback Controls** - Play/Pause, step-by-step navigation
- 📊 **Live Visualization** - Overlapping sequences with product calculations
- 🌈 **Color-Coded Output** - Easy identification of x[n], h[n], and y[n] values

## 📦 Project Structure

```
convolution-animator/
├── src/
│   ├── App.jsx                      # Main component orchestrating all panels
│   ├── App.css                      # Global layout and theming system
│   ├── ConvolutionEngine.js         # Core convolution algorithms
│   ├── InputPanel.jsx               # Sequence input and random generation
│   ├── InputPanel.css
│   ├── AnimationPanel.jsx           # Step-by-step visualization
│   ├── AnimationPanel.css
│   ├── OutputPanel.jsx              # Display convolution results
│   ├── OutputPanel.css
│   ├── GraphPanel.jsx               # Canvas-based graph plotting
│   ├── GraphPanel.css
│   ├── SpeedControl.jsx             # Animation speed slider
│   ├── SpeedControl.css
│   ├── index.css                    # Global browser styles
│   ├── main.jsx                     # React entry point
│   └── TEST_VERIFICATION.js         # Verification utilities
├── index.html                       # HTML entry point
├── vite.config.js                   # Vite build configuration
├── eslint.config.js                 # Linting rules
├── package.json                     # Dependencies and scripts
└── README.md                        # This file
```

## 🚀 Getting Started

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd convolution-animator

# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

The application opens at **http://localhost:5173** with Hot Module Replacement (HMR) enabled.

### Production Build

```bash
npm run build
npm run preview
```

### Linting

```bash
npm run lint
```

## 🏗️ Component Architecture

### **App.jsx** (Main Orchestrator)
- Manages global state: x[n], h[n], y[n], animation steps, current step
- Handles convolution type switching (linear ↔ circular)
- Coordinates animation speed across all components
- Layout: responsive grid with input sidebar and multi-panel content area

### **InputPanel.jsx** (Sequence Input)
- Manual text input for sequences
- Random sequence generator (integers: -5 to 5, decimals: -3 to 3)
- Custom length selector (1-20 range)
- Convolution type toggle (Linear/Circular)
- Live preview of settings

### **AnimationPanel.jsx** (Step-by-Step Visualization)
- Displays x[n] and flipped h[n] sequences
- Highlights overlapping elements
- Shows product calculations for current step
- Playback controls (play/pause, next/previous)
- Current step counter

### **OutputPanel.jsx** (Results Display)
- Displays computed output y[n]
- Highlights current output value
- Color-coded for easy reading

### **GraphPanel.jsx** (Graph Visualization)
- Canvas-based plotting of three sequences
- Responsive width (500px base)
- Theme-aware colors:
  - **Light Mode**: x[n] blue, h[n] green, y[n] red
  - **Dark Mode**: x[n] cyan, h[n] light green, y[n] light red
- Real-time updates with animation

### **SpeedControl.jsx** (Animation Speed)
- Vertical slider (right-side positioned)
- Range: 200ms - 4000ms per step
- Visual speed indicator (Fast/Normal/Slow)
- Responsive: fixed on desktop, sticky on mobile

### **ConvolutionEngine.js** (Algorithms)
- `convolve(x, h, options)` - Linear convolution with step data
- `convolveCircular(x, h, options)` - Circular convolution with modulo wrapping
- Both return: `{ y: [...], steps: [...], hFlipped: [...] }`
- Step data includes: index, overlapping pairs, product values, running sum

## 🎨 Theming System

The application uses **CSS Custom Properties** for seamless theme switching.

### Theme Persistence
- Theme preference saved to localStorage
- Applied to `document.body.classList` on load
- Toggle button in header (sun/moon icons)

## 📐 How Convolution Works

### Linear Convolution Algorithm
1. Flip impulse response: h_flipped[k] = h[M-1-k]
2. For each output index n (0 to N+M-2):
   - Align h_flipped with x starting at position n
   - Multiply overlapping elements: pairs = x[i] × h_flipped[j]
   - Sum all products: y[n] = Σ pairs
3. Output length: N + M - 1

### Circular Convolution Algorithm
1. Both sequences interpreted as periodic (length N)
2. For each output index n (0 to N-1):
   - Multiply: x[k] × h[(n-k) mod N]
   - Sum products: y[n] = Σ products
3. Output length: N (same as input)

### Example: Linear Convolution
```
x[n] = [1, 2, 3]
h[n] = [5, 6, 7]

Step 0: h reversed [7, 6, 5]
        x[0]×h[0] = 1×5 = 5                    → y[0] = 5

Step 1: x[0]×h[1] + x[1]×h[0] = 1×6 + 2×5 = 16 → y[1] = 16

Step 2: x[0]×h[2] + x[1]×h[1] + x[2]×h[0] = 1×7 + 2×6 + 3×5 = 34 → y[2] = 34

Step 3: x[1]×h[2] + x[2]×h[1] = 2×7 + 3×6 = 32 → y[3] = 32

Step 4: x[2]×h[2] = 3×7 = 21                    → y[4] = 21

Output: y[n] = [5, 16, 34, 32, 21]
```

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **UI Framework** | React 19.2.0 |
| **Build Tool** | Vite 7.2.4 |
| **Styling** | Plain CSS with Custom Properties |
| **Graphics** | Canvas API |
| **Dev Server** | Vite HMR |
| **Linting** | ESLint 9.39.1 |
| **Node Version** | 16+ |

## 📚 Learning Outcomes

Students using this tool will understand:
- How convolution slides one signal over another
- The role of the impulse response in signal processing
- Differences between linear and circular convolution
- Matrix multiplication perspective of convolution
- Applications: filtering, smoothing, edge detection
- Digital signal processing fundamentals

## 🔧 Development Notes

### Adding a New Sequence Input Method
1. Add to `generateRandomSequence()` in InputPanel.jsx
2. Update the button handlers
3. Test with `generateRandomX()` and `generateRandomH()`

### Modifying Animation Speed
- Range: 200ms (fastest) to 4000ms (slowest)
- Edit SpeedControl.jsx range input: `<input type="range" min="200" max="4000">`

### Switching Convolution Algorithms
- User can toggle via InputPanel convolution type selector
- App.jsx handles `handleConvolutionTypeChange()` callback
- Algorithms swapped via `ConvolutionEngine.convolve()` vs `convolveCircular()`

### Canvas Graph Colors
- Edit GraphPanel.jsx color arrays:
  - `darkModeColors` for dark theme
  - `lightModeColors` for light theme
- Adjust responsive scaling factor if needed

## 📝 Configuration

### Convolution Length Range
- **Minimum**: 1 element
- **Maximum**: 20 elements
- Adjust in InputPanel.jsx: `const maxLength = 20`

### Animation Speed Range
- **Min**: 200ms per step
- **Max**: 4000ms per step
- Adjust in SpeedControl.jsx range input bounds

### Random Sequence Values
- **Integers**: -5 to 5
- **Decimals**: -3 to 3 (2 decimal places)
- Adjust in InputPanel.jsx `generateRandomSequence()` function

## 🤝 Contributing

Contributions are welcome! Areas for enhancement:
- Additional DSP algorithms (correlation, FFT visualization)
- Preset examples (edge detection, smoothing kernels)
- Mobile gesture controls
- Keyboard shortcuts for playback
- Result export (CSV, JSON, image)


## 📞 Support

For questions or issues:
1. Check the QUICK_START.md for common workflows
2. Review TEST_VERIFICATION.js for algorithm validation
3. Inspect browser console for debug messages
4. Verify input sequence format (comma-separated, -10 to 10 range recommended)

---

**Happy Learning!** 🎓 Transform abstract signal processing into visual understanding.
