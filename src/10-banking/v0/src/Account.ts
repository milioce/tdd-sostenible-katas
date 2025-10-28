import { TransactionRepository } from './TransactionRepository';

export class Account {
  constructor(private repository: TransactionRepository) {}

  deposit(amount: number) {
    this.repository.addDeposit(amount);
  }

  withdraw(amount: number) {}

  printStatement() {}
}
