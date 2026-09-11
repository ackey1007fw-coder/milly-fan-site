# 『みんなの太陽』MV 絵コンテ設計表 v2.1.1 — Claude担当

> Owner: Claude
>
> 他AIは原則としてこのファイルを直接編集せず、Draft PR Conversationへ提案を残してください。

v2と演出内容は同一。public repository 向けに演出用語のみ中立化した v2.1 に、pre-commit検算で見つかった3点
（S28=2.6秒／Hero表示秒数レンジ=3.0〜6.1秒／G3を人体なし表現へ修正）
を反映した版。

カット数・IN/OUT・Role・素材種別・順序・演出意図はv2から変更なし。

- 音源設計尺: 2分44.3秒（164.3秒）※2:24ではない。全カットこの尺基準
- 実音源計測値: 164.352秒（最終書き出し時のみ末尾を実音源へスナップ）
- 方式: 静止画ベース＋トランジション。人物のAI動画生成は一切行わない
- 素材: みりぃ本人の公開・利用確認済み写真（静止画）／生成AIは人物・人体なしの情景クリップのみ
- 配分: 写真42カット（87.5%）／情景6本（12.5%）
- 出力: 1080p 16:9
- クレジット: みんなの太陽／三橋莉子 非公式応援MV／Music by あっきー（AI × Suno）

---

## 構成タイムライン（音源解析で確定）

| # | セクション | IN | OUT | 長さ | 行数 |
|---:|---|---:|---:|---:|---:|
| 1 | Intro | 0:00.0 | 0:11.7 | 11.7s | — |
| 2 | Verse 1 | 0:11.7 | 0:35.7 | 24.0s | 8 |
| 3 | Pre-Chorus | 0:35.7 | 0:46.7 | 11.0s | 4 |
| 4 | Chorus | 0:46.7 | 1:19.3 | 32.6s | 8 |
| 5 | Verse 2 | 1:19.3 | 1:39.4 | 20.1s | 8 |
| 6 | Bridge | 1:39.4 | 1:57.0 | 17.6s | 5 |
| 7 | Final Chorus | 1:57.0 | 2:31.2 | 34.2s | 9 |
| 8 | Outro | 2:31.2 | 2:41.5 | 10.3s | 2 |
| 9 | Fade out | 2:41.5 | 2:44.3 | 2.8s | — |

信頼度: 0:46.7 と 1:57.0 は自己相関で検出（高）。それ以外はスペクトル変化点からの推定。編集時に波形で±0.5秒の微調整余地あり。

Bridge（1:39.4–1:57.0）は曲中で唯一音が沈む内省パート。
ここを明るく作ると音と絵が逆行し、1:57.0の開放が弱くなる。必ず落とすこと。

---

## 物語の4幕

| 幕 | 区間 | 内容 | トーン |
|---|---|---|---|
| 第1幕 | 0:00–0:46.7 | 名乗り。等身大の自己紹介 | 明るいが控えめ。自然光 |
| 第2幕 | 0:46.7–1:39.4 | 宣言と、素の一面 | 開ける／後半テンポ上げ |
| 第3幕 | 1:39.4–1:57.0 | 弱さの告白。唯一の影 | 落とす。1:57で最大のタメ |
| 第4幕 | 1:57.0–2:44.3 | 自信を人に渡す側になる | 最も明るい。朝日 |

演出の芯: この曲は「みりぃが輝く歌」ではなく「みりぃが自信を人に渡す歌」。
こんきょのない じしんを だれかに わたせたなら が全体の主題。

---

## 写真の3層と表示秒数

| 層 | 記号 | 表示秒数 | 枚数 | 役割 |
|---|---|---|---:|---|
| Hero | H | 3.0〜6.1s | 9カット | 顔・存在感をしっかり見せる。決め |
| 補助 | A | 3.0〜4.1s | 22カット | 雰囲気・活動感 |
| モンタージュ | M | 2.5〜2.75s | 11カット | 勢い・つなぎ |

