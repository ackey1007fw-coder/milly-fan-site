# 日常更新ガイド — mily-fan-site

Cursor Agent が、確認済みの公開情報だけをデータファイルへ足すための手順です。
サイトのルール本体は `AGENTS.md`。写真の詳細は `docs/MEDIA.md`。ここには日常更新の手順とテンプレートだけを置きます。
LIVE STREAM の配信メモ（`src/data/streamRecaps.ts`）は `docs/LIVE-STREAM-RECAP.md` の統一ルールに従います。
このファイルの配信メモの節には、その回で判断したことだけを残します（構造・書式は統一ルール側）。

このファイルのコード例は**ドキュメント用**です。実在しないダミーを `src/data/` へコピーしないでください。

---

## いま載っているもの（2026-08-27 監査）

事実は書き換えず、現状の棚卸しです。空欄は未確認のため意図的に空です。

| ファイル | 掲載 | 出典 | メモ |
| --- | --- | --- | --- |
| `news.ts` | 81件。9/7の本人X「キャンガル2027 本選EX期間」（本人X `https://x.com/mily_chan36/status/2096754197362622971`。恒久permalink。b64-01本選EX vol.1案内グラフィックをNEWS代表、b64-02メッセージ＋日程表をadditionalMedia。実写ではないためGallery非掲載。sameDayOrder: 10。activityIds: campus-girls。SNS審査 SupportEvent 追加。Paton CTAなし（本選EXの投票先URL未確認）。`/stories/` / highlights / events / streamSchedule / contest.ts / profile / media.ts 非追加）、9/6の本人X「配信ありがとう、明日は6:30と22:00」（本人X `https://x.com/Mily_chan36/status/2096604917893095494`。恒久permalink。テキストNEWS＋出典リンクのみ。写真なし。投票CTAなし。メイク告知はNEWSにしない。sameDayOrder: 40で同日のキャンガル結果より前。activityIds: live-stream。Gallery / media.ts / `/stories/` / highlights / events / contest.ts / profile非追加。9/7枠は streamSchedule に 06:30–07:30 と 22:00–23:00）、9/6の本人X「キャンガル2027 予選final 結果報告」（本人X `https://x.com/mily_chan36/status/2096422147476627841`。恒久permalink。b63-01人物写真をNEWS代表＋Gallery。sameDayOrder: 30で同日の夜枠変更より前。activityIds: campus-girls。highlights追加。Paton CTAなし。`/stories/`・events・streamSchedule・contest.ts・profile非追加）、9/4のInstagram Story「「2日目ポチッとな〜」投票の呼びかけ」（batch b59-01動画をLatest / NEWSとGalleryで共有。無音公開派生。恒久permalinkなしのため非リンクの `Instagram Story` label＋Instagramプロフィール関連リンク。追加CTAは確認済みのWEB投票リンクのみで、SupportEventの期間（2026-09-13 23:59 JST）終了後は自動で消える。リンク先と特典の内容・条件は未確認のため本文へ書かない。WEB投票期間・三次日程は既存カードへ重複掲載しない。activityIds: miss-circle。sameDayOrder: 10。idは `2026-09-04-third-round-vote-day2-story`。`/stories/` / highlights / events / streamSchedule / media.ts / contest.ts非追加）、9/3の本人X「三次審査、目標と応援方法」（本人X `https://x.com/Mily_chan36/status/2095397884107849991`。恒久permalink。テキストNEWS＋出典リンクのみ。写真なし。投票CTAなし。WEB投票期間・三次日程・配信中案内・毎日WEB投票は既存カードへ重複掲載しない。9/2三次審査NEWSとは別カード。activityIds: miss-circle。Gallery / media.ts / galleryVideos / `/stories/` / highlights / events / streamSchedule / contest.ts非追加）、9/2のミスサー三次審査（既存 id `2026-09-02-miss-circle-third-round` の本文を2段落の要約へ整理した。sameDayOrder: 10で同日Story 2件より前。activityIds: miss-circle。出典は misscircle.jp、additionalSources は ENTRY 734 と SHOWROOMイベント。CTAはWEB投票／ENTRY 734／SHOWROOMイベント／SHOWROOMルーム。代表は本人配布タイムテーブル b49-01（NEWS専用）。確認済み本人SHOWROOM枠は streamSchedule。審査特典、日別時刻表、SHOWROOMヘッダー枠 9/2 20:00〜9/12 12:59、通過発表、票数、会場三次、AGESTOCK 9/20 横浜アリーナは本文へ重複掲載しない。`/stories/`・highlights・events・media.ts 非追加）、9/2のInstagram Story「おやすみりぃ／明日9:00 SR配信」（b47-01動画をLatest / NEWS＋Galleryで共有。無音公開派生。恒久permalinkなしのため非リンクのInstagram Story label＋プロフィール関連リンク。SHOWROOM CTAあり。Paton CTAなし。9:00はNEWS引用のみで streamSchedule / events 非追加。LIVE STREAMに関連付け。`/stories/`・highlights・contest.ts非追加）、9/2のInstagram Story「パトン投票2位で締められました」（b47-02動画をLatest / NEWS＋Galleryで共有。無音公開派生。恒久permalinkなしのため非リンクのInstagram Story label＋プロフィール関連リンク。投票終了済みのためPaton CTAなし。他出場者名は本文非掲載。144,550ptは投稿時点の記録。CAMPUS GIRLS Activityに関連付け。`/stories/`・events・streamSchedule・highlights・contest.ts・PatonVoteGuideランキング系列非追加）、9/1のSHOWROOM「9月初配信、おやすみりー」（b48-01〜b48-06のボード静止画6枚をLatest / NEWS専用で自己ホスト。代表はあっきーさんボード寄り。やすぴさんはadditionalMedia末尾。Gallery非掲載。出典は非リンクのSHOWROOM label。再生permalinkは作らない。CTAは確認済みSHOWROOMルームのみ（`t=`なし）。Paton投票CTAなし。activityIdsは live-stream のみ。sameDayOrder: 20で同日の他3件より前。`/stories/`・highlights・events・streamSchedule・media・contest.ts非追加）、9/1の本人X「おはよ〜 今日から9月ー」（本人X `https://x.com/Mily_chan36/status/2094579904587382930`。恒久permalink。既存b46-02公開MP4・posterをwrapperでLatest / NEWSに再利用。新しいMP4は作らない。SNS CDNは参照しない。activityIdsなし。Paton CTAなし。SHOWROOM CTAなし。`t=`トラッキングは付けない。既存9/1 Instagram Story「9月のみりぃもよろしくね」とは別投稿。sameDayOrder: 3で既存Instagram Story 2件より前。Gallery / galleryVideos は既存b46-02の1本のまま。media.ts / `/stories/` / highlights / events / streamSchedule / contest.ts / profile非追加）、9/1のInstagram Story「おはよう／今日はパトン投票最終日」（b46-01動画をLatest / NEWS＋Galleryで共有。無音公開派生。恒久permalinkなしのため非リンクのInstagram Story label＋プロフィール関連リンク。Paton投票CTAあり。CAMPUS GIRLS Activityに関連付け。`/stories/`・events・streamSchedule・highlights・contest.ts・PatonVoteGuideランキング系列非追加）、9/1のInstagram Story「9月のみりぃもよろしくね」（b46-02動画をLatest / NEWS＋Galleryで共有。無音公開派生。恒久permalinkなしのため非リンクのInstagram Story label＋プロフィール関連リンク。Paton投票CTAあり。画面は9月のあいさつのためActivities非関連付け。`/stories/`・events・streamSchedule・highlights・contest.ts・PatonVoteGuideランキング系列非追加）、8/31のInstagram Story「キャンパスガールズ2027出場中／パトン投票は9月1日まで／31日は1.5倍」（b45-01動画をLatest / NEWS＋Galleryで共有。本人肉声を保持した公開派生。恒久permalinkなしのため非リンクのInstagram Story label＋プロフィール関連リンク。Paton投票CTAあり。CAMPUS GIRLS Activityに関連付け。`/stories/`・events・streamSchedule・highlights・contest.ts・PatonVoteGuideランキング系列非追加）、8/31のInstagram Story「現在1位／102,700pt／31日は1.5倍DAY」（b44-02動画をLatest / NEWS＋Galleryで共有。無音公開派生。恒久permalinkなしのため非リンクのInstagram Story label＋プロフィール関連リンク。Paton投票CTAあり。1位・102,700ptは投稿時点の記録。CAMPUS GIRLS Activityに関連付け。`/stories/`・events・streamSchedule・highlights・contest.ts・PatonVoteGuideランキング系列非追加）、8/31のInstagram Story「緊急告知／Paton投票1.5倍デー」（b44-01動画をLatest / NEWS＋Galleryで共有。無音公開派生。公式X告知の画面を本人Storyとして案内。恒久permalinkなしのため非リンクのInstagram Story label＋プロフィール関連リンク。Paton投票CTAあり。CAMPUS GIRLS Activityに関連付け。`/stories/`・events・streamSchedule・PatonVoteGuideランキング系列非追加）、8/31のInstagram Story「パトン投票のやり方」（8/27のX案内と同じ手順。他出場者の顔・名前、オーナーサポーター名、投稿時点ではない古い順位表示があるため動画は自己ホストせず、既存b26-01人物写真を代表画像に再利用。Latest / NEWSのみ。CAMPUS GIRLS Activityに関連付け。Gallery / media.ts / galleryVideos / `/stories/` / PatonVoteGuideランキング系列非追加。Paton投票CTAあり）、8/31の本人X「朝から起こしに来てくれたみんな、ありがとう」（本人X `https://x.com/Mily_chan36/status/2094192106105659650`。恒久permalink。テキストNEWS＋出典リンクのみ。視聴者名・アバターが多数写るSHOWROOM画面は公開しない。CTAは確認済みSHOWROOMルーム。`t=`トラッキングは付けない。LIVE STREAMに関連付け。sameDayOrder: 3でInstagram Story 4件の次。X画像CDNは参照しない）、8/31の本人X「パトン1.5倍DAY／投稿時点で1位」（01:37緊急告知を一次出典、07:32無料拍手投稿をadditionalSourcesに統合。恒久permalink。既存b26-01人物写真を代表画像に再利用。投票CTAはPaton本人ページ。1.5倍の投票枠は31日 0:00–23:59 JST。CAMPUS GIRLS Activityに関連付け。sameDayOrder: 2で朝お礼カードの次。Gallery / media.ts / galleryVideos / `/stories/` / highlights / events / streamSchedule / contest.ts非追加）、8/31の本人X「配信中／眠いから私を起こして〜」（本人X `https://x.com/Mily_chan36/status/2094179970960744615`。恒久permalink。テキストNEWS＋出典リンクのみ。CTAは確認済みSHOWROOMルーム。`t=`トラッキングは付けない。LIVE STREAMに関連付け。配信中だった記録。sameDayOrder: 1。Gallery / media.ts / galleryVideos / `/stories/` / highlights / events / streamSchedule / contest.ts非追加）、8/30夜の本人X「30日連続配信記念日」（本人X `https://x.com/Mily_chan36/status/2094023746751463582`。恒久permalink。テキストNEWS＋出典リンクのみ。CTAは確認済みSHOWROOMルーム。`t=`トラッキングは付けない。LIVE STREAMに関連付け。sameDayOrder: 4で同日の先頭。Gallery / media.ts / galleryVideos / `/stories/` / highlights / events / streamSchedule / contest.ts非追加）、8/30朝の本人X「今日のパトン投票／投稿時点で3位」（本人X `https://x.com/Mily_chan36/status/2093802981921849728`。恒久permalink。既存b26-01人物写真を代表画像に再利用。投票CTAはPaton本人ページ。3位は8/30朝の投稿時点の記録であり、8/31の1位カードと矛盾しない。CAMPUS GIRLS Activityに関連付け。sameDayOrder未指定でMixch最終日のあと。Gallery / media.ts / galleryVideos / `/stories/` / highlights / events / streamSchedule / contest.ts非追加）、8/30のInstagram Story「キャンパスガールズ2027情報／2位を守り抜きたい」（b43-02動画をLatest / NEWS＋Galleryで共有。無音公開派生。恒久permalinkなしのため非リンクのInstagram Story label＋プロフィール関連リンク。Paton投票CTAあり。2位は投稿時点の記録。CAMPUS GIRLS Activityに関連付け。`/stories/`・events・streamSchedule・PatonVoteGuideランキング系列非追加）、8/30朝の本人X「おはよーーう／SR 6:00〜6:30」（本人X `https://x.com/Mily_chan36/status/2093802690598064521`。恒久permalink。テキストNEWS＋出典リンクのみ。CTAは確認済みSHOWROOMルーム。LIVE STREAMに関連付け。Gallery / media.ts / galleryVideos / `/stories/` / highlights / events / streamSchedule / contest.ts非追加。写真なし）、8/30のMixch「配信＆ムービーは今日が最終日」（本人X投稿で同じMixchを案内。出典はX `https://x.com/Mily_chan36/status/2093799709219704887`、CTAはMixch本編。Mixch outbound player cardをLatest / NEWS / Galleryで共有。Activitiesの関連NEWSとしては出すが関連メディアにはMixchカードを出さない。ファイルは自己ホストしていない）、8/30のInstagram Story「SHOWROOM 30日連続配信記念日」（SHOWROOM配信画面に視聴者の表示名・アイコン・コメントが写るため動画は自己ホストせず、Latest / NEWSのテキストのみ。LIVE STREAMに関連付け。7:30配信予定は投稿時点の記録で streamSchedule / events 非追加。Paton CTAなし。Gallery / media.ts / galleryVideos / `/stories/` / highlights非追加）、8/29のInstagram Story「Paton投票5日目／変面さんとの2ショット」（b43-01動画をLatest / NEWS＋Galleryで共有。無音公開派生。恒久permalinkなしのため非リンクのInstagram Story label＋プロフィール関連リンク。Paton投票CTAあり。CAMPUS GIRLS Activityに関連付け。背景の第三者は元動画の白いぼかしを維持。レストラン名は非掲載。`/stories/`・events・streamSchedule・PatonVoteGuideランキング系列非追加）、8/29の本人X「配信中／9/3〜3次審査」（本人X `https://x.com/Mily_chan36/status/2093575115913224580`。恒久permalink。テキストNEWS＋出典リンクのみ。CTAは確認済みSHOWROOMルーム。MISS CIRCLEとLIVE STREAMに関連付け。Gallery / media.ts / galleryVideos / `/stories/` / highlights / events / streamSchedule / contest.ts非追加。順位・得点は非掲載）、8/29の本人X「14:40〜ラジオ配信案内」（本人X `https://x.com/Mily_chan36/status/2093572006457557333`。恒久permalink。テキストNEWS＋出典リンクのみ。CTAは確認済みSHOWROOMルーム。LIVE STREAMに関連付け。FMラジオActivityは付けない。Gallery / media.ts / galleryVideos / `/stories/` / highlights / events / streamSchedule非追加）、8/29のInstagram Story「Paton投票4日目」（b41-02動画をLatest / NEWS＋Galleryで共有。無音公開派生。恒久permalinkなしのため非リンクのInstagram Story label＋プロフィール関連リンク。Paton投票CTAあり。CAMPUS GIRLS Activityに関連付け。`/stories/`・events・streamSchedule非追加）、8/28夜の本人X「今日の配信ありがとう／おつみりぃ」（本人X `https://x.com/Mily_chan36/status/2093347548388110372`。恒久permalink。テキストNEWS＋出典リンクのみ。翌日の配信時刻は未確定のため streamSchedule / events 非追加。LIVE STREAM Activityに関連付け。Gallery / media.ts / `/stories/` / highlights非追加）、8/28夜のInstagram Story「22:00〜SHOWROOM夜配信案内」（b41-01動画をLatest / NEWS＋Galleryで共有。無音公開派生。恒久permalinkなしのため非リンクのInstagram Story label＋プロフィール関連リンク。Paton投票CTAあり。LIVE STREAM Activityに関連付け。`/stories/`・events・streamSchedule非追加）、8/28の本人X「予選A FinalSTAGE 3日目」応援呼びかけ（本人X `https://x.com/Mily_chan36/status/2093262992289026404`。恒久permalink。写真なしのため既存b26-01人物写真を代表画像に再利用。投票CTAはPaton本人ページ。CAMPUS GIRLS Activityに関連付け。Gallery / media.ts / `/stories/` / highlights非追加。順位は非掲載）、8/27の本人X「キャンガル2027 パトン投票方法」（恒久permalink。X動画は自己ホストせず、既存b26-01人物写真を代表画像に再利用。投票CTAはPaton本人ページ。CAMPUS GIRLS Activityに関連付け。Gallery / media.ts / `/stories/` / highlights非追加。他出場者・順位・オーナーサポーター名は非掲載）、8/27のXフォロワー100人報告（本人X `https://x.com/Mily_chan36/status/2092884427605266708`。テキストNEWS＋出典リンクのみ。Gallery・media.ts・galleryVideos・`/stories/`・highlights・events・streamSchedule・Activities非追加。フォロワー数はプロフィールへ固定しない）、8月27日のMixch「表情豊かなみりぃと魅力的でしょう？？？？」（本人X投稿で同じMixchを案内。出典はX `https://x.com/mily_chan36/status/2092838411602407646`、CTAはMixch本編。Mixch outbound player cardをLatest / NEWS / Galleryで共有。Activitiesの関連NEWSとしては出すが関連メディアにはMixchカードを出さない。ファイルは自己ホストしていない）、8/27のラジオ「映画」テーマ案内Story（b36-01動画をLatest / NEWS＋Galleryで共有。無音公開派生。Radio Activityに関連付け、`/stories/`・events・streamSchedule非追加）、8/27の「おはよう」ミスサーSR 14:00配信案内Story（b35-01動画をLatest / NEWS＋Galleryで共有。無音公開派生。`/stories/`・events・streamSchedule・Activities非追加）、8/8 2次審査期間の配信スケジュール案内グラフィック（新しいNEWS。実写ではないためGallery非掲載）、8/6 OHAYO白いポロピース自撮り（新しいNEWS＋Gallery b30-01）、8/5 パンダ耳過去pic（新しいNEWS＋Gallery b31-01。画像に※過去pic）、8/18ラジオSHOWROOM画面を既存NEWSへ添付（Gallery b32-01）、8/24 Final STAGE案内グラフィックを既存CAMPUS GIRLS NEWSのadditionalMediaへ（Gallery非掲載）、8/21ガンダ写真は既存NEWS JPEGを維持してGallery b14-01を追加、8/24メイクSHOWROOM画面は既存NEWS JPEGを維持してGallery b24-01を追加、8/19 2次審査通過NEWSに既存Gallery b05-01をsrcsetで配線（ファイル複製なし）、8/2 21歳誕生日NEWSにb29-01室内セルフィーを添付（新しいNEWSは作っていない。Instagram出典・CTAは維持。写真のsourceUrlは本人X `https://x.com/Mily_chan36/status/2083679191892115846`）、8月26日のガルアワイベ最終日6位お礼X投稿（本人X。くま耳キラキラフィルター自撮りをNEWS代表＋Gallery。ミスサー／フレキャン出場者限定のSHOWROOMイベントで6位のためGirlsAwardランウェイ出演にはならない。投票CTAなし。このNEWSカード自体はMixch非混在。`/stories/` 非追加）、8月26日夜のSHOWROOMファンルーム「ガルアワイベ最終日【6位】」（本人Fan Room本文＋同じ夜22:36の音声メッセージ。音声は自己ホストm4aをLatest / NEWSで再生。Fan Roomスクリーンショット・Gallery・`/stories/` には出していない。恒久permalinkなしのため非リンクlabel＋確認済みSHOWROOMルームへのCTA）、8月26日のMixch「今日は1.5倍デーだってよ？！」（本人X投稿で同じMixchを案内。出典はX `https://x.com/mily_chan36/status/2092481552475460058`、CTAはMixch本編。Mixch outbound player cardをLatest / NEWS / Galleryで共有。Activitiesの関連NEWSとしては出すが関連メディアにはMixchカードを出さない。ファイルは自己ホストしていない）、8月26日のCAMPUS GIRLS 2027予選ファイナル毎日投票案内Instagram Story（本人Story。恒久permalinkなしのため非リンクのInstagram Story label＋プロフィール関連リンク。b27-07鏡静止画を代表、b27-06コラージュ静止画・b27-02鏡動画・b27-01コラージュ動画を同じカードへ。Latest / NEWS と Gallery が同じ公開派生を共有。Story閲覧スクリーンショットは非掲載で返信コメントのみNEWS messageへ。投票CTAは既存8/24カードのまま）、8月26日のInstagramフォロワー400人感謝Story（NEWS専用b27-04動画。Gallery / media.ts / `/stories/` / highlights 非掲載）、8月26日の朝配信お礼Story（NEWS専用b27-03画像。Gallery非掲載。配信時刻は既存10:00案内NEWSのまま、events / streamSchedule には足さない）、8月26日未明の26日10:00〜11:00配信案内（本人X。テキストNEWS＋出典リンクのみ。夜は希望の表現のため枠としては未掲載）、8月25日のMixch「自信のないあなたへ」（本人X投稿と直後のリプライ。Mixch本編CTAを主導線、X原投稿を出典導線として掲載。同じMixch outbound player cardをLatest / NEWS / Galleryで共有。CAMPUS GIRLS関連NEWSとして既存Activityから参照。Mixchファイルは自己ホストしていない）、8月25日朝の「やる気、元気、勇気でたぞ」STORY CTA（本人X。本投稿＋11:40変更追記を出典。アーカイブ本文は `/stories/2026-08-25-motivation/`）、8月24日の湘南シーサイドサークル「Yes!東京」踊ってみた（番組Instagram。恒久permalink未確認のため非リンクlabel＋プロフィール関連リンク。b25動画をLatest / NEWS / Galleryで共有）、8月24日のCAMPUS GIRLS 2027 予選A Final STAGE案内（本人X。8月26日にPatonの三橋莉子（みりぃ）ページへの投票導線と、8月26日の本人XによるPaton直接案内を同じNEWSへ追加。b26-01人物写真を代表画像、b26-02 Paton出場者ページ画像とb33-01 Final STAGE案内グラフィックを同じカードのadditionalMediaに掲載。8月24日の元投稿も出典リンクとして維持）、8月24日朝の初メイク配信（同じNEWSに本人X投稿とInstagram Storyの内容を統合。b24-01 SHOWROOM横長画面を代表画像、オーナーが当該掲載面を明示承認した無加工b24-02 Story画像をHOME Latestと`/news/`の同じカードの2枚目に掲載。b24-01はGalleryにも掲載。b24-02 Story画像はNEWS 2枚目のままGallery非掲載。恒久permalinkのないStory URLは作っていない）、8月24日未明の夜枠・ラジオお礼と朝配信案内（同じNEWSにSHOWROOMファンルーム本文、Instagram Story動画、本人X投稿を統合。Fan Roomスクリーンショットは非公開）、8月23日の本人Instagram「龍みたいな雲」投稿、8月23日の湘南シーサイドサークル「真夏のミュージカル特集」放送記録（同じNEWSに放送後お礼の番組Instagram Story動画、STORY記事CTA、FM湘南マジックウェイブの放送後X投稿を同居。新しいNEWSは作っていない）、8月23日朝のSHOWROOMファンルーム2件、8月23日未明の地震直後FanRoom（同じNEWSにInstagram Story動画をmediaとして統合）、8月22日の夜枠お礼・翌8月23日の配信予定を伝えたX投稿、8月22日夜・夕方のファンルーム2件、8月22日のCAMPUS GIRLS審査員賞・予選ファイナル進出、8月21日のラジオDJ・ミスコンについてのTikTok投稿、「急遽なガンダ」X投稿、SHOWROOMファンルーム更新、配信へのお礼・次枠・投稿時点順位を伝えたInstagram Story、朝の「OHAYO!」Story・SHOWROOM配信案内X投稿、8/20以前の既存項目、4月23日の『さよならいちごちゃん』踊ってみたTikTok（b37。NEWSとGalleryが同じオブジェクトを共有。無音公開派生。activityIdsなし。HOME Latestの8月並びは変えない） | 9/2 おやすみりぃNEWSとPaton 2位NEWSは非リンクのInstagram Story。関連URLは本人Instagramプロフィール。おやすみりぃの追加CTAは確認済みSHOWROOMルーム（`t=`なし）。Paton投票CTAは付けない。9/1 朝あいさつNEWSの外部sourceは本人X投稿。9/1 パトン投票最終日NEWSと9月あいさつNEWS、8/31 肉声投票案内NEWS・現在1位NEWS・1.5倍デーNEWS・投票方法案内NEWSと8/30 30日連続配信記念日NEWSは非リンクのInstagram Story。8/31朝お礼NEWSの外部sourceは本人X投稿。関連URLは確認済みSHOWROOMルーム。8/31 1.5倍NEWSの外部sourceは01:37の本人X投稿、additional sourceは07:32の本人X投稿。関連URLはPaton本人ページ。8/31配信中NEWSの外部sourceは本人X投稿。関連URLは確認済みSHOWROOMルーム。8/30連続配信NEWSの外部sourceは本人X投稿。関連URLは確認済みSHOWROOMルーム。8/30 Paton 3位NEWSの外部sourceは本人X投稿。関連URLはPaton本人ページ。8/30 キャンパスガールズ情報NEWSと8/29 Paton投票5日目NEWSは非リンクのInstagram Story。8/30朝SR案内NEWSの外部sourceは本人X投稿。関連URLは確認済みSHOWROOMルーム。8/30 Mixch NEWSの外部sourceは本人X投稿。関連URLはMixch本編。8/29配信中／3次審査NEWSの外部sourceは本人X投稿。関連URLは確認済みSHOWROOMルーム。8/29 14:40ラジオ案内NEWSの外部sourceは本人X投稿。関連URLは確認済みSHOWROOMルーム。8/29 Paton投票4日目NEWSと8/28夜配信案内NEWSは非リンクのInstagram Story。8/28配信お礼NEWSの外部sourceは本人X投稿。8/28 3日目NEWSの外部sourceは本人X投稿。関連URLはPaton本人ページ。8/27投票方法案内は本人X投稿。関連URLはPaton本人ページ。8/27 Xフォロワー100人NEWSの外部sourceは本人X投稿。8/27 Mixch NEWSの外部sourceは本人X投稿。関連URLはMixch本編。8/27ラジオ案内は本人Instagram Storyによる湘南シーサイドサークル番組Storyの再共有で、本人プロフィールは関連リンク。8/27配信案内は非リンクのInstagram Storyで、プロフィールは関連リンク。通常のTikTok / X投稿は本人または本人が登場する公開投稿URL。FanRoomと公開permalinkのないStoryは非リンク表示。番組Instagram Storyと生放送アーカイブ文字起こしは非リンク表示。InstagramプロフィールはStoryの出典ではなく関連リンク。8/26ガルアワイベ6位お礼NEWSの外部sourceは本人X投稿、関連URLは本人SHOWROOM、additional sourceは当該SHOWROOMイベントページ。8/26 Mixch 1.5倍デーNEWSの外部sourceは本人X投稿。関連URLはMixch本編。8/26投票案内・フォロワー400人・朝配信お礼の3件は非リンクのInstagram Story。8/26配信案内NEWS・8/25 Mixch NEWS・8/25 motivation NEWS・8/24朝メイクNEWS・8/24未明NEWS・Final STAGE案内NEWSの外部sourceは本人X投稿。Final STAGE案内NEWSは8月24日の案内をprimary source、8月26日の直接案内をadditional sourceとして持ち、関連URLはPaton本人ページ。b26の2枚は当該NEWS専用でGallery / `/stories/` には追加しない。8/25 Mixch NEWSの関連URLはMixch本編。8/23ラジオNEWSの外部sourceは局公式の放送後X投稿。8/24踊ってみたNEWSの外部permalinkは未確認。8/2誕生日NEWSの一次出典はInstagram、additional sourceは本人X誕生日朝投稿。4/23踊ってみたNEWSの外部sourceは湘南シーサイドサークルのTikTok通常投稿 | 投稿内容・動画説明文の確認済み範囲を要約。配信案内はアーカイブ表現。同じ内容の追記は既存NEWSへ統合し、`additionalSources` で複数の確認済みpermalinkを保持する。時間依存の順位は投稿時点の記録。同日は `sameDayOrder` の大きい項目を先にし、未指定同士は source-array 順を維持する。id 昇順にはしない |
| `contest.ts` | `currentPhase` は 2026-09-03 確認の「3次審査」。審査期間 `start`/`end` は主催者 SCHEDULE の 2026-09-03〜2026-09-13 | 進出は三次審査進出者一覧 `https://2026.misscircle.jp/list/3`。開始後のフェーズ表示と日程は主催者 `https://www.misscircle.jp/` SCHEDULE（WEB投票 09/03 12:00〜09/13 23:59。SHOWROOM無料ギフト審査・イベント審査 09/03 05:00〜09/12 21:59） | ContestPhase は日付のみ。時刻は `supportEvents.ts` 側。SHOWROOMヘッダー枠 9/2 20:00〜9/12 12:59は載さない |
| `supportEvents.ts` | CAMPUS GIRLS 2027 本選EX vol.1 SNS審査（2026-09-07 12:00〜2026-09-20 12:00 JST）と vol.1 Paton投票審査（2026-09-16 18:00〜2026-09-22 23:59 JST、投票先URL未確認のためCTAなし）。同じ日程表の vol.2〜6（9/28〜10/11、10/19〜11/1、11/9〜11/22、11/30〜12/13、12/21〜2027-01-03。各12:00。審査内訳は未確認のため期間のみ）。CAMPUS GIRLS 2027 予選A FinalSTAGEのPaton投票期間（2026-08-26 18:00〜2026-09-01 23:59 JST、終了済み）。MISS CIRCLE 三次審査の WEB投票（2026-09-03 12:00〜2026-09-13 23:59 JST）と SHOWROOM無料ギフト審査・イベント審査（2026-09-03 05:00〜2026-09-12 21:59 JST） Patonイベント詳細・三橋莉子（みりぃ）出場者ページ。ミスサーは主催者 SCHEDULE と SHOWROOMイベントページ、WEB投票 LIFF | Paton投票CTAは期間中のみホーム、Support、Calendar、Activity、NEWSへ表示。三次審査のWEB投票CTAも同じ期間ゲート。本選EXのPatonは期間のみ（CTAなし）。常設のENTRY 734導線は期間中も期間後もHOMEに残す。本文と一次出典は履歴として残す。#131の共有clock終了境界はcontest date-onlyのまま。新しいSupportEventの開始・終了も同じclockが読む |
| `events.ts` | **空** | — | 予定セクションは非表示。配信予定は別系統 |
| `media.ts` | 写真33枚（すべて `published: true`） | 9/6キャンガル予選final結果報告1枚（b63-01。`sns-post`、sourceUrlは当該X投稿）、8/18ラジオSHOWROOM画面1枚（b32-01）、8/5パンダ耳過去pic1枚（b31-01）、8/6 OHAYO白いポロ1枚（b30-01）、8/2 21歳誕生日の本人X室内セルフィー1枚（b29-01。`sns-post`、sourceUrlは当該X投稿。花束・ケーキのb01、落ち葉b05、ウインクb06、鏡セルフィーb08とは別カット）、8/26 ガルアワイベ最終日6位お礼の本人X写真1枚（b28-01。`sns-post`、sourceUrlは当該X投稿）、8/26 投票案内Storyの静止画2枚（b27-07 鏡 / b27-06 コラージュ。Instagram Story・恒久permalinkなしのため `sourceUrl: null`）、8/24メイクSHOWROOM画面1枚（b24-01。既存NEWS JPEGは維持してGalleryへ）、誕生日5枚、マンゴーかき氷5枚（b10）、8/21ガンダ写真1枚（b14-01。既存NEWS JPEGは維持してGalleryへ）、龍みたいな雲3枚（b20）は各Instagram投稿。8/23 湘南シーサイドサークル公式X写真2枚（b22）・ネックレス・落ち葉（b05-01）・8/20 朝の写真（b08-01）は `owner-provided` | b63 は `sourceDate: 2026-09-06`。b32 は `sourceDate: 2026-08-18`。b31 は `sourceDate: 2026-08-05`。b30 は `sourceDate: 2026-08-06`。b29 は `sourceDate: 2026-08-02`。b28 / b27 は `sourceDate: 2026-08-26`。b24 は `sourceDate: 2026-08-24`。b14 は `sourceDate: 2026-08-21`。b22 / b20 は一次出典と `sourceDate: 2026-08-23` を記録。b08-01 と b10 は一次出典と `sourceDate: 2026-08-20` を記録。未確認の `sourceDate` / `credit` は `null`。正方形・縦写真は `aspect` で切り抜きを避ける |
| `galleryVideos.ts` | 独立動画30本 + Mixch outbound player 4本（Mixch = 8/30 配信＆ムービー最終日 `UBHJplv4`、8/27 表情豊かなみりぃ `VDojsMY5`、8/26 1.5倍デー `nxqYblH8`、8/25 自信のないあなたへ `ZY4hSt3K`。ファイルは自己ホストしていない。b59-01 = 9/4 投票2日目の呼びかけStory、b58-01 = 9/5 TikTokラジオDJ、b47-01 = 9/2 おやすみりぃ／翌日9:00 SR案内Story、b47-02 = 9/2 Paton 2位お礼Story、b46-01 = 9/1 パトン投票最終日Story、b46-02 = 9/1 9月あいさつStory、b45-01 = 8/31 キャンパスガールズ2027肉声投票案内Story、b44-02 = 8/31 現在1位／1.5倍DAY Story、b44-01 = 8/31 Paton投票1.5倍デー緊急告知Story、b43-02 = 8/30 キャンパスガールズ情報／2位を守り抜きたいStory、b43-01 = 8/29 Paton投票5日目Story、b41-02 = 8/29 Paton投票4日目Story、b41-01 = 8/28夜SHOWROOM配信案内Story、b36-01 = 8/27 ラジオ「映画」テーマ案内Story、b35-01 = 8/27 ミスサーSR 14:00配信案内Story、b27-02 = 8/26 投票開始の鏡Story、b27-01 = 8/26 投票案内コラージュStory、b25 = 8/24 湘南シーサイドサークル「Yes!東京」踊ってみた、b23 = 8/24 夜枠お礼・朝配信Story、b21 = 8/23 湘南シーサイドサークル放送後お礼Story、b19 = 8/23 湘南シーサイドサークル Instagram Story、b18 = 8/23 地震後Story、b15 = 8/21 TikTok、b13 = 8/21 イベントStory、b12 = 8/21 朝Story、b11 = 8/21 朝のX投稿、b07 = 8/20 朝Story、b09 = 8/19 2次審査通過Story、b03 = 8/17 朝Story、b37 = 4/23 さよならいちごちゃん TikTok。すべて `published: true`。新しい順のあと、8月より古い自己ホストを Mixch の直前へ置く） | Mixchは本人Mixch公開ページ。その他はowner-provided。b36-01は本人Instagram Storyでの番組Story再共有、b15 / b37はTikTok公開投稿URL、b11は本人X投稿URL、b25 / b21 / b19は番組Instagram（b25はpermalink未確認の非リンク、b21 / b19はStory非リンク）、その他StoryはInstagram Story（非リンク） | Mixch 4本は Latest / NEWS + Gallery で同じオブジェクトを共有（`src/data/mixchMovies.ts`）。b47-01 / b47-02 / b46-01 / b46-02 / b45-01 / b44-02 / b44-01 / b43-02 / b43-01 / b41-02 / b41-01 / b36-01 / b35-01 / b27-02 / b27-01 は Latest / NEWS + Gallery、b25 は Latest / NEWS + Gallery、b23 は Latest / NEWS + Gallery、b21 は Latest / NEWS + Gallery + STORY closing、b19 は Gallery + STORY lead。b18 は既存地震NEWSと、b37 / b15 / b13 / b12 / b11 / b07 / b03 は Latest と、b09 は STORY 記事 `/stories/second-round-result-2026/` と、それぞれ同じ MP4・poster を共有。FanRoom画像とDrive Gallery（b02）は含めない |
| `socials.ts` | X / Instagram / TikTok / SHOWROOM / MixChannel | X〜SHOWROOMは ENTRY 734 実ページ。MixChannelは本人プロフィール `https://mixch.tv/u/10114673` | SHOWROOM はコンテスト用ルーム。終了後に変わる可能性あり |
| `links.ts` | ENTRY 734、CAMPUS GIRLS Paton投票、FMスタッフ、Mily個別ページ、湘南シーサイドサークル | 各 URL | SNS は `socials.ts` 側。重複して足さない |
| `profile.ts` | 公表名、活動名、生年月日、出身、MBTI、大学・学年、サークル、趣味、特技、ファンネーム、活動・嗜好 | `profileSources` の一次情報台帳。MBTIは本人MixChannel | 変動項目には `asOf` を付け、各項目を `sourceIds` で出典へ結び付ける。MBTIから性格を推測しない |
| `highlights.ts` | MISS CIRCLE（挑戦 / 2次審査通過・三次審査進出）、CAMPUS GIRLS（1st / 2nd STAGE審査員賞、予選ファイナル本戦進出）、SHOWROOM開始の確認済み6件 | 主催者・本人・SHOWROOM | 結果未確定の順位や掲載権は入れない |

