export function fizzbuzz(number: number) {
  function isDivisibleBy(divisor: number) {
    return number % divisor === 0;
  }

  if (isDivisibleBy(15)) {
    return 'fizzbuzz';
  }
  if (isDivisibleBy(5)) {
    return 'buzz';
  }
  if (isDivisibleBy(3)) {
    return 'fizz';
  }

  return number.toString();
}
