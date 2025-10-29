import { Console } from '../../src/Console';
import { StatementPrinter } from '../../src/StatementPrinter';
import { Transaction } from '../../src/Transaction';

describe('The StatementPrinter', () => {
  const console = new Console();
  const consoleSpy = jest.spyOn(console, 'log');

  it('always prints the header throughout the console', () => {
    const statementPrinter = new StatementPrinter(console);

    statementPrinter.print([]);

    expect(consoleSpy).toHaveBeenCalledWith('Date | Amount | Balance');
  });

  it('prints a statement of account including a given transaction throughout the console', () => {
    const statementPrinter = new StatementPrinter(console);
    const transactions = [new Transaction('25/03/2022', 500)];

    statementPrinter.print(transactions);

    expect(consoleSpy).toHaveBeenCalledWith('Date | Amount | Balance');
    expect(consoleSpy).toHaveBeenCalledWith('25/03/2022 | 500.00 | 500.00');
  });

  it('prints a statement of account including multiple transactions throughout the console', () => {
    const statementPrinter = new StatementPrinter(console);
    const transactions = [
      new Transaction('25/03/2022', 500),
      new Transaction('26/03/2022', 500),
      new Transaction('27/03/2022', -200),
    ];

    statementPrinter.print(transactions);

    expect(consoleSpy).toHaveBeenCalledWith('Date | Amount | Balance');
    expect(consoleSpy).toHaveBeenCalledWith('27/03/2022 | -200.00 | 800.00');
    expect(consoleSpy).toHaveBeenCalledWith('26/03/2022 | 500.00 | 1000.00');
    expect(consoleSpy).toHaveBeenCalledWith('25/03/2022 | 500.00 | 500.00');
  });
});
