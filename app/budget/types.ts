// 取引の種類
export type TransactionType = 'income' | 'expense';

// 取引のカテゴリ
export type IncomeCategory = '給与' | '副業' | 'ボーナス' | 'その他収入';
export type ExpenseCategory =
  | '食費'
  | '交通費'
  | '日用品'
  | '娯楽'
  | '医療費'
  | '教育費'
  | '通信費'
  | '光熱費'
  | '住居費'
  | 'その他支出';

export type Category = IncomeCategory | ExpenseCategory;

// 取引データの型
export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD形式
  type: TransactionType;
  category: Category;
  amount: number;
  memo?: string;
}

// 月次集計データの型
export interface MonthlySummary {
  month: string; // YYYY-MM形式
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

// カテゴリ別集計データの型
export interface CategorySummary {
  category: Category;
  amount: number;
  percentage: number;
}

// タブの種類
export type TabType = 'overview' | 'history' | 'breakdown';
