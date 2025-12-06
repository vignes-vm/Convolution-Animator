import { convolve } from './ConvolutionEngine.js';

const x = [1, 2, 3];
const h = [5, 6, 7];

const { y, steps } = convolve(x, h);

console.log('Input x:', x);
console.log('Input h:', h);
console.log('Output y:', y);
console.log('Expected y: [5, 16, 34, 32, 21]');
console.log('Match:', JSON.stringify(y) === JSON.stringify([5, 16, 34, 32, 21]));

console.log('\n--- Step Details ---');
steps.forEach((step, idx) => {
  console.log(`Step ${idx}: y[${step.n}]`);
  console.log('  Pairs:', step.pairs.map(p => `x[${p.xIndex}]×h[${p.hIndex}]=${p.product}`).join(', '));
  console.log('  Sum:', step.sum);
});

console.log('\n--- Step Structure Verification ---');
console.log('Number of steps:', steps.length);
console.log('Expected steps:', x.length + h.length - 1);
console.log('First step:', JSON.stringify(steps[0], null, 2));
