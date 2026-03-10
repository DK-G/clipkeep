# 外部準備リスト（広告・サーバ・運用基盤）

## 1. ドメイン・DNS
- [ ] 本番ドメイン取得（例: `clipkeep.com`）
- [ ] DNS管理先確定（Cloudflare推奨）
- [ ] `www` / apex のルーティング方針決定
- [ ] ステージング用サブドメイン準備（例: `stg.clipkeep.com`）

## 2. 配信・サーバ基盤
- [x] Cloudflareアカウント（本番運用用）
- [x] Cloudflare Pages プロジェクト作成
- [x] Cloudflare D1 本番DB作成
- [x] Durable Objects 有効化
- [x] Wrangler本番環境のシークレット設定 (Cloudflare Pages Dashboard)
- [ ] 監視用ログ保持方針（Cloudflare Logs / 外部連携）

## 3. CI/CD
- [x] Gitリポジトリ（main/prod運用ブランチ）確定
- [x] 自動デプロイ設定（push -> preview/prod）
- [ ] 本番デプロイ承認フロー（手動承認有無）
- [ ] ロールバック手順の明文化

## 4. 広告・収益化
- [ ] 広告ネットワーク方針決定（Google AdSense 等）
- [ ] 広告アカウント審査要件確認（プライバシーポリシー、利用規約等）
- [ ] 広告枠の初期配置ルール定義（Above the fold / in-content）
- [ ] 国・言語別の広告表示方針（EN/AR）
- [ ] 過剰広告防止のUXガードライン

## 5. 法務・ポリシー
- [x] 利用規約ページ
- [x] プライバシーポリシーページ
- [x] Cookieポリシー（必要地域対応）
- [x] DMCA/権利侵害申請導線
- [x] 各SNS規約との整合確認（Telegram/X優先、TikTokはPhase4前再確認）

## 6. 分析・計測
- [x] Web Analytics導入（GA4 など）
- [x] Search Console導入
- [x] 主要イベント定義（extract submit/result/solution click）
- [x] KPIダッシュボード（CVR、離脱率、国別流入）

## 7. SEO運用準備
- [x] sitemap.xml 自動生成・配信
- [x] robots.txt 方針確定
- [x] canonical / hreflang の検証手順
- [x] 主要ページの構造化データ運用方針

## 8. セキュリティ・信頼性
- [x] レート制限方針（429実装前提）
- [x] WAF/ボット対策方針
- [x] 障害時アナウンス方法（status文面、fallback導線）
- [x] バックアップ/復旧手順（D1スナップショット）

## 9. 運用体制
- [ ] リリース責任者の決定
- [ ] 障害一次対応者の決定
- [x] 問い合わせ窓口（メール/フォーム）
- [x] 週次レビュー運用（KPI/障害/SEO）

## 10. Phase4（TikTok）着手前の追加外部準備
- [ ] TikTok関連ポリシー・規約の再確認
- [ ] TikTok向け広告リスク審査
- [ ] TikTok失敗ケース（地域制限等）に対応する法務文面

## 優先順位（最初に着手する順）
1. ドメイン・DNS
2. Cloudflare本番基盤（Pages / D1 / Secrets）
3. 法務ページ（利用規約・プライバシー・DMCA）
4. Analytics / Search Console
5. 広告アカウントと配置ルール

## 備考
- 現時点のMVPは Telegram -> X が対象。TikTokはPhase4バックログで管理。
- 429制御は実装・テスト済み。次は本番運用時のしきい値最適化を行うこと。
