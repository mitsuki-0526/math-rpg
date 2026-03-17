# 数学RPG「世界の理を取り戻す旅」開発計画

最終更新: 2026-03-16（Phase2完了・Phase3詳細追記）

---

## 現在の実装状況

| 機能 | 状態 | 備考 |
|---|---|---|
| タイトル画面・Googleログイン | ✅ 完成 | GIS使用、名前はフロントのみ |
| プロローグ（タイプライター） | ✅ 完成 | 4シーン、スキップ対応、賢者ツミキ登場 |
| マップ移動・ワープ | ✅ 完成 | town / dungeon1(F1〜F4) / library |
| マップHUD（HP・コイン・欠片表示） | ✅ 完成 | Canvas上に常時オーバーレイ |
| ランダムエンカウント | ✅ 完成 | EnemySymbolが追跡・接触でバトル開始 |
| ショップ | ✅ 完成 | 商人ヒント2段階セリフ、武器/防具/ポーション購入 |
| 装備・ステータス反映 | ✅ 完成 | baseAttack + 装備atk、baseArmor + 装備def |
| ボスの扉（欠片チェック） | ✅ 完成 | 10個でdungeon1_f4へ入場可 |
| Ch1ボスバトル（氷炎の魔人） | ✅ 完成 | HP100、フェーズ2（HP50%以下で攻撃力×1.5） |
| 手続き型ダンジョン生成 | ✅ 完成 | BSP + drunkardWalk、3フロア毎回ランダム生成 |
| フォグオブウォー | ✅ 完成 | 視野半径5タイル、ダンジョンのみ適用 |
| 壁めり込み修正 | ✅ 完成 | 4角点コリジョン（3pxマージン） |
| Ch1問題生成（加減乗除） | ✅ 完成 | 章別switch構造、正負の数4演算 |
| 敵データ（3種+ボス） | ✅ 完成 | 氷スライム/炎コウモリ/霜のゴーレム/氷炎の魔人 |
| コンボシステム | ✅ 完成 | 3コンボ×1.5、5コンボ×2.0、不正解でリセット |
| バトル演出 | ✅ 完成 | 正解/不正解フラッシュ、ダメージポップアップ、コンボ表示、HPバー色変化 |
| ステータス/アイテム参照画面 | ❌ 未実装 | Mキーで開閉予定 |
| セーブ/ロード（GAS連携） | ❌ 未実装 | GAS側APIも未実装 |
| Ch2〜8のマップ・問題・ボス | ❌ 未実装 | dungeon1（Ch1）のみ存在 |
| 章クリアイベント | ❌ 未実装 | ボス撃破後のタイプライター演出 |
| SE・BGM | ❌ 未実装 | |
| スマホ対応 | ❌ 未実装 | |

---

## 推奨着手順（更新版）

```
Phase 1（ゲームループ完成）     ✅ 完了
    → Phase 2（バトル深化）    ✅ 完了
        → Phase 3（マップ拡張・UI拡充）  ← 現在ここ
            → Phase 4（セーブ/ロード）
                → Phase 5（全章完成）
                    → Phase 6（仕上げ）
```

**Phase 1〜3完了** でデモ版（1章フルプレイ＋UI充実）が完成。
この段階で先生・生徒にフィードバックをもらい、Phase 4以降に反映する。

---

## Phase 1 ── ゲームループの完成 ✅ 完了

Phase 1は全て実装済み。詳細は上記の実装状況表を参照。

---

## Phase 2 ── バトルの深化 ✅ 完了

### 実装済み内容
- **2-1. Ch1問題拡充**：加算・減算（各30%）・乗算（20%）・除算（20%）。割り切れる組み合わせを保証
- **2-2. 敵データ拡充**：`frost_golem`（HP40, ATK8, DEF2, fragmentChance0.40）を3F専用で追加
- **2-3. コンボシステム**：3連続正解→×1.5倍、5連続→×2.0倍。不正解でリセット
- **2-4. バトル演出**：フラッシュ（緑/赤）、ダメージポップアップ（黄/赤）、コンボテキストアニメ、HPバー色変化（緑→黄→赤）

---

## Phase 3 ── マップ拡張・UI拡充【次の目標】

**目標：** ゲームの快適さと情報アクセスを向上させ、世界を広げる

### 3-1. ステータス/アイテム参照画面 ⭐ 新規追加

プレイヤーがいつでも自分の状態と所持品を確認できる画面。

**トリガー：** `M`キー（またはCanvas上のボタン）で開閉

**表示内容：**
```
┌─────────────────────────────┐
│  📊 ステータス               │
│  名前: ○○          章: 1   │
│  HP:  80 / 100               │
│  攻撃力: 10 + 5(鉄の剣) = 15 │
│  防御力:  2 + 3(皮の鎧) = 5  │
│  コイン: 50                  │
├─────────────────────────────┤
│  🎒 所持品                   │
│  武器: 鉄の剣（ATK+10）      │
│  防具: 皮の鎧（DEF+3）       │
│  ポーション: 3個             │
├─────────────────────────────┤
│  🔮 欠片: 7 / 10             │
│  ▓▓▓▓▓▓▓░░░              │
└─────────────────────────────┘
```

