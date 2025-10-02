> Paso 1: Falla el test

```ts
describe('prime factors', () => {
  it('finds the prime composition of the given number', () => {
    expect(getPrimeFactors(2)).toEqual([2]);
  });
});

export function getPrimeFactors(n: number): number[] {
  return null;
}
```

> Paso 2 refactor: Devolver constante (primer paso de generalización)

```ts
export function getPrimeFactors(n: number): number[] {
  return [2];
}
```

> Paso 3 refactor: Devolver una variable (Segundo paso de generalización)

```ts
export function getPrimeFactors(n: number): number[] {
  const factors = [2];
  return factors;
}
```

> Paso 4: Añado siguiente test y falla

```ts
describe('prime factors', () => {
  it('finds the prime composition of the given number', () => {
    expect(getPrimeFactors(2)).toEqual([2]);
    expect(getPrimeFactors(2 * 2)).toEqual([2, 2]);
  });
});

export function getPrimeFactors(n: number): number[] {
  const factors = [2];
  return factors;
}
```

> Paso 5:

- Siguiente paso de generalización => añadir más líneas de código sin condicionales
- No puedo seguirlo, el mínimo es añadir un condicional

```ts
describe('prime factors', () => {
  it('finds the prime composition of the given number', () => {
    expect(getPrimeFactors(2)).toEqual([2]);
    expect(getPrimeFactors(2 * 2)).toEqual([2, 2]);
  });
});

export function getPrimeFactors(n: number): number[] {
  const factors = [2];
  if (number / factor > 1) {
    factors.push(2);
  }
  return factors;
}
```

> Paso 6: Refactor

- Añadimos variable explicativa para la constante 2 y evitamos tener un `magic number` => factor
- Añadimos variable para la operación entre number y factor => remainder
- En lugar de mutar el array lo devuelvo, concatenando el factor

```ts
export function getPrimeFactors(n: number): number[] {
  const factor = 2;
  const factors = [factor];
  const remainder = n / factor;
  if (remainder > 1) {
    return factors.concat(factor);
  }
  return factors;
}
```

> Paso 7: Tercer test, más de 2 veces el mismo factor => Falla

```ts
describe('prime factors', () => {
  it('finds the prime composition of the given number', () => {
    expect(getPrimeFactors(2)).toEqual([2]);
    expect(getPrimeFactors(2 * 2)).toEqual([2, 2]);
    expect(getPrimeFactors(2 * 2 * 2)).toEqual([2, 2, 2]);
  });
});
```

> Paso 8: Añadimos la llamada recursiva

- Rober C. Martin propone añadir la recursión antees incluso que la iteración
- Al haber aclarado el código con nombres se ve facil la recursividad

```ts
export function getPrimeFactors(n: number): number[] {
  const factor = 2;
  const factors = [factor];
  const remainder = n / factor;
  if (remainder > 1) {
    return factors.concat(getPrimeFactors(remainder));
  }
  return factors;
}
```

> Paso 9: Añadimos un test de un número divisible por tres => Falla

- Ya tenemos la rama de números divisibles por 2 cubierta
- Probamos con un número divisible por 3 para avanzar en la generalización

```ts
describe('prime factors', () => {
  it('finds the prime composition of the given number', () => {
    expect(getPrimeFactors(2)).toEqual([2]);
    expect(getPrimeFactors(2 * 2)).toEqual([2, 2]);
    expect(getPrimeFactors(2 * 2 * 2)).toEqual([2, 2, 2]);
    expect(getPrimeFactors(3)).toEqual([3]);
  });
});
```

> Paso 10: Implementación

- Compruebo si el número no es divisible por el factor actual
- Si no es divisible asigno el siguiente factor: 3

```ts
export function getPrimeFactors(n: number): number[] {
  let factor = 2;
  if (n % factor !== 0) {
    factor = 3;
  }
  const factors = [factor];
  const remainder = n / factor;
  if (remainder > 1) {
    return factors.concat(getPrimeFactors(remainder));
  }
  return factors;
}
```

Este código hace que pase el test, y también pasan los dos siguientes casos

```ts
describe('prime factors', () => {
  it('finds the prime composition of the given number', () => {
    expect(getPrimeFactors(2)).toEqual([2]);
    expect(getPrimeFactors(2 * 2)).toEqual([2, 2]);
    expect(getPrimeFactors(2 * 2 * 2)).toEqual([2, 2, 2]);
    expect(getPrimeFactors(3)).toEqual([3]);

    expect(getPrimeFactors(3 * 3)).toEqual([3, 3]);
    expect(getPrimeFactors(2 * 3)).toEqual([2, 3]);
  });
});
```

