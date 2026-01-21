import { Transaction } from './types';
import PieChart from './PieChart';
import CategoryTable from './CategoryTable';
import { calculateCategorySummary } from './utils';

interface BreakdownTabProps {
  transactions: Transaction[];
  selectedMonth: string;
}

export default function BreakdownTab({
  transactions,
  selectedMonth,
}: BreakdownTabProps) {
  const incomeSummary = calculateCategorySummary(
    transactions,
    selectedMonth,
    'income'
  );
  const expenseSummary = calculateCategorySummary(
    transactions,
    selectedMonth,
    'expense'
  );

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        カテゴリ別内訳
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <PieChart data={incomeSummary} title="収入の内訳" />
        <PieChart data={expenseSummary} title="支出の内訳" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CategoryTable data={incomeSummary} title="収入の詳細" />
        <CategoryTable data={expenseSummary} title="支出の詳細" />
      </div>
    </div>
  );
}
