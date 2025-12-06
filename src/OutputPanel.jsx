import React from 'react';
import './OutputPanel.css';

export default function OutputPanel({ y, currentStep }) {
  if (!y || y.length === 0) {
    return <div className="output-panel">No output to display</div>;
  }

  const maxVal = Math.max(...y.map(v => Math.abs(v)), 1);

  return (
    <div className="output-panel">
      <h2>Output y[n]</h2>

      <div className="output-sequence">
        {y.map((val, idx) => (
          <div
            key={`y-${idx}`}
            className={`output-element ${idx === currentStep ? 'current' : ''}`}
            title={`y[${idx}] = ${val}`}
          >
            <span className="output-index">[{idx}]</span>
            <span className="output-value">{val}</span>
            {/* animated bar showing relative magnitude */}
            <div className="output-bar-wrap">
              <div
                className="output-bar"
                style={{ width: `${Math.abs(val) / maxVal * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="output-values">
        <strong>y = [</strong>
        {y.map((val, idx) => (
          <React.Fragment key={`val-${idx}`}>
            <span className={idx === currentStep ? 'current-value' : ''}>
              {val}
            </span>
            {idx < y.length - 1 && <span>, </span>}
          </React.Fragment>
        ))}
        <strong>]</strong>
      </div>
    </div>
  );
}
