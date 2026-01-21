import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TransactionType } from '@prisma/client';

// GET /api/transactions/summary - 取引集計情報取得
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const groupBy = searchParams.get('groupBy') || 'category'; // category, type, month

    // フィルター条件を構築
    const where: any = {};

    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate);
      }
      if (endDate) {
        where.date.lte = new Date(endDate);
      }
    }

    // 収入・支出の合計を取得
    const [incomeTotal, expenseTotal] = await Promise.all([
      prisma.transaction.aggregate({
        where: { ...where, type: TransactionType.INCOME },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { ...where, type: TransactionType.EXPENSE },
        _sum: { amount: true },
      }),
    ]);

    const totalIncome = incomeTotal._sum.amount || 0;
    const totalExpense = expenseTotal._sum.amount || 0;
    const balance = totalIncome - totalExpense;

    // グループ別の集計
    let breakdown: any[] = [];

    if (groupBy === 'category') {
      // カテゴリ別集計
      const transactions = await prisma.transaction.findMany({
        where,
        include: { category: true },
      });

      const categoryMap = new Map<string, { category: any; amount: number; type: TransactionType }>();

      transactions.forEach((tx) => {
        const key = tx.categoryId;
        if (!categoryMap.has(key)) {
          categoryMap.set(key, {
            category: tx.category,
            amount: 0,
            type: tx.type,
          });
        }
        const item = categoryMap.get(key)!;
        item.amount += tx.amount;
      });

      breakdown = Array.from(categoryMap.values()).map((item) => ({
        categoryId: item.category.id,
        categoryName: item.category.name,
        type: item.type,
        amount: item.amount,
        percentage:
          item.type === TransactionType.INCOME
            ? totalIncome > 0
              ? (item.amount / totalIncome) * 100
              : 0
            : totalExpense > 0
            ? (item.amount / totalExpense) * 100
            : 0,
      }));
    } else if (groupBy === 'type') {
      // 種別集計
      breakdown = [
        {
          type: TransactionType.INCOME,
          amount: totalIncome,
        },
        {
          type: TransactionType.EXPENSE,
          amount: totalExpense,
        },
      ];
    } else if (groupBy === 'month') {
      // 月別集計
      const transactions = await prisma.transaction.findMany({
        where,
        orderBy: { date: 'asc' },
      });

      const monthMap = new Map<string, { income: number; expense: number }>();

      transactions.forEach((tx) => {
        const month = tx.date.toISOString().substring(0, 7); // YYYY-MM
        if (!monthMap.has(month)) {
          monthMap.set(month, { income: 0, expense: 0 });
        }
        const item = monthMap.get(month)!;
        if (tx.type === TransactionType.INCOME) {
          item.income += tx.amount;
        } else {
          item.expense += tx.amount;
        }
      });

      breakdown = Array.from(monthMap.entries())
        .map(([month, data]) => ({
          month,
          income: data.income,
          expense: data.expense,
          balance: data.income - data.expense,
        }))
        .sort((a, b) => a.month.localeCompare(b.month));
    }

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalIncome,
          totalExpense,
          balance,
        },
        breakdown,
      },
    });
  } catch (error) {
    console.error('Error fetching transaction summary:', error);
    return NextResponse.json(
      {
        success: false,
        error: '集計情報の取得に失敗しました',
      },
      { status: 500 }
    );
  }
}
