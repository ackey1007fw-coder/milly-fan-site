# 2026-09-11 SHOWROOMファンルーム音声

## 対象と実装

オーナーが指定した9月11日06:41の本人公開音声を、既存の音声プレーヤーで掲載する。
リンク案だけだった未公開の作業内容を、実音声付きのNEWSへ置き換えた。

- NEWS ID: `2026-09-11-morning-fanroom-voice`
- 公開投稿日: `2026-09-11T06:41:34+09:00`。公開ボイス一覧の投稿IDは `88898855`。
- 出典確認: https://www.showroom-live.com/room/profile?room_id=573253 の公開画像・ボイス一覧。
- 関連リンク: https://www.showroom-live.com/room/fan_club?room_id=573253 。個別投稿の恒久permalinkとは扱わない。
- 出典表示は非リンクの `SHOWROOMファンルーム`。音声はCDNへ直リンクせず自己ホストする。
- `src/data/morningFanroomVoice.ts` をNEWSの `kind: "audio"` へ接続。
- `NewsAudioCard` の既存controlsと `preload="none"` を再利用。自動再生はしない。

## 素材と公開範囲

公開ファイルは `public/media/news/mily-b93-01-fanroom-morning-voice.m4a`。
原本は非公開の作業領域へ受信バイトのまま保管。原本の変更・再エンコードはしない。
公開派生はAACパケット830個が原本と一致し、約70.827秒・12kHz・mono。
作成時刻などの出典メタデータを除去し、fast-start構造にした。素材台帳は `MEDIA.md`。

本文はローカルASRで確認した朝の配信へのお礼と、これからの思いに限定する。
全文文字起こし・スクリーンショット・他のファンの発言は公開しない。
音声中の当日予定を `events.ts` や `streamSchedule.ts` へ自動転記しない。
Gallery・`media.ts`・`galleryVideos.ts`・`/stories/`へは追加しない。

## 回帰検証

新しい音声は現在のNEWSを直接読む専用テストで検証する。
既存の過去時点fixturesは当時の範囲を維持する。テストのskip化やguardの変更はしない。
