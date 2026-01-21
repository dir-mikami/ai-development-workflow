import {
  Transaction,
  MonthlySummary,
  CategorySummary,
  TransactionType,
} from './types';

// 日付をYYYY-MM形式に変換
export function formatMonthKey(date: string): string {
  return date.substring(0, 7); // YYYY-MM-DD → YYYY-MM
}

// YYYY-MM形式を表示用に変換
export function formatMonthDisplay(monthKey: string): string {
  const [year, month] = monthKey.split('-');
  return `${year}年${parseInt(month)}月`;
}

// 金額をカンマ区切りでフォーマット
export function formatAmount(amount: number): string {
  return amount.toLocaleString('ja-JP');
}

// 月次集計を計算
export function calculateMonthlySummary(
  transactions: Transaction[],
  monthKey: string
): MonthlySummary {
  const monthTransactions = transactions.filter(
    (t) => formatMonthKey(t.date) === monthKey
  );

  const totalIncome = monthTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = monthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    month: monthKey,
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
  };
}

// 総資産を計算
export function calculateTotalBalance(transactions: Transaction[]): number {
  return transactions.reduce((sum, t) => {
    return t.type === 'income' ? sum + t.amount : sum - t.amount;
  }, 0);
}

// カテゴリ別集計を計算
export function calculateCategorySummary(
  transactions: Transaction[],
  monthKey: string,
  type: TransactionType
): CategorySummary[] {
  const monthTransactions = transactions.filter(
    (t) => formatMonthKey(t.date) === monthKey && t.type === type
  );

  const categoryMap = new Map<string, number>();
  monthTransactions.forEach((t) => {
    const current = categoryMap.get(t.category) || 0;
    categoryMap.set(t.category, current + t.amount);
  });

  const total = Array.from(categoryMap.values()).reduce(
    (sum, amount) => sum + amount,
    0
  );

  return Array.from(categoryMap.entries())
    .map(([category, amount]) => ({
      category: category as any,
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
}

// 取引をソート（新しい順）
export function sortTransactions(transactions: Transaction[]): Transaction[] {
  return [...transactions].sort((a, b) => {
    const dateCompare = b.date.localeCompare(a.date);
    if (dateCompare !== 0) return dateCompare;
    return b.id.localeCompare(a.id);
  });
}

// 利用可能な月のリストを取得
export function getAvailableMonths(transactions: Transaction[]): string[] {
  const months = new Set(transactions.map((t) => formatMonthKey(t.date)));
  return Array.from(months).sort().reverse();
}

// 現在の月を取得
export function getCurrentMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}
