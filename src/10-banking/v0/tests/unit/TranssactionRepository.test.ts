import { Clock } from '../../src/Clock';
import { Transaction } from '../../src/Transaction';
import { TransactionRepository } from '../../src/TransactionRepository';

describe('The Transaction Repository', () => {
  it('stores a deposit transaction for a given amount', () => {
    const today = '25/03/2022';
    const clock = new Clock();
    clock.todayAsString = () => today;
    const amount = 100;
    const repository = new TransactionRepository();
    const transactions = repository.allTransactions();

    repository.addDeposit(amount);

    expect(transactions[0]).toEqual(new Transaction(today, amount));
  });
});
