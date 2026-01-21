import { useState } from 'react';
import { Transaction, TransactionType, Category } from './types';
import { formatAmount } from './utils';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from './constants';

interface TransactionListProps {
  transactions: Transaction[];
  onUpdateTransaction: (id: string, updates: Partial<Transaction>) => void;
  onDeleteTransaction: (id: string) => void;
}

export default function TransactionList({
  transactions,
  onUpdateTransaction,
  onDeleteTransaction,
}: TransactionListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Transaction>>({});

  const startEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEditForm({ ...transaction });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = () => {
    if (editingId && editForm.amount && editForm.amount > 0) {
      onUpdateTransaction(editingId, editForm);
      setEditingId(null);
      setEditForm({});
    }
  };

  const handleTypeChange = (newType: TransactionType) => {
    const categories =
      newType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    setEditForm({
      ...editForm,
      type: newType,
      category: categories[0],
    });
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        この月の取引はありません
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              日付
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              種類
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              カテゴリ
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              金額
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              メモ
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              操作
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              {editingId === transaction.id ? (
                <>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="date"
                      value={editForm.date || ''}
                      onChange={(e) =>
                        setEditForm({ ...editForm, date: e.target.value })
                      }
                      className="px-2 py-1 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={editForm.type || 'expense'}
                      onChange={(e) =>
                        handleTypeChange(e.target.value as TransactionType)
                      }
                      className="px-2 py-1 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                    >
                      <option value="expense">支出</option>
                      <option value="income">収入</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={editForm.category || ''}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          category: e.target.value as Category,
                        })
                      }
                      className="px-2 py-1 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                    >
                      {(editForm.type === 'income'
                        ? INCOME_CATEGORIES
                        : EXPENSE_CATEGORIES
                      ).map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <input
                      type="number"
                      value={editForm.amount || ''}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          amount: parseFloat(e.target.value),
                        })
                      }
                      className="w-32 px-2 py-1 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm text-right"
                      min="0"
                      step="1"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      value={editForm.memo || ''}
                      onChange={(e) =>
                        setEditForm({ ...editForm, memo: e.target.value })
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={saveEdit}
                      className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-3"
                    >
                      保存
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                      キャンセル
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {transaction.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.type === 'income'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      }`}
                    >
                      {transaction.type === 'income' ? '収入' : '支出'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {transaction.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900 dark:text-white">
                    ¥{formatAmount(transaction.amount)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {transaction.memo || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => startEdit(transaction)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => onDeleteTransaction(transaction.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      削除
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
