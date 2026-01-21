'use client';

import { useState, useEffect } from 'react';
import { Transaction, TabType, TransactionType, Category } from './types';
import { STORAGE_KEY } from './constants';
import { getAvailableMonths, getCurrentMonth } from './utils';
import TabNavigation from './TabNavigation';
import MonthSelector from './MonthSelector';
import OverviewTab from './OverviewTab';
import HistoryTab from './HistoryTab';
import BreakdownTab from './BreakdownTab';

export default function BudgetApp() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [isLoaded, setIsLoaded] = useState(false);

  // localStorageからデータを読み込み
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setTransactions(parsed);
      } catch (e) {
        console.error('Failed to parse stored transactions:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // localStorageにデータを保存
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    }
  }, [transactions, isLoaded]);

  const availableMonths =
    getAvailableMonths(transactions).length > 0
      ? getAvailableMonths(transactions)
      : [getCurrentMonth()];

  // 選択された月が利用可能な月のリストにない場合は最新の月を選択
  useEffect(() => {
    if (!availableMonths.includes(selectedMonth)) {
      setSelectedMonth(availableMonths[0]);
    }
  }, [availableMonths, selectedMonth]);

  const addTransaction = (
    date: string,
    type: TransactionType,
    category: Category,
    amount: number,
    memo: string
  ) => {
    const newTransaction: Transaction = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      date,
      type,
      category,
      amount,
      memo: memo || undefined,
    };
    setTransactions([...transactions, newTransaction]);
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(
      transactions.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const deleteTransaction = (id: string) => {
    if (confirm('この取引を削除してもよろしいですか?')) {
      setTransactions(transactions.filter((t) => t.id !== id));
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          家計簿アプリ
        </h1>

        <MonthSelector
          availableMonths={availableMonths}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
        />

        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'overview' && (
          <OverviewTab
            transactions={transactions}
            selectedMonth={selectedMonth}
            onAddTransaction={addTransaction}
          />
        )}

        {activeTab === 'history' && (
          <HistoryTab
            transactions={transactions}
            selectedMonth={selectedMonth}
            onUpdateTransaction={updateTransaction}
            onDeleteTransaction={deleteTransaction}
          />
        )}

        {activeTab === 'breakdown' && (
          <BreakdownTab
            transactions={transactions}
            selectedMonth={selectedMonth}
          />
        )}
      </div>
    </div>
  );
}
