import React, { useRef, useEffect, useState } from 'react';
import './GraphPanel.css';

export default function GraphPanel({ x, h, y, currentStep, convolutionType }) {
  const canvasRef = useRef(null);
  const [animationPhase, setAnimationPhase] = useState(0);

  // Create step-based animation
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 3);
    }, 300);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !x || !h || !y) return;

    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    
    ctx.clearRect(0, 0, width, height);
    
    const margin = 40;
    const plotWidth = width - 2 * margin;
    const plotHeight = (height - 4 * margin) / 3;
    
    const colors = {
      xSeq: '#007bff',
      hSeq: '#28a745',
      ySeq: '#dc3545',
      highlight: '#ffc107',
      highlightGlow: 'rgba(255, 193, 7, 0.3)',
      grid: '#e0e0e0',
      gridBold: '#d0d0d0',
      text: '#333333',
      axis: '#666666'
    };

    const drawSequence = (sequence, yOffset, label, color, highlightIndex = -1, isOutput = false) => {
      const maxVal = Math.max(...sequence.map(Math.abs), 1);
      const scaleY = plotHeight * 0.3 / maxVal;
      const scaleX = plotWidth / Math.max(sequence.length - 1, 1);
      
      // Draw grid
      ctx.strokeStyle = colors.grid;
      ctx.lineWidth = 0.5;
      for (let i = 0; i < sequence.length; i++) {
        const x_pos = margin + i * scaleX;
        ctx.beginPath();
        ctx.moveTo(x_pos, yOffset);
        ctx.lineTo(x_pos, yOffset + plotHeight);
        ctx.stroke();
      }
      
      // Draw center axis
      ctx.strokeStyle = colors.gridBold;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(margin, yOffset + plotHeight / 2);
      ctx.lineTo(width - margin, yOffset + plotHeight / 2);
      ctx.stroke();
      
      // Draw sequence values
      ctx.lineWidth = 2.5;
      
      sequence.forEach((val, idx) => {
        const x_pos = margin + idx * scaleX;
        const y_pos = yOffset + plotHeight / 2 - val * scaleY;
        const isHighlighted = idx === highlightIndex && isOutput;
        
        // Draw stem line
        ctx.strokeStyle = isHighlighted ? colors.highlight : color;
        ctx.lineWidth = isHighlighted ? 4 : 2.5;
        ctx.beginPath();
        ctx.moveTo(x_pos, yOffset + plotHeight / 2);
        ctx.lineTo(x_pos, y_pos);
        ctx.stroke();
        
        // Draw glow effect for highlighted elements
        if (isHighlighted) {
          ctx.fillStyle = colors.highlightGlow;
          ctx.beginPath();
          ctx.arc(x_pos, y_pos, 12 + animationPhase * 2, 0, 2 * Math.PI);
          ctx.fill();
        }
        
        // Draw point with animation
        ctx.fillStyle = isHighlighted ? colors.highlight : color;
        const radius = isHighlighted ? 6 + Math.sin(animationPhase * Math.PI / 1.5) : 5;
        ctx.beginPath();
        ctx.arc(x_pos, y_pos, radius, 0, 2 * Math.PI);
        ctx.fill();
        
        // Add border to points
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        // Draw values
        ctx.fillStyle = colors.text;
        ctx.font = 'bold 11px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(val.toFixed(2), x_pos, y_pos - 12);
        
        // Draw indices
        ctx.font = '9px Arial';
        ctx.fillStyle = '#666';
        ctx.fillText(`[${idx}]`, x_pos, yOffset + plotHeight + 15);
      });
      
      // Draw label
      ctx.fillStyle = colors.text;
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(label, margin - 35, yOffset + 20);
      
      // Draw axes
      ctx.strokeStyle = colors.axis;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(margin - 5, yOffset);
      ctx.lineTo(margin - 5, yOffset + plotHeight);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(margin - 5, yOffset + plotHeight);
      ctx.lineTo(width - margin, yOffset + plotHeight);
      ctx.stroke();
    };

    // Draw all sequences
    drawSequence(x, margin, 'x[n]', colors.xSeq);
    drawSequence(h, margin + plotHeight + 20, 'h[n]', colors.hSeq);
    drawSequence(y, margin + 2 * (plotHeight + 20), 'y[n]', colors.ySeq, currentStep, true);
    
    // Draw title with animation effect
    ctx.save();
    const titleY = 25;
    ctx.fillStyle = '#28a745';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(40, 167, 69, 0.3)';
    ctx.shadowBlur = 8 + animationPhase * 2;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;
    ctx.fillText(`${convolutionType.charAt(0).toUpperCase() + convolutionType.slice(1)} Convolution (Step ${currentStep + 1})`, width / 2, titleY);
    ctx.restore();
    
  }, [x, h, y, currentStep, convolutionType, animationPhase]);

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
