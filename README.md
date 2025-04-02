# 会議予約システム

Vue.js 3 + AWS (API Gateway, Lambda, DynamoDB)を使用した会議予約システムです。

## 機能

- 会議予約の一覧表示
- 新規予約の登録
- 予約の詳細表示
- 予約の編集
- 予約のキャンセル

## 技術スタック

### フロントエンド
- Vue.js 3 (JSX記法)
- Vue Router
- Axios
- date-fns

### バックエンド
- Node.js
- AWS Lambda
- Amazon DynamoDB
- Amazon API Gateway

## 開発環境のセットアップ

### 前提条件
- Docker
- Docker Compose
- Node.js (v16以上)

### 開発環境の起動

```bash
# リポジトリのクローン
git clone <repository-url>
cd yoyaku-calendar

# Docker Composeで環境を起動
docker-compose up
```

ブラウザで http://localhost:8080 にアクセスするとアプリケーションが表示されます。

### 個別の開発

フロントエンドとバックエンドを個別に開発する場合：

```bash
# フロントエンド開発サーバーの起動
npm run dev:frontend

# バックエンド開発サーバーの起動
npm run dev:backend
```

## プロジェクト構造

```
yoyaku-calendar/
├── frontend/              # フロントエンドコード
│   ├── src/
│   │   ├── api/           # APIクライアント
│   │   ├── assets/        # スタイルとアセット
│   │   ├── components/    # 再利用可能なコンポーネント
│   │   ├── router/        # ルーティング設定
│   │   ├── views/         # ページコンポーネント
│   │   ├── App.jsx        # ルートコンポーネント
│   │   └── main.js        # エントリーポイント
│   ├── Dockerfile         # フロントエンドのDocker設定
│   └── package.json       # フロントエンドの依存関係
│
├── backend/               # バックエンドコード
│   ├── lambda/            # Lambda関数ハンドラー
│   ├── services/          # ビジネスロジック
│   ├── setup-dynamodb.js  # DynamoDBセットアップスクリプト
│   ├── local-server.js    # ローカル開発サーバー
│   ├── Dockerfile         # バックエンドのDocker設定
│   └── package.json       # バックエンドの依存関係
│
├── infrastructure/        # インフラ関連コード
│   └── template.yaml      # AWS SAMテンプレート
│
├── docker-compose.yml     # Docker Compose設定
└── package.json           # ルートの依存関係と実行スクリプト
```

## AWS環境へのデプロイ

AWS SAM CLIを使用してデプロイする場合：

```bash
cd infrastructure
sam build
sam deploy --guided
```

## API仕様

| エンドポイント | メソッド | 説明 |
|--------------|---------|------|
| /reservations | GET | 予約一覧を取得 |
| /reservations/{id} | GET | 特定の予約を取得 |
| /reservations | POST | 新規予約を作成 |
| /reservations/{id} | PUT | 予約を更新 |
| /reservations/{id} | DELETE | 予約を削除 | 