**実装方針：**
- HTML要素（`#status-screen`）をCanvasの上に `z-index: 300` で重ねる
- `InputHandler` に `m` キーのトグル処理を追加
- `state.isEventActive` が true の時は開けない（バトル中・ショップ中は無効）
- フィールド上に常時表示できる小型HUDとは別に、詳細情報として提供

**実装手順：**
1. `index.html` に `#status-screen` div を追加（ショップ画面の構造を参考に）
2. `style.css` にパネルスタイルを追加（`z-index: 300`、背景半透明、ゴールドボーダー）
3. `script.js` の `InputHandler` に `m` キー検知を追加
4. `GameEngine` に `toggleStatusScreen()` メソッドを追加
5. `update()` 内で `m` キー入力を検知して呼び出す
6. 画面を開いた際に `state.playerData` の最新値をDOMへ反映する `renderStatusScreen()` を実装

### 3-2. Ch1マップ整備（dungeon1）

- **宝箱タイル**（tileId=12）追加：調べるとコイン（5〜20）またはポーションを取得
  - DungeonGeneratorの`_placeFeatures()`で各部屋に1〜2個配置
  - 一度開けると空き箱に変わる（stateで管理）
- **環境の見た目改善**：壁タイルのバリエーション（氷壁・溶岩壁を mapchip で使い分け）

### 3-3. Ch2マップ（古代魔法の森）

```
chapter: 2
dungeon2_f1 / dungeon2_f2 / dungeon2_f3 / dungeon2_f4（ボスフロア）
```

- テーマカラー：深緑・紫
- 新敵：`forest_sprite`（HP25, ATK5, DEF1）、`magic_golem`（HP45, ATK9, DEF3）
- Ch2問題（文字と式）：`_genCh2()` を `generateProblem()` の `switch` に追加
  - 例：`x=3のとき 2x+1 = ?` → 答え: 7
  - 例：`3a-4 のaの係数は？` → 答え: 3

### 3-4. Ch3マップ（天秤の迷宮）

```
chapter: 3
dungeon3_f1〜f4
```

- テーマカラー：金・茶
- 新敵：`scale_guard`（HP30, ATK6, DEF2）、`equation_spirit`（HP50, ATK11, DEF4）
- Ch3問題（方程式）：`_genCh3()`
  - 例：`2x + 3 = 11 → x = ?` → 答え: 4
  - 例：`-x + 5 = 2 → x = ?` → 答え: 3

### 3-5. NPCセリフの進行度対応

欠片数・章に応じて商人のヒントが変わる仕組みを強化：

```js
function getMerchantHint(chapter, fragments, required) {
    if (fragments >= required) return "扉を開ける力があるぞ！封印の間へ急げ！";
    if (fragments >= required * 0.7) return `残り${required - fragments}個で扉が開く！もう少しだ！`;
    if (fragments >= required * 0.3) return "敵を倒し続けよ。欠片が集まってきた。";
    return "まだ始まったばかりだ。焦らず進め。";
}
```

### 3-6. 章クリアイベント

ボス撃破後にPrologueManagerと同じタイプライター演出でシーンを表示：

```js
// 章クリア後のイベントシーン（例：Ch1クリア後）
const CH1_CLEAR_SCENES = [
    { speaker: '語り手', text: '氷炎の魔人が倒れ、谷に静寂が戻った…' },
    { speaker: 'プレイヤー', text: '欠片が集まり、世界の理が少し修復された。' },
    { speaker: '賢者ツミキ', text: '次は古代魔法の森へ向かうのじゃ。\n文字と式の真理が眠っておる。' },
];
```

---

## Phase 4 ── セーブ・データ管理

### 4-1. GAS側API

```js
// doPost(e): userId + playerData を受け取りスプレッドシートに保存
// doGet(e):  userId を受け取り playerData を返す
```

スプレッドシート構造：
| userId | savedAt | playerDataJSON |
|--------|---------|----------------|

### 4-2. フロント側セーブトリガー

- 章クリア時（自動）
- ショップ購入後（自動）
- 村の「宿屋」ベッドに話しかけた時（手動）

### 4-3. ロード処理

- ログイン後、GASへGETリクエスト
- セーブデータあり → `state.playerData` に展開して途中から再開
- セーブデータなし → プロローグから開始

### セーブデータ構造

```json
{
  "userId": "sha256ハッシュ",
  "playerData": {
    "chapter": 1,
    "currentFragments": 0,
    "mapInfo": { "mapId": "town", "x": 7, "y": 2 },
    "hp": 100,
    "maxHp": 100,
    "baseAttack": 10,
    "baseArmor": 2,
    "coins": 0,
    "equipment": { "weapon": null, "armor": null },
    "inventory": { "potion": 3 }
  }
}
```

