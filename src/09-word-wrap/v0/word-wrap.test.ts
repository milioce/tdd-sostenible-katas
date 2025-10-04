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
  if (text.length > columnWidth) {
    return text.substring(0, columnWidth) + '\n' + text.substring(columnWidth);
  }
  return text;
}

describe('wordWrap function', () => {
  it('makes every single line of text fit column width', () => {
    expect(wordWrap('hello', 5)).toBe('hello');
    expect(wordWrap('longword', 4)).toBe('long\nword');
  });
});
