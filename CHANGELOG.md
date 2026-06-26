# Changelog

All notable changes to **Mini RPG Dev** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
with an additional **Milestones** section for this project's development stages.

---

## Milestones

| ID | Description | Status |
|----|-------------|--------|
| M0 | 主人公移動 | ✅ Done |
| M1 | タイルマップ表示 | ✅ Done |
| M2 | 壁との当たり判定 | ✅ Done |
| M3 | 開始位置をマップから読み込み | ✅ Done |
| M4 | カメラスクロール | ✅ Done |
| M5 | NPC 配置 | ✅ Done |
| M5.5 | 主人公の向き | ✅ Done |
| M5.8 | 前方 1 タイル判定 | ✅ Done |
| M6 | 最初の会話 | ✅ Done |
| M6.5 | 会話ウィンドウ UI | ✅ Done |
| M7 | NPC ごとの会話 | ✅ Done |
| M8+ | （候補）複数行会話・イベントフラグなど | ⬜ Planned |

---

## [Unreleased]

### Added

- （次のマイルストーンで追記）

### Changed

- （次のマイルストーンで追記）

### Fixed

- （次のマイルストーンで追記）

---

## [0.7.0] - 2026-06-26

M0 から M7 までの初期開発を完了。

### Added

#### M0 — 主人公移動
- 最小構成（`index.html`, `style.css`, `script.js`）
- 32×32px の主人公（青い四角）を画面中央に表示
- 矢印キー / WASD による移動
- `input.js` — 入力状態管理

#### M1 — マップ表示
- `map.js` — タイルマップ（床・壁）のデータと描画
- 床タイル（0）・壁タイル（1）の 2 種類

#### M2 — 壁判定
- `collision.js` — 壁との矩形当たり判定
- X 軸・Y 軸を分けた移動判定（斜め移動時のすり抜け防止）

#### M3 — 開始位置
- マップデータにスタート地点タイル（`TILE.START = 2`）
- `findStartTile()` / `getPlayerStartPosition()` による開始位置の取得

#### M4 — カメラスクロール
- `camera.js` — 主人公追従カメラ
- ワールド座標と画面座標の分離
- テスト用マップ拡張（40×30 タイル）

#### M5 — NPC 配置
- `npc.js` — NPC データ・描画・当たり判定
- npc1（タイル座標 28, 12）の配置

#### M5.5 — 主人公の向き
- `player.direction`（up / down / left / right）
- 移動入力に応じた向きの更新

#### M5.8 — 前方判定
- `interaction.js` — 前方 1 タイル座標の取得
- Space キーによるアクション入力（`input.consumeAction()`）
- 前方 NPC の検出

#### M6 — 会話
- `dialogue.js` — 会話データ・ウィンドウの開閉
- Space で前方 NPC に話しかけ、もう一度 Space で閉じる
- 会話中の移動停止

#### M6.5 — 会話 UI
- 画面下部の会話ウィンドウ（HTML オーバーレイ）
- 横幅 80%・白枠・黒背景・角丸・白文字

#### M7 — NPC ごとの会話
- `DIALOGUES` オブジェクトによる NPC ID 別セリフ管理
- npc2（タイル座標 12, 18）の追加 — 「ようこそ！」

### Changed

- 主人公の移動制限をキャンバス端クランプから壁判定ベースに変更（M2）
- 主人公の初期位置を `script.js` 固定値からマップデータ参照に変更（M3）
- 描画処理にカメラ変換（`applyCamera` / `resetCamera`）を適用（M4）
- 会話ウィンドウのスタイルを RPG 向けに調整（M6.5）
- `index.html` の script / CSS 読み込みにキャッシュバスター（`?v=...`）を追加

### Fixed

- **M5.8 後 — 画面が真っ暗になる問題**
  - 原因: ブラウザキャッシュにより古い `input.js` が読み込まれ、`input.consumeAction` が未定義
  - 対応: `script.js` に防御的チェックと `gameLoop` の try-catch を追加、キャッシュバスターを導入

- **M6 後 — Space を押しても会話が表示されない問題**
  - 原因: M6 実装時に `interaction.js` から `getNpcAtFront` 等の前方判定関数が削除されていた
  - 対応: 前方判定関数を `interaction.js` に復元し、`handleFrontInteraction` と併存させる形に整理

---

## 追記ガイド

新しいマイルストーンを完了したら、以下の手順で更新してください。

1. **Milestones** テーブルの該当行を ✅ Done に更新
2. **[Unreleased]** の内容を新しいバージョンセクションに移動
3. 新しい `## [x.y.z] - YYYY-MM-DD` セクションを追加
4. **Added** / **Changed** / **Fixed** に分類して記載
5. **[Unreleased]** を空のテンプレートに戻す

### 分類の目安

| 種別 | 使う場面 |
|------|----------|
| **Added** | 新機能・新ファイル・新 NPC・新マップ要素 |
| **Changed** | 既存機能の仕様変更・リファクタリング・UI 調整 |
| **Fixed** | バグ修正 |
| **Removed** | 機能・ファイルの削除 |
| **Deprecated** | 将来削除予定の機能 |

---

[Unreleased]: https://github.com/erefanto/mini-rpg-dev/compare/v0.7.0...HEAD
[0.7.0]: https://github.com/erefanto/mini-rpg-dev/releases/tag/v0.7.0
