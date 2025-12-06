import React, { useState, useEffect } from 'react';
import './AnimationPanel.css';

export default function AnimationPanel({ x, h, steps, hFlipped, onStepChange, speed }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    setCurrentStep(0);
    setIsPlaying(true);
    if (onStepChange) onStepChange(0);
  }, [steps, onStepChange]);

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

  const safeCurrentStep = Math.min(currentStep, steps.length - 1);
  const step = steps[safeCurrentStep];
  const n = step.n;

  const xMap = new Map();
  const hMap = new Map();
  step.pairs.forEach((p) => {
    if (p.xIndex != null) xMap.set(p.xIndex, p);
    if (p.hIndex != null) hMap.set(p.hIndex, p);
  });

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

  return (
    <div className="animation-panel">
      <h2>Convolution Animation</h2>

      {/* Step counter */}
      <div className="step-counter">
        Step {safeCurrentStep + 1} of {steps.length}: Computing y[{n}]
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

        {/* h[n] sequence - display positioned h that aligns with x for current step */}
        <div className="sequence-row">
          <label className="sequence-label">h[::-n]:</label>
          <div className="sequence">
            {(step.hPositioned || hFlipped || h).map((val, idx) => {
              // For positioned h, only show elements that have values (not null)
              const hasValue = step.hPositioned ? val !== null : true;
              const displayVal = step.hPositioned ? (val !== null ? val : '') : val;
              const isActive = hasValue && hIndices.has(idx);
              
              return (
                <div
                  key={`h-${idx}`}
                  className={`element ${hasValue ? '' : 'empty'} ${isActive ? 'overlap' : ''} ${hMap.has(idx) ? 'pair' : ''}`}
                  title={hasValue ? `h[${idx}] = ${displayVal}` : 'empty'}
                >
                  <span className="index">[{idx}]</span>
                  <span className="value">{displayVal}</span>
                  {hMap.has(idx) && hasValue && (
                    <div className="product-bubble bottom">{hMap.get(idx).product}</div>
                  )}
                </div>
              );
            })}
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
      </div>

      {/* Slider to jump to any step */}
      <div className="slider-row">
        <input
          type="range"
          min={0}
          max={steps.length - 1}
          value={safeCurrentStep}
          onChange={handleSliderChange}
        />
        <div className="slider-label">Step {safeCurrentStep + 1} / {steps.length}</div>
      </div>
    </div>
  );
}
