# Mini RPG Dev — Naming Conventions

## 目的

命名規則を統一し、AI・開発者ともに迷わず開発できるようにする。

迷った場合は、新しいルールを作るのではなく、既存の命名に合わせる。

---

## JavaScript ファイル

- 小文字
- camelCase を使用

**例**

- `player.js`
- `npc.js`
- `dialogue.js`
- `spriteDisplay.js`
- `tileSprites.js`

---

## 関数

camelCase

**例**

- `updatePlayer()`
- `drawNpc()`
- `loadSprite()`
- `handleInteraction()`

---

## 変数

camelCase

**例**

- `player`
- `npcList`
- `currentMap`
- `playerDirection`

---

## 定数

SCREAMING_SNAKE_CASE

**例**

- `TILE_SIZE`
- `PLAYER_SPEED`
- `SCREEN_WIDTH`

---

## クラス

PascalCase

**例**

- `Player`
- `Npc`
- `Inventory`

---

## 画像ファイル

- すべて小文字
- 単語はアンダースコア区切り

**例**

- `player_idle_down.png`
- `player_sprite_left_01.png`
- `dog_idle.png`
- `npc_oldman.png`
- `wood_chest.png`

---

## フォルダ名

すべて小文字

**例**

- `sprites/`
- `assets/`
- `docs/`

---

## Markdown

用途が分かる名前を付ける。

主要ドキュメントは大文字 + アンダースコアで統一する。

**例**

- `GAME_SPEC.md`
- `ART_BIBLE.md`
- `WORLD.md`
- `AI_DASHBOARD.md`

---

## Git

コミットメッセージ

- `feat:`
- `fix:`
- `docs:`
- `refactor:`
- `style:`
- `chore:`

---

## AI 開発ルール

- 命名を変更する場合は理由を明記する
- 同じ意味の名前を複数作らない
- 既存命名を優先する
- 迷ったら既存ファイルに合わせる

---

## 今回は行わないこと

- コード変更
- リファクタリング
- ファイル名変更

今回は `docs/NAMING_CONVENTIONS.md` の作成のみ。