再利用可。同じ1枚でも「引き→顔寄りクロップ→横パン」で別カットになる。
実際に用意すべきユニーク写真は 28〜32枚 が目安。

---

## カット割り（全48カット）

### 1. Intro（0:00–0:11.7）

| IN | 秒数 | 素材 | 演出 |
|---:|---:|---|---|
| 0:00.0 | 4.0s | G1 | 朝の光。逆光の粒子。人物・人体なし |
| 0:04.0 | 4.0s | S1 (H) | 引きの1枚。フェードイン。すぐ人物に戻す |
| 0:08.0 | 3.7s | S2 (A) | 表情違い。タイトルロゴを重ねる |

情報を詰め込まない。「なんかいいな」を先に取る。

### 2. Verse 1（0:11.7–0:35.7）｜8カット・各3.0s

| IN | 歌詞 | 素材 | 演出 |
|---:|---|---|---|
| 0:11.7 | かながわから きたよ | S3 (A) | 引きの構図。日常のトーン |
| 0:14.7 | みつはし りこ です | S4 (H) | 正面。テロップ大 |
| 0:17.7 | ミリーって よんでね | S5 (A) | 笑顔。本編で最初の笑顔カット |
| 0:20.7 | にちだいの さんねんせい | S6 (A) | 屋外。テロップで学年を強調しない |
| 0:23.7 | ラジオけんきゅうの よるに | S7 (A) | 夜／室内寄り。明度を抑えたトーン |
| 0:26.7 | まいしゅう エフエム ながす | S8 (A) | 公開利用可能なラジオ関連実写真を最優先 |
| 0:29.7 | しのぶえも ふけるんだ | S9 (A) | 篠笛の公開実写真があれば最優先。無ければ別の雰囲気写真 |
| 0:32.7 | まだ とちゅうの ちょうせん | S10 (A) | 視線を外した構図 |

### 3. Pre-Chorus（0:35.7–0:46.7）｜4カット・各2.75s

**モンタージュ帯①。** テンポが上がる。ズーム強め。

| IN | 歌詞 | 素材 | 演出 |
|---:|---|---|---|
| 0:35.7 | うたうこと はなすこと | S11 (M) | 寄り |
| 0:38.45 | それが すきなんだ | S12 (M) | 笑顔・寄り |
| 0:41.2 | みんなの たいよう | G2 | 太陽・光芒。タイトル回収。第1のピーク |
| 0:43.95 | トマトの えいようそ | S13 (M) | あえてトーンを外す。軽やかな1枚 |

トマトの えいようそ は歌詞唯一の変化球。ここで緊張が抜けるからサビが効く。

### 4. Chorus（0:46.7–1:19.3）｜8カット・約4.1s

**カットを遅くする。** Verseより長く見せてサビの重さを出す。

| IN | 歌詞 | 素材 | 演出 |
|---:|---|---|---|
| 0:46.7 | こんきょのない じしんで | S14 (H) ★専用 | サビ頭。最重要のひとつ |
| 0:50.8 | いっぽ ふみだせば いい | S15 (A) | 歩き／立ち姿 |
| 0:54.9 | ミリーが はしってくから | S16 (A) | 動きのある1枚 |
| 0:59.0 | きみも わらって ついてきて | S17 (H) | 笑顔。最も強い1枚はラストへ温存 |
| 1:03.1 | こんきょのない じしんを | S18 (A) | 正面 |
| 1:07.2 | だれかに わたせたなら | G3 | 主題①＝「祈り」。人物・人体なし。ひとつの小さな光が生まれる |
| 1:11.3 | きょうの いみが のこるんだ | S19 (A) | 静かな表情 |
| 1:15.4 | わたしは ミリーだよ | S20 (H) | 名乗り。テロップ大 |

### 5. Verse 2（1:19.3–1:39.4）｜8カット

**モンタージュ帯②。最速。** 素の一面。ラフな写真を混ぜる。

