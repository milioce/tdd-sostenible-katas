export function stringCalculator(input: string): number {
  if (!input) {
    return 0;
  }

  const { expression, separator } = getExpressionAndSeparator(input);

  const numbers = getNumbers(expression, separator);
  return sumValues(numbers);
}

function getExpressionAndSeparator(input: string) {
  const beginOfConfig = '//';
  const endOfConfig = '/';
  const isCustomConfig = hasCustomConfig(input, beginOfConfig);

  if (isCustomConfig) {
    const separator = getSeparator(input, beginOfConfig, endOfConfig);
    const expression = getCustomExpression(input, endOfConfig);
    return { expression, separator };
  }

  return { expression: input, separator: ',' };
}

function hasCustomConfig(input: string, beginOfConfig: string) {
  return input.startsWith(beginOfConfig);
}

function getCustomExpression(input: string, endOfConfig): string {
  return input.substring(input.lastIndexOf(endOfConfig) + 1);
}

function getSeparator(input: string, beginOfConfig: string, endOfConfig: string) {
  return input.slice(beginOfConfig.length, input.lastIndexOf(endOfConfig));
}

function sumValues(numbers: number[]): number {
  return numbers.reduce((prev, curr) => prev + curr, 0);
}

function isValidNumber(n: string): boolean {
  return /^[0-9]+$/.test(n);
}

function getNumbers(input: string, delimitator: string) {
  return input
    .split(delimitator)
    .filter(isValidNumber)
    .map((n) => Number(n));
}
