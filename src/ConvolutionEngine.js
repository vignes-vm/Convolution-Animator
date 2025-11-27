/**
 * ConvolutionEngine.js
 * 
 * Implements linear convolution computation with step-by-step breakdown
 * for animation purposes.
 * 
 * Formula: y[n] = sum_k x[k] * h[n-k]
 * Where n ranges from 0 to len(x) + len(h) - 2
 */

/**
 * Computes linear convolution and returns step-by-step data
 * @param {number[]} x - First input sequence
 * @param {number[]} h - Second input sequence (impulse response)
 * @returns {Object} Object containing:
 *   - y: output array
 *   - steps: array of objects describing each computation step
 */
/**
 * Computes linear convolution and returns step-by-step data.
 * We flip `h` into `hFlipped` (reversed) and use it for all step computations
 * so the animation can display the flipped impulse response sliding across x.
 *
 * Options:
 *  - zeroPad: when true, include zero-pairs for out-of-range h indexes (visualize padding)
 *
 * The algorithm still computes y[n] = sum_k x[k] * h[n-k], but the step `pairs`
 * report h values using the flipped array (hFlipped) and the corresponding
 * indices into hFlipped so the UI can render h flipped directly.
 */
export function convolve(x, h, options = {}) {
  const { zeroPad = false } = options;

  // Validate inputs
  if (!x || !h || x.length === 0 || h.length === 0) {
    return { y: [], steps: [], hFlipped: [] };
  }

  const N = x.length;
  const M = h.length;
  const outputLength = N + M - 1;
  const y = new Array(outputLength).fill(0);
  const steps = [];

  // hFlipped is h reversed, used for display and step bookkeeping.
  const hFlipped = h.slice().reverse();

  for (let n = 0; n < outputLength; n++) {
    const pairs = [];
    let sum = 0;

    // For each position k in x
    for (let k = 0; k < N; k++) {
      // hIndexOriginal corresponds to original h index in formula h[n-k]
      const hIndexOriginal = n - k;

      if (hIndexOriginal >= 0 && hIndexOriginal < M) {
        // Map to index in flipped array: hfIndex = M-1 - hIndexOriginal
        const hfIndex = M - 1 - hIndexOriginal;
        const xVal = x[k];
        const hVal = hFlipped[hfIndex];
        const product = xVal * hVal;

        // Store pair referencing indices into x and hFlipped for display
        pairs.push({
          xIndex: k,
          hIndex: hfIndex, // index into hFlipped
          xVal: xVal,
          hVal: hVal,
          product: product,
        });

        sum += product;
      } else if (zeroPad) {
        // Include explicit zero-pair for visualization if requested
        // We'll use hIndex = null and hVal = 0 to indicate padding
        const xVal = x[k];
        const hVal = 0;
        const product = 0;
        pairs.push({
          xIndex: k,
          hIndex: null,
          xVal: xVal,
          hVal: hVal,
          product: product,
        });
      }
    }

    // Store result for this step
    y[n] = sum;
    steps.push({
      n: n,
      pairs: pairs,
      sum: sum,
    });
  }

  return { y, steps, hFlipped };
}
