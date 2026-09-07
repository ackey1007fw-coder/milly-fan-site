# メディア運用ガイド — mily-fan-site

写真・動画の受け入れから掲載までの手順と、受領済み素材の台帳です。
どのツール（Claude Code / Codex / Cursor）で作業しても、この手順に従ってください。
日常更新の振り分け（news / events / 配信予定）は `docs/CONTENT-OPS.md`。

## 受け入れフロー

```
Google Drive 原本
  → 選定（オーナー了承。SNSから自動取得しない）
  → media/original/   （無改変 jpg。gitignore 済み）
  → pnpm media:build
  → public/media/gallery/   （jpg / webp × 480 / 960 / 1600。コミットする）
  → src/data/media.ts       （マニフェスト。了承まで published: false）
```

1. Drive の原本フォルダから、掲載する枚だけを選ぶ。フォルダ URL はオーナーに確認する（ここには書かない）。
2. 選んだファイルを `media/original/` へ、命名規則どおりの**新しい**名前でコピーする。Drive 側の原本は動かさない。
3. `pnpm media:build` を実行する。既存の派生と同名ならスクリプトは**上書きせず停止**する。
4. `public/media/gallery/` の派生を確認し、`src/data/media.ts` に項目を足す。
5. オーナー確認が取れるまで `published: false`。了承後に `true`。

この流れを省略して SNS 画像を直接 `public/media/` に置かない。

## ディレクトリ構成

```
media/original/            元素材。無改変で保管。jpg は gitignore（README のみコミット）
public/media/gallery/      公開用派生（jpg / webp × 480 / 960 / 1600px）。コミットする
src/data/media.ts          マニフェスト。掲載可否・出典・alt を管理
```

- 元素材は**読み取り専用**として扱う。上書き・リネーム・再エンコード禁止。
- 派生の生成は `pnpm media:build`。出力先に同名ファイルがあると**上書きせず停止**する。
  内容を差し替えたいときは新しいファイル名（新しい連番）を使う。公開済みファイル名は URL 契約として不変。
- sharp が既定でメタデータを落とすため、派生に EXIF / GPS / IPTC は残らない（コミット前に確認済みであること）。

## ファイル命名

```
mily-b<batch 2桁>-<seq 2桁>-<slug>.jpg          … 元素材
mily-b<batch 2桁>-<seq 2桁>-<slug>-<width>.<ext> … 派生
```

- `Mily / mily` は本人の公開表記（Instagram @mily_chan36）。一般英単語ではないため、spellcheckで"修正"しない。l を重ねた表記の方が誤りで、guard（`pnpm guard`）が全ファイルで検出する。
- `<batch>` は受領バッチの連番。**受領順であり撮影日ではない。**
- 投稿日・撮影日が確認できるまで、ファイル名に日付を入れない（日付の捏造禁止）。
  確認できた日付は `src/data/media.ts` の `sourceDate` に記録する。
- 連番は一度使ったら欠番になっても再利用しない。

## 掲載のゲート

`src/data/media.ts` の各項目は次を満たすときだけ `published: true` にできる。

1. オーナーが掲載を了承している
2. `provenance` が明確（`owner-provided` / `sns-post` / `third-party`）
3. `sns-post` なら `sourceUrl` 必須、`third-party` なら `credit` 必須
4. `alt` が書かれている（外見の評価ではなく、状況の説明）
5. 写り込んだ第三者・個人情報・店舗特定要素の懸念が解消済み

`sourceUrl` / `sourceDate` / `credit` は**確認できた値だけ**を入れる。不明のうちは `null`（推測禁止）。

掲載ゲートを通過したオーナー提供・掲載承認済み素材は、原則としてサイトへ掲載する。
非掲載を初期値にせず、Story / Latest / NEWS / Gallery 等のどの掲載面が適切かを先に判断する。
Gallery向きでない素材でも、Story / NEWS向きならその掲載面で扱う。

掲載しない場合は、素材台帳、PR本文、または最終報告に具体的な理由を記録する。主な理由は次のとおり。

- プライバシー上の問題
- 識別可能な第三者情報
- 出典 / 権利が未確認
- 既存公開素材との重複
- 公開用として不足する品質
- 文脈に合う掲載面がない
- 互換性・変換失敗などの技術的問題

「安全なので載せない」を理由にせず、問題がある場合は該当するゲート項目を具体的に示す。
原則掲載であっても、出典・権利・プライバシー・第三者情報・公開派生の品質確認は省略しない。

## 素材台帳（batch b01 / 受領日 2026-08-14〜15）

| ID | ファイル | sha256 (先頭12桁) | 内容 | 掲載 |
| --- | --- | --- | --- | --- |
| b01-01 | mily-b01-01-birthday-cake.jpg | edc5ed508820 | バースデーケーキと花束。人物なし | ✅ |
| b01-02 | mily-b01-02-bouquet-standing.jpg | 54c11a821928 | 花束を持つ立ち姿 | ✅ |
| b01-03 | mily-b01-03-bouquet-smile.jpg | c3793e62525b | 花束と緑のバッグ・笑顔 | ✅ Hero 兼用 |
| b01-04 | mily-b01-04-bouquet-pose.jpg | 8c6cc2fd9d04 | 花束とバッグ（b01-03の連写違い） | ✅ |
| b01-05 | mily-b01-05-bouquet-closeup.jpg | a5bb0d475f8b | 花束を抱えた寄り | ✅ |
| b01-06 | mily-b01-06-necklace-gift.jpg | 89fab42c4550 | Canal 4℃ のネックレス | ✅ |

### 掲載判断メモ

- **b01-01（ケーキ）**: 当初は①別の方の名前（画像上でマスク済み）、②第三者の腕・衣類の写り込み、③店舗ロゴの3点を懸念として保留したが、**2026-08-15 にオーナーが掲載を指示**したため公開。懸念は台帳に記録として残す。
- **b01-04**: 当初は b01-03 との重複を理由に非掲載としたが、main に取り込まれた5枚構成を巻き戻さない方針（2026-08-15 オーナー指示）により掲載。

### 出典の確認状況

- b01-01 / 02 / 03 / 04 / 05: 本人 Instagram の21歳誕生日投稿
  （https://www.instagram.com/p/DbiY3PHk1c8/）が出典として main に取り込まれたため
  `sns-post` として記録。**投稿日は一次ソースで再確認できていないため
  `sourceDate` は null のまま**（確認でき次第記入）。
- b01-06（ネックレス）: 出典未確認のまま `owner-provided` / null。判明したら反映。
- 撮影者（credit）は全素材で未確認。第三者撮影と判明した場合は credit を追記する。

## 禁止事項（再掲）

- 本人の顔の AI 生成・置換・補正、生成塗り足し（outpainting / generative fill）
- 本人 SNS からの画像・動画の自動取得
- X / Instagram / Mixch の動画ファイルを git、`media/original/`、`public/media/` へ自動ダウンロードすること
- X / Instagram の画像 CDN URL をサイトメディアとして hotlink すること
- Mixch の `_movie_mps` / MP4 をこのドメインで再生すること（`<video src=Mixch CDN>` / 非公式 iframe 含む）
- Mixch タイムラインのクロール。扱うのはオーナー指定の `https://mixch.tv/m/{id}` だけ
- 顔・体を不自然に切るトリミング（見せ方の調整は `focal` = object-position で行う）
- 元素材・公開済み派生の上書き

### Mixch outbound player card（唯一の SNS サムネイル例外）

Mixch に公式 oEmbed / iframe embed はない。Mixch の movie ファイルは CloudFront `_movie_mps` URL であり、このサイトで再生すると (1) Mixch CDN の hotlink、(2) CAMPUS GIRLS コンテストの視聴・ポイントを Mixch から奪う、(3) SNS ファイルを repo に取り込まない旧ルール違反、になる。

そのため **Mixch ファイルはコピーせず、outbound player card にする。**

- 対象: オーナー指定の公開 Mixch 動画 `https://mixch.tv/m/{id}`。確認済み本人アカウントは `https://mixch.tv/u/10114673` のみ。
- 掲載面: NEWS（Latest）と Gallery。同じオブジェクトを共有する（TikTok `tiktokRadioVideo` と同じ）。Activities の「関連するメディア」には出さない。
- 見た目: poster + 中央の再生オーバーレイ + Mixch ラベル。`<video>` も iframe も使わない。
- poster: その動画の公式 Mixch サムネイル（`thumbnailUrl` / mixch.tv の og:image）だけを使ってよい。X / Instagram の CDN サムネイル例外は作らない。
- Play / click / CTA: Mixch movie URL を新しいタブで `rel="noopener noreferrer"` 付きで開く。このサイトで再生していると誤認させない。
- Mixch ファイルを `media/original/` や `public/media/` に置かない。オーナーが後から原ファイルを提供した場合だけ、既存の自己ホストパイプラインを使う（別経路）。
- photo-forward: Mixch カードはビジュアルとして数える。該当 NEWS をテキストだけにしない。

データは `src/data/mixchMovies.ts`。UI は `src/components/MixchOutboundCard.tsx`。

## 動画を受領したら（先行ルール）

- 元動画は `media/original/` に無改変で保管
- 公開用は H.264 mp4（1080p / 720p、`+faststart`、メタデータ除去）
- poster は**動画内の実フレーム**から作る（AI 生成 poster 禁止）
- `controls` / `playsInline` 必須、`preload="none"`、autoplay は原則オフ
- 短縮版を作る場合は元動画を残し、どの区間を切ったかをマニフェストに記録
- 変換実行前にオーナーへ方針を報告する

### 一時的なInstagram Story動画

- この項目は一般メディアの掲載原則に対する追加安全条件であり、以下を満たした場合だけ公開できる。
- 公開Story permalinkがない場合、素材受け渡し用のDrive URLを `sourceUrl`、caption、metadata、frontend dataへ残さない。表示は `Instagram Story` の非リンクlabelとする。
- owner-providedのクリーンな元動画をgitignored領域へ無改変で保存し、H.264 / AAC / `+faststart`、metadata除去済みの公開MP4を作る。
- posterは公開MP4の実フレーム候補を複数比較して選ぶ。AI生成・顔補正・塗り足しはしない。
- LatestとGalleryへ同じ投稿を出す場合、公開MP4 1本とposter 1枚を共有する。用途別コピーは作らない。
- Instagram UIを含むStory閲覧スクリーンショットはデフォルトでは非掲載とし、
  原則として文言確認資料だけに使う。ただし、その素材と掲載面についてオーナーが
  明示承認した場合は、Latest / NEWS / Gallery / `/stories/` 等のうち承認された面だけへ
  自己ホストできる。`/stories/` 記事の作成やcrop / maskを一律の必須条件にせず、
  素材ごとの承認と安全確認を台帳へ記録する。
- 承認を別素材・別掲載面へ自動流用しない。公開permalinkがない一時Storyでは、
  推測URLやDrive受け渡しURLを公開データへ残さない。
- 一時的な朝投稿はLatest + Galleryの対象であり、読み物の `/stories/` へ自動的に転記しない。

## 素材台帳（batch b03 / 受領日 2026-08-17）

Drive Gallery（b02）とは別の独立動画。Latest と Gallery が同じ公開派生を共有する。

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b03-01 | mily-b03-01-morning-ohayo.mp4 | 2026-08-17 朝の Instagram Story。720×1280。owner-provided | ✅ |
| b03-01 poster | mily-b03-01-morning-ohayo-poster.jpg | 公開MP4の約6.9秒実フレーム。720×1280 | ✅ |

確認済み:

- source date: 2026-08-17
- provenance: owner-provided
- Instagram Story（公開permalinkなし。表示は非リンクlabel）
- posterは公開MP4の実フレーム。AI生成・顔補正なし
- metadata除去済み
- 元Drive URLは記録しない

## 素材台帳（batch b05 / 受領日 2026-08-19）

同じ元素材から、記事用の1枚と Gallery 用の派生セットを作っている。
記事側は STORY `/stories/second-round-result-2026/` 専用のフルサイズ1枚、
Gallery 側は `pnpm media:build` の通常フロー（480 / 960 / 1600 × jpg / webp）。
Drive Gallery（b02）には含めない。

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b05-01（記事） | stories/second-round-result-2026/mily-second-round-result-autumn-leaf.jpg | 夜の並木道で落ち葉を持つ本人写真。1152×2048。owner-provided | ✅ |
| b05-01（Gallery） | gallery/mily-b05-01-autumn-leaf-{480,960,1600}.{jpg,webp} | 上と同じ元素材の通常派生 | ✅ |

Gallery 派生のメモ:

- 元素材が 1152px 幅のため、`-1600` は拡大されず **1152×2048** のまま出力される
  （`build-media.mjs` の `withoutEnlargement`）。`media.ts` の `width` / `height` は
  実寸の 1152×2048 を記録する。
- 縦写真なので `media.ts` の `aspect: "1152 / 2048"` を指定し、Gallery タイル既定の
  4/3 へ切り抜かない。既存の横写真は `aspect` を持たないため表示は従来どおり。

確認済み:

- provenance: owner-provided（オーナーが依頼時に直接提供）
- 元素材は `media/original/mily-b05-01-autumn-leaf.jpg`（gitignore 済み・無改変）
  sha256 先頭12桁: `6d615b2b7354`
- 公開派生は sharp で再エンコードのみ（品質82 / progressive）。**トリミング・回転・拡縮なし**
- EXIF / GPS / IPTC / XMP は派生に残っていない（生成後に確認）
- AI 生成・AI 加工・顔加工なし。縦構図をそのまま使用
- 撮影日・撮影者・公開投稿URLは未確認のため記録しない（推測しない）

## 素材台帳（batch b06 / 受領日 2026-08-19）

Latest の 2026-08-19「体調回復」朝の投稿専用の記事写真。Drive Gallery（b02）にも
`public/media/gallery/`（Gallery 掲載枠）にも含めない。Latest のカード内で1ファイルだけ自己ホストする。

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b06-01 | media/news/mily-b06-01-recovery-morning.jpg | ウインクしてピースする朝の自撮り。1162×2048。owner-provided | ✅ |

確認済み:

- provenance: owner-provided（オーナーが依頼時に直接提供）
- 元素材は `media/original/mily-b06-01-recovery-morning.jpg`（gitignore 済み・無改変）
  sha256 先頭12桁: `1a0fec17a8da`
- 公開ファイルは元素材の**バイト単位で同一のコピー**。再エンコード・トリミング・回転・拡縮なし
  （元素材に EXIF / GPS / IPTC / XMP が無いことを確認済みのため、再圧縮せずそのまま置く）
- 残っているのは JFIF ヘッダと ICC カラープロファイルのみ（個人情報なし）
- AI 生成・AI 加工・顔加工なし。1162:2048 の縦構図をそのまま表示（`object-contain` 相当・トリミングなし）
- 出典は本人X投稿（2026-08-19）。撮影者は未確認のため記録しない

## 素材台帳（batch b07 / 受領日 2026-08-20）

2026-08-20 朝の Instagram Story 動画。b03 と同じく Latest と Gallery（動画アーカイブ）が
同じ公開派生を共有する独立動画で、Drive Gallery（b02）には含めない。

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b07-01 | gallery/mily-b07-01-morning-story.mp4 | 2026-08-20 朝の Instagram Story。512×910。owner-provided | ✅ |
| b07-01 poster | gallery/mily-b07-01-morning-story-poster.jpg | 公開MP4の 4.5 秒地点の実フレーム。512×910 | ✅ |

確認済み:

- 受領日 / source date: 2026-08-20（owner-provided。オーナーが依頼時に直接提供）
- Instagram Story（恒久的な公開 permalink なし。表示は非リンクの `Instagram Story` label）
- 元素材は `media/original/mily-b07-01-morning-story.mp4`（gitignore 済み・無改変・コミットしない）
  sha256: `31ffbec448dd275cc2f2a09fd033c204532acef11a1686e197327ab3ba2a2a5b`
  （オーナー提供の handoff zip に添付された SHA256 と照合して一致を確認してから使用）
- 元素材の実測: 3,174,143 bytes / 512×910 / 5.100 秒 / 30fps / H.264 High / yuv420p /
  音声なし / creation_time 2026-08-19T23:43:39Z
- 公開MP4の実測: 1,005,126 bytes / **512×910** / 5.100 秒 / 30fps /
  H.264 **Constrained Baseline** / level 3.1 / yuv420p / 音声ストリームなし
- faststart 確認済み（`moov` offset 36 < `mdat` offset 1467）
- metadata 除去確認済み（`-map_metadata -1` / `-map_metadata:s:v -1` / `-map_chapters -1`。
  `creation_time` と `handler_name: "Core Media Video"` は残っていない。
  残るのは muxer 既定の `major_brand` / `minor_version` / `compatible_brands` / `encoder` /
  `language` / `handler_name: "VideoHandler"` のみ）
- **アップスケール・ダウンスケール・トリミング・引き伸ばしなし。** 元素材の 512×910 をそのまま維持
  （`-vf scale` を使っていない）。音声は元素材に無いため新規生成していない
- poster は公開MP4の実フレーム（4.5 秒）。AI 生成・顔加工・generative fill・outpainting なし。
  Instagram 閲覧画面のスクリーンショットからは作っていない
- AI 生成素材ではない。AI による加工も一切行っていない
- 文言・日付の確認に使った Instagram 閲覧画面のスクリーンショットは**確認資料のみ**。
  `public/` にも git にもコミットしていない（`scripts/morning-story-20260820.test.mjs` で検査）
- 元 Drive URL / 受け渡し URL は記録しない

### 素材差し替えの経緯

最初の受け渡しで作業環境に届いたファイルは 720×1280 / sha256 `4841b24b7428…` /
creation_time 2026-08-19T23:39:05Z で、オーナーが一次資料として指定した実測値と一致しなかった。
**両者が同じ動画かどうかは確認していない**（推測を記録しない）。
その後 zip 経由で sha256 `31ffbec448dd275c…` の元素材を受領し、照合が一致したため、
公開MP4と poster をこの元素材から作り直して差し替えた。
一致しなかったファイルからの派生は公開していない。

エンコードコマンド（再現用）:

```
ffmpeg -i media/original/mily-b07-01-morning-story.mp4 \
  -map 0:v:0 -an \
  -map_metadata -1 -map_metadata:s:v -1 -map_chapters -1 \
  -c:v libx264 -profile:v baseline -level 3.1 -crf 23 -preset slow \
  -pix_fmt yuv420p -movflags +faststart \
  public/media/gallery/mily-b07-01-morning-story.mp4

ffmpeg -i public/media/gallery/mily-b07-01-morning-story.mp4 -ss 4.5 -frames:v 1 -q:v 4 \
  public/media/gallery/mily-b07-01-morning-story-poster.jpg
```

## 素材台帳（batch b08 / 受領日 2026-08-20）

Latest の 2026-08-20「おはよう‼︎🌞 無理せず、今日も一緒に」X投稿専用の記事写真。
b06 と同じ扱いで、Drive Gallery（b02）にも `public/media/gallery/`（Gallery 掲載枠）にも
含めない。Latest のカード内で1ファイルだけ自己ホストする。

同じ元素材を **Latest と Gallery の2用途で掲載**している（意図的。別素材として扱わない）。
Latest は単体ファイル1枚、Gallery は既存フロー `pnpm media:build` の派生セット。

| ID | 公開ファイル | 用途 | 内容 | 掲載 |
| --- | --- | --- | --- | --- |
| b08-01（Latest） | media/news/mily-b08-01-do-what-you-can-morning.jpg | Latest カード内 | 室内の鏡の前でスマートフォンを持つミラーセルフィー。1538×2048。owner-provided | ✅ |
| b08-01（Gallery） | gallery/mily-b08-01-do-what-you-can-morning-{480,960,1600}.{jpg,webp} | Gallery タイル | 上と同じ元素材の通常派生 | ✅ |

確認済み:

- provenance: owner-provided（オーナーが依頼時に直接提供。SNSから取得していない）
- 元素材は `media/original/mily-b08-01-do-what-you-can-morning.jpg`（gitignore 済み・無改変・コミットしない）
  sha256: `c080c0d782b1c786d26570ef1961033ea8e5f7c9812a7fddbcbc958ff7993ddb`
- 実測値（作業環境に届いたファイルを `file` と sharp で再確認したもの。オーナー申告の
  1538×2048 と一致）: 191,281 bytes / **1538×2048** / JPEG progressive / 8bit / 3ch / sRGB
- **公開ファイルは元素材のバイト単位で同一のコピー**（sha256 一致）。再エンコード・
  トリミング・回転・拡縮・アップスケールなし。b06 と同じ判断で、画質劣化を避けるため
  派生を作らずそのまま置いた
- メタデータ判断の根拠: JPEG のマーカーを走査した結果、含まれるセグメントは
  `APP0(JFIF)` / `DQT` / `SOF2` / `DHT` / `SOS` のみ。**EXIF / GPS / IPTC / XMP / ICC /
  COM はいずれも無い**（sharp の `metadata()` でも `exif` / `iptc` / `xmp` / `icc` が
  すべて undefined、`orientation` も undefined）。除去すべきプライバシーメタデータが
  無いため、安全な派生を作る必要はなかった
- AI 生成・AI 補正・顔加工・generative fill・outpainting なし。
  1538:2048 の縦構図をそのまま表示（`object-contain` 相当・トリミングなし）
- 出典は本人X投稿 `https://x.com/mily_chan36/status/2090242507586322892`（2026-08-20 / 約10:00 JST）
- 撮影者（credit）は未確認のため記録しない
- 動画アーカイブ（`galleryVideos.ts`）・`/stories/` へは複製しない
- 元 Drive URL / 受け渡し URL は記録しない

### Gallery 掲載の追記（2026-08-20）

Latest 掲載（上記）に加えて、**同じ owner-provided 元素材から Gallery 用派生を追加**した。
SNS から再取得しておらず、X の画像 URL も hotlink していない。新しい batch は作らず、
同一素材として `src/data/media.ts` の `mily-b08-01` で表現する。

| 項目 | 値 |
| --- | --- |
| batch | b08（新規 batch を作らず既存 b08 を Gallery にも展開） |
| provenance | owner-provided |
| 元素材 | `media/original/mily-b08-01-do-what-you-can-morning.jpg`（gitignore 済み・無改変・コミットしない） |
| Latest 用公開パス | `public/media/news/mily-b08-01-do-what-you-can-morning.jpg`（**変更なし・維持**） |
| Gallery 用公開パス | `public/media/gallery/mily-b08-01-do-what-you-can-morning-{480,960,1600}.{jpg,webp}` |
| 元画像実測 | **1538×2048**（JPEG progressive / sRGB / 191,281 bytes） |
| 一次出典 | 本人X投稿 `https://x.com/mily_chan36/status/2090242507586322892` |
| `sourceDate` | `2026-08-20`（一次出典で確認済み） |
| `credit` | `null`（撮影者は未確認。推測して埋めない） |

Gallery 派生のメモ:

- 生成は既存フローの `pnpm media:build` のみ。独自手順・独自ルールは追加していない
- 元素材が 1538px 幅のため、`-1600` は拡大されず **1538×2048** のまま出力される
  （`build-media.mjs` の `withoutEnlargement`）。`media.ts` の `width` / `height` は
  実寸の 1538×2048 を記録する
- 実測した派生: 480×639 / 960×1278 / 1538×2048（jpg・webp とも）。
  高さはいずれも縦横比どおりの値で、**トリミング・引き伸ばし・アップスケールなし**
- 縦写真なので `media.ts` に `aspect: "1538 / 2048"` を指定し、Gallery タイル既定の
  4/3 へ切り抜かない。既存の横写真は `aspect` を持たないため表示は従来どおり
- sharp が既定でメタデータを落とすため、派生に **EXIF / GPS / IPTC / XMP / ICC は残っていない**
  （生成後に全6ファイルで確認済み）
- **AI 生成・AI 補正・顔加工・generative fill・outpainting なし。** 派生は元素材の単純な縮小で、
  回帰テストが元素材からの再縮小と画素比較して検証する
  （`scripts/gallery-20260820-morning-photo.test.mjs`）
- Latest 用の公開ファイルは Gallery 追加後も**元素材とバイト単位で同一のまま**（差し替えていない）

## 素材台帳（batch b09 / 受領日 2026-08-20 / source date 2026-08-19）

2026-08-19 の「2次審査通過」を報告した Instagram Story 動画。b03 / b07 と同じく
Drive Gallery（b02）には含めない独立動画で、**STORY 記事
`/stories/second-round-result-2026/` と Gallery の動画アーカイブが同じ公開MP4と
poster を共有する**（用途別コピーを作らない）。

この Story は既存の記事・X投稿・写真を**補強する一次資料**として足したもので、
news item の新規追加も、既存X投稿の複製も、b05-01 写真の再追加もしていない。

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b09-01 | gallery/mily-b09-01-second-round-story.mp4 | 2026-08-19 の2次審査通過報告 Instagram Story。512×910。owner-provided | ✅ |
| b09-01 poster | gallery/mily-b09-01-second-round-story-poster.jpg | 公開MP4の **5.0 秒地点**の実フレーム。512×910 | ✅ |

確認済み:

- provenance: **owner-provided**（オーナーが依頼時に直接提供。SNSから取得していない）
- 表示は非リンクの `Instagram Story` label。**source date: 2026-08-19**
- 元素材は `media/original/mily-b09-01-second-round-story.mp4`
  （gitignore 済み・無改変・コミットしない）
  sha256: `f426810ca76b2c8a9a6d10212853e67a4e20de172565bbf60285fc8ffa3f63f1`

### 元素材の実測値

オーナー提供の handoff zip 同梱 `SHA256SUMS.txt` / `METADATA.txt` と照合し、
**一致を確認してから**使用した。

| 項目 | 実測値 |
| --- | --- |
| size | 6,835,350 bytes |
| video | H.264 **High** / level 3.1 / **512×910** / **30fps** / yuv420p / `has_b_frames` 2 / 571 frames |
| video duration | 19.033333 秒 |
| audio | **HE-AAC** / 48,000 Hz / stereo / 53,395 bps / 19.921667 秒 |
| container duration | 19.921667 秒 |
| 元 metadata | `creation_time` 2026-08-20T03:15:15Z / `handler_name: "Core Media Video" / "Core Media Audio"` |

### 素材受け渡しの経緯

最初の受け渡しで作業環境に届いたファイルは sha256 `d37cbfb2827fad6e…` /
912,910 bytes / **720×1280** / **1fps** で、オーナーが一次資料として指定した実測値と
一致しなかった。**元素材に対する拡大（512→720）にあたるため、このファイルからの
派生は作らず公開もしていない**（b07 と同じ判断）。
その後 zip 経由で sha256 `f426810c…` の元素材を受領し、`sha256sum -c` と ffprobe の
両方で一致を確認したうえで、公開MP4と poster をこの元素材だけから作った。
一致しなかったファイルからの派生は公開していない。

### 公開MP4の実測値

| 項目 | 実測値 |
| --- | --- |
| path | `public/media/gallery/mily-b09-01-second-round-story.mp4` |
| sha256 | `d90d27a077daf396b3367bf938758c0e73d3767d373f13f5537849f201a47dae` |
| size | 487,137 bytes |
| video | H.264 **Constrained Baseline** / level 3.1 / **512×910** / **30fps** / yuv420p / `has_b_frames` 0 / 571 frames |
| duration | 19.034 秒 |
| audio | **ストリームなし**（下記「音声の扱い」） |
| faststart | ✅ `moov` offset 36 < `mdat` offset 3147 |

- **アップスケール・ダウンスケール・トリミング・引き伸ばしなし。** 元素材の
  512×910 / 30fps をそのまま維持している（`-vf scale` を使っていない）
- AI 生成・AI 加工・顔補正・generative fill・outpainting は一切なし
- metadata 除去確認済み（`-map_metadata -1` / `-map_metadata:s:v -1` / `-map_chapters -1`。
  `creation_time` と `handler_name: "Core Media Video"` は残っていない。残るのは muxer 既定の
  `major_brand` / `minor_version` / `compatible_brands` / `encoder` / `language` /
  `handler_name: "VideoHandler"` のみ）

### 音声の扱い — 削除した

元素材には HE-AAC / 48kHz / stereo の音声がある。公開前に確認したところ、
**19.9 秒間を通して連続した音声**が入っていた（実測: mean_volume −17.3 dB /
max_volume −4.6 dB、−50dB を 1 秒以上下回る無音区間なし）。

**この音源の権利関係・再配信権を確認できないため、公開派生は video-only（無音）にした。**
視覚内容（本人のメッセージ文・表情・画面表示）の保存を目的として音声を除去している。

音源の由来・種類・権利者・楽曲名は確認できていないため、**推測して記録しない**。

### poster

- 公開MP4の **5.0 秒地点の実フレーム**から抽出（AI 生成 poster 禁止）
- 抽出候補として 0.3 / 1.0 / 2.5 / 5.0 / 8.0 / 12.0 / 16.0 / 18.8 秒を実際に書き出して比較し、
  本文テキスト・本人の表情・画面下部のリンクステッカー表示がいずれも自然に読める
  5.0 秒を採用した（ほぼ静止Storyのため各時点の差は小さい）
- sha256: `48ced4349af7151e42fb32b60612a296f4a85d8b228676572571d578a6a77a2c` / 57,559 bytes / 512×910
- EXIF / IPTC / XMP / ICC なし（生成後に sharp で確認）
- Instagram 閲覧画面のスクリーンショットからは作っていない

### Story共有URLの扱い

確認時に参照した Instagram Story の共有 URL は**一時的なもの**であり、
`sourceUrl` / frontend data / caption / metadata / コード / docs の
**どこにも恒久 source として保存していない**。表示は非リンクの `Instagram Story` label のみ。
回帰テスト `scripts/second-round-story-video.test.mjs` が、commit 対象の全ファイルを
走査して Story 共有 URL が残っていないことを検査する。