| `radio.ts` | 湘南シーサイドサークル 日曜 10:00–13:00 | タイムテーブル / スタッフ / 番組ページ | 本人出演の断定はしない。NOW ON AIR は API が実行時取得 |



### 2026-09-04 Instagram Story 投票2日目の呼びかけ（batch b59）

- `news.ts` は81件。b59-01（「2日目ポチッとな〜」の投票呼びかけ）を独立したNEWSとして
  9/6・9/5の既存カードの次へ追加する。id `2026-09-04-third-round-vote-day2-story` と
  sameDayOrder: 10 は維持する。campus final / 配信お礼 / 夜枠など main 側の項目は残す。
- HOME Latest / `/news/` と Gallery は、公開MP4 1本・poster 1枚・manifest object 1件を
  共有する。`galleryVideos.ts` は独立動画30本＋Mixch outbound player 4本。
  MISS CIRCLE Activity の関連NEWS・関連メディアにも出す。
  `/stories/`、highlights、events、streamSchedule、`media.ts`、
  PatonVoteGuide のランキング系列には追加しない。
- 恒久permalinkがないため、出典は非リンクの `Instagram Story` labelとする。
  本人Instagramプロフィールは関連CTAであり、Storyの出典URLとして扱わない。
- source date / NEWS日付の `2026-09-04` は、オーナーが「9/4の投稿を直後に受け取った」と
  明示確認した投稿日。受領日と一致する。画面の「2日目」表示、WEB投票期間からの逆算、
  元動画の `creation_time` は日付の根拠にしない。投稿時刻は未確認のため書かない。
