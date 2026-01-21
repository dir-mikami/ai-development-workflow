import { CategorySummary } from './types';
import { formatAmount } from './utils';

interface CategoryTableProps {
  data: CategorySummary[];
  title: string;
}

export default function CategoryTable({ data, title }: CategoryTableProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {title}
        </h3>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          データがありません
        </div>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="p-6 pb-0">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {title}
        </h3>
      </div>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              カテゴリ
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              金額
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              割合
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((item, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {item.category}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                ¥{formatAmount(item.amount)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 dark:text-gray-400">
                {item.percentage.toFixed(1)}%
              </td>
            </tr>
          ))}
          <tr className="bg-gray-50 dark:bg-gray-900">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
              合計
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900 dark:text-white">
              ¥{formatAmount(total)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900 dark:text-white">
              100.0%
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