### 既存素材との関係

- Story の**背景写真は既存の b05-01 と同じ落ち葉の写真**（元素材 sha256 先頭12桁
  `6d615b2b7354`）。すでに STORY と Gallery に掲載済みのため、
  **今回あらためて写真を追加・複製・再生成していない**
- STORY 記事と Gallery は `src/data/secondRoundStoryVideo.json` の 1 オブジェクトを共有し、
  **公開MP4 1本 / poster 1枚**だけを参照する
- Drive Gallery（b02）には混ぜていない
- 元 Drive URL / 受け渡し URL は記録しない

エンコードコマンド（再現用）:

```
ffmpeg -i media/original/mily-b09-01-second-round-story.mp4 \
  -map 0:v:0 -an \
  -map_metadata -1 -map_metadata:s:v -1 -map_chapters -1 \
  -c:v libx264 -profile:v baseline -level 3.1 -crf 23 -preset slow \
  -pix_fmt yuv420p -movflags +faststart \
  public/media/gallery/mily-b09-01-second-round-story.mp4

ffmpeg -i public/media/gallery/mily-b09-01-second-round-story.mp4 -ss 5.0 -frames:v 1 -q:v 4 \
  public/media/gallery/mily-b09-01-second-round-story-poster.jpg
```

## 素材台帳（batch b10 / 受領日・source date 2026-08-20）

本人Instagramのマンゴーかき氷投稿に使われた、オーナー直接提供の写真5枚。
Latest は b10-05 のメタデータ除去済み派生1枚、Gallery は5枚すべてを掲載する。
Drive Gallery（b02）・Gallery動画・`/stories/` には含めない。

一次出典: https://www.instagram.com/p/DcQqmIwk1_l/

| ID | 元ファイル | sha256（先頭12桁） | 内容 | 掲載 |
| --- | --- | --- | --- | --- |
| b10-01 | `mily-b10-01-mango-kakigori-closeup.jpg` | `7735df750fda` | マンゴーをのせたかき氷のクローズアップ | ✅ Gallery |
| b10-02 | `mily-b10-02-mango-kakigori-spoon.jpg` | `d622140bcd7d` | スプーンを手にかき氷を見つめるみりぃ | ✅ Gallery |
| b10-03 | `mily-b10-03-mango-kakigori-looking-down.jpg` | `1e4ccc97a839` | かき氷を前に目を閉じるみりぃ | ✅ Gallery |
| b10-04 | `mily-b10-04-mango-kakigori-expression.jpg` | `bc3f6e5bb8a5` | かき氷を前にスプーンを持つみりぃ | ✅ Gallery |
| b10-05 | `mily-b10-05-mango-kakigori-front.jpg` | `acb2fed12861` | かき氷とともにカメラを見るみりぃ | ✅ Latest / Gallery |

確認済み:

- provenance: `owner-provided`（オーナーが掲載用素材として直接提供。SNSから取得していない）
- 5枚とも元素材は `media/original/` に無改変で保管（gitignore済み・コミットしない）
- 元素材はすべて 960×1280 JPEG。EXIF / IPTC を含むため、公開用は既存の
  `pnpm media:build` で再エンコードしてメタデータを除去した
- Gallery は各写真につき 480 / 960 / 1600 × JPG / WebP。元素材幅が960pxのため
  `-1600` は `withoutEnlargement` により 960×1280 のまま（アップスケールなし）
- Latest 代表画像は b10-05 の `-1600.jpg` と同一内容の公開派生を
  `public/media/news/mily-b10-05-mango-kakigori-front.jpg` で使用。実寸 960×1280
- 公開画像に EXIF / GPS / IPTC / XMP / ICC は残っていない
- トリミング・引き伸ばし・生成塗り足し・AI生成・顔加工・顔置換なし
- `sourceDate`: `2026-08-20`（オーナー確認済み）。撮影者は未確認のため `credit: null`
- 全5枚に `aspect: "960 / 1280"` を設定し、Galleryの4:3既定枠へ切り抜かない
- 公開ファイル名は新規batch b10を使用し、既存batch・連番と衝突しない

## 素材台帳（batch b11 / 受領日・source date 2026-08-21）

本人Xの2026-08-21朝のSHOWROOM配信案内に添付された、オーナー直接提供の短尺動画。
Latest と Gallery（動画アーカイブ）が同じ公開MP4・poster・manifest objectを共有する。
Drive Gallery（b02）・`/stories/`・`highlights.ts`・`contest.ts`・`events.ts`には含めない。

一次出典: https://x.com/Mily_chan36/status/2090557839492460779

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b11-01 | `gallery/mily-b11-01-morning-showroom-runway.mp4` | 金色のハート型フィルターを使った短い縦型自撮り動画。720×1280。owner-provided | ✅ Latest / Gallery |
| b11-01 poster | `gallery/mily-b11-01-morning-showroom-runway-poster.jpg` | 公開MP4の2.0秒地点の実フレーム。720×1280 | ✅ Latest / Gallery |

### 元素材の実測

- provenance: `owner-provided`（オーナー指定の受け渡しファイル。SNSから取得していない）
- 元素材は `media/original/0a502bbfb722d82ea97313483c8a377dd97c9e38.mp4` に受領時の名前のまま無改変で保管
  （gitignore済み・コミットしない）
- sha256: `cf893d157551cfbee6db08665c7ad1ec17f9e08f5810c0a6bf730cdddeca68d3`
- 515,287 bytes / **720×1280** / 4.266667秒 / 30fps / 128 frames /
  H.264 High / level 3.1 / yuv420p / 音声ストリームなし
- 元metadata: format `creation_time: 2026-08-20T21:53:30Z`、video
  `handler_name: Twitter-vork muxer`。公開派生では除去した
- 事前の参考値（512×910）とは解像度が異なる。両者を同一コピーとは推測せず、
  Driveから実際に受領した720×1280のファイルを公開派生の基準にした
- 元Drive URL / 受け渡しURLは記録しない

### 公開MP4

- sha256: `93e83d049891da39cba505eff6c34a52c61b1ea84c67d7af145b472b1a62c8c7`
- 887,714 bytes / **720×1280** / 4.267秒 / 30fps / 128 frames /
  H.264 **Constrained Baseline** / level 3.1 / yuv420p / `has_b_frames` 0 /
  音声ストリームなし
- 元素材の縦横比と画素数を維持。アップスケール・ダウンスケール・トリミング・
  引き伸ばしなし（`-vf scale`を使っていない）。音声は新規生成していない
- `+faststart` 確認済み（`moov` offset 36 < `mdat` offset 1362）
- metadata除去確認済み（`-map_metadata -1` / `-map_metadata:s:v -1` /
  `-map_chapters -1`）。元の`creation_time`と`Twitter-vork muxer`は残っていない。
  残るのはmuxer既定のbrand / encoder / language / `VideoHandler`のみ
- AI生成・AI加工・顔補正・generative fill・outpaintingなし

エンコードコマンド（再現用）:

```
ffmpeg -i media/original/0a502bbfb722d82ea97313483c8a377dd97c9e38.mp4 \
  -map 0:v:0 -an \
  -map_metadata -1 -map_metadata:s:v -1 -map_chapters -1 \
  -c:v libx264 -profile:v baseline -level 3.1 -crf 23 -preset slow \
  -pix_fmt yuv420p -movflags +faststart \
  public/media/gallery/mily-b11-01-morning-showroom-runway.mp4
```

### poster

- 公開MP4の0.8 / 2.0 / 3.2秒地点から候補を抽出して比較し、カメラに正面から近い
  自然な構図の2.0秒地点を採用
- 公開MP4の実フレームから生成。AI生成・顔加工・塗り足しなし
- sha256: `8557df5f6ff909034fbcbde2ead6be75633fe165754b0cbe6eb9c42398703278`
- 20,575 bytes / 720×1280 JPEG / EXIF・IPTC・XMP・ICCなし
- `src/data/morningShowroomRunwayVideo.json` の1オブジェクトをLatest / Galleryで共有し、
  用途別のMP4・posterコピーは作っていない

poster生成コマンド（再現用）:

```
ffmpeg -ss 2.0 -i public/media/gallery/mily-b11-01-morning-showroom-runway.mp4 \
  -frames:v 1 -q:v 4 -map_metadata -1 \
  public/media/gallery/mily-b11-01-morning-showroom-runway-poster.jpg
```

## 素材台帳（batch b12 / 受領日・source date 2026-08-21）

本人Instagramの2026-08-21朝の「OHAYO!」Storyに使われた、オーナー直接提供の
短尺動画。Storyには恒久的な公開permalinkがないため、表示は非リンクの
`Instagram Story` labelとする。Instagramプロフィールへの導線は関連リンクであり、
Storyの出典として扱わない。

Latest と Gallery（動画アーカイブ）が同じ公開MP4・poster・manifest objectを共有する。
Drive Gallery（b02）・`/stories/`・`highlights.ts`・`contest.ts`・`events.ts`には含めない。

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b12-01 | `gallery/mily-b12-01-morning-ohayo-story.mp4` | 黒縁メガネのフェイスフィルターと「OHAYO!」の文字が表示された短い縦型自撮り動画。720×1280。owner-provided | ✅ Latest / Gallery |
| b12-01 poster | `gallery/mily-b12-01-morning-ohayo-story-poster.jpg` | 公開MP4の3.4秒地点の実フレーム。720×1280 | ✅ Latest / Gallery |

### 元素材の実測

- provenance: `owner-provided`（オーナー指定の受け渡しファイル。SNSから取得していない）
- 元素材は `media/original/5A997264-4F9F-4656-A3D9-65AABAFFDCB0.mp4` に受領時の名前のまま
  無改変で保管（gitignore済み・コミットしない）
- sha256: `a098302330a074fea5ca3aaf3a5bda826353d4bcb90be1ad357339626b770abf`
- 5,448,933 bytes / H.264 **High** / level 3.1 / **720×1280** / 30fps /
  123 frames / 4.100000秒 / yuv420p
- 音声: **HE-AAC** / 44,100 Hz / stereo / 52,972 bps / 4.014127秒
- 元metadata: format・video・audioの`creation_time: 2026-08-20T21:45:55Z`、
  `handler_name: "Core Media Video" / "Core Media Audio"`
- 依頼時の参考値（size・sha256・映像・音声仕様）と作業環境で受領したファイルの実測値は一致
- 元Drive URL / 受け渡しURL / Drive file IDは公開情報・tracked textとして記録しない

### 音声の扱い — 削除した

元素材にはHE-AAC / 44.1kHz / stereoの音声ストリームが含まれるが、再配信権を
確認できないため、公開派生はvideo-only（無音）とした。

音声の内容・由来・種類・権利者・楽曲名は確認できていないため、推測して記録しない。

### 公開MP4

- sha256: `21879d25f68724dc03fd44f2759049c01b76be24227dd0507f9c5c5fcf23a80d`
- 1,427,878 bytes / H.264 **Constrained Baseline** / level 3.1 / **720×1280** /
  30fps / 123 frames / 4.100000秒 / yuv420p / `has_b_frames` 0 /
  音声ストリームなし
- 元素材の縦横比・画素数・fpsを維持。アップスケール・ダウンスケール・トリミング・
  引き伸ばしなし（`-vf scale`を使っていない）
- `+faststart` 確認済み（`moov` offset 36 < `mdat` offset 1362）
- metadata除去確認済み（`-map_metadata -1` / `-map_metadata:s:v -1` /
  `-map_chapters -1`）。元の`creation_time`と`Core Media Video / Audio`は残っていない。
  残るのはmuxer既定のbrand / encoder / language / `VideoHandler`のみ
- AI生成・AI加工・顔補正・generative fill・outpaintingなし

エンコードコマンド（再現用）:

```
ffmpeg -i media/original/5A997264-4F9F-4656-A3D9-65AABAFFDCB0.mp4 \
  -map 0:v:0 -an \
  -map_metadata -1 -map_metadata:s:v -1 -map_chapters -1 \
  -c:v libx264 -profile:v baseline -level 3.1 -crf 23 -preset slow \
  -pix_fmt yuv420p -movflags +faststart \
  public/media/gallery/mily-b12-01-morning-ohayo-story.mp4
```

### poster

- 公開MP4の0.6 / 1.5 / 2.5 / 3.4秒地点から候補を抽出して比較し、正面に近く、
  瞬きや強いモーションブラーがなく、「OHAYO!」と縦構図が安定した3.4秒地点を採用
- 公開MP4の実フレームから生成。AI生成・顔加工・塗り足しなし
- sha256: `3a89a6cca53464d6653df7e22d51cfbe775328162a55ed208cb619ba12205bcd`
- 67,192 bytes / 720×1280 JPEG / EXIF・IPTC・XMP・ICCなし
- Instagram UIを含む確認用スクリーンショットからは作っておらず、確認資料も
  `public/`・Gallery・gitへ含めない
- `src/data/morningOhayo20260821.json` の1オブジェクトをLatest / Galleryで共有し、
  用途別のMP4・posterコピーは作っていない

poster生成コマンド（再現用）:

```
ffmpeg -ss 3.4 -i public/media/gallery/mily-b12-01-morning-ohayo-story.mp4 \
  -frames:v 1 -q:v 4 -map_metadata -1 \
  public/media/gallery/mily-b12-01-morning-ohayo-story-poster.jpg
```

## 素材台帳（batch b13 / 受領日・source date 2026-08-21）

同じ受領セットの2素材を用途別に管理する。b13-01はSHOWROOMファンルームの
Latest専用crop画像で、Galleryには掲載しない。b13-02はInstagram Storyの
Latest / Gallery共有動画。どちらもowner-providedで、AI生成・AI加工は行っていない。

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b13-01 | `news/mily-b13-01-fanroom-next-slot.jpg` | 09:17「みりぃからの連絡💌」カードだけを切り出した画像。443×313 | ✅ Latestのみ / Gallery禁止 |
| b13-02 | `gallery/mily-b13-02-event-story.mp4` | 配信へのお礼・次枠14:00・投稿時点順位・イベント参加理由を表示したInstagram Story。720×1280 | ✅ Latest / Gallery |
| b13-02 poster | `gallery/mily-b13-02-event-story-poster.jpg` | 公開MP4の10.0秒地点の実フレーム。720×1280 | ✅ Latest / Gallery |

### b13-01 SHOWROOMファンルーム画像

- provenance: `owner-provided`（オーナー提供スクリーンショット。SNSから取得していない）
- 生スクリーンショットは
  `media/original/8C35FA05-8AB0-427B-8238-F097183EA5F2.jpeg` に受領バイトを
  変えず保管（gitignore済み・コミットしない）
- 元画像実測: **109,264 bytes / 588×1280 JPEG / sRGB**
- 元画像sha256: `eca2478248f7465137f0224ec25d225c4a2bba84344c85fcbe62825fb03ccbf6`
- 事前に示された706×1536とは実寸が異なる。両者を同一解像度とは扱わず、
  実際に受領した588×1280を公開派生の基準にした
- 元画像にはEXIF / IPTCが含まれていたため、生スクリーンショットは非公開とし、
  公開cropをsharpで再エンコードしてmetadataを除去した
- crop: `left: 73 / top: 808 / width: 443 / height: 313`。706×1536用の確認済み候補を
  受領画像の実寸へ正規化し、09:17「みりぃからの連絡💌」カードだけが残ることを目視確認
- cropに残るのはカードのlabel・09:17・みりぃ本人の投稿本文だけ。他ファン名・
  他ファンコメント・オーナー自身のコメント・入力UI・前後の投稿カードは含めない
- 公開画像: 22,606 bytes / 443×313 JPEG / sha256
  `b23050a7714939a00c5d1f80b8a60f875d31d9d4a2969e9909527c76b2c8a9ff`
- 公開画像はEXIF / IPTC / XMP / ICCなし。決定的cropとJPEG再エンコードのみで、
  文字改変・AI生成・生成塗り足し・顔加工なし
- Latest / NEWS専用。`media.ts`・Gallery写真・`galleryVideos.ts`・Drive Gallery・
  `/stories/`には追加しない

cropコマンド相当（再現用）:

```
sharp(source)
  .extract({ left: 73, top: 808, width: 443, height: 313 })
  .jpeg({ quality: 82, progressive: true })
```

### b13-02 Instagram Story 元素材の実測

- provenance: `owner-provided`（指定の受け渡しファイル。SNSから取得していない）
- Instagram Story / source date: `2026-08-21` / 恒久permalinkなし
- 元素材は `media/original/51A32589-0C2D-443A-BAD1-A3076FA3C98C.mp4` に
  受領時の名前のまま無改変で保管（gitignore済み・コミットしない）
- sha256: `0f56cfb7d68a248f1a109a7a09aa1a5ae2ded95f9d8b62c5d7a95dcb1e8504ba`
- 613,963 bytes / H.264 **High** / level 3.1 / **720×1280** / **1fps** /
  20 frames / 20.000000秒 / yuv420p
- 音声: **HE-AAC** / 44,100 Hz / stereo / 56,636 bps / 19.919796秒
- 元metadata: format・video・audioの`creation_time: 2026-08-21T02:04:08Z`、
  `handler_name: "Core Media Video" / "Core Media Audio"`
- 依頼時の参考値（size・sha256・映像・音声仕様）と実ファイルの実測値は一致
- 受け渡し用Drive URL / file IDは公開情報・tracked textとして保持しない

### b13-02 音声の扱い — 削除した

元素材には音声ストリームが含まれるが、再配信権を確認できないため、
公開派生はvideo-only（無音）とした。音声の内容・由来・種類・権利者・楽曲名は
確認できていないため、推測して記録しない。

### b13-02 公開MP4

- sha256: `33b87f9c7f27761861cbc8e5689290b0f140e19c8e20274abca54e2ea5a50d61`
- 378,608 bytes / H.264 **Constrained Baseline** / level 3.1 / **720×1280** /
  **1fps** / 20 frames / 20.000000秒 / yuv420p / `has_b_frames` 0 /
  音声ストリームなし
- 元素材の画素数・縦横比・1fps・20秒を維持。crop・scale・引き伸ばし・
  アップスケール・fps水増しなし
- `+faststart`確認済み（`moov` offset 36 < `mdat` offset 935）
- metadata除去確認済み。元の`creation_time`と`Core Media Video / Audio`は残っていない。
  残るのはmuxer既定のbrand / encoder / language / `VideoHandler`のみ
- AI生成・AI加工・顔補正・generative fill・outpaintingなし

エンコードコマンド（再現用）:

```
ffmpeg -i media/original/51A32589-0C2D-443A-BAD1-A3076FA3C98C.mp4 \
  -map 0:v:0 -an \
  -map_metadata -1 -map_metadata:s:v -1 -map_chapters -1 \
  -c:v libx264 -profile:v baseline -level 3.1 -crf 23 -preset slow \
  -pix_fmt yuv420p -movflags +faststart \
  public/media/gallery/mily-b13-02-event-story.mp4
```

### b13-02 poster / 共有範囲

- 公開MP4の5.0 / 10.0 / 15.0秒地点を比較。ほぼ静止したStoryカードで差がないため、
  10.0秒地点を採用
- 公開MP4の実フレームから生成。AI生成・顔加工・文字改変・塗り足しなし
- 137,554 bytes / 720×1280 JPEG / sha256
  `3011127663a1b30d73f0b09063d3a66fe6234d8a9686305b2fa576978b33d099`
- EXIF / IPTC / XMP / ICCなし
- `src/data/eventStory20260821.json` の1オブジェクトをLatest / Galleryで共有し、
  公開MP4 1本・poster 1枚だけを参照する
- StoryのInstagramプロフィール導線はNewsの関連リンクであり、manifestの
  `sourceUrl`やStoryの出典ではない
- `events.ts`・`streamSchedule.ts`・配信予定API・`contest.ts`・`highlights.ts`・
  `/stories/`・Drive Galleryには追加しない

poster生成コマンド（再現用）:

```
ffmpeg -ss 10.0 -i public/media/gallery/mily-b13-02-event-story.mp4 \
  -frames:v 1 -q:v 4 -map_metadata -1 \
  public/media/gallery/mily-b13-02-event-story-poster.jpg
```

## 素材台帳（batch b14 / 受領日・source date 2026-08-21）

本人Xの2026-08-21「急遽なガンダ」投稿に添付された縦写真。
Latest / NEWS の自己ホスト JPEG（720×1280）は既存のまま上書きしない。
Gallery は同じツイート写真のより大きい orig（1162×2048）から `pnpm media:build` した派生。

一次出典: https://x.com/mily_chan36/status/2090722156162478273

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b14-01 NEWS | `news/mily-b14-01-ganda-before-night-stream.jpg` | 黒いキャップとマスク姿で青空と太陽を背にした縦写真。写真内に昼枠配信と23:00からの配信についての文字を表示。720×1280。既存NEWS JPEGを維持 | ✅ Latest / NEWS の fallback `src`。上書きしない |
| b14-01 Gallery | `gallery/mily-b14-01-ganda-before-night-stream-{480,960,1600}.{jpg,webp}` | 同じツイート写真の 1162×2048 orig から生成。withoutEnlargement で 1600 は 1162 のまま | ✅ Gallery photo（`media.ts`）。NEWS JPEG のバイトは複製していない |

確認済み:

- provenance: `owner-provided`（オーナーが依頼時に直接提供。SNSから取得していない）
- 元素材は `media/original/mily-b14-01-ganda-before-night-stream.jpg`
  （gitignore済み・受領バイトを変えず保管・コミットしない）
- 元素材の実測: **130,379 bytes / JPEG / 720×1280 / sRGB / sha256
  `c41bb38ed42cbdf1133583f904c78475c1d683cef6ac3d1727327fde080c9a3e`**
- 依頼時の参考値（272,462 bytes / 864×1536 / sha256 `db8d7b463bbb…`）とは一致しない。
  同一ファイルとは推測せず、作業環境で実際に受領した720×1280ファイルを基準にした
- 元素材にはEXIF（138 bytes）とIPTC（54 bytes）が存在。orientationは1で、GPSタグ・
  XMP・ICCは検出されていない。公開前にsharpでJPEG再エンコードし、metadataを除去した
- 公開ファイルの実測: **92,816 bytes / JPEG progressive / 720×1280 / sRGB / sha256
  `3d821f2bdee3b1c0d46ed834d31a168c03199285012d87bb53f308ff0cbcb5dc`**
- 公開ファイルはEXIF / GPS / IPTC / XMP / ICC / orientation / commentなし
- 再エンコードはsharpのJPEG quality 82 / progressiveのみ。**crop・scale・rotate・
  アップスケール・縦横比変更・写真内文字の改変なし**。720:1280の縦構図をそのまま使用
- 元画像と公開画像の同位置画素を比較した平均絶対差は1.0313（8bit / channel）。
  metadata除去以外の構図変更がないことを確認した
- AI生成・AI補正・顔加工・顔置換・generative fill・outpaintingなし
- `src/data/media.ts` に Gallery 項目 `mily-b14-01` を追加。`/stories/` には追加しない
- 撮影者は未確認のため記録しない。X画像URL・受け渡しURLは公開情報へ残さない

Gallery 派生は X orig 1162×2048（sha256
`fe7503713af5e0e04f853c6af240f102458fbef08fd48bc5afe3a0196a4182a0` / 263,581 bytes）から生成。
既存 NEWS JPEG とは別バイト。同じツイート写真の高解像度版。

## 素材台帳（batch b15 / 受領日・source date 2026-08-21）

2026-08-21のTikTok通常投稿に使われた、オーナー直接提供の短尺動画。
LatestとGallery（動画アーカイブ）が同じ公開MP4・poster・manifest objectを共有する。
Drive Gallery（b02）・`/stories/`・`events.ts`・`profile.ts`・`highlights.ts`には含めない。

一次出典: https://www.tiktok.com/@seasidecircle/video/7676407054466174229

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b15-01 | `gallery/mily-b15-01-tiktok-radio-misscircle.mp4` | 室内でカメラに向かい、手でポーズを取りながら表情を変える短い縦型動画。720×1280。owner-provided | ✅ Latest / Gallery |
| b15-01 poster | `gallery/mily-b15-01-tiktok-radio-misscircle-poster.jpg` | 公開MP4の5.5秒地点の実フレーム。720×1280 | ✅ Latest / Gallery |

### 元素材の実測

- provenance: `owner-provided`（オーナー指定の受け渡しファイル。SNSから取得していない）
- 元素材は `media/original/` に受領時の名前のまま無改変で保管
  （gitignore済み・コミットしない。ランダムな受領時名はtracked textへ記録しない）
- sha256: `40af17f54b7d254d7e337a41cf86d6ec7309985725a928ae0fc0929620b3d50f`
- 1,339,785 bytes / H.264 **High** / level 3.1 / **720×1280** / 30fps /
  337 frames / video 11.233984秒 / container 11.238000秒 / yuv420p
- 音声: **HE-AACv2** / 44,100 Hz / stereo / 64,146 bps / 11.237007秒
- chapterなし。元metadataにはTikTok由来の`aigc_info` / `comment` / `vid_md5`と
  muxer既定のbrand / encoder / language / handlerが存在
- 依頼時の参考値512×910とは解像度が異なる。実際に受領した720×1280のファイルを
  公開派生の基準とし、参考値へ合わせる縮小や別ファイルとの同一視はしていない
- 素材受け渡し用URL / file IDは公開情報・tracked textとして記録しない

### 音声の扱い — 削除した

元素材にはHE-AACv2 / 44.1kHz / stereoの音声ストリームがあるが、音声の内容・由来・
権利者と再配信権を確認できないため、公開派生はvideo-only（無音）とした。
楽曲・BGM・本人音声のいずれかは推測して記録しない。

### 公開MP4

- sha256: `c88244c0ea987840c5525d4a00fee6739d3eac5ba6b5a66389b56e05b2b52266`
- 2,564,584 bytes / H.264 **Constrained Baseline** / level 3.1 / **720×1280** /
  30fps / 337 frames / 11.233984秒（container 11.234000秒）/ yuv420p /
  `has_b_frames` 0 / 音声ストリームなし
- 元素材の画素数・9:16の縦横比・30fps・映像フレーム数を維持。
  crop・scale・引き伸ばし・アップスケール・fps水増しなし
- `+faststart`確認済み（`moov` offset 36 < `mdat` offset 2255）
- metadata除去確認済み（`-map_metadata -1` / `-map_metadata:s:v -1` /
  `-map_chapters -1`）。元の`aigc_info` / `comment` / `vid_md5`は残っていない。
  残るのはmuxer / encoder既定のbrand / encoder / language / `VideoHandler`のみ
- AI生成・AI加工・顔補正・generative fill・outpaintingなし

エンコードコマンド（再現用）:

```
ffmpeg -i media/original/<受領時ファイル名>.mp4 \
  -map 0:v:0 -an \
  -map_metadata -1 -map_metadata:s:v -1 -map_chapters -1 \
  -c:v libx264 -profile:v baseline -level 3.1 -crf 23 -preset slow \
  -pix_fmt yuv420p -movflags +faststart \
  public/media/gallery/mily-b15-01-tiktok-radio-misscircle.mp4
```

### poster / 共有範囲

- 2.0 / 5.5 / 9.5秒地点を比較。2.0秒は視線が下向き、9.5秒は動きが大きいため、
  正面に近く表情と手元が安定している5.5秒地点を採用
- 公開MP4の実フレームから生成。AI生成・顔加工・塗り足しなし
- 41,483 bytes / 720×1280 JPEG / sha256
  `d212e6675cbbf52c133086372569a500c9b54ea2b25e2c13f754a708a255805a`
- EXIF / IPTC / XMP / ICCなし。TikTok閲覧画面のスクリーンショットからは作っていない
- `src/data/tiktokRadioVideo.json` の1オブジェクトをLatest / Galleryで共有し、
  公開MP4 1本・poster 1枚だけを参照する

poster生成コマンド（再現用）:

```
ffmpeg -ss 5.5 -i public/media/gallery/mily-b15-01-tiktok-radio-misscircle.mp4 \
  -frames:v 1 -q:v 4 -map_metadata -1 \
  public/media/gallery/mily-b15-01-tiktok-radio-misscircle-poster.jpg
```

## 素材台帳（batch b16 / 受領日・source date 2026-08-22）

CAMPUS GIRLS 2027 予選A 2nd STAGE審査員賞の結果グラフィックと、
同日に本人が投稿したInstagram Story画像。結果グラフィックはStory / Latestで共有し、
Instagram Story画像はオーナーの当該画像に対する明示承認に基づき、節目Storyの記事内だけで
公開する。どちらもGalleryには追加しない。

本人X一次出典: https://x.com/mily_chan36/status/2090988000813654232

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b16-01 | `stories/campus-girls-2027-second-stage-jury-award/mily-b16-01-campus-girls-second-stage-jury-award.jpg` | CAMPUS GIRLS 2027 予選A 2nd STAGE審査員賞の結果グラフィック。受賞者5名の一人として三橋莉子を掲載。1280×862 | ✅ Story / Latest（1ファイルを共有） |
| b16-02 | `stories/campus-girls-2027-second-stage-jury-award/mily-b16-02-campus-girls-second-stage-instagram-story.jpg` | 審査員賞・予選ファイナル進出、挑戦への思い、公開結果投稿を表示した本人Instagram Story。720×1280 | ✅ 当該Story記事のみ / Latest・Gallery禁止 |

### b16-01 結果グラフィック

- provenance: `sns-post`
- source: 本人X投稿
  `https://x.com/mily_chan36/status/2090988000813654232`
- 公式CAMPUS BOYS / GIRLSの結果投稿URLは確実に確認できなかったため、推測で追加していない
- 元素材は
  `media/original/mily-b16-01-campus-girls-second-stage-jury-award.jpg`
  （gitignore済み・受領バイトを変えず保管・コミットしない）