---

## Phase 5 ── コンテンツ完成（Ch4〜8）

| 章 | マップ | ボス | 問題 | 欠片 |
|---|---|---|---|---|
| Ch4 | 歯車と機関の街 | 機械仕掛けのゴーレム | 比例・反比例 | 10個 |
| Ch5 | 崩壊した天空の城 | 空間の魔術師 | 平面・空間図形 | 10個 |
| Ch6 | 預言者の書庫 | 記録の番人 | データの活用 | 10個 |
| Ch7 | 混沌の魔王城 | 混沌の魔王（全章総合） | 全章ランダム | 15個 |
| Ch8 | 祝賀の王都 | なし（エピローグ） | — | 0個 |

---

## Phase 6 ── 仕上げ・品質向上

- **Web Audio API** でSE追加（バトル開始・正解・不正解・ボス戦・ファンファーレ）
- **不正解の解説** バトル後に「正解は〇〇、なぜなら…」を表示
- **スマホ対応** 仮想ゲームパッドUI（方向ボタン・決定ボタン）
- **ランキング機能**（任意） 正答率・クリアタイムをGASで集計・表示

---

## 公開方針

- **ホスティング：Vercel**（個人情報保護のため、ソースコードはプライベートリポジトリで管理）
- GitHubのプライベートリポジトリ → Vercel連携 → `https://xxx.vercel.app` で公開
- Vercel自体にユーザーデータは渡らない（認証はGoogle、セーブはGAS）
- **デプロイ前に必要な作業：**
  1. Google Cloud Console → 承認済みオリジンにVercel URLを追加
  2. GASのdoPost/doGetでCORS許可ヘッダーにVercel URLを追加
  3. `server.js`（ローカル開発用）を `.gitignore` に追加

---

## 必要な画像アセット

### 優先度 高：バトル立ち絵（`assets/battle/` フォルダ）

| ファイル名 | 敵 | 推奨サイズ | 用途 |
|---|---|---|---|
| `slime_ice.png` | 氷スライム | 256×256px | バトル画面中央 |
| `flame_bat.png` | 炎コウモリ | 256×256px | バトル画面中央 |
| `frost_golem.png` | 霜のゴーレム | 256×256px | バトル画面中央 |
| `boss_ice_flame.png` | 氷炎の魔人 | 320×320px | ボスバトル（大きめ推奨） |

現状は全敵で `assets/enemy.png`（コウモリ画像）を共用。
実装方法：`BattleManager.start()` で `document.getElementById('enemy-img').src` を敵keyで切り替える。

```js
const ENEMY_BATTLE_IMAGES = {
    slime_ice:      'assets/battle/slime_ice.png',
    flame_bat:      'assets/battle/flame_bat.png',
    frost_golem:    'assets/battle/frost_golem.png',
    boss_ice_flame: 'assets/battle/boss_ice_flame.png',
};
```

### 優先度 中：シンボルエンカウント用スプライト（`assets/symbols/` フォルダ）

| ファイル名 | 敵 | サイズ | 用途 |
|---|---|---|---|
| `slime_ice.png` | 氷スライム | 32×32px | マップ上の徘徊キャラ |
| `flame_bat.png` | 炎コウモリ | 32×32px | マップ上の徘徊キャラ |
| `frost_golem.png` | 霜のゴーレム | 32×32px | マップ上の徘徊キャラ |

現状は全敵で `state.assets.enemy`（共通）を使用。
実装方法：`ENEMY_DATA` に `symbolImg` プロパティを追加し `EnemySymbol.draw()` で参照する。

> スプライトシート方式（横3コマの `enemy_sheet.png`）でも実装可能。ファイル管理がシンプルになる。

### 優先度 低（Phase3-2以降）

- `assets/mapchip.png` に宝箱タイル（tileId=12）の絵柄を追加

---

## 技術メモ

- `script.js` 単一ファイル構成。肥大化したら `battle.js`, `map.js`, `ui.js` に分割を検討
- マップデータは `MAPS` オブジェクト。tileIdの定義は `GameEngine.draw()` 内で管理
- 問題生成は `BattleManager.generateProblem()` に集約（`switch(chapter)` → `_genCh1()` 〜 `_genCh7()`）
- GAS URLは `const GAS_URL = "..."` でconstで定義（GitHub Pages想定）
- `state.playerData.baseAttack` / `state.playerData.baseArmor` を基本値として使用（装備はgetPlayerAtk/getPlayerDefで計算）
- ダンジョンは毎フロア入場時に `DungeonGenerator` で再生成（staticマップはスタブのみ）
- フォグオブウォーはオフスクリーンCanvas + `destination-out` コンポジット手法
