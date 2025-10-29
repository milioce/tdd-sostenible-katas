import { Account } from '../../src/Account';
import { StatementPrinter } from '../../src/StatementPrinter';
import { TransactionRepository } from '../../src/TransactionRepository';
import { Transaction } from '../../src/Transaction';
import { Clock } from '../../src/Clock';
import { Console } from '../../src/Console';

describe('The Account', () => {
  const repository = new TransactionRepository(new Clock());
  const statementPrinter = new StatementPrinter(new Console());
  const account = new Account(repository, statementPrinter);
  let addDepositSpy = jest.spyOn(repository, 'addDeposit');
  let addWithdrawSpy = jest.spyOn(repository, 'addWithdrawal');
  let printerSpy = jest.spyOn(statementPrinter, 'print');

  it('stores a deposit transaction throught the repositorio', () => {
    account.deposit(100);

    expect(addDepositSpy).toHaveBeenCalledWith(100);
  });

  it('stores a withdraw transaction throught the repositorio', () => {
    account.withdraw(100);

    expect(addWithdrawSpy).toHaveBeenCalledWith(100);
  });

  it('prints the transactions throught the repositorio', () => {
    const transactions = [new Transaction('22/03/2022', 0), new Transaction('23/03/2022', 0)];
    repository.allTransactions = () => transactions;

    account.printStatement();

    expect(printerSpy).toHaveBeenCalledWith(transactions);
  });
});
