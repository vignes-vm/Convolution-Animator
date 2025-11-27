import React, { useState, useEffect } from 'react';
import './AnimationPanel.css';

/**
 * AnimationPanel.jsx
 * 
 * Displays the step-by-step convolution animation showing:
 * - Input sequences x[n] and h[n] with highlighted overlapping elements
 * - Current step index and products being computed
 * - Sum for the current step
 * - Controls for play/pause and step navigation
 */
export default function AnimationPanel({ x, h, steps, hFlipped, onStepChange }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(2500); // milliseconds per step

  // Set up auto-play with interval
  useEffect(() => {
    if (!isPlaying || steps.length === 0) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        const nextStep = prev < steps.length - 1 ? prev + 1 : prev;
        if (onStepChange) onStepChange(nextStep);
        return nextStep;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [isPlaying, speed, steps.length, onStepChange]);

  if (!steps || steps.length === 0) {
    return <div className="animation-panel">No steps to animate</div>;
  }

  const step = steps[currentStep];
  const n = step.n;

  // Build quick lookup maps for this step: map xIndex -> pair, hIndex -> pair
  const xMap = new Map();
  const hMap = new Map();
  step.pairs.forEach((p) => {
    if (p.xIndex != null) xMap.set(p.xIndex, p);
    if (p.hIndex != null) hMap.set(p.hIndex, p);
  });

  /**
   * Determine which elements in h[] are overlapping with x[]
   * For step n: x[k] overlaps with h[n-k]
   * So h[j] overlaps if j = n - k for some k in [0, N-1]
   * Which means j = n - k, so k = n - j, and k must be in [0, N-1]
   */
  const getOverlapIndices = () => {
    const xIndices = new Set();
    const hIndices = new Set();

    step.pairs.forEach((pair) => {
      xIndices.add(pair.xIndex);
      hIndices.add(pair.hIndex);
    });

    return { xIndices, hIndices };
  };

  const { xIndices, hIndices } = getOverlapIndices();

  // Navigation handlers
  const handlePrevious = () => {
    const newStep = Math.max(0, currentStep - 1);
    setCurrentStep(newStep);
    if (onStepChange) onStepChange(newStep);
    setIsPlaying(false);
  };

  const handleNext = () => {
    const newStep = Math.min(steps.length - 1, currentStep + 1);
    setCurrentStep(newStep);
    if (onStepChange) onStepChange(newStep);
    setIsPlaying(false);
  };

  const handleSliderChange = (e) => {
    const v = Number(e.target.value);
    setCurrentStep(v);
    if (onStepChange) onStepChange(v);
    setIsPlaying(false);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSpeedChange = (e) => {
    setSpeed(parseInt(e.target.value));
  };

  return (
    <div className="animation-panel">
      <h2>Convolution Animation</h2>

      {/* Step counter */}
      <div className="step-counter">
        Step {currentStep + 1} of {steps.length}: Computing y[{n}]
      </div>

      {/* Input sequences visualization */}
      <div className="sequences-container">
        {/* x[n] sequence */}
        <div className="sequence-row">
          <label className="sequence-label">x[n]:</label>
          <div className="sequence">
            {x.map((val, idx) => (
              <div
                key={`x-${idx}`}
                className={`element ${xIndices.has(idx) ? 'overlap' : ''} ${xMap.has(idx) ? 'pair' : ''}`}
                title={`x[${idx}] = ${val}`}
              >
                <span className="index">[{idx}]</span>
                <span className="value">{val}</span>
                {/* product bubble inside x element if this x participates in a pair */}
                {xMap.has(idx) && (
                  <div className="product-bubble">{xMap.get(idx).product}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* h[n] sequence - display flipped h (hFlipped provided by convolve) */}
        <div className="sequence-row">
          <label className="sequence-label">h (flipped):</label>
          <div className="sequence">
            {(hFlipped || h).map((val, idx) => (
              <div
                key={`h-${idx}`}
                className={`element ${hIndices.has(idx) ? 'overlap' : ''} ${hMap.has(idx) ? 'pair' : ''}`}
                title={`hFlipped[${idx}] = ${val}`}
              >
                <span className="index">[{idx}]</span>
                <span className="value">{val}</span>
                {hMap.has(idx) && (
                  <div className="product-bubble bottom">{hMap.get(idx).product}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Computation details */}
      <div className="computation-details">
        <h3>Products at Step y[{n}]:</h3>
        <div className="products">
          {step.pairs.length > 0 ? (
            step.pairs.map((pair, idx) => (
              <div key={idx} className="product-item">
                x[{pair.xIndex}] × h[{pair.hIndex}] = {pair.xVal} × {pair.hVal} = {pair.product}
              </div>
            ))
          ) : (
            <div className="product-item">No overlapping elements</div>
          )}
        </div>

        {/* Sum and expression */}
        <div className="step-sum">
          <div className="expr">
            {step.pairs.length > 0 ? (
              <>
                {step.pairs.map((p, i) => (
                  <span key={i} className="expr-part">
                    {p.xVal}×{p.hVal}{i < step.pairs.length - 1 ? ' + ' : ''}
                  </span>
                ))}
                <span className="expr-eq"> = {step.sum}</span>
              </>
            ) : (
              <span>y[{n}] = 0</span>
            )}
          </div>
          <div className="sum-large">y[{n}] = <strong>{step.sum}</strong></div>
        </div>
      </div>

      {/* Controls */}
      <div className="controls">
        <button className="control-button" onClick={handlePrevious}>
          ⏮ Previous
        </button>

        <button className="control-button play-pause" onClick={handlePlayPause}>
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>

        <button className="control-button" onClick={handleNext}>
          Next ⏭
        </button>

        <div className="speed-control">
          <label htmlFor="speed">Speed:</label>
          <select id="speed" value={speed} onChange={handleSpeedChange}>
            <option value={500}>Fast (0.5s)</option>
            <option value={1000}>Normal (1s)</option>
            <option value={2000}>Slow (2s)</option>
          </select>
        </div>
      </div>

      {/* Slider to jump to any step */}
      <div className="slider-row">
        <input
          type="range"
          min={0}
          max={steps.length - 1}
          value={currentStep}
          onChange={handleSliderChange}
        />
        <div className="slider-label">Step {currentStep + 1} / {steps.length}</div>
      </div>
    </div>
  );
}