- 追加CTAは確認済みの三次審査WEB投票リンク（`links.ts` の
  `miss-circle-2026-web-vote-734`）だけ。SupportEvent
  `miss-circle-2026-3rd-web-vote` の期間（2026-09-13 23:59 JST まで）に従い、
  終了後は自動で非表示になる。Paton投票CTAは付けない。新しい投票ボタンは足さない。
- Storyのリンクスタンプの遷移先は画面から確認できないため、本文で断定しない。
  「毎日連続投票者の特典」も画面表示の引用に留め、特典の内容・条件・付与方法は補わない。
  WEB投票期間・三次審査日程・1日の投票回数は既存の三次審査カードへ重複掲載しない。
- 公開派生は video-only。元動画のAAC音声は権利・再配信権を確認できないため落とす。
  映像は720×1280のまま。crop・scale・短縮・テロップ変更・AI加工はしない。
  SNS CDNは参照しない。スクレイプしない。
- mainでbatch b53〜b58が先に使用されているため、この Story 動画は b59 として採番する。
- 同日9/4は `sameDayOrder: 10`。

### 2026-09-05 SHOWROOM 三次3日目の朝配信メモ

- `src/data/streamRecap20260905Asa.ts` をLIVE STREAMの先頭に掲載。
- オーナー提供録画の自動文字起こし・配信メモを照合した要約。全編手動聴取は未実施。
  録画先頭からの時刻は目安。歌詞・私生活の詳細・視聴者名は掲載しない。
- 目視確認した実フレーム10枚と保存用ZIPはbatch b56。詳細は `docs/MEDIA.md`。
- 次枠14:30は配信時点の案内。現在の予定へ転記しない。
- 9/2・9/3の既存4回も、次枠案内を日付付きの過去時制へ修正した。
- Open PR #162 の統一ルールは未導入。mainの既存型・共通カードを使用している。

### 2026-09-04 SHOWROOM 三次2日目の朝配信メモ

- オーナー提供の朝配信動画を照合し、
  `src/data/streamRecaps.ts` に配信回の要約を保存する。
- LIVE STREAM Activityへ、短い配信カードとして掲載する。
  見どころは6件、目標はチップ、ランキングは個人名なしの一文、
  タイムスタンプと次枠は折りたたみ。新しい回だけ開いた状態。
- 出典は非リンクの
  `2026年9月4日 SHOWROOM朝配信（動画確認・オーナー提供）` labelとする。
- 録音・画面録画・全文文字起こしは公開しない。視聴者のアイコン・コメント画面は出さない。
  他出場者名は掲載しない。
- チャットUIなしの顔出しカメラから実フレームを5枚切り出す（batch b55）。
  代表は灰色パーカーの笑顔。展開すると5枚の保存とZIPを出す。
  NEWS / Gallery / `media.ts` / `galleryVideos.ts` には出さない。
- 配信中に案内した同日 22:30〜23:40 スーツ配信は本文に残す。
  手入力 `streamSchedule` の 9/4 枠は既存値のまま（朝 07:00–07:40、夜 22:30–23:30）。
  この配信メモからは events / news / highlights / contest.ts / profile へ転記しない。
- 読み上げたランキングは個人名を掲載せず、13位から1位まで読み上げた事実だけを残す。

