# 家計簿アプリ REST API セットアップガイド

このガイドでは、家計簿アプリのREST APIをローカル環境でセットアップして実行する手順を説明します。

## 前提条件

以下のソフトウェアがインストールされている必要があります：

- Node.js 20.x以上
- PostgreSQL 14.x以上
- npm または yarn

## セットアップ手順

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd ai-development-workflow
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. PostgreSQLデータベースの準備

PostgreSQLサーバーを起動し、新しいデータベースを作成します：

```sql
CREATE DATABASE kakeibo_db;
CREATE USER kakeibo_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE kakeibo_db TO kakeibo_user;
```

### 4. 環境変数の設定

プロジェクトルートに `.env` ファイルを作成し、以下の内容を記述します：

```bash
# データベース接続URL
DATABASE_URL="postgresql://kakeibo_user:your_password@localhost:5432/kakeibo_db?schema=public"
```

**注意**: `your_password` の部分は実際のパスワードに置き換えてください。

### 5. Prismaクライアントの生成

```bash
npm run prisma:generate
```

このコマンドは、Prismaスキーマからタイプセーフなクライアントを生成します。

### 6. データベースマイグレーション

```bash
npm run prisma:migrate
```

マイグレーション名を入力するよう求められたら、`init` と入力してください。

このコマンドは以下を実行します：
- Prismaスキーマに基づいてデータベーステーブルを作成
- マイグレーション履歴を記録

### 7. 初期データの投入（オプション）

サンプルデータをデータベースに投入する場合：

```bash
# まずtsxをインストール
npm install -D tsx

# シードスクリプトを実行
npm run prisma:seed
```

このコマンドは以下のデータを作成します：
- 収入カテゴリ: 給与、副業、ボーナス、その他収入
- 支出カテゴリ: 食費、交通費、日用品、娯楽、医療費、教育費、通信費、光熱費、住居費、その他支出
- サンプル取引データ

### 8. 開発サーバーの起動

```bash
npm run dev
```

サーバーが起動したら、以下のURLでアクセスできます：

- フロントエンド: http://localhost:3000
- API: http://localhost:3000/api
- ヘルスチェック: http://localhost:3000/api/health

## データベース管理

### Prisma Studioの起動

Prisma Studioは、データベースの内容をGUIで確認・編集できるツールです：

```bash
npm run prisma:studio
```

ブラウザで http://localhost:5555 が開きます。

### マイグレーション関連のコマンド

```bash
# 新しいマイグレーションを作成
npm run prisma:migrate

# マイグレーション履歴を確認
npx prisma migrate status

# マイグレーションをリセット（警告: すべてのデータが削除されます）
npx prisma migrate reset
```

## APIの動作確認

### curlでの確認

#### ヘルスチェック

```bash
curl http://localhost:3000/api/health
```

#### カテゴリ一覧の取得

```bash
curl http://localhost:3000/api/categories
```

#### 取引一覧の取得

```bash
curl http://localhost:3000/api/transactions
```

### ブラウザでの確認

ブラウザで以下のURLにアクセス：

- http://localhost:3000/api/health
- http://localhost:3000/api/categories
- http://localhost:3000/api/transactions

## トラブルシューティング

### データベース接続エラー

**エラー**: `Can't reach database server`

**解決方法**:
1. PostgreSQLサーバーが起動しているか確認
2. `.env` ファイルの `DATABASE_URL` が正しいか確認
3. データベースユーザーの権限を確認

```bash
# PostgreSQLの起動確認（macOS）
brew services list | grep postgresql

# PostgreSQLの起動（macOS）
brew services start postgresql

# PostgreSQLの起動確認（Linux）
sudo systemctl status postgresql

# PostgreSQLの起動（Linux）
sudo systemctl start postgresql
```

### マイグレーションエラー

**エラー**: `P3009: migrate found failed migration`

**解決方法**:

```bash
# 失敗したマイグレーションを削除
npx prisma migrate resolve --rolled-back <migration-name>

# または、データベースをリセット（データが削除されます）
npx prisma migrate reset
```

### Prismaクライアントエラー

**エラー**: `PrismaClient is unable to run in the browser`

**解決方法**:
これはPrismaクライアントをクライアントサイドで使用しようとしている場合に発生します。
Prismaクライアントは必ずサーバーサイド（API routesなど）でのみ使用してください。

### ポート競合エラー

**エラー**: `Port 3000 is already in use`

**解決方法**:

```bash
# 使用中のポートを確認
lsof -i :3000

# プロセスを終了
kill -9 <PID>

# または、別のポートで起動
PORT=3001 npm run dev
```

## 本番環境へのデプロイ

### 環境変数の設定

本番環境では以下の環境変数を設定してください：

```bash
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
NODE_ENV="production"
```

### ビルドとデプロイ

```bash
# 本番用ビルド
npm run build

# 本番サーバーの起動
npm run start
```

### マイグレーション

本番環境では `migrate dev` の代わりに `migrate deploy` を使用します：

```bash
npx prisma migrate deploy
```

## セキュリティに関する注意事項

1. **環境変数の管理**: `.env` ファイルは絶対にGitにコミットしないでください
2. **データベース認証情報**: 強力なパスワードを使用してください
3. **API認証**: 本番環境ではAPI認証の実装を検討してください
4. **CORS設定**: 必要に応じてCORS設定を行ってください

## その他のリソース

- [Prisma ドキュメント](https://www.prisma.io/docs)
- [Next.js ドキュメント](https://nextjs.org/docs)
- [PostgreSQL ドキュメント](https://www.postgresql.org/docs/)
- [API ドキュメント](./API.md)

## サポート

問題が発生した場合は、以下を確認してください：

1. Node.jsとPostgreSQLのバージョン
2. `.env` ファイルの設定
3. データベースの接続状況
4. コンソールのエラーメッセージ

それでも解決しない場合は、Issueを作成してください。
