import { Account } from '../../src/Account';
import { TransactionRepository } from '../../src/TransactionRepository';

describe('The Account', () => {
  let repository = new TransactionRepository();
  const account = new Account(repository);
  let addDepositSpy = jest.spyOn(repository, 'addDeposit');
  it('stores a deposit transaction throught the repositorio', () => {
    account.deposit(100);

    expect(addDepositSpy).toHaveBeenCalledWith(100);
  });
});
