# Arabic UI Checklist（EN/AR, RTL）

## 目的
- アラビア語UIの可読性と操作性を本番品質まで引き上げる。

## 文言
- 翻訳漏れがない。
- 用語統一（download/extract/solution）を定義どおりに使用。
- エラーメッセージが自然な文体。

## RTLレイアウト
- 本文、フォーム、ボタン配置がRTLで自然。
- アイコン位置（矢印/戻る）がRTL向け。
- 数値・URL表示の崩れがない。

## UIコンポーネント
- Home/Result/Solution/Legalの主要画面を確認。
- モバイル（360px前後）で折返し崩れなし。
- 表示フォントで可読性問題なし。

## SEO/i18n
- `hreflang` が `en` / `ar` で正しい。
- `canonical` が重複しない。
- ARページのtitle/descriptionが適切。

## 合格条件
- 重大な翻訳漏れ0件。
- 主要画面でRTL崩れ0件。
- 主要導線（extract -> result -> solution）がARで完走。
