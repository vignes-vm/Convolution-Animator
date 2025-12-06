import { useState, useEffect } from 'react';
import './App.css';
import InputPanel from './InputPanel';
import AnimationPanel from './AnimationPanel';
import OutputPanel from './OutputPanel';
import GraphPanel from './GraphPanel';
import SpeedControl from './SpeedControl';
import { convolve, convolveCircular } from './ConvolutionEngine';

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
  const [convolutionType, setConvolutionType] = useState('linear');
  const [animationSpeed, setAnimationSpeed] = useState(1500);

  /**
   * Initialize with default example on component mount
   */
  // No automatic computation on mount — user must enter sequences and click Start

  /**
   * Handle Start Animation button click from InputPanel
   * Recompute convolution with new sequences
   */
  const handleStart = (newX, newH, newConvolutionType = 'linear') => {
    setX(newX);
    setH(newH);
    setConvolutionType(newConvolutionType);

    // Compute convolution based on type
    const convolutionFunction = newConvolutionType === 'circular' ? convolveCircular : convolve;
    const { y: output, steps: computedSteps, hFlipped: hf } = convolutionFunction(newX, newH, { zeroPad });
    setY(output);
    setSteps(computedSteps);
    setHFlipped(hf || []);
    setCurrentStep(0);
    setHasStarted(true);
  };

  const handleConvolutionTypeChange = (newType) => {
    setConvolutionType(newType);
    // If we have sequences loaded, recompute with new type
    if (x.length > 0 && h.length > 0) {
      const convolutionFunction = newType === 'circular' ? convolveCircular : convolve;
      const { y: output, steps: computedSteps, hFlipped: hf } = convolutionFunction(x, h, { zeroPad });
      setY(output);
      setSteps(computedSteps);
      setHFlipped(hf || []);
      setCurrentStep(0);
    }
  };

  const handleZeroPadToggle = (val) => {
    setZeroPad(val);
    // Recompute using existing x,h and current convolution type
    const convolutionFunction = convolutionType === 'circular' ? convolveCircular : convolve;
    const { y: output, steps: computedSteps, hFlipped: hf } = convolutionFunction(x, h, { zeroPad: val });
    setY(output);
    setSteps(computedSteps);
    setHFlipped(hf || []);
    setCurrentStep(0);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>{convolutionType === 'circular' ? 'Circular' : 'Linear'} Convolution Animator</h1>
      </header>

      <div className="app-layout">
        <aside className="input-section">
          <InputPanel 
            onStart={handleStart} 
            onConvolutionTypeChange={handleConvolutionTypeChange}
          />
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
              <div className="animation-content">
                <AnimationPanel 
                  x={x} 
                  h={h}
                  hFlipped={hFlipped}
                  steps={steps}
                  speed={animationSpeed}
                  onStepChange={setCurrentStep}
                />
                <GraphPanel 
                  x={x}
                  h={h}
                  y={y}
                  currentStep={currentStep}
                  convolutionType={convolutionType}
                />
              </div>
              <OutputPanel y={y} currentStep={currentStep} />
            </>
          ) : (
            <div className="no-data">
              Enter sequences and click "Start Animation" to begin
            </div>
          )}
        </main>
        
        {hasStarted && (
          <SpeedControl 
            speed={animationSpeed}
            onSpeedChange={setAnimationSpeed}
          />
        )}
      </div>

      <footer className="app-footer">
        <p>
          © 2025 Convolution Animator. Developed by Vignes VM
        </p>
      </footer>
    </div>
  );
}

export default App;
