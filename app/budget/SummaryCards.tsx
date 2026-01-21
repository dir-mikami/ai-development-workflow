import { formatAmount } from './utils';

interface SummaryCardsProps {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
}

export default function SummaryCards({
  totalBalance,
  totalIncome,
  totalExpense,
}: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          資産残高
        </div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          ¥{formatAmount(totalBalance)}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          今月の収入
        </div>
        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
          ¥{formatAmount(totalIncome)}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          今月の支出
        </div>
        <div className="text-2xl font-bold text-red-600 dark:text-red-400">
          ¥{formatAmount(totalExpense)}
        </div>
      </div>
    </div>
  );
}
