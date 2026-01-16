# ヘルシーくん ウェブサイト

nodemailerを使用したGmail SMTP経由でのお問い合わせフォーム機能を備えたヘルシーくんのウェブサイト。

## 機能

- 静的HTMLページ（ホーム、お問い合わせ、プライバシーポリシーなど）
- nodemailerを使用したメール送信機能
- Gmail SMTPでの確実なメール配信
- 返信先（replyTo）設定でお客様への直接返信が可能

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env`ファイルを編集して、以下の情報を設定してください：

```env
# Gmail SMTP設定
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password

# サーバー設定
PORT=3000
```

#### Gmailアプリパスワードの取得方法

1. Googleアカウントの「2段階認証」を有効にする
2. Googleアカウント設定 > セキュリティ > アプリパスワード に移動
3. 新しいアプリパスワードを生成
4. 生成されたパスワードを`GMAIL_APP_PASSWORD`に設定

### 3. サーバーの起動

```bash
# 開発環境
npm run dev

# 本番環境
npm start
```

サーバーは `http://localhost:3000` で起動します。

## メール送信の仕組み

1. お客様がお問い合わせフォームに入力
2. フォームデータがNode.jsサーバーの`/api/send-email`エンドポイントに送信
3. nodemailerがGmail SMTPでメールを送信
4. **送信先**: `healthy.contact.line@gmail.com`（固定）
5. **返信先（replyTo）**: お客様のメールアドレス
6. 返信時は直接お客様にメールが届く

## ファイル構成

```
.
├── server.js              # Node.jsサーバー（Express + nodemailer）
├── package.json           # 依存関係とスクリプト
├── .env                   # 環境変数（要設定）
├── .gitignore            # Git除外設定
├── index.html            # ホームページ
├── contact.html          # お問い合わせページ
├── privacy.html          # プライバシーポリシー
├── terms.html            # 利用規約
├── tokushoho.html        # 特定商取引法表記
└── README.md             # このファイル
```

## 本番環境デプロイ時の注意

1. **環境変数の設定**: 本番環境でも`.env`ファイルまたは環境変数で設定が必要
2. **ポート番号**: 本番環境のポート番号に合わせて`PORT`を調整
3. **HTTPS**: 本番環境ではHTTPSでの運用を推奨
4. **セキュリティ**: `.env`ファイルは絶対にコミットしない（`.gitignore`で除外済み）

## トラブルシューティング

### メール送信ができない場合

1. **環境変数の確認**: `.env`ファイルの設定を確認
2. **Gmailアプリパスワード**: 正しく生成・設定されているか確認
3. **2段階認証**: Googleアカウントで有効になっているか確認
4. **ログ確認**: サーバーのコンソールログでエラー内容を確認

### サーバーが起動しない場合

1. **Node.jsのバージョン**: 16.0.0以上であることを確認
2. **依存関係**: `npm install`が正常に完了しているか確認
3. **ポート競合**: 指定したポートが他のプロセスで使用されていないか確認

## 開発者向け情報

- **フレームワーク**: Express.js
- **メール送信**: nodemailer
- **テンプレートエンジン**: なし（静的HTML）
- **スタイリング**: vanilla CSS
- **JavaScript**: vanilla JavaScript（フロントエンド）

## ライセンス

© 2025 ヘルシーくん All Rights Reserved.