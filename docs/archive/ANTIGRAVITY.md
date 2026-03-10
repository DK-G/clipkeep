# Antigravity 運用ガイド: ClipKeep

## 1. 開発フロー

### Phase 0: Bootstrap
- `new-project.ps1` による雛形生成と台帳登録。
- ClipKeep は完了済み。

### Phase 1: Planning
- `docs/new_plan.md` と `plan.md` を基準に、`RoadMap.md` / `task.md` を具体化する。

### Phase 2: Execution
- `task.md` の In Progress を実装。
- 変更ごとに `diff.md` と `Changelog.md` を更新。

### Phase 3: Verification & Inspection
- 実装検証（lint/test/manual check）を実施。
- `INSPECTION_LIST.md` の共通項目とプロジェクト固有項目を確認。

### Phase 4: Walkthrough
- 完了報告をまとめ、残課題を `memo.md` または `RoadMap.md` の Design Notes に記録。

## 2. ClipKeep 固有の確認観点
- EN/AR の文言切替が正しいこと。
- RTL レイアウトで崩れがないこと。
- 抽出失敗時に解決ページへ遷移できること。
- degraded モード時も主要導線が維持されること。
- Fact / Vote の一貫性（Unique/Multi）が崩れていないこと。

## 3. 文書更新の最小セット
- 実装時: `task.md` / `diff.md` / `Changelog.md`
- 設計変更時: `RoadMap.md` Design Notes
- 調査時: `memo.md`
