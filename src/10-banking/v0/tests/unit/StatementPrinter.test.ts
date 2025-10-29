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
