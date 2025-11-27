import React, { useState } from 'react';
import './InputPanel.css';

/**
 * InputPanel.jsx
 * 
 * Component for user input of sequences x[n] and h[n].
 * Accepts comma-separated numbers and validates them.
 */
export default function InputPanel({ onStart }) {
  const [xInput, setXInput] = useState('1,2,3');
  const [hInput, setHInput] = useState('5,6,7');
  const [error, setError] = useState('');

  /**
   * Parses comma-separated input string into array of numbers
   */
  const parseInput = (str) => {
    if (!str || str.trim() === '') return null;
    
    try {
      const arr = str
        .split(',')
        .map(s => s.trim())
        .filter(s => s !== '')
        .map(s => parseFloat(s));
      
      if (arr.some(isNaN)) return null;
      if (arr.length === 0) return null;
      
      return arr;
    } catch (e) {
      return null;
    }
  };

  /**
   * Handle Start Animation button click
   */
  const handleStart = () => {
    setError('');
    
    const x = parseInput(xInput);
    const h = parseInput(hInput);

    if (!x) {
      setError('Invalid x[n]: enter comma-separated numbers');
      return;
    }
    if (!h) {
      setError('Invalid h[n]: enter comma-separated numbers');
      return;
    }

    onStart(x, h);
  };

  return (
    <div className="input-panel">
      <h2>Input Sequences</h2>
      
      <div className="input-group">
        <label htmlFor="x-input">x[n] (comma-separated):</label>
        <input
          id="x-input"
          type="text"
          value={xInput}
          onChange={(e) => setXInput(e.target.value)}
          placeholder="e.g., 1,2,3"
        />
      </div>

      <div className="input-group">
        <label htmlFor="h-input">h[n] (comma-separated):</label>
        <input
          id="h-input"
          type="text"
          value={hInput}
          onChange={(e) => setHInput(e.target.value)}
          placeholder="e.g., 5,6,7"
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <button className="start-button" onClick={handleStart}>
        Start Animation
      </button>
    </div>
  );
}
