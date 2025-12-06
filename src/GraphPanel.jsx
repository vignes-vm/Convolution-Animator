import React, { useRef, useEffect } from 'react';
import './GraphPanel.css';

/**
 * GraphPanel.jsx
 * 
 * Component for plotting convolution results as interactive graphs.
 * Displays input sequences x[n], h[n] and output y[n] with current step highlighting.
 */
export default function GraphPanel({ x, h, y, currentStep, convolutionType }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !x || !h || !y) return;

    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set up dimensions
    const margin = 40;
    const plotWidth = width - 2 * margin;
    const plotHeight = (height - 4 * margin) / 3; // Three plots stacked
    
    // Colors
    const colors = {
      xSeq: '#007bff',
      hSeq: '#28a745',
      ySeq: '#dc3545',
      highlight: '#ffc107',
      grid: '#e0e0e0',
      text: '#333333'
    };

    // Helper function to draw a sequence plot
    const drawSequence = (sequence, yOffset, label, color, highlightIndex = -1) => {
      const maxVal = Math.max(...sequence.map(Math.abs), 1);
      const scaleY = plotHeight * 0.3 / maxVal;
      const scaleX = plotWidth / Math.max(sequence.length - 1, 1);
      
      // Draw grid lines
      ctx.strokeStyle = colors.grid;
      ctx.lineWidth = 0.5;
      for (let i = 0; i < sequence.length; i++) {
        const x_pos = margin + i * scaleX;
        ctx.beginPath();
        ctx.moveTo(x_pos, yOffset);
        ctx.lineTo(x_pos, yOffset + plotHeight);
        ctx.stroke();
      }
      
      // Draw zero line
      ctx.strokeStyle = colors.grid;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(margin, yOffset + plotHeight / 2);
      ctx.lineTo(width - margin, yOffset + plotHeight / 2);
      ctx.stroke();
      
      // Draw sequence
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      
      sequence.forEach((val, idx) => {
        const x_pos = margin + idx * scaleX;
        const y_pos = yOffset + plotHeight / 2 - val * scaleY;
        
        // Draw stem
        ctx.beginPath();
        ctx.moveTo(x_pos, yOffset + plotHeight / 2);
        ctx.lineTo(x_pos, y_pos);
        ctx.stroke();
        
        // Draw circle
        ctx.fillStyle = idx === highlightIndex ? colors.highlight : color;
        ctx.beginPath();
        ctx.arc(x_pos, y_pos, 4, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw value label
        ctx.fillStyle = colors.text;
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(val.toFixed(2), x_pos, y_pos - 8);
        ctx.fillText(`[${idx}]`, x_pos, yOffset + plotHeight + 15);
      });
      
      // Draw sequence label
      ctx.fillStyle = colors.text;
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(label, 5, yOffset + 20);
    };

    // Draw x[n] sequence
    drawSequence(x, margin, 'x[n]', colors.xSeq);
    
    // Draw h[n] sequence
    drawSequence(h, margin + plotHeight + 20, 'h[n]', colors.hSeq);
    
    // Draw y[n] sequence with current step highlighted
    drawSequence(y, margin + 2 * (plotHeight + 20), 'y[n]', colors.ySeq, currentStep);
    
    // Draw title
    ctx.fillStyle = colors.text;
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${convolutionType} Convolution Graph`, width / 2, 20);
    
  }, [x, h, y, currentStep, convolutionType]);

  return (
    <div className="graph-panel">
      <canvas
        ref={canvasRef}
        width={400}
        height={500}
        className="convolution-graph"
      />
    </div>
  );
}