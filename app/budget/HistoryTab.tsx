import { Transaction } from './types';
import TransactionList from './TransactionList';
import { formatMonthKey, sortTransactions } from './utils';

interface HistoryTabProps {
  transactions: Transaction[];
  selectedMonth: string;
  onUpdateTransaction: (id: string, updates: Partial<Transaction>) => void;
  onDeleteTransaction: (id: string) => void;
}

export default function HistoryTab({
  transactions,
  selectedMonth,
  onUpdateTransaction,
  onDeleteTransaction,
}: HistoryTabProps) {
  const monthTransactions = sortTransactions(
    transactions.filter((t) => formatMonthKey(t.date) === selectedMonth)
  );

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        取引履歴
      </h2>
      <TransactionList
        transactions={monthTransactions}
        onUpdateTransaction={onUpdateTransaction}
        onDeleteTransaction={onDeleteTransaction}
      />
    </div>
  );
}
