import { Console } from './Console';
import { Transaction } from './Transaction';

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
