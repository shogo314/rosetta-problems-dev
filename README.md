# Rosetta Problems

競技プログラミングの同じテーマの問題を、複数のオンラインジャッジにまたがって探せる Next.js サイトです。

## ローカル開発

Node.js 24 を使用します。

```bash
npm ci
npm run dev
```

http://localhost:3000 を開いて確認できます。問題データの構成と更新手順は [AGENTS.md](AGENTS.md) を参照してください。

## Cloudflare Pages へのデプロイ

icpc-replay と同じく、Next.js の静的出力を Cloudflare Pages に配信します。`npm run build` で `out/` に全ページを生成するため、本番環境に Next.js サーバーは不要です。データの更新は再ビルド時に反映されます。テーマに対応するジャッジの問題はサイト内ページを生成し、対応テーマがない問題はジャッジの一覧から公式ページへ直接リンクします。

Cloudflare ダッシュボードの **Workers & Pages → Create application → Pages → Import an existing Git repository** から `shogo314/rosetta-problems-dev` を接続します。

| 設定 | 値 |
| --- | --- |
| Production branch | `main` |
| Framework preset | `Next.js (Static HTML Export)` |
| Build command | `npm run build` |
| Build output directory | `out` |
| Root directory | リポジトリのルート |
| Environment variable | `NODE_VERSION=24` |

接続後は `main` ブランチへの push で自動デプロイされます。[Cloudflare 公式ガイド](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/)も参照してください。

移行時は、発行された `*.pages.dev` の URL で次を確認します。

- `/`、`/problem`、`/judge` が表示されること。
- `/problem/x_plus_y` などのテーマ別ページが数式も含めて表示されること。
- ジャッジ一覧から個別問題へ移動でき、テーマ別ページとの相互リンクが動作すること。
- 存在しない URL が 404 になること。

必要なカスタムドメインを Pages に設定し、公開を確認してから Vercel 側の自動デプロイを停止してください。
