export function fibonnaci(n: number): number {
  if (n <= 1) {
    return n;
  }

  let before_one = 1;
  let before_two = 0;
  let index = 2;

  while (index++ < n) {
    const item = before_one + before_two;
    before_two = before_one;
    before_one = item;
  }

  return before_one + before_two;
}
