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

/**
 * Computes circular convolution and returns step-by-step data.
 * For circular convolution, both sequences are assumed to have the same length N.
 * If they don't, the shorter one is zero-padded to match the longer one.
 * 
 * Formula: y[n] = sum_k x[k] * h[(n-k) mod N]
 * Output length equals the length of the longer input sequence.
 * 
 * @param {number[]} x - First input sequence
 * @param {number[]} h - Second input sequence (impulse response)
 * @param {Object} options - Options object
 * @returns {Object} Object containing:
 *   - y: output array
 *   - steps: array of objects describing each computation step
 *   - hFlipped: flipped version of h for display purposes
 */
export function convolveCircular(x, h, options = {}) {
  const { zeroPad = false } = options;

  // Validate inputs
  if (!x || !h || x.length === 0 || h.length === 0) {
    return { y: [], steps: [], hFlipped: [] };
  }

  // For circular convolution, both sequences should have the same length
  const N = Math.max(x.length, h.length);
  
  // Zero-pad sequences to same length if needed
  const xPadded = [...x];
  const hPadded = [...h];
  
  while (xPadded.length < N) xPadded.push(0);
  while (hPadded.length < N) hPadded.push(0);

  const y = new Array(N).fill(0);
  const steps = [];

  // hFlipped is h reversed, used for display and step bookkeeping.
  const hFlipped = hPadded.slice().reverse();

  for (let n = 0; n < N; n++) {
    const pairs = [];
    let sum = 0;

    // For each position k in x
    for (let k = 0; k < N; k++) {
      // For circular convolution: h index is (n-k) mod N
      const hIndexOriginal = ((n - k) % N + N) % N; // Handle negative modulo correctly
      
      // Map to index in flipped array: hfIndex = N-1 - hIndexOriginal
      const hfIndex = N - 1 - hIndexOriginal;
      const xVal = xPadded[k];
      const hVal = hFlipped[hfIndex];
      const product = xVal * hVal;

      // Store pair referencing indices into x and hFlipped for display
      pairs.push({
        xIndex: k,
        hIndex: hfIndex, // index into hFlipped
        hIndexCircular: hIndexOriginal, // original circular index for reference
        xVal: xVal,
        hVal: hVal,
        product: product,
      });

      sum += product;
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
