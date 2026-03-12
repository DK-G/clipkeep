# AdSense Go-Live Checklist（運用適用）

## デプロイ前
- [ ] 法務ページ（Terms/Privacy/Cookies/DMCA/Contact）がフッターから到達可能
- [ ] プライバシーポリシーに広告・Cookie・同意制御を記載
- [ ] 広告ラベル（「広告」「スポンサーリンク」）表示ルールを実装
- [ ] CTA周辺30px以上の広告間隔ルールを確認

## デプロイ当日
- [ ] 1ページ目は広告枠1つ（Above the fold）まで
- [ ] モバイル表示で誤タップ誘導がない
- [ ] CLS悪化がない（広告領域を確保）
- [ ] 自己クリック防止手順をチーム共有

## 日次監視
- [ ] AdSense Policy Center確認
- [ ] GA4で異常CTRスパイク確認
- [ ] 不審Referral/ボット流入確認
- [ ] 問題ページは即時広告停止可能か確認

## 週次レビュー
- [ ] 違反リスクTop3を整理
- [ ] 是正アクション（担当・期限）を設定
- [ ] ルール改定を `adsense_ban_prevention.md` に追記
