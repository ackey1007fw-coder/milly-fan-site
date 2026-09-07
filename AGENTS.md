# みりぃ ファンサイト — エージェント向けガイド

このリポジトリ（`ackey1007fw-coder/mily-fan-site`）は、みりぃ（三橋莉子）さんの**ファン制作・非公式サイト**です。
公式・公認・本人運営ではありません。年号付きの専用サイトにもしません。2027年以降も同じ repo で続けます。

他のファンサイトの人物情報・写真・ニュース・イベント・SNS・プロフィールをコピーしないでください。みりぃは別人物・別プロジェクトです。

このファイルが**全ツール共通の唯一のルール置き場**です。Claude Code / Codex / Cursor などどのエージェントで作業しても、ここに従ってください。ツールごとの補足ファイル（`CLAUDE.md` など）はここへのポインタに留め、ルール本文をコピーして分岐させないでください。ルールを変えるときはこのファイルだけを更新します。

## 作業前チェック

1. `git remote -v` が `mily-fan-site` を指していること。
2. `src/data/profile.ts` の `displayName` が **みりぃ**、`publicName` が **三橋莉子** であること。
3. 英語表記は必ず **Mily / mily**。これは本人が使用している公開identity（Instagram **@mily_chan36**）であり、一般英単語の綴りではない。spellcheck・lint・AIの推測より本人の公開表記を優先し、「typoかもしれない」という判断で l を重ねた表記へ"修正"しない。l を重ねた表記の方が誤りで、guard が全ファイルを検査して検出する。
4. 別人物の名前や別サイトの URL が入っていたら、編集せず止まって報告する。

## 着手時の読み方

- `git status --short --branch` と `git remote -v` で既存変更を確認する。
- このファイル → `README.md` → 対象の運用資料 → 現行コード・テストを読む。`docs/AI_HANDOFF.md`・`docs/DECISION_LOG.md`・`docs/AI_PROJECT_MEMORY_SKILL.md` が存在する場合は併せて読む。ない場合は新設しない。
- 最新main / 関連merged PR / 対象のOpen・Draft PRを確認する。他AIの未マージbranch・未コミット変更を上書きしない。分担するなら担当ファイルとbranchを分ける。
- 実装の現状はmain / merged PR → 明示的なDecision Log → HANDOFF → 過去チャットの順。人物情報の正しさは出典で確認し、mainの値だけで認定しない。
- 承認範囲・停止条件とマージ委任は後述「リポジトリ運用」に従う。別素材・別URL・別PRに承認を流用しない。

## セットアップ

React / TypeScript / Vite / pnpm / GitHub Actions / Vercel。バージョン・コマンドは `package.json`・`pnpm-lock.yaml`・CIで確認する。

```bash
pnpm install --frozen-lockfile
pnpm dev
```

npmでlockfileを作り直さない。認証情報を会話・ファイル・ログへ出さない。

## 編集先と手順

| 作業 | 正本・参照先 |
| --- | --- |
| プロフィール | `src/data/profile.ts`。出典台帳・確認済み事実。変動項目は `asOf` |
| 出演・イベント | `src/data/events.ts`。年をまたいで同じ配列を使う |
| 最新情報 | `src/data/news.ts`。日時・掲載日・同日順は `docs/CONTENT-OPS.md` |
| 写真・動画 | `src/data/media.ts` / `docs/MEDIA.md` |
| 本人SNS・その他リンク | `src/data/socials.ts` / `src/data/links.ts` |
| 活動・ハイライト | `src/data/activities.ts` / `src/data/highlights.ts` |
| 配信メモ | `src/data/streamRecaps.ts` と各回の `src/data/streamRecap*.ts` |
| サイト情報 | `src/data/site.ts` |
| 配信予定・ラジオ | `src/data/streamSchedule.ts` / `src/data/radio.ts`、下記のAPI運用 |

日常更新の詳細は `docs/CONTENT-OPS.md`、素材の受け入れ・インベントリは `docs/MEDIA.md`。推測した値・URLや、未マージPRにしかないファイルを正本にしない。未確認項目は空のまま残す。

### 配信メモの入口

