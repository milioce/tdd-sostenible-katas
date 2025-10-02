export function getPrimeFactors(number: number): number[] {
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
  const prime = findSmallestPrime(number);
  const remainder = number / prime;
  return remainder <= 1 ? [prime] : [prime].concat(getPrimeFactors(remainder));
}
