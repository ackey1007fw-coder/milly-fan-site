# 配信メモ 統一ルール — LIVE STREAM（/activities/live/）

`src/data/streamRecaps.ts` と各回の `src/data/streamRecap*.ts` に置く「配信メモ」カードの書き方を、担当したエージェント
（Claude Code / Codex / Cursor など）に関係なく同じ品質へ揃えるためのルールです。

- ルール本体の唯一の情報源は `AGENTS.md`。このファイルは、`AGENTS.md` が
  「配信メモは `docs/LIVE-STREAM-RECAP.md` に従う」と委任した配下の運用手順です
  （`docs/MEDIA.md` / `docs/CONTENT-OPS.md` と同じ位置づけ）。
- **矛盾したら `AGENTS.md` が勝ちます。** このファイルは `AGENTS.md` の禁止事項を
  緩めることも、上書きすることもできません。掲載可否・privacy・権利の判断は `AGENTS.md` が最終。
  ここが決めるのは、その範囲内での書式・長さ・並び・言い回しです。
- 日常更新の記録は `docs/CONTENT-OPS.md`、写真の受け入れは `docs/MEDIA.md`。
- ここに書いた数値・書式は **`scripts/stream-recaps.test.mjs` が全カードを機械的に検査**します。
  数値を変えるときは、このファイルとテストの両方を同じPRで直します。

---

## 0. 大前提

1. **事実を曲げない。** 体裁を揃えるために内容を足さない・盛らない。
   件数も文字数も**下限は設けていません**。検査するのは上限と書式だけです。
   検査を通すために本文を長く言い換えたり、未確認の見どころ・目標・タイムスタンプを
   補うことは、この文書の目的に反します。短い回は短いまま出します。
   素材が薄い回は、薄いまま短く整えて出す（見どころ3件でも構わない）。
   足りない見どころを補うために、確認していない発言・数字・予定を書かない。
2. **本人の言い回しは残す。** 「キラキラ」「キラ星」のように回によって呼び方が違う語は、
   同じ意味だと決めつけて統一しない。統一してよい表記は 4章の辞書に載っているものだけ。
3. **統一するのは構造・書式・見せ方。** 内容の濃さは素材で決まる。見た目の統一は
   `ActivitiesPage.tsx` 側（同じ順序・同じカード）で担保する。
4. 迷ったら空にする。空欄より間違った値の方が悪い。

## 1. カードの構造（順序は固定）

閉じた状態: 日付 → プラットフォーム → 放送枠 → 回タイトル → 一言サマリー → 静止画（あれば）

開いた状態はこの順に固定する。順番を入れ替えない。セクションを増やさない。

1. この回に歌った曲（`songs`。曲を確認できた回だけ）
2. この回の見どころ（`highlights`。確認できた見どころがない回はセクションごと出ない）
3. この回のスクショ（`gallery`。ある回だけ）
4. この回の目標（`goals`。確認できた目標がない回はセクションごと出ない）
5. 読み上げたランキング（`ranking`。読み上げがなかった回はセクションごと出ない）
6. タイムスタンプと次枠（`timeline` + `nextNote`。折りたたみ）
7. 出典・確認日・注記（`sourceLabel` / `verifiedAt` / `transcriptionNote`）

新しい回を配列の先頭へ置く。同じ日の複数枠は **開始時刻の遅い枠を先**にする
（例: 9/2夜 → 9/2朝）。

## 2. フィールド規約

