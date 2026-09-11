# 『みんなの太陽』MV STATUS

このファイルは「次に誰が何をするか」を短く確認するための進行表です。
詳細な確定事項は `DECISIONS.md`、固定ブリーフは `BRIEF.md`、カット設計は `STORYBOARD.md` v2.1.1を参照してください。

## 現在のPhase

**Phase 5 — v4完成監査合格 / Owner公開判断待ち**

D-020に基づく全48カット再構築、漢字字幕44行の再焼き込み、横・縦完成版のDrive反映が完了した。

## 共有リンク

- Suno: https://suno.com/s/srJPo6JXkrJWPwCt
- Fan site: https://mily-fan-site.vercel.app/
- Draft AI studio: PR #108

## v4完成ファイル

- 16:9: `みんなの太陽_MV_横版_16x9_本人単独_字幕修正版_v4.mp4`
- 9:16: `みんなの太陽_MV_縦版_9x16_本人単独_字幕修正版_v4.mp4`
- 両版: 30fps / 164.366667秒 / 4,931フレーム
- 音声ストリームMD5: `dfa03abe8865f99e65ed4764d79d0384`
- 横SHA-256: `45e5463feb555a422a20577ca9ec25288ceba8a399cdefccf542e4adf9906dfd`
- 縦SHA-256: `03558b18edb8a3d617b91b6f4cd6c8337297e62c1bf3bf885ced4bd4779876e3`

## 完成監査

- 全48カット本人確実。別人・本人不明・複数人・他人物の顔0
- SNS元UI・元字幕・スタンプ・透かし0
- 横48ユニーク素材、縦41ユニーク素材。同一写真の再利用0
- 縦版の小窓・ぼかし帯・モザイク帯・黒帯0
- 漢字歌詞44 / 44行が正本SRTと文字・時刻一致、二重表示0
- 1:57.0ハードカット合格
- S14 / S33 / S42専用Heroの流用0
- `blackdetect` 横0 / 縦0
- 音声MD5一致
- 本人のAI生成・動画化・生成塗り足し不使用、追加課金なし

## 作業状況

| Task | Owner | Status | Output |
|---|---|---|---|
| STORYBOARD v2.1.1 | Claude | Done | `BRIEF.md` / `STORYBOARD.md` |
| 現行旧版の独立監査 | Grok + ChatGPT統合 | Done | 48カット / 44字幕行の実体監査 |
| 旧完成判定の撤回 | ChatGPT | Done | D-020 |
| 本人単独素材の追加監査・選定 | ChatGPT | Done | private manifest v4 |
| 48カット再構築 | ChatGPT | Done | 16:9 / 9:16 clean master |
| 漢字字幕44行再焼き込み | ChatGPT | Done | horizontal / vertical ASS |
| 全カット・字幕・境界の再監査 | ChatGPT | Done | `MV_FINAL_AUDIT_v4.md` |
| Drive完成ファイル反映 | ChatGPT | Done | `04_edit` / `05_export` |
| 最終公開判断 | Owner | Pending | Reels / TikTok / YouTube / X |

## PR #108の扱い

PR #108は引き続きDraft制作室として維持する。
Ready for reviewへ変更せず、`@codex review`を送らず、mainへmergeしない。
