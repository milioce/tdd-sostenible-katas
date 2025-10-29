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

## Paso 5: Aplicando TDD al repositorio

El siguiente paso es hacer TDD al Transaction Repository
Si fuera un test real, debería ser un test de integración que testeara esta clase contra una base de datos.
En este ejercicio usaremos un Fake repositorio (un repositorio en memoria)

> Test unitario: TransactionRepository.test.ts

Queremos probar que cuando hacemos un depósito se almacena una transacción con la fecha y un importe determinado.

```ts
import { Clock } from '../../src/Clock';
import { Transaction } from '../../src/Transaction';
import { TransactionRepository } from '../../src/TransactionRepository';

describe('The Transaction Repository', () => {
  it('stores a deposit transaction for a given amount', () => {
    const today = '25/03/2022';
    const clock = new Clock();
    clock.todayAsString = () => today;
    const amount = 100;
    const repository = new TransactionRepository();
    const transactions = repository.allTransactions();

    repository.addDeposit(amount);

    expect(transactions[0]).toEqual(new Transaction(today, amount));
  });
});
```

- Cada vez que hacemos un asiento debemos obtener la fecha actual
- En test unitarios no podemos depender de ningún artefacto sobre el que no tienes control. Las fechas generadas por el sistema es un ejemplo, con un new Date() el test nunca pasará por que genera un fecha distinta cada vez y debemos controlar esa aleatoriedad.
- Para obtener la fecha podemos crear una clase Clock con un metodo todayAsString que devuelve la fecha actual formateada. Este método lo podemos simular con un stub que devuelva la fecha que necesitamos.

Fichero: Clock.ts

```ts
export class Clock {
  todayAsStrins() {
    return '';
  }
}
```

Fichero: Transaction.ts

Añadimos los parámetros al constructor para que compile

```ts
export class Transaction {
  constructor(
    readonly date: string,
    readonly amount: number
  ) {}
}
```

Ya compila y tenemos el test en rojo

> Para pasar el test, inyectamos la clase Clock en el repositorio

Fichero: TransactionRepository.test.ts

```ts
describe('The Transaction Repository', () => {
  it('stores a deposit transaction for a given amount', () => {
    const today = '25/03/2022';
    const clock = new Clock();
    clock.todayAsString = () => today;
    const amount = 100;
    const repository = new TransactionRepository(clock); // upd
    const transactions = repository.allTransactions();

    repository.addDeposit(amount);

    expect(transactions[0]).toEqual(new Transaction(today, amount));
  });
});
```

Y guardamos todas las transacciones en un array

```ts
export class TransactionRepository {
  transactions: Transaction[] = [];

  constructor(private clock: Clock) {}

  addDeposit(amount: number) {
    this.transactions.push(new Transaction(this.clock.todayAsString(), amount));
  }

  addWithdrawal(amount: number) {}

  allTransactions() {
    return this.transactions;
  }
}
```

Ahora pasamos la dependencia Clock en los tests de Account y aceptación.

```ts
...
import { Clock } from '../../src/Clock';

describe('The Account', () => {
  const repository = new TransactionRepository(new Clock()); // updated
  ...
});
```

```ts
import { Clock } from '../../src/Clock';

describe('Print statement', () => {
  const console = new Console();
  const consoleSpy = jest.spyOn(console, 'log');
  const repository = new TransactionRepository(new Clock()); // updated
  ...
});
```

Refactor en el test y en el repositorio

```ts
describe('The Transaction Repository', () => {
  const today = '25/03/2022'; // moved
  const clock = new Clock(); // moved
  clock.todayAsString = () => today; // moved
  const repository = new TransactionRepository(clock); // moved

  it('stores a deposit transaction for a given amount', () => {
    const amount = 100;

    repository.addDeposit(amount);

    const transactions = repository.allTransactions();
    expect(transactions[0]).toEqual(new Transaction(today, amount));
  });
});
```

```ts
export class TransactionRepository {
  transactions: Transaction[] = [];

  constructor(private clock: Clock) {}

  addDeposit(amount: number) {
    const transaction = new Transaction(this.clock.todayAsString(), amount); // new constant
    this.transactions.push(transaction);
  }

  addWithdrawal(amount: number) {}

  allTransactions() {
    return this.transactions;
  }
}
```

### Siguiente caso retirar importe

Añadimos el test unitario

```ts
describe('The Transaction Repository', () => {
  const today = '25/03/2022';
  const clock = new Clock();
  clock.todayAsString = () => today;
  let repository: TransactionRepository; // new

  // New: Creamos una nueva instancia en cada test
  beforeEach(() => {
    repository = new TransactionRepository(clock);
  });

  it('stores a deposit transaction for a given amount', () => {
    const amount = 100;

    repository.addDeposit(amount);

    const transactions = repository.allTransactions();
    expect(transactions[0]).toEqual(new Transaction(today, amount));
  });

  // NEW
  it('stores a withdrawal transaction for a given amount', () => {
    const amount = 100;

    repository.addWithdrawal(amount);

    const transactions = repository.allTransactions();
    expect(transactions[0]).toEqual(new Transaction(today, -amount));
  });
});
```

