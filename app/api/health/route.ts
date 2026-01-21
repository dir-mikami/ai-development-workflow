import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/health - ヘルスチェック
export async function GET() {
  try {
    // データベース接続確認
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      {
        success: false,
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: 'データベース接続エラー',
      },
      { status: 503 }
    );
  }
}
