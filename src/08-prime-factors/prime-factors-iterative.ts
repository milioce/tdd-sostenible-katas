export function getPrimeFactorsIterative(number: number): number[] {
  checkPositiveNumber(number);
  return primeFactors(number);
}

function checkPositiveNumber(number) {
  if (number < 1) {
    throw new Error('Only positive numbers are allowed');
  }
}

function findSmallestPrime(number: number) {
  if (number === 1) {
    return 1;
  }

  let factor = 2;
  while (number % factor !== 0) {
    factor++;
  }

  return factor;
}

function primeFactors(number: number) {
  const factors = [];
  let remainder = number;

  while (remainder > 1) {
    const prime = findSmallestPrime(remainder);
    remainder = remainder / prime;
    factors.push(prime);
  }

  return number === 1 ? [number] : factors;
}
