import { useState, useEffect } from 'react';
import './App.css';
import InputPanel from './InputPanel';
import AnimationPanel from './AnimationPanel';
import OutputPanel from './OutputPanel';
import GraphPanel from './GraphPanel';
import SpeedControl from './SpeedControl';
import { convolve, convolveCircular } from './ConvolutionEngine';

function App() {
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

  const handleStart = (newX, newH, newConvolutionType = 'linear') => {
    setX(newX);
    setH(newH);
    setConvolutionType(newConvolutionType);

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
    setCurrentStep(0);
    
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
    setCurrentStep(0);
    
    if (x.length > 0 && h.length > 0) {
      const convolutionFunction = convolutionType === 'circular' ? convolveCircular : convolve;
      const { y: output, steps: computedSteps, hFlipped: hf } = convolutionFunction(x, h, { zeroPad: val });
      setY(output);
      setSteps(computedSteps);
      setHFlipped(hf || []);
      setCurrentStep(0);
    }
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
                <div className="graph-with-controls">
                  <SpeedControl 
                    speed={animationSpeed}
                    onSpeedChange={setAnimationSpeed}
                  />
                  <GraphPanel 
                    x={x}
                    h={h}
                    y={y}
                    currentStep={currentStep}
                    convolutionType={convolutionType}
                  />
                  <OutputPanel y={y} currentStep={currentStep} />
                </div>
              </div>
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
          © 2025 Convolution Animator. Developed by Vignes VM
        </p>
      </footer>
    </div>
  );
}

export default App;
