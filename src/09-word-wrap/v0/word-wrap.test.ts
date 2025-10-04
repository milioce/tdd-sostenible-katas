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

function wordWrap(text: string, columnWidth: number): string {
  if (text == null) {
    return '';
  }

  if (text.length <= columnWidth) {
    return text;
  }

  const wrapIndex = getWrapIndex(text, columnWidth);
  const unwrapIndex = getunWrapIndex(text, columnWidth);
  const wrappedText = text.substring(0, wrapIndex).concat('\n');
  const unwrappedText = text.substring(unwrapIndex);

  return wrappedText.concat(wordWrap(unwrappedText, columnWidth));
}

function getWrapIndex(text: string, columnWidth: number) {
  const indexOfSpace = text.indexOf(' ');
  const shallWrapBySpace = indexOfSpace > -1 && indexOfSpace < columnWidth;
  return shallWrapBySpace ? indexOfSpace : columnWidth;
}

function getunWrapIndex(text: string, columnWidth: number) {
  const indexOfSpace = text.indexOf(' ');
  const shallWrapBySpace = indexOfSpace > -1 && indexOfSpace < columnWidth;
  return shallWrapBySpace ? indexOfSpace + 1 : columnWidth;
}

describe('wordWrap function', () => {
  it('makes every single line of text fit column width', () => {
    expect(wordWrap('hello', 5)).toBe('hello');
    expect(wordWrap('longword', 4)).toBe('long\nword');
    expect(wordWrap('reallylongword', 4)).toBe('real\nlylo\nngwo\nrd');
    expect(wordWrap('abc def', 4)).toBe('abc\ndef');
    expect(wordWrap('abc def ghi', 4)).toBe('abc\ndef\nghi');
    expect(wordWrap(' abcd', 4)).toBe('\nabcd');

    expect(wordWrap(null, 4)).toBe('');
    expect(wordWrap(undefined, 4)).toBe('');
  });
});
