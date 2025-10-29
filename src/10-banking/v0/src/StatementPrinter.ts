import { Console } from './Console';
import { Transaction } from './Transaction';

export class StatementPrinter {
  constructor(private console: Console) {}

  private readonly header = 'Date | Amount | Balance';

  print(transactions: Transaction[]) {
    this.console.log(this.header);
  }
}
