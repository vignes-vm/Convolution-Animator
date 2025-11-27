import React, { useState } from 'react';
import './InputPanel.css';

/**
 * InputPanel.jsx
 * 
 * Component for user input of sequences x[n] and h[n].
 * Accepts comma-separated numbers and validates them.
 */
export default function InputPanel({ onStart }) {
  // Start with empty inputs so user focuses on entering sequences
  const [xInput, setXInput] = useState('');
  const [hInput, setHInput] = useState('');
  const [error, setError] = useState('');
  const [parsedX, setParsedX] = useState([]);
  const [parsedH, setParsedH] = useState([]);

  // Allow only digits, decimals, negatives, commas, spaces
  const validChars = /^[0-9+\-.,\s]*$/;

  /**
   * Parses comma-separated input string into array of numbers
   */
  const parseInput = (str) => {
    if (!str || str.trim() === '') return null;
    
    try {
      // Quick character validation to prevent letters
      if (!validChars.test(str)) return null;

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

    setParsedX(x);
    setParsedH(h);
    onStart(x, h);
  };

  // Live preview of parsed arrays whenever input changes
  const handleXChange = (v) => {
    setXInput(v);
    const p = parseInput(v);
    if (p) setParsedX(p);
  };

  const handleHChange = (v) => {
    setHInput(v);
    const p = parseInput(v);
    if (p) setParsedH(p);
  };

  const applyPreset = (presetX, presetH) => {
    setXInput(presetX.join(','));
    setHInput(presetH.join(','));
    setParsedX(presetX);
    setParsedH(presetH);
    // apply preset but do not auto-start; user can review and click Start
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
          onChange={(e) => handleXChange(e.target.value)}
          placeholder="e.g., 1,2,3"
        />
      </div>

      <div className="input-group">
        <label htmlFor="h-input">h[n] (comma-separated):</label>
        <input
          id="h-input"
          type="text"
          value={hInput}
          onChange={(e) => handleHChange(e.target.value)}
          placeholder="e.g., 1,2,3"
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <button className="start-button" onClick={handleStart}>
        Start Animation
      </button>

      <div className="live-preview">
        <div><strong>Parsed x:</strong> [{parsedX.join(', ')}]</div>
        <div><strong>Parsed h:</strong> [{parsedH.join(', ')}]</div>
      </div>
    </div>
  );
}