| IN | 長さ | 歌詞 | 素材 |
|---:|---:|---|---|
| 1:19.3 | 2.5s | おばけやしきは むりで | S21 (M) 自然な一瞬をとらえた写真も候補 |
| 1:21.8 | 2.5s | えびと たこは すき | S22 (M) 食・日常 |
| 1:24.3 | 2.5s | みすさーくる も きゃんがる も | S23 (M) イベント・ステージ寄り |
| 1:26.8 | 2.5s | むぼうでも はしってる | S24 (M) 動きのある1枚 |
| 1:29.3 | 2.5s | じぶんも じしんが ないけど | S25 (M) 視線を落とした静かな表情 |
| 1:31.8 | 2.5s | わたしらしく いくんだ | S26 (M) 顔を上げる |
| 1:34.3 | 2.5s | グレードアップ しながら | S27 (M) |
| 1:36.8 | 2.6s | きょうも ちょうせん なんだ | S28 (M) 真剣な表情 |

合計 20.1s。

### 6. Bridge（1:39.4–1:57.0）｜5カット ★最重要区間

この曲で唯一の影。彩度−15／輝度−10。カットも静かに。

| IN | 歌詞 | 素材 | 演出 |
|---:|---|---|---|
| 1:39.4 | さずかった この いのち | S29 (A) | 静かな1枚。明度を抑えたトーン |
| 1:42.9 | せっかくなら のこしたい | S30 (A) | 横顔。明度を抑えたトーン |
| 1:46.4 | おもしろい にんげんで いよう | S31 (A) | わずかに表情がゆるむ1枚 |
| 1:49.9 | じしんのない きみへ | S32 (A) | カメラへ正対しない構図。視点が“きみ”へ移る行 |
| 1:53.4 | いっぽの ゆうき あげるよ | G4 | 黒に近い画面＋小さな光のみ。人物・人体なし。絵を減らす |

1:57.0 が全編の最大の転換点。
直前3.6秒でほぼ絵を消し、1:57.0ちょうどでディゾルブではなくカットで一気に明転。

### 7. Final Chorus（1:57.0–2:31.2）｜9カット・各3.8s

彩度+15／輝度+10。全編で最も明るく。

| IN | 歌詞 | 素材 | 演出 |
|---:|---|---|---|
| 1:57.0 | こんきょのない じしんで | S33 (H) ★専用 | 転換点。静的な印象より前へ進む印象の強い1枚 |
| 2:00.8 | いっぽ ふみだせば いい | S34 (A) | 明るい |
| 2:04.6 | ミリーが はしってくから | S35 (A) | 動きのある1枚 |
| 2:08.4 | きみも わらって ついてきて | S36 (H) | 笑顔 |
| 2:12.2 | こんきょのない じしんを | S37 (A) | 正面 |
| 2:16.0 | だれかに わたせたなら | G5 | 主題②＝「すでに届いている」。光が複数へ広がる。1:07.2から前進 |
| 2:19.8 | きょうの いみが のこるんだ | S38 (A) | 余韻 |
| 2:23.6 | わたしは ミリーだよ | S39 (A) | 正面 |
| 2:27.4 | みつはし りこ ミリーだよ | S40 (H) | フルネーム。テロップ最大 |

### 8. Outro（2:31.2–2:44.3）

盛らない。そっと近づいて終わる。

| IN | 秒数 | 歌詞 | 素材 | 演出 |
|---:|---:|---|---|---|
| 2:31.2 | 3.0s | よろしくね | S41 (A) | 手を振る／振り返る系の実写真 |
| 2:34.2 | 4.0s | わすれないで | G6 | 朝日。人物・人体なし |
| 2:38.2 | 6.1s | — | S42 (H) ★専用 | **本編で最も自然な笑顔。全編の決めカット。** 2:41.5からフェードと同期 |

クレジットは 2:38.2 以降に静かに重ねる。

---

## 機械検算用マスターテーブル（全48カット）

