import { Transaction, TransactionType, Category } from './types';
import SummaryCards from './SummaryCards';
import TransactionForm from './TransactionForm';
import { calculateTotalBalance, calculateMonthlySummary } from './utils';

interface OverviewTabProps {
  transactions: Transaction[];
  selectedMonth: string;
  onAddTransaction: (
    date: string,
    type: TransactionType,
    category: Category,
    amount: number,
    memo: string
  ) => void;
}

export default function OverviewTab({
  transactions,
  selectedMonth,
  onAddTransaction,
}: OverviewTabProps) {
  const totalBalance = calculateTotalBalance(transactions);
  const monthlySummary = calculateMonthlySummary(transactions, selectedMonth);

  return (
    <div>
      <SummaryCards
        totalBalance={totalBalance}
        totalIncome={monthlySummary.totalIncome}
        totalExpense={monthlySummary.totalExpense}
      />
      <TransactionForm onAddTransaction={onAddTransaction} />
    </div>
  );
}
