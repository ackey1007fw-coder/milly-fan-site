# 初めてのアバ権達成 Story — 掲載準備

状態: 元投稿日確認待ち。NEWSへの登録・本番公開は未実施。
素材: `src/data/avatarAchievementStoryVideo.json`（b103）。
掲載予定面: Latest / NEWS。動画と記事を同じカードで表示する。

## 記事案

### 初めてのアバ権達成！3次審査を走り切った感謝を届けて

みりぃがInstagram Storyで、3次審査を無事に走り切ったことを報告。「いつも応援ありがとうございます」と、応援してくれた皆さんへの感謝を伝えました。

さらに、目標に掲げていた「アバ権」を初めて達成したことも報告。43日間、初期アバターで配信してきたみりぃは、「やーっと自分のアバター‼️」と喜びをつづり、「楽しみにしててねっ♪」「撮影会来てくれるかな？！」と呼びかけています。動画では、投票は13日までと案内しています。

## 確定後の配線

- 元投稿日をオーナーに確認し、manifestのsourceDateとNEWSのdate / idに反映する。受領日やcontainer creation_timeを投稿日とみなさない。
- この本文と動画を既存のNewsItemへ登録。activityIdsはlive-stream / miss-circle。
- 出典表示は非リンクのInstagram Story。恒久permalink・リンクスタンプ遷移先を推測しない。
- 投票導線を付ける場合は既存のmissCircleWebVoteLinkと期間制御を再利用する。
- 審査通過・順位・アバター配布開始日・撮影会日程を意味する記述へ広げない。
- Gallery / Storiesへの自動展開はしない。