## Paso 6. TDD sobre la clase Clock

Queremos probar que se está generando la fecha y en el formato correcto

Creamos el test unitario Clock.test.ts

```ts
import { Clock } from '../../src/Clock';

describe('The Clock', () => {
  it('gets today date in dd/mm/yyyy format', () => {
    const clock = new Clock();
    const date = clock.todayAsString();

    expect(date).toEqual('29/10/2025');
  });
});
```

Para pasar el test hacemos que el método `todayAsString` devuelva la fecha actual

```ts
export class Clock {
  todayAsString() {
    const today = new Date();
    const formattedToday = today.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });

    return formattedToday;
  }
}
```

El problema de esta solución es que el test va a fallar si lo ejecutamos otro día.
Creamos un método protegido que devuelva la fecha y después podemos crear una clase TestableClock en la que sobrescribamos el método y nos permite fijar la fecha.

Fichero `Clock.ts`

```ts
export class Clock {
  todayAsString() {
    const today = this.today();
    const formattedToday = today.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });

    return formattedToday;
  }

  protected today() {
    return new Date();
  }
}
```

y creamos la clase `TestableClass` en el test unitario `Clock.test.ts`

```ts
import { Clock } from '../../src/Clock';

class TestableClass extends Clock {
  protected today(): Date {
    return new Date('2022-03-20');
  }
}

describe('The Clock', () => {
  it('gets today date in dd/mm/yyyy format', () => {
    const clock = new TestableClass();
    const date = clock.todayAsString();

    expect(date).toEqual('20/03/2022');
  });
});
```

## Paso 7. TDD de la clase StatementPrinter

En el primer test comprobamos que estamos llamando al console.log()

```ts
import { Console } from '../../src/Console';
import { StatementPrinter } from '../../src/StatementPrinter';

describe('The StatementPrinter', () => {
  const console = new Console();
  const consoleSpy = jest.spyOn(console, 'log');

  it('always prints the header throughout the console', () => {
    const statementPrinter = new StatementPrinter(console);

    statementPrinter.print([]);
    expect(consoleSpy).toHaveBeenCalledWith('Date | Amount | Balance');
  });
});
```

Inyectamos la dependencia de la clase `Console` en `StatementPrinter`

```ts
import { Console } from './Console';
import { Transaction } from './Transaction';

export class StatementPrinter {
  constructor(console: Console) {}
  print(transactions: Transaction[]) {}
}
```

Ahora tenemos que inyectar esa dependencia en el test de aceptación y en el test de Account para que no haya errores.

Test unitario `Account.test.ts`

```ts
describe('The Account', () => {
  const repository = new TransactionRepository(new Clock());
  const statementPrinter = new StatementPrinter(new Console()); // updated
  const account = new Account(repository, statementPrinter);
  ...
});
```

Test de aceptación `banking.test.ts`

```ts
describe('Print statement', () => {
  const console = new Console();
  const consoleSpy = jest.spyOn(console, 'log');
  const repository = new TransactionRepository(new Clock());
  const statementPrinter = new StatementPrinter(new Console());
  const account = new Account(repository, statementPrinter);

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

Ahora ya compila todo y tenemos el test unitario en rojo `StatementPrinter.test.ts`

Para cumplir el test imprimimos la cabecera

```ts
export class StatementPrinter {
  constructor(private console: Console) {}

  private readonly header = 'Date | Amount | Balance';

  print(transactions: Transaction[]) {
    this.console.log(this.header);
  }
}
```

## Paso 8. Añadimos un test para imprimir uan transacción

```ts
describe('The StatementPrinter', () => {
  ...

  it('prints a statement of account including a given transaction throughout the console', () => {
    const statementPrinter = new StatementPrinter(console);
    const transactions = [new Transaction('25/03/2022', 500)];

    statementPrinter.print(transactions);

    expect(consoleSpy).toHaveBeenCalledWith('Date | Amount | Balance');
    expect(consoleSpy).toHaveBeenCalledWith('25/03/2022 | 500.00 | 500.00');
  });
});
```

Para pasar el test lo mas rápido posible comprobamos si hay transacciones y mostramos la primera transacción

```ts
export class StatementPrinter {
  constructor(private console: Console) {}

  private readonly header = 'Date | Amount | Balance';

  print(transactions: Transaction[]) {
    this.console.log(this.header);
    if (transactions.length > 0) {
      this.console.log(
        `${transactions[0].date} | ${transactions[0].amount.toFixed(2)} | ${transactions[0].amount.toFixed(2)}`
      );
    }
  }
}
```
