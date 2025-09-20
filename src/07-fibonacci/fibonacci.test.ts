/**
 * Kata Fibonacci: Construir una función que reciba un número entero n y devuelva el n-ésimo número de la serie de Fibonacci
 *
 * Reglas de la serie de Fibonacci:
 *   Primero: 0
 *   Segundo: 1
 *   Siguientes: la suma de los dos anteriores
 *
 *   f(0) = 1, f(1) = 1, f(n) = f(n-1) + f(n-2)
 *
 * Serie de Fibonacci:
 *
 *   | --------------------------------------------------------------------------------------- |
 *   | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7  |  8 |  9 | 10 | 11 | 12  |  13 |  14 |  15 |  16 |  17  |
 *   | --------------------------------------------------------------------------------------- |
 *   | 0 | 1 | 1 | 2 | 3 | 5 | 8 | 13 | 21 | 34 | 55 | 89 | 144 | 233 | 377 | 610 | 987 | 1597 |
 *   | --------------------------------------------------------------------------------------- |
 *
 * Pruebas
 * - Para n igual a 0 devuelve 0 (primero número de la serie)
 * - Para n igual a 1 devuelve 1 (segundo número)
 * - Para n igual a 2 devuelve 1 (la suma de los dos anteriores)
 * - Para n igual a 3 devuelve 2
 * - Para n igual a 10 devuelve 55
 * - Para n igual a 17 devuelve 1597
 * - Para n < 0 devuelve un error
 *
 */

import { fibonnaci } from './fibonacci';

describe('Fibonacci', () => {
  it('The first element of the serie is 0', () => {
    expect(fibonnaci(0)).toBe(0);
  });

  it('The second element of the serie is 1', () => {
    expect(fibonnaci(1)).toBe(1);
  });

  it('The third element of the serie is the sum of first and second', () => {
    expect(fibonnaci(2)).toBe(fibonnaci(1) + fibonnaci(0));
  });

  it('For n element of the serie, the result is the sum of f(n-1) + f(n-2)', () => {
    expect(fibonnaci(3)).toBe(fibonnaci(2) + fibonnaci(1));
    expect(fibonnaci(10)).toBe(fibonnaci(9) + fibonnaci(8));
    expect(fibonnaci(17)).toBe(fibonnaci(16) + fibonnaci(15));
  });
});
