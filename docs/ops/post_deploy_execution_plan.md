# Post-Deploy Execution Plan（ClipKeep）

## 目的
- デプロイ後の運用を、実行順・合格条件・担当で固定する。

## 実行順（推奨）
1. ダウンロード動作確認（Telegram -> X）
2. 法務・広告審査前提の最終整備
3. AdSense BAN対策の運用開始
4. 広告実装と品質確認
5. UIアラビア語化の最終仕上げ

## 1. ダウンロード動作確認
### チェック項目
- Telegram/Xで `prepare -> result -> download` が完走する。
- 失敗時（invalid URL / unsupported platform）のエラーメッセージが正しい。
- 429時に `retryAfterSec` が返る。
- 503(degraded)時にSolution導線へ遷移できる。

### 合格条件
- 成功ケース: 主要2プラットフォームで再現性あり。
- 失敗ケース: 4xx/429/503が仕様どおり。

## 2. 法務・広告審査前提の最終整備
### チェック項目
- `Terms / Privacy / Cookies / DMCA / Contact` が本番URLで公開。
- プライバシーポリシーに広告・計測・Cookie記載がある。
- 著作権侵害コンテンツの取り扱いルールを明示。

### 合格条件
- 主要法務ページが全て200でアクセス可能。

## 3. AdSense BAN対策運用
- 詳細は `docs/ops/adsense_ban_prevention.md` を運用基準とする。
- 毎週レビューで違反リスクを点検する。

## 4. 広告実装
### チェック項目
- 初期は控えめ配置（過剰広告禁止）。
- CLS悪化がない（レイアウトシフト抑制）。
- モバイル表示崩れがない。

### 合格条件
- Core Web Vitalsを大きく毀損しない。
- UX上、主要CTAより広告が強くならない。

## 5. UIアラビア語化の最終仕上げ
- 詳細は `docs/ops/arabic_ui_checklist.md` を使用。

## 進行管理
- 結果は `memo.md` に記録。
- 完了反映は `task.md` / `diff.md` / `Changelog.md` を更新。