### 2026-09-04 SHOWROOM 三次2日目の昼配信メモ

- オーナー提供の昼配信動画を照合し、
  `src/data/streamRecaps.ts` に配信回の要約を保存する。
- LIVE STREAM Activityへ、短い配信カードとして掲載する。
  見どころは6件、目標はチップ、ランキングは個人名なしの一文、
  タイムスタンプと次枠は折りたたみ。新しい回だけ開いた状態。
- 出典は非リンクの
  `2026年9月4日 SHOWROOM昼配信（動画確認・オーナー提供）` labelとする。
- 録音・画面録画・全文文字起こしは公開しない。視聴者のアイコン・コメント画面は出さない。
  他出場者名は掲載しない。
- チャットUIなしの顔出しカメラから実フレームを5枚切り出す（batch b54）。
  代表は灰色パーカーの正面。展開すると5枚の保存とZIPを出す。
  NEWS / Gallery / `media.ts` / `galleryVideos.ts` には出さない。
- 配信中に案内した同日 22:30〜 スーツ配信と、バイトで遅れる可能性は本文に残す。
  手入力 `streamSchedule` の 9/4 枠は既存値のまま。
  この配信メモからは events / news / highlights / contest.ts / profile へ転記しない。
- 読み上げたランキングは個人名を掲載せず、13位から1位まで読み上げた事実だけを残す。

### 2026-09-03 SHOWROOM 三次初日の夜配信メモ

- オーナー提供の夜配信動画を照合し、
  `src/data/streamRecaps.ts` に配信回の要約を保存する。
- LIVE STREAM Activityへ、短い配信カードとして掲載する。
  見どころは6件、目標はチップ、ランキングは個人名なしの一文、
  タイムスタンプと次枠は折りたたみ。
- 出典は非リンクの
  `2026年9月3日 SHOWROOM夜配信（動画確認・オーナー提供）` labelとする。
- 録音・画面録画・全文文字起こしは公開しない。視聴者のアイコン・コメント画面は出さない。
  他出場者名は掲載しない。
- 実フレームは2枚。data URI ではなく `public/media/live/` の JPEG（batch b53）。
  代表はびっくりカット。展開すると2枚の保存とZIPを出す。
  NEWS / Gallery / `media.ts` / `galleryVideos.ts` には出さない。
- 配信中に案内した明朝7時枠と WEB投票・キラキラ100 は本文に残す。
  この配信メモからは events / news / highlights / contest.ts / profile へ転記しない。
- 読み上げたランキングは個人名を掲載せず、13位から1位まで読み上げた事実だけを残す。

### 2026-09-03 SHOWROOM 三次初日の昼配信メモ

- オーナー提供の昼配信動画を照合し、`src/data/streamRecap20260903Lunch.ts` に配信回の要約を保存する。
  形式は `docs/LIVE-STREAM-RECAP.md` の統一ルールどおり。同じ日は遅い枠が先なので、夜枠と朝枠の間に置く。
- 静止画はオーナーが選定した実フレーム2枚（b54-01 寄りの笑顔 / b54-02 応援方法の紙）。
  代表はb54-01。元映像が640×360のため表示用にLanczosで1280×720へ拡大した派生で、
  顔の生成・補正はしていない。エンコーダのコメント欄だけを可逆的に除去して掲載する。
  b53は9/3夜枠が使用済みのためb54を採番した。NEWS / Gallery / `media.ts` / `galleryVideos.ts` には出さない。
- 出典は非リンクの `2026年9月3日 SHOWROOM昼配信（動画確認・オーナー提供）` labelとし、
  Driveのフォルダ・ファイルIDはtracked textへ保存しない。
- 録音・画面録画・全文文字起こしは公開しない。視聴者のアイコン・コメント画面は出さない。
  他出場者名・別コンテストの中身は掲載しない。外出先の具体は本人が伏せたため書かない。
- 応援方法の紙の内容（1日1回のWEB投票、キラキラ星100個、指定ギフト）は本人が画面で示した範囲だけ。
  投票回数の呼びかけや急かし文はサイト側で足さない。
- 配信中に案内した同日21:00〜21:50は配信時点の案内として本文に残す。
  手入力 `streamSchedule` の 9/3 枠は本人配布タイムテーブル由来の既存値のまま。
  この配信メモからは events / news / highlights / contest.ts / profile へ転記しない。
- トマトの栄養素・キラキラ星の数字は配信時点の記録。profile へ固定しない。
- 読み上げたランキングは個人名を掲載せず、13位から1位まで読み上げた事実だけを残す。

### 2026-09-03 SHOWROOM 三次初日の朝配信メモ

- オーナー提供の朝配信動画を照合し、
  `src/data/streamRecaps.ts` に配信回の要約を保存する。
- LIVE STREAM Activityへ、短い配信カードとして掲載する。
  見どころは6件、目標はチップ、ランキングは個人名なしの一文、
  タイムスタンプと次枠は折りたたみ。新しい回だけ開いた状態。
- 出典は非リンクの
  `2026年9月3日 SHOWROOM朝配信（動画確認・オーナー提供）` labelとし、
  Driveのフォルダ・ファイルIDはtracked textへ保存しない。
- 録音・画面録画・全文文字起こしは公開しない。視聴者のアイコン・コメント画面は出さない。
  他出場者名は掲載しない。
- オーナーがかわいいカット約10枚をスクショして配信コーナーへ載せ、
  ベストショットをサムネにし、10枚を保存できるようにしてほしいと明示依頼した。
  実フレームをコメント・他出場者・視聴者表示が写らないよう切り出して10枚掲載する。
  代表1枚をカードのサムネにし、展開すると10枚の保存とZIPを出す。
  NEWS / Gallery / `media.ts` / `galleryVideos.ts` には出さない。
- 配信中に案内した同日14:40枠と夜枠、WEB投票12時開始は投稿時点の案内として本文に残す。
  手入力 `streamSchedule` の 9/3 枠は本人配布タイムテーブル由来の既存値のまま。
  この配信メモからは events / news / highlights / contest.ts / profile へ転記しない。
- フォロワー数・アバ権・トマトの栄養素の数字は配信時点の記録。profile へ固定しない。
- 読み上げたランキングは個人名を掲載せず、13位から1位まで読み上げた事実だけを残す。

### 2026-09-02 SHOWROOM 朝ラジオ配信メモ

- オーナー提供の朝配信文字起こしを照合し、
  `src/data/streamRecaps.ts` に配信回の要約を保存する。
- LIVE STREAM Activityへ、短い配信カードとして掲載する。
  見どころは3件、目標はチップ、ランキングは個人名なしの一文、
  タイムスタンプと次枠は折りたたみ。全文テンプレは回ごとに複製しない。
  カード自体も折りたたみ。新しい回だけ開いた状態、過去回は閉じる。
- 出典は非リンクの
  `2026年9月2日 SHOWROOM朝配信 文字起こし（オーナー提供）` labelとし、
  Driveのフォルダ・ファイルIDはtracked textへ保存しない。
- 録音・画面録画・全文文字起こしは公開しない。視聴者のアイコン・コメント画面は出さない。
- ラジオ枠で使われた静止画は、オーナー提供の録画から実フレームを1枚だけ切り出し、
  朝・夜の配信カードへ同じ1枚を掲載する（batch b51-01）。NEWS / Gallery / media.ts には出さない。
- 配信中に案内した同日14:40枠と夜枠は投稿時点の案内として本文に残し、
  streamSchedule / events には転記しない。
- 9月のラジオ出演や友達の予定は未確定・他者情報のためサイト予定へ足さない。
- フォロワー数・アバ権・ファンマークの数字は配信時点の記録。profile へ固定しない。
- 読み上げたランキングは個人名を掲載せず、13位から1位まで読み上げた事実だけを残す。通学経路・学校までの具体的な移動情報も一般化する。
- NEWS / Gallery / media.ts / galleryVideos / `/stories/` / highlights / events /
  streamSchedule / contest.ts / profile は変更しない。

### 2026-09-02 SHOWROOM 夜ラジオ配信メモ

- オーナー提供の夜配信文字起こしを照合し、
  `src/data/streamRecaps.ts` に配信回の要約を保存する。
- LIVE STREAM Activityへ、朝と同じ短い配信カードとして掲載する。
  見どころは3件、目標はチップ、ランキングは個人名なしの一文。
  朝は雑談、夜は三次の作戦と中身は変えてよい。レイアウトは揃える。
  ランキングの個人名は朝も夜も掲載しない。
  カードは折りたたみ。新しい回だけ開いた状態、過去回は閉じる。
- 新しい配信メモを配列の先頭へ置き、朝配信メモの下に続く。
- 出典は非リンクの
  `2026年9月2日 SHOWROOM夜配信 文字起こし（オーナー提供）` labelとし、
  Driveのフォルダ・ファイルIDはtracked textへ保存しない。
- 録音・画面録画・全文文字起こしは公開しない。視聴者のアイコン・コメント画面は出さない。
- 配信中に案内した 9/3 の 7:30 / 14:40 / 21:00 枠は投稿時点の案内として本文に残す。
  手入力 `streamSchedule` の 9/3 枠は本人配布タイムテーブル由来の既存値のまま。
  この配信メモからは events へ転記しない。9/5 5:30 メイク配信は検討の話のため予定へ足さない。
- 本人が出していない別コンテスト名、他出場者名はサイトへ載せない。
- フォロワー数・アバ権・ファンマークの数字は配信時点の記録。profile へ固定しない。
- 顔出しなしラジオの静止画は、朝と同じ実フレーム1枚（b51-01）を夜カードにも載せる。
  新しいファイルは作らない。NEWS / Gallery / media.ts には出さない。
- NEWS / Gallery / media.ts / galleryVideos / `/stories/` / highlights / events /
  streamSchedule / contest.ts / profile は変更しない。

### 2026-09-03 本人X 三次審査の目標と応援方法

- `news.ts` は79件。9/3の本人Xを独立したNEWSとして先頭へ追加する。
  既存の 2026-09-02 三次審査NEWS（id `2026-09-02-miss-circle-third-round`）は残す。消さない。別カードのまま。
- 出典は恒久permalink `https://x.com/Mily_chan36/status/2095397884107849991`。
  `sourceLabel` は `みりぃのX`。`t=` / `s=` トラッキングは付けない。
- テキストNEWS＋出典リンクのみ。写真・Gallery・Drive・X画像CDNは使わない。
  `ctaLabel`、投票 `relatedUrl`、`additionalCtas`、`media` は付けない。
- 本文は短いファンNEWS。WEB投票期間、三次日程、配信中案内、毎日WEB投票は既存カードへ重複掲載しない。
  写真の数字は載せない。急かし文や投票ボタンは付けない。
- 次の本人XはNEWSにしない（既存掲載または別案内）:
  `https://x.com/Mily_chan36/status/2095397941972537361`（毎日WEB投票）
  `https://x.com/Mily_chan36/status/2095386398979445200`（配信中）
- `activityIds: ["miss-circle"]`。`sameDayOrder: 10`。
- Gallery / `media.ts` / `galleryVideos.ts` / `/stories/` / highlights /
  events / streamSchedule / `contest.ts` には追加しない。

### 2026-09-02 ミスサー三次審査 NEWS と Calendar

- 既存 NEWS id `2026-09-02-miss-circle-third-round` の本文は、審査期間と配信予定の確認先が伝わる短い2段落にする。新しいNEWSは作らない。
  既存の 2026-09-02 Instagram Story 2件は残す。消さない。
- `sameDayOrder: 10` で同日の Story 2件（2 / 1）より前。日付は `2026-09-02`。
- 本文へ審査特典や日別時刻表を重複掲載しない。詳しい配信時刻は代表画像とCalendarへ分ける。
  JST、live、作業メモ、公式、公認は書かない。投票回数と本人以外の出場者名は書かない。
- `activityIds: ["miss-circle"]`。出典は主催者サイト `https://www.misscircle.jp/`。
  additionalSources は ENTRY 734 と SHOWROOMイベントページ。
  関連CTAは WEB投票 LIFF、ENTRY 734、SHOWROOMイベント、SHOWROOMルーム。
  新しい投票ボタンは足さない。
- 代表画像は本人配布のタイムテーブル b49-01。NEWS専用。
  元JPEGは `media/original/`（gitignore）で保持し、公開用はメタデータ除去済み派生を使う。
  9/3の本人Instagram Storyで共有された目標・各審査日程の画像と応援方法動画（b50）は、
  同じNEWSの `additionalMedia` にこの順で統合する。Galleryや別NEWSへは複製しない。
- Calendar の期間は `supportEvents.ts` を読む。`events.ts` は空のまま。
  1) WEB投票 2026-09-03T12:00:00+09:00〜2026-09-13T23:59:00+09:00
  2) SHOWROOM無料ギフト審査・イベント審査
     2026-09-03T05:00:00+09:00〜2026-09-12T21:59:00+09:00
- 本人の確認済みSHOWROOM枠は `streamSchedule.ts`（origin `showroom-schedule`）。
  9/7・9/10・9/8昼は入れない。9/8夜の本人表記 24:00-25:00 は実時刻 9/9 0:00。
  開始・終了を構造化し、確認済み終了時刻で表示終了とCalendarの時刻範囲を決める。
- 載せない: 審査特典、日別時刻表、SHOWROOMヘッダー枠 9/2 20:00〜9/12 12:59、
  通過発表、票数、会場三次、AGESTOCK 9/20 横浜アリーナ。
  9:00おやすみ配信は streamSchedule に入れない。
- `contest.ts` の ContestPhase は日付のみ（9/3〜9/13）。
  主催者の3本の時刻表示は既存のまま。#131の共有clockは書き換えない。
- `/stories/`、highlights、media.ts、galleryVideos には追加しない。

### 2026-09-02 Instagram Story おやすみりぃ・パトン2位（batch b47）

- `news.ts` は72件。b47-01（おやすみりぃ／翌日9:00 SHOWROOM案内）と
  b47-02（Paton投票を2位で締められたお礼）を独立したNEWSとして先頭へ追加する。
  既存の 2026-09-01 項目は残す。