- 元素材の実測: **150,012 bytes / JPEG / 1280×862 / sha256
  `a3006e79dce6178f7f2bd5fa9da0c4b12f75a7c0742d0dd4f27373cc6666f8b8`**
- 追加依頼時に「約2048×1380」と案内された再提供画像も、実際には前回と同じ
  **150,012 bytes / 1280×862 / 同一sha256**だった。高解像度版とは扱わず、
  現在の原本と公開派生を維持した
- 元素材にはEXIF（138 bytes）とIPTC（54 bytes）が存在。公開前にsharpで
  JPEG再エンコードし、metadataを除去した
- 公開ファイルの実測: **216,425 bytes / JPEG progressive / 1280×862 / sha256
  `73bc8e576e2da1bb265c67e759cbfd0764c9c8c8619792851edfbb1a8c656819`**
- 公開ファイルはEXIF / IPTC / XMP / ICCなし
- 再エンコードはsharpのJPEG quality 95 / progressive / 4:4:4のみ。
  **crop・scale・rotate・アップスケール・縦横比変更なし**。1280:862の横構図を維持した
- AI生成・AI補正・顔加工・人物削除・generative fill・outpaintingなし
- `src/data/campusGirlsSecondStageResultImage.ts` の1オブジェクトをStory / Latestで共有し、
  公開画像1枚だけを参照する
- `src/data/media.ts`・`src/data/galleryVideos.ts`には追加していない

### Instagram Storyスクリーンショット

- provenance: `owner-provided`（当該画像のStory記事掲載をオーナーが明示承認）
- source: `Instagram Story（2026年8月22日）` / 恒久permalinkなし・非リンク表示
- 元素材は
  `media/original/mily-b16-02-campus-girls-second-stage-instagram-story.jpg`
  （gitignore済み・受領バイトを変えず保管・コミットしない）
- 元素材の実測: **127,916 bytes / JPEG / 720×1280 / sha256
  `2324ae36cb81107c2cb05ab717bbd859e7b72702e371f0008f1faacdcd84d768`**
- 追加依頼時に「864×1536目安」と案内された再提供画像も、実際には前回と同じ
  **127,916 bytes / 720×1280 / 同一sha256**だった。実際の受領ファイルを原本とした
- 元素材にはEXIF（138 bytes）とIPTC（54 bytes）が存在。公開前にsharpで
  JPEG再エンコードし、metadataを除去した
- 公開ファイルの実測: **153,111 bytes / JPEG progressive / 720×1280 / sha256
  `4cf8b0fce3e1ac242c4d3c542701c6bbd8f6e62b6810b6bb0c910854ba07658f`**
- 公開ファイルはEXIF / IPTC / XMP / ICCなし
- 再エンコードはsharpのJPEG quality 95 / progressive / 4:4:4のみ。
  **crop・scale・rotate・アップスケール・縦横比変更・内容削除なし**
- AI生成・AI補正・顔加工・人物削除・generative fill・outpaintingなし
- DM・非公開情報・通知・第三者コメント・端末情報は含まれない。Story内に表示される
  受賞者名・公開アカウント名は、本人が共有した公開結果投稿の表示内容である
- `src/data/campusGirlsSecondStageInstagramStoryImage.ts` を当該Story本文だけから参照し、
  lead image・NEWS / Latest・Portal Feed・`media.ts`・`galleryVideos.ts`へ展開しない
- InstagramプロフィールURLを出典として代用していない
- 依頼者の訂正により今回は動画素材なし。公開MP4・poster・動画manifestは作成していない

## 素材台帳（batch b17 / 受領日・source date 2026-08-22）

本人Xの2026-08-22夜のSHOWROOM配信お礼投稿に添付された、オーナー直接提供の横長SHOWROOM公開配信画面スクリーンショット。
Latest / NEWS専用の自己ホスト画像として扱い、Gallery・Gallery動画・Drive Gallery・`/stories/`・`highlights.ts`には追加しない。

一次出典: https://x.com/mily_chan36/status/2091166455224299641

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b17-01 | `news/mily-b17-01-night-showroom-fireworks.jpg` | 花火大会仕様のSHOWROOM公開配信画面。中央にみりぃ、画面下部に視聴者アバター・表示名が並ぶ横長画像。1206×555。owner-provided | ✅ Latestのみ / Galleryには追加しない |

確認済み:

- provenance: `owner-provided`（オーナーが依頼時に直接提供。SNSから自動取得していない）
- source date: `2026-08-22` / 一次出典は上記本人X投稿
- 元素材は `media/original/mily-b17-01-night-showroom-fireworks.jpg`
  （gitignore済み・受領バイトを変えず保管・コミットしない）
- 元素材の実測: **132,220 bytes / JPEG progressive / 1206×555 / sRGB / sha256
  `3409acb7c306f579561b77d96f3ee9f6df8be71cd5166b9e22340e6b1adde903`**
- 公開ファイル `public/media/news/mily-b17-01-night-showroom-fireworks.jpg` は元素材と
  **バイト単位で同一**（132,220 bytes / 同一sha256）。EXIF / GPS / IPTC / XMP / ICC /
  orientation / comment が存在しないことを確認済みのため、不要な再エンコードはしていない
- **crop・resize・rotate・アップスケール・縦横比変更・AI生成・AI補正・顔加工・
  generative fill・outpaintingなし**。1206:555の横構図をそのまま使用
- プライバシー・第三者表示の確認: DM・非公開メッセージ・電話番号・メール・住所・
  端末固有情報は含まれない。画面下部の視聴者アバター・表示名は、みりぃ本人がX投稿に
  添付して公開したSHOWROOM画面の表示内容であり、オーナーの掲載指示に基づき無改変で記録する。
  新しい第三者情報は付加していない
- 画像内の「現在48位」は公開画面の表示として画像に残すが、NEWS本文・`contest.ts`・
  `highlights.ts`・配信予定データへは転記しない
- Xの外部画像URLはhotlinkせず、自己ホスト画像だけを参照する
- `src/data/media.ts`・`src/data/galleryVideos.ts`・`src/data/stories.ts`・
  `src/data/highlights.ts`には追加していない。Latest / NEWS専用

## 素材台帳（2026-08-23 未明のSHOWROOMファンルーム / 公開cropなし）

地震直後のFan Roomやり取り（NEWS id `2026-08-23-earthquake-showroom-fanroom`）は
Latest / NEWSのテキスト記録のみ。公開cropは作っていない。

- 依頼時に示されたフルスクリーンショットには、みりぃとオーナー以外のファンの
  表示名・アバター・コメントが含まれる
- この作業環境では元素材の実バイトを再取得できず、第三者情報を目視で除外した
  privacy-safe cropを確定できなかった
- フルスクリーンショットを `public/` や git に入れない
- Gallery / `media.ts` / `galleryVideos.ts` / Drive Gallery / `/stories/` へ展開しない
- 新しいbatch番号は未使用のまま残す（決め打ちしない）

## 素材台帳（batch b18 / 受領日・source date 2026-08-23）

2026-08-23の地震後に投稿されたInstagram Story動画。owner-providedの縦型動画で、
既存の地震NEWS（id `2026-08-23-earthquake-showroom-fanroom`）と Gallery が
同じ公開MP4・poster・manifest objectを共有する。Fan Roomスクリーンショット
（上記の非公開判断）とは別素材。Drive Gallery（b02）・`/stories/`・
`events.ts`・`streamSchedule.ts`には含めない。新しい地震NEWSは作っていない。

恒久的な公開permalinkがないため、表示は非リンクの `Instagram Story` label。
受け渡し用URL / file IDは公開情報・tracked textとして記録しない。

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b18-01 | `gallery/mily-b18-01-earthquake-safety-story.mp4` | 地震後、関東圏の人たちの無事を気遣い、落ち着いて身の安全を確保するよう呼びかける縦型動画。720×1280。owner-provided | ✅ Latest / Gallery |
| b18-01 poster | `gallery/mily-b18-01-earthquake-safety-story-poster.jpg` | 公開MP4の8.0秒地点の実フレーム。720×1280 | ✅ Latest / Gallery |

### 元素材の実測

- provenance: `owner-provided`（オーナー指定の受け渡しファイル。SNSから取得していない）
- Instagram Story / source date: `2026-08-23` / 恒久permalinkなし
- 元素材は `media/original/mily-b18-01-earthquake-safety-story.mp4` に
  受領バイトを変えず保管（gitignore済み・コミットしない）
- sha256: `29a6202b7c646e230797ddcb75d75eec865ccd3fa9e838c1d08043884a03de18`
- 19,976,089 bytes / H.264 **High** / level 3.1 / **720×1280** / 30fps /
  819 frames / **27.300000秒** / yuv420p / `has_b_frames` 2
- 音声ストリームなし。chapterなし
- 元metadata: format・videoの`creation_time: 2026-08-22T23:20:49.000000Z`、
  `handler_name: "Core Media Video"`
- 公開派生ではmetadataを除去した。投稿時刻は推測して記録しない

### 公開MP4

- sha256: `c80e2d99cce5e5c9e5cfd0ec8e565938fbb5bec81d78900010c69ef4ead0d130`
- 1,524,443 bytes / H.264 **Constrained Baseline** / level 3.1 / **720×1280** /
  30fps / 819 frames / 27.300000秒 / yuv420p / `has_b_frames` 0 /
  音声ストリームなし
- 元素材の画素数・縦横比・30fps・映像フレーム数を維持。
  crop・scale・引き伸ばし・アップスケール・fps水増しなし（`-vf scale`を使っていない）
- 音声トラックは元素材に無いため追加・生成していない
- `+faststart`確認済み（`moov` offset 36 < `mdat` offset 4158）
- metadata除去確認済み（`-map_metadata -1` / `-map_metadata:s:v -1` /
  `-map_chapters -1`）。元の`creation_time`と`Core Media Video`は残っていない。
  残るのはmuxer既定のbrand / encoder / language / `VideoHandler`のみ
- AI生成・AI加工・顔補正・generative fill・outpainting・テロップ削除・短縮なし

エンコードコマンド（再現用）:

```
ffmpeg -i media/original/mily-b18-01-earthquake-safety-story.mp4 \
  -map 0:v:0 -an \
  -map_metadata -1 -map_metadata:s:v -1 -map_chapters -1 \
  -c:v libx264 -profile:v baseline -level 3.1 -crf 23 -preset slow \
  -pix_fmt yuv420p -movflags +faststart \
  public/media/gallery/mily-b18-01-earthquake-safety-story.mp4
```

### poster / 共有範囲

- 公開MP4の4.0 / 5.0 / 6.0 / 8.0 / 13.6 / 16.0 / 20.0 / 24.0秒地点を比較。
  4〜6秒と中盤・20秒前後は手元のノートに視線が落ちているため、
  顔が安定して見え、テロップが読める8.0秒地点を採用
- 公開MP4の実フレームから生成。AI生成・顔加工・塗り足しなし
- 46,811 bytes / 720×1280 JPEG / sha256
  `8051dc985cf9e19a5f61476530dd8d3d210ba06368212d31c08bbdd00571edfa`
- EXIF / IPTC / XMP / ICCなし
- `src/data/earthquakeSafetyStoryVideo.json` の1オブジェクトをLatest / Galleryで共有し、
  公開MP4 1本・poster 1枚だけを参照する
- InstagramプロフィールURLをStoryの出典として代用していない
- 受け渡し用URL / file IDは公開情報へ残さない

poster生成コマンド（再現用）:

```
ffmpeg -ss 8.0 -i public/media/gallery/mily-b18-01-earthquake-safety-story.mp4 \
  -frames:v 1 -q:v 4 -map_metadata -1 \
  public/media/gallery/mily-b18-01-earthquake-safety-story-poster.jpg
```

## 素材台帳（batch b19 / 受領日・source date 2026-08-23）

2026-08-23の湘南シーサイドサークル公式Instagram（番組アカウント）Story動画。
owner-providedの縦型動画で、Gallery と STORY記事
`/stories/2026-08-23-musical-special/` の lead が同じ公開MP4・poster・manifest
objectを共有する。Latest / NEWS の代表動画は後から届いた放送後お礼 Story
（b21）側。みりぃ個人のInstagram Storyではない。Drive Gallery（b02）
には含めない。`events.ts`・`streamSchedule.ts`・radio weekly schedule は
変更していない。

恒久的な公開permalinkがないため、表示は非リンクの
`湘南シーサイドサークル Instagram Story` label。推測URLは作らない。
受け渡し用URL / file IDは公開情報・tracked textとして記録しない。

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b19-01 | `gallery/mily-b19-01-seaside-circle-musical-special.mp4` | スタジオでヘッドホンをつけた3人が映る、湘南シーサイドサークルのInstagram Story動画。真夏のミュージカル特集と生放送案内。720×1280。owner-provided | ✅ Gallery / STORY lead |
| b19-01 poster | `gallery/mily-b19-01-seaside-circle-musical-special-poster.jpg` | 公開MP4の8.0秒地点の実フレーム。720×1280 | ✅ Gallery / STORY lead |

### 元素材の実測

- provenance: `owner-provided`（オーナー指定の受け渡しファイル。SNSから取得していない）
- 番組Instagram Story / source date: `2026-08-23` / 恒久permalinkなし
- 元素材は `media/original/mily-b19-01-seaside-circle-musical-special.mp4` に
  受領バイトを変えず保管（gitignore済み・コミットしない）
- sha256: `0595d245226140b6d2981d8ce4f4a9c3c0c5d8503136bf2ca5b99861f63d9b69`
- 7,286,091 bytes / H.264 **High** / **720×1280** / 30fps /
  571 frames / **19.033333秒** / yuv420p
- 依頼時の確認用動画の実測（512×910 / H.264 / 30fps）とは解像度が異なる。
  同一ファイルとは推測せず、今回使用した原本
  `media/original/mily-b19-01-seaside-circle-musical-special.mp4` を
  ffprobe で再確認した値を記録する。公開派生もこの720×1280原本を基準にしており、
  512×910へ合わせて再エンコード・ダウンスケールしていない
- 音声: HE-AAC / 48kHz / stereo。依頼が H.264 / AAC 指定のため、公開派生でも
  音声を保持する（権利が不明な個人Storyで無音化した過去案件とは別判断）
- chapterなし
- 公開派生ではmetadataを除去した。投稿時刻は推測して記録しない

### 公開MP4

- sha256: `a50be82df9620b5f246f6d84c6bd64d48de981e1b462219eaf216c71ec6ecf4c`
- 861,587 bytes / H.264 **Constrained Baseline** / **720×1280** /
  30fps / 571 frames / 19.033333秒 / yuv420p / `has_b_frames` 0 /
  AAC-LC 128k
- 元素材の画素数・縦横比・30fps・映像フレーム数を維持。
  crop・scale・引き伸ばし・アップスケール・fps水増しなし（`-vf scale`を使っていない）
- `+faststart`確認済み（`moov` が `mdat` より前）
- metadata除去確認済み（`-map_metadata -1` / `-map_metadata:s:v -1` /
  `-map_metadata:s:a -1` / `-map_chapters -1`）。元の`creation_time`と
  `Core Media`は残っていない
- AI生成・AI加工・顔補正・generative fill・outpainting・テロップ削除・短縮なし

エンコードコマンド（再現用）:

```
ffmpeg -i media/original/mily-b19-01-seaside-circle-musical-special.mp4 \
  -map 0:v:0 -map 0:a:0 \
  -map_metadata -1 -map_metadata:s:v -1 -map_metadata:s:a -1 -map_chapters -1 \
  -c:v libx264 -profile:v baseline -level 3.1 -crf 23 -preset slow \
  -pix_fmt yuv420p \
  -c:a aac -b:a 128k \
  -movflags +faststart \
  public/media/gallery/mily-b19-01-seaside-circle-musical-special.mp4
```

### poster / 共有範囲

- 公開MP4の複数地点を比較。8.0秒前後は3人が自然に見え、Story本文が読みやすく、
  極端な瞬きやブレが少ないため採用
- 公開MP4の実フレームから生成。AI生成・顔加工・塗り足しなし
- 105,053 bytes / 720×1280 JPEG / sha256
  `1f3516f15c70ff802231ccae56716400bd1d543c1bc998e6daf9e2413e26b0b5`
- EXIF / IPTC / XMP / ICCなし
- `src/data/seasideCircleMusicalSpecialVideo.json` の1オブジェクトを
  Gallery / STORY lead で共有し、公開MP4 1本・poster 1枚だけを参照する。
  Latest / NEWS の代表は b21 側
- みりぃ個人のInstagram Storyとして分類していない
- InstagramプロフィールURLや番組Storyの推測permalinkを出典として代用していない
- 受け渡し用URL / file IDは公開情報へ残さない

poster生成コマンド（再現用）:

```
ffmpeg -ss 8.0 -i public/media/gallery/mily-b19-01-seaside-circle-musical-special.mp4 \
  -frames:v 1 -q:v 4 -map_metadata -1 \
  public/media/gallery/mily-b19-01-seaside-circle-musical-special-poster.jpg
```

## 素材台帳（batch b20 / 受領日・source date 2026-08-23）

本人Instagramの「龍みたいな雲」投稿に使われた、オーナー直接提供の写真3枚。
Latest は b20-02 のメタデータ除去済み派生1枚、Gallery は3枚すべてを掲載する。
Drive Gallery（b02）・Gallery動画・`/stories/`・`events.ts`・`highlights.ts`・
`contest.ts` には含めない。

一次出典: https://www.instagram.com/p/DcYbkvOk4Te/

| ID | 元ファイル | sha256（先頭12桁） | 内容 | 掲載 |
| --- | --- | --- | --- | --- |
| b20-01 | `mily-b20-01-skytree-upward.jpg` | `11126f6be7bc` | 足元付近から見上げた東京スカイツリー | ✅ Gallery |
| b20-02 | `mily-b20-02-dragon-cloud-close.jpg` | `68c332526e0e` | 青空に龍のようにも見える白い雲 | ✅ Latest / Gallery |
| b20-03 | `mily-b20-03-dragon-cloud-city.jpg` | `f16dbb4349c3` | 街並みの上に広がる青空と龍のようにも見える雲 | ✅ Gallery |

確認済み:

- provenance: `owner-provided`（オーナーが掲載用素材として直接提供。SNSから取得していない）
- 3枚とも元素材は `media/original/` に無改変で保管（gitignore済み・コミットしない）
- 元素材は横位置 JPEG（b20-01 は 3240×2442、b20-02 / b20-03 は 3240×2430）。
  EXIF を含むため、公開用は既存の `pnpm media:build` で再エンコードしてメタデータを除去した
- Gallery は各写真につき 480 / 960 / 1600 × JPG / WebP。元素材幅が3240pxのため
  `-1600` は 1600px 幅（アップスケールなし）
- Latest 代表画像は b20-02 の `-1600.jpg` と同一内容の公開派生を
  `public/media/news/mily-b20-02-dragon-cloud-close.jpg` で使用。実寸 1600×1200
- 公開画像に EXIF / GPS / IPTC / XMP / ICC は残っていない
- トリミング・引き伸ばし・生成塗り足し・AI生成・顔加工・顔置換なし
- `sourceDate`: `2026-08-23`（公開permalinkの投稿日）。撮影者は未確認のため `credit: null`
- 3枚とも横位置のため Gallery の既定 4/3 タイルを使う（`aspect` は付けない）
- 公開ファイル名は新規batch b20を使用し、既存batch・連番と衝突しない
- 受け渡し用URL / file IDは公開情報・tracked textとして記録しない

## 素材台帳（batch b21 / 受領日・source date 2026-08-23）

2026-08-23の湘南シーサイドサークル公式Instagram（@seasidecircle）
放送後Story動画。owner-providedの縦型動画で、Latest / NEWS（既存 id
`2026-08-23-seaside-circle-musical-special`）・Gallery・STORY記事
`/stories/2026-08-23-musical-special/` の closing が同じ公開MP4・poster・
manifest objectを共有する。新しいNEWSは作っていない。既存b19は削除せず、
Gallery と STORY lead として残す。みりぃ個人のInstagram Storyではない。
Drive Gallery（b02）には含めない。`events.ts`・`streamSchedule.ts`・
radio weekly schedule は変更していない。

恒久的な公開permalinkがないため、表示は非リンクの
`湘南シーサイドサークル Instagram Story` label。推測URLは作らない。
InstagramプロフィールURLをStory permalinkの代用にしない。
受け渡し用URL / file IDは公開情報・tracked textとして記録しない。

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b21-01 | `gallery/mily-b21-01-seaside-circle-musical-special-thanks.mp4` | スタジオで3人が並び、真夏のミュージカル特集へのお礼と清水美依紗さんへの出演感謝メッセージが表示されたInstagram Story動画。720×1280。owner-provided | ✅ Latest / NEWS + Gallery + STORY closing |
| b21-01 poster | `gallery/mily-b21-01-seaside-circle-musical-special-thanks-poster.jpg` | 公開MP4の8.0秒地点の実フレーム。720×1280 | ✅ Latest / NEWS + Gallery + STORY closing |

### 元素材の実測

- provenance: `owner-provided`（オーナー指定の受け渡しファイル。SNSから取得していない）
- source account: 湘南シーサイドサークル @seasidecircle
- 番組Instagram Story / source date: `2026-08-23` / 恒久permalinkなし
- 元素材は `media/original/mily-b21-01-seaside-circle-musical-special-thanks.mp4` に
  受領バイトを変えず保管（gitignore済み・コミットしない）
- sha256: `d143ecbd7976453470145be6079107a0e7820c13798098f3e155f5dfda5a917d`
- 824,316 bytes / H.264 **High** / **720×1280** / **1fps** /
  20 frames / **20.000000秒** / yuv420p
- 音声: HE-AAC / 44.1kHz / stereo。元素材には音声ストリームがある
- chapterなし
- 公開派生ではmetadataを除去した。投稿時刻は推測して記録しない

### 音声の扱い — 削除した

元素材には HE-AAC / 44.1kHz / stereo の音声がある。再配信権を確認できないため、
公開派生は video-only（無音）にした。番組公式 Instagram Story であることや
既存 b19 の判断だけでは、音声の再配信許可にはならない。

音声の内容・由来・種類・権利者・楽曲名は確認できていないため、推測して記録しない。
b19 の公開MP4は変更していない。

### 公開MP4

- sha256: `95c338f696557042c37c9cb95afbfe689763c7a7d8d0a38acc99b23933dfcf8f`
- 511,902 bytes / H.264 **Constrained Baseline** / **720×1280** /
  **1fps** / 20 frames / 20.000000秒 / yuv420p / `has_b_frames` 0 /
  音声ストリームなし
- 元素材の画素数・縦横比・1fps・映像フレーム数を維持。
  crop・scale・引き伸ばし・アップスケール・fps水増し・短縮なし（`-vf scale`を使っていない）
- 既存の公開映像ストリームを `-c:v copy` で remux し、`-an` で音声だけを外した。
  画素数・fps・フレーム数を変える再エンコードはしていない
- `+faststart`確認済み（`moov` offset 32 < `mdat` offset 931）
- metadata除去確認済み（`-map_metadata -1` / `-map_metadata:s:v -1` /
  `-map_chapters -1`）。元の`creation_time`と `Core Media`は残っていない
- AI生成・AI加工・顔補正・generative fill・outpainting・テロップ削除・短縮なし

公開派生の音声除去（再現用。既存の Baseline 公開映像を copy し、音声だけ外す）。
入力と出力を同じMP4にすると ffmpeg が拒否するため、隣の一時ファイルへ書いてから置き換える:

```
ffmpeg -i public/media/gallery/mily-b21-01-seaside-circle-musical-special-thanks.mp4 \
  -map 0:v:0 -an \
  -map_metadata -1 -map_metadata:s:v -1 -map_chapters -1 \
  -c:v copy \
  -movflags +faststart \
  public/media/gallery/mily-b21-01-seaside-circle-musical-special-thanks.tmp.mp4 \
&& mv public/media/gallery/mily-b21-01-seaside-circle-musical-special-thanks.tmp.mp4 \
  public/media/gallery/mily-b21-01-seaside-circle-musical-special-thanks.mp4
```

### poster / 共有範囲

- 公開MP4の0 / 4 / 8 / 12 / 16秒地点を比較。ほぼ静止したStoryのため差は小さく、
  8.0秒前後は3人が自然に見え、お礼と出演感謝の本文が読みやすいため採用
- 公開MP4の実フレームから生成。AI生成・顔加工・塗り足しなし
- 115,111 bytes / 720×1280 JPEG / sha256
  `fbf5cc8650932c617787f68053f02137f12586f4709492bd68fe6b021cc4b67b`
- EXIF / IPTC / XMP / ICCなし
- `src/data/seasideCircleMusicalSpecialThanksVideo.json` の1オブジェクトを
  Latest / NEWS + Gallery + STORY closing で共有し、公開MP4 1本・poster 1枚だけを参照する
- みりぃ個人のInstagram Storyとして分類していない
- InstagramプロフィールURLや番組Storyの推測permalinkを出典として代用していない
- 受け渡し用URL / file IDは公開情報へ残さない

poster生成コマンド（再現用）:

```
ffmpeg -ss 8.0 -i public/media/gallery/mily-b21-01-seaside-circle-musical-special-thanks.mp4 \
  -frames:v 1 -q:v 4 -map_metadata -1 \
  public/media/gallery/mily-b21-01-seaside-circle-musical-special-thanks-poster.jpg
```

## 素材台帳（batch b22 / 受領日・source date 2026-08-23）

2026-08-23のFM湘南マジックウェイブ公式X（@fm_smw856）に付いていた、
オーナー直接提供のスタジオ写真2枚。既存NEWS
`2026-08-23-seaside-circle-musical-special` と STORY
`/stories/2026-08-23-musical-special/` へ統合し、新しいNEWSは作っていない。
Gallery は放送前→放送後の順で連続掲載する。既存 b19 / b21 動画は削除せず、
NEWS 代表 media も b21 のまま維持する。Drive Gallery（b02）・
`events.ts`・`streamSchedule.ts`・radio weekly schedule には含めない。

| ID | 元ファイル | sha256（先頭12桁） | 内容 | 掲載 |
| --- | --- | --- | --- | --- |
| b22-01 | `mily-b22-01-seaside-circle-musical-special-before.jpg` | `3a0184e5ebe7` | ラジオスタジオでヘッドホンをつけた3人が並ぶ放送前ショット。2048×2048 | ✅ Gallery / STORY start |
| b22-02 | `mily-b22-02-seaside-circle-musical-special-after.jpg` | `0f0313399166` | ラジオスタジオでヘッドホンをつけた3人が並ぶ放送後ショット。2048×1536 | ✅ Gallery / STORY closing |

確認済み:

- provenance: `owner-provided`（オーナーが掲載用素材として直接提供。SNSから取得していない）
- 2枚とも元素材は `media/original/` に無改変で保管（gitignore済み・コミットしない）
- 元素材は JPEG。b22-01 は正方形 2048×2048、b22-02 は横位置 2048×1536
- 公開用は既存の `pnpm media:build` で再エンコードしてメタデータを除去した
- Gallery は各写真につき 480 / 960 / 1600 × JPG / WebP。元素材幅が2048pxのため
  `-1600` は 1600px 幅（アップスケールなし）
- STORY は Gallery の `-1600.jpg` を再利用し、用途別に複製していない
- 公開画像に EXIF / GPS / IPTC / XMP / ICC は残っていない
- トリミング・引き伸ばし・生成塗り足し・AI生成・顔加工・顔置換なし
- `sourceDate`: `2026-08-23`（公式X投稿日）。撮影者は未確認のため `credit: null`
- b22-01 は正方形のため `aspect: "1600 / 1600"`。b22-02 は 4/3 のため既定タイル
- 公開ファイル名は新規batch b22を使用し、既存batch・連番と衝突しない
- 受け渡し用URL / file IDは公開情報・tracked textとして記録しない

## 素材台帳（batch b23 / 受領日・source date 2026-08-24）

2026-08-24未明の本人Instagram Story動画。owner-providedの縦型動画で、
Latest / NEWS（id `2026-08-24-night-thanks-morning-stream`）と Gallery が
同じ公開MP4・poster・manifest objectを共有する。Fan Roomスクリーンショットは
本文・時刻の確認資料のみで、`public/` / Gallery / `media.ts` /
`galleryVideos.ts` / Drive Gallery / `/stories/` には含めない。
Drive Gallery（b02）・`events.ts`・`streamSchedule.ts`・radio weekly
schedule には含めない。新しい `/stories/` 記事は作っていない。

恒久的な公開permalinkがないため、Story側の表示は非リンクの
`Instagram Story` label。受け渡し用URL / file IDは公開情報・tracked text
として記録しない。

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b23-01 | `gallery/mily-b23-01-night-thanks-morning-stream-story.mp4` | 夜枠とラジオへの感謝、8月24日朝6:20〜6:50の配信予定を伝える縦型動画。720×1280。owner-provided | ✅ Latest / Gallery |
| b23-01 poster | `gallery/mily-b23-01-night-thanks-morning-stream-story-poster.jpg` | 公開MP4の4.0秒地点の実フレーム。720×1280 | ✅ Latest / Gallery |

### 元素材の実測

- provenance: `owner-provided`（オーナー指定の受け渡しファイル。SNSから取得していない）
- Instagram Story / source date: `2026-08-24` / 恒久permalinkなし
- 元素材は `media/original/mily-b23-01-night-thanks-morning-stream-story.mp4` に
  受領バイトを変えず保管（gitignore済み・コミットしない）
- sha256: `4ddbd6dbf609325f886f0b9968b0f6f498fd961c973d59425aa03a283e38895e`
- 500,715 bytes / H.264 **High** / **720×1280** / **1fps** /
  20 frames / **20.000000秒** / yuv420p / `has_b_frames` 2
