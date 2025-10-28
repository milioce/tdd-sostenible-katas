import { Clock } from './Clock';
import { Transaction } from './Transaction';

export class TransactionRepository {
  transactions: Transaction[] = [];

  constructor(private clock: Clock) {}

  addDeposit(amount: number) {
    const transaction = new Transaction(this.clock.todayAsString(), amount);
    this.transactions.push(transaction);
  }

  addWithdrawal(amount: number) {}

  allTransactions() {
    return this.transactions;
  }
}
