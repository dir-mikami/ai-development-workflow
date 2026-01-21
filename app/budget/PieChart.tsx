import { CategorySummary } from './types';
import { CHART_COLORS } from './constants';
import { formatAmount } from './utils';

interface PieChartProps {
  data: CategorySummary[];
  title: string;
}

export default function PieChart({ data, title }: PieChartProps) {
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
  const size = 200;
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = 80;

  let currentAngle = -90; // Start from top

  const slices = data.map((item, index) => {
    const angle = (item.amount / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;

    // Convert to radians
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    // Calculate arc path
    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);

    const largeArcFlag = angle > 180 ? 1 : 0;

    const path = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z',
    ].join(' ');

    currentAngle = endAngle;

    return {
      path,
      color: CHART_COLORS[index % CHART_COLORS.length],
      category: item.category,
      amount: item.amount,
      percentage: item.percentage,
    };
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      <div className="flex flex-col items-center">
        <svg width={size} height={size} className="mb-4">
          {slices.map((slice, index) => (
            <g key={index}>
              <path d={slice.path} fill={slice.color} stroke="white" strokeWidth="2" />
            </g>
          ))}
        </svg>
        <div className="w-full space-y-2">
          {slices.map((slice, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: slice.color }}
                />
                <span className="text-gray-900 dark:text-white">
                  {slice.category}
                </span>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-900 dark:text-white">
                  ¥{formatAmount(slice.amount)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {slice.percentage.toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
