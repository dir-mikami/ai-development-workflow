# 家計簿アプリ REST API ドキュメント

このドキュメントでは、家計簿アプリのREST APIの使用方法を説明します。

## ベースURL

```
http://localhost:3000/api
```

## 認証

現在、このAPIは認証を必要としません。

## レスポンス形式

すべてのレスポンスは以下の形式のJSONを返します：

### 成功時

```json
{
  "success": true,
  "data": { ... }
}
```

### エラー時

```json
{
  "success": false,
  "error": "エラーメッセージ"
}
```

---

## エンドポイント一覧

### ヘルスチェック

#### GET /api/health

APIとデータベースの接続状態を確認します。

**レスポンス例**

```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-01-21T10:00:00.000Z",
  "database": "connected"
}
```

---

## カテゴリ API

### 1. カテゴリ一覧取得

#### GET /api/categories

すべてのカテゴリを取得します。

**クエリパラメータ**

| パラメータ | 型     | 必須 | 説明                                |
| ---------- | ------ | ---- | ----------------------------------- |
| type       | string | No   | フィルタ: `INCOME` または `EXPENSE` |

**レスポンス例**

```json
{
  "success": true,
  "data": [
    {
      "id": "clx1234567890",
      "name": "給与",
      "type": "INCOME",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "_count": {
        "transactions": 10
      }
    }
  ]
}
```

### 2. カテゴリ詳細取得

#### GET /api/categories/:id

指定したIDのカテゴリの詳細を取得します。

**パスパラメータ**

| パラメータ | 型     | 必須 | 説明          |
| ---------- | ------ | ---- | ------------- |
| id         | string | Yes  | カテゴリのID  |

**レスポンス例**

```json
{
  "success": true,
  "data": {
    "id": "clx1234567890",
    "name": "給与",
    "type": "INCOME",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "_count": {
      "transactions": 10
    }
  }
}
```

### 3. カテゴリ作成

#### POST /api/categories

新しいカテゴリを作成します。

**リクエストボディ**

```json
{
  "name": "給与",
  "type": "INCOME"
}
```

| フィールド | 型     | 必須 | 説明                                |
| ---------- | ------ | ---- | ----------------------------------- |
| name       | string | Yes  | カテゴリ名                          |
| type       | string | Yes  | `INCOME` または `EXPENSE`           |

**レスポンス例**

