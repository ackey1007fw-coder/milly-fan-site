# 『みんなの太陽』MV 情景生成 — Grok担当

> Owner: Grok / GrokBot
>
> 他AIは原則としてこのファイルを直接編集せず、Draft PR Conversationへ提案を残してください。

正本: `STORYBOARD.md` v2.1.1 の **G1〜G6（6本）のみ**。
旧12本案（ひまわり枠・ラジオ/篠笛の代替B-rollを含む）は破棄済み。増やさない。混ぜない。

## 役割

本人写真カット（S1〜S42）の間をつなぐ、**本人・人物・人体なし**の象徴B-rollを6本だけ設計する。
AI映像は主役ではない。「こんきょのない じしんを だれかに わたす」を、光・逆光・朝日で表現する。

今回の作業は **設計完成**。動画生成は行っていない。

## 絶対条件

作業前に `README.md` / `BRIEF.md` / `DECISIONS.md` / `STORYBOARD.md` を読むこと。

禁止:

- 7本以上へ増やす
- 旧12本案を混ぜる
- みりぃ本人を生成する
- 本人写真をAIへ入力する
- Reference-to-Video
- 人物生成 / 人体生成
- 顔 / 手 / 人物シルエット
- リップシンク
- 生成塗り足し / generative fill / outpainting
- ひまわり（歌詞に無く、季節記号として強すぎる）
- 有料クレジット消費

生成するなら Text→Video のみ。実行前に 0円 / 加入プラン内 / Unlimited 枠を確認し、有料なら止める。

## 正本との対応（6本）

| ID | IN | OUT | 長さ | セクション | 物語上の役割 | コンセプト |
|---|---:|---:|---:|---|---|---|
| G1 | 0:00.0 | 0:04.0 | 4.0s | Intro | 始まりの空気 | 朝の光・逆光の粒子 |
| G2 | 0:41.2 | 0:43.95 | 2.75s | Pre-Chorus | タイトル回収・第1ピーク | 太陽・光芒 |
| G3 | 1:07.2 | 1:11.3 | 4.1s | Chorus | 主題①「祈り / 渡したい」 | 闇の中に生まれる小さな光 |
| G4 | 1:53.4 | 1:57.0 | 3.6s | Bridge | 1:57.0直前のタメ。情報量を落とす | ほぼ暗闇＋小さな光 |
| G5 | 2:16.0 | 2:19.8 | 3.8s | Final Chorus | 主題②「すでに届いている」 | ひとつの光が複数へ広がる |
| G6 | 2:34.2 | 2:38.2 | 4.0s | Outro | 余韻 | 朝日 |

G3とG5は同じ歌詞行でもコピーしない。1回目は誕生、2回目は伝播。

## 全Prompt必須ネガティブ

各Promptに次をすべて含める。

- no people
- no human body
- no human face
- no hands
- no silhouettes
- no text
- no logo
- no watermark

加えて、ひまわりを出さない（no sunflower / no sunflowers）。

## G1 — 0:00.0 / Intro / 4.0s

朝の光・逆光の粒子。情報を詰め込まない。「なんかいいな」を先に取る。

**Prompt**

```
16:9 cinematic landscape. Golden morning sunlight streaming through soft atmospheric haze, subtle dust particles floating in backlight, empty environment, absolutely no people, no human body, no human face, no hands, no silhouettes, no sunflower, no sunflowers, no text, no logo, no watermark. Slow gentle camera drift forward, warm natural tones, calm hopeful mood, photorealistic, single continuous shot.
```

- 生成: 未実行
- 採否: —

## G2 — 0:41.2 / Pre-Chorus / 2.75s

太陽・光芒。タイトル「みんなの太陽」の回収。第1のピーク。短いので、生成素材は長めに撮って設計尺へトリムしてよい。

**Prompt**

```
16:9 cinematic landscape. Brilliant warm sunlight breaking through layered clouds, radiant light rays expanding across the frame, subtle realistic lens flare, empty sky and distant horizon, absolutely no people, no human body, no human face, no hands, no silhouettes, no sunflower, no sunflowers, no text, no logo, no watermark. Slow upward camera tilt, bright hopeful mood, photorealistic, single continuous shot.
```

