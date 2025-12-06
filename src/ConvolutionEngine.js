
/**
 * Computes linear convolution and returns step-by-step data
 * @param {number[]} x - First input sequence
 * @param {number[]} h - Second input sequence (impulse response)
 * @returns {Object} Object containing:
 *   - y: output array
 *   - steps: array of objects describing each computation step
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

  const hFlipped = h.slice().reverse();

  for (let n = 0; n < outputLength; n++) {
    const pairs = [];
    let sum = 0;
    
    const hPositioned = new Array(N).fill(null);

    for (let k = 0; k < N; k++) {
      const hIndexOriginal = n - k;

      if (hIndexOriginal >= 0 && hIndexOriginal < M) {
        const hfIndex = M - 1 - hIndexOriginal;
        const xVal = x[k];
        const hVal = hFlipped[hfIndex];
        const product = xVal * hVal;

        hPositioned[k] = hVal;

        pairs.push({
          xIndex: k,
          hIndex: k, 
          hIndexOriginal: hfIndex,
          xVal: xVal,
          hVal: hVal,
          product: product,
        });

        sum += product;
      } else if (zeroPad) {
        const xVal = x[k];
        const hVal = 0;
        const product = 0;
        
        hPositioned[k] = 0;
        
        pairs.push({
          xIndex: k,
          hIndex: k,
          hIndexOriginal: null,
          xVal: xVal,
          hVal: hVal,
          product: product,
        });
      }
    }

    y[n] = sum;
    steps.push({
      n: n,
      pairs: pairs,
      sum: sum,
      hPositioned: hPositioned,
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

  if (!x || !h || x.length === 0 || h.length === 0) {
    return { y: [], steps: [], hFlipped: [] };
  }

  const N = Math.max(x.length, h.length);
  
  const xPadded = [...x];
  const hPadded = [...h];
  
  while (xPadded.length < N) xPadded.push(0);
  while (hPadded.length < N) hPadded.push(0);

  const y = new Array(N).fill(0);
  const steps = [];

  const hFlipped = hPadded.slice().reverse();

  for (let n = 0; n < N; n++) {
    const pairs = [];
    let sum = 0;
    
    const hPositioned = new Array(N).fill(null);

    for (let k = 0; k < N; k++) {
      const hIndexOriginal = ((n - k) % N + N) % N; 
      
      const hfIndex = N - 1 - hIndexOriginal;
      const xVal = xPadded[k];
      const hVal = hFlipped[hfIndex];
      const product = xVal * hVal;

      hPositioned[k] = hVal;

      pairs.push({
        xIndex: k,
        hIndex: k, 
        hIndexOriginal: hfIndex, 
        hIndexCircular: hIndexOriginal, 
        xVal: xVal,
        hVal: hVal,
        product: product,
      });

      sum += product;
    }

    y[n] = sum;
    steps.push({
      n: n,
      pairs: pairs,
      sum: sum,
      hPositioned: hPositioned,
    });
  }

  return { y, steps, hFlipped };
}
