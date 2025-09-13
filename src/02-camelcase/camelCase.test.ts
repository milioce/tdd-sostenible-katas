import { toCamelCase } from './camelCase';

// Bloques de un test: Preparación (Arrange), Ejecución (Act) y Validación (Assert)
// Given, When, Then

describe('Camel Case converter', () => {
  it('Allow empty string', () => {
    expect(toCamelCase('')).toBe('');
  });

  it('Allow capitalized word', () => {
    expect(toCamelCase('Foo')).toBe('Foo');
  });

  it('Joins capitalized words separated by spaces"', () => {
    expect(toCamelCase('Foo Bar')).toBe('FooBar');
  });

  it('Joins capitalized words separated by hyphens ', () => {
    expect(toCamelCase('Foo_Bar-Foo')).toBe('FooBarFoo');
  });

  it('Convert the first character of a word to uppercase', () => {
    expect(toCamelCase('foo')).toBe('Foo');
  });

  it('Convert the first character of each word to uppercase', () => {
    expect(toCamelCase('foo_bar_foo bar')).toBe('FooBarFooBar');
  });
});