上のカット割りと同一内容を、IN/OUTを明示した1枚の表にしたもの。数値検算はこの表の実体から行う。

| # | Cut ID | Role | セクション | IN | OUT | 長さ |
|---:|---|---|---|---:|---:|---:|
| 01 | G1 | — | Intro | 0:00.0 | 0:04.0 | 4.0 |
| 02 | S1 | H | Intro | 0:04.0 | 0:08.0 | 4.0 |
| 03 | S2 | A | Intro | 0:08.0 | 0:11.7 | 3.7 |
| 04 | S3 | A | Verse 1 | 0:11.7 | 0:14.7 | 3.0 |
| 05 | S4 | H | Verse 1 | 0:14.7 | 0:17.7 | 3.0 |
| 06 | S5 | A | Verse 1 | 0:17.7 | 0:20.7 | 3.0 |
| 07 | S6 | A | Verse 1 | 0:20.7 | 0:23.7 | 3.0 |
| 08 | S7 | A | Verse 1 | 0:23.7 | 0:26.7 | 3.0 |
| 09 | S8 | A | Verse 1 | 0:26.7 | 0:29.7 | 3.0 |
| 10 | S9 | A | Verse 1 | 0:29.7 | 0:32.7 | 3.0 |
| 11 | S10 | A | Verse 1 | 0:32.7 | 0:35.7 | 3.0 |
| 12 | S11 | M | Pre-Chorus | 0:35.7 | 0:38.45 | 2.75 |
| 13 | S12 | M | Pre-Chorus | 0:38.45 | 0:41.2 | 2.75 |
| 14 | G2 | — | Pre-Chorus | 0:41.2 | 0:43.95 | 2.75 |
| 15 | S13 | M | Pre-Chorus | 0:43.95 | 0:46.7 | 2.75 |
| 16 | S14 | H | Chorus | 0:46.7 | 0:50.8 | 4.1 |
| 17 | S15 | A | Chorus | 0:50.8 | 0:54.9 | 4.1 |
| 18 | S16 | A | Chorus | 0:54.9 | 0:59.0 | 4.1 |
| 19 | S17 | H | Chorus | 0:59.0 | 1:03.1 | 4.1 |
| 20 | S18 | A | Chorus | 1:03.1 | 1:07.2 | 4.1 |
| 21 | G3 | — | Chorus | 1:07.2 | 1:11.3 | 4.1 |
| 22 | S19 | A | Chorus | 1:11.3 | 1:15.4 | 4.1 |
| 23 | S20 | H | Chorus | 1:15.4 | 1:19.3 | 3.9 |
| 24 | S21 | M | Verse 2 | 1:19.3 | 1:21.8 | 2.5 |
| 25 | S22 | M | Verse 2 | 1:21.8 | 1:24.3 | 2.5 |
| 26 | S23 | M | Verse 2 | 1:24.3 | 1:26.8 | 2.5 |
| 27 | S24 | M | Verse 2 | 1:26.8 | 1:29.3 | 2.5 |
| 28 | S25 | M | Verse 2 | 1:29.3 | 1:31.8 | 2.5 |
| 29 | S26 | M | Verse 2 | 1:31.8 | 1:34.3 | 2.5 |
| 30 | S27 | M | Verse 2 | 1:34.3 | 1:36.8 | 2.5 |
| 31 | S28 | M | Verse 2 | 1:36.8 | 1:39.4 | 2.6 |
| 32 | S29 | A | Bridge | 1:39.4 | 1:42.9 | 3.5 |
| 33 | S30 | A | Bridge | 1:42.9 | 1:46.4 | 3.5 |
| 34 | S31 | A | Bridge | 1:46.4 | 1:49.9 | 3.5 |
| 35 | S32 | A | Bridge | 1:49.9 | 1:53.4 | 3.5 |
| 36 | G4 | — | Bridge | 1:53.4 | 1:57.0 | 3.6 |
| 37 | S33 | H | Final Chorus | 1:57.0 | 2:00.8 | 3.8 |
| 38 | S34 | A | Final Chorus | 2:00.8 | 2:04.6 | 3.8 |
| 39 | S35 | A | Final Chorus | 2:04.6 | 2:08.4 | 3.8 |
| 40 | S36 | H | Final Chorus | 2:08.4 | 2:12.2 | 3.8 |
| 41 | S37 | A | Final Chorus | 2:12.2 | 2:16.0 | 3.8 |
| 42 | G5 | — | Final Chorus | 2:16.0 | 2:19.8 | 3.8 |
| 43 | S38 | A | Final Chorus | 2:19.8 | 2:23.6 | 3.8 |
| 44 | S39 | A | Final Chorus | 2:23.6 | 2:27.4 | 3.8 |
| 45 | S40 | H | Final Chorus | 2:27.4 | 2:31.2 | 3.8 |
| 46 | S41 | A | Outro | 2:31.2 | 2:34.2 | 3.0 |
| 47 | G6 | — | Outro | 2:34.2 | 2:38.2 | 4.0 |
| 48 | S42 | H | Outro | 2:38.2 | 2:44.3 | 6.1 |