- `/activities/live/` の配信メモは、既存の `StreamRecap` 型・共通表示・各回データ・関連テストを先に確認する。新しい回ごとに別のカード構造を増やさない。
- 配信メモの書式・カード順・共通注記・機械検査は `docs/LIVE-STREAM-RECAP.md` に委任する。ただし、この `AGENTS.md` が最終優先であり、同文書はここにある禁止事項や公開範囲を緩めたり上書きしたりしない。
- 新しい回を配信日時順に配置し、同日内でも朝・昼・夜の順序を確認する。確認できる出典の範囲、時刻の精度、文字起こしの制約を記録する。
- 原動画を確認したのか、提供レポート・文字起こしのみを確認したのかを区別する。未視聴なのに「動画確認済み」と書かない。
- 過去回の次回案内は「配信時点では〜と案内」の過去時制にする。現在の `streamSchedule.ts` へ自動転記しない。
- 全文文字起こし・録画・非公開の受け渡しURL / ID・ランキング個人名・私生活の詳細を公開しない。公開アーカイブに必要な本人の発言と活動を要約する。
- 確認済み写真がない回へ、別の回の写真を流用しない。テキストだけでも成立させる。
- 未マージの統一ルールPRがある場合、mainとの差分を確認する。そのPRの手順書・検査を導入済みと記述しない。

## メディア（写真・動画）の扱い

詳細な手順とインベントリは `docs/MEDIA.md`。要点:

### メディア掲載の原則

- オーナーから提供された、または掲載を明示承認された画像・動画は、プライバシー・出典・権利・品質上の問題がない限り、原則としてサイトへ掲載する。
- 素材がある場合は非掲載を初期値にせず、掲載ゲートを確認したうえで、Story / Latest / NEWS / Gallery 等のどこへ載せるのが適切かを先に判断する。
- 非掲載は例外とする。掲載しない場合は、プライバシー・第三者情報・出典 / 権利・重複・品質・掲載面・技術上の問題など、具体的な理由をPR本文または最終報告に残す。
- 原則掲載であっても、出典確認・プライバシー確認・第三者情報確認を省略しない。
- Story閲覧スクリーンショットには一般メディアより追加の安全条件がある。`docs/CONTENT-OPS.md` と `docs/MEDIA.md` の限定ルールも満たした場合だけ掲載する。

### ビジュアル方針（photo-forward）

- このサイトは、みりぃの表情・雰囲気・活動の魅力が伝わる**写真・動画を活かした華やかなファンサイト**を基本方針とする。安全に公開できる承認済み素材がある場合、テキストだけで済ませたり代表1枚だけへ過度に縮めたりせず、内容に合う複数の写真・動画を積極的に使う。
- 同じNEWS・Story・活動記録に複数の適切な素材がある場合は、主役となる代表素材を明確にしたうえで、既存の `additionalMedia`、Story、Gallery、活動ページ等の仕組みを使い、閲覧者が複数の表情や場面を楽しめる構成を優先する。
- 華やかさは**安全に使える実素材の豊かさ**で作る。同一素材を意味なく何度も並べる、素材がないのに複製して水増しする、未承認素材を補う、AI生成や生成塗り足しで写真を増やす、といった方法は使わない。
- 写真の顔・身体・重要な被写体を、カード比率を揃えるためだけに不自然に切らない。縦長・横長・正方形など元の構図を尊重し、必要なら `object-contain` 等で全体を見せる。本人の魅力が最も自然に伝わる表示を優先する。
- 複数メディアを使う場合も、モバイルでの横overflow、巨大な初期転送量、レイアウト崩れを避ける。既存のresponsive画像・poster・lazy loading・サイズ最適化の仕組みがある場合は再利用し、視覚的な豊かさと表示性能を両立する。
- このphoto-forward方針は、プライバシー、第三者情報、出典、権利、Story閲覧スクリーンショットの追加条件、本人写真のオーナー確認、X / Instagram の SNS 自動取得禁止を一切緩和しない。Mixch outbound player card は後述の限定例外であり、Mixch ファイルの自己ホストや X/IG サムネイル hotlink を許可するものではない。掲載ゲートを満たす素材の中で、より華やかで魅力が伝わる見せ方を選ぶ。
- 承認済み素材が1点だけ、または安全に使える素材がない場合は、存在しない写真を作らず、その時点の確認済み素材だけで構成する。素材不足を理由に本文や予定の掲載自体を止める必要はない。