Cuando el número sea divisible por 5 no va a funcionar.
Escribimos el siguiente test

> Paso 11: Test número divisible por 5 => Falla

```ts
describe('prime factors', () => {
  it('finds the prime composition of the given number', () => {
    expect(getPrimeFactors(2)).toEqual([2]);
    expect(getPrimeFactors(2 * 2)).toEqual([2, 2]);
    expect(getPrimeFactors(2 * 2 * 2)).toEqual([2, 2, 2]);
    expect(getPrimeFactors(3)).toEqual([3]);
    expect(getPrimeFactors(3 * 3)).toEqual([3, 3]);
    expect(getPrimeFactors(2 * 3)).toEqual([2, 3]);

    expect(getPrimeFactors(5 * 5)).toEqual([5, 5]);
  });
});
```

> Paso 12: El siguiente paso de generalización es la iteración

- Reemplazamos el condicional por una sentencia while

```ts
export function getPrimeFactors(n: number): number[] {
  let factor = 2;
  while (n % factor !== 0) {
    factor++;
  }
  const factors = [factor];
  const remainder = n / factor;
  if (remainder > 1) {
    return factors.concat(getPrimeFactors(remainder));
  }
  return factors;
}
```

Esta implementación funciona para todos los casos.
Añadimos el último caso de prueba para comprobarlo

> Paso 13: Añadimos el último caso de prueba => Test OK

```ts
describe('prime factors', () => {
  it('finds the prime composition of the given number', () => {
    expect(getPrimeFactors(2)).toEqual([2]);
    expect(getPrimeFactors(2 * 2)).toEqual([2, 2]);
    expect(getPrimeFactors(2 * 2 * 2)).toEqual([2, 2, 2]);
    expect(getPrimeFactors(3)).toEqual([3]);
    expect(getPrimeFactors(3 * 3)).toEqual([3, 3]);
    expect(getPrimeFactors(2 * 3)).toEqual([2, 3]);
    expect(getPrimeFactors(5 * 5)).toEqual([5, 5]);

    expect(getPrimeFactors(5 * 7 * 11 * 3)).toEqual([3, 5, 7, 11]);
  });
});
```

Funciona, pero dejamos el test porque probar con un caso complejo nos aporta seguridad

> Paso 14: Limpiamos un poco código de test y función.

- Un solo test con un nombre y varios expect es correcto
- En algunos casos al final repensamos el nombre de los tests y su agrupación
- Elimino test redundantes que ya no nos aportan nada

```ts
describe('prime factors', () => {
  it('Knows what is a prime number', () => {
    expect(getPrimeFactors(2)).toEqual([2]);
    expect(getPrimeFactors(3)).toEqual([3]);
  });

  it('Produces the same result to multiply the numbers in the output list', () => {
    expect(getPrimeFactors(2 * 2 * 2)).toEqual([2, 2, 2]);
  });

  it('orders the prime factors form the smallest to the biggest', () => {
    expect(getPrimeFactors(5 * 7 * 11 * 3)).toEqual([3, 5, 7, 11]);
  });
});
```

> Paso 15: Ahora aplicamos refactor al código de producción para dejarlo más simple y legible

- Aplicamos `inline variable` a `factors` porque no aporta demasiado: `factors => [factor]`

```ts
export function getPrimeFactors(n: number): number[] {
  let factor = 2;
  while (n % factor !== 0) {
    factor++;
  }
  const remainder = n / factor;
  if (remainder <= 1) {
    return [factor];
  }
  return [factor].concat(getPrimeFactors(remainder));
}
```

- Cuando escribimos código recursivo es más intuitivo que la parada este antes de la llamada recursiva
- Invertimos la condición para que la llamada esté al final

- De esta manera nuestra función se convierte en una función con recursividad final y el interprete de Javascript puede aplicar esta optimización por recursión en cola, si dispone de esta opción.

- Reemplazamos un solo condicional con dos return por un ternario

```ts
export function getPrimeFactors(n: number): number[] {
  let factor = 2;
  while (n % factor !== 0) {
    factor++;
  }
  const remainder = n / factor;
  return remainder <= 1 ? [factor] : [factor].concat(getPrimeFactors(remainder));
}
```

