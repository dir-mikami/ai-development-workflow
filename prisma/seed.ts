import { PrismaClient, TransactionType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('データベースのシード処理を開始します...');

  // 既存のデータを削除
  await prisma.transaction.deleteMany();
  await prisma.category.deleteMany();

  // 収入カテゴリの作成
  const incomeCategories = await Promise.all([
    prisma.category.create({
      data: { name: '給与', type: TransactionType.INCOME },
    }),
    prisma.category.create({
      data: { name: '副業', type: TransactionType.INCOME },
    }),
    prisma.category.create({
      data: { name: 'ボーナス', type: TransactionType.INCOME },
    }),
    prisma.category.create({
      data: { name: 'その他収入', type: TransactionType.INCOME },
    }),
  ]);

  console.log(`✓ ${incomeCategories.length}件の収入カテゴリを作成しました`);

  // 支出カテゴリの作成
  const expenseCategories = await Promise.all([
    prisma.category.create({
      data: { name: '食費', type: TransactionType.EXPENSE },
    }),
    prisma.category.create({
      data: { name: '交通費', type: TransactionType.EXPENSE },
    }),
    prisma.category.create({
      data: { name: '日用品', type: TransactionType.EXPENSE },
    }),
    prisma.category.create({
      data: { name: '娯楽', type: TransactionType.EXPENSE },
    }),
    prisma.category.create({
      data: { name: '医療費', type: TransactionType.EXPENSE },
    }),
    prisma.category.create({
      data: { name: '教育費', type: TransactionType.EXPENSE },
    }),
    prisma.category.create({
      data: { name: '通信費', type: TransactionType.EXPENSE },
    }),
    prisma.category.create({
      data: { name: '光熱費', type: TransactionType.EXPENSE },
    }),
    prisma.category.create({
      data: { name: '住居費', type: TransactionType.EXPENSE },
    }),
    prisma.category.create({
      data: { name: 'その他支出', type: TransactionType.EXPENSE },
    }),
  ]);

  console.log(`✓ ${expenseCategories.length}件の支出カテゴリを作成しました`);

  // サンプル取引データの作成
  const now = new Date();
  const transactions = [];

  // 今月の収入
  transactions.push(
    prisma.transaction.create({
      data: {
        type: TransactionType.INCOME,
        amount: 300000,
        date: new Date(now.getFullYear(), now.getMonth(), 25),
        description: '給与',
        categoryId: incomeCategories[0].id,
      },
    })
  );

  // 今月の支出
  transactions.push(
    prisma.transaction.create({
      data: {
        type: TransactionType.EXPENSE,
        amount: 50000,
        date: new Date(now.getFullYear(), now.getMonth(), 5),
        description: 'スーパーでの買い物',
        categoryId: expenseCategories[0].id, // 食費
      },
    }),
    prisma.transaction.create({
      data: {
        type: TransactionType.EXPENSE,
        amount: 10000,
        date: new Date(now.getFullYear(), now.getMonth(), 10),
        description: '通勤定期券',
        categoryId: expenseCategories[1].id, // 交通費
      },
    }),
    prisma.transaction.create({
      data: {
        type: TransactionType.EXPENSE,
        amount: 80000,
        date: new Date(now.getFullYear(), now.getMonth(), 1),
        description: '家賃',
        categoryId: expenseCategories[8].id, // 住居費
      },
    }),
    prisma.transaction.create({
      data: {
        type: TransactionType.EXPENSE,
        amount: 15000,
        date: new Date(now.getFullYear(), now.getMonth(), 15),
        description: '電気・ガス・水道',
        categoryId: expenseCategories[7].id, // 光熱費
      },
    })
  );

  await Promise.all(transactions);
  console.log(`✓ ${transactions.length}件のサンプル取引を作成しました`);

  console.log('\nシード処理が完了しました！');
}

main()
  .catch((e) => {
    console.error('エラーが発生しました:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
