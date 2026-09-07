# みりぃ ファンサイト

みりぃ（三橋莉子）さんを応援するファン運営・非公式サイトです。
本人運営ではありません。公認の有無は公開表記で扱いません。

2026年専用サイトではありません。2027年以降も同じリポジトリで運用します。

公開URL: https://mily-fan-site.vercel.app/

## いまの状態

- 初期ページ: Hero / 応援する / 最新情報 / ギャラリー / スケジュール / プロフィール / リンク / Footer
- 最新情報に、21歳誕生日の投稿要約と朝のInstagram Storyを掲載しています
- MISS CIRCLE CONTEST 2026 ENTRY 734 への応援導線（Hero / Support / モバイルドック）
- 次回配信はSHOWROOMの本人ルーム登録予定を優先。新鮮な次回枠と同じ日・それ以前の旧枠は混ぜず、翌日以降はミスサークル公式で補完。登録予定には取得元と確認時刻を表示
- 配信予定を ENTRY 734 ページ起点で自動取得（`/api/mily-schedule`。成功時は公式枠のみ、失敗時は手入力 fallback → 非表示。表示中は5分TTL経過後に再取得）
- FM「湘南シーサイドサークル」の放送状態を自動取得（`/api/mily-radio-status`。取得失敗でもサイトは壊れない）
- Follow Mily: X / Instagram / TikTok / SHOWROOM / MixChannel（X〜SHOWROOMはENTRY 734実ページ、MixChannelは本人プロフィールで確認済み）
- FM湘南マジックウェイブへの導線（個別プロフィール・番組ページ）
- ギャラリーに写真と動画を掲載しています（独立動画は Latest と同じ公開派生を共有できる。手順は `docs/MEDIA.md`）
- `/profile/` に、ラジオ・音楽経験・配信・コンテスト・好きなものを一次情報の出典付きでまとめた詳細プロフィール
- 予定は、確認できるまでセクションを非表示にします

## 開発

```bash
pnpm install
pnpm dev
pnpm typecheck
pnpm test
pnpm build
```

## データ

| ファイル | 内容 |
| --- | --- |
| `src/data/profile.ts` | 出典台帳・確認済みプロフィール・活動・嗜好 |
| `src/data/events.ts` | 年をまたげる予定 |
| `src/data/news.ts` | 最新情報 |
| `src/data/media.ts` | 写真（手順: `docs/MEDIA.md`） |
| `src/data/galleryVideos.ts` | Gallery の独立動画（Latest と asset 共有可） |
| `src/data/socials.ts` | 本人 SNS |
| `src/data/links.ts` | その他リンク |
| `src/data/highlights.ts` | ハイライト |
| `src/data/radio.ts` | FM湘南マジックウェイブの確認済み番組枠 |

## 運用

- 日常更新（news / events / 写真 / SNS / FM）: `docs/CONTENT-OPS.md`
- 写真・動画の受け入れ: `docs/MEDIA.md`
- 配信メモ（LIVE STREAM）の統一ルール: `docs/LIVE-STREAM-RECAP.md`
- `main` へ直接 push しない
- 作業ブランチから PR
- squash merge 前提
- GitHub Actions が typecheck / test / build / identity guard を実行します
