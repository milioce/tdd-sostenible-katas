/**
 * Implementar una función wordWrap(texto, ancho).
 *
 * Ejemplos:
 * - texto menor que el ancho
 * - texto con una palabra larga que se debe partir una vez
 * - Texto con una palabra larga que debe partir mas veces
 * - Texto con palabras cortas separadas por espacios, que debe separar por espacios
 * - Texto vacio devuelve vacío
 * - ancho negativo lanza excepción
 *
 * - wordWrap('', 5) => ''
 * - wordWrap('hello', 5) => 'hello'
 * - wordWrap('longword', 4) => 'long\nword'
 * - wordWrap('reallylongword',4) ⇒ 'real\nlylo\nngwo\nrd'
 * - wordWrap('abc def',4) ⇒ 'abc\ndef'
 * - wordWrap('abc def ghi',4) ⇒ 'abc\ndef\nghi'
 * - wordWrap(' abcdf',4) ⇒ '\nabcd\nf'
 * - wordWrap(null,5) ⇒ ''
 * - wordWrap('hello',-5) ⇒ throw exception
 */

import { wordWrap } from './word-wrap';

describe('wordWrap function', () => {
  it('empty text does not need to be wrapped', () => {
    expect(wordWrap('', 4)).toBe('');
    expect(wordWrap(null, 4)).toBe('');
    expect(wordWrap(undefined, 4)).toBe('');
  });

  it('small text does not need to be wrapped', () => {
    expect(wordWrap('hello', 5)).toBe('hello');
  });

  it('words are wrapped when do no fit the column width', () => {
    expect(wordWrap('longword', 4)).toBe('long\nword');
    expect(wordWrap('reallylongword', 4)).toBe('real\nlylo\nngwo\nrd');
  });

  it('spaces are preferred for wrapping', () => {
    expect(wordWrap('abc def', 4)).toBe('abc\ndef');
    expect(wordWrap('abc def ghi', 4)).toBe('abc\ndef\nghi');
    expect(wordWrap(' abcd', 4)).toBe('\nabcd');
  });

  it('Does not allow for negative column width', () => {
    expect(() => wordWrap('hello', -3)).toThrow('Negative column width is not allowed');
  });
});
