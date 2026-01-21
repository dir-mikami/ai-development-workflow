import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TransactionType } from '@prisma/client';

// GET /api/categories - カテゴリ一覧取得
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') as TransactionType | null;

    const where = type ? { type } : {};

    const categories = await prisma.category.findMany({
      where,
      orderBy: [{ type: 'asc' }, { name: 'asc' }],
      include: {
        _count: {
          select: { transactions: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'カテゴリの取得に失敗しました',
      },
      { status: 500 }
    );
  }
}

// POST /api/categories - カテゴリ新規作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type } = body;

    // バリデーション
    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'カテゴリ名は必須です',
        },
        { status: 400 }
      );
    }

    if (!type || !['INCOME', 'EXPENSE'].includes(type)) {
      return NextResponse.json(
        {
          success: false,
          error: '取引種別は INCOME または EXPENSE である必要があります',
        },
        { status: 400 }
      );
    }

    // カテゴリ作成
    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        type,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: category,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating category:', error);

    // ユニーク制約違反の場合
    if (error.code === 'P2002') {
      return NextResponse.json(
        {
          success: false,
          error: 'このカテゴリ名は既に存在します',
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'カテゴリの作成に失敗しました',
      },
      { status: 500 }
    );
  }
}
