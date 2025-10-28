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

## Paso 2: Crear el repositorio

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

## Paso 3: Test de guardar la transacción de eliminar una cantidad

Clase TransactionRepository.

```ts
export class TransactionRepository {
  addDeposit(amount: number) {}
  addWithdrawal(amount: number) {}
}
```

Unit test: `Account.test.ts`

```ts
describe('The Account', () => {
 ...
  let addWithdrawSpy = jest.spyOn(repository, 'addWithdrawal');

  ...

  it('stores a withdraw transaction throught the repositorio', () => {
    account.withdraw(100);

    expect(addWithdrawSpy).toHaveBeenCalledWith(100);
  });
});
```

Con esto ya pasa el unit test en verde.
El test de aceptación sigue en rojo

## Paso 4. Doble del printStatement

Toca pensar en cómo vamos a diseñar printStatement().
Primero imprimir una cabecera, luego unas lineas ordenadas en forma de pila con las fechas y números formateados.
Debemos preguntarnos si la clase Account debe responsabilizarse de formatear las transacciones.

Al hacer TDD tenemos que preguntarnos constantemente si es responsabilidad de la clase que estamos testando hacer cierta tarea, o debe ser delegada.

En este caso Account es una clase de alto nivel que no debería responsabilizarse de esta tarea y debe delegarse a otra clase, que vamos a llamar StatementPrinter()

Antes de entrar en esta clase vamos a hacer el test que comprueba el método `printStatement` de `Account`

> Test unitario `Account.test.ts`

```ts
class Transaction {}

export class StatementPrinter {
  print(transactions: Transaction[]) {}
}

describe('The Account', () => {
  const repository = new TransactionRepository();
  const statementPrinter = new StatementPrinter();
  const account = new Account(repository, statementPrinter);
  let addDepositSpy = jest.spyOn(repository, 'addDeposit');
  let addWithdrawSpy = jest.spyOn(repository, 'addWithdrawal');
  let printerSpy = jest.spyOn(statementPrinter, 'print');

  ...

  it('stores a withdraw transaction throught the repositorio', () => {
    const transaactions = [new Transaction(), new Transaction()];
    repository.allTransactions = () => transaactions;

    account.printStatement();

    expect(printerSpy).toHaveBeenCalledWith(transaactions);
  });
});
```

- Creamos un método print en statementPrinter que reciba un array de transacciones
- Estas transacciones tiene sentido que las proporcione el TransactionRepository mediante el método allTransactions
- Vamos a crear un stub del método allTransactions aplicando monkey patching para este test
- LLamamamos a printStatement
- Debemos inyectar el StatementPrinter en el constructor de Account
- El test de aceptación tampoco coompila, le pasamos también el StatementPrinter

> Fichero: Account.ts

```ts
export class Account {
  constructor(
    private repository: TransactionRepository,
    private statementPrinter: StatementPrinter
  ) {}

  ...

  printStatement() {
    this.statementPrinter.print(this.repository.allTransactions());
  }
}
```

> Fichero: TransactionRepository

```ts
export class TransactionRepository {
  addDeposit(amount: number) {}
  addWithdrawal(amount: number) {}
  allTransactions() {
    return [];
  }
}
```

> test de aceptación: banking.test.ts

```ts
describe('Print statement', () => {
  const console = new Console();
  const consoleSpy = jest.spyOn(console, 'log');
  const repository = new TransactionRepository();
  const statementPrinter = new StatementPrinter(); // new
  const account = new Account(repository, statementPrinter); // upd

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

> Refactor: movemos las clases Transaction y StatementPrinter a sus propios ficheros
