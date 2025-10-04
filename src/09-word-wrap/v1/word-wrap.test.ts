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
  it('An empty text return an empty string', () => {
    expect(wordWrap('', 5)).toBe('');
  });

  it('A word is less than or equal the with, return the same text', () => {
    expect(wordWrap('hello', 5)).toBe('hello');
  });

  it('A word that is larger than the with, cut the words by LF', () => {
    expect(wordWrap('longword', 4)).toBe('long\nword');
    expect(wordWrap('reallylongword', 4)).toBe('real\nlylo\nngwo\nrd');
  });

  it('A larger text with spaces that cut on the spaces', () => {
    expect(wordWrap('abc def', 4)).toBe('abc\ndef');
    expect(wordWrap('abc def ghi', 4)).toBe('abc\ndef\nghi');
    expect(wordWrap(' abcdf', 4)).toBe('\nabcd\nf');
  });

  it('When the text is null, return empty string', () => {
    expect(wordWrap(null, 5)).toBe('');
  });

  it('When the width is not positive, throw an exception', () => {
    expect(() => wordWrap('hello', -1)).toThrow('Invalid width value');
  });
});