- 音声: HE-AAC / 44.1kHz / stereo。元素材にはAAC音声ストリームがある
- chapterなし
- 公開派生ではmetadataを除去した。投稿時刻は推測して記録しない

### 音声の扱い — 削除した

元素材には HE-AAC / 44.1kHz / stereo の音声がある。再配信権を確認できないため、
公開派生は video-only（無音）にした。既存 b21 と同じ判断。

音声の内容・由来・種類・権利者・楽曲名は確認できていないため、推測して記録しない。
元素材そのものから音声は削除していない。

### 公開MP4

- sha256: `6084ca92ebb4743065324055dc5706637978566d1f0f9d7b48e0feaffa2578ae`
- 344,986 bytes / H.264 **High** / **720×1280** /
  **1fps** / 20 frames / 20.000000秒 / yuv420p / `has_b_frames` 2 /
  音声ストリームなし
- 元素材の画素数・縦横比・1fps・映像フレーム数を維持。
  crop・scale・引き伸ばし・アップスケール・fps水増し・短縮なし（`-vf scale`を使っていない）
- 既存の公開映像ストリームを `-c:v copy` で remux し、`-an` で音声だけを外した。
  画素数・fps・フレーム数を変える再エンコードはしていない
- `+faststart`確認済み（`moov` offset 36 < `mdat` offset 1102）
- metadata除去確認済み（`-map_metadata -1` / `-map_metadata:s:v -1` /
  `-map_chapters -1`）。元の`creation_time`と `Core Media`は残っていない
- AI生成・AI加工・顔補正・generative fill・outpainting・テロップ削除・短縮なし

エンコードコマンド（再現用）:

```
ffmpeg -i media/original/mily-b23-01-night-thanks-morning-stream-story.mp4 \
  -map 0:v:0 -c:v copy -an \
  -map_metadata -1 -map_metadata:s:v -1 -map_chapters -1 \
  -movflags +faststart \
  public/media/gallery/mily-b23-01-night-thanks-morning-stream-story.mp4
```

### poster / 共有範囲

- 公開MP4の0 / 4 / 8 / 12 / 16 / 19秒地点を比較。ほぼ静止したStoryのため差は小さく、
  本文とみりぃの配信画面が読める4.0秒地点を採用
- 公開MP4の実フレームから生成。AI生成・顔加工・塗り足しなし
- 93,615 bytes / 720×1280 JPEG / sha256
  `516e9a3e3b7541002e56d6c5c9fe2a6e7980df715ad01bb904d641fe4f53aa20`
- EXIF / IPTC / XMP / ICCなし
- `src/data/nightThanksMorningStreamStoryVideo.json` の1オブジェクトを
  Latest / NEWS + Gallery で共有し、公開MP4 1本・poster 1枚だけを参照する
- InstagramプロフィールURLやStoryの推測permalinkを出典として代用していない
- 受け渡し用URL / file IDは公開情報へ残さない

poster生成コマンド（再現用）:

```
ffmpeg -ss 4.0 -i public/media/gallery/mily-b23-01-night-thanks-morning-stream-story.mp4 \
  -frames:v 1 -q:v 4 -map_metadata -1 \
  public/media/gallery/mily-b23-01-night-thanks-morning-stream-story-poster.jpg
```

## 素材台帳（batch b24 / 受領日・source date 2026-08-24）

本人Xの2026-08-24朝メイク配信お礼投稿に添付された、オーナー直接提供の横長SHOWROOM公開配信画面と、
同じ朝の本人Instagram Story縦長ビジュアル。b24-01をNEWSの代表画像、b24-02を同じNEWSカードの
2枚目として自己ホストし、HOME Latestと`/news/`に掲載する。b24-01 は Gallery にも出す。
b24-02 と Gallery動画・Drive Gallery・`/stories/`・`highlights.ts`には追加しない。

b24-01はNEWSの代表画像としてHOME Latestと`/news/`に表示し、Portal Feedの代表画像にも使う。
NEWS が `activityIds: ["live-stream"]` を持つため、他のNEWS代表画像
（b17-01 / b14-01 / b13-01 など）と同じく `selectActivityMedia()` 経由で
`/activities/live/` の「関連するメディア」にも自動で出る。これはこのbatch固有の例外では
なく、NEWS代表画像の標準動作である。

b24-02はStory閲覧スクリーンショットのためデフォルトは非掲載だが、オーナーが当該素材と
HOME Latest / `/news/` の掲載面、無加工構図を明示承認した。`/stories/` 記事は必須とせず、
この2面だけの限定承認として扱う。承認は別素材・Gallery・`/stories/`へ流用しない。

一次出典（SHOWROOM画面）: https://x.com/mily_chan36/status/2091668215919444138
Story側の恒久permalinkは確認できていない。Instagramプロフィールは出典ではなく関連リンク。

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b24-01 | `news/mily-b24-01-morning-makeup-showroom.jpg` | 花火大会仕様のSHOWROOM公開配信画面。中央にみりぃが両手を振っている横長画像。1500×691。owner-provided | ✅ NEWS代表画像。HOME Latest / `/news/` / Portal Feed / Gallery。`activityIds` 経由で `/activities/live/` の関連メディアにも出る。NEWS JPEG は上書きしない。`/stories/`・highlights には追加しない |
| b24-02 | `news/mily-b24-02-morning-makeup-instagram-story.jpg` | 本人Instagram Storyの縦長ビジュアル。「初メイク配信」の本文とSHOWROOM画面3枚。1500×2667。owner-provided | ✅ HOME Latest / `/news/` の同じNEWSカードの2枚目。当該素材・当該掲載面のオーナー承認。Gallery・`/stories/` には追加しない |

### b24-01 SHOWROOM画面

- provenance: `owner-provided`（オーナーが依頼時に直接提供。SNSから自動取得していない）
- source date: `2026-08-24` / 一次出典は上記本人X投稿
- 元素材は `media/original/mily-b24-01-morning-makeup-showroom.jpg`
  （gitignore済み・受領バイトを変えず保管・コミットしない）
- 元素材の実測: **268,250 bytes / JPEG / 1500×691 / sha256
  `fc5df1efce0007b642876855b9fb1699acad14d03115dc5b28d470410ec407a1`**
- 元素材にはEXIF（138 bytes）とIPTC（54 bytes）が存在。公開前にsharpで
  JPEG再エンコードし、metadataを除去した
- 公開ファイルの実測: **381,783 bytes / JPEG progressive / 1500×691 / 4:4:4 / sha256
  `f6b9841b1194ccca157f78139ef49c3b0fda1e12501f06dd679231a8f07b27ca`**
- 公開ファイルはEXIF / IPTC / XMP / ICCなし
- 公開用のmetadata除去以外は無改変。再エンコードはsharpのJPEG quality 95 /
  progressive / 4:4:4のみで、**crop・mask・scale・rotate・アップスケール・縦横比変更なし**。
  元画像の見た目と1500:691の横構図を維持した
- AI生成・AI補正・顔加工・人物削除・generative fill・outpaintingなし
- プライバシー・第三者表示の確認: DM・非公開メッセージ・電話番号・メール・住所・
  端末固有情報は含まれない。画面下部の視聴者アバター・表示名は、みりぃ本人がX投稿に
  添付して公開したSHOWROOM画面の表示内容であり、オーナーの掲載指示に基づき無改変で記録する。
  新しい第三者情報は付加していない
- 画面上部の「おはよ!6:50まで!」は公開画面の表示として画像に残すが、NEWS本文へは転記していない
- Xの外部画像URLはhotlinkせず、自己ホスト画像だけを参照する
- `src/data/morningMakeupShowroomImage.ts` の1オブジェクトを NEWS の代表画像として参照する
- 掲載面: HOME Latest / `/news/` / Portal Feed の代表画像。NEWS の
  `activityIds: ["live-stream"]` により `/activities/live/` の「関連するメディア」にも
  自動で出る（`selectActivityMedia()` の標準動作。個別のフィルタは入れていない）
- Gallery は既存 NEWS JPEG（1500×691）から `pnpm media:build` した派生。ツイート orig
  （1206×555）は同じショットの別解像度のため再インポートしない
- `src/data/galleryVideos.ts`・`src/data/stories.ts`・
  `src/data/highlights.ts`には追加していない

### b24-02 Instagram Story（HOME Latest / NEWS専用）

- provenance: `owner-provided`（オーナーが当該画像のHOME Latest / `/news/` 掲載を明示承認。SNSから自動取得していない）
- source date: `2026-08-24` / 恒久permalinkなし。Instagramプロフィールは出典ではない
- 元素材は `media/original/mily-b24-02-morning-makeup-instagram-story.jpg`
  （gitignore済み・受領バイトを変えず保管・コミットしない）
- 元素材の実測: **545,168 bytes / JPEG / 1500×2667 / sha256
  `81666f343b37dae7696079c0b278496411c1943114a2c81da2d459261161d5fa`**
- 元素材にはEXIF（138 bytes）とIPTC（54 bytes）が存在。公開前にsharpで
  JPEG再エンコードし、metadataを除去した
- 公開ファイルの実測: **757,164 bytes / JPEG progressive / 1500×2667 / 4:4:4 / sha256
  `9951d602cc4028c252fea7c26339481618cfdddeb35c469a050918001d78d4c7`**
- 公開ファイルはEXIF / IPTC / XMP / ICCなし
- 公開用のmetadata除去以外は無改変。再エンコードはsharpのJPEG quality 95 /
  progressive / 4:4:4のみで、**crop・mask・scale・rotate・アップスケール・縦横比変更なし**。
  元画像の見た目と1500:2667の縦構図を維持した
- AI生成・AI補正・顔加工・人物削除・generative fill・outpaintingなし
- Story内に埋め込まれたSHOWROOM画面の視聴者アバター・表示名・コメントは元構図のまま残る。
  オーナーが当該素材を無加工でHOME Latest / `/news/`へ掲載することを明示承認しており、
  本文・caption・altへ第三者情報を転記せず、新しい第三者情報も付加しない
- 画面内の時刻表示は画像の表示として残すが、NEWS本文へは転記していない
- `src/data/morningMakeupInstagramStoryImage.ts` をNEWSの `additionalMedia` から参照し、
  b24-01の後に同じカードの2枚目として表示する
- `sourceUrl` は持たない。推測したStory URLやDrive受け渡しURLを公開データへ残さない
- `src/data/media.ts`・`src/data/galleryVideos.ts`・`src/data/stories.ts`・
  `src/data/highlights.ts`には追加していない
- InstagramプロフィールURLはNEWSの関連リンクとして
  `https://www.instagram.com/mily_chan36` だけを使っている


## 素材台帳（batch b25 / 受領日・source date 2026-08-24）

2026-08-24の湘南シーサイドサークル公式Instagram（@seasidecircle）
「Yes!東京」踊ってみた動画。owner-providedの縦型動画で、Latest / NEWS
（id `2026-08-24-seasidecircle-yes-tokyo`）と Gallery が同じ公開MP4・poster・
manifest objectを共有する。新しい `/stories/` 記事は作っていない。
Drive Gallery（b02）・`events.ts`・`streamSchedule.ts`・radio weekly
schedule・`profile.ts`・`links.ts` には含めない。

恒久的な公開permalinkが未確認のため、表示は非リンクの
`湘南シーサイドサークル Instagram` label。推測URLは作らない。
InstagramプロフィールURLは関連リンクであり、投稿permalinkの代用ではない。
受け渡し用URL / file IDは公開情報・tracked textとして記録しない。

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b25-01 | `gallery/mily-b25-01-seasidecircle-yes-tokyo.mp4` | ラジオスタジオで両手を挙げて踊る、みりぃの縦型動画。720×1280。owner-provided | ✅ Latest / NEWS + Gallery |
| b25-01 poster | `gallery/mily-b25-01-seasidecircle-yes-tokyo-poster.jpg` | 公開MP4の8.0秒地点の実フレーム。720×1280 | ✅ Latest / NEWS + Gallery |

### 元素材の実測

- provenance: `owner-provided`（オーナー指定の受け渡しファイル。SNSから取得していない）
- source account: 湘南シーサイドサークル @seasidecircle
- source date: `2026-08-24` / 恒久permalink未確認
- 元素材は `media/original/mily-b25-01-seasidecircle-yes-tokyo.mp4` に
  受領バイトを変えず保管（gitignore済み・コミットしない）
- sha256: `7badb86e34988df04d96486b14f4283309f08fd4bb847197dad3ebeb196dfe27`
- 37,468,526 bytes / H.264 **High** / **720×1280** / **30fps** /
  855 frames / **28.500000秒** / yuv420p
- 依頼時の参考実測（512×910 / 17,433,587 bytes /
  sha256 `cbc76d55d6dfd5da…`）とは解像度・サイズ・ハッシュが異なる。
  同一ファイルとは推測せず、今回使用した原本
  `media/original/mily-b25-01-seasidecircle-yes-tokyo.mp4` を
  ffprobe で再確認した値を記録する。公開派生もこの720×1280原本を基準にしており、
  512×910へ合わせて再エンコード・ダウンスケールしていない
- 音声: HE-AAC / 44.1kHz / stereo。元素材には音声ストリームがある
- chapterなし
- 公開派生ではmetadataを除去した。MP4内の `creation_time` は投稿日確認に使っていない

### 音声の扱い — 削除した

元素材には HE-AAC / 44.1kHz / stereo の音声がある。再配信権を確認できないため、
公開派生は video-only（無音）にした。踊ってみた動画の音源権利は、番組アカウント投稿である
ことだけでは再配信許可にならない。

音声の内容・由来・種類・権利者・楽曲名は確認できていないため、推測して記録しない。
元素材そのものから音声は削除していない。

### 公開MP4

- sha256: `8ebc63ccaae09efe3e7d33a7112fa31c005a25128693a932f220c0a9fd03b6ca`
- 8,557,057 bytes / H.264 **Constrained Baseline** / **720×1280** /
  **30fps** / 855 frames / 28.500000秒 / yuv420p / `has_b_frames` 0 /
  音声ストリームなし
- 元素材の画素数・縦横比・30fps・映像フレーム数を維持。
  crop・scale・引き伸ばし・アップスケール・fps水増し・短縮なし（`-vf scale`を使っていない）
- `+faststart`確認済み（`moov` offset 32 < `mdat` offset 4409）
- metadata除去確認済み（`-map_metadata -1` / `-map_metadata:s:v -1` /
  `-map_chapters -1`）。元の`creation_time`と `Core Media`は残っていない
- AI生成・AI加工・顔補正・generative fill・outpainting・テロップ削除・短縮なし

エンコードコマンド（再現用）:

```
ffmpeg -i media/original/mily-b25-01-seasidecircle-yes-tokyo.mp4 \
  -map 0:v:0 -an \
  -map_metadata -1 -map_metadata:s:v -1 -map_chapters -1 \
  -c:v libx264 -profile:v baseline -level 3.1 -crf 23 -preset slow \
  -pix_fmt yuv420p \
  -movflags +faststart \
  public/media/gallery/mily-b25-01-seasidecircle-yes-tokyo.mp4
```

### poster / 共有範囲

- 公開MP4の0 / 4 / 8 / 12 / 16 / 20 / 24 / 27秒地点を比較。8.0秒前後は
  両手を挙げたダンスの動きがはっきり見え、極端なブレが少ないため採用
- 公開MP4の実フレームから生成。AI生成・顔加工・塗り足しなし
- 88,577 bytes / 720×1280 JPEG / sha256
  `afeb34bb44910c71d2c39cd086218f972cc917863f3446f00a1adc625141e1e6`
- EXIF / IPTC / XMP / ICCなし
- `src/data/seasideCircleYesTokyoVideo.json` の1オブジェクトを
  Latest / NEWS + Gallery で共有し、公開MP4 1本・poster 1枚だけを参照する
- みりぃ個人のInstagram投稿として分類していない
- InstagramプロフィールURLや投稿の推測permalinkを出典として代用していない
- 受け渡し用URL / file IDは公開情報へ残さない

poster生成コマンド（再現用）:

```
ffmpeg -ss 8.0 -i public/media/gallery/mily-b25-01-seasidecircle-yes-tokyo.mp4 \
  -frames:v 1 -q:v 4 -map_metadata -1 \
  public/media/gallery/mily-b25-01-seasidecircle-yes-tokyo-poster.jpg
```

## 素材台帳（batch b26 / 受領日 2026-08-26）

CAMPUS GIRLS 2027 予選A Final STAGEのPaton案内NEWS専用の画像2枚。
同じNEWS（`2026-08-24-campus-girls-final-stage-guide`）で、b26-01を代表画像、
b26-02をPaton出場者ページの文脈が分かる2枚目として表示する。
Gallery・`/stories/`・`media.ts`・`galleryVideos.ts`・highlightsには追加しない。

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b26-01 | `news/mily-b26-01-campus-girls-paton-portrait.jpg` | 青・黄・白の花束を持ち、カメラを見るみりぃの正方形写真。1090×1090。owner-provided | ✅ NEWS代表画像 / Portal Feed |
| b26-02 | `news/mily-b26-02-campus-girls-paton-page.jpg` | Patonの三橋莉子（みりぃ）出場者ページ。写真・名前・プロフィール表示を含む縦長画像。928×1280。owner-provided | ✅ 同じNEWSカードの2枚目 |

確認済み:

- provenance: `owner-provided`（オーナーが依頼時に2枚を直接提供し、当該NEWSへの掲載を明示承認。SNSから取得していない）
- 出典ページ: `https://paton.jp/event/entrant/11380`。撮影日・撮影者・写真の投稿日は未確認のため推測しない
- b26-01原本: 169,620 bytes / JPEG / 1090×1090 / sha256
  `f4de1375ec64a14ee588f6c318db7f29595b9a05828b8b44b1e918d215293e68`
- b26-02原本: 161,230 bytes / JPEG / 928×1280 / sha256
  `cea4996ed01d7f9a8ee8f4b75aa0748f990c0234bb0fcaced4ee08ec24cfc8f5`
- 元素材は `media/original/mily-b26-01-campus-girls-paton-portrait.jpg` と
  `media/original/mily-b26-02-campus-girls-paton-page.jpg` に受領バイトを変えず保管
  （gitignore済み・コミットしない）
- 両原本にEXIF / IPTCがあり、b26-01にはICCもあったため、公開用はsharpの
  JPEG quality 95 / progressive / 4:4:4で再エンコードし、metadataを除去した
- b26-01公開派生: 252,786 bytes / 1090×1090 / sha256
  `41c126c6ed3c9813f980f3412235a74c72f83d1fba2ebb14e290180eac8820d9`
- b26-02公開派生: 227,538 bytes / 928×1280 / sha256
  `07347b7e45576de3da564178c5f97cbd98f36e2021f2cf9673b8bc85559af4cd`
- 公開派生はEXIF / GPS / IPTC / XMP / ICCなし。metadata除去以外は
  crop・mask・scale・rotate・アップスケール・縦横比変更なし
- AI生成・AI補正・顔加工・人物削除・generative fill・outpaintingなし
- b26-02にDM・通知・閲覧者名・コメント・端末情報は見当たらない。ページ上の
  Patonロゴ、写真、番号、SNSボタン、本人の名前・プロフィールだけを元構図のまま掲載する
- b26-01とb26-02は同じ写真を含むが、前者は人物が主役の代表写真、後者は投票先の
  ページ文脈を示す記録画像として役割を分け、無意味な複製としては扱わない

## 素材台帳（batch b27 / 受領日・source date 2026-08-26）

2026-08-26 の本人Instagram Story。owner-provided。公開派生は既存コミット済みで、
この掲載作業では再エンコード・リネーム・差し替えをしていない。
Driveの受け渡しURL / file IDは公開情報・tracked textへ残さない。

Story閲覧スクリーンショット（IMG_7435 / IMG_7437）は確認用で、掲載しない。
`public/` / Gallery / `media.ts` / `galleryVideos.ts` / `/stories/` / highlights
には含めない。返信コメントはNEWS `message` へ本文として残す。

b27-05（Patonアプリの投票操作録画）は非掲載。他出場者・順位表示と、
オーナー（あっきー）のサポーター名が見えるため。

2026-08-27 の本人X「キャンガル2027 パトン投票方法」
（`https://x.com/mily_chan36/status/2092793734232748228`）も自己ホストしない。
X / Instagram 動画の自動ダウンロード禁止に加え、画面内に他出場者・順位・
オーナーサポーター名が映る。サイトではX投稿へのoutboundと確認済み手順の
テキストで案内する。NEWS代表画像は既存b26-01人物写真（NEWS掲載面のみ。
HOME / Support の導線カードへは流用しない）。新しいメディアバッチは作っていない。

投票CTA（`Patonでみりぃに投票する`）は既存NEWS
`2026-08-24-campus-girls-final-stage-guide` に残し、このbatchのNEWSへは付けない。
`events.ts` / `streamSchedule.ts` / highlights / 新しい `/stories/`
記事は追加していない。b27-06 / b27-07 の静止画だけ `media.ts` の Gallery
photo set へ追加する。b27-01 / b27-02 の動画はこれまでどおり
`galleryVideos.ts`。b27-03 / b27-04 は NEWS 専用のまま Gallery に載せない。

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b27-01 | `gallery/mily-b27-01-paton-vote-collage.mp4` | クマ耳フィルターの4枚コラージュ。予選ファイナルの毎日投票案内。720×1280 / 20.000秒。owner-provided | ✅ Latest / NEWS（同じカードの動画）+ Gallery。`patonVoteCollageStoryVideo.json` を共有 |
| b27-01 poster | `gallery/mily-b27-01-paton-vote-collage-poster.jpg` | 公開MP4の実フレーム。720×1280 | ✅ Latest / Gallery |
| b27-02 | `gallery/mily-b27-02-paton-vote-mirror.mp4` | 鏡自撮りと「18:00〜投票できるようになるぞ〜」案内。720×1280 / 5.000秒。owner-provided | ✅ Latest / NEWS（同じカードの動画）+ Gallery。`patonVoteMirrorStoryVideo.json` を共有 |
| b27-02 poster | `gallery/mily-b27-02-paton-vote-mirror-poster.jpg` | 公開MP4の実フレーム。720×1280 | ✅ Latest / Gallery |
| b27-03 | `news/mily-b27-03-morning-stream-thanks.jpg` | 配信への感謝を書いた白い縦長グラフィック。元素材相当 3870×6879。表示は 480 / 960 / 1600 の jpg+webp 派生。owner-provided | ✅ HOME Latest / `/news/` のみ。Gallery・`media.ts`・`galleryVideos.ts`・`/stories/` には追加しない |
| b27-04 | `news/mily-b27-04-instagram-followers-400.mp4` | フォロワー400人への感謝。720×1280 / 5.000秒。owner-provided | ✅ HOME Latest / `/news/` のみ。Gallery・`media.ts`・`galleryVideos.ts`・`/stories/` には追加しない |
| b27-04 poster | `news/mily-b27-04-instagram-followers-400-poster.jpg` | 公開MP4の実フレーム。720×1280 | ✅ NEWS専用 |
| b27-06 | `gallery/mily-b27-06-paton-vote-collage-still-{480,960,1600}.{jpg,webp}` | b27-01 の 2.0秒地点の実フレーム。720×1280。owner-provided。`pnpm media:build` の jpg q82 / webp q78、withoutEnlargement のため 960 と 1600 は同バイト | ✅ Gallery photo（`media.ts`）+ Latest / NEWS（投票カードの2枚目）。動画ファイルは複製していない |
| b27-07 | `gallery/mily-b27-07-paton-vote-mirror-still-{480,960,1600}.{jpg,webp}` | b27-02 の 1.0秒地点の実フレーム。720×1280。owner-provided。960 と 1600 は同バイト | ✅ Gallery photo（`media.ts`）+ Latest / NEWS代表。動画ファイルは複製していない |
| （非掲載） | IMG_7435 / IMG_7437 Story閲覧スクリーンショット | 返信コメント確認用 | 非掲載。本文はNEWS messageへ |
| （非掲載） | b27-05 Patonアプリ操作録画 | 他出場者・順位・オーナーサポーター名 | 非掲載 |

### 公開ファイルの実測

- provenance: `owner-provided`（オーナー指定の受け渡しファイル。SNSから取得していない）
- Instagram Story / source date: `2026-08-26` / 恒久permalinkなし。`sourceUrl` は持たない
- 元素材は `media/original/` に受領バイトを変えず保管（gitignore済み・コミットしない）
- 公開派生はEXIF / GPS / IPTC / XMP / ICCなし
- AI生成・AI加工・顔補正・generative fill・outpainting・テロップ削除なし
- 受け渡し用URL / file IDは公開情報へ残さない

b27-01 公開MP4: 857,124 bytes / H.264 Constrained Baseline / 720×1280 / 30fps /
600 frames / 20.000000秒 / yuv420p / `has_b_frames` 0 / 音声ストリームなし /
sha256 `2a7bacbb3efa14cc5c6d56caea9afa2bfb64753125dae8bcf132721824751109`

b27-01 poster: 96,436 bytes / 720×1280 JPEG / sha256
`c3fde8d9419c52330e6d3dfdaac4035c9f8ee78b66d13698a7488ee08c30f5eb`

b27-02 公開MP4: 178,367 bytes / H.264 Constrained Baseline / 720×1280 / 30fps /
150 frames / 5.000000秒 / yuv420p / `has_b_frames` 0 / 音声ストリームなし /
sha256 `484f06618bd30535ffdd6ca5e7c429446cce4374efd4da6899b0dd93a04997bc`

b27-02 poster: 49,122 bytes / 720×1280 JPEG / sha256
`c861d6487ee07a19390cf50bf0a1db316ddf05fdb81d8c79b2b049b8b665a740`

b27-03 公開JPEG: 872,631 bytes / 3870×6879 / progressive / 4:4:4 / sha256
`884428f7b233b753b216501097c56ce533f45aa713e49cf04536e042ba17d059`

b27-03 表示派生は Gallery と同じ `jpg q82 mozjpeg` + `webp q78`。NEWS カードの
`src` は `-1600.jpg`。元素材相当の公開JPEGは残し、上書きしない。

- 480.jpg 20,741 bytes / 480×853 / sha256
  `618954c90b839ca562d7b07397f2a88edb7e00a0006e3e2ced0d143377b4c6df`
- 480.webp 15,404 bytes / sha256
  `02cb8d80a48d93d8a94ed589753bca5d21a5213b5308a23a4289eb2620723d1b`
- 960.jpg 51,086 bytes / 960×1706 / sha256
  `158bd5ac83b72497d35c984ca44ca2fbba7ed92f250ef7d7026833a9116e7838`
- 960.webp 33,950 bytes / sha256
  `4cc66b0d8f2169f80c93c869aef12cf400e5443c31b32c1e500c55ee83eb84f8`
- 1600.jpg 93,716 bytes / 1600×2844 / sha256
  `cdb1f169f298688e628659878bcc6d2f757d47b6b972e11ffa5d0e967b56a90e`
- 1600.webp 55,096 bytes / sha256
  `df38a10e0ae92576f8e1168ae2ac305fe705850b95077dfbebec6250bf3c7952`

b27-04 公開MP4: 131,735 bytes / H.264 Constrained Baseline / 720×1280 / 30fps /
150 frames / 5.000000秒 / yuv420p / `has_b_frames` 0 / 音声ストリームなし /
sha256 `f8093200f0705ad347b3bbb768b8fe95d9d7c84e5b568c9b68c394dd1d123082`

b27-04 poster: 77,106 bytes / 720×1280 JPEG / sha256
`ff1b5d2f45863d08cf1ad1bdfe81f0d807dc3e37ee8aa8f8df94010eabecd4a8`

b27-06 は b27-01 公開MP4の 2.0秒地点の実フレーム。`pnpm media:build` の
jpg q82 mozjpeg + webp q78。元素材 720×1280 のため withoutEnlargement で
960 と 1600 は同バイト。元素材は `media/original/`（gitignore・コミットしない）。

- 480.jpg 56,897 bytes / 480×853 / sha256
  `478594610776b628a6eee4f1517c2c43a3a2fb6c25f92c092e709c2157b144c8`
- 480.webp 39,212 bytes / sha256
  `0e19ed008af2bf5c489be03d05e586eb83a27613eafa6dcd1cbfa3e336e8546d`
- 960.jpg 102,630 bytes / 720×1280 / sha256
  `cff520e6afa06c3aeb97edbdf07dbe12011e16f27faf071b299c7298f1855b00`
- 960.webp 64,956 bytes / sha256
  `4ed0e213b9ee91f90302949b2054806b7e94098dd2207a00cf55391a1cfb1a45`
- 1600.jpg / 1600.webp は 960 と同じバイト

b27-07 は b27-02 公開MP4の 1.0秒地点の実フレーム。同じ media:build 設定。

- 480.jpg 31,518 bytes / 480×853 / sha256
  `4dcf3f04deeeae5319d1930e6803dab82b877eb35f33e387a38c3f772258c606`
- 480.webp 18,166 bytes / sha256
  `0692f7335c76b13b54e7fcd4c8a7c4cb7208348118f69ec17034839ad3562fbb`
- 960.jpg 54,138 bytes / 720×1280 / sha256
  `2581df60447825cb9cb7f016957e7020cec79f8abb5f90e7f9006623ea239795`
- 960.webp 28,522 bytes / sha256
  `c1de6832846477c7c1a6b0e01ffa52d0dd8a16419fe64eb1ccbef7bac0742301`
- 1600.jpg / 1600.webp は 960 と同じバイト