- HOME Latest / `/news/` と Gallery は、各Storyにつき公開MP4 1本・poster 1枚・
  manifest object 1件を共有する。`galleryVideos.ts` は独立動画28本＋Mixch
  outbound player 4本。b47-01は LIVE STREAM Activity の関連NEWS・関連メディアにも出す。
  b47-02は CAMPUS GIRLS Activity の関連NEWS・関連メディアにも出す。
  `/stories/`、highlights、events、streamSchedule、`media.ts`、
  PatonVoteGuide のランキング系列には追加しない。
- 恒久permalinkがないため、出典は非リンクの `Instagram Story` labelとする。
  本人Instagramプロフィールは関連CTAであり、Storyの出典URLとして扱わない。
- おやすみりぃNEWSの追加CTAは確認済みSHOWROOMルーム
  `https://www.showroom-live.com/r/circle2026_0734`（`t=`なし）。
  9:00の案内は本文の引用だけにし、streamSchedule / events には転記しない。
- Paton 2位NEWSには投票CTAを付けない。投票は 2026-09-01 23:59 JST で終了済み。
  他出場者の名前は本文・タイトルに出さない。144,550ptは投稿時点の記録。
  面接の日時・場所は未確認のため書かない。
- 公開派生は video-only。映像は720×1280。SNS CDNは参照しない。
- 同日9/2は `sameDayOrder: 2`（おやすみりぃ）→ `1`（パトン2位）。

### 2026-09-01 初配信 おやすみりー（batch b48）

- `news.ts` は74件。9月はじめてのSHOWROOMを独立したNEWSとして追加する。
  既存の 2026-09-01 項目は残す。消さない。
- title / body は指定の文言だけ。作業メモ、公式、公認は書かない。
  トマトと栄養素とファンマークを同一視する文は書かない。
- `sameDayOrder: 20` で同日の他3件より前。
- `activityIds: ["live-stream"]` のみ。miss-circle は付けない。
- 出典は非リンクの `SHOWROOM` label。再生permalinkは作らない。
  関連CTAは確認済みSHOWROOMルーム
  `https://www.showroom-live.com/r/circle2026_0734`（`t=`なし）。
  Paton投票CTAは付けない。追加の投票ボタンも付けない。
- ボード静止画は NEWS専用の自己ホストJPEG 6枚（b48-01〜b48-06）。
  代表 `media` はあっきーさんボード（トマトの栄養素 / 1人目）のボード寄り。
  additionalMedia はあっきーさん4枚（指差し・ポーズ直前・頬・頭を指さす）のあと、
  やすぴさんボードを末尾に置く。やすぴさんを代表にしない。Gallery には出さない。
  Gallery / `media.ts` / `galleryVideos.ts` / `/stories/` / highlights /
  events / streamSchedule / `contest.ts` には追加しない。
- 同日9/1は `sameDayOrder: 20`（初配信）→ `3`（Xあいさつ）→
  `2`（パトン投票最終日）→ `1`（9月あいさつ）。

### 2026-09-01 本人X おはよ〜 今日から9月ー

- `news.ts` は70件。9/1朝の本人Xあいさつを独立したNEWSとして追加する。
- 出典は恒久permalink `https://x.com/Mily_chan36/status/2094579904587382930`。
  `sourceLabel` は `Xの投稿を見る`。`t=` / `s=` トラッキングは付けない。
- 画面は既存 Instagram Story b46-02 と同じクリップ。Latest / NEWS は既存の
  公開MP4・poster（`mily-b46-02-september-mily-story`）を wrapper object で再利用する。
  新しいMP4 / poster は作らない。SNS CDN は hotlink しない。
- Gallery / `galleryVideos.ts` は既存の `septemberMilyStoryVideo` 1件のまま。
  2枚目の Gallery tile は作らない。`media.ts` / `/stories/` / highlights / events /
  streamSchedule / `contest.ts` / profile には足さない。
- あいさつだけなので `activityIds` なし。Paton CTAなし。SHOWROOM CTAなし。
- 既存の Instagram Story NEWS `2026-09-01-september-mily-story`
  （「9月のみりぃもよろしくね」 / b46-02）とは別投稿。統合しない。消さない。
  Latest は2カード、Gallery は1本。
- 同日9/1は `sameDayOrder: 3`（Xあいさつ）→ `2`（パトン投票最終日）→
  `1`（9月あいさつ）。既存の 1/2 は変えない。

### 2026-09-01 Instagram Story パトン投票最終日・9月あいさつ（batch b46）

- `news.ts` は69件。b46-01（おはよう／今日はパトン投票最終日）と
  b46-02（9月のみりぃもよろしくね）を独立したNEWSとして追加する。
- HOME Latest / `/news/` と Gallery は、各Storyにつき公開MP4 1本・poster 1枚・
  manifest object 1件を共有する。`galleryVideos.ts` は独立動画26本＋Mixch
  outbound player 4本。b46-01は CAMPUS GIRLS Activity の関連NEWS・関連メディアにも出す。
  b46-02は画面が9月のあいさつのため Activities には関連付けない。
  `/stories/`、highlights、events、streamSchedule、`media.ts`、
  PatonVoteGuide のランキング系列には追加しない。
- 恒久permalinkがないため、出典は非リンクの `Instagram Story` labelとする。
  本人Instagramプロフィールは関連CTAであり、Storyの出典URLとして扱わない。
- 両NEWSに `Instagramプロフィールを見る` と `Patonでみりぃに投票する` の
  2 CTAを表示する。Paton CTAだけは既存SupportEventの確認済み期間
  （2026-09-01 23:59 JSTまで）に従い、終了後に自動で外す。
- 元動画に音声ストリームはない。公開派生も video-only。映像は720×1280を維持する。
  b46-01は30fps・167フレーム・5.567秒、b46-02は30fps・92フレーム・3.067秒。
  crop・scale・短縮・テロップ変更・AI加工はしない。
- 同日9/1は `sameDayOrder: 2`（パトン投票最終日）→ `1`（9月あいさつ）。

### 2026-08-31 Instagram Story 肉声投票案内（batch b45）

- `news.ts` は67件。b45-01（キャンパスガールズ2027出場中／Paton投票は9月1日まで／
  31日は1.5倍）を独立したNEWSとして追加する。
- HOME Latest / `/news/` と Gallery は、公開MP4 1本・poster 1枚・
  manifest object 1件を共有する。`galleryVideos.ts` は独立動画24本＋Mixch
  outbound player 4本。CAMPUS GIRLS Activity の関連NEWS・関連メディアにも出す。
  `/stories/`、highlights、events、streamSchedule、`media.ts`、
  PatonVoteGuide のランキング系列には追加しない。
- 恒久permalinkがないため、出典は非リンクの `Instagram Story` labelとする。
  本人Instagramプロフィールは関連CTAであり、Storyの出典URLとして扱わない。
- NEWSに `Instagramプロフィールを見る` と `Patonでみりぃに投票する` の
  2 CTAを表示する。Paton CTAだけは既存SupportEventの確認済み期間
  （2026-09-01 23:59 JSTまで）に従い、終了後に自動で外す。
- オーナーが本人肉声の保持を明示依頼したため、公開派生でも AAC 音声を残す。
  映像は720×1280、30fps、972フレーム、32.400秒を維持する。
  crop・scale・短縮・テロップ変更・AI加工はしない。
- 1.5倍は31日の投票枠の案内として本文に明示する。投票期限は9月1日。
  「あと一時間」は投稿時点の呼びかけであり、events / streamSchedule には転記しない。
- 同日8/31は `sameDayOrder: 7`（この肉声Story）→ `6`（1位Story）→
  `5`（1.5倍Story）→ `4`（投票方法）→ `3`（朝お礼X）→ `2`（1.5倍X）→
  `1`（配信中X）。

### 2026-08-30〜31 Instagram Story（batch b44）

- `news.ts` は66件。くまフィルターの「2位を守り抜きたい」Storyは既存b43-02と同一のため追加しない。
  新たに、b44-02（現在1位／102,700pt／31日は1.5倍DAY）、b44-01（公式1.5倍デーの緊急告知）、
  投票方法案内のInstagram Story、b44-04（SHOWROOM 30日連続配信記念日。動画は非掲載）をNEWSへ追加する。
- HOME Latest / `/news/` と Gallery は、b44-02 / b44-01 について公開MP4 1本・poster 1枚・
  manifest object 1件を共有する。`galleryVideos.ts` は独立動画23本＋Mixch
  outbound player 4本。投票方法案内と30日連続配信記念日の動画は自己ホストしない。
- 投票方法案内は8/27のX案内と同じ手順。画面に他出場者の顔・名前、オーナーサポーター名、
  投稿時点ではない古い順位表示があるため、8/27と同じく既存b26-01人物写真を代表画像に再利用する。
  Gallery / `media.ts` / `galleryVideos.ts` には出さない。
- 恒久permalinkがないため、出典は非リンクの `Instagram Story` labelとする。
  本人Instagramプロフィールは関連CTAであり、Storyの出典URLとして扱わない。
- 1位NEWS・1.5倍デーNEWS・投票方法案内には `Instagramプロフィールを見る` と
  `Patonでみりぃに投票する` の2 CTA。Paton CTAだけは既存SupportEventの確認済み期間
  （2026-09-01 23:59 JSTまで）に従い、終了後に自動で外す。
- 30日連続配信記念日は LIVE STREAM のみ。CTAはInstagramプロフィールと確認済みSHOWROOMルーム。
  Paton CTAは付けない。画面内の7:30配信予定は投稿時点の記録として本文に残し、
  `events.ts` や `streamSchedule.ts` へは転記しない。
  SHOWROOM配信画面に視聴者の表示名・アイコン・コメントが写るため、動画は自己ホストせず
  NEWSはテキストのみとする。Gallery / `media.ts` / `galleryVideos.ts` には出さない。
- 1位と102,700ptは投稿時点の記録として本文に明示する。他出場者の名前・顔は出さない。
  highlights / contest.ts / PatonVoteGuide のランキング系列には追加しない。
- 元動画の未確認音声は公開派生から削除する。映像は720×1280を維持する。
  b44-01は30fps・150フレーム・5.000秒、b44-02は30fps・600フレーム・20.000秒。
  crop・scale・短縮・テロップ変更・AI加工はしない。
- 同日8/31は `sameDayOrder: 6`（1位Story）→ `5`（1.5倍Story）→ `4`（投票方法）→
  `3`（朝お礼X）→ `2`（1.5倍X）→ `1`（配信中X）。
  同日8/30の30日連続配信記念日Storyは unranked で、Mixch最終日のあと、3位Xの前。

### 2026-08-30〜31 本人X投稿5件（テキスト／リンク＋朝お礼画像）

- `news.ts` は66件。本人Xの公開投稿5件をNEWSへ追加する。8/31朝お礼の画像だけはオーナー提供原本からNEWS専用で自己ホストし、SNS CDNはhotlinkしない。
- 8/31のPaton 1.5倍は2投稿を1カードに統合する。一次出典は
  `https://x.com/Mily_chan36/status/2094102196447334713`（01:37緊急告知）、
  additionalSources は
  `https://x.com/Mily_chan36/status/2094191581951906187`（07:32 無料拍手）。
  投票枠は投稿どおり31日 0:00–23:59 JST。順位は投稿時点で1位。
  既存b26-01人物写真とPaton本人ページCTAを再利用する。CAMPUS GIRLSのみ。
  `sameDayOrder: 2` で朝お礼カードの次、6:46配信記録より先。
- 8/31 06:46のSHOWROOM配信中案内
  `https://x.com/Mily_chan36/status/2094179970960744615` は、配信中だった記録。
  CTAは `https://www.showroom-live.com/r/circle2026_0734`（期限切れの `t=` は付けない）。
  LIVE STREAMのみ。`sameDayOrder: 1`。
- 8/30 20:25の30日連続配信記念
  `https://x.com/Mily_chan36/status/2094023746751463582` もアーカイブ表現。
  CTAは同じSHOWROOMルーム（`t=` なし）。LIVE STREAMのみ。
  `sameDayOrder: 4` で既存の8/30項目より先。
- 8/30 05:48のPaton順位
  `https://x.com/Mily_chan36/status/2093802981921849728` は投稿時点で3位、
  2位に上がりたいという呼びかけ。既存b26-01とPaton CTAを再利用。
  CAMPUS GIRLSのみ。sameDayOrder未指定でMixch最終日のあと。
  8/31の1位カードと混ぜない。
- 8/31 07:34のお礼投稿
  `https://x.com/Mily_chan36/status/2094192106105659650` は
  テキストNEWS＋出典リンクのみ。視聴者名・アバターが多数写るSHOWROOM画面は
  NEWS・Galleryを含む公開面に置かない。CTAは確認済みSHOWROOMルーム（`t=` なし）。
  LIVE STREAMのみ。`sameDayOrder: 3` でInstagram Story 3件の次。X画像CDNは参照しない。
- Gallery、`media.ts`、`galleryVideos.ts`、`/stories/`、events、streamSchedule、profile、highlights、
  contest.ts、PatonVoteGuideランキング系列、portal dual-registerには追加しない。
- HOME Latestは日付降順のうえ、8/31は1位Instagram Storyが先頭。8/30は連続配信記念Xが先頭。

### 2026-08-29〜30 Instagram Story動画2本

- `news.ts` は57件。b43-01（日付が変わる前のPaton投票5日目案内／変面さんとの2ショット）と
  b43-02（キャンパスガールズ2027情報／パトン9/1まで・ムービー応援は当日30日まで／2位を守り抜きたい）を、
  それぞれ独立したNEWSとして追加する。
- HOME Latest / `/news/` と Gallery は、各Storyにつき公開MP4 1本・poster 1枚・
  manifest object 1件を共有する。`galleryVideos.ts` は独立動画21本＋Mixch
  outbound player 4本。CAMPUS GIRLS Activity の関連NEWS・関連メディアにも出す。
  `/stories/`、highlights、events、streamSchedule、`media.ts`、
  PatonVoteGuide のランキング系列には追加しない。
- 恒久permalinkがないため、出典は非リンクの `Instagram Story` labelとする。
  本人Instagramプロフィールは関連CTAであり、Storyの出典URLとして扱わない。