---

## 専用にする3枚

再利用せず、この3箇所だけに使う。

| 箇所 | 求める質 |
|---|---|
| 0:46.7（S14） | サビ頭。強さ |
| 1:57.0（S33） | 大サビ。前に進んでいるエネルギー |
| 2:38.2（S42） | ラスト。最も自然な笑顔 |

---

## 人物なし情景B-roll 6本

生成AIを使う場合は Text→Videoのみ。みりぃ本人の写真・人物参照は入力しない。

また、有料クレジットは原則使用しない。
生成前に無料枠・加入プラン内であることを確認し、有料消費が必要なら実行せず停止する。

| # | 使用箇所 | Prompt |
|---|---:|---|
| G1 | 0:00.0 | 16:9 cinematic landscape. Golden morning sunlight streaming through soft atmospheric haze, subtle dust particles floating in backlight, empty environment, absolutely no people, no human body, no human face, no hands, no silhouettes, no sunflower, no sunflowers, no text, no logo, no watermark. Slow gentle camera drift forward, warm natural tones, calm hopeful mood, photorealistic, single continuous shot. |
| G2 | 0:41.2 | 16:9 cinematic landscape. Brilliant warm sunlight breaking through layered clouds, radiant light rays expanding across the frame, subtle realistic lens flare, empty sky and distant horizon, absolutely no people, no human body, no human face, no hands, no silhouettes, no sunflower, no sunflowers, no text, no logo, no watermark. Slow upward camera tilt, bright hopeful mood, photorealistic, single continuous shot. |
| G3 | 1:07.2 | 16:9 cinematic abstract scene. A single tiny warm point of light slowly appears within deep quiet darkness and faint atmospheric mist, then gently grows brighter without changing position. Absolutely no people, no human body, no human face, no hands, no silhouettes, no sunflower, no sunflowers, no text, no logo, no watermark. Minimal composition, tender and symbolic mood, photorealistic light behavior, single continuous shot. |
| G4 | 1:53.4 | 16:9 cinematic minimal landscape. Near-total darkness with only one very small distant warm point of light at center, faint atmospheric haze, the light slowly becomes slightly brighter while almost the entire frame remains dark. Absolutely no people, no human body, no human face, no hands, no silhouettes, no sunflower, no sunflowers, no text, no logo, no watermark. Locked-off camera, restrained introspective mood, single continuous shot. |
| G5 | 2:16.0 | 16:9 cinematic wide landscape at blue-to-golden dawn. One warm point of light appears in the distance, then many separate warm lights gently illuminate across the landscape in a spreading pattern, symbolizing courage passing from one place to another. Absolutely no people, no human body, no human face, no hands, no silhouettes, no sunflower, no sunflowers, no text, no logo, no watermark. Slow subtle pullback, expansive radiant hopeful mood, photorealistic, single continuous shot. |
| G6 | 2:34.2 | 16:9 cinematic empty sunrise landscape. A clean distant horizon at dawn, soft golden sun rising slowly, warm natural light gradually filling the frame through delicate morning haze. Absolutely no people, no silhouettes, no human body, no human face, no hands, no animals, no sunflower, no sunflowers, no text, no logo, no watermark. Very slow stable camera rise, calm hopeful closing-shot mood, photorealistic, single continuous shot. |