Gallery 写真は新しい順で b27-07（鏡）→ b27-06（コラージュ）のあと既存写真。
b28-01 追加後は b28-01 が先頭で、そのあとに b27-07 → b27-06。
Gallery 動画は新しい順で b27-02（鏡）→ b27-01（コラージュ）のあと既存動画。
Latest の投票カードは鏡静止画を代表にし、コラージュ静止画・鏡動画・コラージュ動画を同じカードへ続ける。
b27-03 / b27-04 は `galleryVideos.ts` にも `media.ts` にも載せない。

## 素材台帳（batch b28 / 受領日・source date 2026-08-26）

2026-08-26 23:34 JST の本人X投稿。公開permalinkあり。Story閲覧スクリーンショットではない。
`sns-post`。Driveの受け渡しURL / file IDは公開情報・tracked textへ残さない。
この掲載作業では再エンコード・リネーム・差し替えをしていない。

ガルアワ＝Rakuten GirlsAward。掲載対象はミスサー／フレキャン出場者限定の
SHOWROOMイベント「【フレ/ミス枠】Rakuten GirlsAward 2026 A/W ランウェイ出演」
（2026-08-20〜2026-08-26）。本選のミスサークルコンテスト本体でも
CAMPUS GIRLS Patonでもない。1位の賞品は Rakuten GirlsAward 2026 A/W
オープニングアクトのランウェイ出演（幕張メッセ、2026-09-26）。
みりぃは6位で終えたためランウェイ出演にはなっていない。
`https://girls-award.com` は背景事実のみで、NEWS CTA にはしない。
`/stories/` 記事と highlights には追加しない。

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b28-01 NEWS | `news/mily-b28-01-girlsaward-showroom-6th.jpg` | くま耳キラキラフィルターの自撮り。黄白ストライプのリボン／シュシュと紺（ネイビー）のポロ。6位お礼の文字重ね。1156×2048。sns-post | ✅ HOME Latest / `/news/` / Activities の `src` fallback。表示は Gallery の 480/960/1600 srcset。NEWS JPEG は上書きしない |
| b28-01 Gallery | `gallery/mily-b28-01-girlsaward-showroom-6th-{480,960,1600}.{jpg,webp}` | 同じ写真の `pnpm media:build` 派生。元素材 1156×2048 のため withoutEnlargement で 1600 は拡大しない | ✅ Gallery photo（`media.ts`）。NEWS JPEG のバイトは複製していない |

出典: `https://x.com/Mily_chan36/status/2092621770406896106`
SHOWROOMイベント: `https://www.showroom-live.com/event/girlsaward2026aw_fm`
本人SHOWROOM: `https://www.showroom-live.com/r/circle2026_0734`

### 公開ファイルの実測

- provenance: `sns-post`（確認済みの本人X投稿。sourceUrl 必須）
- source date: `2026-08-26`（snowflake + fxtwitter created_at Wed Aug 26 14:34:43 +0000 2026）
- credit: 未確認のため `null`
- 公開派生はEXIF / GPS / IPTC / XMP / ICCなし
- AI生成・AI加工・顔補正・generative fill・outpainting・テロップ削除なし
- 受け渡し用URL / file IDは公開情報へ残さない

b28-01 NEWS JPEG: 397,362 bytes / 1156×2048 / sha256
`f5bb01a9dc8c9384fd8d9e7c40fb769b5bf6f8bc48e74b1a7612ae2a07f9cd26`

NEWS カードの表示は既存 Gallery 派生を `srcSet` / `webpSrcSet` で使い、
NEWS JPEG は fallback `src` のまま残す（上書き・再エンコードしない）。

Gallery 派生（jpg q82 mozjpeg + webp q78。withoutEnlargement）。

- 480.jpg 61,286 bytes / 480×850 / sha256
  `40ca278f866bda2964df8c48a5188d5ebb02ec537cab931091bb6b0aba4403d7`
- 480.webp 42,614 bytes / sha256
  `48d9dd09db8aa4aedf573e923ab569873cbbbbb401246de01feb4d5251250d8c`
- 960.jpg 161,064 bytes / 960×1701 / sha256
  `acda33e4f404e6c0b903c547dfe9d94092fe3c329c923f4ff0e535324b45e4bb`
- 960.webp 96,062 bytes / sha256
  `ae86e064ba8f2bdf22265eb1d896c295549637c3efe363ae410d1e72da39c491`
- 1600.jpg 210,796 bytes / 1156×2048 / sha256
  `91bc5744b607206a30c4fc7326297c8be9a3401399842e5d5904b99e63ff8504`
- 1600.webp 120,780 bytes / sha256
  `2c32f0e3fa6623dc2b315dd33d87ba2395a58ff4a00621d8cfd15cdce874a1e9`

Gallery 写真は新しい順で b28-01 → b27-07（鏡）→ b27-06（コラージュ）のあと既存写真。
b29-01 追加後は b29-01 が先頭で、そのあとに b28-01 → b27-07 → b27-06。
Latest の先頭は 6位お礼X投稿。投票案内Storyカードは同じ日の次点。

## 素材台帳（batch b29 / 受領日・source date 2026-08-02）

2026-08-02 07:20:06 JST の本人X投稿（created_at Sat Aug 01 22:20:06 UTC 2026）。
公開permalinkあり。Story閲覧スクリーンショットではない。実写の室内セルフィー。
`sns-post`。Driveの受け渡しURL / file IDは公開情報・tracked textへ残さない。
この掲載作業では元素材の再エンコード・リネーム・差し替えをしていない。

既存 NEWS `2026-08-02-21st-birthday` へ代表画像として添付する。新しい誕生日NEWSは作らない。
NEWS の一次出典と CTA は従来どおり Instagram
（https://www.instagram.com/p/DbiY3PHk1c8/）。写真の provenance / sourceUrl は
当該X投稿。X permalink は additionalSources として同じカードへ出す。

b01（花束・ケーキ・ネックレス）、b05（落ち葉）、b06（ウインク）、b08（鏡セルフィー）とは
別カット。同一sha256の公開ファイルは無い。

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b29-01 NEWS | `news/mily-b29-01-birthday-indoor-selfie.jpg` | クローゼットの前で、ピンストライプのノースリーブを着て横を向き微笑む室内セルフィー。1536×2048。sns-post | ✅ 既存 21歳誕生日 NEWS の `src` fallback。表示は Gallery の 480/960/1600 srcset。NEWS JPEG は上書きしない |
| b29-01 Gallery | `gallery/mily-b29-01-birthday-indoor-selfie-{480,960,1600}.{jpg,webp}` | 同じ写真の `pnpm media:build` 派生。元素材 1536×2048 のため withoutEnlargement で 1600 は拡大しない | ✅ Gallery photo（`media.ts`）。NEWS JPEG のバイトは複製していない |

出典: `https://x.com/Mily_chan36/status/2083679191892115846`
NEWS 一次出典（維持）: `https://www.instagram.com/p/DbiY3PHk1c8/`

### 公開ファイルの実測

- provenance: `sns-post`（確認済みの本人X投稿。sourceUrl 必須）
- source date: `2026-08-02`（snowflake + fxtwitter created_at Sat Aug 01 22:20:06 +0000 2026）
- credit: 未確認のため `null`
- 公開派生はEXIF / GPS / IPTC / XMP / ICCなし
- AI生成・AI加工・顔補正・generative fill・outpainting・テロップ削除なし
- 受け渡し用URL / file IDは公開情報へ残さない
- Hero の featured（b01-03）は動かさない
- `/stories/` 記事と highlights には追加しない

b29-01 NEWS JPEG: 321,357 bytes / 1536×2048 / sha256
`5b887b86187288035de8843eb83770b853d8b0e3578162389e071f8382563632`

NEWS カードの表示は既存 Gallery 派生を `srcSet` / `webpSrcSet` で使い、
NEWS JPEG は fallback `src` のまま残す（上書き・再エンコードしない）。

Gallery 派生（jpg q82 mozjpeg + webp q78。withoutEnlargement）。

- 480.jpg 25,951 bytes / 480×640 / sha256
  `d61ba3f34962289389a9b049500963f73c4c28a64644fe86f3d478489aafaf5a`
- 480.webp 14,844 bytes / sha256
  `50a1e611b77793d8af21f479e99313009cb4c92f0d6fffb5f56577c64037f351`
- 960.jpg 88,400 bytes / 960×1280 / sha256
  `e5fc835a7600303bef4eeb66fbb35e92c2d92bd47bcc91040db177b74f342a49`
- 960.webp 54,852 bytes / sha256
  `97ac532135e309a3d9bf87cebfd87811a10f12b5595bb90943279fbcc17399e3`
- 1600.jpg 274,517 bytes / 1536×2048 / sha256
  `f762ee2471258f5ae1ef7fc4bbcffeadde8063f86beff0081a653afa15d01b3e`
- 1600.webp 139,944 bytes / sha256
  `5fb4fe7ed3857bcc16b5aa09ef54b454410f1ecb290b098a18b68b5c9614aebb`

Gallery 写真は新しい順で b32-01 → b31-01 → b30-01 → b29-01 → b28-01 → b27-07（鏡）→ b27-06（コラージュ）→ b24-01 のあと既存写真。
NEWS 件数は 40。誕生日カードはテキストだけにしない。

## 素材台帳（batch b30 / 受領日・source date 2026-08-06）

2026-08-06 06:32:32 JST の本人X投稿（created_at Wed Aug 05 21:32:32 UTC 2026）。
公開permalinkあり。白いポロシャツでピース、星ステッカーと「OHAYO」。
`sns-post`。b06 ウインク自撮り・b08 鏡とは別カット。

新しい NEWS `2026-08-06-ohayo-morning-stream`。Gallery にも出す。
配信時刻は投稿の案内として本文に残し、`events.ts` / `streamSchedule.ts` には転記しない。

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b30-01 NEWS | `news/mily-b30-01-ohayo-white-polo-peace.jpg` | 白いポロ・ピース・星ステッカー・OHAYO。1153×2048。sns-post | ✅ 新NEWS の fallback `src` |
| b30-01 Gallery | `gallery/mily-b30-01-ohayo-white-polo-peace-{480,960,1600}.{jpg,webp}` | 同じ写真の `pnpm media:build` 派生。元素材 1153×2048 | ✅ Gallery photo |

出典: `https://x.com/Mily_chan36/status/2085116769161896098`

NEWS JPEG: 190,333 bytes / 1153×2048 / sha256
`0c4c65eaeba1b9557ab55899220847065a381f0c7ce2824f64b9e8076d934a95`
（元素材と同一バイト。EXIF / ICC なし）

Gallery 派生（jpg q82 mozjpeg + webp q78。withoutEnlargement）。

- 480.jpg 43,217 bytes / 480×853 / sha256
  `fc90fc930c7973bfd96907a2fb0d179bd965c422096cc8ea6ef3b662ce447e93`
- 960.jpg 117,580 bytes / 960×1705 / sha256
  `b86ed081e57332aef197f9e1e16e49d384bd3ca65ae31acc6aca76a7692872fc`

## 素材台帳（batch b31 / 受領日・source date 2026-08-05）

2026-08-05 06:24:52 JST の本人X投稿（created_at Tue Aug 04 21:24:52 UTC 2026）。
公開permalinkあり。パンダ耳・鼻フィルター、グリッター、「おはよう」「※過去pic」。
投稿時点の新撮ではないことを本文と caption に残す。`sns-post`。b06 とは別カット。

新しい NEWS `2026-08-05-panda-past-pic`。Gallery にも出す。
配信枠は投稿の案内として本文に残し、`events.ts` / `streamSchedule.ts` には転記しない。

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b31-01 NEWS | `news/mily-b31-01-panda-past-pic.jpg` | パンダ耳過去pic。1153×2048。sns-post | ✅ 新NEWS の fallback `src` |
| b31-01 Gallery | `gallery/mily-b31-01-panda-past-pic-{480,960,1600}.{jpg,webp}` | 同じ写真の `pnpm media:build` 派生 | ✅ Gallery photo |

出典: `https://x.com/Mily_chan36/status/2084752452373680152`

NEWS JPEG: 145,320 bytes / 1153×2048 / sha256
`0152f1bef64795b054e9267d40335fa77df8f83776fa68a4f187abfd90f4127a`

Gallery 480.jpg sha256
`e465173a4d7e364664a288d18951508d45481fff0fd1256671135781631bee1c`
Gallery 960.jpg sha256
`6a4ac8dec908a700d332e6037ce38bb4229285830564126c77aeeef649fd2d95`

## 素材台帳（batch b32 / 受領日・source date 2026-08-18）

2026-08-18 23:30:41 JST の本人X投稿（created_at Tue Aug 18 14:30:41 UTC 2026）。
ラジオ配信SHOWROOM画面。ゴディバのカップを持ち目を閉じて微笑むみりぃ。
既存 NEWS `2026-08-18-evening-radio` へ添付（新しいNEWSは作らない）。Gallery にも出す。
出典 / CTA（X と `/stories/2026-08-18-radio/`）は維持。本文の体調表現は変えていない。

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b32-01 NEWS | `news/mily-b32-01-evening-radio-showroom.jpg` | SHOWROOM画面。1216×2048。sns-post | ✅ 既存ラジオNEWS の fallback `src`（ICC除去のため q95 再エンコード。Gallery 1600 とは別バイト） |
| b32-01 Gallery | `gallery/mily-b32-01-evening-radio-showroom-{480,960,1600}.{jpg,webp}` | 元素材 1216×2048 から `pnpm media:build` | ✅ Gallery photo |

出典: `https://x.com/Mily_chan36/status/2089721650522820667`

元素材（gitignore）: 538,086 bytes / 1216×2048 / sha256
`9a6888ce2b1dacc82dc3aaf147de4ca64a16640ceac80cd6a8fd13397229d918`

NEWS JPEG: 699,791 bytes / 1216×2048 / sha256
`734ae7ac7fe01b1f74828b8488767f60da6119f9c06141ea3f6f0c15bf456e7f`

Gallery 480.jpg sha256
`e73fcfee3d195e1e06171cd8952103e0e83004ff51dba28f24c5c6473fb8cd71`
Gallery 960.jpg sha256
`03d6834723027607e71d0126378be763cfb0dcd29e3e61388d01fde6ee1b5144`

## 素材台帳（batch b33 / 受領日・source date 2026-08-24）

2026-08-24 の本人X投稿に添えられた CAMPUS GIRLS 2027 予選A Final STAGE 案内グラフィック。
実写ポートレートではない。既存 NEWS `2026-08-24-campus-girls-final-stage-guide` の
additionalMedia（b26-02 の次）として掲載。Gallery には出さない。

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b33-01 NEWS | `news/mily-b33-01-campus-girls-final-stage-flyer.jpg` | Final STAGE 案内グラフィック。1024×1536。sns-post | ✅ 既存CAMPUS GIRLS NEWS の additionalMedia。Gallery 非掲載 |

出典: `https://x.com/mily_chan36/status/2091669951946121636`

NEWS JPEG: 256,839 bytes / 1024×1536 / sha256
`93232254cd165349814262aceb7a98c1961480140aea140dcf2a58d46feac6a3`

## 素材台帳（batch b34 / 受領日・source date 2026-08-08）

2026-08-08 23:09:48 JST の本人X投稿（created_at Sat Aug 08 14:09:48 UTC 2026）。
2次審査期間の配信スケジュール案内グラフィック。実写ポートレートではない。
新しい NEWS `2026-08-08-second-round-timetable`。Gallery には出さない。
画像内の枠は投稿の案内であり、`events.ts` / `streamSchedule.ts` には転記しない。

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b34-01 NEWS | `news/mily-b34-01-second-round-timetable.jpg` | 2次審査期間の配信スケジュール案内。1149×1369。sns-post | ✅ 新NEWS のみ。Gallery 非掲載 |

出典: `https://x.com/Mily_chan36/status/2086092518719140028`

NEWS JPEG: 272,873 bytes / 1149×1369 / sha256
`7835466343a655224b4aeff52e3074db8eb5e2ec92343795df1f86433d59c692`

b05-01 は既存 Gallery のまま。NEWS `2026-08-19-second-round-result` へ srcset で配線した。
新しいファイルは作っていない。`media.ts` の `sourceUrl` は未確認のため null のまま。

## 素材台帳（batch b35 / 受領日・source date 2026-08-27）

2026-08-27 の本人Instagram Story。owner-providedの縦型動画で、画面には
「おはよう」「【8/27（木）】ミスサーSR配信 14:00〜」と表示されている。
HOME Latest / `/news/` と Gallery が同じ公開MP4・poster・manifest objectを共有する。
恒久的なStory permalinkはないため、表示は非リンクの `Instagram Story` labelとし、
Instagramプロフィールは関連リンクだけに使う。受け渡し用URL / file IDは公開情報・
tracked textへ残さない。

日常の朝Storyとして `/stories/` 記事、highlights、`events.ts`、`streamSchedule.ts`、
`media.ts`、Activitiesの関連NEWS / 関連メディアには追加しない。NEWS正本から
Portal Feedへは既存契約どおり派生する。

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b35-01 | `gallery/mily-b35-01-miss-circle-showroom-story.mp4` | 室内で資料を手にしたみりぃと、8月27日14:00からのミスサーSHOWROOM配信案内が表示された縦型動画。720×1280 / 17.567秒。owner-provided | ✅ Latest / NEWS + Gallery |
| b35-01 poster | `gallery/mily-b35-01-miss-circle-showroom-story-poster.jpg` | 公開MP4の8.0秒地点の実フレーム。720×1280 | ✅ Latest / NEWS + Gallery |

### 元素材の実測

- provenance: `owner-provided`（オーナー指定のDrive受け渡しファイル。SNSから取得していない）
- Instagram Story / source date: `2026-08-27` / 恒久permalinkなし
- 元素材は `media/original/mily-b35-01-miss-circle-showroom-story.mp4` に
  受領バイトを変えず保管（gitignore済み・コミットしない）
- 19,956,962 bytes / sha256
  `230c7088081f5fd72c427d545e427ecc0380717f8ad767cb620e33ce7549b9c3`
- H.264 High / 720×1280 / 30fps / 527 frames / 17.566667秒 / yuv420p
- 音声: HE-AAC / 44.1kHz / stereo / 17.481701秒
- 元metadata: format・video・audioに `creation_time: 2026-08-27T02:33:43Z`、
  streamに `Core Media Video / Audio`
- 画面内と背景を通して、DM・通知・第三者・端末UI・識別可能な個人情報は見当たらない。
  手元の印刷物は本人が公開した動画内に映る範囲で、第三者名や連絡先は確認できない

### 音声の扱い — 削除した

元素材にはHE-AAC / 44.1kHz / stereoの音声ストリームがあるが、音声の内容・由来・
権利者と再配信権を確認できないため、公開派生はvideo-only（無音）とした。
本人の声・BGM・その他の音声のいずれかは推測して記録しない。元素材は変更していない。

### 公開MP4 / poster

- MP4: 1,012,519 bytes / H.264 Constrained Baseline / 720×1280 / 30fps /
  527 frames / 17.567秒 / yuv420p / `has_b_frames` 0 / 音声ストリームなし /
  sha256 `e54b6f15bd77cdb0820a403eabb83552188e891856d5d6f2566be15685cd1e49`
- `+faststart`確認済み（`moov` offset 36 < `mdat` offset 2970）
- metadata除去済み。元の`creation_time`と`Core Media Video / Audio`、chapterは残っていない
- poster: 70,173 bytes / 720×1280 JPEG / 8.0秒地点の実フレーム /
  sha256 `9810d3a4b420ba624ac229d58d778ccc52c0621f89eb440c82614dce96b2cc27`
- posterはEXIF / IPTC / XMP / ICCなし
- crop・scale・引き伸ばし・アップスケール・fps水増し・短縮・テロップ削除なし
- AI生成・AI加工・顔補正・generative fill・outpaintingなし

## 素材台帳（batch b36 / 受領日・source date 2026-08-27）

2026-08-27 の本人Instagram Story。湘南シーサイドサークルの番組Storyを
再共有したowner-providedの縦型動画で、8月30日（日）10:00〜13:00の生放送と、
トークテーマ「映画」のメッセージ募集を案内している。HOME Latest / `/news/` と
Gallery が同じ公開MP4・poster・manifest objectを共有する。

恒久的なStory permalinkはないため、表示は非リンクの `Instagram Story` labelとし、
本人Instagramプロフィールは関連リンクだけに使う。受け渡し用URL / file IDは
公開情報・tracked textへ残さない。Radio Activityでは関連NEWS・関連メディアとして
既存の明示的な `activityIds` 経路から表示する。

通常の番組告知Storyとして `/stories/` 記事、highlights、`events.ts`、
`streamSchedule.ts`、`media.ts`、週次ラジオ正本には追加しない。NEWS正本から
Portal Feedへは既存契約どおり派生する。

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b36-01 | `gallery/mily-b36-01-seaside-circle-movie-theme-story.mp4` | 湘南シーサイドサークルの8月30日生放送と、トークテーマ「映画」のメッセージ募集を案内するInstagram Story動画。720×1280 / 20.000秒。owner-provided | ✅ Latest / NEWS + Gallery + Radio Activity |
| b36-01 poster | `gallery/mily-b36-01-seaside-circle-movie-theme-story-poster.jpg` | 公開MP4の8.0秒地点の実フレーム。720×1280 | ✅ Latest / NEWS + Gallery + Radio Activity |

### 元素材の実測

- provenance: `owner-provided`（オーナー指定のDrive受け渡しファイル。SNSから取得していない）
- Instagram Story / source date: `2026-08-27` / 恒久permalinkなし
- 元素材は `media/original/mily-b36-01-seaside-circle-movie-theme-story.mp4` に
  受領バイトを変えず保管（gitignore済み・コミットしない）
- 11,478,979 bytes / sha256
  `f091af15ffa5b905c37c917ed9285f3fce33c7ec340dae60cfa7316221c54d40`
- H.264 High / 720×1280 / 30fps / 600 frames / 20.000000秒 / yuv420p
- 音声: HE-AAC / 44.1kHz / stereo / 19.919796秒
- 元metadata: format・video・audioに `creation_time: 2026-08-27T04:57:02Z`、
  streamに `Core Media Video / Audio`。投稿時刻の根拠には使っていない
- 画面には番組の公開案内、出演者3人の公開プロフィール画像・番組内呼称、
  番組アカウントと本人の再共有表示が含まれる。DM・通知・端末情報・第三者コメント、
  電話番号・メールアドレス・住所は見当たらない。本文・altには第三者名を転記していない

### 音声の扱い — 削除した

元素材にはHE-AAC / 44.1kHz / stereoの音声ストリームがあるが、音声の内容・由来・
権利者と再配信権を確認できないため、公開派生はvideo-only（無音）とした。
本人の声・BGM・その他の音声のいずれかは推測して記録しない。元素材は変更していない。

### 公開MP4 / poster

- MP4: 1,197,138 bytes / H.264 Constrained Baseline / 720×1280 / 30fps /
  600 frames / 20.000000秒 / yuv420p / `has_b_frames` 0 / 音声ストリームなし /
  sha256 `8972bcfa3dac0d08757a15275b1542ffdc706f9b8d96fa90d02f30d3dcd4da45`
- `+faststart`確認済み（`moov` offset 36 < `mdat` offset 3278）
- metadata除去済み。元の`creation_time`と`Core Media Video / Audio`、chapterは残っていない
- poster: 88,947 bytes / 720×1280 JPEG / 8.0秒地点の実フレーム /
  sha256 `1c7da24c2c36562dcf0312d54acfc4df859e4b089a1d4470fc736c084523a6da`
- posterはEXIF / IPTC / XMP / ICCなし
- crop・scale・引き伸ばし・アップスケール・fps水増し・短縮・テロップ削除なし
- AI生成・AI加工・顔補正・generative fill・outpaintingなし

## 素材台帳（batch b37 / 受領日・source date 2026-04-23）

2026-04-23のTikTok通常投稿に使われた、オーナー直接提供の短尺動画。
LatestとGallery（動画アーカイブ）が同じ公開MP4・poster・manifest objectを共有する。
Drive Gallery（b02）・`/stories/`・`events.ts`・`profile.ts`・`highlights.ts`・
`media.ts` には含めない。ラジオ／ミスコン／CAMPUS GIRLS の `activityIds` も付けない
（踊る動画であり、番組アカウント投稿という理由だけではラジオ出演記録にしない）。

一次出典: https://www.tiktok.com/@seasidecircle/video/7631929037195185429

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b37-01 | `gallery/mily-b37-01-tiktok-sayonara-ichigo.mp4` | 室内でカメラに向かい、「さよならいちごちゃん」に合わせて表情豊かに踊る縦型動画。576×1024。owner-provided | ✅ Latest / Gallery |
| b37-01 poster | `gallery/mily-b37-01-tiktok-sayonara-ichigo-poster.jpg` | 公開MP4の2.4秒地点の実フレーム。576×1024 | ✅ Latest / Gallery |

### 元素材の実測

- provenance: `owner-provided`（オーナー指定の受け渡しファイル。SNSから取得していない）
- 元素材は `media/original/` に受領時の名前のまま無改変で保管
  （gitignore済み・コミットしない。ランダムな受領時名はtracked textへ記録しない）
- sha256: `d8ceee63da463ea94a6e953e611bcfcf9a08672cb390113484067f77ee48a988`
- 1,675,842 bytes / H.264 **High** / **576×1024** / 473 frames / 約17.56秒
- 受領ファイルは、AAC LC / 44.1kHz / stereo / 約128kbps の音声ストリームがあった
  ファイルから video-only に再エンコードされたもの
- 素材受け渡し用URL / file IDは公開情報・tracked textとして記録しない

### 音声の扱い — 公開派生は無音

楽曲の権利とこのサイトでの再配信権が未確認のため、公開MP4はvideo-only（無音）とした。
元素材側で既に音声が外れていても、公開面では同じ判断を維持する。
楽曲名・権利者・本人音声の別は推測して記録しない。

### 公開MP4

- sha256: `eabb223c5ed5bb7e89b1b72c1787f873e06e4d1c7de64c3c8bb0161da4c8c5f8`
- 2,038,963 bytes / H.264 **Constrained Baseline** / level 3.1 / **576×1024** /
  473 frames / 17.555556秒 / yuv420p / 音声ストリームなし
- 元素材の画素数・9:16の縦横比・映像フレーム数を維持。
  crop・scale・引き伸ばし・アップスケール・fps水増しなし
- `+faststart`確認済み（`moov` offset 36 < `mdat` offset 2802）
- metadata除去確認済み（`-map_metadata -1` / `-map_metadata:s:v -1` /
  `-map_chapters -1`）。元の`aigc_info` / `comment` / `vid_md5`は残っていない
- AI生成・AI加工・顔補正・generative fill・outpaintingなし

エンコードコマンド（再現用）:

```
ffmpeg -i media/original/<受領時ファイル名>.mp4 \
  -map 0:v:0 -an \
  -map_metadata -1 -map_metadata:s:v -1 -map_chapters -1 \
  -c:v libx264 -profile:v baseline -level 3.1 -crf 23 -preset slow \
  -pix_fmt yuv420p -movflags +faststart \
  public/media/gallery/mily-b37-01-tiktok-sayonara-ichigo.mp4
```

### poster / 共有範囲

- 公開MP4の2.4秒地点の実フレームから生成。AI生成・顔加工・塗り足しなし
- 32,108 bytes / 576×1024 JPEG / sha256
  `42afb6e3ffc507ac3c03d4d81ba4699e25b0d090ccf14a7ca2011edd3b40a35c`
- EXIF / IPTC / XMP なし。TikTok閲覧画面のスクリーンショットからは作っていない
- `src/data/tiktokSayonaraIchigoVideo.json` の1オブジェクトをLatest / Galleryで共有し、
  公開MP4 1本・poster 1枚だけを参照する

poster生成コマンド（再現用）:

```
ffmpeg -ss 2.4 -i public/media/gallery/mily-b37-01-tiktok-sayonara-ichigo.mp4 \
  -frames:v 1 -q:v 4 -map_metadata -1 \
  public/media/gallery/mily-b37-01-tiktok-sayonara-ichigo-poster.jpg
```

## 素材台帳（batch b38 / 受領日・source date 2026-08-27）

本人Instagram通常投稿で使われた、映画館での写真5枚。オーナーが当該5枚を
掲載用ファイルとして直接提供し、記事と写真、みりぃへの導線をサイトへ載せるよう依頼した。
SNSから取得していない。一次出典は
`https://www.instagram.com/p/Dci0CvNE29X/`。

Galleryへ5枚すべてを掲載し、同じ公開派生をLatest / NEWSの代表1枚＋追加4枚でも
投稿順に共有する。`/stories/`、highlights、events、Gallery動画、Activitiesには追加しない。
b37は同時点のopen Draft PRで使用中のため、衝突を避けて新規batch b38を使用する。

| ID | 元ファイル | 実寸 | sha256（先頭12桁） | 内容 | 掲載 |
| --- | --- | --- | --- | --- | --- |
| b38-01 | `mily-b38-01-cinema-churro-selfie.jpg` | 960×1280 | `8ef15ee00591` | 映画館でチュロスを手にした自撮り | ✅ Latest / NEWS + Gallery |
| b38-02 | `mily-b38-02-cinema-poster.jpg` | 959×1280 | `cd84beb101b9` | 鑑賞した作品の上映案内 | ✅ Latest / NEWS + Gallery |
| b38-03 | `mily-b38-03-cinema-snacks-churro-raised.jpg` | 960×1280 | `10c65e3ffa85` | ポップコーン・ドリンクを持ちチュロスを掲げる | ✅ Latest / NEWS + Gallery |
| b38-04 | `mily-b38-04-cinema-snacks-side-glance.jpg` | 960×1280 | `8f4a0362d664` | チュロスを肩に添え横を見る | ✅ Latest / NEWS + Gallery |
| b38-05 | `mily-b38-05-cinema-snacks-front.jpg` | 960×1280 | `6687aa97de9d` | チュロスを肩に添えカメラを見る | ✅ Latest / NEWS + Gallery |

