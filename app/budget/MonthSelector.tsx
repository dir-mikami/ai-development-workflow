import { formatMonthDisplay } from './utils';

interface MonthSelectorProps {
  availableMonths: string[];
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

export default function MonthSelector({
  availableMonths,
  selectedMonth,
  onMonthChange,
}: MonthSelectorProps) {
  return (
    <div className="mb-6">
      <select
        value={selectedMonth}
        onChange={(e) => onMonthChange(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
      >
        {availableMonths.map((month) => (
          <option key={month} value={month}>
            {formatMonthDisplay(month)}
          </option>
        ))}
      </select>
    </div>
  );
}
