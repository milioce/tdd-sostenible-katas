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

x
