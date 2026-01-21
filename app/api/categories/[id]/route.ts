import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/categories/[id] - カテゴリ詳細取得
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { transactions: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: 'カテゴリが見つかりません',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'カテゴリの取得に失敗しました',
      },
      { status: 500 }
    );
  }
}

// PUT /api/categories/[id] - カテゴリ更新
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, type } = body;

    // バリデーション
    if (name !== undefined && (typeof name !== 'string' || !name.trim())) {
      return NextResponse.json(
        {
          success: false,
          error: 'カテゴリ名は空にできません',
        },
        { status: 400 }
      );
    }

    if (type !== undefined && !['INCOME', 'EXPENSE'].includes(type)) {
      return NextResponse.json(
        {
          success: false,
          error: '取引種別は INCOME または EXPENSE である必要があります',
        },
        { status: 400 }
      );
    }

    // 更新データを準備
    const updateData: any = {};
    if (name !== undefined) updateData.name = name.trim();
    if (type !== undefined) updateData.type = type;

    const category = await prisma.category.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error: any) {
    console.error('Error updating category:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        {
          success: false,
          error: 'カテゴリが見つかりません',
        },
        { status: 404 }
      );
    }

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
        error: 'カテゴリの更新に失敗しました',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id] - カテゴリ削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'カテゴリを削除しました',
    });
  } catch (error: any) {
    console.error('Error deleting category:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        {
          success: false,
          error: 'カテゴリが見つかりません',
        },
        { status: 404 }
      );
    }

    // 外部キー制約違反（トランザクションが存在する場合）
    if (error.code === 'P2003') {
      return NextResponse.json(
        {
          success: false,
          error: 'このカテゴリを使用している取引が存在するため削除できません',
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'カテゴリの削除に失敗しました',
      },
      { status: 500 }
    );
  }
}