### 元素材・公開派生の確認

- provenance: `owner-provided`。5枚とも `media/original/` に受領バイトを変えず保管
  （gitignore済み・コミットしない）
- source date: `2026-08-27`。撮影者は未確認のため `credit: null`
- 元JPEGは5枚ともEXIF / IPTCを含む。公開派生は既存 `pnpm media:build` 相当の
  `scripts/build-media.mjs` で生成し、EXIF / GPS / IPTC / XMP / ICCを除去した
- 公開派生は各写真につき480 / 960 / 1600 × JPG / WebPの30ファイル。
  `withoutEnlargement`により、1600派生はb38-02が959×1280、ほか4枚が960×1280
- 1600.jpg sha256: b38-01 `d1a8af4cb658`、b38-02 `296097169ec3`、
  b38-03 `75caa24300bd`、b38-04 `7aef7e5fd162`、b38-05 `31c2700ab215`
- トリミング・引き伸ばし・アップスケール・AI生成・顔補正・生成塗り足しなし
- b38-01 / 03 / 04 / 05に第三者、通知、端末UI、チケット、座席番号、レシート、
  連絡先は見当たらない。b38-02は映画館の公開上映案内で、劇場名や座席情報は写っていない。
  作品ポスターはInstagram投稿の映画鑑賞記録という文脈と、当該5枚への掲載指示に限定して扱う
- 本人Instagramプロフィール `https://www.instagram.com/mily_chan36` は
  NEWSの関連CTAであり、投稿の一次出典は個別permalinkのまま維持する

## 素材台帳（batch b39 / 受領日・source date 2026-08-28）

2026-08-28 の本人Instagram Story。「パトン投票3日目はここから❣️」と案内し、
Story内のリンクステッカーからCAMPUS GIRLS 2027のPaton投票へつなぐ内容。
オーナー提供の縦型動画を、投票期間中のHOME / Supportにある既存
`PatonVoteGuide` へ掲載する。

Storyの恒久permalinkはないため、`Instagram Story` は非リンクlabelとする。
サイトではリンクステッカー自体を再現せず、既存の確認済みPaton本人ページ
`https://paton.jp/event/entrant/11380` へ進むボタンを同じガイド内に置く。
NEWS、Gallery動画一覧、`/stories/`、highlights、events、streamSchedule、
`media.ts`、Activitiesには重複追加しない。投票期間終了後は既存ガイドと一緒に非表示になる。

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b39-01 | `gallery/mily-b39-01-paton-vote-day-3-story.mp4` | 「パトン投票3日目はここから❣️」と案内するInstagram Story。512×910 / 20.000秒 / video-only。owner-provided | ✅ HOME + Support のPatonVoteGuide |
| b39-01 poster | `gallery/mily-b39-01-paton-vote-day-3-story-poster.jpg` | 公開MP4の実フレーム。512×910 | ✅ HOME + Support のPatonVoteGuide |

### 公開メディアの確認

- provenance: `owner-provided`。SNSから再取得していない
- Instagram Story / source date: `2026-08-28` / 恒久permalinkなし
- MP4: 86,843 bytes / H.264 Constrained Baseline / 512×910 / 30fps /
  600 frames / 20.000000秒 / yuv420p / `has_b_frames` 0 / 音声ストリームなし /
  sha256 `d808b91f9b59a2cab14beae1d797a0bb99ec6a84c82a09ec6f7b4fadc5102e19`
- `+faststart`確認済み。metadata、chapter、元のhandler名は残していない
- poster: 31,464 bytes / 512×910 JPEG / 公開MP4の実フレーム /
  sha256 `f6771c8ec93470d4c3036b77e66472d01151a91f421f9816642c159fa1802e38`
- posterはEXIF / IPTC / XMP / ICCなし
- 元素材の音声は内容・由来・再配信権を確認できないため、公開派生では削除した
- crop・引き伸ばし・アップスケール・fps水増し・短縮・テロップ削除なし
- AI生成・AI加工・顔補正・generative fill・outpaintingなし
- 元素材、受け渡しURL、file ID、受領時ファイル名はtracked/public filesへ含めない

## 素材台帳（batch b40 / 受領日・source date 2026-08-28）

本人Instagram Storyで共有された、CAMPUS GIRLS 2027 予選A Final STAGEの
審査詳細画像、Paton投票3日目の投稿時点2位記録、ムービー審査1位・総合7位記録の3点。
HOME / Support が共有する既存 `PatonVoteGuide` の同じシリーズへ追加し、
既存b39の投票ページ案内Storyも同じガイド内で維持する。

Storyの恒久permalinkはないため、3点の出典表示は非リンクの `Instagram Story`。
本人Instagramプロフィールは出典ではなく、同じガイドの確認済み関連CTA
`Instagramプロフィールを見る` として分けて表示する。

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b40-01 | `news/mily-b40-01-campus-girls-final-stage-details.jpg` | 配信・SNS・Paton投票・面接の各審査と特典をまとめたStory画像。1080×1919。owner-provided | ✅ HOME + Support のPatonVoteGuide |
| b40-02 | `news/mily-b40-02-paton-vote-day3-second-record.mp4` | Paton投票3日目、みりぃが投稿時点2位と表示されたStory動画。720×1280 / 20.000秒 / video-only。owner-provided | ✅ HOME + Support のPatonVoteGuide |
| b40-02 poster | `news/mily-b40-02-paton-vote-day3-second-record-poster.jpg` | 公開MP4の0.2秒地点の実フレーム。720×1280 | ✅ HOME + Support のPatonVoteGuide |
| b40-03 | `news/mily-b40-03-movie-exam-first-overall-seventh-record.mp4` | ムービー審査1位・総合7位と表示されたStory動画。720×1280 / 5.000秒 / video-only。owner-provided | ✅ HOME + Support のPatonVoteGuide |
| b40-03 poster | `news/mily-b40-03-movie-exam-first-overall-seventh-record-poster.jpg` | 公開MP4の2.5秒地点の実フレーム。720×1280 | ✅ HOME + Support のPatonVoteGuide |

### 元素材の実測と安全確認

- provenance: `owner-provided`。3点とも受領バイトを変えず `media/original/` の
  gitignored領域へ保管。受け渡しURL、file ID、受領時ファイル名はtracked/public filesへ含めない
- b40-01元JPEG: 11,255,441 bytes / 3870×6879 / EXIF・IPTCあり / sha256
  `5d2dfde4ce7d31bca555d8968379e981cec3f4028b0df0b4b397751d401b77d0`
- b40-02元素材: 6,389,314 bytes / H.264 High / 720×1280 / 30fps /
  600 frames / 20.000000秒 / yuv420p / HE-AAC音声あり / sha256
  `64b7ae1740d8edae479cd97e91d9074c59f934ed24f1fd316651b80572c1271a`
- b40-03元素材: 1,421,885 bytes / H.264 High / 720×1280 / 30fps /
  150 frames / 5.000000秒 / yuv420p / 音声ストリームなし / sha256
  `a931bed58e549a347e9d56ed4c2ff9e10ce15a1f503004adad0675ad89fa1e38`
- 元動画の `creation_time` と `Core Media Video / Audio` は受領検査だけに使い、
  投稿日時の根拠にはしていない。DM・通知・端末固有情報・連絡先は見当たらない
- b40-02のランキング1位・3位カード、b40-03のみりぃ以外のランキング行と
  公式バナー内の第三者2名の顔は、顔・名前が判別できない画素化モザイクを
  公開MP4とposterの両方へ適用した。みりぃ本人の行と順位表示は維持する

### 公開派生

- b40-01 JPEG: 293,064 bytes / 1080×1919 / EXIF・IPTC・XMP・ICCなし /
  sha256 `0f909feb705b49d1f9122ff4e9009307a95f330615f87b354292a293341f2508`
- b40-02 MP4: 325,698 bytes / H.264 Constrained Baseline / 720×1280 / 30fps /
  600 frames / 20.000000秒 / yuv420p / `has_b_frames` 0 / 音声なし /
  sha256 `794852a84298d62b8d998a9340aa9969f2ea0c799a1076676c99a2b2d7d6626a`
- b40-02 poster: 75,714 bytes / 720×1280 / metadataなし / sha256
  `ddab5d8e2299f14824a0e5316b40674d3d0a91cb64c4bb80178c7f2116918652`
- b40-03 MP4: 185,326 bytes / H.264 Constrained Baseline / 720×1280 / 30fps /
  150 frames / 5.000000秒 / yuv420p / `has_b_frames` 0 / 音声なし /
  sha256 `850eda64913e36442013d42bcabb2d5db909f54988a466a64100d076ae6fdbc4`
- b40-03 poster: 67,132 bytes / 720×1280 / metadataなし / sha256
  `17bf991a39e5ee19f38ad54f8a8e230b487d3baa601b51e24725edf0de08d56b`
- 両MP4とも `+faststart`、metadata・chapter・元handler名なし。全体のトリミング・
  リサイズ・短縮なし（privacy-safeなモザイク領域だけを画素化）。posterは公開MP4の実フレーム
- 順位カードには `投稿時点の記録` と、現在順位ではない旨を表示する。
  NEWS、Gallery、`/stories/`、highlights、events、streamSchedule、Activities、
  Portal Feedには重複追加しない

## 素材台帳（batch b41 / 受領日 2026-08-29 / source date 2026-08-28〜29）

オーナーが直接提供した本人Instagram Story動画2本。b41-01は8月28日22:00からの
SHOWROOM夜配信案内、b41-02は日付が変わった8月29日のPaton投票4日目案内。
HOME Latest / `/news/` と Gallery が、各動画の公開MP4・poster・manifest objectを
共有する。恒久的なStory permalinkはないため、表示は非リンクの
`Instagram Story` labelとする。

両NEWSには本人Instagramプロフィールと、確認済みPaton本人ページへの2 CTAを置く。
InstagramプロフィールはStoryの出典ではなく関連リンク。Paton CTAは既存の
SupportEvent期間（2026-09-01 23:59 JSTまで）に従い、終了後に自動で非表示になる。

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b41-01 | `gallery/mily-b41-01-night-showroom-story.mp4` | 屋外で青いキャップに手を添えるみりぃと、8月28日22:00〜のSHOWROOM配信案内を表示したStory。512×910 / 19.033秒 / video-only | ✅ Latest / NEWS + Gallery + LIVE STREAM Activity |
| b41-01 poster | `gallery/mily-b41-01-night-showroom-story-poster.jpg` | 公開MP4の8.0秒地点の実フレーム。512×910 | ✅ Latest / NEWS + Gallery |
| b41-02 | `gallery/mily-b41-02-paton-vote-day4-story.mp4` | 拳を上げるみりぃとPaton投票4日目の応援呼びかけを表示したStory。512×910 / 19.033秒 / video-only | ✅ Latest / NEWS + Gallery + CAMPUS GIRLS Activity |
| b41-02 poster | `gallery/mily-b41-02-paton-vote-day4-story-poster.jpg` | 公開MP4の8.0秒地点の実フレーム。512×910 | ✅ Latest / NEWS + Gallery |

### 元素材と安全確認

- provenance: `owner-provided`。SNSから再取得していない。受領バイトを変えず
  `media/original/` のgitignored領域へ保存し、元の受け渡し名・URL・file IDは
  tracked/public filesへ残さない
- b41-01元動画: 7,478,914 bytes / sha256
  `f095d39ae88d7614c67a2927d10fe0821b77e085d5d1fb39cff2f2d1917ca9b2` /
  H.264 High / 512×910 / 30fps / 571 frames / video 19.033秒 /
  HE-AAC 44.1kHz stereo音声あり
- b41-02元動画: 5,981,295 bytes / sha256
  `dc3b57843912a3cdafa7cf0d42b842aec62160632839a82e724bae011958598a` /
  H.264 High / 512×910 / 30fps / 571 frames / video 19.033秒 /
  HE-AAC 48kHz stereo音声あり
- 元動画の`creation_time`とCore Media handler名は受領検査だけに使い、投稿日・
  投稿時刻の根拠にはしていない
- 2本ともInstagram UI、DM、通知、端末固有情報、連絡先、第三者コメントは含まれない。
  b41-01の背景にいる人物は小さく、顔・名前を識別できない。b41-02に第三者は見当たらない

### 音声と公開派生

元素材の音声は内容・由来・権利者と再配信権を確認できないため、公開派生では削除した。
映像は512×910、30fps、571フレームを維持し、crop・scale・引き伸ばし・
アップスケール・短縮・テロップ変更はしていない。AI生成・顔補正・生成塗り足しもない。

- b41-01 MP4: 506,089 bytes / H.264 Constrained Baseline / 19.033秒 /
  音声なし / metadata・chapterなし / `+faststart` / sha256
  `f7527648bb7c4704a3a8b3ce41a11255802dacde75dfed3711d7b1fe659812ad`
- b41-01 poster: 73,023 bytes / metadataなし / sha256
  `4508a702d3530cf88c7c75b0828ac37be02a5e75fde49088ae85b3386380669f`
- b41-02 MP4: 384,811 bytes / H.264 Constrained Baseline / 19.033秒 /
  音声なし / metadata・chapterなし / `+faststart` / sha256
  `b2859681d00ba5d086d2834bc98b12acb6fa9e465e173ab6b5437ff31bff14eb`
- b41-02 poster: 46,509 bytes / metadataなし / sha256
  `4ca98d51878757eb775b92ac3c3edbb40535c1c3b2c57b6440473ca1aff1cdaf`

## 素材台帳（batch b42 / 受領日・source date 2026-08-30）

湘南シーサイドサークルの番組Instagram Story動画2本。b42-01はトークテーマ
「映画」のエピソード募集とメッセージフォーム、b42-02は8月30日10:00〜13:00の
生放送・聴取案内・トークテーマ「映画」を表示する。オーナーが直接提供し、
Radio Activityへの掲載を依頼した。

恒久的なStory permalinkはないため、表示は非リンクの
`湘南シーサイドサークル Instagram Story` labelとする。2本とも
`activityIds: ["radio"]` を持つ公開manifestからRadio Activityへ直接関連付け、
動画直下には既存の公開メッセージフォームへのCTAを再掲する。HOME Latest / NEWS、
Gallery、`/stories/`、highlights、events、streamSchedule、`media.ts`には追加しない。

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b42-01 | `radio/mily-b42-01-seaside-circle-message-form-story.mp4` | ラジオスタジオの3人と、映画にまつわるエピソードをメッセージフォームで募集する案内。512×910 / 19.033秒 / video-only | ✅ Radio Activity |
| b42-01 poster | `radio/mily-b42-01-seaside-circle-message-form-story-poster.jpg` | 公開MP4の8.0秒地点の実フレーム。512×910 | ✅ Radio Activity |
| b42-02 | `radio/mily-b42-02-seaside-circle-live-broadcast-story.mp4` | ラジオスタジオの3人と、8月30日10:00〜13:00の生放送・聴取・テーマ「映画」の案内。512×910 / 19.033秒 / video-only | ✅ Radio Activity |
| b42-02 poster | `radio/mily-b42-02-seaside-circle-live-broadcast-story-poster.jpg` | 公開MP4の8.0秒地点の実フレーム。512×910 | ✅ Radio Activity |

### 元素材と安全確認

- provenance: `owner-provided`。SNSから再取得していない。受領バイトを変えず
  `media/original/` のgitignored領域へ保存し、受け渡し名・URL・file IDは
  tracked/public filesへ残さない
- b42-01元動画: 7,802,686 bytes / sha256
  `4638b96f92be9681e6a6460285cf13ef20ee0110e64ccec9f50abef884ddd9fa`
- b42-02元動画: 7,617,268 bytes / sha256
  `52c60494708678dca0bf36b9e65c22f28d8251a885f01e72566fb9a796da8552`
- 2本とも H.264 High / 512×910 / 30fps / 571 frames / video 19.033秒。
  HE-AAC 44.1kHz stereo音声はformat上19.918秒
- 元動画の`creation_time`とCore Media handler名は受領検査だけに使い、投稿日・
  投稿時刻の根拠にはしていない
- 画面は番組の公開案内と出演者3人を写したもの。DM・通知・端末固有情報・連絡先・
  第三者コメントは含まれず、本文・altには第三者名を転記していない

### 音声と公開派生

元素材の音声は内容・由来・権利者と再配信権を確認できないため、公開派生では削除した。
映像は512×910、30fps、571フレームを維持し、crop・scale・引き伸ばし・
アップスケール・短縮・テロップ変更はしていない。AI生成・顔補正・生成塗り足しもない。

- b42-01 MP4: 603,497 bytes / H.264 Constrained Baseline / 19.033秒 /
  音声なし / metadata・chapterなし / `+faststart` / sha256
  `0a2a6435060523a0f9a3e71d6fe68fcf16ad1939994465979dde4cdf98ef7d69`
- b42-01 poster: 116,909 bytes / 8.0秒地点の実フレーム / metadataなし /
  sha256 `f17b0d6c3504e05890f6d001f0dd02b4b099b540b43b51b46afac8a1b6cfe30f`
- b42-02 MP4: 595,846 bytes / H.264 Constrained Baseline / 19.033秒 /
  音声なし / metadata・chapterなし / `+faststart` / sha256
  `1e2a37dc3ba83c51d6753af64e4459bb5ea42e96f60958f1e47457c7b0e7bb5b`
- b42-02 poster: 123,293 bytes / 8.0秒地点の実フレーム / metadataなし /
  sha256 `17ba92876d6ad790fd598f0ebf728feaface90f0b6aa98e0a3c6482dbd08bfab`

## 素材台帳（batch b43 / 受領日 2026-08-30 / source date 2026-08-29〜30）

オーナーが直接提供した本人Instagram Story動画2本。b43-01は日付が変わる前の
Paton投票5日目案内と変面さんとの2ショット、b43-02はキャンパスガールズ2027の
Paton投票期限・ムービー応援期限と「2位を守り抜きたい」という呼びかけ。
HOME Latest / `/news/` と Gallery が、各動画の公開MP4・poster・manifest objectを
共有する。恒久的なStory permalinkはないため、表示は非リンクの
`Instagram Story` labelとする。CAMPUS GIRLS Activity の関連NEWS・関連メディア
にも出す。`/stories/`、highlights、events、streamSchedule、`media.ts`、
PatonVoteGuide のランキング系列には追加しない。

両NEWSには本人Instagramプロフィールと、確認済みPaton本人ページへの2 CTAを置く。
InstagramプロフィールはStoryの出典ではなく関連リンク。Paton CTAは既存の
SupportEvent期間（2026-09-01 23:59 JSTまで）に従い、終了後に自動で非表示になる。
Mixch URLは画面に無いため Mixch CTAは付けない。

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b43-01 | `gallery/mily-b43-01-paton-vote-day5-story.mp4` | 変面の演者と並ぶみりぃと、日付が変わる前のPaton投票5日目のお願い。720×1280 / 20.000秒 / 1fps / 20フレーム / video-only | ✅ Latest / NEWS + Gallery + CAMPUS GIRLS Activity |
| b43-01 poster | `gallery/mily-b43-01-paton-vote-day5-story-poster.jpg` | 公開MP4の8.0秒地点の実フレーム。720×1280 | ✅ Latest / NEWS + Gallery |
| b43-02 | `gallery/mily-b43-02-campus-girls-hold-second-story.mp4` | くまの顔フィルターとヘッドホンを付けたみりぃと、キャンパスガールズ2027の期限案内・2位を守り抜きたいという呼びかけ。720×1280 / 20.000秒 / 30fps / 600フレーム / video-only | ✅ Latest / NEWS + Gallery + CAMPUS GIRLS Activity |
| b43-02 poster | `gallery/mily-b43-02-campus-girls-hold-second-story-poster.jpg` | 公開MP4の8.0秒地点の実フレーム。720×1280 | ✅ Latest / NEWS + Gallery |

### 元素材と安全確認

- provenance: `owner-provided`。SNSから再取得していない。受領バイトを変えず
  `media/original/` のgitignored領域へ保存し、元の受け渡し名・URL・file IDは
  tracked/public filesへ残さない
- b43-01元動画: 961,498 bytes / sha256
  `23f7d40ffdf30f6930cf0aa26087846da6f401840bd362666cb78900ed0bc194` /
  H.264 High / 720×1280 / 1fps / 20 frames / video 20.000秒 /
  HE-AAC 44.1kHz stereo音声あり
- b43-02元動画: 9,441,731 bytes / sha256
  `cfac3ee5b68b130e45997eb826c3784ccf7245371040d9525f7f08daaff744a5` /
  H.264 High / 720×1280 / 30fps / 600 frames / video 20.000秒 /
  音声ストリームなし
- 元動画の`creation_time`とCore Media handler名は受領検査だけに使い、投稿日・
  投稿時刻の根拠にはしていない
- 2本ともInstagram UI、DM、通知、端末固有情報、連絡先、第三者コメントは含まれない。
  b43-01の背景人物は元動画ですでに白いぼかしが入っているため、そのまま維持した。
  変面の演者は公開パフォーマンスの出演者。レストラン名は確認できないため非掲載。
  b43-02に識別可能な第三者は見当たらない。「2位」は投稿時点の記録として扱う

### 音声と公開派生

元素材の音声は内容・由来・権利者と再配信権を確認できないため、公開派生では削除した。
映像は720×1280、元のfpsとフレーム数を維持し、crop・scale・引き伸ばし・
アップスケール・短縮・テロップ変更はしていない。AI生成・顔補正・生成塗り足しもない。

- b43-01 MP4: 634,313 bytes / H.264 Constrained Baseline / 20.000秒 /
  1fps / 20フレーム / 音声なし / metadata・chapterなし / `+faststart` / sha256
  `09d5fbe72c42beb66af32d6376ef01e95cb1ad9a8ba22593c25c845996993a81`
- b43-01 poster: 120,290 bytes / metadataなし / sha256
  `65da2070ab0b25d54ce01e8cd4ed337a6a7fe0edc822849505811f27503bff0f`
- b43-02 MP4: 798,016 bytes / H.264 Constrained Baseline / 20.000秒 /
  30fps / 600フレーム / 音声なし / metadata・chapterなし / `+faststart` / sha256
  `81699137c90a914d798500dd55bc581f1490f51767a49c856fdf3dda8bac3406`
- b43-02 poster: 87,690 bytes / metadataなし / sha256
  `2c9413f1ddbca35565f348377d67dd22e22a81fa8c82454db955b8f6cd079b0e`

## 素材台帳（batch b44 / 受領日 2026-08-31 / source date 2026-08-30〜31）

オーナーが直接提供した本人Instagram Story動画4本。うち2本を公開する。
くまフィルターの「2位を守り抜きたい」は既存b43-02と同一のためこのバッチでは扱わない。

- b44-01: CAMPUS GIRLS公式のPaton投票1.5倍デー告知を写した緊急案内
- b44-02: 投稿時点1位（102,700pt）と「31日は1.5倍DAY」の呼びかけ。他出場者は写っていない
- b44-03: パトン投票のやり方。他出場者の顔・名前、オーナーサポーター名、投稿時点ではない
  古い順位表示があるため**非掲載**（8/27のX投票方法案内と同じ判断。NEWSは既存人物写真で案内）
- b44-04: SHOWROOM 30日連続配信記念日と、投稿時点の朝7:30配信予定。SHOWROOM配信画面に
  視聴者の表示名・アイコン・コメントが写るため**非掲載**（NEWSはテキストのみ）

HOME Latest / `/news/` と Gallery が、b44-01 / b44-02 の公開MP4・poster・
manifest objectを共有する。恒久的なStory permalinkはないため、表示は非リンクの
`Instagram Story` labelとする。b44-01 / b44-02 は CAMPUS GIRLS Activity の
関連NEWS・関連メディアにも出す。b44-04 は LIVE STREAM の関連NEWS（テキスト）のみ。
`/stories/`、highlights、events、streamSchedule、`media.ts`、
PatonVoteGuide のランキング系列には追加しない。

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b44-01 | `gallery/mily-b44-01-paton-vote-15x-emergency-story.mp4` | 公式X告知を写した1.5倍デー緊急案内。720×1280 / 5.000秒 / 30fps / 150フレーム / video-only | ✅ Latest / NEWS + Gallery + CAMPUS GIRLS Activity |
| b44-01 poster | `gallery/mily-b44-01-paton-vote-15x-emergency-story-poster.jpg` | 公開MP4の2.0秒地点の実フレーム。720×1280 | ✅ Latest / NEWS + Gallery |
| b44-02 | `gallery/mily-b44-02-paton-vote-first-place-story.mp4` | 投稿時点1位・102,700ptと1.5倍DAYの呼びかけ。720×1280 / 20.000秒 / 30fps / 600フレーム / video-only | ✅ Latest / NEWS + Gallery + CAMPUS GIRLS Activity |
| b44-02 poster | `gallery/mily-b44-02-paton-vote-first-place-story-poster.jpg` | 公開MP4の8.0秒地点の実フレーム。720×1280 | ✅ Latest / NEWS + Gallery |
| b44-03 | — | 投票方法案内。他出場者・オーナーサポーター名・古い順位表示のため非掲載 | ❌ 自己ホストしない。NEWSは既存人物写真 |
| b44-04 | — | SHOWROOM 30日連続配信記念日。配信画面に視聴者の表示名・アイコン・コメントがあるため非掲載 | ❌ 自己ホストしない。NEWSはテキストのみ |

### 元素材と安全確認

- provenance: `owner-provided`。SNSから再取得していない。受領バイトを変えず
  `media/original/` のgitignored領域へ保存し、元の受け渡し名・URL・file IDは
  tracked/public filesへ残さない
- b44-01元動画: 853,891 bytes / sha256
  `4039c74c2dcaa3c8218ef74fbb9381d84bcfcd7ba76264a4f1bf19c5a77150b7` /
  H.264 High / 720×1280 / 30fps / 150 frames / video 5.000秒 /
  音声ストリームなし
- b44-02元動画: 4,162,416 bytes / sha256
  `bd11cc6f148c20bd4b44657e4cd821ca0dba2e7a7667471ee7d38cb0b7da3a38` /
  H.264 High / 720×1280 / 30fps / 600 frames / video 20.000秒 /
  HE-AAC 44.1kHz stereo音声あり
- b44-03元動画: 10,102,650 bytes / sha256
  `d6a49ab85000654ff8b3a7ee6a173fd6caef45b1239616ef759d5b847d45278d` /
  H.264 High / 720×1280 / 30fps / 810 frames / video 27.000秒 /
  HE-AAC 44.1kHz stereo音声あり。公開派生は作っていない
- b44-04元動画: 573,756 bytes / sha256
  `891d55181bab9e5911bb32acede063ee07b304c5823dd4e5248d8513c62a3be3` /
  H.264 High / 720×1280 / 1fps / 20 frames / video 20.000秒 /
  HE-AAC 48kHz stereo音声あり。公開派生は作っていない
- 元動画の`creation_time`とCore Media handler名は受領検査だけに使い、投稿日・
  投稿時刻の根拠にはしていない
- b44-01 / b44-02 に識別可能な第三者は見当たらない。Story下部の本人プロフィール
  チップは作者自身の帰属表示のため維持し、cropしていない。b44-02の1位は投稿時点の記録
- b44-03は他出場者の顔・名前、オーナーサポーター名、古い順位表示を含むため非掲載
- b44-04はSHOWROOM配信画面の視聴者表示名・アイコン・コメントを含むため非掲載

### 音声と公開派生

元素材の音声は内容・由来・権利者と再配信権を確認できないため、公開派生では削除した。
映像は720×1280、元のfpsとフレーム数を維持し、crop・scale・引き伸ばし・
アップスケール・短縮・テロップ変更はしていない。AI生成・顔補正・生成塗り足しもない。

- b44-01 MP4: 102,549 bytes / H.264 Constrained Baseline / 5.000秒 /
  30fps / 150フレーム / 音声なし / metadata・chapterなし / `+faststart` / sha256
  `661cc821dcbe94dd76703648fa812101375c18941d0a062f0f767865a07efab9`
- b44-01 poster: 54,762 bytes / metadataなし / sha256
  `769fed399973b8bd8ef915d88d47254ccd792a9bf1c7c72628e1fad8e569c77b`
- b44-02 MP4: 371,605 bytes / H.264 Constrained Baseline / 20.000秒 /
  30fps / 600フレーム / 音声なし / metadata・chapterなし / `+faststart` / sha256
  `a59d8adec43f01139fdb6b11293eb2369f68776daf90af82b269618ab1777629`
- b44-02 poster: 67,048 bytes / metadataなし / sha256
  `398b653bdaada3949ef3ca01c1f0a6a099a5f8eb74d6f2553945a5bbc86ac403`

エンコードコマンド（再現用）:

```
ffmpeg -i media/original/mily-b44-01-paton-vote-15x-emergency-story.mp4 \
  -map 0:v:0 -an \
  -map_metadata -1 -map_metadata:s:v -1 -map_chapters -1 \
  -c:v libx264 -profile:v baseline -level 3.1 -bf 0 -crf 23 -preset slow \
  -pix_fmt yuv420p -fps_mode passthrough -movflags +faststart \
  public/media/gallery/mily-b44-01-paton-vote-15x-emergency-story.mp4
```

## 素材台帳（batch b44 / source date 2026-08-31）

8/31 07:34 の本人Xお礼投稿。受領したSHOWROOM画面には
視聴者名・アバターが多数写るため、NEWS・Galleryを含む公開面では使わない。
NEWSはテキストと本人Xの恒久permalinkだけを掲載し、X画像CDNは参照しない。
受け渡し用のホスト名・file ID・元素材ファイル名は tracked text に残さない。
公開ファイルは置かない。プライバシー安全な加工済み画像が別途承認されるまで
画像なしを維持する。

