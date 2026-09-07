# Codex 向けメモ — mily-fan-site

このサイトの共同運営者向けメモです。対象はみりぃ（三橋莉子）さんだけです。
他のファンサイトの人物データ・画像・文章を持ち込まないでください。

レビュー要求（`@codex review`）の投稿条件は `AGENTS.md` の「### Codexレビュー依頼の委任」が唯一の情報源です。ここへルール本文をコピーしないでください。
接続エラー・タイムアウトはレビュー成功として扱わないでください。

## 第一の仕事

確認できた公開情報だけを、データファイルへ追加する。手順とテンプレートは `docs/CONTENT-OPS.md`。
配信メモ（`src/data/streamRecaps.ts` / `/activities/live/`）は `docs/LIVE-STREAM-RECAP.md` に従う。

- お知らせ → `src/data/news.ts`（配列の先頭）
- 出演・配信・イベント → `src/data/events.ts`（年をまたいで同じ配列）
- 写真・動画 → `src/data/media.ts`（ローカル写真は `public/media/gallery/mily-…`（命名は docs/MEDIA.md））
- 本人 SNS → `src/data/socials.ts`（確認できた URL のみ）
- プロフィール事実 → `src/data/profile.ts`（出典確認後）

分からないものは載せない。空欄のままにする。

## 品質ゲート

- [ ] 非公式であることが残っている
- [ ] 未確認情報・推測がない
- [ ] 本人写真・AI生成顔を追加していない
- [ ] `pnpm typecheck`
- [ ] `pnpm test`
- [ ] `pnpm build`
- [ ] `pnpm guard`

## マージ

通常は PR 経由。squash merge 前提。CI が赤、出典が未確認、レビューが未完了ならマージしない。
Vercel で本番公開済み（https://mily-fan-site.vercel.app/）。main への merge は本番反映。
