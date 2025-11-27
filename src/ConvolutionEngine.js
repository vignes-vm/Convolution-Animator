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
export function convolve(x, h) {
  // Validate inputs
  if (!x || !h || x.length === 0 || h.length === 0) {
    return { y: [], steps: [] };
  }

  const N = x.length;
  const M = h.length;
  const outputLength = N + M - 1;
  const y = new Array(outputLength).fill(0);
  const steps = [];

  // Compute convolution step by step
  // For each output index n
  for (let n = 0; n < outputLength; n++) {
    const pairs = [];
    let sum = 0;

    // For each position k in x
    for (let k = 0; k < N; k++) {
      // Calculate corresponding index in h: n - k
      const hIndex = n - k;

      // Check if hIndex is valid (0 <= hIndex < M)
      if (hIndex >= 0 && hIndex < M) {
        const xVal = x[k];
        const hVal = h[hIndex];
        const product = xVal * hVal;

        // Store this pair for visualization
        pairs.push({
          xIndex: k,
          hIndex: hIndex,
          xVal: xVal,
          hVal: hVal,
          product: product,
        });

        sum += product;
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

  return { y, steps };
}