| フィールド | 形式 | 長さ（全角・半角とも1文字） |
| --- | --- | --- |
| `id` | `YYYY-MM-DD-<slug>`。slug は英小文字・数字・ハイフン | — |
| `date` | `YYYY-MM-DD`。`id` の先頭と一致 | — |
| `dateLabel` | `YYYY.MM.DD（曜）`。`date` と一致する曜日 | — |
| `theme` | **朝 / 昼 / 夕 / 夜 / 深夜 で始める**。プラットフォーム名を入れない | 〜16 |
| `broadcastLabel` | `H:MM頃〜 約N分`（時は 0〜23） | — |
| `platformLabel` | `SHOWROOM` または `MixChannel` | — |
| `summary` | その回を1〜3文で。です・ます | 〜140 |
| `highlights` | 8件まで。目安は5〜7件。素材が薄い回は少ないままでよい（水増ししない） | — |
| `highlights[].timestamp` | `H:MM:SS`。昇順 | — |
| `highlights[].title` | 体言止め可。記号で飾らない | 〜20 |
| `highlights[].body` | です・ます。1〜2文 | 〜100 |
| `highlights[].quote` | 任意。本人の言葉だけ。かぎ括弧を付けない | 〜40 |
| `songs` | 曲を確認できた回だけ。`youtubeUrl` は**原曲の公式動画**（アーティスト／レーベルの channel）。みりぃの歌唱映像や歌詞は載せない。曲を確認できない回は省略 | — |
| `songs[].timestamp` | `H:MM:SS`。歌唱開始位置の目安 | — |
| `goals` | 6件まで。`item` は重複させない。素材にない目標を補わない。確認できた目標がない回は `[]`（セクションごと出ない） | — |
| `goals[].item` | 目標の名前 | 〜8 |
| `goals[].target` | 目指す値・状態 | 〜10 |
| `goals[].statusThen` | その回でどうだったか（状態、または本人の呼びかけ）。UIが「この回」と表示するので語を重ねない | 〜12 |
| `ranking` | 読み上げがあった回だけ1件。範囲確認済みは `RANKING_NOTE` / `buildRankingNote(from, to)`、範囲未確認は `RANKING_NOTE_WITHOUT_RANGE`。読み上げなしは空配列 | — |
| `timeline` | 16件まで。目安は8〜14件。昇順。録画が途中から始まる回は先頭が `0:00:00` でなくてよい | — |
| `timeline[].label` | 体言止め。話題だけ | 〜32 |
| `nextNote` | 配信内で案内された次枠。確定予定として書かない。案内がなかった回・確認できない回は `""` | 〜120 |
| `sourceLabel` | `YYYY年M月D日 <枠の説明>（<入手経路>）`。日付は `date` と同じ。入手経路は実際どおり（例: 動画確認・オーナー提供）。URLを書かない | — |
| `verifiedAt` | `YYYY-MM-DD`。`date` 以降 | — |
| `transcriptionNote` | `buildTranscriptionNote()` で組み立てる。手書きしない | — |

`highlights` と `timeline` は役割が違う。**見どころ＝読ませる6件前後、タイムライン＝索引**。
同じ内容を両方へ丸ごとコピーしない。

## 3. 注記（`transcriptionNote`）の作り方

回ごとに文章を書き下ろさない。必ず `buildTranscriptionNote()` を使い、
「素材 → 非掲載範囲（共通文）→ 静止画 → 補足 → 数字（共通文）」の順で組み立てる。

```ts
transcriptionNote: buildTranscriptionNote({
  material: VIDEO_MATERIAL_NOTE, // 動画確認 / 文字起こし のどちらか
  stills: "静止画は録画の実フレームを1枚だけ掲載しています。",
  extra: "固有名詞は聞き取りが不明瞭なため掲載していません。", // 任意
}),
```

- 共通文（`RECAP_WITHHOLD_NOTE` / `RECAP_FIGURES_NOTE`）を回ごとに言い換えない。
- 静止画がない回は `stills: ""` ではなく「静止画は掲載していません。」と書く。

## 4. 表記辞書（統一してよい語）

| 揺れ | サイト表記 |
| --- | --- |
| アバ権 | アバター権 |
| WEB投票 / Web投票 / ウェブ投票 | WEB投票 |
| ミスサー / MISS CIRCLE CONTEST | 正式名は `MISS CIRCLE CONTEST`。本文中の通称は使わない |
| SR | SHOWROOM |
| 3次 / 三次 | 三次（審査） |

**統一しない語**（本人の言い回しとして回ごとに残す）: キラキラ / キラ星、
おつみりん / おつみりぃ など。どちらへ寄せるかはオーナー確認が取れてから辞書へ足す。

禁止語: 公式・公認・本人運営（誤認させる表現）、順位を断定する表現、
`live` / JST / 作業メモ のような内部表現。

## 5. 写真・スクショ

- 掲載できるのは **オーナーが提供し、掲載面を明示承認した録画の実フレーム**だけ。
  AI生成・生成塗り足し・顔の加工はしない。
- コメント欄、視聴者の表示名・アイコン、他の出場者が写らないよう切り出す。
- 代表1枚だけの回は `image`。複数を出す回は `gallery`（12枚まで）と、その中から選んだ代表 `image`。
  代表は「そのカードの顔」なので、時系列の先頭とは限らない（`gallery` 内と同じオブジェクトを指すこと）。
  提供素材が2枚だけの回も、確認済み素材を水増ししない。
  `gallery` の各要素は `caption` と `downloadName` を必ず持つ。
  代表1枚だけの回は `caption` を任意にしてよい（一覧に並ばないため）。
- `width` / `height` は実ファイルの寸法をそのまま書く（テストが実ファイルと突き合わせる）。
- `alt` は「誰が・何をしているか」を書く。「みりぃ」を必ず含める。
  コメント・視聴者・他出場者に触れない。
