# Mini RPG Dev — 開発ログ

---

## 2026-06-26

### 概要

HTML / CSS / JavaScript のみで、ブラウザ上に動く 2D RPG の最小構成を段階的に実装した。

---

### M0 — 主人公移動

- `index.html` / `style.css` / `script.js` の最小構成を作成
- 画面中央に 32×32px の青い四角（主人公）を表示
- 矢印キー / WASD で移動
- 画面外に出ないようクランプ（後の M2 で壁判定に置き換え）

**追加ファイル:** `input.js`（入力状態管理）

---

### M1 — マップ表示

- 20×15 → 後に 40×30 タイルの床・壁マップを表示
- `map.js` を追加し、描画ロジックを分離

---

### M2 — 壁判定

- 主人公が壁タイルに入れないよう当たり判定を実装
- `collision.js` を追加
- X 軸・Y 軸を分けて移動判定（斜め移動時のすり抜け防止）

---

### M3 — 開始位置

- マップデータに `TILE.START = 2` を追加
- `findStartTile()` / `getPlayerStartPosition()` で開始地点を取得
- スタート地点は床として表示

---

### M4 — カメラスクロール

- `camera.js` を追加
- 主人公を画面中央付近に保ち、マップがスクロール
- ワールド座標と画面座標を分離
- テスト用にマップを 40×30 タイルに拡張

---

### M5 — NPC 配置

- `npc.js` を追加
- NPC を赤い四角で表示（npc1）
- NPC との矩形当たり判定を追加

---

### M5.5 — 主人公の向き

- `player.direction`（up / down / left / right）を追加
- 移動入力に応じて向きを更新
- コンソールで向きを確認可能（デバッグ用）

---

### M5.8 — 前方判定

- `interaction.js` を追加
- 主人公の前方 1 タイルの座標取得
- Space キーで前方 NPC 判定（デバッグ用 console.log）

---

### M6 — 会話

- `dialogue.js` を追加
- Space で前方 NPC に話しかけると「こんにちは！」を表示
- もう一度 Space で閉じる
- 会話中は主人公が移動しない

---

### M6.5 — 会話 UI

- 会話ウィンドウのスタイル調整（横幅 80%、白枠、黒背景、角丸など）
- ゲーム画面の上に重ねて表示

---

### M7 — NPC ごとの会話

- `DIALOGUES` に npc1 / npc2 のセリフを定義
- npc2（「ようこそ！」）を `npc.js` に追加
- NPC の `id` をキーに会話を取得

---

### 発生した問題と修正

#### 1. M5.8 後 — 画面が真っ暗になる

**原因:** ブラウザが古い `input.js` をキャッシュしており、`input.consumeAction` が未定義。`update()` が毎フレーム例外で落ち、`render()` まで到達しなかった。

**修正:**
- `script.js` に防御的チェックと `gameLoop` の try-catch を追加
- `index.html` の script タグにキャッシュバスター（`?v=...`）を付与

---

#### 2. M6 後 — Space を押しても会話ウィンドウが表示されない

**原因:** M6 実装時に `interaction.js` を書き換えた際、`getNpcAtFront` など前方判定関数が削除されていた。Space 入力は届いていたが、内部で `ReferenceError` が発生していた。

**修正:**
- `interaction.js` に `getPlayerTile` / `getFrontTile` / `getNpcAtFront` を復元
- `handleFrontInteraction` と併存させる形に整理

---

#### 3. キャッシュ問題（再発防止）

- `index.html` の script / CSS 読み込みにバージョンクエリ（例: `?v=m7`）を付与
- 更新後はスーパーリロード（Mac: `Cmd + Shift + R`）を推奨

---

### 現在の NPC

| ID | 位置（タイル） | セリフ |
|----|---------------|--------|
| npc1 | (28, 12) | こんにちは！ |
| npc2 | (12, 18) | ようこそ！ |
