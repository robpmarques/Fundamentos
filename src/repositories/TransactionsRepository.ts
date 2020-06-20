/* eslint-disable no-param-reassign */
import { uuid } from 'uuidv4';
import Transaction from '../models/Transaction';

export interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface TransactionRepositoryDTO {
  title: string;

  value: number;

  type: 'income' | 'outcome';
}

interface TransactionRepositoryAll {
  transactions: Transaction[];
  balance: Balance;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): TransactionRepositoryAll {
    const response: TransactionRepositoryAll = {
      transactions: this.transactions,
      balance: this.getBalance(),
    };

    return response;
  }

  public getBalance(): Balance {
    const initialValue: Balance = {
      income: 0,
      outcome: 0,
      total: 0,
    };

    const totalNumber = this.transactions.reduce<Balance>(
      (total, currentValue) => {
        if (currentValue.type === 'outcome') {
          total.outcome += currentValue.value;
          total.total -= currentValue.value;
          return total;
        }

        total.income += currentValue.value;
        total.total += currentValue.value;

        return total;
      },
      initialValue,
    );

    return totalNumber;
  }

  public create({ value, type, title }: TransactionRepositoryDTO): Transaction {
    const transaction = new Transaction({
      title,
      type,
      value,
    });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