出典: `https://x.com/Mily_chan36/status/2094192106105659650`

## 素材台帳（Fan Room voice / 受領日・source date 2026-08-26）

2026-08-26夜のSHOWROOMファンルーム音声メッセージ。Latest / NEWS専用。
Gallery・`media.ts`・`galleryVideos.ts`・Drive Gallery・`/stories/` には含めない。
Fan Roomの生スクリーンショット（前後ナビ・再生UI）は公開していない。

オーナーが当該投稿のサイト内再生を明示依頼。SHOWROOMファンルームページは
iframeできないため、公開ルームプロフィール API の `voice_list` から得た
本人音声（id 88767403 / 2026-08-26T22:36:52+09:00）を自己ホストする。

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| Fan Room voice | `news/mily-b27-01-girl-award-event-voice.m4a` | ガルアワイベ最終日のお礼音声。約20.8秒 / AAC-LC / 12kHz / mono | ✅ Latest / NEWS のみ |

確認済み:

- provenance: owner-requested（オーナーが当該Fan Room音声のサイト内再生を依頼。SNSから取得していない）
- 元素材は `media/original/mily-b27-01-girl-award-event-voice.m4a` に受領バイトを変えず保管（gitignore済み・コミットしない）
  sha256: `33da6fc2a45f51d7df767e10286429313092d576e018f5c911167e19fb588fc1`
- 元素材の実測: 72,203 bytes / M4A / AAC-LC / 12,000 Hz / mono / 20.82秒 / `creation_time` 2026-08-26T13:36:29Z
- 公開派生: 89,084 bytes / M4A / AAC-LC / 12,000 Hz / mono / 20.82秒 / sha256
  `22d00d249e252f3d8da76cbfe1017bd1717954a904c589829174263b94c94468`
- metadata除去済み（`-map_metadata -1` / `-map_chapters -1`）。`creation_time` は残っていない
- `+faststart` 確認済み（`moov` offset 28 < `mdat` offset 1770）
- SHOWROOM CDN URL は公開データへ残さない。hotlinkしない
- 音声はみりぃ本人のFan Roomボイスメモ。BGM権利が不明な動画音声の無音化ルールとは別判断
- AI生成・加工なし

## 素材台帳（batch b45 / 受領日・source date 2026-08-31）

オーナーが直接提供した本人Instagram Story動画1本。みりぃがCAMPUS GIRLS 2027の
Paton投票（9月1日まで）と、31日は応援が1.5倍になって届くことを肉声で呼びかけている。
画面上部に「投票はこちらから」のスタンプがある。owner-provided。SNSから再取得していない。

HOME Latest / `/news/` と Gallery が、公開MP4・poster・manifest objectを共有する。
CAMPUS GIRLS Activity の関連NEWS・関連メディアにも出す。恒久的なStory permalinkは
ないため、表示は非リンクの `Instagram Story` labelとする。`/stories/`、highlights、
events、streamSchedule、`media.ts`、PatonVoteGuide のランキング系列には追加しない。

オーナーが本人肉声の保持を明示依頼したため、公開派生でも AAC 音声を残す。
権利が不明な個人Storyで無音化した過去案件、および Fan Room 音声・b19 番組Story
の保持判断とは別件であり、この依頼範囲に限る。

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b45-01 | `gallery/mily-b45-01-paton-vote-voice-story.mp4` | 室内で眼鏡スタンプをつけたみりぃがPaton投票を呼びかける縦型動画。720×1280 / 32.400秒 / 30fps / 972フレーム / H.264 Baseline + AAC | ✅ Latest / NEWS + Gallery + CAMPUS GIRLS Activity |
| b45-01 poster | `gallery/mily-b45-01-paton-vote-voice-story-poster.jpg` | 公開MP4の3.0秒地点の実フレーム。720×1280 | ✅ Latest / NEWS + Gallery |

### 元素材の実測

- provenance: `owner-provided`（オーナー指定の受け渡しファイル。SNSから取得していない）
- Instagram Story / source date: `2026-08-31` / 恒久permalinkなし
- 元素材は `media/original/mily-b45-01-paton-vote-voice-story.mp4` に
  受領バイトを変えず保管（gitignore済み・コミットしない）
- sha256: `9fc67b064ea03b7fd4d3007d3be2a71ced0f1741586a404ceee4872bf714187c`
- 40,314,111 bytes / H.264 **High** / **720×1280** / 30fps /
  972 frames / **32.400秒** / yuv420p
- 音声: HE-AAC / 44.1kHz / stereo。オーナーが本人肉声の保持を明示依頼したため、
  公開派生でも音声を保持する
- chapterなし
- 公開派生ではmetadataを除去した。投稿時刻は推測して記録しない
- 識別可能な第三者は見当たらない。Story上部の「投票はこちらから」スタンプと
  眼鏡スタンプは元動画のまま維持し、cropしていない

### 公開MP4

- sha256: `c3d407c8be9e05cc0b28bbea86441fbd5795eaa79edd0747473a7ab3a25f0fd1`
- 7,936,073 bytes / H.264 **Constrained Baseline** / **720×1280** /
  30fps / 972 frames / 32.400秒 / yuv420p / `has_b_frames` 0 /
  AAC-LC 128k / 44.1kHz stereo
- 元素材の画素数・縦横比・30fps・映像フレーム数を維持。
  crop・scale・引き伸ばし・アップスケール・fps水増しなし（`-vf scale`を使っていない）
- `+faststart`確認済み（`moov` が `mdat` より前）
- metadata除去確認済み（`-map_metadata -1` / `-map_metadata:s:v -1` /
  `-map_metadata:s:a -1` / `-map_chapters -1`）。元の`creation_time`と
  `Core Media`は残っていない
- AI生成・AI加工・顔補正・generative fill・outpainting・テロップ削除・短縮なし

エンコードコマンド（再現用）:

```
ffmpeg -i media/original/mily-b45-01-paton-vote-voice-story.mp4 \
  -map 0:v:0 -map 0:a:0 \
  -map_metadata -1 -map_metadata:s:v -1 -map_metadata:s:a -1 -map_chapters -1 \
  -c:v libx264 -profile:v baseline -level 3.1 -bf 0 -crf 23 -preset slow \
  -pix_fmt yuv420p -fps_mode passthrough \
  -c:a aac -b:a 128k \
  -movflags +faststart \
  public/media/gallery/mily-b45-01-paton-vote-voice-story.mp4
```

### poster / 共有範囲

- 公開MP4の3.0秒地点。笑顔と組んだ手が自然に見え、Storyスタンプが読みやすく、
  極端な瞬きやブレが少ないため採用
- 公開MP4の実フレームから生成。AI生成・顔加工・塗り足しなし
- 46,458 bytes / 720×1280 JPEG / sha256
  `59bfdef3ebab3fea1bfbf82cebae62fb8baa52255f6c632ab332b22529232572`
- EXIF / IPTC / XMP / ICCなし
- `src/data/patonVoteVoiceStoryVideo.json` の1オブジェクトを
  Latest / NEWS / Gallery / CAMPUS GIRLS Activity で共有し、公開MP4 1本・poster 1枚
  だけを参照する
- InstagramプロフィールURLやStoryの推測permalinkを出典として代用していない
- 受け渡し用URL / file IDは公開情報へ残さない

poster生成コマンド（再現用）:

```
ffmpeg -ss 3.0 -i public/media/gallery/mily-b45-01-paton-vote-voice-story.mp4 \
  -frames:v 1 -q:v 4 -map_metadata -1 \
  public/media/gallery/mily-b45-01-paton-vote-voice-story-poster.jpg
```

## 素材台帳（batch b46 / 受領日・source date 2026-09-01）

オーナーが直接提供した本人Instagram Story動画2本。みりぃがPaton投票最終日を
呼びかけている動画と、9月のあいさつ動画。owner-provided。SNSから再取得していない。

HOME Latest / `/news/` と Gallery が、各Storyの公開MP4・poster・manifest objectを
共有する。b46-01は CAMPUS GIRLS Activity の関連NEWS・関連メディアにも出す。
b46-02は画面が9月のあいさつのため Activities には関連付けない。
本人X `2026-09-01-ohayo-september-x` は同じb46-02公開MP4・posterを wrapper
（`mily-b46-02-september-mily-x-post`）で Latest / NEWS に再利用する。
新しい公開ファイルは作らない。SNS CDN は hotlink しない。
Gallery tile は `septemberMilyStoryVideo` の1本のまま。Latest は X と Story の2カード。
Xカードの `sourceLabel` は `Xの投稿を見る`。Instagram Story とは別カード。

2件のInstagram Story NEWSは恒久的なStory permalinkがないため、表示は非リンクの
`Instagram Story` labelとする。
`/stories/`、highlights、events、streamSchedule、`media.ts`、
PatonVoteGuide のランキング系列には追加しない。

2件のInstagram Story NEWSには本人Instagramプロフィールと、確認済みPaton本人ページへの
2 CTAを置く。InstagramプロフィールはStoryの出典ではなく関連リンク。Paton CTAは既存の
SupportEvent期間（2026-09-01 23:59 JSTまで）に従い、終了後に自動で非表示になる。
XあいさつNEWSにはPaton CTAもInstagram CTAも付けない。

元動画に音声ストリームはない。公開派生も video-only。

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b46-01 | `gallery/mily-b46-01-paton-vote-final-day-story.mp4` | パンダフィルターとコーンドッグでPaton投票最終日を呼びかける縦型動画。720×1280 / 5.567秒 / 30fps / 167フレーム / video-only | ✅ Latest / NEWS + Gallery + CAMPUS GIRLS Activity |
| b46-01 poster | `gallery/mily-b46-01-paton-vote-final-day-story-poster.jpg` | 公開MP4の2.0秒地点の実フレーム。720×1280 | ✅ Latest / NEWS + Gallery |
| b46-02 | `gallery/mily-b46-02-september-mily-story.mp4` | くまフィルターとヘッドホンで9月のあいさつをする縦型動画。720×1280 / 3.067秒 / 30fps / 92フレーム / video-only | ✅ Latest / NEWS（Storyカード＋Xカードが同じ公開ファイル）+ Gallery（1本） |
| b46-02 poster | `gallery/mily-b46-02-september-mily-story-poster.jpg` | 公開MP4の1.0秒地点の実フレーム。720×1280 | ✅ Latest / NEWS（Storyカード＋Xカードが同じ公開ファイル）+ Gallery（1本） |

### 元素材と安全確認

- provenance: `owner-provided`。SNSから再取得していない。受領バイトを変えず
  `media/original/` のgitignored領域へ保存し、元の受け渡し名・URL・file IDは
  tracked/public filesへ残さない
- b46-01元動画: 7,222,368 bytes / sha256
  `3d3efbef8cc81f7056d8c6a137734be8e7d56544dd337a087c025b7df10d6432` /
  H.264 High / 720×1280 / r_frame_rate 30/1（avg_frame_rate はソースtimebase由来の
  855040/28503） / 167 frames / video 5.567秒 /
  音声ストリームなし
- b46-02元動画: 4,112,409 bytes / sha256
  `0e9d3e95ba08e2426e02ffe063884c5483c4f5834e2a7e912b0a8b8203868d2b` /
  H.264 High / 720×1280 / 30fps / 92 frames / video 3.067秒 /
  音声ストリームなし
- 元動画の`creation_time`とCore Media handler名は受領検査だけに使い、投稿日・
  投稿時刻の根拠にはしていない
- 2本ともInstagram UI、DM、通知、端末固有情報、連絡先、第三者コメントは含まれない。
  識別可能な第三者は見当たらない

### 音声と公開派生

元素材に音声ストリームがないため、公開派生も video-only。
映像は720×1280、元のfpsとフレーム数を維持し、crop・scale・引き伸ばし・
アップスケール・短縮・テロップ変更はしていない。AI生成・顔補正・生成塗り足しもない。

- b46-01 MP4: 1,531,871 bytes / H.264 Constrained Baseline / 5.567秒 /
  30fps / 167フレーム / 音声なし / metadata・chapterなし / `+faststart` / sha256
  `ddac08f2be2f5787e38d2f36f2594826205625da2c2dc43d0c3780b697eca455`
- b46-01 poster: 68,288 bytes / metadataなし / sha256
  `c15c9ce5928a75b6aff52ed45f7b50fc24369db406fac5dba198a2e5e0bf2dae`
- b46-02 MP4: 1,550,405 bytes / H.264 Constrained Baseline / 3.067秒 /
  30fps / 92フレーム / 音声なし / metadata・chapterなし / `+faststart` / sha256
  `d7ca9431c53ef2166333adcde051a2a33af411801d496fd55514e748e04621f4`
- b46-02 poster: 75,904 bytes / metadataなし / sha256
  `f48a37896f24838ab850978312d2611ac19a86ee54de65c1bcd01d3ebc425105`

エンコードコマンド（再現用）:

```
ffmpeg -i media/original/mily-b46-01-paton-vote-final-day-story.mp4 \
  -map 0:v:0 -an \
  -map_metadata -1 -map_metadata:s:v -1 -map_chapters -1 \
  -c:v libx264 -profile:v baseline -level 3.1 -bf 0 -crf 23 -preset slow \
  -pix_fmt yuv420p -fps_mode passthrough -movflags +faststart \
  public/media/gallery/mily-b46-01-paton-vote-final-day-story.mp4
```

```
ffmpeg -i media/original/mily-b46-02-september-mily-story.mp4 \
  -map 0:v:0 -an \
  -map_metadata -1 -map_metadata:s:v -1 -map_chapters -1 \
  -c:v libx264 -profile:v baseline -level 3.1 -bf 0 -crf 23 -preset slow \
  -pix_fmt yuv420p -fps_mode passthrough -movflags +faststart \
  public/media/gallery/mily-b46-02-september-mily-story.mp4
```

### poster / 共有範囲

- b46-01は公開MP4の2.0秒地点。目が開いており、コーンドッグとStoryスタンプが
  読みやすく、極端な瞬きや口の開きが少ないため採用
- b46-02は公開MP4の1.0秒地点。目が開いており、手書きのあいさつが読みやすいため採用
- 公開MP4の実フレームから生成。AI生成・顔加工・塗り足しなし
- EXIF / IPTC / XMP / ICCなし
- `src/data/patonVoteFinalDayStoryVideo.json` と
  `src/data/septemberMilyStoryVideo.json` の各1オブジェクトを
  Latest / NEWS / Gallery で共有し、公開MP4 1本・poster 1枚だけを参照する。
  b46-01は CAMPUS GIRLS Activity でも同じオブジェクトを使う
- InstagramプロフィールURLやStoryの推測permalinkを出典として代用していない
- 受け渡し用URL / file IDは公開情報へ残さない

poster生成コマンド（再現用）:

```
ffmpeg -ss 2.0 -i public/media/gallery/mily-b46-01-paton-vote-final-day-story.mp4 \
  -frames:v 1 -q:v 4 -map_metadata -1 \
  public/media/gallery/mily-b46-01-paton-vote-final-day-story-poster.jpg
```

```
ffmpeg -ss 1.0 -i public/media/gallery/mily-b46-02-september-mily-story.mp4 \
  -frames:v 1 -q:v 4 -map_metadata -1 \
  public/media/gallery/mily-b46-02-september-mily-story-poster.jpg
```

## 素材台帳（batch b47 / 受領日・source date 2026-09-02）

オーナーが直接提供した本人Instagram Story動画2本。みりぃが翌日9:00の
SHOWROOMを案内するおやすみ動画と、Paton投票を2位で締められたお礼動画。
owner-provided。SNSから再取得していない。公開ファイルは既にブランチへ
コミット済みで、再エンコードしていない。

HOME Latest / `/news/` と Gallery が、各Storyの公開MP4・poster・manifest
objectを共有する。b47-01は LIVE STREAM Activity、b47-02は CAMPUS GIRLS
Activity の関連NEWS・関連メディアにも出す。
恒久的なStory permalinkはないため、表示は非リンクの `Instagram Story`
labelとする。`/stories/`、highlights、events、streamSchedule、`media.ts`、
PatonVoteGuide のランキング系列には追加しない。

公開派生は video-only（音声ストリームなし）。映像は720×1280。posterは
公開MP4の実フレーム。元素材は gitignored の `media/original/` に留め、
台帳には公開ファイル名と公開ファイルの sha256 だけを書く。

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b47-01 | `gallery/mily-b47-01-oyasumily.mp4` | パンダ耳フィルターでおやすみと翌日9:00 SHOWROOM案内をする縦型動画。720×1280 / 6.000秒 / 20fps / 120フレーム / H.264 / video-only | ✅ Latest / NEWS + Gallery + LIVE STREAM Activity |
| b47-01 poster | `gallery/mily-b47-01-oyasumily-poster.jpg` | 公開MP4の実フレーム。720×1280 | ✅ Latest / NEWS + Gallery |
| b47-02 | `gallery/mily-b47-02-paton-second.mp4` | Paton順位画面で2位お礼と面接を頑張ると伝える縦型動画。720×1280 / 20.000秒 / 30fps / 600フレーム / H.264 / video-only | ✅ Latest / NEWS + Gallery + CAMPUS GIRLS Activity |
| b47-02 poster | `gallery/mily-b47-02-paton-second-poster.jpg` | 公開MP4の実フレーム。720×1280 | ✅ Latest / NEWS + Gallery |

### 公開ファイル（sha256 は公開派生のみ）

- provenance: `owner-provided`。SNSから再取得していない
- Instagram Story。恒久permalinkなし。`sourceUrl` は持たない
- 公開MP4は video-only、`+faststart`
- posterは公開MP4の実フレーム。AI生成・顔補正・生成塗り足しなし
- b47-01 MP4: 6,394,851 bytes / 720×1280 / 6.000秒 / sha256
  `3650d5e6f11e7343e61478aa69c5ce015dd05301e1f5f4870c837e5570b1b059`
- b47-01 poster: 65,079 bytes / 720×1280 / sha256
  `f9c928a81261acd479f4ebd19d7b244b8bad8eb83bf8338e6631f90e859128b0`
- b47-02 MP4: 9,573,726 bytes / 720×1280 / 20.000秒 / sha256
  `492198f87ff18a8d35d5aa006f5cde13d67d73064477f3de6cd0f1e086e2ac8c`
- b47-02 poster: 96,954 bytes / 720×1280 / sha256
  `4d366982e976c7a321413255a127d6d59dcea8d42e0b8f8644a665afcfcd6810`
- `src/data/oyasumilyStoryVideo.json` と
  `src/data/patonSecondStoryVideo.json` の各1オブジェクトを
  Latest / NEWS / Gallery で共有し、公開MP4 1本・poster 1枚だけを参照する

## 素材台帳（batch b48 / 受領日・source date 2026-09-01）

オーナーが直接提供した 2026-09-01 SHOWROOM のボード画面。
視聴者コメント画面ではない。SNSから再取得していない。
HOME Latest / `/news/` 専用。Gallery / `media.ts` / `galleryVideos.ts` /
`/stories/` には出さない。

元素材は gitignored の `media/original/` に留め、台帳には公開ファイル名だけを書く。
受け渡し用URL / file ID / 添付ハッシュは tracked text へ残さない。

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b48-01 | `news/mily-b48-01-tomato-nutrient-ackey.jpg` | あっきーさんボード。ボード寄り。「トマトの栄養素 ♡」「1人目」「あっきーさん！！」 | ✅ Latest / NEWS 代表（カードの顔）。Gallery 非掲載 |
| b48-02 | `news/mily-b48-02-ackey-point.jpg` | 同じボード。指差し | ✅ additionalMedia。Gallery 非掲載 |
| b48-03 | `news/mily-b48-03-ackey-prepose.jpg` | 同じボード。ポーズ直前 | ✅ additionalMedia。Gallery 非掲載 |
| b48-04 | `news/mily-b48-04-ackey-cheek.jpg` | 同じボード | ✅ additionalMedia。Gallery 非掲載 |
| b48-05 | `news/mily-b48-05-ackey-headpoint.jpg` | 同じボード。頭を指さす | ✅ additionalMedia。Gallery 非掲載 |
| b48-06 | `news/mily-b48-06-fanmark-yasupi.jpg` | やすぴさんボード。「ファンマーク」とトマトの絵、「2人目」「やすぴ。さん♪」 | ✅ additionalMedia 末尾のみ。Gallery 非掲載 |

### 公開ファイル

- provenance: `owner-provided`。SNSから再取得していない
- source date: `2026-09-01`。再生permalinkなし。`sourceUrl` は null
- 公開JPEGは収録の実寸 640×360。拡大しない。EXIF / GPS / IPTC / XMP / ICC なし
- crop・mask・AI加工・顔補正・生成塗り足しなし
- NEWS カード表示より大きくないため、480 / 960 / 1600 の派生は作らない
- 代表はあっきーさんボード（b48-01）。やすぴさんボードは additionalMedia の末尾のみ

## 素材台帳（batch b49 / 受領日・source date 2026-09-02）

オーナーが直接提供した、本人配布の三次審査配信タイムテーブル。
実写ポートレートではない。AI生成・再描画はしていない。
元素材は `media/original/`（gitignore）で保持し、公開用はメタデータを除去して再エンコードした。
既存 NEWS `2026-09-02-miss-circle-third-round` の代表画像。
HOME Latest / `/news/` 専用。Gallery / `media.ts` / `galleryVideos.ts` /
`/stories/` には出さない。

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b49-01 | `news/mily-b49-01-third-round-timetable-public.jpg` | みりぃの配信タイムテーブル（ミスサークルコンテスト2026 3次審査）。1206×950。owner-provided source の公開用派生 | ✅ 既存三次審査 NEWS の代表。Gallery 非掲載 |

- provenance: `owner-provided`。SNSから再取得していない
- source date: `2026-09-02`。再生permalinkなし。`sourceUrl` は null
- 公開JPEGは実寸 1206×950。拡大・crop・mask・AI加工・顔補正・生成塗り足しなし。EXIF / IPTC / XMP / ICC は除去済み
- NEWS 専用のため、480 / 960 / 1600 の Gallery 派生は作らない
- 公開派生 sha256 `bf4d4c5f6396bebe9c4a74ae3a5143d226e2b5a537e46ea30d850fed1dc169f9`

## 素材台帳（batch b50 / 受領日・source date 2026-09-03）

オーナーが直接提供した、本人Instagram Storyで共有された三次審査案内2画像と
応援方法の短尺動画。恒久的なStory permalinkはないため、推測URLや受け渡し情報を
公開データへ残さない。既存NEWS `2026-09-02-miss-circle-third-round` の
`additionalMedia` 専用とし、代表のb49-01に続けて目標、審査日程、応援方法動画の順で表示する。
Gallery / `media.ts` / `galleryVideos.ts` / `/stories/` には出さない。

### 掲載承認

- approval date: `2026-09-03`
- オーナー本人が本タスクで添付したb50-01、b50-02、b50-03の3素材について、
  `https://mily-fan-site.vercel.app` への掲載とマージを明示承認した。
- 承認対象面は既存三次審査NEWSの `additionalMedia`（HOME Latestから同NEWSへ遷移する表示を含む）。
  Gallery、`/stories/`、別NEWSへの掲載承認は含めず、複製しない。
- b50-03 posterは承認済みb50-03動画の実フレームで、同動画のposter用途だけに使用する。

| ID | 公開ファイル | 内容 | 掲載・承認 |
| --- | --- | --- | --- |
| b50-01 | `news/mily-b50-01-third-round-goals.jpg` | アバター権獲得、投票と100キラでの応援、ファイナルまで応援したい仲間との出会いを掲げた目標画像。864×1536 | ✅ 2026-09-03 明示承認。既存三次審査NEWS additionalMedia。Gallery非掲載 |
| b50-02 | `news/mily-b50-02-third-round-review-schedule.jpg` | WEB投票、SHOWROOM無料ギフト審査、SHOWROOMイベント審査の期間をまとめた画像。864×1536 | ✅ 2026-09-03 明示承認。既存三次審査NEWS additionalMedia。Gallery非掲載 |
| b50-03 | `news/mily-b50-03-third-round-support-method.mp4` | 1日1回のWEB投票、1日100個までの無料キラキラ星、指定ギフトでの応援方法を案内する縦型動画。512×910 / 5.000秒 / 30fps / video-only | ✅ 2026-09-03 明示承認。既存三次審査NEWS additionalMedia。Gallery非掲載 |
| b50-03 poster | `news/mily-b50-03-third-round-support-method-poster.jpg` | 公開MP4の2.5秒地点の実フレーム。512×910 | ✅ 承認済みb50-03動画のposter専用 |

### 元素材と安全確認

- provenance: `owner-provided`。SNSから再取得していない
- source date: `2026-09-03`。Instagram Storyの恒久permalinkなし。`sourceUrl`はnull
- 2画像と動画に、DM・通知・端末固有情報・連絡先・第三者コメント・識別可能な第三者は見当たらない
- 元素材はgitignoredの`media/original/`へ無改変で保存。元の受け渡し名・URL・file IDはtracked/public filesへ残さない
- crop・scale・テロップ変更・AI生成・顔補正・生成塗り足しなし

### 公開派生

- b50-01 JPEG: 864×1536 / EXIF・IPTC・XMP・ICCなし / sha256
  `7be4ce8f9a15d1a80ec2bb0175d8205851f2e9c93f93118cb4fa7b01061cbb48`
- b50-02 JPEG: 864×1536 / EXIF・IPTC・XMP・ICCなし / sha256
  `ca36e6663e7fc2c1464706d966109893972315b1d1a36a6d9dd76ec02fc904f4`
- b50-03 MP4: H.264 Constrained Baseline / 512×910 / 5.000秒 / 30fps / 150フレーム /
  video-only / `+faststart` / 元のcreation_timeとCore Media metadataなし / sha256
  `7e90c1ff29f88ade92a9cec6a30a285255f7fcaf9eacdda99b18f4fa37010930`
- b50-03 poster: 公開MP4の2.5秒地点の実フレーム / metadataなし / sha256
  `3786b3ec766fd4de224bcd030590a583119ccc35122c6383d358686d9d7bf36e`

## 素材台帳（batch b51 / 受領日・source date 2026-09-02）

オーナー提供の 2026-09-02 SHOWROOM 朝ラジオ配信録画から切り出した、
配信中に使われていた静止画の実フレーム1枚。顔出しなしラジオ枠の画面。
視聴者のコメント・アイコン・表示名は写っていない。
LIVE STREAM の朝・夜配信メモで同じ1枚を共有する。NEWS / Gallery / `media.ts` /
`galleryVideos.ts` / `/stories/` には出さない。
`media.ts` は Gallery の掲載ゲートであり、配信カード専用の1枚は
NEWS専用JPEGと同じくそこに入れない。

### 掲載承認

- approval date: `2026-09-03`
- オーナーが当該ラジオ配信について、動画からスクショを取り配信コーナーへ
  画像を載せることを明示依頼した。承認対象面は LIVE STREAM Activity の
  朝・夜配信メモ。Gallery / NEWS へは流用しない。

| ID | 公開ファイル | 内容 | 掲載・承認 |
| --- | --- | --- | --- |
| b51-01 | `live/mily-b51-01-morning-radio-showroom.jpg` | 室内の木の椅子に座るみりぃ。白いトップス、黒いスカート、白い靴下。640×360。画面にSHOWROOMとみりぃの文字。owner-provided 録画の実フレーム | ✅ 2026-09-03 明示承認。朝・夜の配信メモ。Gallery / NEWS 非掲載 |

### 元素材と安全確認

- provenance: `owner-provided`。SNSから再取得していない
- source date: `2026-09-02`。再生permalinkなし。`sourceUrl` は null
- 視聴者コメント・アイコン・表示名・端末情報・DMは見当たらない
- 元素材は gitignored の `media/original/` へ保存。受け渡しURL / file ID /
  録画ファイル名は tracked text へ残さない
- crop・mask・AI加工・顔補正・生成塗り足しなし。収録の実寸 640×360 のまま拡大しない
- 録音音声・画面録画・全文文字起こしは公開しない

### 公開派生

- 公開JPEG: 640×360 / EXIF・IPTC・XMP・ICCなし / 43,836 bytes / sha256
  `a00eea08f642532348bc967ad3adeb130494a6828d1306f5fe23a0198490c4a8`
- LIVE STREAM 専用のため、480 / 960 / 1600 の Gallery 派生は作らない

## 素材台帳（batch b52 / 受領日・source date 2026-09-03）

オーナー提供の 2026-09-03 SHOWROOM 三次初日朝配信録画から切り出した、
かわいい実フレーム10枚。顔出し枠。コメント・視聴者アイコン・表示名・
他出場者のランキングは写らないようカメラ付近だけを切り出している。
LIVE STREAM の三次初日朝配信メモ専用。NEWS / Gallery / `media.ts` /
`galleryVideos.ts` / `/stories/` には出さない。
代表1枚（b52-01）をサムネにし、10枚を保存できるZIPも同じディレクトリに置く。

### 掲載承認

- approval date: `2026-09-04`
- オーナーが当該朝配信について、かわいいところ・事故になっていないところを
  約10枚スクショし、ベストショットをサムネにして配信コーナーへ載せ、
  10枚を保存できるようにしてほしいと明示依頼した。
  承認対象面は LIVE STREAM Activity の配信メモ。Gallery / NEWS へは流用しない。

