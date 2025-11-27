import { useState, useEffect } from 'react';
import './App.css';
import InputPanel from './InputPanel';
import AnimationPanel from './AnimationPanel';
import OutputPanel from './OutputPanel';
import { convolve } from './ConvolutionEngine';

/**
 * App.jsx
 * 
 * Main application component that integrates:
 * - InputPanel: User input for sequences x[n] and h[n]
 * - AnimationPanel: Step-by-step convolution visualization
 * - OutputPanel: Display the computed output y[n]
 * 
 * State management:
 * - x, h: input sequences
 * - steps: step data for animation
 * - y: output sequence
 * - currentStep: current animation frame index (synced with AnimationPanel)
 */
function App() {
  // Start with empty sequences and focus on input
  const [x, setX] = useState([]);
  const [h, setH] = useState([]);
  const [steps, setSteps] = useState([]);
  const [y, setY] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [hFlipped, setHFlipped] = useState([]);
  const [zeroPad, setZeroPad] = useState(false);

  /**
   * Initialize with default example on component mount
   */
  // No automatic computation on mount — user must enter sequences and click Start

  /**
   * Handle Start Animation button click from InputPanel
   * Recompute convolution with new sequences
   */
  const handleStart = (newX, newH) => {
    setX(newX);
    setH(newH);

    // Compute convolution
    const { y: output, steps: computedSteps, hFlipped: hf } = convolve(newX, newH, { zeroPad });
    setY(output);
    setSteps(computedSteps);
    setHFlipped(hf || []);
    setCurrentStep(0);
    setHasStarted(true);
  };

  const handleZeroPadToggle = (val) => {
    setZeroPad(val);
    // Recompute using existing x,h
    const { y: output, steps: computedSteps, hFlipped: hf } = convolve(x, h, { zeroPad: val });
    setY(output);
    setSteps(computedSteps);
    setHFlipped(hf || []);
    setCurrentStep(0);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Linear Convolution Animator</h1>
        <p>Interactive visualization of the convolution formula: y[n] = Σ x[k]·h[n-k]</p>
      </header>

      <div className="app-layout">
        <aside className="input-section">
          <InputPanel onStart={handleStart} />
          <div style={{ padding: '12px' }}>
            <label style={{ fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={zeroPad}
                onChange={(e) => handleZeroPadToggle(e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              Show zero-padding
            </label>
          </div>
        </aside>

        <main className="animation-section">
          {hasStarted && steps.length > 0 ? (
            <>
              <AnimationPanel 
                x={x} 
                h={h}
                hFlipped={hFlipped}
                steps={steps}
                onStepChange={setCurrentStep}
              />
              <OutputPanel y={y} currentStep={currentStep} />
            </>
          ) : (
            <div className="no-data">
              Enter sequences and click "Start Animation" to begin
            </div>
          )}
        </main>
      </div>

      <footer className="app-footer">
        <p>
          This tool visualizes linear convolution by showing how each element of x[n]
          multiplies with shifted elements of h[n] to compute y[n].
        </p>
      </footer>
    </div>
  );
}

export default App;
