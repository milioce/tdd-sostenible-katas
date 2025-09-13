import { passwordValidator } from './password-validator';

/**
 * 1. Debe tener una longitud mínima de al menos 6 caracteres
 * 2. Contener algún número
 * 3. Contener alguna letra mayúscula
 * 4. Contener alguna letra minúscula
 * 5. Contener algún guión bajo
 */
describe('passwordValidator', () => {
  it('Debe contener un número, una mayúscula, una minúscula y un guión bajo', () => {
    expect(passwordValidator('11AAbb__+ñ')).toBe(true);
  });

  it('Debe tener una longitud mínima de 6 caracteres', () => {
    expect(passwordValidator('1Ab_')).toBe(false);
  });

  it('Debe contener algún número', () => {
    expect(passwordValidator('Ab_xxx')).toBe(false);
  });

  it('Debe contener alguna letra mayúscula', () => {
    expect(passwordValidator('1b_xxx')).toBe(false);
  });

  it('Debe contener alguna letra minúscula', () => {
    expect(passwordValidator('1A_XXX')).toBe(false);
  });

  it('Debe contener algún guión bajo', () => {
    expect(passwordValidator('1Abxxxx')).toBe(false);
  });
});
