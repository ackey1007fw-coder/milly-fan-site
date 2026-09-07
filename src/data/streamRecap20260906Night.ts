import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote } from "./streamRecapRules.ts";

export const streamRecap20260906Night: StreamRecap = {
  "id": "2026-09-06-night-showroom",
  "date": "2026-09-06",
  "dateLabel": "2026.09.06（日）",
  "theme": "夜のお祝いと笑顔の掛け合い",
  "broadcastLabel": "22:38頃〜 約31分",
  "platformLabel": "SHOWROOM",
  "summary": "CAMPUS GIRLSの本選進出を祝う声に感謝した夜配信。ラジオへのメールや、掛け合いから学びたいという思いも話しました。防災の通知で一時的に音声を止めながら、みんなの安全を気遣った約31分です。",
  "highlights": [
    {
      "timestamp": "0:03:40",
      "title": "短い夜枠でもおしゃべりを",
      "body": "約30分の枠だと伝え、来てくれた人たちを歓迎。キラキラでの応援にもお礼を伝えながら、おしゃべりを楽しみました。"
    },
    {
      "timestamp": "0:03:50",
      "title": "ラジオへのメールも話題に",
      "body": "この日のラジオにメールを送り、番組内で読んでもらったことを紹介。聴いてくれた人への感謝を伝えました。"
    },
    {
      "timestamp": "0:04:45",
      "title": "本選進出のお祝いに感謝",
      "body": "CAMPUS GIRLSの本選進出を祝う声に感謝。面接では緊張したことや、投票で支えてくれたみんなのおかげだという思いを話しました。"
    },
    {
      "timestamp": "0:08:15",
      "title": "安全を一番に",
      "body": "防災の通知やアナウンスを受け、一時的に音声を止める場面も。配信よりも自分の安全を優先してほしいと呼びかけました。"
    },
    {
      "timestamp": "0:12:45",
      "title": "言葉を前向きに言い換えて",
      "body": "コメントの言い回しを前向きに変えてみようと提案。投票の報告をいつも嬉しく受け取っていることも伝えました。"
    },
    {
      "timestamp": "0:22:00",
      "title": "掛け合いを楽しみ、学ぶ",
      "body": "おしゃべりやお笑いが好きだと話し、コメントへの切り返しをめぐる会話に。どう返せばみんなが笑ってくれるか、掛け合いから学びたいと語りました。"
    },
    {
      "timestamp": "0:28:35",
      "title": "翌朝の案内はファンルームへ",
      "body": "翌朝の配信時間を変更する可能性があり、ファンルームで知らせると案内。朝に新しい出会いがあったことにも感謝し、安全を気遣いながら締めくくりました。"
    }
  ],
  "goals": [
    {
      "item": "WEB投票",
      "target": "日々の応援",
      "statusThen": "報告へのお礼と呼びかけ"
    },
    {
      "item": "キラキラ",
      "target": "応援を集める",
      "statusThen": "夜枠の応援を呼びかけ"
    }
  ],
  "ranking": [],
  "timeline": [
    {
      "timestamp": "0:03:40",
      "label": "短い夜枠でもおしゃべりを"
    },
    {
      "timestamp": "0:03:50",
      "label": "ラジオへのメールも話題に"
    },
    {
      "timestamp": "0:04:45",
      "label": "本選進出のお祝いに感謝"
    },
    {
      "timestamp": "0:08:15",
      "label": "安全を一番に"
    },
    {
      "timestamp": "0:12:45",
      "label": "言葉を前向きに言い換えて"
    },
    {
      "timestamp": "0:22:00",
      "label": "掛け合いを楽しみ、学ぶ"
    },
    {
      "timestamp": "0:28:35",
      "label": "翌朝の案内はファンルームへ"
    }
  ],
  "nextNote": "配信時点では、翌朝の時間を変更する可能性があり、ファンルームで知らせると案内していました。録画内では変更後の時刻を確認できません。",
  "sourceLabel": "2026年9月6日 SHOWROOM夜配信（オーナー提供録画の自動文字起こしを照合）",
  "verifiedAt": "2026-09-08",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は掲載していません。",
    extra: "開始時刻は素材名の記録時刻に基づく概数で、時刻は録画先頭からの目安です。防災アナウンスに伴うミュート区間があります。録画内で歌唱は確認されず、ランキングはファンルームに載せると案内しています。"
  }),
};
