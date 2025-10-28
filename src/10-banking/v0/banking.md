# Kata Banking Data - Outline-in TDD

> Requisitos

Nuestra aplicación debe permitir:

- Hacer un depósito en la cuenta
- Retirar de la cuenta
- Imprimir los asientos de la cuenta por consola

El resultado de imprimir los asientos debe ser:

```txt
Date       | Amount    | Balance
14/01/2022 | 2000.00   | 2500.00
13/01/2022 | -500.00   | 500.00
10/01/2022 | 1000.00   | 1000.00
```

> Restricción

- Respectar la interfaz pública de la clase

```ts
export class Account {
  deposit(amount: number): void;
  withdraw(amount: number): void;
  printStatement(): void;
}
```

## Paso 1. Test de aceptación en rojo

Creo el primer test de aceptación en rojo

```ts
class Console {
  log(message: string) {
    console.log(message);
  }
}

class Account {
  deposit(amount: number) {}
  withdraw(amount: number) {}
  printStatement() {}
}

describe('Print statement', () => {
  const console = new Console();
  const consoleSpy = jest.spyOn(console, 'log');
  let account = new Account();

  it('prints an account statement including the transaactions made throughout the console', () => {
    account.deposit(1000);
    account.withdraw(500);
    account.deposit(2000);

    account.printStatement();

    expect(consoleSpy).toHaveBeenCalledWith('Date | Amount | Balance');
    expect(consoleSpy).toHaveBeenCalledWith('14/01/2022 | 2000.00 | 2500.00');
    expect(consoleSpy).toHaveBeenCalledWith('13/01/2022 | -500.00 | 500.00');
    expect(consoleSpy).toHaveBeenCalledWith('10/01/2022 | 1000.00 | 1000.00');
  });
});
```

printStatement() no invoca a console porque todavía no sabemos como inyectar esta dependencia.
Lo dejamos así y vamos a aplicar TDD a la clase Account.

Primero aplicamos refactor y nos llevamos la clase a otro fichero

## Paso 2:

Los métodos de la clase Account son comandos, producen un cambio de estado en el sistema y no devuelven ningún valor.

Necesitamos almacenar la transacción y la fecha. Vamos a delegar esto en un repositorio.
El patrón repositorio nos permite mantener agnosticos los detalles de implementación de la capa de persistencia.

Creamos un test unitario para la clase Account

```ts
import { Account } from '../../Account';

class TransactionRepository {
  addDeposit(amount: number) {}
}

describe('The Account', () => {
  const account = new Account();
  let repository = new TransactionRepository();
  let addDepositSpy = jest.spyOn(repository, 'addDeposit');
  it('stores a deposit transaction throught the repositorio', () => {
    account.deposit(100);

    expect(addDepositSpy).toHaveBeenCalledWith(100);
  });
});
```

Ahora falla tanto el test de aceptación como el test unitario.
Tenemos que inyectar el repositorio en la clase Account y llamar a addDeposit.

Pero antes refactorizo moviendo la clase TransactionRepository a un nuevo fichero.

Unit test: `Account.test.ts`

```ts
import { Account } from '../../src/Account';
import { TransactionRepository } from '../../src/TransactionRepository';

describe('The Account', () => {
  let repository = new TransactionRepository();
  const account = new Account(repository);
  let addDepositSpy = jest.spyOn(repository, 'addDeposit');
  it('stores a deposit transaction throught the repositorio', () => {
    account.deposit(100);

    expect(addDepositSpy).toHaveBeenCalledWith(100);
  });
});
```

Aceptance test: `banking.test.ts`

```ts
describe('Print statement', () => {
  const console = new Console();
  const consoleSpy = jest.spyOn(console, 'log');
  let repository = new TransactionRepository();
  let account = new Account(repository);

  it('prints an account statement including the transaactions made throughout the console', () => {
    account.deposit(1000);
    account.withdraw(500);
    account.deposit(2000);

    account.printStatement();

    expect(consoleSpy).toHaveBeenCalledWith('Date | Amount | Balance');
    expect(consoleSpy).toHaveBeenCalledWith('14/01/2022 | 2000.00 | 2500.00');
    expect(consoleSpy).toHaveBeenCalledWith('13/01/2022 | -500.00 | 500.00');
    expect(consoleSpy).toHaveBeenCalledWith('10/01/2022 | 1000.00 | 1000.00');
  });
});
```