- 両NEWSに `Instagramプロフィールを見る` と `Patonでみりぃに投票する` の
  2 CTAを表示する。Paton CTAだけは既存SupportEventの確認済み期間
  （2026-09-01 23:59 JSTまで）に従い、終了後に自動で外す。Mixch URLは画面に無いため
  Mixch CTAは付けない。radio Activity も付けない。
- 元動画の未確認音声は公開派生から削除する。映像は720×1280を維持する。
  b43-01は1fps・20フレーム・20.000秒、b43-02は30fps・600フレーム・20.000秒。
  crop・scale・短縮・テロップ変更・AI加工はしない。b43-01の背景第三者への白いぼかしは
  元動画のまま維持する。レストラン名は確認できないため非掲載。
- 「2位」は投稿時点の記録として本文に明示する。他出場者の名前・顔は出さない。
- 同日8/30は `sameDayOrder: 3`（このStory）→ `2`（朝SR案内）→ Mixch最終日。
  同日8/29は `sameDayOrder: 4`（5日目Story）→ `3`（配信中）→ `2`（14:40案内）→
  Paton投票4日目Story。

### 2026-08-30 湘南シーサイドサークル「映画特集」放送メモ

- オーナー提供の録音と、行ごと版・段落校正版・統合版の文字起こしを照合し、
  `src/data/radioEpisodes.ts` に放送回の要約を保存する。
- Radio Activityへ、放送全体の要約、みりぃの見どころ6件、番組で紹介された
  オーナーのリスナーメッセージ2件、主なコーナーのタイムスタンプを掲載する。
- 出典は非リンクの
  `2026年8月30日 生放送アーカイブ文字起こし（オーナー提供）` labelとし、
  Driveのフォルダ・ファイルIDはtracked textへ保存しない。
- 3時間の録音・画面録画・全文文字起こしは公開しない。楽曲と交通情報は要約から省略する。
- Drive内のサムネイルは画面録画由来の順位表示と別名の写り込みがあるため、公開素材に使わない。
- NEWS / Gallery / media.ts / galleryVideos / `/stories/` / highlights / events /
  streamSchedule / contest.ts は変更しない。

### 2026-08-30 湘南シーサイドサークル番組Story動画2本

- オーナー提供の番組Instagram Story動画2本を batch b42 として受け入れる。
- b42-01 は「映画」のエピソード募集とメッセージフォーム、b42-02 は
  10:00〜13:00の生放送・聴取案内・トークテーマ「映画」を表示する。
- 2本とも Radio Activity専用の公開MP4・poster・manifest objectとして扱う。
  HOME Latest / NEWS、Gallery、`/stories/`、highlights、events、streamSchedule、
  `media.ts` には追加しない。
- Radio Activity の動画直下に、既存の公開メッセージフォームへのCTAを再掲する。
- 恒久的なStory permalinkはないため、出典は非リンクの
  `湘南シーサイドサークル Instagram Story` labelとする。
- 元動画の未確認音声は公開派生から削除する。512×910、30fps、571フレームを維持し、
  crop・scale・短縮・テロップ変更・AI加工は行わない。

### 2026-08-30 朝のSHOWROOM 6:00〜6:30案内

- `news.ts` は55件。本人X
  `https://x.com/Mily_chan36/status/2093802690598064521`
  （おはようのあいさつ／今日もみんなと乗り越えていく／SR 6:00〜6:30）を
  独立したテキストNEWSとして追加する。
- 写真がないためテキストNEWS＋出典リンク。CTAは確認済みSHOWROOMルーム
  `https://www.showroom-live.com/r/circle2026_0734`（`t=` トラッキングは付けない）。
- Gallery / media.ts / galleryVideos / `/stories/` / highlights / events /
  streamSchedule / contest.ts には追加しない。通常のSHOWROOM枠は自動取得のまま。
- LIVE STREAM のみ。CAMPUS GIRLS・MISS CIRCLE・Paton CTA・radio Activity は付けない。
- 同日は `sameDayOrder: 2` でMixch「配信＆ムービーは今日が最終日」より先に出す
  （X snowflake上、この投稿の方が後）。
- 本文はアーカイブ表現。投稿に無い順位・得点・終了確認は書かない。

### 2026-08-30 Mixch「配信＆ムービーは今日が最終日」

- `news.ts` は54件。本人X
  `https://x.com/Mily_chan36/status/2093799709219704887` が案内した
  Mixch `https://mixch.tv/m/UBHJplv4` を、Mixch outbound player card として
  Latest / NEWS / Gallery で共有する。
- 出典は本人X投稿。CTAはMixch本編。確認済み本人アカウント
  `https://mixch.tv/u/10114673`。poster は Mixch 公式サムネイル
  （`thumb_normal`）。ファイルは自己ホストしない。
- CAMPUS GIRLS Activity の関連NEWSとしては出すが、関連メディアには
  Mixchカードを出さない。Paton CTA は付けない。
- Gallery / media.ts の自己ホスト、`/stories/` / highlights / events /
  streamSchedule / contest.ts には追加しない。
- 本文はアーカイブ表現。投稿に無い順位・得点・本戦進出は書かない。

### 2026-08-29 SHOWROOMラジオ配信・3次審査案内のX投稿2件

- `news.ts` は53件。本人X
  `https://x.com/Mily_chan36/status/2093572006457557333`（14:40〜ラジオ配信案内）と
  `https://x.com/Mily_chan36/status/2093575115913224580`（配信中／9/3〜3次審査）を、
  それぞれ独立したテキストNEWSとして追加する。
- 写真がないためテキストNEWS＋出典リンク。CTAは確認済みSHOWROOMルーム
  `https://www.showroom-live.com/r/circle2026_0734`（`t=` トラッキングは付けない）。
- Gallery / media.ts / galleryVideos / `/stories/` / highlights / events /
  streamSchedule / contest.ts には追加しない。通常のSHOWROOM枠は自動取得のまま。
  3次審査の期間は既存の `contest.ts`（9/3〜9/13）と矛盾しない案内であり、
  フェーズ名は「3次審査進出」のまま。
- 14:40案内は LIVE STREAM のみ。配信中／3次審査案内は MISS CIRCLE と
  LIVE STREAM に関連付ける。CAMPUS GIRLS・Paton CTA・radio Activity は付けない
  （FM「湘南シーサイドサークル」ではなくSHOWROOMのラジオ配信）。
- 同日は `sameDayOrder: 3`（配信中）→ `2`（14:40案内）→ Paton投票4日目Story。
- 本文はアーカイブ表現。投稿に無い順位・得点・終了時刻は書かない。

### 2026-08-28〜29 Instagram Story動画2本の追記

- `news.ts` は50件。b41-01（8月28日22:00〜SHOWROOM夜配信案内）と
  b41-02（8月29日Paton投票4日目案内）を、それぞれ独立したNEWSとして追加する。
- HOME Latest / `/news/` と Gallery は、各Storyにつき公開MP4 1本・poster 1枚・
  manifest object 1件を共有する。`galleryVideos.ts` は独立動画18本＋Mixch
  outbound player 3本。`/stories/`、highlights、events、streamSchedule、
  `media.ts`には追加しない。
- 恒久permalinkがないため、出典は非リンクの `Instagram Story` labelとする。
  本人Instagramプロフィールは関連CTAであり、Storyの出典URLとして扱わない。
- 両NEWSに `Instagramプロフィールを見る` と `Patonでみりぃに投票する` の
  2 CTAを表示する。Paton CTAだけは既存SupportEventの確認済み期間
  （2026-09-01 23:59 JSTまで）に従い、終了後に自動で外す。
- 元動画の未確認音声は公開派生から削除する。512×910、30fps、571フレームを維持し、
  crop・scale・短縮・テロップ変更・AI加工はしない。
- b41-01の画面内時刻は終了済みの記録としてのみ掲載し、`events.ts`や
  `streamSchedule.ts`へ過去枠を転記しない。

### 2026-08-28 配信お礼・翌日未確定のX投稿の追記

- `news.ts` は48件。本人X
  `https://x.com/Mily_chan36/status/2093347548388110372` の確認済み本文を
  NEWSへ追加し、投稿を見る出典リンクだけを付ける。
- 写真がないためテキストNEWSとする。Gallery / media.ts / galleryVideos /
  `/stories/` / highlights / events / streamSchedule には追加しない。
- 「明日の配信時間はまだ確定していない」とあるため、翌日枠は手入力しない。
- LIVE STREAM Activity に関連付ける。CAMPUS GIRLS Activity・Paton CTA は
  既存の8/28 3日目カード側に残す。
- 同日は `sameDayOrder: 2` で3日目カードより先に出す。

### 2026-08-28 CAMPUS GIRLS 2027 予選A FinalSTAGE 3日目 X投稿の追記

- `news.ts` は48件。本人X
  `https://x.com/Mily_chan36/status/2093262992289026404` の確認済み本文を
  NEWSへ追加し、投稿を見る出典リンクとPaton本人ページへの投票CTAを分けて表示する。
- 投稿に写真がないため、既存b26-01人物写真を代表画像に再利用する。
  Gallery / media.ts / galleryVideos / `/stories/` / highlights / events /
  streamSchedule には追加しない。
- 順位は書いていない。8/28のInstagram Storyシリーズ（b40）は PatonVoteGuide
  専用のまま NEWS へ混ぜない。
- CAMPUS GIRLS Activity に関連付ける。投票CTAは既存のPaton期間終了後に自動で外す。

### 2026-08-28 CAMPUS GIRLS 2027 予選Final STAGE Storyの追記

- HOME と Support が共有する既存 `PatonVoteGuide` に、batch b40 の審査詳細画像、
  Paton投票3日目2位の動画、ムービー審査1位・総合7位の動画を同じシリーズとして追加する。
  既存b39の投票ページ案内Storyは維持し、別のNEWSやStory記事を増やさない。
- 順位は2026年8月28日のStory投稿時点の記録であり、画面にも
  `投稿時点の記録` と「現在の順位を示すものではない」を明示する。
- 3点とも恒久permalinkのない本人Instagram Storyなので、出典表示は非リンクの
  `Instagram Story`。本人Instagramプロフィールは出典とは分けた関連CTA
  `Instagramプロフィールを見る` として表示する。
- ランキング画面は、みりぃ本人の行を残し、ほかの出場者の顔・名前と
  公式バナー内の第三者の顔を公開派生でモザイク処理する。20秒動画の
  未確認音声は削除し、5秒動画は元素材から無音。
- `news.ts`、`galleryVideos.ts`、`media.ts`、`stories.ts`、`highlights.ts`、
  `events.ts`、`streamSchedule.ts`、Activities、Portal Feedには追加しない。

### 2026-08-27 映画鑑賞Instagram投稿の追記

- `news.ts` は48件。本人Instagram通常投稿
  `https://www.instagram.com/p/Dci0CvNE29X/` の確認済み本文をNEWSへ追加し、
  投稿を見る出典リンクと本人InstagramプロフィールへのCTAを分けて表示する。
- オーナー提供の投稿写真5枚はbatch b38。Galleryへ5枚すべて掲載し、同じ公開派生を
  NEWSの代表1枚＋追加4枚でも投稿順に共有する。SNS CDNは参照しない。
- `media.ts` は写真32枚（すべて `published: true`）。b38の5枚は
  `sourceDate: 2026-08-27`、`credit: null`、縦横比を実寸で保持する。
- 通常の映画鑑賞投稿なので、`stories.ts`、`highlights.ts`、`events.ts`、
  `galleryVideos.ts`、Activitiesには追加しない。

維持する公開情報（消さない）:

- MISS CIRCLE CONTEST 2026 **ENTRY 734**
- SHOWROOM / X / Instagram / TikTok / MixChannel
- FM湘南マジックウェイブ（Mily / 湘南シーサイドサークル）
- 本人写真（ギャラリー派生ファイル）
- 配信予定の自動取得
- FMラジオ放送状態の自動取得（`/api/mily-radio-status`）
- **Mily / mily** 表記（l を重ねない）
- 非公式であることの明示

重複ではないもの:

- 誕生日 NEWS の本文・一次出典・CTA は Instagram。代表画像 b29-01 は同じ誕生日の本人X投稿（室内セルフィー）。Gallery の b01 花束写真は Instagram 側。別カットであり、2件目の誕生日NEWSは作っていない
- プロフィール事実と `links.ts` の FM / コンテスト URL（事実と導線）

未確認のまま残す（推測して埋めない）:

- `media.ts` の写真の `sourceDate` / `credit`（朝Story動画の `sourceDate` は確認済み）
- `mily-b01-06`（ネックレス）の公開投稿 URL
- 出演・イベント（`events.ts` は空で正しい）
- 所属事務所、商業音源、現在順位、フォロワー数など不存在・変動を伴う情報

---

## 更新の振り分け

| やりたいこと | 書く場所 | 書かない場所 |
| --- | --- | --- |
| SNS投稿の要約 | `src/data/news.ts` | `events.ts`（日時付きの出演でないなら） |
| 出演・イベント・公開収録 | `src/data/events.ts` | 配信予定の自動取得を止めて手入力しない |
| 通常の SHOWROOM 配信時刻 | 原則なにもしない（自動取得） | `events.ts` にも `streamSchedule.ts` にも推測で書かない |
| 期間限定のサイト共有文 | `supportEvents.ts` の確認済み期間＋`shareText`、`contest.ts`、ラジオ正本 | `site.ts` の説明文へ日付つき告知を固定しない |
| 写真 | Drive → `media/original/` → `pnpm media:build` → `media.ts` | SNS から自動ダウンロードしない |
| SNS URL の追加・変更 | オーナー確認後に `socials.ts` | 未確認アカウントを足さない |
| FM の番組名・ページ変更 | オーナー確認後に `profile.ts` / `links.ts` | スタッフページを読んで推測で肩書を足さない |
| プロフィール事実 | オーナー確認後に `profile.ts` と `profileSources` | 空欄を埋めるために検索結果だけを採用しない |

---

## サイト共有文の自動切替

フッターのX・Threads・端末共有メニューは、`src/lib/siteShare.ts` が確認済みデータから
その時点の呼びかけを最大3件まで自動選択する。日付・時刻の正本を共有文専用に複製しない。

