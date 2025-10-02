/**
 * Función primeFactors(n) que descomprime un número entero en sus factores primos.
 * Le pasamos un número entero y devuelve un array con los factores primos, ordenados de menor a mayor
 *
 * 2 => [2]
 * 2 * 2 => [2, 2]
 * 2 * 2 * 2 = [2, 2, 2]
 * 3 = [3]
 * 3 * 3 [3, 3]
 * 3 * 2 => [2, 3]
 * 5 * 5 => [5, 5]
 * 5 * 7 * 11 * 3 => [3, 5, 7, 11]
 */

import { getPrimeFactors } from './prime-factors';

describe('prime factors', () => {
  it('Knows that the first prime is number one', () => {
    expect(getPrimeFactors(1)).toEqual([1]);
  });

  it('Knows what is a prime number', () => {
    expect(getPrimeFactors(2)).toEqual([2]);
    expect(getPrimeFactors(3)).toEqual([3]);
  });

  it('Produces the same result to multiply the numbers in the output list', () => {
    expect(getPrimeFactors(2 * 2 * 2)).toEqual([2, 2, 2]);
  });

  it('orders the prime factors form the smallest to the biggest', () => {
    expect(getPrimeFactors(5 * 7 * 11 * 3)).toEqual([3, 5, 7, 11]);
  });

  it('only accepts positivee numbers', () => {
    expect(() => getPrimeFactors(-1)).toThrow();
  });
});