- ファイル名は `mily-bNN-NN-<slug>`。公開済みファイル名は変えない。
- 配信メモの静止画は LIVE STREAM 専用。`media.ts` / `galleryVideos.ts` / Gallery / NEWS へ
  複製しない（同じ回の素材を別ページで使う場合はオーナー確認）。
- 同じ静止画を複数の回で使う場合は、**同じオブジェクトを共有**する（ファイルを増やさない）。

## 6. 掲載しないもの

- 録音音声・画面録画・全文文字起こし。
- 視聴者・リスナーの名前、ファンネームで呼ばれた個人、他の出場者の名前。
- 読み上げランキングの個人名（順位を読み上げた事実だけ残す）。
  読み上げがなかった回に、あったことにしない。範囲が確認できない回は `RANKING_NOTE_WITHOUT_RANGE`、範囲が違う回は `buildRankingNote(from, to)` を使う。
- Google Drive のフォルダ・ファイルID、原本ファイル名、音声ファイル名。
- 未確定の予定（検討中の枠、時刻未定の枠）を `events.ts` / `streamSchedule.ts` へ転記すること。
  配信内で案内された枠は `nextNote` に「案内された」として残すだけ。
- 生活の細部のうち、本人が配信で話した範囲を超えて特定につながるもの。
  住所・最寄り駅・通学経路・利用路線、面接や進路の相手先の名前、病名や症状の詳細など。
  本人が配信で話した一般的な言及（「体調と相談しながら」「通学に約2時間」など）はそのまま書いてよい。
  迷ったら粒度を一段あらくして書く。
- フォロワー数・目標数は配信時点の記録。`profile.ts` へ固定しない。

## 7. 触るファイル / 触らないファイル

触る: `src/data/streamRecaps.ts` と各回の `src/data/streamRecap*.ts`、（新しい静止画があれば）`public/media/live/`、
`docs/CONTENT-OPS.md` の当日メモ、必要ならその回のテスト。

触らない（オーナーが別途指示した場合のみ）: `news.ts` / `media.ts` / `galleryVideos.ts` /
`stories.ts` / `highlights.ts` / `events.ts` / `streamSchedule.ts` / `contest.ts` / `profile.ts`。

## 8. 提出前チェック

```bash
pnpm typecheck
pnpm test      # scripts/stream-recaps.test.mjs が全カードを検査する
pnpm build
pnpm guard
```

テストで自動的に見るもの: 並び順、id・日付・曜日の整合、各フィールドの書式と長さ、
タイムスタンプの昇順、`ranking` の定型文、注記の共通文、`gallery` の必須項目、
禁止語（公式 / 公認 / 本人運営、Drive URL、音声ファイル拡張子）。

人が見るもの: 事実が素材どおりか、privacy、写真の切り出し、本人の言い回しを壊していないか。

## 9. テンプレート

```ts
export const streamRecapYYYYMMDD: StreamRecap = {
  id: "YYYY-MM-DD-<slug>",
  date: "YYYY-MM-DD",
  dateLabel: "YYYY.MM.DD（曜）",
  theme: "朝の配信",
  broadcastLabel: "0:00頃〜 約00分",
  platformLabel: "SHOWROOM",
  summary: "（140字まで。その回が何の回だったか）",
  image: /* 静止画があれば */ undefined,
  highlights: [
    {
      timestamp: "0:00:00",
      title: "（20字まで）",
      body: "（100字まで）",
      quote: "（任意。本人の言葉）",
    },
  ],
  goals: [{ item: "（8字まで）", target: "（10字まで）", statusThen: "（12字まで）" }],
  ranking: [RANKING_NOTE], // 読み上げなしは []。範囲未確認は RANKING_NOTE_WITHOUT_RANGE
  timeline: [{ timestamp: "0:00:00", label: "（32字まで）" }],
  nextNote: "（配信内で案内された次枠。確定予定にしない）",
  sourceLabel: "YYYY年M月D日 SHOWROOM◯◯配信（動画確認・オーナー提供）",
  verifiedAt: "YYYY-MM-DD",
  transcriptionNote: buildTranscriptionNote({
    material: VIDEO_MATERIAL_NOTE,
    stills: "静止画は掲載していません。",
  }),
};
```

追加したら `streamRecaps` 配列の正しい位置（新しい順・同日は遅い枠が先）へ入れる。

### カラオケの参考リンク

依頼された場合は `songs[].karaoke` に `youtubeUrl` と伴奏制作者の `channel` を記載できる。
原曲の `youtubeUrl` と区別し、ガイドメロディなしの参考伴奏を確認して採用する。
「配信で使用した音源」とは断定しない。歌唱が確認できない回に曲リストを作らない。
