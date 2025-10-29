import { Console } from './Console';
import { Transaction } from './Transaction';

export class StatementPrinter {
  constructor(private console: Console) {}

  private readonly header = 'Date | Amount | Balance';

  print(transactions: Transaction[]) {
    this.console.log(this.header);
    this.printStatements(transactions);
  }

  private printStatements(transactions: Transaction[]) {
    this.generateStatementLines(transactions)
      .reverse()
      .forEach((line) => this.console.log(line));
  }

  private generateStatementLines(transactions) {
    let runningBalance = 0;

    return transactions.map((transaction) => {
      runningBalance += transaction.amount;
      return this.formatStatementLine(transaction, runningBalance);
    });
  }

  private formatStatementLine(transaction: Transaction, runningBalance: number) {
    const formattedAmount = transaction.amount.toFixed(2);
    const formattedBalance = runningBalance.toFixed(2);
    return `${transaction.date} | ${formattedAmount} | ${formattedBalance}`;
  }
}
