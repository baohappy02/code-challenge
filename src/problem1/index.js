// Iterative approach to calculate the sum of numbers from 1 to n
const sumToNIterative = (n) => {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
};
console.log(sumToNIterative(5));

// Mathematical formula approach to calculate the sum of numbers from 1 to n
const sumToNFormula = (n) => {
  return (n * (n + 1)) / 2;
};
console.log(sumToNFormula(5));

// Recursive approach to calculate the sum of numbers from 1 to n
const sumToNRecursive = (n) => {
  if (n <= 1) {
    return n;
  }
  return n + sumToNRecursive(n - 1);
};
console.log(sumToNRecursive(5));
