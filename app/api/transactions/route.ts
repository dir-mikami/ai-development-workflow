import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TransactionType } from '@prisma/client';

// GET /api/transactions - 取引一覧取得
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // クエリパラメータ
    const type = searchParams.get('type') as TransactionType | null;
    const categoryId = searchParams.get('categoryId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    // フィルター条件を構築
    const where: any = {};

    if (type) {
      where.type = type;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate);
      }
      if (endDate) {
        where.date.lte = new Date(endDate);
      }
    }

    // ページネーション
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          category: true,
        },
        orderBy: {
          date: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.transaction.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      {
        success: false,
        error: '取引の取得に失敗しました',
      },
      { status: 500 }
    );
  }
}

// POST /api/transactions - 取引新規作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, amount, date, categoryId, description } = body;

    // バリデーション
    if (!type || !['INCOME', 'EXPENSE'].includes(type)) {
      return NextResponse.json(
        {
          success: false,
          error: '取引種別は INCOME または EXPENSE である必要があります',
        },
        { status: 400 }
      );
    }

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: '金額は正の数値である必要があります',
        },
        { status: 400 }
      );
    }

    if (!date) {
      return NextResponse.json(
        {
          success: false,
          error: '日付は必須です',
        },
        { status: 400 }
      );
    }

    if (!categoryId) {
      return NextResponse.json(
        {
          success: false,
          error: 'カテゴリIDは必須です',
        },
        { status: 400 }
      );
    }

    // カテゴリの存在確認と種別の一致確認
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: '指定されたカテゴリが見つかりません',
        },
        { status: 404 }
      );
    }

    if (category.type !== type) {
      return NextResponse.json(
        {
          success: false,
          error: 'カテゴリの種別と取引種別が一致しません',
        },
        { status: 400 }
      );
    }

    // 取引作成
    const transaction = await prisma.transaction.create({
      data: {
        type,
        amount: Math.floor(amount), // 整数に丸める
        date: new Date(date),
        categoryId,
        description: description?.trim() || null,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: transaction,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating transaction:', error);

    if (error.code === 'P2003') {
      return NextResponse.json(
        {
          success: false,
          error: '指定されたカテゴリが見つかりません',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: '取引の作成に失敗しました',
      },
      { status: 500 }
    );
  }
}
