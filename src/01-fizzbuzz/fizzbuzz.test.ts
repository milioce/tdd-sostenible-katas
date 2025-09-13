import { expect } from '@jest/globals';
import { fizzbuzz } from './fizzbuzz';

describe('Fizzbuzz', () => {
  it('returns number 1 as string for number 1', () => {
    expect(fizzbuzz(1)).toBe('1');
  });

  it('returns number 2 as string for number 2', () => {
    expect(fizzbuzz(2)).toBe('2');
  });

  it('returns fizz for number 3', () => {
    expect(fizzbuzz(3)).toBe('fizz');
  });

  it('returns buzz for number 5', () => {
    expect(fizzbuzz(5)).toBe('buzz');
  });

  it('returns fizzbuzz for number 15', () => {
    expect(fizzbuzz(15)).toBe('fizzbuzz');
  });

  it('returns fizz for any number divisible by 3', () => {
    expect(fizzbuzz(6)).toBe('fizz');
  });

  it('returns buzz for any number divisible by 5', () => {
    expect(fizzbuzz(10)).toBe('buzz');
  });

  it('returns fizzbuzz for any number divisible by 15', () => {
    expect(fizzbuzz(30)).toBe('fizzbuzz');
  });

  it('returns number as string for any number not divisible by 3 or 5', () => {
    expect(fizzbuzz(17)).toBe('17');
  });
});
