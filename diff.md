# 変更報告書 (Diff)

## 1. 変更目的
- AdSense BAN対策ルールを実際の運用導線へ反映する。

## 2. 変更概要
- 追加ファイル:
  - `docs/ops/adsense_go_live_checklist.md`
- 更新ファイル:
  - `app/layout.tsx`
  - `app/legal/privacy/page.tsx`
  - `docs/INDEX.md`
  - `task.md`
  - `diff.md`（本ファイル）
  - `Changelog.md`

## 3. 実施内容
- 全ページ共通フッターに法務リンク群を追加。
- フッターに広告ラベル方針（sponsored content）を明示。
- Privacyに広告・Cookie・同意制御の記載を追加。
- AdSense運用チェックシートを追加。

## 4. 次の作業
- 初期広告枠の実装（1枠）とCLS抑制を実装。
