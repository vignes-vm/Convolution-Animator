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
  const [x, setX] = useState([1, 2, 3]);
  const [h, setH] = useState([5, 6, 7]);
  const [steps, setSteps] = useState([]);
  const [y, setY] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  /**
   * Initialize with default example on component mount
   */
  useEffect(() => {
    const { y: output, steps: computedSteps } = convolve(x, h);
    setY(output);
    setSteps(computedSteps);
    setCurrentStep(0);
    setHasStarted(true);
  }, []);

  /**
   * Handle Start Animation button click from InputPanel
   * Recompute convolution with new sequences
   */
  const handleStart = (newX, newH) => {
    setX(newX);
    setH(newH);

    // Compute convolution
    const { y: output, steps: computedSteps } = convolve(newX, newH);
    setY(output);
    setSteps(computedSteps);
    setCurrentStep(0);
    setHasStarted(true);
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
        </aside>

        <main className="animation-section">
          {hasStarted && steps.length > 0 ? (
            <>
              <AnimationPanel 
                x={x} 
                h={h} 
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
