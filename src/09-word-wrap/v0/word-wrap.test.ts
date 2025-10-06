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

function wordWrapPrimitives(text: string, columnWidth: number): string {
  if (columnWidth < 0) {
    throw new Error('Negative column width is not allowed');
  }

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

class ColumnWidth {
  private constructor(private readonly width: number) {}

  static create(width: number) {
    if (width < 0) {
      throw new Error('Negative column width is not allowed');
    }
    return new ColumnWidth(width);
  }

  value() {
    return this.width;
  }
}

class WrappableText {
  private constructor(private readonly text: string) {}

  static create(text: string) {
    if (text == null) {
      return new WrappableText('');
    }

    return new WrappableText(text);
  }

  fitsIn(columnWidth: ColumnWidth): boolean {
    return this.value().length <= columnWidth.value();
  }

  wrappedText(columnWidth: ColumnWidth): string {
    return this.value().substring(0, this.wrapIndex(columnWidth)).concat('\n');
  }

  private wrapIndex(columnWidth: ColumnWidth): number {
    return this.shallWrapBySpace(columnWidth) ? this.indexOfSpace() : columnWidth.value();
  }

  unwrappedText(columnWidth: ColumnWidth): string {
    return this.value().substring(this.unwrapIndex(columnWidth));
  }

  private unwrapIndex(columnWidth: ColumnWidth): number {
    return this.shallWrapBySpace(columnWidth) ? this.indexOfSpace() + 1 : columnWidth.value();
  }

  private shallWrapBySpace(columnWidth: ColumnWidth): boolean {
    return this.indexOfSpace() > -1 && this.indexOfSpace() < columnWidth.value();
  }

  private indexOfSpace(): number {
    return this.value().indexOf(' ');
  }

  value(): string {
    return this.text;
  }
}

function wordWrap(text: string, columnWidth: number): string {
  return wordWrapNoPrimitives(WrappableText.create(text), ColumnWidth.create(columnWidth));
}

function wordWrapNoPrimitives(text: WrappableText, columnWidth: ColumnWidth): string {
  if (text.fitsIn(columnWidth)) {
    return text.value();
  }

  const wrappedText = text.wrappedText(columnWidth);
  const unwrappedText = text.unwrappedText(columnWidth);

  return wrappedText.concat(wordWrap(unwrappedText, columnWidth.value()));
}

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
