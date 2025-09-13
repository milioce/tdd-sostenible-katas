/**
 * 1. En caso de recibir un null o cadena vacía se devuelve 0: null => 0, "" => 0
 * 2. Convierte un numero en formato string a tipo númerico: "1" => 1
 * 3. Suma todos los numeros separados por coma: "1,2" => 3, "1,2,3" => 6
 * 4. No suma valores no numéricos: "a" => 0, "1,a" => 1, "1,a,2" => 3, "1a,2" => 2
 * 5. Suma todos los números separados por un separador personalizado,
 *    "//x/yyy" inicio de configuración, x separador, / fin de configuracion, yyy cadena a procesar
 *    "//#/3#2" => 5, "//#/3,2" => 0, "//%/1%2%3" => 6
 */

import { stringCalculator } from './string-calculator';

describe('String Calculator', () => {
  it('Devuelve 0 para una cadena vacía o null', () => {
    expect(stringCalculator(null)).toBe(0);
    expect(stringCalculator('')).toBe(0);
  });

  it('Convierte un número en formato string a numérico', () => {
    expect(stringCalculator('1')).toBe(1);
  });

  it('Suma todos los números separados por coma', () => {
    expect(stringCalculator('1,2,3')).toBe(6);
  });

  it('No suma valores no numéricos', () => {
    expect(stringCalculator('a')).toBe(0);
    expect(stringCalculator('1,a')).toBe(1);
    expect(stringCalculator('1a')).toBe(0);
    expect(stringCalculator('1a,2')).toBe(2);
  });

  it('Suma todos los números separados por un separador personalizado', () => {
    expect(stringCalculator('//#/3#2')).toBe(5);
    expect(stringCalculator('//#/3,2')).toBe(0);
    expect(stringCalculator('//%/1%2%3')).toBe(6);
  });
});