- 日曜の放送開始前・放送枠中: `shared/radio-program.js` の番組名と放送枠から案内する。
  放送枠だけを根拠にMily本人の出演中とは書かない。13:00以降は当日の案内を外す。
- 期間限定の応援: `supportEvents.ts` で期間中かを判定し、`shareText` がある項目だけを載せる。
  新しい投票等を共有文へ出す場合は、一次出典・確認済み期間・短い`shareText`を同じ
  SupportEventへ追加する。終了境界で自動的に外れる。
- MISS CIRCLE: `contest.ts` の`currentPhase.start/end`を使い、開始7日前から予告、
  期間中は応援呼びかけへ切り替える。フェーズ名・日程を共有文側へ重複記載しない。
- 該当項目がない期間は`site.description`へ戻す。

XとThreadsは本文＋canonical URL、端末共有はWeb Share payloadを渡す。LINEとFacebookは
各公式Web共有エンドポイントの仕様上、canonical URLのみを渡す。

本人SNSを自動巡回して告知文を生成する仕組みではない。新しい活動は従来どおり一次情報を
確認して正本データへ追加し、その後の開始・終了切替だけをサイトが自動で行う。

---

## メディア掲載の上位方針

- オーナーから提供された、または掲載を明示承認された確認済みの画像・動画は、`docs/MEDIA.md` の掲載ゲートを通過する限り、原則として掲載候補とする。
- 非掲載を初期値にせず、Story / Latest / NEWS / Gallery のどこへ載せるのが文脈上適切かを先に判断する。
- NEWSを文章だけで終わらせず、内容に合う確認済みメディアがあれば自己ホストの公開派生、または Mixch outbound player card を利用する。節目Storyでも、確認済みの画像・動画を積極的に使用する。
- Gallery向きでない結果グラフィックや記録資料でも、Story / NEWS向きならその掲載面で使う。Galleryへ無理に展開しない。
- 非掲載は例外とし、掲載しない場合はプライバシー・第三者情報・出典 / 権利・重複・品質・掲載面・技術上の問題など、具体的な理由をPR本文または最終報告へ残す。
- 原則掲載であっても、出典・権利・プライバシー・第三者情報・公開派生の品質確認は省略しない。

Instagram Story閲覧スクリーンショットには、以下の固有の追加安全条件を適用する。一般メディアの掲載ゲートを通過しただけでは公開しない。

---

## SNS投稿を news へ追加するとき

1. 本人の確認済みアカウント（`socials.ts` にあるもの）の投稿であること。
2. 投稿を開き、日付・本文を一次ソースで確認する。スクショや転載記事だけを出典にしない。
3. `id` は `YYYY-MM-DD-短い英語slug`。一度使った id は再利用しない。
4. `date` は投稿日の `YYYY-MM-DD`（JST）。分からなければ追加しない。
5. `source` は恒久的な投稿 URL がある場合に設定し、「出典を見る」に使う。一時的なStoryで公開permalinkがない場合だけ、後述の例外手順で `source` を省略する。
6. `url` は `source` と違う関連ページがあるときだけ。同じ URL は書かない。
7. `ctaLabel` は任意。リンク先は `url ?? source`。
8. 本文は投稿の言い換えに留める。本人が書いていない抱負・予定を足さない。
9. 表示は日付降順。同日は `sameDayOrder` の大きい項目を先にし、未指定同士は source-array 順を維持する。投稿時刻が確認できない項目を id で時刻順に見立てない。id 昇順にはしない。配列の先頭に足すとレビューしやすいが、並び順だけに頼らない。

同じ投稿を何度も news にしない。写真を載せる話なら `media.ts`（オーナー確認必須）。

### 公開permalinkがない一時的なInstagram Story

- この項目は、上記の一般メディア掲載原則に対するStory閲覧スクリーンショット固有の追加条件である。
- Story閲覧スクリーンショットはデフォルトでは非掲載とし、文言確認資料だけに使う。省略記号より先を補完しない。
- ただし、**その素材と掲載面についてオーナーが明示承認した場合**は、Latest / NEWS / Gallery / `/stories/` 等のうち承認された面だけへ自己ホストできる。`/stories/` 記事の作成を必須条件にしない。crop / mask の要否も素材ごとの承認と安全確認に基づき、固定条件にしない。
- 承認を別素材・別掲載面へ自動流用しない。別Storyも別素材として扱い、Latest / NEWS / Gallery / `/stories/` の各面を明示的に区別する。
- 公開permalinkがない一時Storyでは、推測したStory URLやDriveの受け渡しURLを `source`、manifest、caption、metadataへ残さない。Story自体をNEWSの出典として示す場合は、`source` を省略し `sourceLabel: "Instagram Story"` を非リンクで表示する。プロフィールURLは出典として代用しない。
- 公開前に、本人が公開したStoryであること、投稿日・表示文・掲載面の承認範囲、DM・非公開情報・通知・第三者情報・端末情報の有無を素材ごとに確認し、判断を台帳へ記録する。
- 同じローカル派生をLatestとGalleryの両方に出す場合、MP4とposterをそれぞれ1ファイルだけ作り、両方から同じpathを参照する。
- 日常の朝投稿はLatest + Galleryで扱う。節目を文章で残すサイト機能の `/stories/` へは追加しない。
- 本人Instagramプロフィールへの導線を付ける場合は、canonical URL
  `https://www.instagram.com/mily_chan36` を `url` の関連リンクとして使い、
  `ctaLabel: "Instagramプロフィールを見る"` を設定できる。プロフィールはStoryの
  出典ではないため、`source` やmanifestの `sourceUrl` へ入れない。

### SHOWROOMファンルーム投稿

- SHOWROOMファンルーム投稿はLatest / NEWS用途とし、Gallery・`media.ts`・
  `galleryVideos.ts`・Drive Gallery・`/stories/`へ追加しない。
- 個別の恒久permalinkがない場合は`source`を作らず、
  `sourceLabel: "SHOWROOMファンルーム"`を非リンク表示する。
- 他ユーザー名・コメント・入力UIを含む生スクリーンショットは公開しない。
- オーナー提供画像から、みりぃ本人の公開投稿カードだけを決定的な非AI cropで
  切り出して使える。ほかのファンの表示名・コメント・オーナー自身のコメントは、
  公開assetへ持ち込まない。

- 音声メッセージは、オーナーが当該投稿の**サイト内再生**を明示した場合のみ、
  自己ホストの `.m4a` を Latest / NEWS の `kind: "audio"` として出してよい。
  SHOWROOM CDN の aac / m4a を hotlink しない。ファンルームページの iframe も使わない
  （`X-Frame-Options: DENY`）。Gallery・`media.ts`・`galleryVideos.ts`・
  `/stories/` へは出さない。
- 音声の本文を聞き取れない場合は、音声の中身を推測してNEWS本文へ書かない。
  テキスト投稿に書かれている範囲と、「音声メッセージが届いた」事実だけを残す。

#### Fan Room公開時の原則

公開する本文・引用は、原則としてみりぃ本人の発言だけにする。ファンサイトの主役はみりぃであり、他のファンやオーナーを公開コンテンツへ載せない。

- 他のファンの表示名、ハンドル、コメント、アバター、個人を特定できる情報は公開しない。
- オーナー自身の発言についても同様に公開しない。
- 会話の背景説明が必要な場合は、「ファンへの返信」「皆さんを気遣った」など、個人を特定しない一般表現にする。
- スクリーンショットに第三者情報が含まれる場合、privacy-safe cropを確定できない限り公開しない。
- 元スクリーンショットに第三者が写っていることを理由に、その第三者の文章をテキストへ転記してよいことにはしない。
- 本人の言葉に存在しない内容を補完・創作しない。

### 投稿に写真が付いているとき

X / Instagram の通常投稿に写真が付いていて、オーナーから元ファイルを直接受け取った場合だけ、
Latest のカード内に1枚だけ自己ホストで出してよい。

- 公開ファイルは `public/media/news/mily-bNN-NN-<slug>.jpg`。台帳は `docs/MEDIA.md`（バッチ単位）。
- `news.ts` の `media` に `kind: "image"` として `src` / `width` / `height` / `alt` を書く。
  `width` / `height` は実寸。表示は縦横比を保った `object-contain` 相当で、トリミングしない。
- カード表示より明らかに大きい NEWS 専用静止画は、Gallery と同じ 480 / 960 / 1600 の
  jpg+webp 派生を `srcSet` / `webpSrcSet` で出す。公開済みの元素材相当ファイルは上書きしない。
  同じ写真がすでに Gallery にある場合は、NEWS 側で派生を増やさず既存 Gallery ファイルを
  `srcSet` に載せてよい。NEWS JPEG は fallback `src` として残す。
- `alt` は状況の説明（外見の評価は書かない）。
- 通常のSNS投稿写真は Gallery（`media.ts`）へ自動的・無条件には追加しない。本人写真をオーナー確認済みでGallery掲載する場合は追加してよい。
- 縦写真をGalleryへ追加するときは、実画像の縦横比に対応する `MediaItem.aspect` を設定し、既定4:3への不自然なクロップを避ける。
- 外部の X / Instagram 画像 URL を直接参照しない。SNS から自動取得もしない。

### コンテスト結果など「節目」を扱うとき

通常のSNS紹介と分けて、次の3か所を同じ根拠で更新する。同じ本文を二重に持たない。

1. `src/data/stories.ts` に記事を追加し、`stories/<slug>/index.html` と
   `vite.config.ts` / `src/data/site.ts`（sitemap）/ `scripts/check-site-url.mjs` に
   ルートを登録する。本文・写真・出典はここだけに置く。
2. `src/data/news.ts` に要約1件を足し、`url` を `/stories/<slug>/` に向ける。
   本文はLatest用の短い要約に留め、記事本文を貼り直さない。
3. 確認済みの節目なら `src/data/highlights.ts` に1件、審査フェーズが動いたら
   `src/data/contest.ts` の `currentPhase` を一次ソース付きで更新する。

`Story` の `badge` は「2次審査通過」のような確認済みラベルだけに使う。未確認の
日程・審査方法・順位・得票数・ファイナル進出・グランプリは、どの場所にも書かない。

---

## イベントを events へ追加するとき

1. 本人が出演・登壇・公開収録するなど、確認できた予定だけ。
2. `source` は主催者または本人の一次発表 URL。
3. `listedAt` はサイトへ掲載した日を `YYYY-MM-DD` で書く。
4. `startAt` は日付だけ `YYYY-MM-DD`、時刻まで分かるとき `YYYY-MM-DDTHH:mm:ss+09:00`。
5. `timezone` は必ず `"Asia/Tokyo"`。
6. `kind` は `appearance` / `stream` / `event` / `other` のみ。
7. 終了時刻が確認できていなければ `endAt` を書かない。
8. 年をまたいでも同じ配列へ追加する。年別ファイルを作らない。
9. 通常の SHOWROOM 配信は `events.ts` に書かない（自動取得）。特別配信で主催発表がある場合のみ、出典付きで追加してよい。

空のままでセクションは非表示。プレースホルダー行は作らない。

---

## 写真を追加するとき

```
Google Drive 原本 → 選定 → media/original/ → pnpm media:build
  → public/media/gallery/ → src/data/media.ts
```

詳細は `docs/MEDIA.md`。要点:

- 原本は Drive。SNS から画像を自動取得しない。
- 顔の AI 生成・置換・補正・塗り足しは禁止。
- b02はDrive Galleryで使用済み。新しい独立素材は新しいbatch番号を使い、既存連番を再利用しない。
- 縦写真は `aspect`（例 `"1152 / 2048"`）を指定する。Galleryタイル既定の4/3へ切り抜かない。
- `published: true` にする前にオーナー確認。
- 公開済みファイル名は変えない。差し替えは新しい id。

---

## SNSリンクを変えるとき

オーナー確認が必要です。確認前に `socials.ts` を書き換えない。

- 追加: 本人の投稿や ENTRY 734 など一次ソースで URL を確認し、`confirmed: true` だけを載せる。
- 変更・削除: 旧 URL が 404 / 改名した根拠を PR に書く。
- SHOWROOM はコンテスト終了後にルームが変わる可能性あり。自動取得（`/api/mily-schedule`）は ENTRY 734 起点。room ID をコードに直書きしない。

---

## FM情報を更新するとき

オーナー確認が必要です。

