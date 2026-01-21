import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/transactions/[id] - 取引詳細取得
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!transaction) {
      return NextResponse.json(
        {
          success: false,
          error: '取引が見つかりません',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return NextResponse.json(
      {
        success: false,
        error: '取引の取得に失敗しました',
      },
      { status: 500 }
    );
  }
}

// PUT /api/transactions/[id] - 取引更新
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { type, amount, date, categoryId, description } = body;

    // 更新データを準備
    const updateData: any = {};

    if (type !== undefined) {
      if (!['INCOME', 'EXPENSE'].includes(type)) {
        return NextResponse.json(
          {
            success: false,
            error: '取引種別は INCOME または EXPENSE である必要があります',
          },
          { status: 400 }
        );
      }
      updateData.type = type;
    }

    if (amount !== undefined) {
      if (typeof amount !== 'number' || amount <= 0) {
        return NextResponse.json(
          {
            success: false,
            error: '金額は正の数値である必要があります',
          },
          { status: 400 }
        );
      }
      updateData.amount = Math.floor(amount);
    }

    if (date !== undefined) {
      updateData.date = new Date(date);
    }

    if (categoryId !== undefined) {
      // カテゴリの存在確認
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

      // 種別の一致確認（typeが更新される場合はそちらを使用）
      const targetType = type !== undefined ? type : (await prisma.transaction.findUnique({ where: { id } }))?.type;
      if (category.type !== targetType) {
        return NextResponse.json(
          {
            success: false,
            error: 'カテゴリの種別と取引種別が一致しません',
          },
          { status: 400 }
        );
      }

      updateData.categoryId = categoryId;
    }

    if (description !== undefined) {
      updateData.description = description?.trim() || null;
    }

    const transaction = await prisma.transaction.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: transaction,
    });
  } catch (error: any) {
    console.error('Error updating transaction:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        {
          success: false,
          error: '取引が見つかりません',
        },
        { status: 404 }
      );
    }

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
        error: '取引の更新に失敗しました',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/transactions/[id] - 取引削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.transaction.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: '取引を削除しました',
    });
  } catch (error: any) {
    console.error('Error deleting transaction:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        {
          success: false,
          error: '取引が見つかりません',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: '取引の削除に失敗しました',
      },
      { status: 500 }
    );
  }
}
