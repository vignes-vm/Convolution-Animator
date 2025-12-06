import React, { useState } from 'react';
import './InputPanel.css';

export default function InputPanel({ onStart, onConvolutionTypeChange }) {

  const [xInput, setXInput] = useState('');
  const [hInput, setHInput] = useState('');
  const [error, setError] = useState('');
  const [parsedX, setParsedX] = useState([]);
  const [parsedH, setParsedH] = useState([]);
  const [convolutionType, setConvolutionType] = useState('linear');
  const [customLength, setCustomLength] = useState('5');
  const [randomType, setRandomType] = useState('integers');

  const validChars = /^[0-9+\-.,\s]*$/;

  const generateRandomSequence = (length, type) => {
    const sequence = [];
    for (let i = 0; i < length; i++) {
      if (type === 'integers') {
        sequence.push(Math.floor(Math.random() * 11) - 5);
      } else {
        sequence.push(Math.round((Math.random() * 6 - 3) * 10) / 10);
      }
    }
    return sequence;
  };

  const getCurrentLength = () => {
    const parsed = parseInt(customLength);
    return isNaN(parsed) || parsed < 1 || parsed > 20 ? 5 : parsed;
  };

  const generateRandomX = () => {
    const length = getCurrentLength();
    const sequence = generateRandomSequence(length, randomType);
    const sequenceStr = sequence.join(',');
    setXInput(sequenceStr);
    setParsedX(sequence);
    setError('');
  };

  const generateRandomH = () => {
    const length = getCurrentLength();
    const sequence = generateRandomSequence(length, randomType);
    const sequenceStr = sequence.join(',');
    setHInput(sequenceStr);
    setParsedH(sequence);
    setError('');
  };

  const generateBothRandom = () => {
    generateRandomX();
    generateRandomH();
  };

  const parseInput = (str) => {
    if (!str || str.trim() === '') return null;
    
    try {
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
    onStart(x, h, convolutionType);
  };

  const handleConvolutionTypeChange = (type) => {
    setConvolutionType(type);
    if (onConvolutionTypeChange) {
      onConvolutionTypeChange(type);
    }
  };

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
  };

  return (
    <div className="input-panel">
      <h2>Input Sequences</h2>
      
      <div className="input-group">
        <label>Convolution Type:</label>
        <div className="radio-group">
          <label className="radio-label">
            <input
              type="radio"
              name="convolutionType"
              value="linear"
              checked={convolutionType === 'linear'}
              onChange={(e) => handleConvolutionTypeChange(e.target.value)}
            />
            Linear
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="convolutionType"
              value="circular"
              checked={convolutionType === 'circular'}
              onChange={(e) => handleConvolutionTypeChange(e.target.value)}
            />
            Circular
          </label>
        </div>
      </div>

      <div className="input-group">
        <label>Random Generation:</label>
        <div className="generation-controls">
          <div className="generation-options">
            <input
              type="number"
              value={customLength}
              onChange={(e) => setCustomLength(e.target.value)}
              placeholder="Length (1-20)"
              min="1"
              max="20"
              className="custom-length-input"
            />
            
            <select 
              value={randomType} 
              onChange={(e) => setRandomType(e.target.value)}
              className="type-selector"
            >
              <option value="integers">Integers</option>
              <option value="decimals">Decimals</option>
            </select>
          </div>
          
          <div className="generation-buttons">
            <button type="button" onClick={generateRandomX} className="random-button">
              Random x[n]
            </button>
            <button type="button" onClick={generateRandomH} className="random-button">
              Random h[n]
            </button>
            <button type="button" onClick={generateBothRandom} className="random-button both-button">
              Both Random
            </button>
          </div>
        </div>
      </div>

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
        <div><strong>Type:</strong> {convolutionType === 'linear' ? 'Linear' : 'Circular'} Convolution</div>
        <div><strong>Random Length:</strong> {getCurrentLength()}</div>
        <div><strong>Parsed x:</strong> [{parsedX.join(', ')}]</div>
        <div><strong>Parsed h:</strong> [{parsedH.join(', ')}]</div>
      </div>
    </div>
  );
}