- 元素材は `media/original/`（gitignore 済み・コミットしない）。**元ファイルを上書き・リネーム・再エンコードしない。**
- 公開用派生は `pnpm media:build` で `public/media/gallery/` に生成する（EXIF / GPS / IPTC は自動で除去される）。
- 生成スクリプトは既存ファイルを**上書きせず停止**する。内容を変えるときは新しいファイル名にする（公開済みファイル名は不変）。
- ファイル名は `mily-bNN-NN-<slug>` 形式。日付が未確認のうちはファイル名に日付を入れない（捏造しない）。
- 掲載は `src/data/media.ts` の `published: true` のみ。出典 URL・投稿日・撮影者が未確認の項目は `null` のまま残す（推測して埋めない）。
- 本人の顔の AI 生成・置換・補正・加工、生成塗り足しは禁止。
- X / Instagram / Mixch の動画ファイルを git、`media/original/`、`public/media/` へ自動ダウンロードしない。X / Instagram の画像 CDN URL をサイトメディアとして hotlink しない。Mixch の `_movie_mps` / MP4 をこのドメインで再生しない。Mixch タイムラインはクロールせず、オーナーが指定した movie URL だけを扱う。
- **Mixch outbound の限定例外:** オーナー指定の公開 Mixch 動画（`https://mixch.tv/m/{id}`、確認済み本人アカウント `https://mixch.tv/u/10114673`）は、NEWS（Latest）と Gallery で Mixch outbound player card として出してよい。Activities の「関連するメディア」には出さない（`activityIds` による関連 NEWS は残す）。カードは動画らしく見せる（poster + play overlay）。poster はその動画の公式 Mixch サムネイル（`thumbnailUrl` / mixch.tv の og:image）を使ってよい。これは唯一の SNS サムネイル例外で、X / Instagram は禁止のまま。Play / click / CTA は Mixch movie URL を新しいタブで `rel="noopener noreferrer"` 付きで開く。NEWS と Gallery は動画ごとに同じオブジェクトを共有する（TikTok `tiktokRadioVideo` と同じ）。Mixch ファイルを repo にコピーしない。オーナーが後から原ファイルを提供した場合は既存の自己ホストパイプラインを使う（別経路）。photo-forward は維持し、Mixch カードはビジュアルとして数えるので該当 NEWS をテキストだけにしない。

## 配信予定の自動取得

- `/api/mily-schedule`（Vercel Function）が毎回 ENTRY 734 ページ起点で SHOWROOM room を自動解決し、AGE schedule JSON から配信予定を返す。**room ID をコードに直書きしない・推測しない。**
- 候補 room は SHOWROOM プロフィール API のルーム名（みりぃ / 三橋 / Mily）で本人検証してから採用。複数一致は曖昧として不採用。
- 環境変数 `MILY_SHOWROOM_ROOM_ID` / `MILY_SCHEDULE_URL` は自動解決失敗時の任意フォールバック（必須の手入力値ではない）。
- 手入力 fallback は `src/data/streamSchedule.ts`。**未確認の配信時刻を書かない。** 空なら配信予定セクションは非表示。
- 解決チェーンの実環境検証は Actions の「Probe stream schedule」を workflow_dispatch で実行（`scripts/probe-schedule.mjs`）。

## FMラジオ放送状態

- `/api/mily-radio-status` が Asia/Tokyo で「湘南シーサイドサークル」の放送日・時間帯を返す。確認済み枠は日曜 10:00–13:00。
- FMトップ（https://fm-smw.jp/）の NOW ON AIR を実行時取得し、番組名が明確に一致したときだけ `onAirConfirmed: true`。
- 取得失敗・HTML変更・曖昧な場合は `onAirConfirmed: null`。別番組または NOT ON AIR が読めた場合は `false`。false と unavailable を混ぜない。
- 時間帯や NOW ON AIR だけでは `milyAppearanceConfirmed` を true にしない。毎週本人が3時間出演しているとは断定しない。
- 確認済み事実は `src/data/radio.ts`。未確認の出演者・コーナー・例外放送を推測して足さない。

## 公開データの境界

- 非公式・ファン制作の表記を保つ。私的DM、非公開の人間関係、私的住所・連絡先・家族情報、不要な第三者情報を公開コード・コメント・PR・文書へ持ち込まない。
- 制作者の職業を特定する公開紹介を避ける。
- 引用は原文どおりの範囲に限り、要約・altに感情や関係性の推測を入れない。
- 外部リンクは `https: / http:` のみ。新しいタブで開くリンクには `rel="noopener noreferrer"` を付ける。既存の同一タブの戻り導線は維持する。
- メディア制限とMixchの限定例外は上記「メディア（写真・動画）の扱い」を参照する。例外の対象を拡大しない。

