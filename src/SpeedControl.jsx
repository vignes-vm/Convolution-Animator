import React from 'react';
import './SpeedControl.css';

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
        <span className="speed-mark">Fast</span>
        
        <input
          type="range"
          min="200"
          max="4000"
          step="200"
          value={speed}
          onChange={handleSpeedChange}
          className="speed-slider"
        />
        
        <span className="speed-mark">Slow</span>
      </div>
      
      <div className="speed-info">
        <span>Current: {speed}ms</span>
      </div>
    </div>
  );
}