- 見るページ: [スタッフ一覧](https://fm-smw.jp/staff)、[Mily 個別](https://fm-smw.jp/staff/mily%EF%BC%88%E3%83%9F%E3%83%AA%E3%83%BC%EF%BC%89)、[湘南シーサイドサークル](https://fm-smw.jp/program/%E3%80%8E-%E6%B9%98%E5%8D%97%E3%82%B7%E3%83%BC%E3%82%B5%E3%82%A4%E3%83%89%E3%82%B5%E3%83%BC%E3%82%AF%E3%83%AB-%E3%80%8F%E3%80%80%EF%BC%83ssc)
- 公開表記は **Mily（ミリー）**。ファンサイトの呼びは **みりぃ**。どちらも消さない。
- 番組名・URL・担当の記載が一次ソースで変わったときだけ、`profile.ts` の該当 fact と `links.ts` を同じ根拠で直す。
- 放送時刻・コーナー名・共演者は、スタッフページに無いなら書かない。

---

## 詳細プロフィールを更新するとき

プロフィール本文は `src/data/profile.ts`、節目は `src/data/highlights.ts`、表示は専用の `/profile/` ページです。

1. 本人、主催者、放送局、配信プラットフォームの一次ページを開いて内容を確認する。
2. 新しい出典は `profileSources` に `id / title / publisher / url / verifiedAt` を登録する。
3. 各事実・将来像・活動・コレクションから `sourceIds` で出典へ結び付ける。存在しない id や出典なしはCIで拒否される。
4. 大学・学年、所属、趣味、ファンネーム、将来像、活動、Favoritesなど変わり得る内容は `time-sensitive` とし、`asOf` を必ず付ける。
5. 生年月日は固定情報として保存しても、年齢を固定文字列で書かない。
6. フォロワー数、現在順位、配信予定、審査中の結果はプロフィールへ固定しない。
7. 「所属事務所なし」「音源なし」「論争なし」など不存在を推測して埋めない。
8. 活動名は **Mily / mily**。l を重ねた表記へ変更しない。
9. FM由来の内容は、本人Instagramの公開identity、MISS CIRCLEのFM活動記載、番組側のMily表記、FMプロフィールをセットで出典化し、FMページ単独で氏名を推測しない。

プロフィール事実の追加・変更は、一次情報をPR本文へ列挙し、オーナー確認を受けてから公開します。

---

## 配信予定

原則、手で書かない。

- 自動取得: `/api/mily-schedule`（ENTRY 734 → SHOWROOM room 解決 → AGE schedule）
- 確認済み手入力: `src/data/streamSchedule.ts`（空なら非表示。三次審査の本人枠は確認済みのものだけ）
- 未確認の時刻を fallback に書かない。
- 検証は Actions の「Probe stream schedule」（`scripts/probe-schedule.mjs`）。

---

## FMラジオ放送状態

原則、出演中かどうかは手で書かない。

- 自動判定: `/api/mily-radio-status`（日曜 10:00–13:00 + FMトップの NOW ON AIR）
- 確認済み事実: `src/data/radio.ts`
- NOW ON AIR の番組名一致だけを `onAirConfirmed: true` にする。取得失敗は `null`。
- 時間帯だけでは「Mily本人出演中」と書かない。

---

## オーナー確認が必須

`AGENTS.md` の確認項目に加え、日常更新では次も止める。

- プロフィール事実の追加・変更
- SNS / 外部リンクの追加・変更・削除
- 本人写真の追加・差し替え・非掲載化
- FM の担当・番組事実の変更
- `streamSchedule.ts` への手入力
- 本番公開・ドメイン設定

確認なしで進めてよい（ただし出典必須・未確認は載せず）:

- 本人確認済み SNS の投稿を、投稿 URL 付きで `news.ts` に要約する
- 主催者または本人の一次発表がある出演を `events.ts` に追加する

迷ったら追加しない。空より間違った値の方が悪い。

触らないもの（別 PR / 大規模 UI）:

- `src/App.tsx`、Hero、Support、StreamSchedule、TodayDashboard、contest 関連のレイアウト

---

## 更新テンプレート

以下は形の見本です。日付・URL・文言を、確認した一次ソースに置き換えてから `src/data/` へ入れる。このままコミットしない。

### news

```ts
{
  id: "2026-08-20-showroom-thanks",
  date: "2026-08-20",
  title: "配信へのお礼を投稿しました",
  body: "本人のX投稿で、配信に来てくれた人へのお礼が書かれています。投稿に無い内容は足しません。",
  source: "https://x.com/Mily_chan36/status/REPLACE_WITH_REAL_ID",
  ctaLabel: "Xの投稿を見る",
}
```

- `source` 必須。`url` は出典と違うページがあるときだけ。
- 実在しない status ID を本番に残さない。

### event

```ts
{
  id: "2026-09-01-ssc-public",
  title: "湘南シーサイドサークル 公開収録",
  listedAt: "2026-08-19",
  startAt: "2026-09-01T19:00:00+09:00",
  timezone: "Asia/Tokyo",
  kind: "appearance",
  venue: "確認できた会場名",
  source: "https://fm-smw.jp/REPLACE_WITH_REAL_ANNOUNCEMENT",
  url: "https://fm-smw.jp/REPLACE_WITH_DETAIL_IF_DIFFERENT",
  notes: "一次発表に書かれている範囲だけ。",
}
```

- 時刻不明なら `startAt: "2026-09-01"`（日付のみ）。
- `events` が1件以上になるとスケジュール節とナビが表に出る。

### media

```ts
{
  id: "mily-b02-01",
  kind: "photo",
  basePath: "/media/gallery/mily-b02-01-confirmed-slug",
  widths: [480, 960, 1600],
  width: 1600,
  height: 1200,
  alt: "状況が分かる説明（外見の評価は書かない）",
  caption: "確認できたキャプションがあれば",
  provenance: "sns-post",
  sourceUrl: "https://www.instagram.com/p/REPLACE_WITH_REAL_POST/",
  sourceDate: null,
  credit: null,
  published: false,
}
```

- 派生ファイルを `pnpm media:build` で作ってからマニフェストを足す。
- オーナー了承まで `published: false`。了承後に `true`。
- `sns-post` なら `sourceUrl` 必須。`third-party` なら `credit` 必須。不明な日付は `null`。

---

## PR 前

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm guard
```

PR 本文に、一次ソース URL と「推測していないこと」を書く。`main` へ直接 push しない。
マージ可否と委任範囲は、ルール本体である `AGENTS.md` の「マージしてよい条件」と
「既定のマージ委任」に従う。


### 2026-09-05 昼配信アーカイブ

- オーナー提供の同日昼配信を、今回の継続依頼に基づきLIVE STREAMへ追加。朝配信より前に表示。
- 自動文字起こしの要約と掲載フレーム10枚の目視確認。全編手動聴取ではないこと、録画内時刻の精度を明記。
- アイスの紹介、挑戦中の近況、ライブの雰囲気、歌の振り返り、配信での出会いへの感謝を公開用に要約。個別視聴者名と私生活の細部は除外。
- b57の実フレーム10枚と保存用ZIPを既存共通カードで掲載。AI加工なし、640×360を保持。
- 次の枠の案内は配信時点の記録として記載し、現在の予定データへ転記しない。
- 朝配信テストの先頭固定を、存在と前夜との順序検査へ変更。後続回が増えても日時順を検証できるようにした。


### 2026-09-05 夜配信の追加

- オーナー提供録画の自動文字起こしを要約し、既存のStreamRecap型と共通カードで追加。同日内は夜→昼→朝。
- 動画編集、応援目標、篠笛、好きな曲を披露する喜びを紹介。原動画から選んだ実フレーム10枚とJPEG ZIPを掲載（b60）。
- 全編手動聴取は未実施。開始時刻は素材名由来の概数、タイムスタンプは録画内の目安。曲名・得点・順位は断定しない。
- 翌朝の案内は配信時点の発言として記載し、現在の配信予定へ転記しない。浴衣配信の確定告知はない。
- 全文文字起こし・歌詞・視聴者名・非公開の受け渡し情報は公開対象外。未マージ統一ルールPRは導入していない。


### 2026-09-06 朝配信の追加

- オーナー提供録画の自動文字起こしを要約。既存のStreamRecap型・共通カードで前夜より前に配置。
- 初訪問への歓迎、ラジオと呼び名の紹介、配信時間の相談、応援目標、歌を紹介。実フレーム10枚とJPEG ZIPはb61。
- 全編手動聴取は未実施。開始時刻は素材名由来の概数、録画内時刻は目安。曲名は断定しない。
- 夜は21時半予定・遅れる可能性という当時の案内のみ記録。現在の予定へ転記しない。ラジオも当日の本人出演なしという発言を明記。
- 全文文字起こし・歌詞・視聴者名・私生活の細部・受け渡し情報は公開しない。未マージ統一ルールPRは導入していない。


### 2026-09-06 朝配信スクリーンショットの掲載撤回

- オーナーの再評価によりb61の10枚・代表画像・保存ZIPを公開対象から除外。公開ファイルも削除し、レポート本文は維持。
- 上記b61の掲載記録は過去の履歴。現在は非掲載。新しい候補は再選定し、掲載する素材を確認するまで追加しない。


### 2026-09-06 朝配信の承認済み3枚を掲載（b62）

- オーナーが再選定候補の3枚すべてを確認し、掲載を明示承認。08:59 正面の笑顔、48:01 首をかしげた笑顔、68:02 やわらかい笑顔。代表は2枚目。
- b62の実画像JPEG3枚と保存ZIPを既存の共通カードで掲載。元の640×360・全構図を保持し、JPEG圧縮とメタデータ除去のみ。顔加工なし。
- 元PNGはgitignoredのmedia/original/b62。owner-providedで公開再生permalinkなし。受け渡し情報は非公開。
- 取り下げ済みb61の10枚とZIPは復元しない。レポート本文は維持。

### 2026-09-06 配信ごとの歌リスト

- オーナーの依頼により9月5日以降の掲載済み回を確認し、共通カードに任意の `songs` を追加。曲名・原曲アーティスト・録画内時刻の目安・公式YouTube動画へのリンクを表示する。
- 9月5日朝は「Mela!」（緑黄色社会、0:09:20頃）。既存の録画由来レポートに歌唱記録があり、同日夜の提供文字起こしでも朝の「メラ」を振り返る発言がある。「ケセラセラ」は選曲候補のため含めていない。
- 9月5日昼の提供文字起こしでは朝の歌を振り返っている。昼の歌唱記録として転記していない。
- 9月5日夜は「メメント・モリ」（大森元貴、0:40:45頃）。提供録画の歌唱区間を再度自動認識し、公式音源情報と照合。歌唱後のアーティスト紹介とも一致。篠笛演奏は歌唱曲として扱っていない。
- 9月6日朝は「生まれてはじめて」（神田沙也加・松たか子、0:50:15頃）と「愛をこめて花束を」（Superfly、1:16:40頃）。録画の歌唱区間の自動認識と公式楽曲情報を照合。前者は歌唱後の曲紹介も照合。時刻は導入を含む目安で、全編の手動聴取は未実施。
- リンク確認日: 2026-09-06（日本時間）。[緑黄色社会の公式MV](https://www.youtube.com/watch?v=aRDURmIYBZ4)、[DisneyMusicJapanVEVOの公式動画](https://www.youtube.com/watch?v=MDZSdjLqiGA)、[Superflyの公式MV](https://www.youtube.com/watch?v=gU5oN0KVofU)、[大森元貴の公式Lyric Video](https://www.youtube.com/watch?v=Rlk3i0sEQR8)。大森元貴の動画URLは[レーベルの公開告知](https://www.universal-music.co.jp/ohmori-motoki/news/2021-07-01/)とも一致。
- リンクは原曲の公式動画で、みりぃの歌唱映像ではないことを明記。外部動画の埋め込み・サムネイル・新しい本人画像は追加していない。歌詞・録画・音声・非公開受け渡し情報は公開していない。上記の過去履歴にある「曲名は断定しない」は、今回照合した曲について更新済み。

### 2026-09-06 CAMPUS GIRLS 予選final 結果報告

- 本人X `https://x.com/mily_chan36/status/2096422147476627841`（2026-09-06 11:16 JST）。オーナーが画像を直接提供し、サイト掲載を明示依頼。
- 新しい NEWS `2026-09-06-campus-girls-prelim-final-result`。総合審査員賞、面接審査1位、Paton投票審査2位、本戦進出。画像オーバーレイの文言を message に原文どおり掲載。
- batch b63-01 を Latest / NEWS と Gallery で共有（NEWS JPEG と Gallery 派生は別バイト）。CAMPUS GIRLS Activity と highlights に追加。
- Paton投票は終了済みのため CTA なし。`/stories/`・events・streamSchedule・contest.ts・profile 非追加。本戦の日程は未確認のため書いていない。

### 2026-09-06 配信お礼と翌日6:30／22:00

- 本人X `https://x.com/Mily_chan36/status/2096604917893095494`。配信へのお礼と、翌日 6:30〜7:30 / 22:00〜23:00。
- 新しい NEWS `2026-09-06-stream-thanks-next-slots`。テキスト＋出典リンクのみ。写真は未確認のためスクレイプしない。投票CTAなし。
- 朝のメイク告知は通知のみ。NEWS / Gallery / media には載せない。
- `streamSchedule` の 9/7 は 06:30–07:30 と 22:00–23:00 のみ。9/6 枠はこの更新で変えない。
- Gallery / `media.ts` / `/stories/` / highlights / events / contest.ts / profile 非追加。

### 2026-09-06 歌リストのカラオケ参考リンクと過去回点検

- 既存の3回4曲に、原曲と区別した「カラオケで歌う」参考リンクを追加。みりぃが配信で使用した音源とは未確認であり、練習用の参考と明記。
- 2026-09-06にYouTubeの個別動画タイトルとoEmbedの投稿者情報を照合。いずれもガイドメロディなし／オフボーカル。
- Mela!: [カラオケ歌っちゃ王](https://www.youtube.com/watch?v=W5ykal8c4rY)。メメント・モリ: [EdKara](https://www.youtube.com/watch?v=dD5Djc_HoGU)。生まれてはじめて: [生音風カラオケ屋](https://www.youtube.com/watch?v=O3xpEoW_uao)。愛をこめて花束を: [生音風カラオケ屋](https://www.youtube.com/watch?v=_8TmGHhPjAw)。
- 掲載済み12回のデータと入手済みの保存資料を点検。9月4日夜の曲名大喜利、9月2日夜の歌練習の話、9月5日昼の朝の振り返りは歌唱として追加しない。9月2〜4日の録画全編を今回再聴取したわけではなく、他回に歌唱がなかったと断定しない。
- 保存済みの配信レポート・メモも同じ確認済み曲へ更新する。本人画像や録画の追加公開は行わない。

### 2026-09-07 CAMPUS GIRLS 本選EX vol.1 案内

- 本人X `https://x.com/mily_chan36/status/2096754197362622971`（2026-09-07 09:15 JST）。オーナーが画像を直接提供し、サイト掲載を明示依頼。
- 新しい NEWS `2026-09-07-campus-girls-finals-ex-vol1`。本選EX vol.1は9月7日〜9月20日。SNS審査 9/7 12:00〜9/20 12:00、Paton投票審査 9/16 18:00〜9/22 23:59。みりぃはキャンガルでの配信は行わないと投稿した。
- batch b64-01 / b64-02 を Latest / NEWS に掲載（実写ではないため Gallery / media.ts 非掲載）。CAMPUS GIRLS Activity に関連付ける。
- SNS審査の期間を SupportEvent `campus-girls-finals-ex-sns-vol1-2026` としてカレンダーへ出す。同じ案内の Paton投票審査（9/16 18:00〜9/22 23:59）と、日程表の vol.2〜6 もカレンダーへ出す。投票先URLは未確認のため Paton CTA は付けない。vol.2以降の審査内訳は未確認のため期間のみ。
- `/stories/`・highlights・events・streamSchedule・contest.ts・profile 非追加。
