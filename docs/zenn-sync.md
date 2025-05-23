# Zenn ⇔ ポートフォリオサイト同期システム

このシステムは、Zennの記事（MD形式）とポートフォリオサイト（MDX形式）間でコンテンツを自動的に同期するためのツールです。

## 使い方

1. GitHub Actionsから「Sync Zenn to Portfolio」ワークフローを手動実行します
   - すべての記事を同期する場合：パラメータなしで実行
   - 特定の記事のみ同期する場合：`specific_file`に記事ファイル名（例：`my-article.md`）を指定

2. ワークフロー実行後、変換されたMDXファイルが`drafts`ブランチの`content/posts`ディレクトリに追加されます

3. Tina CMSを使用して、追加された記事の内容を確認・編集します
   - ヒーロー画像の設定
   - フロントマターの調整
   - 必要に応じて本文の編集

4. 編集完了後、`drafts`ブランチから`main`ブランチにプルリクエストを作成し、マージすることで公開が完了します

## 必要な設定

- リポジトリの「Settings > Secrets and variables > Actions」で以下を設定：
  - `PERSONAL_ACCESS_TOKEN`: GitHubのパーソナルアクセストークン（repo権限付き）

## フロントマター変換ルール

| Zenn (MD) | ポートフォリオ (MDX) | 変換ロジック |
|-----------|---------------------|------------|
| `title`   | `title`             | そのまま複製 |
| `topics`  | `tags`              | 配列をそのまま転送 |
| `emoji`   | -                   | 無視 |
| `type`    | -                   | 無視 |
| `published` | -                 | 無視 |
| -         | `heroImg`           | デフォルト値を設定 |
| -         | `excerpt`           | 本文から自動生成 |
| -         | `author`            | デフォルト値を設定 |
| -         | `date`              | 現在時刻を使用 |
