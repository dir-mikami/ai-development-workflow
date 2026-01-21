import { IncomeCategory, ExpenseCategory } from './types';

// 収入カテゴリの定義
export const INCOME_CATEGORIES: IncomeCategory[] = [
  '給与',
  '副業',
  'ボーナス',
  'その他収入',
];

// 支出カテゴリの定義
export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  '食費',
  '交通費',
  '日用品',
  '娯楽',
  '医療費',
  '教育費',
  '通信費',
  '光熱費',
  '住居費',
  'その他支出',
];

// 円グラフの色設定
export const CHART_COLORS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // green
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#84cc16', // lime
  '#f97316', // orange
  '#6366f1', // indigo
];

// localStorageのキー
export const STORAGE_KEY = 'budget_app_transactions';
