> Paso 1: Texto vacío

```ts
function wordWrap(text: string, width: number): string {
  return null;
}

it('An empty string return an empty string', () => {
  expect(wordWrap('', 5)).toBe('');
});
```

```ts
function wordWrap(text: string, width: number): string {
  return '';
}
```

> Paso 2: Texto que cabe en el ancho

```ts
it('An empty string return an empty string', () => {
  expect(wordWrap('', 5)).toBe('');
});
```

```ts
function wordWrap(text: string, width: number): string {
  return text;
}
```

> Paso 3: Palabra larga que necesita un salto de línea

```ts
it('If the text is larger than the with, cut the text in two words', () => {
  expect(wordWrap('longword', 4)).toBe('long\nword');
});
```

Transformation

```ts
function wordWrap(text: string, width: number): string {
  if (text.length > width) {
    return [text.substring(0, width), text.slice(width)].join('\n');
  }

  return text;
}
```

Refactor

```ts
function wordWrap(text: string, width: number): string {
  if (text.length > width) {
    const textCut = text.substring(0, width);
    const restOfText = text.slice(width);
    return [textCut, restOfText].join('\n');
  }

  return text;
}
```

> Paso 4: Palabra larga que necesita más de un salto de línea

```ts
it('If the text is larger than the with, cut the text in two words', () => {
  expect(wordWrap('longword', 4)).toBe('long\nword');
  expect(wordWrap('reallylongword', 4)).toBe('real\nlylo\nngwo\nrd');
});
```

Transformation: Incluir recursividad

```ts
function wordWrap(text: string, width: number): string {
  if (text.length > width) {
    const textCut = text.substring(0, width);
    const restOfText = text.slice(width);
    return [textCut, wordWrap(restOfText, width)].join('\n');
  }

  return text;
}
```

> Paso 5: Dos palabras separadas con un espacio, que necesita un salto de línea en el espacio

```ts
it('A larger text with spaces that cut on the space', () => {
  expect(wordWrap('abc def', 4)).toBe('abc\ndef');
});
```

Transformation: Incluir condición

```ts
function wordWrap(text: string, width: number): string {
  if (text.length > width) {
    const textCut = text.substring(0, width);
    const restOfText = text.slice(width);
    return [textCut, wordWrap(restOfText, width)].join('\n');
  }

  return text;
}
```

Refactor

- Invertir condición de salida

```ts
function wordWrap(text: string, width: number): string {
  if (text.length <= width) {
    return text;
  }

  let textCut = text.substring(0, width);
  let restOfText = text.slice(width);
  if (textCut.indexOf(' ') !== -1) {
    textCut = text.substring(0, text.indexOf(' '));
    restOfText = text.slice(text.indexOf(' ') + 1);
  }

  return [textCut, wordWrap(restOfText, width)].join('\n');
}
```

- Extraer variable `positionSpace`

```ts
function wordWrap(text: string, width: number): string {
  if (text.length <= width) {
    return text;
  }

  let textCut = text.substring(0, width);
  let restOfText = text.slice(width);
  const positionSpace = textCut.indexOf(' ');
  if (positionSpace !== -1) {
    textCut = text.substring(0, positionSpace);
    restOfText = text.slice(positionSpace + 1);
  }

  return [textCut, wordWrap(restOfText, width)].join('\n');
}
```

- Extraer código a function

```ts
function wordWrap(text: string, width: number): string {
  if (text.length <= width) {
    return text;
  }

  let { textCut, restOfText } = cutTextByWidth(text, width);
  return [textCut, wordWrap(restOfText, width)].join('\n');
}

function cutTextByWidth(text: string, width: number) {
  let textCut = text.substring(0, width);
  let restOfText = text.slice(width);
  const positionSpace = textCut.indexOf(' ');
  if (positionSpace !== -1) {
    textCut = text.substring(0, positionSpace);
    restOfText = text.slice(positionSpace + 1);
  }
  return { textCut, restOfText };
}
```

> Paso 6: Más de dos palabras separadas por espacios, que necesitan más de un salto de línea en los espacios

```ts
it('A larger text with spaces that cut on the space', () => {
  expect(wordWrap('abc def', 4)).toBe('abc\ndef');
  expect(wordWrap('abc def ghi', 4)).toBe('abc\ndef\nghi');
});
```

La recursividad ya cumple este test.

> Paso 7: Casos límite, para un valor nulo devolver ''

```ts
it('When the text is null, return empty string', () => {
  expect(wordWrap(null, 5)).toBe('');
});
```

Transformation

```ts
function wordWrap(text: string, width: number): string {
  if (typeof text !== 'string') {
    return '';
  }

  if (text.length <= width) {
    return text;
  }

  let { textCut, restOfText } = cutTextByWidth(text, width);
  return [textCut, wordWrap(restOfText, width)].join('\n');
}
```

> Paso 8: Casos límite, para un ancho no positivo lanzar una excepción

```ts
it('When the width is not positive, throw an exception', () => {
  expect(() => wordWrap('hello', -1)).toThrow('Invalid width value');
});
```

Para un valor negativo ya lanza una excepción de máximo de pila alcanzada en la recursión.
Necesitamos controlar que excepción lanza

```ts
function wordWrap(text: string, width: number): string {
  if (width <= 0) {
    throw new Error('Invalid width value');
  }

  if (typeof text !== 'string') {
    return '';
  }

  if (text.length <= width) {
    return text;
  }

  let { textCut, restOfText } = cutTextByWidth(text, width);
  return [textCut, wordWrap(restOfText, width)].join('\n');
}
```

Refactor: Extract width validation to a function

```ts
function wordWrap(text: string, width: number): string {
  checkInvalidWidth(width);

  if (typeof text !== 'string') {
    return '';
  }

  if (text.length <= width) {
    return text;
  }

  let { textCut, restOfText } = cutTextByWidth(text, width);
  return [textCut, wordWrap(restOfText, width)].join('\n');
}

function checkInvalidWidth(width: number) {
  if (width <= 0) {
    throw new Error('Invalid width value');
  }
}
```
