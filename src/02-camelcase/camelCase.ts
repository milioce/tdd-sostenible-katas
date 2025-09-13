export function toCamelCase(input: string) {
  const words = input.split(/[ _-]/g);
  return words.map((word) => word.charAt(0).toUpperCase() + word.substring(1)).join('');
}
