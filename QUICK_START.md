# Quick Start Guide

## Installation & Running

```bash
# Navigate to project
cd /Users/vignesvm/Desktop/convolution-animator

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

The app opens automatically at **http://localhost:5173/**

## What You'll See

### On First Load
- Page displays "Linear Convolution Animator" header
- Left panel: Input fields with default values x=[1,2,3], h=[5,6,7]
- Right panel: Animation already running with:
  - Sequences x and h displayed with highlighting
  - Products shown for each step
  - Output sequence with current value highlighted
  - Control buttons and speed selector

### Interactive Elements

1. **Input Panel (Left)**
   - x[n] field: Enter sequence as "1,2,3"
   - h[n] field: Enter sequence as "5,6,7"
   - Start Animation button: Computes new convolution

2. **Animation Controls (Top of Right Panel)**
   - ⏮ Previous: Go to previous step
   - ▶/⏸ Play/Pause: Control auto-animation
   - Next ⏭: Go to next step
   - Speed dropdown: 0.5s, 1s, or 2s per step

3. **Visual Display**
   - Yellow boxes: Elements being multiplied
   - Products: Shows x[k]×h[n-k] = result
   - y[n] sum: Sum of all products for current step
   - Output at bottom: Shows y values, current highlighted in red

## Try These Examples

### Example 1: Custom Sequence
1. Change x[n] to "1,1,1"
2. Change h[n] to "1,2,1"
3. Click "Start Animation"
4. Watch the animation with new values

### Example 2: Single Element
1. Change x[n] to "1"
2. Change h[n] to "1"
3. Click "Start Animation"
4. See single-step convolution (simplest case)

### Example 3: Longer Sequence
1. Change x[n] to "1,2,3,4,5"
2. Change h[n] to "1,1"
3. Click "Start Animation"
4. Watch 6-step animation (5+2-1 steps)

### Example 4: Error Testing
1. Try x[n] = "1,abc,3"
2. See error message
3. Fix input to "1,2,3"
4. Works again

## Default Example Breakdown

For x=[1,2,3], h=[5,6,7]:

**Step-by-step output:**
- y[0] = 5 (1×5)
- y[1] = 16 (1×6 + 2×5)
- y[2] = 34 (1×7 + 2×6 + 3×5)
- y[3] = 32 (2×7 + 3×6)
- y[4] = 21 (3×7)

**Final result:** y = [5, 16, 34, 32, 21]

## Common Issues & Solutions

### Page doesn't load
- Make sure npm dev server is running
- Check http://localhost:5173/ in browser
- Look for errors in terminal

### Animation not starting
- Enter valid comma-separated numbers
- Click "Start Animation" button
- Animation auto-plays after computation

### Values don't update
- Animation updates happen automatically
- Click Play/Pause to control it
- Use Previous/Next for manual stepping

### Slow animation
- Use Speed dropdown to select slower (2s)
- Or faster (0.5s)
- Default is 1 second per step

## Key Concepts

**Convolution Formula:**
```
y[n] = Σ x[k] · h[n-k]
```

**What the animation shows:**
1. For each output index n
2. Which elements of x multiply with which elements of h
3. The product values
4. The final sum that becomes y[n]

**Why it matters:**
- Convolution is the core of signal filtering
- Used in audio processing, image filtering, neural networks
- This animation helps visualize the mathematical operation

## Build for Production

```bash
npm run build
```

Creates optimized build in `dist/` folder, ready to deploy.

## Stop Development Server

In terminal where npm run dev is running:
```bash
Ctrl+C
```

## Support

- All components are fully functional
- No external dependencies beyond React and Vite
- Uses only plain CSS (no frameworks)
- Responsive on all screen sizes
- Works in all modern browsers

Enjoy learning convolution! 🎓