| ID | 公開ファイル | 内容 | 掲載・承認 |
| --- | --- | --- | --- |
| b52-01 | `live/mily-b52-01-peace-smile.jpg` | ベストショット。400×228。サムネ | ✅ 2026-09-04 明示承認。LIVE STREAM。Gallery / NEWS 非掲載 |
| b52-02 | `live/mily-b52-02-peace.jpg` | 手を振る | ✅ 同上 |
| b52-03 | `live/mily-b52-03-peace-talk.jpg` | 顔を上げて話す | ✅ 同上 |
| b52-04 | `live/mily-b52-04-smile.jpg` | 微笑み | ✅ 同上 |
| b52-05 | `live/mily-b52-05-talk-smile.jpg` | 話す笑顔 | ✅ 同上 |
| b52-06 | `live/mily-b52-06-talk.jpg` | 話す | ✅ 同上 |
| b52-07 | `live/mily-b52-07-look.jpg` | こちらを見て話す | ✅ 同上 |
| b52-08 | `live/mily-b52-08-soft-smile.jpg` | やわらかい笑顔 | ✅ 同上 |
| b52-09 | `live/mily-b52-09-later.jpg` | 中盤 | ✅ 同上 |
| b52-10 | `live/mily-b52-10-board.jpg` | ホワイトボードの話のころ | ✅ 同上 |
| b52-zip | `live/mily-b52-gachi-morning-stills.zip` | 上記10枚の保存用ZIP | ✅ 同上 |

### 元素材と安全確認

- provenance: `owner-provided`。SNSから再取得していない
- source date: `2026-09-03`。再生permalinkなし。`sourceUrl` は null
- 視聴者コメント・アイコン・表示名・他出場者名・端末情報・DMは見当たらない
- 元素材は gitignored の `media/original/` へ保存。受け渡しURL / file ID /
  録画ファイル名は tracked text へ残さない
- 顔補正・AI生成・生成塗り足しなし。収録 640×360 からカメラ付近を切り出しただけで拡大していない
- 録音音声・画面録画・全文文字起こしは公開しない

### 公開派生

- 各JPEG: 400×228 / EXIF・IPTC・XMP・ICCなし
- b52-01 sha256 `4d5e1e779c243d11fca7dd72e7c0647bb098260ab3340a14dfe2269562e229f4`
- LIVE STREAM 専用のため、480 / 960 / 1600 の Gallery 派生は作らない

## 素材台帳（batch b53 / 受領日・source date 2026-09-03）

オーナー提供の 2026-09-03 SHOWROOM 三次初日夜配信録画から切り出した、
実フレーム2枚。顔出し枠。コメント・視聴者アイコン・表示名・
他出場者は写らないようカメラ付近だけを切り出している。
LIVE STREAM の三次初日夜配信メモ専用。NEWS / Gallery / `media.ts` /
`galleryVideos.ts` / `/stories/` には出さない。
代表1枚（b53-01）をサムネにし、2枚を保存できるZIPも同じディレクトリに置く。
以前は data URI として TypeScript に埋め込んでいたが、Drive ID 形状の誤検知を
避けるため JPEG ファイルへ移した。写っている内容は同じ。

### 掲載承認

- approval date: `2026-09-04`
- オーナーが当該夜配信の実フレームを配信コーナーへ載せることを承認済み。
  承認対象面は LIVE STREAM Activity の配信メモ。Gallery / NEWS へは流用しない。

| ID | 公開ファイル | 内容 | 掲載・承認 |
| --- | --- | --- | --- |
| b53-01 | `live/mily-b53-01-surprise-choker.jpg` | ベストショット。びっくり。400×228。サムネ | ✅ 2026-09-04 承認。LIVE STREAM。Gallery / NEWS 非掲載 |
| b53-02 | `live/mily-b53-02-whiteboard.jpg` | ホワイトボード | ✅ 同上 |
| b53-zip | `live/mily-b53-gachi-night-stills.zip` | 上記2枚の保存用ZIP | ✅ 同上 |

### 元素材と安全確認

- provenance: `owner-provided`。SNSから再取得していない
- source date: `2026-09-03`。再生permalinkなし。`sourceUrl` は null
- 視聴者コメント・アイコン・表示名・他出場者名・端末情報・DMは見当たらない
- 元素材は gitignored の `media/original/` へ保存。受け渡しURL / file ID /
  録画ファイル名は tracked text へ残さない
- 顔補正・AI生成・生成塗り足しなし
- 録音音声・画面録画・全文文字起こしは公開しない

### 公開派生

- 各JPEG: 400×228 / EXIF・IPTC・XMP・ICCなし
- b53-01 sha256 `8edf5d2564baff208dd1fae790952675d64abf4bb28f88dd4d4c8342f63992c0`
- LIVE STREAM 専用のため、480 / 960 / 1600 の Gallery 派生は作らない

## 素材台帳（batch b54 / 受領日・source date 2026-09-04）

オーナー提供の 2026-09-04 SHOWROOM 三次2日目昼配信録画から切り出した、
実フレーム5枚。顔出し枠。コメント・視聴者アイコン・表示名・
他出場者は写らないようカメラ付近だけを切り出している。
LIVE STREAM の三次2日目昼配信メモ専用。NEWS / Gallery / `media.ts` /
`galleryVideos.ts` / `/stories/` には出さない。
代表1枚（b54-01）をサムネにし、5枚を保存できるZIPも同じディレクトリに置く。

### 掲載承認

- approval date: `2026-09-04`
- オーナーが当該昼配信を配信コーナーへ載せることを明示依頼した。
  承認対象面は LIVE STREAM Activity の配信メモ。Gallery / NEWS へは流用しない。

| ID | 公開ファイル | 内容 | 掲載・承認 |
| --- | --- | --- | --- |
| b54-01 | `live/mily-b54-01-hoodie-look.jpg` | ベストショット。灰色パーカー。400×228。サムネ | ✅ 2026-09-04 明示承認。LIVE STREAM。Gallery / NEWS 非掲載 |
| b54-02 | `live/mily-b54-02-talk.jpg` | 話す | ✅ 同上 |
| b54-03 | `live/mily-b54-03-cover-face.jpg` | 目元を両手で覆う | ✅ 同上 |
| b54-04 | `live/mily-b54-04-wipe-tears.jpg` | 涙を拭く | ✅ 同上 |
| b54-05 | `live/mily-b54-05-wave.jpg` | バイバイ | ✅ 同上 |
| b54-zip | `live/mily-b54-gachi-day-stills.zip` | 上記5枚の保存用ZIP | ✅ 同上 |

### 元素材と安全確認

- provenance: `owner-provided`。SNSから再取得していない
- source date: `2026-09-04`。再生permalinkなし。`sourceUrl` は null
- 視聴者コメント・アイコン・表示名・他出場者名・端末情報・DMは見当たらない
- 元素材は gitignored の `media/original/` へ保存。受け渡しURL / file ID /
  録画ファイル名は tracked text へ残さない
- 顔補正・AI生成・生成塗り足しなし。収録 640×360 からカメラ付近を切り出しただけで拡大していない
- 録音音声・画面録画・全文文字起こしは公開しない

### 公開派生

- 各JPEG: 400×228 / EXIF・IPTC・XMP・ICCなし
- b54-01 sha256 `f0056137f6757feab1de6147520ecca5cb418a48116642549b8d610dafdb22b9`
- LIVE STREAM 専用のため、480 / 960 / 1600 の Gallery 派生は作らない

## 素材台帳（batch b55 / 受領日・source date 2026-09-04）

オーナー提供の 2026-09-04 SHOWROOM 三次2日目朝配信録画から切り出した、
実フレーム5枚。顔出し枠。コメント・視聴者アイコン・表示名・
他出場者は写らないようカメラ付近だけを切り出している。
LIVE STREAM の三次2日目朝配信メモ専用。NEWS / Gallery / `media.ts` /
`galleryVideos.ts` / `/stories/` には出さない。
代表1枚（b55-01）をサムネにし、5枚を保存できるZIPも同じディレクトリに置く。

### 掲載承認

- approval date: `2026-09-05`
- オーナーが当該朝配信を配信コーナーへ載せることを明示依頼した。
  承認対象面は LIVE STREAM Activity の配信メモ。Gallery / NEWS へは流用しない。

| ID | 公開ファイル | 内容 | 掲載・承認 |
| --- | --- | --- | --- |
| b55-01 | `live/mily-b55-01-smile.jpg` | ベストショット。笑顔。400×228。サムネ | ✅ 2026-09-05 明示承認。LIVE STREAM。Gallery / NEWS 非掲載 |
| b55-02 | `live/mily-b55-02-talk.jpg` | 話す | ✅ 同上 |
| b55-03 | `live/mily-b55-03-look.jpg` | 見つめて | ✅ 同上 |
| b55-04 | `live/mily-b55-04-board.jpg` | ボードに書く | ✅ 同上 |
| b55-05 | `live/mily-b55-05-hoodie.jpg` | 灰色パーカー | ✅ 同上 |
| b55-zip | `live/mily-b55-gachi-morning-stills.zip` | 上記5枚の保存用ZIP | ✅ 同上 |

### 元素材と安全確認

- provenance: `owner-provided`。SNSから再取得していない
- source date: `2026-09-04`。再生permalinkなし。`sourceUrl` は null
- 視聴者コメント・アイコン・表示名・他出場者名・端末情報・DMは見当たらない
- 元素材は gitignored の `media/original/` へ保存。受け渡しURL / file ID /
  録画ファイル名は tracked text へ残さない
- 顔補正・AI生成・生成塗り足しなし。収録 640×360 からカメラ付近を切り出しただけで拡大していない
- 録音音声・画面録画・全文文字起こしは公開しない

### 公開派生

- 各JPEG: 400×228 / EXIF・IPTC・XMP・ICCなし
- b55-01 sha256 `501f2178cd3ccec5dc6423a5694e50898ba4d7b9835db2fb19ca15d25baa1e16`
- LIVE STREAM 専用のため、480 / 960 / 1600 の Gallery 派生は作らない



## 素材台帳（batch b56 / 受領日・source date 2026-09-05）

オーナー提供の9月5日SHOWROOM朝配信録画から厳選した実フレーム10枚。
2026-09-05にオーナーがレポート・画像のLIVE STREAM掲載を明示依頼。
代表画像はb56-03。各画像の保存リンクと10枚のZIPを配信カードに掲載する。

| ID | 公開ファイル | 場面（録画内の目安） |
| --- | --- | --- |
| b56-01 | `live/mily-b56-01-chin-pose.jpg` | 00:30 あごの下に手 |
| b56-02 | `live/mily-b56-02-soft-smile.jpg` | 04:05 微笑み |
| b56-03 | `live/mily-b56-03-bright-smile.jpg` | 06:53 笑顔 |
| b56-04 | `live/mily-b56-04-cheek-pose.jpg` | 07:53 頬に指 |
| b56-05 | `live/mily-b56-05-singing-point.jpg` | 09:30 歌唱・指さし |
| b56-06 | `live/mily-b56-06-calling-pose.jpg` | 13:30 呼びかけ |
| b56-07 | `live/mily-b56-07-big-laugh.jpg` | 15:18 笑顔 |
| b56-08 | `live/mily-b56-08-playful-glasses.jpg` | 20:17 指めがね |
| b56-09 | `live/mily-b56-09-double-peace.jpg` | 21:05 ダブルピース |
| b56-10 | `live/mily-b56-10-goodbye-smile.jpg` | 23:18 手を振る |
| b56-zip | `live/mily-b56-morning-stills.zip` | 上記JPEG10枚 |

- provenance: `owner-provided`。公開再生permalinkはなく、sourceUrlはnull。
- 10枚を目視確認。視聴者コメント・表示名・他の人物・端末情報は写っていない。
- 元素材はgitignoredの `media/original/b56/` に保持。受け渡しURL・IDは公開しない。
- 各JPEGは元の640×360構図を保持。通常のJPEG圧縮のみ。EXIF / GPS / IPTC / XMPなし。
- 顔のAI生成・補正・置換、生成塗り足しは行っていない。
- 先に作成した生成コラージュは顔の同一性を保証できないため公開対象から除外し、実フレームを掲載。
- LIVE STREAM専用の公開派生。全文文字起こし・録音・録画は公開しない。


## 素材台帳（batch b57 / 受領日・source date 2026-09-05）

オーナー提供の9月5日SHOWROOM昼配信録画から選んだ実フレーム10枚。
同日の「今度はこれをお願いします」という配信アーカイブ制作の継続依頼に基づき、LIVE STREAMへ掲載。代表はb57-05。

| ID | 公開ファイル | 場面（録画内の目安） |
| --- | --- | --- |
| b57-01 | `live/mily-b57-01-wave-smile.jpg` | 01:11 笑顔で手を振って |
| b57-02 | `live/mily-b57-02-yogurt-ice.jpg` | 02:09 ヨーグルトアイスを紹介 |
| b57-03 | `live/mily-b57-03-spoon.jpg` | 05:30 スプーンでひとくち |
| b57-04 | `live/mily-b57-04-cheek.jpg` | 11:49 頬に指を添えて |
| b57-05 | `live/mily-b57-05-bright-smile.jpg` | 21:49 ぱっと明るい笑顔 |
| b57-06 | `live/mily-b57-06-soft-tilt.jpg` | 28:49 そっと首を傾けて |
| b57-07 | `live/mily-b57-07-finger.jpg` | 31:09 人差し指を立てて |
| b57-08 | `live/mily-b57-08-hair-smile.jpg` | 37:29 髪に手を添えてにっこり |
| b57-09 | `live/mily-b57-09-flower-pose.jpg` | 44:09 手のひらを広げて |
| b57-10 | `live/mily-b57-10-sleep-pose.jpg` | 44:29 おやすみのポーズ |
| b57-zip | `live/mily-b57-day-stills.zip` | 上記JPEG10枚 |

- provenance: `owner-provided`。公開再生permalinkはなく、sourceUrlはnull。
- 全10枚を実寸で目視確認。視聴者コメント・表示名・他の人物・端末情報は写っていない。
- 元フレームはgitignoredの `media/original/b57/` に保持。受け渡しURL・IDは公開しない。
- 元の640×360構図と縦横比を保持。通常のJPEG圧縮のみ。EXIF / IPTC / XMPなし。
- 顔のAI生成・補正・置換・生成塗り足しなし。
- LIVE STREAM専用。全文文字起こし・録音・録画は公開しない。ZIP内容は単体JPEGと一致を確認。


## 素材台帳（batch b58 / 受領日 2026-09-05）

- オーナーが直接提供し、サイト掲載を明示依頼したTikTok動画。出典として指定されたURL: https://vt.tiktok.com/ZSqNgRAvx/
- 初回掲載では投稿日未確認のためGalleryのみ掲載。その後、オーナーがこの動画の投稿日を2026-09-05（土）と確認。sourceDateを更新し、同日NEWSへ共有メディアとして追加。投稿ページの再取得は未完了。本文はオーナー提供の投稿スクリーンショットの公開キャプションと実動画に基づく。
- 紹介文は添付スクリーンショットの公開キャプションと動画の実フレームを参考にした。スクリーンショットは参考専用で、公開・コミットしない。
- 公開MP4: `gallery/mily-b58-01-tiktok-radio-portrait.mp4`。512×910 / 約11.833秒 / H.264 Baseline / AAC / yuv420p / faststart。元の構図・尺を維持し、クロップ・拡大・AI加工なし。音声はAACへ変換して保持。
- poster: `gallery/mily-b58-01-tiktok-radio-portrait-poster.jpg`。公開動画の0.5秒実フレーム。
- 動画全体から0.5秒間隔で抽出した実フレームを目視確認。端末UI、通知、コメント、識別可能な第三者の写り込みを確認した範囲では認めない。全編の手動聴取は未実施。
- 元動画は無改変で保持。公開派生のソースメタデータとチャプターを除去。撮影日・投稿日時・撮影者は推測しない。


## 素材台帳（batch b59 / 受領日・source date 2026-09-04）

オーナーが直接提供した本人Instagram Story動画1本。くま耳とキラキラの
フェイスフィルターで、リンクスタンプ「2日目ポチッとな〜」とともに投票を
呼びかけている縦型動画。owner-provided。SNSから再取得していない。
mainでbatch b53〜b58が先に使用されているため、このStoryはb59として採番した。

HOME Latest / `/news/` と Gallery が、公開MP4・poster・manifest objectを共有する。
MISS CIRCLE Activityの関連NEWS・関連メディアにも出す。恒久的なStory permalinkはないため、
表示は非リンクの `Instagram Story` labelとする。`/stories/`、highlights、events、
streamSchedule、`media.ts`、PatonVoteGuideのランキング系列には追加しない。

### 掲載承認

- approval date: `2026-09-04`
- オーナー本人が本タスクで添付したb59-01について、`https://mily-fan-site.vercel.app`
  への掲載とギャラリーへの追加を明示依頼した。
- **source date `2026-09-04` はオーナーが明示確認した投稿日**である。
  オーナーは「9/4に投稿されたものを、その直後に受け取って渡した」と回答した。
  受領日も同じ2026-09-04。画面の「2日目」表示、WEB投票期間からの逆算、元動画の
  `creation_time`は日付の根拠にしない。投稿時刻は未確認のため書かない。
- 承認対象面はHOME Latest / `/news/`、Galleryの動画アーカイブ、MISS CIRCLE Activity。
  `/stories/`への複製は含まない。

| ID | 公開ファイル | 内容 | 掲載・承認 |
| --- | --- | --- | --- |
| b59-01 | `gallery/mily-b59-01-third-round-vote-day2-story.mp4` | 白黒のくま耳とキラキラのフェイスフィルター、黒い水玉のトップスで手を振り、ピースをする縦型動画。720×1280 / 8.967秒 / 30fps / 269フレーム / video-only | ✅ 2026-09-04 明示承認。Latest / NEWS + Gallery + MISS CIRCLE Activity |
| b59-01 poster | `gallery/mily-b59-01-third-round-vote-day2-story-poster.jpg` | 公開MP4の8.5秒地点の実フレーム。720×1280 | ✅ Latest / NEWS + Gallery |

### 元素材と安全確認

- provenance: `owner-provided`。Instagram Storyの恒久permalinkはなく、`sourceUrl`は持たない。
- 元動画はgitignoredの `media/original/mily-b59-01-third-round-vote-day2-story.mp4` に
  無改変で保持し、受け渡し名・URL・file IDはtracked / public filesへ残さない。
- 元動画は720×1280 / 30fps / 269フレーム / 8.966667秒。元動画にはAAC音声があるが、
  権利・再配信権を確認できないため、公開派生はvideo-only（無音）にした。
- 公開派生はcrop・scale・短縮・テロップ変更・AI加工なし。顔補正・生成塗り足しもない。
- 公開MP4はH.264 Constrained Baseline / 720×1280 / 8.967秒 / 30fps / 269フレーム /
  video-only / `+faststart`。sha256 `e6666874750b57d43c1573964340773c78fc130c604a972107c815d3a11da49e`。
- posterは公開MP4の8.5秒地点の実フレーム。EXIF / IPTC / XMP / ICCなし。sha256
  `82a73892f10ac6e6ae562b1a46958747e2042290f0b05855787fd796c4640455`。

### 共有範囲

- `src/data/webVoteDay2StoryVideo.json`の1オブジェクトをLatest / NEWS / Gallery /
  MISS CIRCLE Activityで共有し、公開MP4 1本・poster 1枚だけを参照する。
- 追加CTAは確認済みの三次審査WEB投票リンクのみ。SupportEventの期間終了後は自動で非表示にする。
- Storyのリンクスタンプの遷移先、連続投票者特典の内容・条件・付与方法は画面から確認できないため、
  本文で断定しない。


## 素材台帳（batch b60 / 受領日・source date 2026-09-05）

オーナー提供の9月5日SHOWROOM夜配信録画から選んだ実フレーム10枚。同素材への継続依頼に基づきLIVE STREAMへ掲載。代表はb60-10。b59は別の未マージPRで使用中のため避けた。

| ID | 公開ファイル | 場面（録画内の目安） |
| --- | --- | --- |
| b60-01 | `live/mily-b60-01-bright-smile.jpg` | 01:50 頬に手を添えてにっこり |
| b60-02 | `live/mily-b60-02-sunglasses.jpg` | 02:37 サングラスでポーズ |
| b60-03 | `live/mily-b60-03-flute-smile.jpg` | 14:29 篠笛を手に笑顔 |
| b60-04 | `live/mily-b60-04-flute-wave.jpg` | 22:49 篠笛を持って手を振って |
| b60-05 | `live/mily-b60-05-flute-playing.jpg` | 24:40 篠笛を演奏中 |
| b60-06 | `live/mily-b60-06-after-playing.jpg` | 25:51 演奏後の明るい笑顔 |
| b60-07 | `live/mily-b60-07-hand-cheek.jpg` | 36:51 口元に手を添えて |
| b60-08 | `live/mily-b60-08-hair-smile.jpg` | 41:00 サングラスに手を添えて |
| b60-09 | `live/mily-b60-09-finger-pose.jpg` | 42:20 両手の指でポーズ |
| b60-10 | `live/mily-b60-10-close-smile.jpg` | 45:10 カメラに向かってにっこり |
| b60-zip | `live/mily-b60-night-stills.zip` | 上記JPEG10枚 |

- provenance: `owner-provided`。公開再生permalinkはなく、sourceUrlはnull。
- 全10枚を実寸で目視確認。視聴者コメント・表示名・他の人物・端末情報は写っていない。
- 元フレームはgitignoredの `media/original/b60/` に保持。受け渡しURL・IDは公開しない。
- 640×360の元の構図と縦横比を保持。通常のJPEG圧縮のみ。EXIF / IPTC / XMPなし。顔のAI生成・補正・置換・生成塗り足しなし。
- 別途作成した生成コラージュは顔の同一性を保証できないためサイト掲載対象外。
- LIVE STREAM専用。全文文字起こし・歌詞・録音・録画は公開しない。


### b61 — 2026-09-06 朝配信の実フレーム

| 素材 | 公開ファイル | 場面 |
| --- | --- | --- |
| b61 | `/media/live/mily-b61-01-hello.jpg` | 00:59 笑顔でおはよう |
| b61 | `/media/live/mily-b61-02-cheek.jpg` | 11:00 頬に手を添えて |
| b61 | `/media/live/mily-b61-03-tilt.jpg` | 17:00 首をかしげてにっこり |
| b61 | `/media/live/mily-b61-04-double-pose.jpg` | 36:31 両手でポーズ |
| b61 | `/media/live/mily-b61-05-peace.jpg` | 46:02 カメラに向かってピース |
| b61 | `/media/live/mily-b61-06-ribbon.jpg` | 52:01 リボンが映る横顔 |
| b61 | `/media/live/mily-b61-07-relaxed.jpg` | 61:01 目を細めて笑顔 |
| b61 | `/media/live/mily-b61-08-smile.jpg` | 70:03 カメラに向かって笑顔 |
| b61 | `/media/live/mily-b61-09-playful.jpg` | 81:02 頬をふくらませてポーズ |
| b61 | `/media/live/mily-b61-10-bye.jpg` | 87:03 両手を振ってまたね |
| b61-zip | `live/mily-b61-asa-stills.zip` | 上記JPEG10枚 |

- owner-provided。公開再生permalinkなし。受け渡しURL・IDは非公開。
- 全10枚を実寸で目視確認。第三者・コメント・端末情報の写り込みなし。640×360の元の構図を保持し、通常のJPEG圧縮のみ。メタデータなし。
- 元フレームはgitignoredの `media/original/b61/`。LIVE STREAM専用。顔のAI生成・補正・置換・生成塗り足しなし。
- 別途作成した生成コラージュは顔の同一性を保証できないためサイト掲載対象外。全文文字起こし・録音・録画・歌詞は公開しない。


### 2026-09-06 朝配信スクリーンショットの掲載撤回

- オーナーの再評価によりb61の10枚・代表画像・保存ZIPを公開対象から除外。公開ファイルも削除し、レポート本文は維持。
- 上記b61の掲載記録は過去の履歴。現在は非掲載。新しい候補は再選定し、掲載する素材を確認するまで追加しない。


### 2026-09-06 朝配信の承認済み3枚を掲載（b62）

- オーナーが再選定候補の3枚すべてを確認し、掲載を明示承認。08:59 正面の笑顔、48:01 首をかしげた笑顔、68:02 やわらかい笑顔。代表は2枚目。
- b62の実画像JPEG3枚と保存ZIPを既存の共通カードで掲載。元の640×360・全構図を保持し、JPEG圧縮とメタデータ除去のみ。顔加工なし。
- 元PNGはgitignoredのmedia/original/b62。owner-providedで公開再生permalinkなし。受け渡し情報は非公開。
- 取り下げ済みb61の10枚とZIPは復元しない。レポート本文は維持。


## 素材台帳（batch b63 / 受領日・source date 2026-09-06）

2026-09-06 11:16:04 JST の本人X投稿（created_at Sun Sep 06 02:16:04 UTC 2026）。
公開permalinkあり。キャンガル2027 予選finalの結果報告グラフィック。
白い壁の前で腕を組んだみりぃの写真に、総合審査員賞・面接審査1位・Paton投票審査2位・本戦進出決定の文言が重ねられている。`sns-post`。
オーナーが本タスクで画像を直接提供し、https://mily-fan-site.vercel.app への掲載を明示依頼した。X CDNからは取得していない。

新しい NEWS `2026-09-06-campus-girls-prelim-final-result`。Gallery にも出す。
CAMPUS GIRLS Activity と highlights に関連付ける。`/stories/`・events・streamSchedule・contest.ts・profile には足さない。Paton投票は 2026-09-01 23:59 JST 終了済みのため投票CTAなし。

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b63-01 NEWS | `news/mily-b63-01-campus-girls-prelim-final-result.jpg` | 予選final結果報告。1500×2667。sns-post | ✅ 新NEWS の fallback `src` |
| b63-01 Gallery | `gallery/mily-b63-01-campus-girls-prelim-final-result-{480,960,1600}.{jpg,webp}` | 同じ写真の `pnpm media:build` 派生。1600幅は拡大せず 1500×2667 | ✅ Gallery photo |

出典: `https://x.com/mily_chan36/status/2096422147476627841`

元素材（gitignore）: 293,774 bytes / JPEG / 1500×2667 / sha256
`e8c612341631ce5ad969e326526c421423dde14520d0d78caa062a8afe48de5e`
元素材にはEXIFとIPTCあり。公開前にsharpでJPEG再エンコードし、metadataを除去した。

NEWS JPEG: 353,094 bytes / 1500×2667 / sha256
`59679e7a880fbdf8659d10fcb5f88fe7928c232e1dfb418490ba8104e9ccb10f`
公開ファイルはEXIF / IPTC / XMP / ICCなし。再エンコードはsharpのJPEG quality 95 / progressive / 4:4:4のみ。crop・scale・rotate・アップスケール・縦横比変更なし。AI生成・顔補正・生成塗り足しなし。

Gallery 480.jpg: 480×853 / sha256
`ba88c3806920965806a9c4297cb4589a9209281ba8c00f2883da038a2b0555ae`
Gallery 960.jpg: 960×1707 / sha256
`84368c3dd9488bb4a4828efe3864056d84f5f9b1e98c429f97788a8398aedff8`
Gallery 1600.jpg: 1500×2667 / sha256
`6dd7a652200342d591297b3f7983810bc21f45659f681d9fb2792eff9fe7da9b`

## 素材台帳（batch b64 / 受領日・source date 2026-09-07）

2026-09-07 09:15:31 JST の本人X投稿（created_at Mon Sep 07 00:15:31 GMT）。
公開permalinkあり。キャンガル2027 本選EX vol.1の審査案内グラフィックと、本選EX期間のスケジュール表。実写ポートレートではない。`sns-post`。
オーナーが本タスクで画像を直接提供し、https://mily-fan-site.vercel.app への掲載を明示依頼した。X CDNからは取得していない。

新しい NEWS `2026-09-07-campus-girls-finals-ex-vol1`。Gallery には出さない。
CAMPUS GIRLS Activity に関連付ける。`/stories/`・highlights・events・streamSchedule・contest.ts・profile・media.ts には足さない。
本選EXのPaton投票先URLは未確認のため投票CTAなし。

| ID | 公開ファイル | 内容 | 掲載 |
| --- | --- | --- | --- |
| b64-01 NEWS | `news/mily-b64-01-campus-girls-finals-ex-vol1.jpg` | 本選EX vol.1案内。1500×2250。sns-post | ✅ 新NEWS の代表 |
| b64-02 NEWS | `news/mily-b64-02-campus-girls-finals-ex-schedule.jpg` | メッセージ＋本選EX vol.1〜6日程表。1500×1700。sns-post | ✅ 同じNEWS の additionalMedia |

出典: `https://x.com/mily_chan36/status/2096754197362622971`

元素材（gitignore）:
- b64-01: 751,087 bytes / JPEG / 1500×2250 / sha256 `4f35c4d98528eeca597b23b795acd35cdca225499ccf348e74a429de154c774f`
- b64-02: 329,602 bytes / JPEG / 1500×2667 / sha256 `f59f5d64323f484c8254943f4e9a2e77baa965c84524b25c4133db9f211b58d0`

元素材にはEXIFとIPTCあり。公開前にsharpでJPEG再エンコードし、metadataを除去した。
b64-02の公開派生は、下部のInstagram再投稿バーと空の余白だけを除く（top 0 / height 1700）。crop以外のscale・rotate・アップスケール・縦横比変更なし。AI生成・顔補正・生成塗り足しなし。

NEWS JPEG:
- b64-01: 1,097,825 bytes / 1500×2250 / sha256 `91c7020bad59effa9109f33be94df6c36eede56fdf9fea378a352657847251ad`
- b64-02: 420,322 bytes / 1500×1700 / sha256 `94eb650e396717064978e981efad60c6b8d7b5642cc6c94c8e2ff534ab283443`

公開ファイルはEXIF / IPTC / XMP / ICCなし。再エンコードはsharpのJPEG quality 95 / progressive / 4:4:4。