- 生成: 未実行
- 採否: —

## G3 — 1:07.2 / Chorus / 4.1s

主題①＝「祈り」。人物・人体なし。ひとつの小さな光が生まれる。「だれかに わたせたなら」の願い。手・カップした掌などの人体モチーフは使わない。

**Prompt**

```
16:9 cinematic abstract scene. A single tiny warm point of light slowly appears within deep quiet darkness and faint atmospheric mist, then gently grows brighter without changing position. Absolutely no people, no human body, no human face, no hands, no silhouettes, no sunflower, no sunflowers, no text, no logo, no watermark. Minimal composition, tender and symbolic mood, photorealistic light behavior, single continuous shot.
```

- 生成: 未実行
- 採否: —

## G4 — 1:53.4 / Bridge / 3.6s

ほぼ暗闇＋小さな光。1:57.0のハードカット直前。絵を減らす。ロックオフ。

**Prompt**

```
16:9 cinematic minimal landscape. Near-total darkness with only one very small distant warm point of light at center, faint atmospheric haze, the light slowly becomes slightly brighter while almost the entire frame remains dark. Absolutely no people, no human body, no human face, no hands, no silhouettes, no sunflower, no sunflowers, no text, no logo, no watermark. Locked-off camera, restrained introspective mood, single continuous shot.
```

- 生成: 未実行
- 採否: —

## G5 — 2:16.0 / Final Chorus / 3.8s

主題②＝「すでに届いている」。ひとつの光が複数へ広がる。G3からの前進。同じ誕生ショットの再利用はしない。

**Prompt**

```
16:9 cinematic wide landscape at blue-to-golden dawn. One warm point of light appears in the distance, then many separate warm lights gently illuminate across the landscape in a spreading pattern, symbolizing courage passing from one place to another. Absolutely no people, no human body, no human face, no hands, no silhouettes, no sunflower, no sunflowers, no text, no logo, no watermark. Slow subtle pullback, expansive radiant hopeful mood, photorealistic, single continuous shot.
```

- 生成: 未実行
- 採否: —

## G6 — 2:34.2 / Outro / 4.0s

朝日・余韻。盛らない。S42の決めカットへ渡す。

**Prompt**

```
16:9 cinematic empty sunrise landscape. A clean distant horizon at dawn, soft golden sun rising slowly, warm natural light gradually filling the frame through delicate morning haze. Absolutely no people, no silhouettes, no human body, no human face, no hands, no animals, no sunflower, no sunflowers, no text, no logo, no watermark. Very slow stable camera rise, calm hopeful closing-shot mood, photorealistic, single continuous shot.
```

- 生成: 未実行
- 採否: —

## Promptの基本形

各Promptは1ショット1アイデア。短いMV素材として、複数イベントを詰め込まない。

- 16:9 cinematic
- 上記の必須ネガティブ一式
- camera motion（必要な場合のみ、単一）
- lighting / mood
- durationを意識した単一の動き
- photorealistic light（抽象G3も光の挙動は現実寄り）

## 品質評価（生成後）

- A: そのまま採用候補
- B: 一部トリミング / 速度調整で採用可能
- C: 再生成
- NG: 人物・人体・顔・手・シルエット、本人に似た像、文字、ロゴ、ひまわり、破綻

## コスト / 生成ログ

| 項目 | 値 |
|---|---|
| 有料クレジット消費 | 0 |
| 生成実行 | なし |
| 確認 | 今回は設計のみ。生成は設計レビュー後、0円 / 加入プラン内 / Unlimited 枠が確認できた場合に限る |

## 作業後

Draft PR Conversationへ次を残す。

```text
[Grok] YYYY-MM-DD HH:mm JST
担当: 本人・人物・人体なしB-roll（G1〜G6）
見たもの: AGENTS.md / README / BRIEF / DECISIONS / STORYBOARD / PR最新コメント
提案 / 変更:
生成候補:
Claude / ChatGPTに確認したいこと:
オーナー判断が必要: なし / あり
```
