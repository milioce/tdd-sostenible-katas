import { StatementPrinter } from './StatementPrinter';
import { TransactionRepository } from './TransactionRepository';

export class Account {
  constructor(
    private repository: TransactionRepository,
    private statementPrinter: StatementPrinter
  ) {}

  deposit(amount: number) {
    this.repository.addDeposit(amount);
  }

  withdraw(amount: number) {
    this.repository.addWithdrawal(amount);
  }

  printStatement() {
    this.statementPrinter.print(this.repository.allTransactions());
  }
}
