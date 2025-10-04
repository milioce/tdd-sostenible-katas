export function wordWrap(text: string, width: number): string {
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