- Extraemos el código que calcula el siguiente factor a una función y dejamos explicitas las dos ramas de la solución

```ts
function findSmallestPrime(number: number) {
  let factor = 2;
  while (number % factor !== 0) {
    factor++;
  }

  return factor;
}

export function getPrimeFactors(n: number): number[] {
  const factor = findSmallestPrime(n);
  const remainder = n / factor;
  return remainder <= 1 ? [factor] : [factor].concat(getPrimeFactors(remainder));
}
```

- Reemplazamos el nombre `factor` por `prime`

```ts
function findSmallestPrime(number: number) {
  let factor = 2;
  while (number % factor !== 0) {
    factor++;
  }

  return factor;
}

export function getPrimeFactors(n: number): number[] {
  const prime = findSmallestPrime(n);
  const remainder = n / prime;
  return remainder <= 1 ? [prime] : [prime].concat(getPrimeFactors(remainder));
}
```

- Viendo el código, vemos que para números menores o iguales a 1 el bucle no termina nunca

> Paso 16: Casos límite

- Añadimos un test para el número 1. => Falla bucle infinito

```ts
describe('prime factors', () => {
  it('Knows that the first prime is number one', () => {
    expect(getPrimeFactors(1)).toEqual([1]);
  });

  it('Knows what is a prime number', () => {
    expect(getPrimeFactors(2)).toEqual([2]);
    expect(getPrimeFactors(3)).toEqual([3]);
  });

  it('Produces the same result to multiply the numbers in the output list', () => {
    expect(getPrimeFactors(2 * 2 * 2)).toEqual([2, 2, 2]);
  });

  it('orders the prime factors form the smallest to the biggest', () => {
    expect(getPrimeFactors(5 * 7 * 11 * 3)).toEqual([3, 5, 7, 11]);
  });
});
```

> Paso 17: Añadimos un guard paso ese caso

```ts
function findSmallestPrime(number: number) {
  if (number === 1) {
    return 1;
  }

  let factor = 2;
  while (number % factor !== 0) {
    factor++;
  }

  return factor;
}

export function getPrimeFactors(n: number): number[] {
  if (number < 1) {
    throw new Error('Only positive numbers are allowed');
  }
  const prime = findSmallestPrime(n);
  const remainder = n / prime;
  return remainder <= 1 ? [prime] : [prime].concat(getPrimeFactors(remainder));
}
```

> Paso 18: Para un numero 0 o negativo, lanzamos una excepción

- Añadimos un test para comprobar que falla ese caso
- Para comprobar excepciones debemos envolver la función que la lanza en un callback

```ts
describe('prime factors', () => {
  it('Knows that the first prime is number one', () => {
    expect(getPrimeFactors(1)).toEqual([1]);
  });

  it('Knows what is a prime number', () => {
    expect(getPrimeFactors(2)).toEqual([2]);
    expect(getPrimeFactors(3)).toEqual([3]);
  });

  it('Produces the same result to multiply the numbers in the output list', () => {
    expect(getPrimeFactors(2 * 2 * 2)).toEqual([2, 2, 2]);
  });

  it('orders the prime factors form the smallest to the biggest', () => {
    expect(getPrimeFactors(5 * 7 * 11 * 3)).toEqual([3, 5, 7, 11]);
  });

  it('only accepts positivee numbers', () => {
    expect(() => getPrimeFactors(-1)).toThrow();
  });
});
```

```ts
export function getPrimeFactors(number: number): number[] {
  if (number < 1) {
    throw new Error('Only positive numbers are allowed');
  }
  const prime = findSmallestPrime(number);
  const remainder = number / prime;
  return remainder <= 1 ? [prime] : [prime].concat(getPrimeFactors(remainder));
}
```

> Paso 19: Refactorizar

- Extrar funciones para separar funcionalidades, mantener simetría y mismo nivel de abstracción

```ts
export function getPrimeFactors(number: number): number[] {
  checkPositiveNumber(number);
  return primeFactors(number);
}

function checkPositiveNumber(number) {
  if (number < 1) {
    throw new Error('Only positive numbers are allowed');
  }
}

function findSmallestPrime(number: number) {
  if (number === 1) {
    return 1;
  }

  let factor = 2;
  while (number % factor !== 0) {
    factor++;
  }

  return factor;
}

function primeFactors(number: number) {
  const prime = findSmallestPrime(number);
  const remainder = number / prime;
  return remainder <= 1 ? [prime] : [prime].concat(getPrimeFactors(remainder));
}
```
