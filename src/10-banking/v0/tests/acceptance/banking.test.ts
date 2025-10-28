/**
 * Desarrollar el API de una aplicación sencilla de gestión bancaria.
 * El interfaz de usuario va a ser la API de una clase
 *
 * Requisitos
 * - Hacer un depósito en la cuenta
 * - Retirar de la cuenta
 * - Imprimir los asientos de la cuenta por consola
 *
 * Resultado de imprimir los asientos:
 * Date | Amount | Balance
 * 14/01/2022 | 2000.00 | 2500.00
 * 13/01/2022 | -500.00 | 500.00
 * 10/01/2022 | 1000.00 | 1000.00
 *
 * Respectar el interfaz público de la Clase Account:
 * export class Account {
 *   deposit(amount: number): void
 *   withdraw(amount: number): void
 *   printStatement(): void
 *  }
 *
 */

import { Account } from '../../src/Account';
import { TransactionRepository } from '../../src/TransactionRepository';
import { StatementPrinter } from '../../src/StatementPrinter';

class Console {
  log(message: string) {
    console.log(message);
  }
}

describe('Print statement', () => {
  const console = new Console();
  const consoleSpy = jest.spyOn(console, 'log');
  const repository = new TransactionRepository();
  const statementPrinter = new StatementPrinter();
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