## 品質ゲート

PR前に次を通す。

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm guard
git diff --check                      # 未ステージの変更
git diff --cached --check             # ステージ済みの変更
git diff --check origin/main...HEAD   # コミット済みのPR差分（最新のbaseを取得後）
```

UI変更はモバイル・PCで対象画面、横overflow、画像・動画、リンクを確認する。文書変更でも参照先・コマンド・矛盾・公開範囲を確認する。未実行は成功と書かず、環境制約と代替のCI確認を報告する。テストやguardの無効化で通さない。

## リポジトリ運用

- GitHub: `ackey1007fw-coder/mily-fan-site`
- 通常運用では `main` へ直接 push しない。
- `main` から作業ブランチを切り、PR にする。
- マージ方式の指定がなければ **squash merge**。
- Vercel で本番公開済み（https://mily-fan-site.vercel.app/）。`main` への merge は本番に反映されるため、CI とオーナー確認を経てから merge する。
- Codex review は**任意の追加レビュー**。オーナーがそのPRで明示的に必須指定した場合を除き、未実施・利用上限・接続障害だけを理由に merge を止めない。
- `@codex review` を使う場合、オーナーが投稿する。エージェント / automation は「### 任意のCodexレビュー依頼の委任」の条件を全て満たす場合のみ代理投稿してよい。
- Codex の接続エラーや利用上限をレビュー成功として扱わない。ただし、Codex review 自体が必須指定されていなければ merge blocker にもしない。

### マージしてよい条件

1. 対象が `mily-fan-site`、base が `main`、head が作業ブランチ。
2. PR が Draft ではなく、競合がなく、マージ可能。
3. CI（install / typecheck / test / build / identity guard）が成功。
4. 未解決の blocking review 指摘がない。
5. 追加した事実に出典がある。未確認情報は載せていない。
6. オーナーがそのPRで特定の追加レビューを明示的に必須指定した場合のみ、そのレビューが current head で完了している。

次の変更はオーナー確認が必要です。

- プロフィール事実の追加・変更
- SNS / 外部リンクの追加
- 本人写真の追加・差し替え
- 本番公開・ドメイン設定
- `AGENTS.md` そのものの変更
- リポジトリ運用ルールの変更
- レビュー委任ポリシー（「### 任意のCodexレビュー依頼の委任」）の変更

エージェントが自分の判断だけで委任条件を緩和・削除・拡張しない。

### 既定のマージ委任

オーナーがこのrepoへの変更を依頼し、同じ依頼またはその後の指示で
「Draftのまま」「レビューまで」「マージしない」などの停止条件を明示しない場合、
その依頼は、オーナーが使う **GitHub 接続済みの AI エージェント / automation** が
対象変更をPR化し、「### マージしてよい条件」をcurrent headですべて満たした時点で
**squash merge**まで進めることへのrepo単位の承認を含む。merge直前の個別確認は不要。

この既定委任は品質ゲート・確認範囲を緩和しない。次をすべて守る。

- オーナー確認が必要な変更は、依頼文またはその後の返信で当該事実・URL・素材・操作が
  明示された範囲だけを承認済みとして扱う。別素材・別URL・別掲載面・別PRへ流用しない。
- 実装中に依頼範囲を超える変更、未確認情報、権利・プライバシー上の懸念、blocking feedback、
  current headのCI / Vercel / オーナーが必須指定したレビュー不成立、競合、状態の曖昧さが生じた場合は自動mergeしない。
- 任意レビューの request を送っただけ、👀が付いた状態、旧headのreview完了は品質確認の代用にしない。
- オーナーが停止条件を示した場合はそれを優先し、解除が明示されるまでmergeしない。

**このルールは、この節がmainへmergeされた後の新しい依頼から有効。**
このルールを追加・変更するPR自身は、追加前のmainの規定と、そのPRに対するオーナーの
明示指示に従う。

### 任意のCodexレビュー依頼の委任

Codex review は**追加の品質確認であり、既定の merge 必須条件ではない**。オーナーがそのPRで明示的に「Codex review 完了を必須」と指定した場合のみ、完了まで merge を止める。利用上限・接続障害・サービス側エラーなどで Codex review を実行できない場合、必須指定がなければ CI / Vercel / 差分確認 / 他の blocking feedback を満たした時点で merge 判定を続行してよい。

`@codex review` の代理投稿は、オーナーが使う **GitHub 接続済みの AI エージェント / automation** に限って委任する。この節が `main` へ merge されたことを、オーナーによる repo 単位の許可とみなす。不特定の bot や第三者へ権限を与えるものではない。委任するのは review 要求の投稿だけで、merge 権限・オーナー確認・本番操作はいっさい緩和しない。

**このルールは `main` へ merge された後のみ有効。** 作業ブランチ上で `AGENTS.md` を書き換えただけでは有効にならない。委任ポリシーを変更する PR 自身には、その時点の `main` のルールが適用される。したがってそのPRへはエージェントが `@codex review` を投稿せず、オーナーの明示指示に従う。

投稿してよいのは **PR Conversation の top-level comment** に本文 `@codex review` の1件だけ。review reply / inline comment / PR 本文 / commit message をレビュー要求の代用にしない。

#### 投稿前に全て確認する

1. repository が `ackey1007fw-coder/mily-fan-site`
2. base が `main`、head が `main` ではない作業ブランチ
3. PR が OPEN で、Draft ではない
4. 競合がなく mergeable
5. current head SHA を取得済み
6. current head で GitHub Actions の CI が SUCCESS
7. Vercel の status / check がある場合、current head で SUCCESS
8. 既知の blocking feedback が修正済みで、未解決の blocking review thread が 0
9. current head について Codex review が未完了・review request 未送信・Codex が review 中でない

1つでも確認できない場合は投稿しない。状態が曖昧な場合も投稿しない。

#### exactly-once per head

同一 head SHA へ `@codex review` を重複投稿しない。投稿前に、少なくとも current head SHA / PR Conversation / Codex の review submission / review thread / Codex の reaction・review 結果を確認する。

次のいずれかなら投稿しない。

- current head を Reviewed commit とする Codex review が既に存在する
- current head に対する review 開始を示す Codex の 👀 がある
- current head への review request が既に存在すると合理的に確認できる
- 同一 head への request 有無を安全に判定できない

判定が曖昧なときは、重複投稿せずオーナーへ確認を求める。

#### Codex の状態の読み方

- **👀（eyes）は review 開始 / review 中を意味する。review 完了ではない。** 👀 が確認できる間は同じ head へ review request を再投稿しない。
- **👍 / +1** が Codex による review completion として確認でき、review 開始後に head が変わっておらず、新規の未解決 thread も blocking feedback も無い場合は、no-suggestion review completion として扱ってよい。
- Codex が "Didn't find any major issues" 等の明示的な clean result を返し、Reviewed commit が current head と一致する場合も、no-suggestion completion として扱ってよい。
- formal review submission がある場合は、Reviewed commit が current head と一致するか確認する。新規 review thread があれば、その feedback を処理してから次へ進む。

#### head が変わったとき

review request 後に commit が push されて head SHA が変わったら、**旧 review を current head の review として扱わない。** 新しい head について CI / Vercel / 未解決 thread / blocking feedback / mergeability を確認し直し、すべて成立した場合のみ、新 head へ `@codex review` を1回だけ投稿してよい。

#### 投稿が失敗したとき

`@codex review` 投稿時に API error / connector error / timeout / permission error / 不明な応答が発生した場合、「たぶん投稿できた」と推測しない。PR Conversation を取得し直し、comment が実際に存在するか確認する。存在しない場合は自動で連打・再投稿せず、失敗をオーナーへ報告する。

`@codex review` comment が GitHub 上に存在するのに一定時間たっても Codex の反応を確認できない場合も、同じ head へ自動再投稿しない。「review request は存在するが、Codex の反応を確認できない」とオーナーへ報告する。

#### review request は merge 許可ではない

エージェントが `@codex review` を投稿できることは、PR を自動的に merge してよいという意味ではない。「### マージしてよい条件」とオーナー確認が必要な項目はすべてそのまま適用する。Codex review が任意のPRでは、その未完了・利用上限・接続障害だけを merge blocker にしない。

## 完了報告

変更内容、PRとcurrent head、実行した検証、残る確認事項を短く示す。mergeはGitHubの `merged=true`・日時・mainへの反映を確認し、Vercel本番の確認とは区別する。PRのcloseやローカル修正だけを「マージ・本番反映完了」と呼ばない。

大きなPhase後は既存HANDOFFを確認し、長期判断は既存Decision Logへ記録する。Project Memoryがない場合は、このガイド・既存運用資料・PRで引き継ぐ。