```json
{
  "success": true,
  "data": {
    "id": "clx1234567890",
    "name": "給与",
    "type": "INCOME",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. カテゴリ更新

#### PUT /api/categories/:id

既存のカテゴリを更新します。

**パスパラメータ**

| パラメータ | 型     | 必須 | 説明          |
| ---------- | ------ | ---- | ------------- |
| id         | string | Yes  | カテゴリのID  |

**リクエストボディ**

```json
{
  "name": "基本給",
  "type": "INCOME"
}
```

すべてのフィールドは任意です。指定されたフィールドのみが更新されます。

### 5. カテゴリ削除

#### DELETE /api/categories/:id

カテゴリを削除します。

**パスパラメータ**

| パラメータ | 型     | 必須 | 説明          |
| ---------- | ------ | ---- | ------------- |
| id         | string | Yes  | カテゴリのID  |

**注意**: このカテゴリを使用している取引が存在する場合、削除は失敗します（409エラー）。

**レスポンス例**

```json
{
  "success": true,
  "message": "カテゴリを削除しました"
}
```

---

## 取引 API

### 1. 取引一覧取得

#### GET /api/transactions

取引の一覧を取得します。ページネーションとフィルタリングをサポートしています。

**クエリパラメータ**

| パラメータ | 型     | 必須 | デフォルト | 説明                                          |
| ---------- | ------ | ---- | ---------- | --------------------------------------------- |
| type       | string | No   | -          | フィルタ: `INCOME` または `EXPENSE`           |
| categoryId | string | No   | -          | カテゴリIDでフィルタ                          |
| startDate  | string | No   | -          | 開始日（ISO 8601形式: `2024-01-01`）          |
| endDate    | string | No   | -          | 終了日（ISO 8601形式: `2024-12-31`）          |
| page       | number | No   | 1          | ページ番号                                    |
| limit      | number | No   | 50         | 1ページあたりの取引数                         |

**レスポンス例**

```json
{
  "success": true,
  "data": [
    {
      "id": "clx9876543210",
      "type": "INCOME",
      "amount": 300000,
      "date": "2024-01-25T00:00:00.000Z",
      "description": "1月分の給与",
      "categoryId": "clx1234567890",
      "category": {
        "id": "clx1234567890",
        "name": "給与",
        "type": "INCOME"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 150,
    "totalPages": 3
  }
}
```

### 2. 取引詳細取得

#### GET /api/transactions/:id

指定したIDの取引の詳細を取得します。

**パスパラメータ**

| パラメータ | 型     | 必須 | 説明      |
| ---------- | ------ | ---- | --------- |
| id         | string | Yes  | 取引のID  |

**レスポンス例**

```json
{
  "success": true,
  "data": {
    "id": "clx9876543210",
    "type": "INCOME",
    "amount": 300000,
    "date": "2024-01-25T00:00:00.000Z",
    "description": "1月分の給与",
    "categoryId": "clx1234567890",
    "category": {
      "id": "clx1234567890",
      "name": "給与",
      "type": "INCOME"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. 取引作成

#### POST /api/transactions

新しい取引を作成します。

**リクエストボディ**

```json
{
  "type": "EXPENSE",
  "amount": 5000,
  "date": "2024-01-20",
  "categoryId": "clx1234567890",
  "description": "ランチ代"
}
```

| フィールド  | 型     | 必須 | 説明                                          |
| ----------- | ------ | ---- | --------------------------------------------- |
| type        | string | Yes  | `INCOME` または `EXPENSE`                     |
| amount      | number | Yes  | 金額（正の整数）                              |
| date        | string | Yes  | 取引日（ISO 8601形式）                        |
| categoryId  | string | Yes  | カテゴリID                                    |
| description | string | No   | 説明・メモ                                    |

**注意**: カテゴリの種別（type）と取引の種別（type）は一致している必要があります。

**レスポンス例**

```json
{
  "success": true,
  "data": {
    "id": "clx9876543210",
    "type": "EXPENSE",
    "amount": 5000,
    "date": "2024-01-20T00:00:00.000Z",
    "description": "ランチ代",
    "categoryId": "clx1234567890",
    "category": {
      "id": "clx1234567890",
      "name": "食費",
      "type": "EXPENSE"
    },
    "createdAt": "2024-01-20T10:00:00.000Z",
    "updatedAt": "2024-01-20T10:00:00.000Z"
  }
}
```

### 4. 取引更新

#### PUT /api/transactions/:id

既存の取引を更新します。

**パスパラメータ**

| パラメータ | 型     | 必須 | 説明      |
| ---------- | ------ | ---- | --------- |
| id         | string | Yes  | 取引のID  |

**リクエストボディ**

```json
{
  "amount": 6000,
  "description": "ランチとディナー"
}
```

すべてのフィールドは任意です。指定されたフィールドのみが更新されます。

### 5. 取引削除

#### DELETE /api/transactions/:id

取引を削除します。

**パスパラメータ**

| パラメータ | 型     | 必須 | 説明      |
| ---------- | ------ | ---- | --------- |
| id         | string | Yes  | 取引のID  |

**レスポンス例**

```json
{
  "success": true,
  "message": "取引を削除しました"
}
```

### 6. 取引集計

#### GET /api/transactions/summary

取引の集計情報を取得します。

**クエリパラメータ**

| パラメータ | 型     | 必須 | デフォルト | 説明                                                  |
| ---------- | ------ | ---- | ---------- | ----------------------------------------------------- |
| startDate  | string | No   | -          | 開始日（ISO 8601形式）                                |
| endDate    | string | No   | -          | 終了日（ISO 8601形式）                                |
| groupBy    | string | No   | category   | グループ化方法: `category`, `type`, `month`           |

**レスポンス例（groupBy=category）**

```json
{
  "success": true,
  "data": {
    "summary": {
      "totalIncome": 500000,
      "totalExpense": 350000,
      "balance": 150000
    },
    "breakdown": [
      {
        "categoryId": "clx1234567890",
        "categoryName": "給与",
        "type": "INCOME",
        "amount": 500000,
        "percentage": 100.0
      },
      {
        "categoryId": "clx0987654321",
        "categoryName": "食費",
        "type": "EXPENSE",
        "amount": 80000,
        "percentage": 22.86
      }
    ]
  }
}
```

**レスポンス例（groupBy=month）**

```json
{
  "success": true,
  "data": {
    "summary": {
      "totalIncome": 500000,
      "totalExpense": 350000,
      "balance": 150000
    },
    "breakdown": [
      {
        "month": "2024-01",
        "income": 250000,
        "expense": 180000,
        "balance": 70000
      },
      {
        "month": "2024-02",
        "income": 250000,
        "expense": 170000,
        "balance": 80000
      }
    ]
  }
}
```

---

## エラーコード

| コード | 説明                                                    |
| ------ | ------------------------------------------------------- |
| 400    | バッドリクエスト（パラメータ不正など）                  |
| 404    | リソースが見つかりません                                |
| 409    | コンフリクト（ユニーク制約違反、参照整合性エラーなど）  |
| 500    | サーバーエラー                                          |
| 503    | サービス利用不可（データベース接続エラーなど）          |

---

## セットアップ手順

### 1. 環境変数の設定

`.env`ファイルを作成し、データベース接続URLを設定します：

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/kakeibo_db?schema=public"
```

### 2. データベースのマイグレーション

```bash
# Prismaクライアントの生成
npx prisma generate

# マイグレーションの実行
npx prisma migrate dev --name init

# （オプション）Prisma Studioでデータを確認
npx prisma studio
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

サーバーは `http://localhost:3000` で起動します。

---

## 使用例

### curlでの使用例

#### カテゴリの作成

```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "給与",
    "type": "INCOME"
  }'
```

#### 取引の作成

```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "type": "INCOME",
    "amount": 300000,
    "date": "2024-01-25",
    "categoryId": "clx1234567890",
    "description": "1月分の給与"
  }'
```

#### 取引一覧の取得

```bash
curl "http://localhost:3000/api/transactions?startDate=2024-01-01&endDate=2024-01-31&page=1&limit=10"
```

#### 集計情報の取得

```bash
curl "http://localhost:3000/api/transactions/summary?startDate=2024-01-01&endDate=2024-12-31&groupBy=category"
```

---

## データモデル

### Category

| フィールド    | 型              | 説明                          |
| ------------- | --------------- | ----------------------------- |
| id            | String          | 一意のID（CUID）              |
| name          | String          | カテゴリ名                    |
| type          | TransactionType | INCOME または EXPENSE         |
| createdAt     | DateTime        | 作成日時                      |
| updatedAt     | DateTime        | 更新日時                      |

### Transaction

| フィールド    | 型              | 説明                          |
| ------------- | --------------- | ----------------------------- |
| id            | String          | 一意のID（CUID）              |
| type          | TransactionType | INCOME または EXPENSE         |
| amount        | Int             | 金額（円）                    |
| date          | DateTime        | 取引日                        |
| description   | String?         | 説明（任意）                  |
| categoryId    | String          | カテゴリID（外部キー）        |
| createdAt     | DateTime        | 作成日時                      |
| updatedAt     | DateTime        | 更新日時                      |

---

## ライセンス

MIT