ひまわりは使わない。
歌詞に無く、夏の記号として強すぎるため。光・逆光・朝日で通す。

---

## 編集ルール

### ズーム

- 100% → **106〜108%** まで
- Hero＝ゆっくり寄る
- モンタージュ帯＝速め
- Bridge＝ほぼ静止

### トランジション

- 基本: クロスディゾルブ 0.3s
- Chorus: ディゾルブ 0.5s
- 感情転換: 白フェード
- 1:57.0のみ真のハードカット

### 縦写真

- 背景に同じ写真を拡大＋強ぼかし
- 前面に原寸比率を維持して配置
- 全編統一

### 色調

- 第1幕＝自然光
- 第2幕＝彩度+10
- 第3幕＝彩度−15・輝度−10
- 第4幕＝彩度+15・輝度+10

### 歌詞テロップ

- 全編
- 白・縁取りあり・下1/4
- 名前の行（0:14.7／1:15.4／2:27.4）のみ大きく

---

## 写真の仕分け

1. 自然な笑顔
2. やわらかい表情
3. 活動感（ステージ・イベント）
4. ラジオ関連
5. 篠笛関連
6. 明度を抑えた／視線を外した写真（Bridge用）

先に決めるのは3枚だけ。
S14（0:46.7）／S33（1:57.0）／S42（2:38.2）。

ラジオ・篠笛の本人実写真が無い場合は、S8 / S9とも別の公開・利用確認済み本人実写真へ置き換える。人物・人体なし情景B-rollへは置き換えず、G1〜G6を増やさない。

本人が篠笛を吹いているAI画像は作らない。

---

## 公開前チェックリスト

- 使用写真がすべて本人の公開・利用確認済みのものか
- 配信画面録画・SHOWROOMスクリーンショットをMV素材として使っていないか
- 人物をAIで動かしたカットが1つも無いか
- 本人の顔・身体・髪・服をAI生成／置換／補正／生成塗り足ししていないか
- 縦横比の処理が全カットで統一されているか
- Bridge（1:39.4–1:57.0）が明度・情報量ともに落ちているか
- 1:57.0 のタメが音とズレていないか（目標±0.1秒）
- 設計タイムラインが0:00.0〜2:44.3、gap/overlap 0になっているか
- 最終書き出しが実音源164.352秒へ同期しているか
- クレジット: 「みんなの太陽／三橋莉子 非公式応援MV／Music by あっきー（AI × Suno）」
- 「非公式」の一語が入っているか
- 学年を映像テロップ・概要欄で強調していないか
- 公開作品に職業・勤務先等を特定する情報が入っていないか
- 概要欄がファン／サポーターの立場で書かれているか
- 本人賛美だけで終わらず、見る人が前を向ける作りになっているか
- 追加課金が必要な生成処理を使用していないか

---

## 機械検算の期待値

- 総カット: 48
- S: 42（S1〜S42）
- G: 6（G1〜G6）
- Hero: 9
- 補助: 22
- モンタージュ: 11
- Cut ID欠番・重複: 0
- IN/OUT gap: 0
- IN/OUT overlap: 0
- 設計先頭: 0:00.0
- 設計末尾: 2:44.3
- 設計総尺: 164.3秒
- Verse 2: 20.1秒
- S28: 2.6秒
- Hero実体上の表示秒数レンジ: 3.0〜6.1秒
- 実音源: 約164.352秒
- 最終書き出し時のみ実音源尺へ末尾をスナップ
