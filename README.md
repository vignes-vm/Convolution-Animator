# Linear Convolution Animator

An interactive React + Vite application that visualizes the step-by-step computation of linear convolution with animation.

## Overview

This project provides a visual, interactive way to understand how linear convolution works. It animates the computation of:

**y[n] = Σ x[k]·h[n-k]**

where `x[n]` is the input sequence and `h[n]` is the impulse response.

## Features

- **Interactive Input Panel**: Enter two sequences as comma-separated numbers
- **Step-by-Step Animation**: Watch each convolution step unfold with highlighted overlapping elements
- **Visual Feedback**: 
  - Highlighted overlapping elements in yellow
  - Product calculations shown for each step
  - Current output value highlighted in red
- **Playback Controls**:
  - Play/Pause button for automatic animation
  - Next/Previous buttons for manual navigation
  - Speed control (0.5s, 1s, or 2s per step)



## Usage

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app opens at `http://localhost:5173/`

### Build for Production

```bash
npm run build
```

## How Convolution Works

The animation shows the process of computing linear convolution:

1. For each output index `n` (from 0 to len(x) + len(h) - 2)
2. Slide sequence `h[n]` by `n` positions and flip it
3. Multiply corresponding overlapping elements with `x`
4. Sum all products to get `y[n]`

## Example

For `x = [1, 2, 3]` and `h = [5, 6, 7]`:

Final output: `y = [5, 16, 34, 32, 21]`

## Styling

All styling uses **plain CSS only** (no frameworks):
- Color scheme: Blue for primary, red for output, green for animation
- Responsive design with mobile support
- Smooth transitions and hover effects

## React Hooks Used

- `useState`: Managing animation state, sequences, and UI state
- `useEffect`: Setting up and cleaning up `setInterval` for auto-play animation
- Proper cleanup: Interval is cleared when component unmounts or dependencies change
