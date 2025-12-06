import React from 'react';
import './SpeedControl.css';

/**
 * SpeedControl.jsx
 * 
 * Component for controlling animation speed with a vertical slider.
 * Positioned on the right side of the screen.
 */
export default function SpeedControl({ speed, onSpeedChange }) {
  const handleSpeedChange = (e) => {
    const newSpeed = parseInt(e.target.value);
    onSpeedChange(newSpeed);
  };

  const getSpeedLabel = (speed) => {
    if (speed >= 3000) return 'Very Slow';
    if (speed >= 2000) return 'Slow';
    if (speed >= 1000) return 'Normal';
    if (speed >= 500) return 'Fast';
    return 'Very Fast';
  };

  return (
    <div className="speed-control">
      <div className="speed-control-header">
        <h3>Animation Speed</h3>
        <div className="speed-label">{getSpeedLabel(speed)}</div>
      </div>
      
      <div className="speed-slider-container">
        <div className="speed-scale">
          <span className="speed-mark">Slow</span>
          <span className="speed-mark">Normal</span>
          <span className="speed-mark">Fast</span>
        </div>
        
        <input
          type="range"
          min="200"
          max="4000"
          step="200"
          value={speed}
          onChange={handleSpeedChange}
          className="speed-slider"
          orient="vertical"
        />
        
        <div className="speed-values">
          <span className="speed-value">200ms</span>
          <span className="speed-value">2000ms</span>
          <span className="speed-value">4000ms</span>
        </div>
      </div>
      
      <div className="speed-info">
        <p>Current: {speed}ms</p>
        <p>Lower values = faster animation</p>
      </div>
    </div>
  );
}