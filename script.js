/**
 * 世界の理を取り戻す旅 - 数学RPG
 * ステップ 1, 2 & 3: 認証、マップ移動、エンカウント、オブジェクト
 */

// プロローグシーンデータ
const PROLOGUE_SCENES = [
    {
        speaker: null,
        icon: null,
        text: "かつて、数という力が世界を満たしていた。\n\n人々は計算によって作物を分け合い、\n建物を建て、星の動きを予測した。\n\nそれは、あまりにも当たり前の日常だった。",
        bgColor: "#0a0a1a"
    },
    {
        speaker: null,
        icon: null,
        text: "しかしある日、突然すべての「数」が\n世界から消え去った。\n\n商人は値段を付けられず、\n農民は土地を測れず、\n空の星は時を刻むのをやめた。\n\n世界は、崩壊の瀬戸際に立たされた。",
        bgColor: "#1a0505"
    },
    {
        speaker: "賢者ツミキ",
        icon: null,
        text: "よく来た、若き冒険者よ。\n\nわしは長年、この災いの原因を調べてきた。\n世界の各地に「理の欠片」が散らばっておる。\nそれを集めれば、世界は元に戻るはずじゃ。\n\n…君だけが、その力を持っておる。",
        bgColor: "#0a192f"
    },
    {
        speaker: "賢者ツミキ",
        icon: null,
        text: "出発前に教えておこう。\n\n矢印キー（またはWASD）: 移動\nフィールドを歩く: 魔物とエンカウント\nEnterキー: NPCに話しかける\n\n村のベッドで休めばHPが全回復するぞ。\nショップで武器や防具を整えてから\n旅立つとよい。では、頼んだぞ！",
        bgColor: "#0a192f"
    }
];

// 定数
const LIBRARY_DATA = {
    chapter1: {
        title: "第1章：正負の数の基礎",
        content: "・マイナスの符号がついた数に、さらにマイナスをかけるとプラスになるぞ。<br>例：-(-5) = +5<br>・借金（マイナス）がなくなることは、財産（プラス）が増えることと同じだと考えると分かりやすいかもしれないな。<br>・計算の優先順位を間違えないように気をつけるのだぞ。"
    }
};
const TILE_SIZE = 32;

// 敵データ定義
const ENEMY_DATA = {
    slime_ice:      { name: '氷スライム',     hp: 20,  maxHp: 20,  atk: 4,  def: 0, coins: 3,  fragmentChance: 0.25, chapter: 1, symbolTier: 1 },
    flame_bat:      { name: '炎コウモリ',     hp: 28,  maxHp: 28,  atk: 6,  def: 1, coins: 5,  fragmentChance: 0.35, chapter: 1, symbolTier: 2 },
    frost_golem:    { name: '霜のゴーレム',   hp: 40,  maxHp: 40,  atk: 8,  def: 2, coins: 8,  fragmentChance: 0.40, chapter: 1, symbolTier: 3 },
    boss_ice_flame: { name: '氷炎の魔人',     hp: 100, maxHp: 100, atk: 10, def: 3, coins: 50, fragments: 0, chapter: 1,
                      isBoss: true, phaseThreshold: 0.5, phase2AtkMultiplier: 1.5 }
};
const CHAPTER_ENEMIES = { 1: ['slime_ice', 'flame_bat', 'frost_golem'] };

// ショップアイテム定義
const SHOP_ITEMS = [
    { id: 'sword_iron',  name: '鉄の剣',    type: 'weapon',     price: 20, atk: 5,  def: 0, description: '攻撃力+5' },
    { id: 'sword_steel', name: '鋼の剣',    type: 'weapon',     price: 50, atk: 12, def: 0, description: '攻撃力+12' },
    { id: 'shield_wood', name: '木の盾',    type: 'armor',      price: 15, atk: 0,  def: 3, description: '防御力+3' },
    { id: 'shield_iron', name: '鉄の盾',    type: 'armor',      price: 40, atk: 0,  def: 8, description: '防御力+8' },
    { id: 'potion',      name: 'ポーション', type: 'consumable', price: 10, atk: 0,  def: 0, description: 'HP+30（加算）' },
];

// ダンジョンフロア生成設定
const DUNGEON_CONFIGS = {
    dungeon1_f1: {
        floorName:    "氷と炎の谷 1F",
        cols: 25, rows: 18,
        roomCount:    5,
        enemyTypes:   ['slime_ice', 'flame_bat'],
        enemyPerRoom: [1, 2],
        hasMerchant:  true,
        hasExit:      true,   // タイル6: 街への帰還口
        hasStairsUp:  false,
        hasStairsDown: true
    },
    dungeon1_f2: {
        floorName:    "氷と炎の谷 2F",
        cols: 30, rows: 20,
        roomCount:    7,
        enemyTypes:   ['slime_ice', 'flame_bat'],
        enemyPerRoom: [2, 3],
        hasMerchant:  false,
        hasExit:      false,
        hasStairsUp:  true,
        hasStairsDown: true
    },
    dungeon1_f3: {
        floorName:    "氷と炎の谷 3F",
        cols: 35, rows: 22,
        roomCount:    9,
        enemyTypes:   ['slime_ice', 'flame_bat', 'frost_golem'],
        enemyPerRoom: [2, 4],
        hasMerchant:  false,
        hasExit:      false,
        hasStairsUp:  true,
        hasStairsDown: true
    },
};

// 章クリア演出シーン定義
const CHAPTER_CLEAR_SCENES = {
    1: [
        { speaker: '語り手',     text: '氷炎の魔人が倒れ、谷に静寂が戻った…\n長い間この地を凍てつかせていた呪いが、ゆっくりと解けていく。' },
        { speaker: 'プレイヤー', text: '欠片が…光っている。\n世界の理が、少しだけ修復された。' },
        { speaker: '賢者ツミキ', text: 'よくやったのじゃ、若き冒険者よ。\n次なる地は「古代魔法の森」じゃ。\n文字と式の真理が、深い闇の中に眠っておる。' },
        { speaker: '語り手',     text: '― 第1章「氷と炎の谷」　完　―\n\n次章「古代魔法の森」へ続く…' },
    ],
};

// ダンジョン商人のヒント一覧
const MERCHANT_HINTS = [
    "欠片を10個集めると封印の間の扉が開くぞ。3Fの下り階段の先じゃ！",
    "強い武器があれば一撃のダメージが増える。コインを稼いで装備を整えよう。",
    "炎コウモリのほうが欠片を落としやすいらしいぞ。狙って倒すとよい。",
    "下の階ほど敵が多く手強い。準備を整えてから挑むとよいぞ。",
    "ポーションを持っておくと長期戦でも安心じゃ。買っておくことを勧めるぞ。",
];

// グローバル状態
const state = {
    user: {
        id: null,
        name: null
    },
    playerData: {
        hp: 100,
        maxHp: 100,
        currentFragments: 0,
        requiredFragments: 10,
        coins: 0,
        baseAttack: 10,
        baseArmor: 2,
        inventory: {
            potion: 3
        },
        equipment: {
            weapon: null,
            armor: null
        },
        chapter: 1
    },
    gameStarted: false,
    currentMapId: 'town',
    isEventActive: false,
    bossRoomEntered: false,
    floorEnemies: [],
    // ダンジョン入場時のコイン・欠片（死亡時ロスト用）
    dungeonEntry: { coins: 0, fragments: 0 },
    assets: {
        mapchip: new Image(),
        player: new Image(),
        enemy: new Image(),
        npc: new Image(),
        door: new Image(),
        symbolWeak:   new Image(),
        symbolMedium: new Image(),
        symbolStrong: new Image()
    }
};

// マップデータ定義
const MAPS = {
    town: {
        name: "学びの街",
        allowEncounter: false,
        data: [
            [7, 7, 7, 7, 7, 7, 7, 5, 5, 7, 7, 7, 7, 7, 7],
            [7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7],
            [7, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 7],
            [7, 0, 0, 0, 0, 7, 7, 0, 7, 7, 0, 0, 0, 0, 7],
            [7, 0, 0, 0, 0, 7, 7, 0, 7, 7, 0, 0, 0, 0, 7],
            [7, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7],
            [7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7],
            [7, 0, 0, 0, 7, 7, 0, 0, 0, 7, 7, 0, 0, 0, 7],
            [7, 0, 0, 0, 7, 7, 0, 6, 0, 7, 7, 0, 0, 0, 7],
            [7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7],
            [7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7],
            [7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7],
            [7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7],
            [7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7],
            [7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7]
        ]
    },
    // 以下3フロアはゲーム開始後 DungeonGenerator によって上書きされるスタブ
    dungeon1_f1: { name: "氷と炎の谷 1F", allowEncounter: false, enemySpawns: [], data: [[7,7,7],[7,0,7],[7,7,7]] },
    dungeon1_f2: { name: "氷と炎の谷 2F", allowEncounter: false, enemySpawns: [], data: [[7,7,7],[7,0,7],[7,7,7]] },
    dungeon1_f3: { name: "氷と炎の谷 3F", allowEncounter: false, enemySpawns: [], data: [[7,7,7],[7,0,7],[7,7,7]] },
    dungeon1_f4: {
        name: "封印の間",
        allowEncounter: false,
        data: [
            [7, 7, 7, 7,11, 7, 7, 7, 7, 7],
            [7, 0, 0, 0, 0, 0, 0, 0, 0, 7],
            [7, 0, 0, 0, 0, 0, 0, 0, 0, 7],
            [7, 0, 0, 0, 0, 0, 0, 0, 0, 7],
            [7, 0, 0, 0, 0, 0, 0, 0, 0, 7],
            [7, 0, 0, 0, 1, 3, 0, 0, 0, 7],
            [7, 0, 0, 0, 3, 3, 0, 0, 0, 7],
            [7, 7, 7, 7, 7, 7, 7, 7, 7, 7]
        ]
    },
    library: {
        name: "静寂の図書館",
        allowEncounter: false,
        data: [
            [7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
            [7, 9, 9, 7, 9, 9, 7, 9, 9, 7, 9, 9, 7, 9, 9, 7],
            [7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7],
            [7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7],
            [7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7],
            [7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7],
            [7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7],
            [7, 7, 7, 7, 7, 7, 0, 6, 0, 7, 7, 7, 7, 7, 7],
        ]
    },
    boss_room: {
        name: "氷炎の間",
        allowEncounter: false,
        bossOnEnter: 'boss_ice_flame',
        data: [
            [7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
            [7, 0, 0, 0, 0, 0, 0, 0, 0, 7],
            [7, 0, 0, 0, 0, 0, 0, 0, 0, 7],
            [7, 0, 0, 0, 0, 0, 0, 0, 0, 7],
            [7, 0, 0, 0, 0, 0, 0, 0, 0, 7],
            [7, 0, 0, 0, 0, 0, 0, 0, 0, 7],
            [7, 0, 0, 0, 0, 0, 0, 0, 0, 7],
            [7, 0, 0, 0, 0, 0, 0, 0, 0, 7],
            [7, 0, 0, 0, 6, 0, 0, 0, 0, 7],
            [7, 7, 7, 7, 7, 7, 7, 7, 7, 7]
        ]
    }
};

/**
 * Google Identity Services コールバック
 */
function handleCredentialResponse(response) {
    const payload = decodeJwt(response.credential);
    if (payload) {
        state.user.name = payload.name;
        state.user.id = payload.sub;
        showWelcomeScreen(state.user.name);
    }
}

function decodeJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

function showWelcomeScreen(name) {
    const authContainer = document.getElementById('auth-container');
    const playerWelcome = document.getElementById('player-welcome');
    authContainer.classList.add('hidden');
    playerWelcome.classList.remove('hidden');
    document.getElementById('adventure-title').textContent = `${name} の冒険`;
}

// --- ステータスヘルパー ---

function getPlayerAtk() {
    const w = state.playerData.equipment.weapon;
    const item = w ? SHOP_ITEMS.find(i => i.id === w) : null;
    return state.playerData.baseAttack + (item ? item.atk : 0);
}

function getPlayerDef() {
    const a = state.playerData.equipment.armor;
    const item = a ? SHOP_ITEMS.find(i => i.id === a) : null;
    return state.playerData.baseArmor + (item ? item.def : 0);
}

// --- 章クリア演出管理 ---

class ChapterClearScene {
    constructor() {
        this.screen   = document.getElementById('chapter-clear-screen');
        this.textEl   = document.getElementById('cc-text');
        this.speakerBox  = document.getElementById('cc-speaker-box');
        this.speakerName = document.getElementById('cc-speaker-name');
        this.cursor   = document.getElementById('cc-cursor');
        this.scenes   = [];
        this.sceneIdx = 0;
        this.isTyping = false;
        this.onComplete = null;
        this._typeTimer = null;
        this._clickHandler = () => this._handleClick();
        this.screen.addEventListener('click', this._clickHandler);
    }

    play(scenes, onComplete) {
        this.scenes    = scenes;
        this.sceneIdx  = 0;
        this.onComplete = onComplete;
        state.isEventActive = true;
        this.screen.classList.add('active');
        this._showScene();
    }

    _showScene() {
        const scene = this.scenes[this.sceneIdx];
        if (!scene) { this._finish(); return; }

        // スピーカー表示
        if (scene.speaker) {
            this.speakerName.textContent = scene.speaker;
            this.speakerBox.style.visibility = 'visible';
        } else {
            this.speakerBox.style.visibility = 'hidden';
        }

        this.cursor.style.visibility = 'hidden';
        this.textEl.textContent = '';
        this.isTyping = true;

        let i = 0;
        const chars = [...scene.text]; // Unicode安全
        if (this._typeTimer) clearInterval(this._typeTimer);
        this._typeTimer = setInterval(() => {
            this.textEl.textContent += chars[i++];
            if (i >= chars.length) {
                clearInterval(this._typeTimer);
                this.isTyping = false;
                this.cursor.style.visibility = 'visible';
            }
        }, 45);
    }

    _handleClick() {
        if (this.isTyping) {
            // タイピング中 → 全文一括表示
            clearInterval(this._typeTimer);
            this.textEl.textContent = this.scenes[this.sceneIdx].text;
            this.isTyping = false;
            this.cursor.style.visibility = 'visible';
        } else {
            // 次シーンへ
            this.sceneIdx++;
            if (this.sceneIdx >= this.scenes.length) {
                this._finish();
            } else {
                this._showScene();
            }
        }
    }

    _finish() {
        if (this._typeTimer) clearInterval(this._typeTimer);
        this.screen.classList.remove('active');
        state.isEventActive = false;
        if (this.onComplete) this.onComplete();
    }
}

// --- プロローグ管理 ---

class PrologueManager {
    constructor() {
        this.sceneIndex = 0;
        this.isTyping = false;
        this.typeTimer = null;
        this.targetText = "";

        this.screen    = document.getElementById('prologue-screen');
        this.speakerBox  = document.getElementById('prologue-speaker-box');
        this.speakerIcon = document.getElementById('prologue-speaker-icon');
        this.speakerName = document.getElementById('prologue-speaker-name');
        this.textEl    = document.getElementById('prologue-text');
        this.cursor    = document.getElementById('prologue-cursor');
        this.nextBtn   = document.getElementById('prologue-next-btn');
        this.skipBtn   = document.getElementById('prologue-skip-btn');

        // 画面クリックで進む（ボタン・スキップは別処理なので除外）
        this.screen.addEventListener('click', (e) => {
            if (e.target === this.nextBtn || e.target === this.skipBtn) return;
            this.onScreenClick();
        });

        this.skipBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.finish();
        });

        this.nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.finish();
        });
    }

    start() {
        this.sceneIndex = 0;
        this.showScene(0);
    }

    showScene(index) {
        if (index >= PROLOGUE_SCENES.length) {
            this.showFinalButton();
            return;
        }

        const scene = PROLOGUE_SCENES[index];

        // 背景色を滑らかに切り替え
        this.screen.style.backgroundColor = scene.bgColor;

        // 話者ボックスの表示切り替え
        if (scene.speaker) {
            this.speakerBox.style.visibility = 'visible';
            this.speakerIcon.textContent = scene.icon || '';
            this.speakerName.textContent = scene.speaker;
        } else {
            this.speakerBox.style.visibility = 'hidden';
        }

        this.cursor.style.visibility = 'hidden';
        this.nextBtn.classList.add('hidden');

        this.typeText(scene.text);
    }

    typeText(text) {
        this.isTyping = true;
        this.targetText = text;
        this.textEl.textContent = "";
        let i = 0;

        const type = () => {
            if (i < text.length) {
                this.textEl.textContent += text[i];
                i++;
                this.typeTimer = setTimeout(type, 35);
            } else {
                this.isTyping = false;
                const isLast = this.sceneIndex >= PROLOGUE_SCENES.length - 1;
                if (isLast) {
                    this.showFinalButton();
                } else {
                    this.cursor.style.visibility = 'visible';
                }
            }
        };
        type();
    }

    onScreenClick() {
        if (this.isTyping) {
            // タイプ中 → 全文を即表示
            clearTimeout(this.typeTimer);
            this.isTyping = false;
            this.textEl.textContent = this.targetText;
            const isLast = this.sceneIndex >= PROLOGUE_SCENES.length - 1;
            if (isLast) {
                this.showFinalButton();
            } else {
                this.cursor.style.visibility = 'visible';
            }
        } else if (this.cursor.style.visibility === 'visible') {
            // 全文表示済み → 次のシーンへ
            this.sceneIndex++;
            this.showScene(this.sceneIndex);
        }
    }

    showFinalButton() {
        this.cursor.style.visibility = 'hidden';
        this.nextBtn.classList.remove('hidden');
    }

    finish() {
        clearTimeout(this.typeTimer);
        this.screen.classList.remove('active');
        document.getElementById('game-canvas').classList.remove('hidden');
        state.gameStarted = true;
        state.currentMapId = 'town';
        if (!engine) {
            engine = new GameEngine();
            engine.start();
        }
    }
}

// --- バトルシステム ---

class BattleManager {
    constructor() {
        this.active = false;
        this.isProcessing = false;
        this.turn = 'player';
        this.enemy = null;       // ENEMY_DATAの参照
        this.enemyHp = 0;
        this.enemyMaxHp = 0;
        this.isPhase2 = false;   // ボスフェーズ2フラグ
        this.currentProblem = { q: "", a: 0 };
        this.comboCount = 0;     // 連続正解コンボ

        // UI要素
        this.screen = document.getElementById('battle-screen');
        this.msgBox = document.getElementById('battle-message');
        this.commandArea = document.getElementById('command-select');
        this.answerArea = document.getElementById('answer-area');
        this.input = document.getElementById('answer-input');

        // ボタンイベント
        document.getElementById('btn-attack').addEventListener('click', () => this.startAttack());
        document.getElementById('btn-potion').addEventListener('click', () => this.usePotion());
        document.getElementById('submit-answer-btn').addEventListener('click', () => this.checkAnswer());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.checkAnswer();
        });
    }

    start(enemyKey) {
        // enemyKey未指定→章に応じてランダム選択
        if (!enemyKey) {
            const ch = state.playerData.chapter || 1;
            const keys = CHAPTER_ENEMIES[ch] || CHAPTER_ENEMIES[1];
            enemyKey = keys[Math.floor(Math.random() * keys.length)];
        }

        this.enemy = ENEMY_DATA[enemyKey];
        this.enemyHp = this.enemy.hp;
        this.enemyMaxHp = this.enemy.maxHp;
        this.isPhase2 = false;
        this.comboCount = 0;
        this._clearPopups();
        this.active = true;
        state.isEventActive = true;
        this.isProcessing = false;
        this.turn = 'player';

        // 敵名をDOMに反映
        const nameEl = document.querySelector('.enemy-side .status-box .name');
        if (nameEl) nameEl.textContent = this.enemy.name;

        this.updateUi();
        this.showCommands();
        this.screen.classList.remove('hidden');
        this.msgBox.textContent = `${this.enemy.name}が現れた！ どうする？`;
    }

    updateUi() {
        const enemyBar = document.getElementById('enemy-hp-bar');
        const playerBar = document.getElementById('player-hp-bar');

        const enemyPct = (this.enemyHp / this.enemyMaxHp) * 100;
        const playerPct = (state.playerData.hp / state.playerData.maxHp) * 100;

        enemyBar.style.width = `${enemyPct}%`;
        enemyBar.style.backgroundColor = this._hpColor(enemyPct);

        playerBar.style.width = `${playerPct}%`;
        playerBar.style.backgroundColor = this._hpColor(playerPct);

        const hpText = document.getElementById('player-hp-text');
        if (hpText) hpText.textContent = `HP: ${state.playerData.hp} / ${state.playerData.maxHp}`;
    }

    /** HPバーの色を割合で変化（緑→黄→赤） */
    _hpColor(pct) {
        if (pct > 50) return '#22cc44';  // 緑
        if (pct > 25) return '#ddaa00';  // 黄
        return '#dd2222';                // 赤
    }

    showCommands() {
        this.commandArea.classList.remove('hidden');
        this.answerArea.classList.add('hidden');
        this.isProcessing = false;
    }

    showAnswerInput() {
        this.commandArea.classList.add('hidden');
        this.answerArea.classList.remove('hidden');
        this.input.focus();
    }

    // --- プレイヤーの行動 ---

    startAttack() {
        if (this.isProcessing || this.turn !== 'player') return;
        this.generateProblem();
        this.showAnswerInput();
    }

    usePotion() {
        if (this.isProcessing || this.turn !== 'player') return;
        if (state.playerData.inventory.potion > 0) {
            this.isProcessing = true;
            state.playerData.inventory.potion--;
            const healAmount = 30;
            state.playerData.hp = Math.min(state.playerData.maxHp, state.playerData.hp + healAmount);
            this.msgBox.textContent = `ポーションを使った！ HPが${healAmount}回復した。(残り: ${state.playerData.inventory.potion})`;
            this.updateUi();
            setTimeout(() => this.enemyTurn(), 1500);
        } else {
            this.msgBox.textContent = "ポーションを持っていない！";
        }
    }

    generateProblem() {
        const chapter = state.playerData.chapter || 1;
        switch (chapter) {
            case 1:  this._genCh1(); break;
            // Ch2〜7 は今後追加
            default: this._genCh1(); break;
        }
        this.msgBox.textContent = this.currentProblem.q;
        this.input.value = "";
    }

    // --- Ch1: 正負の数（加減乗除） ---
    _genCh1() {
        const type = Math.random();
        if (type < 0.3) {
            // 加算: a + b（a,b は -10〜10）
            const a = Math.floor(Math.random() * 21) - 10;
            const b = Math.floor(Math.random() * 21) - 10;
            const fb = b < 0 ? `(${b})` : b;
            this.currentProblem.q = `問題: ${a} + ${fb} = ?`;
            this.currentProblem.a = a + b;
        } else if (type < 0.6) {
            // 減算: a - b
            const a = Math.floor(Math.random() * 21) - 10;
            const b = Math.floor(Math.random() * 21) - 10;
            const fb = b < 0 ? `(${b})` : b;
            this.currentProblem.q = `問題: ${a} - ${fb} = ?`;
            this.currentProblem.a = a - b;
        } else if (type < 0.8) {
            // 乗算: a × b（a,b は -5〜5）
            const a = Math.floor(Math.random() * 11) - 5;
            const b = Math.floor(Math.random() * 11) - 5;
            const fb = b < 0 ? `(${b})` : b;
            this.currentProblem.q = `問題: ${a} × ${fb} = ?`;
            this.currentProblem.a = a * b;
        } else {
            // 除算: a ÷ b（b≠0、割り切れる組み合わせ）
            let b = 0;
            while (b === 0) b = Math.floor(Math.random() * 9) - 4; // -4〜4 (0除外)
            const answer = Math.floor(Math.random() * 11) - 5;     // -5〜5
            const a = answer * b;
            const fb = b < 0 ? `(${b})` : b;
            this.currentProblem.q = `問題: ${a} ÷ ${fb} = ?`;
            this.currentProblem.a = answer;
        }
    }

    checkAnswer() {
        if (!this.active || this.isProcessing || this.input.value === "") return;
        this.isProcessing = true;

        const userAnswer = parseInt(this.input.value);
        if (userAnswer === this.currentProblem.a) {
            // コンボカウント加算
            this.comboCount++;

            // コンボ倍率計算
            let comboMult = 1.0;
            let comboLabel = "";
            if (this.comboCount >= 5) {
                comboMult = 2.0;
                comboLabel = "スーパーコンボ！";
            } else if (this.comboCount >= 3) {
                comboMult = 1.5;
                comboLabel = "コンボ！";
            }

            const baseDamage = Math.max(1, getPlayerAtk() - this.enemy.def);
            const damage = Math.floor(baseDamage * comboMult);
            this.enemyHp -= damage;

            // メッセージ組み立て
            let msg = `正解！ 敵に${damage}のダメージ！`;
            if (comboMult > 1) msg += ` (${comboMult}倍)`;
            this.msgBox.textContent = msg;

            // 演出: 正解フラッシュ（緑）
            this.flashScreen('correct');
            // 演出: ダメージポップアップ（敵側）
            this.showDamagePopup(damage, 'enemy');
            // 演出: コンボ表示
            if (this.comboCount >= 3) {
                this.showComboPopup(this.comboCount, comboLabel);
            }

            // ボスフェーズ2移行チェック
            if (this.enemy.isBoss && !this.isPhase2
                && this.enemyHp <= this.enemyMaxHp * this.enemy.phaseThreshold) {
                this.isPhase2 = true;
                setTimeout(() => {
                    this.msgBox.textContent = `${this.enemy.name}が激怒した！ 攻撃力が上がった！`;
                }, 800);
            }
        } else {
            // コンボリセット
            this.comboCount = 0;
            this.msgBox.textContent = `残念！ 不正解...ミス！ (正解は ${this.currentProblem.a})`;
            // 演出: 不正解フラッシュ（赤）
            this.flashScreen('incorrect');
        }

        this.updateUi();
        setTimeout(() => {
            if (this.enemyHp <= 0) {
                this.win();
            } else {
                this.enemyTurn();
            }
        }, 1500);
    }

    // --- バトル演出メソッド ---

    /** 正解/不正解フラッシュ */
    flashScreen(type) {
        const cls = type === 'correct' ? 'battle-flash-correct' : 'battle-flash-incorrect';
        this.screen.classList.add(cls);
        setTimeout(() => this.screen.classList.remove(cls), 400);
    }

    /** ダメージ数字ポップアップ */
    showDamagePopup(amount, target) {
        const popup = document.createElement('div');
        popup.className = `damage-popup damage-popup-${target}`;
        popup.textContent = `-${amount}`;
        this.screen.appendChild(popup);
        // アニメーション終了後に削除
        popup.addEventListener('animationend', () => popup.remove());
    }

    /** コンボ表示ポップアップ */
    showComboPopup(count, label) {
        // 既存のコンボ表示を除去
        const old = this.screen.querySelector('.combo-popup');
        if (old) old.remove();

        const popup = document.createElement('div');
        popup.className = 'combo-popup';
        popup.textContent = `${count} ${label}`;
        this.screen.appendChild(popup);
        popup.addEventListener('animationend', () => popup.remove());
    }

    // --- 敵の行動 ---

    enemyTurn() {
        if (!this.active) return;
        this.turn = 'enemy';
        this.isProcessing = true;
        this.answerArea.classList.add('hidden');
        this.commandArea.classList.add('hidden');
        this.msgBox.textContent = `${this.enemy.name}の攻撃！`;

        setTimeout(() => {
            let rawAtk = this.enemy.atk;
            if (this.enemy.isBoss && this.isPhase2) {
                rawAtk = Math.floor(rawAtk * this.enemy.phase2AtkMultiplier);
            }
            const damage = Math.max(1, rawAtk - getPlayerDef());
            state.playerData.hp = Math.max(0, state.playerData.hp - damage);
            this.msgBox.textContent = `プレイヤーは${damage}のダメージを受けた！`;
            // 演出: ダメージポップアップ（プレイヤー側）
            this.showDamagePopup(damage, 'player');
            this.updateUi();

            setTimeout(() => {
                if (state.playerData.hp <= 0) {
                    this.lose();
                } else {
                    this.turn = 'player';
                    this.showCommands();
                    this.msgBox.textContent = "どうする？";
                }
            }, 1500);
        }, 1000);
    }

    win() {
        this.active = false;
        if (this.enemy.isBoss) {
            const clearedChapter = state.playerData.chapter || 1;
            state.playerData.coins += this.enemy.coins;
            state.playerData.chapter = clearedChapter + 1;
            state.playerData.currentFragments = 0; // 欠片リセット（次章用）
            this.msgBox.textContent = `${this.enemy.name}を倒した！ コイン${this.enemy.coins}枚を手に入れた！`;
            setTimeout(() => {
                this.endBattle();
                if (engine) {
                    const scenes = CHAPTER_CLEAR_SCENES[clearedChapter] || [];
                    if (scenes.length > 0) {
                        engine.chapterClear.play(scenes, () => {
                            state.currentMapId = 'town';
                            engine.updateCanvasSize();
                            engine.player.x = 7 * TILE_SIZE;
                            engine.player.y = 2 * TILE_SIZE;
                        });
                    } else {
                        state.currentMapId = 'town';
                        engine.updateCanvasSize();
                        engine.player.x = 7 * TILE_SIZE;
                        engine.player.y = 2 * TILE_SIZE;
                    }
                }
            }, 2000);
        } else {
            state.playerData.coins += this.enemy.coins;
            const gotFragment = this.enemy.fragmentChance && Math.random() < this.enemy.fragmentChance;
            if (gotFragment) {
                state.playerData.currentFragments++;
                this.msgBox.textContent = `勝利！ コイン${this.enemy.coins}枚と欠片1つを入手！ (${state.playerData.currentFragments}/${state.playerData.requiredFragments})`;
            } else {
                this.msgBox.textContent = `勝利！ コイン${this.enemy.coins}枚を入手。欠片は落とさなかった… (${state.playerData.currentFragments}/${state.playerData.requiredFragments})`;
            }
            setTimeout(() => this.endBattle(), 2000);
        }
    }

    lose() {
        this.active = false;
        this.msgBox.textContent = "敗北した...";
        setTimeout(() => {
            // HP を30%で復活
            state.playerData.hp = Math.floor(state.playerData.maxHp * 0.3);

            // 今回のダンジョンで得たコイン・欠片を失う
            const lostCoins     = state.playerData.coins - state.dungeonEntry.coins;
            const lostFragments = state.playerData.currentFragments - state.dungeonEntry.fragments;
            state.playerData.coins             = state.dungeonEntry.coins;
            state.playerData.currentFragments  = state.dungeonEntry.fragments;

            // ロスト内容に応じてメッセージを組み立てる
            const lossParts = [];
            if (lostCoins > 0)     lossParts.push(`コイン${lostCoins}枚`);
            if (lostFragments > 0) lossParts.push(`欠片${lostFragments}個`);
            const lossMsg = lossParts.length > 0
                ? `\n今回の探索で得た${lossParts.join('と')}を失った…`
                : '';

            state.currentMapId = 'town';
            if (engine) {
                engine.updateCanvasSize();
                engine.player.x = 7 * TILE_SIZE;
                engine.player.y = 2 * TILE_SIZE;
                this.endBattle();
                engine.showMessage(`倒れてしまった…\n村に戻り、体を休めよう。${lossMsg}`);
            } else {
                this.endBattle();
            }
        }, 2000);
    }

    endBattle() {
        this.active = false;
        this.isProcessing = false;
        this._clearPopups();
        this.screen.classList.add('hidden');
        state.isEventActive = false;
        if (engine && engine.input) engine.input.reset();
    }

    /** ダメージ・コンボポップアップを全て削除 */
    _clearPopups() {
        this.screen.querySelectorAll('.damage-popup, .combo-popup').forEach(el => el.remove());
    }
}

// --- シンボルエンカウント 敵エンティティ ---

class EnemySymbol {
    constructor(col, row, key) {
        this.col = col;
        this.row = row;
        this.key = key;
        this.alive = true;
        this.moveTimer = 0;
        this.moveInterval = 45;  // フレーム間隔（60fps で約0.75秒）
        this.detectRange = 4.5;  // 検知半径（タイル数・ユークリッド距離）
        this.isChasing = false;
        this.exclamTimer = 0;    // 「！」表示カウンタ
        // アニメーション
        this.frameX = 0;
        this.frameCount = 0;
        this.animSpeed = 20;     // 20フレームごとに次のコマへ
        this.direction = 0;      // 0:下, 1:左, 2:右（スプライトシートの行）
    }

    update(playerCol, playerRow, mapData) {
        if (!this.alive) return;

        // 「！」タイマーをカウントダウン
        if (this.exclamTimer > 0) this.exclamTimer--;

        // 移動インターバル待機
        this.moveTimer++;
        if (this.moveTimer < this.moveInterval) return;
        this.moveTimer = 0;

        const dx = playerCol - this.col;
        const dy = playerRow - this.row;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist <= this.detectRange) {
            // 検知範囲内 → 追跡
            if (!this.isChasing) {
                this.isChasing = true;
                this.exclamTimer = 60; // 「！」を約1秒表示
            }
            this.chasePlayer(dx, dy, mapData);
        } else {
            // 範囲外 → ランダム徘徊（60%の確率で移動）
            this.isChasing = false;
            if (Math.random() < 0.6) this.wander(mapData);
        }
    }

    chasePlayer(dx, dy, mapData) {
        // 差が大きい軸を優先して1タイル移動。塞がれていれば逆軸を試みる
        let moved = false;
        if (Math.abs(dx) >= Math.abs(dy)) {
            moved = this.tryMove(Math.sign(dx), 0, mapData);
            if (!moved && dy !== 0) moved = this.tryMove(0, Math.sign(dy), mapData);
        } else {
            moved = this.tryMove(0, Math.sign(dy), mapData);
            if (!moved && dx !== 0) moved = this.tryMove(Math.sign(dx), 0, mapData);
        }
    }

    wander(mapData) {
        // 4方向をシャッフルして通れる方向へ1タイル移動
        const dirs = [[0,-1],[0,1],[-1,0],[1,0]];
        for (let i = dirs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [dirs[i], dirs[j]] = [dirs[j], dirs[i]];
        }
        for (const [dc, dr] of dirs) {
            if (this.tryMove(dc, dr, mapData)) break;
        }
    }

    tryMove(dc, dr, mapData) {
        const newCol = this.col + dc;
        const newRow = this.row + dr;
        if (this.canMoveToTile(newCol, newRow, mapData)) {
            this.col = newCol;
            this.row = newRow;
            // 向きを更新（スプライトシート行に対応）
            if (dc < 0) this.direction = 1;       // 左
            else if (dc > 0) this.direction = 2;   // 右
            else this.direction = 0;               // 上下はどちらも 下向き（行0）
            return true;
        }
        return false;
    }

    canMoveToTile(col, row, mapData) {
        if (row < 0 || row >= mapData.length || col < 0 || col >= mapData[0].length) return false;
        if (mapData[row][col] !== 0) return false;
        // 他の生存敵と重複しない
        return !state.floorEnemies.some(e => e.alive && e !== this && e.col === col && e.row === row);
    }

    draw(ctx) {
        if (!this.alive) return;
        const x = this.col * TILE_SIZE;
        const y = this.row * TILE_SIZE;

        // アニメーションフレームを進める
        this.frameCount++;
        if (this.frameCount >= this.animSpeed) {
            this.frameX = (this.frameX + 1) % 3;  // 0→1→2→0
            this.frameCount = 0;
        }

        // Tier別スプライトシートを選択
        const tier = ENEMY_DATA[this.key]?.symbolTier || 1;
        const TIER_IMGS = {
            1: state.assets.symbolWeak,
            2: state.assets.symbolMedium,
            3: state.assets.symbolStrong,
        };
        const img = TIER_IMGS[tier] || state.assets.symbolWeak;
        ctx.drawImage(img,
            this.frameX * TILE_SIZE, this.direction * TILE_SIZE,
            TILE_SIZE, TILE_SIZE,
            x, y, TILE_SIZE, TILE_SIZE
        );

        // 「！」マーカー（検知直後に表示）
        if (this.exclamTimer > 0) {
            ctx.save();
            ctx.font = 'bold 13px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.strokeText('！', x + TILE_SIZE / 2, y);
            ctx.fillStyle = '#ffff00';
            ctx.fillText('！', x + TILE_SIZE / 2, y);
            ctx.restore();
        }
    }
}

// --- プロシージャル ダンジョン生成 ---

class DungeonGenerator {
    constructor(config) {
        this.cols         = config.cols;
        this.rows         = config.rows;
        this.roomCount    = config.roomCount;
        this.enemyTypes   = config.enemyTypes;
        this.enemyPerRoom = config.enemyPerRoom; // [min, max]
        this.hasMerchant  = config.hasMerchant;
    }

    generate() {
        const data = Array.from({ length: this.rows }, () => new Array(this.cols).fill(7));
        const rooms = this._placeRooms(data);

        // 部屋が2つ未満なら緊急フォールバック（通常は発生しない）
        if (rooms.length < 2) {
            console.warn('[DungeonGenerator] 部屋の配置に失敗。フォールバック使用。');
            for (let r = 1; r < this.rows - 1; r++)
                for (let c = 1; c < this.cols - 1; c++)
                    data[r][c] = 0;
            data[this.rows - 2][this.cols - 2] = 10;
            return {
                data,
                enemySpawns: [{ col: 3, row: 3, key: this.enemyTypes[0] }],
                spawnPixelX: TILE_SIZE,
                spawnPixelY: TILE_SIZE
            };
        }

        this._connectAllRooms(data, rooms);
        return this._placeFeatures(data, rooms);
    }

    _placeRooms(data) {
        const rooms = [];
        const MIN_W = 4, MAX_W = 8;
        const MIN_H = 3, MAX_H = 6;
        const PAD   = 2; // 部屋間の最小空白タイル数

        for (let attempt = 0; attempt < this.roomCount * 10 && rooms.length < this.roomCount; attempt++) {
            const rw = MIN_W + Math.floor(Math.random() * (MAX_W - MIN_W + 1));
            const rh = MIN_H + Math.floor(Math.random() * (MAX_H - MIN_H + 1));
            const rx = 1 + Math.floor(Math.random() * (this.cols - rw - 2));
            const ry = 1 + Math.floor(Math.random() * (this.rows - rh - 2));

            // 重複チェック（パディング込み）
            const overlaps = rooms.some(r =>
                rx < r.x + r.w + PAD && rx + rw + PAD > r.x &&
                ry < r.y + r.h + PAD && ry + rh + PAD > r.y
            );
            if (!overlaps) {
                rooms.push({ x: rx, y: ry, w: rw, h: rh });
                for (let row = ry; row < ry + rh; row++)
                    for (let col = rx; col < rx + rw; col++)
                        data[row][col] = 0;
            }
        }
        return rooms;
    }

    _connectAllRooms(data, rooms) {
        if (rooms.length < 2) return;
        // Prim 風 MST: 常に最近傍の未接続部屋を繋ぐ
        const connected = new Set([0]);
        while (connected.size < rooms.length) {
            let bestDist = Infinity, bestFrom = 0, bestTo = 1;
            for (const fi of connected) {
                for (let ti = 0; ti < rooms.length; ti++) {
                    if (connected.has(ti)) continue;
                    const d = this._manDist(rooms[fi], rooms[ti]);
                    if (d < bestDist) { bestDist = d; bestFrom = fi; bestTo = ti; }
                }
            }
            const r1 = rooms[bestFrom], r2 = rooms[bestTo];
            this._drunkardWalk(
                data,
                Math.floor(r1.x + r1.w / 2), Math.floor(r1.y + r1.h / 2),
                Math.floor(r2.x + r2.w / 2), Math.floor(r2.y + r2.h / 2)
            );
            connected.add(bestTo);
        }
    }

    _manDist(r1, r2) {
        return Math.abs(r1.x + r1.w / 2 - r2.x - r2.w / 2) +
               Math.abs(r1.y + r1.h / 2 - r2.y - r2.h / 2);
    }

    _drunkardWalk(data, x1, y1, x2, y2) {
        let cx = x1, cy = y1;
        const maxSteps = (Math.abs(x2 - x1) + Math.abs(y2 - y1)) * 4 + 20;
        for (let step = 0; step < maxSteps; step++) {
            cx = Math.max(1, Math.min(this.cols - 2, cx));
            cy = Math.max(1, Math.min(this.rows - 2, cy));
            data[cy][cx] = 0;
            if (cx === x2 && cy === y2) break;
            if (Math.random() < 0.7) {
                // 70%: ターゲット方向へバイアス（主軸優先）
                const dx = x2 - cx, dy = y2 - cy;
                if (Math.abs(dx) >= Math.abs(dy)) cx += Math.sign(dx);
                else cy += Math.sign(dy);
            } else {
                // 30%: ランダムな4方向
                const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
                const [dc, dr] = dirs[Math.floor(Math.random() * 4)];
                cx += dc; cy += dr;
            }
        }
        // ループ後も終点に確実に到達させる
        while (cx !== x2) { cx += Math.sign(x2 - cx); cx = Math.max(1, Math.min(this.cols - 2, cx)); data[cy][cx] = 0; }
        while (cy !== y2) { cy += Math.sign(y2 - cy); cy = Math.max(1, Math.min(this.rows - 2, cy)); data[cy][cx] = 0; }
    }

    _placeFeatures(data, rooms) {
        // 商人部屋（F1のみ、rooms が3つ以上の場合に room[1] を使用）
        const merchantRoomIdx = (this.hasMerchant && rooms.length >= 3) ? 1 : -1;

        // 出口部屋: スポーンから最も遠い部屋（商人部屋を除く）
        let exitRoomIdx = -1, maxDist = -1;
        for (let i = 1; i < rooms.length; i++) {
            if (i === merchantRoomIdx) continue;
            const d = this._manDist(rooms[0], rooms[i]);
            if (d > maxDist) { maxDist = d; exitRoomIdx = i; }
        }
        if (exitRoomIdx === -1) exitRoomIdx = rooms.length - 1; // フォールバック

        // 商人タイル配置 (tileId=2)
        if (merchantRoomIdx !== -1) {
            const mr = rooms[merchantRoomIdx];
            data[Math.floor(mr.y + mr.h / 2)][Math.floor(mr.x + mr.w / 2)] = 2;
        }

        // 下り階段を出口部屋の中央に配置 (tileId=10)
        const er = rooms[exitRoomIdx];
        data[Math.floor(er.y + er.h / 2)][Math.floor(er.x + er.w / 2)] = 10;

        // 宝箱配置（スポーン部屋・商人部屋・出口部屋を除く通常部屋に1〜2個保証）
        const eligibleRooms = [];
        for (let i = 0; i < rooms.length; i++) {
            if (i === 0 || i === merchantRoomIdx || i === exitRoomIdx) continue;
            eligibleRooms.push(rooms[i]);
        }
        // eligible部屋をシャッフルし、先頭から最大2個（1部屋に1個）配置
        for (let i = eligibleRooms.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [eligibleRooms[i], eligibleRooms[j]] = [eligibleRooms[j], eligibleRooms[i]];
        }
        const chestCount = eligibleRooms.length === 0 ? 0
            : eligibleRooms.length === 1 ? 1
            : 1 + Math.floor(Math.random() * 2); // 1〜2個
        for (let k = 0; k < Math.min(chestCount, eligibleRooms.length); k++) {
            const room = eligibleRooms[k];
            const cx = room.x + 1 + Math.floor(Math.random() * Math.max(1, room.w - 2));
            const cy = room.y + 1 + Math.floor(Math.random() * Math.max(1, room.h - 2));
            if (data[cy] && data[cy][cx] === 0) {
                data[cy][cx] = 12; // 宝箱
            }
        }

        // 敵配置（スポーン部屋・商人部屋・出口部屋は除く）
        const enemySpawns = [];
        for (let i = 0; i < rooms.length; i++) {
            if (i === 0 || i === merchantRoomIdx || i === exitRoomIdx) continue;
            const room = rooms[i];
            // この部屋の床タイル一覧を収集
            const floorTiles = [];
            for (let r = room.y; r < room.y + room.h; r++)
                for (let c = room.x; c < room.x + room.w; c++)
                    if (data[r][c] === 0) floorTiles.push({ col: c, row: r });
            // シャッフル（Fisher-Yates）
            for (let k = floorTiles.length - 1; k > 0; k--) {
                const j = Math.floor(Math.random() * (k + 1));
                [floorTiles[k], floorTiles[j]] = [floorTiles[j], floorTiles[k]];
            }
            const count = this.enemyPerRoom[0]
                + Math.floor(Math.random() * (this.enemyPerRoom[1] - this.enemyPerRoom[0] + 1));
            const toPlace = Math.min(count, floorTiles.length);
            for (let k = 0; k < toPlace; k++) {
                const key = this.enemyTypes[Math.floor(Math.random() * this.enemyTypes.length)];
                enemySpawns.push({ col: floorTiles[k].col, row: floorTiles[k].row, key });
            }
        }

        // スポーン座標: room[0] の左上から1タイル内側（確実に床タイル）
        const spawnPixelX = (rooms[0].x + 1) * TILE_SIZE;
        const spawnPixelY = (rooms[0].y + 1) * TILE_SIZE;
        return { data, enemySpawns, spawnPixelX, spawnPixelY };
    }
}

// --- ショップ管理 ---

class ShopManager {
    constructor() {
        this.screen = document.getElementById('shop-screen');
        this.messageEl = document.getElementById('shop-message');
        this.itemList = document.getElementById('shop-item-list');
        document.getElementById('shop-close-btn').addEventListener('click', () => this.close());
    }

    open() {
        state.isEventActive = true;
        this.render();
        this.screen.classList.remove('hidden');
    }

    close() {
        this.screen.classList.add('hidden');
        state.isEventActive = false;
        if (engine && engine.input) engine.input.reset();
    }

    render() {
        const pd = state.playerData;
        this.messageEl.textContent = `所持コイン: ${pd.coins} 枚`;
        this.itemList.innerHTML = '';

        SHOP_ITEMS.forEach(item => {
            const isEquipped = (item.type === 'weapon' && pd.equipment.weapon === item.id)
                            || (item.type === 'armor'  && pd.equipment.armor  === item.id);
            const canAfford = pd.coins >= item.price;

            const li = document.createElement('li');
            li.className = 'shop-item' + (isEquipped ? ' equipped' : '');
            const badge = isEquipped ? '<span class="item-badge">[装備中]</span>' : '';
            li.innerHTML = `
                <span class="item-name">${item.name}${badge}</span>
                <span class="item-desc">${item.description}</span>
                <span class="item-price">${item.price}G</span>
                <button class="shop-buy-btn" ${canAfford ? '' : 'disabled'}>買う</button>
            `;
            li.querySelector('.shop-buy-btn').addEventListener('click', () => this.buy(item.id));
            this.itemList.appendChild(li);
        });
    }

    buy(itemId) {
        const item = SHOP_ITEMS.find(i => i.id === itemId);
        if (!item) return;
        const pd = state.playerData;
        if (pd.coins < item.price) {
            this.messageEl.textContent = 'コインが足りない！';
            return;
        }
        pd.coins -= item.price;
        if (item.type === 'weapon') {
            pd.equipment.weapon = item.id;
            this.messageEl.textContent = `${item.name}を装備した！`;
        } else if (item.type === 'armor') {
            pd.equipment.armor = item.id;
            this.messageEl.textContent = `${item.name}を装備した！`;
        } else if (item.type === 'consumable') {
            pd.inventory.potion = (pd.inventory.potion || 0) + 1;
            this.messageEl.textContent = `ポーションを買った！ (残り: ${pd.inventory.potion})`;
        }
        this.render();
    }
}

// --- ゲームエンジン ---

class InputHandler {
    constructor() {
        this.keys = {};
        window.addEventListener('keydown', e => {
            // メッセージウィンドウ表示中の最優先処理
            const msgWin = document.getElementById('message-window');
            if (msgWin && msgWin.style.display === 'block') {
                if (e.key === 'Enter' || e.key === ' ') {
                    if (engine) engine.closeMessage();
                }
                return; // 他のキー入力を無効化
            }

            // Mキー → ステータス画面トグル
            if (e.key === 'm' || e.key === 'M') {
                if (engine) engine.toggleStatusScreen();
                return;
            }

            this.keys[e.key] = true;
            // 決定キー入力のトリガー
            if (e.key === 'Enter' || e.key === ' ') {
                if (engine) engine.onInteractionKey();
            }
        });
        window.addEventListener('keyup', e => this.keys[e.key] = false);
        // ブラウザのフォーカスが外れた際（アラート表示時など）にキー状態をリセット
        window.addEventListener('blur', () => this.reset());
    }

    isPressed(key) {
        return !!this.keys[key];
    }

    reset() {
        this.keys = {};
    }
}

class Player {
    constructor() {
        this.x = 400; // 初期位置
        this.y = 300;
        this.speed = 2;
        this.direction = 0; // 0:下, 1:左, 2:右, 3:上
        this.animPattern = [0, 1, 2, 1];
        this.animCounter = 0;
        this.frameX = 1;
        this.frameCount = 0;
        this.animSpeed = 10;

    }

    canMoveTo(nx, ny) {
        const mapData = MAPS[state.currentMapId].data;
        const M = 3; // 壁めり込み防止マージン（px）

        // スプライトの4隅をチェック（中心点のみだとめり込みが発生するため）
        const corners = [
            [nx + M,             ny + M            ],  // 左上
            [nx + TILE_SIZE - M, ny + M            ],  // 右上
            [nx + M,             ny + TILE_SIZE - M],  // 左下
            [nx + TILE_SIZE - M, ny + TILE_SIZE - M],  // 右下
        ];

        for (const [cx, cy] of corners) {
            // キャンバス境界チェック
            if (cx < 0 || cx >= this.canvas.width || cy < 0 || cy >= this.canvas.height) return false;

            const col = Math.floor(cx / TILE_SIZE);
            const row = Math.floor(cy / TILE_SIZE);
            if (row < 0 || row >= mapData.length || col < 0 || col >= mapData[0].length) return false;

            const tileId = mapData[row][col];
            // 通行可能タイル判定（マップ種別ごと）
            // tileId 12（宝箱）・13（空箱）は常に通行不可（向いて Enter で調べる）
            let passable;
            if (state.currentMapId === 'town') {
                passable = tileId === 0 || tileId === 5 || tileId === 8;
            } else if (state.currentMapId === 'library') {
                passable = tileId === 0 || tileId === 6;
            } else {
                passable = tileId === 0 || tileId === 6 || tileId === 10 || tileId === 11;
            }
            if (!passable) return false;
        }
        return true;
    }

    update(input) {
        if (state.isEventActive) return;

        let moving = false;
        let nextX = this.x;
        let nextY = this.y;

        if (input.isPressed('ArrowUp') || input.isPressed('w')) {
            nextY -= this.speed;
            this.direction = 3;
            moving = true;
        } else if (input.isPressed('ArrowDown') || input.isPressed('s')) {
            nextY += this.speed;
            this.direction = 0;
            moving = true;
        } else if (input.isPressed('ArrowLeft') || input.isPressed('a')) {
            nextX -= this.speed;
            this.direction = 1;
            moving = true;
        } else if (input.isPressed('ArrowRight') || input.isPressed('d')) {
            nextX += this.speed;
            this.direction = 2;
            moving = true;
        }

        // コリジョン判定 (0:草原, 4:ワープ 以外は通行不可)
        if (this.canMoveTo(nextX, this.y)) {
            this.x = nextX;
        } else {
            moving = false; // 移動できなかった場合はアニメーションも停止
        }

        if (this.canMoveTo(this.x, nextY)) {
            this.y = nextY;
        } else {
            moving = false;
        }

        // アニメーション
        if (moving) {
            this.frameCount++;
            if (this.frameCount >= this.animSpeed) {
                this.animCounter++;
                this.frameX = this.animPattern[this.animCounter % this.animPattern.length];
                this.frameCount = 0;
            }
        } else {
            this.frameX = 1;
            this.animCounter = 0;
        }
    }

    draw(ctx) {
        ctx.drawImage(
            state.assets.player,
            this.frameX * TILE_SIZE, this.direction * TILE_SIZE,
            TILE_SIZE, TILE_SIZE,
            this.x, this.y,
            TILE_SIZE, TILE_SIZE
        );
    }
}

class GameEngine {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.input = new InputHandler();
        this.player = new Player();
        this.player.canvas = this.canvas;
        this.battle = new BattleManager();
        this.shop = new ShopManager();
        this.chapterClear = new ChapterClearScene();
        this._pendingCallback = null;
        this.fogCanvas = null;  // フォグオブウォー用オフスクリーンキャンバス
        this.fogCtx = null;
    }

    updateCanvasSize() {
        const currentMap = MAPS[state.currentMapId];
        const rows = currentMap.data.length;
        const cols = currentMap.data[0].length;
        this.canvas.width = cols * TILE_SIZE;
        this.canvas.height = rows * TILE_SIZE;
    }

    start() {
        this.updateCanvasSize();
        this.loop();
    }

    loop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    }

    update() {
        if (!state.gameStarted || state.isEventActive) return;
        this.player.update(this.input);
        this.checkEnemyContact();
        this.updateEnemies();
        this.checkMapWarps();
    }

    // 各フロアの敵を MAPS[mapId].enemySpawns から初期化
    initFloorEnemies(mapId) {
        const spawns = (MAPS[mapId] && MAPS[mapId].enemySpawns) || [];
        state.floorEnemies = spawns.map(s => new EnemySymbol(s.col, s.row, s.key));
    }

    // 全敵を更新し、移動後にも接触判定
    updateEnemies() {
        if (state.floorEnemies.length === 0) return;
        const playerCol = Math.floor((this.player.x + TILE_SIZE / 2) / TILE_SIZE);
        const playerRow = Math.floor((this.player.y + TILE_SIZE / 2) / TILE_SIZE);
        const mapData = MAPS[state.currentMapId].data;
        for (const enemy of state.floorEnemies) {
            enemy.update(playerCol, playerRow, mapData);
        }
        this.checkEnemyContact();
    }

    // プレイヤーと敵の同タイル接触を検出 → バトル開始
    checkEnemyContact() {
        if (state.isEventActive) return;
        const playerCol = Math.floor((this.player.x + TILE_SIZE / 2) / TILE_SIZE);
        const playerRow = Math.floor((this.player.y + TILE_SIZE / 2) / TILE_SIZE);
        for (const enemy of state.floorEnemies) {
            if (enemy.alive && enemy.col === playerCol && enemy.row === playerRow) {
                enemy.alive = false;
                this.battle.start(enemy.key);
                return;
            }
        }
    }

    checkMapWarps() {
        const col = Math.floor((this.player.x + TILE_SIZE / 2) / TILE_SIZE);
        const row = Math.floor((this.player.y + TILE_SIZE / 2) / TILE_SIZE);
        const mapData = MAPS[state.currentMapId].data;

        if (row >= 0 && row < mapData.length && col >= 0 && col < mapData[0].length) {
            const tileId = mapData[row][col];
            if (state.currentMapId === 'town' && tileId === 5) {
                // ダンジョン入場時のコイン・欠片を記録（死亡時ロスト基準）
                state.dungeonEntry.coins     = state.playerData.coins;
                state.dungeonEntry.fragments = state.playerData.currentFragments;
                this.warpToFloor('dungeon1_f1');            // 街→1F（毎回新規生成）
            } else if (state.currentMapId === 'dungeon1_f1' && tileId === 6) {
                this.warpTo('town', 7 * TILE_SIZE, 1 * TILE_SIZE);  // 1F出口→街
            } else if (state.currentMapId === 'dungeon1_f1' && tileId === 10) {
                this.warpToFloor('dungeon1_f2');            // 1F↓→2F（新規生成）
            } else if (state.currentMapId === 'dungeon1_f2' && tileId === 11) {
                this.warpToFloor('dungeon1_f1');            // 2F↑→1F（再生成）
            } else if (state.currentMapId === 'dungeon1_f2' && tileId === 10) {
                this.warpToFloor('dungeon1_f3');            // 2F↓→3F（新規生成）
            } else if (state.currentMapId === 'dungeon1_f3' && tileId === 11) {
                this.warpToFloor('dungeon1_f2');            // 3F↑→2F（再生成）
            } else if (state.currentMapId === 'dungeon1_f3' && tileId === 10) {
                this.warpTo('dungeon1_f4', 4 * TILE_SIZE, 1 * TILE_SIZE);  // 3F↓→4F（静的）
            } else if (state.currentMapId === 'dungeon1_f4' && tileId === 11) {
                this.warpToFloor('dungeon1_f3');            // 4F↑→3F（再生成）
            } else if (state.currentMapId === 'town' && tileId === 8) {
                this.warpTo('library', 7 * TILE_SIZE, 6 * TILE_SIZE);
            } else if (state.currentMapId === 'library' && tileId === 6) {
                this.warpTo('town', 12 * TILE_SIZE, 3 * TILE_SIZE);
            } else if (state.currentMapId === 'boss_room' && tileId === 6) {
                this.warpTo('town', 7 * TILE_SIZE, 1 * TILE_SIZE);
            }
        }
    }

    warpTo(mapId, startX, startY) {
        state.isEventActive = true;
        state.currentMapId = mapId;
        this.updateCanvasSize();
        this.player.x = startX;
        this.player.y = startY;
        if (this.input) this.input.reset();
        this.initFloorEnemies(mapId); // フロアの敵をリポップ

        const map = MAPS[mapId];
        if (map.bossOnEnter && !state.bossRoomEntered) {
            state.bossRoomEntered = true;
            this.showMessageWithCallback(
                `${map.name}に足を踏み入れた…\n${ENEMY_DATA[map.bossOnEnter].name}が現れた！`,
                () => { if (this.battle) this.battle.start(map.bossOnEnter); }
            );
        } else {
            this.showMessage(`${map.name} へ移動します…`);
        }
    }

    // フロアを新規生成してワープ（ローグライク式：入るたびに再生成）
    warpToFloor(mapId) {
        const config = DUNGEON_CONFIGS[mapId];
        if (!config) {
            // DUNGEON_CONFIGS に登録されていない（静的マップ）は通常 warpTo へ
            this.warpTo(mapId, TILE_SIZE, TILE_SIZE);
            return;
        }

        // 新しいフロアを生成
        const gen = new DungeonGenerator(config);
        const result = gen.generate();

        // スポーン位置に隣接するタイルに出口 / 上り階段を配置
        const spawnCol = Math.floor(result.spawnPixelX / TILE_SIZE);
        const spawnRow = Math.floor(result.spawnPixelY / TILE_SIZE);
        const adjOffsets = [[0, -1], [0, 1], [-1, 0], [1, 0]]; // 上/下/左/右の順

        if (config.hasExit) {
            // tileId=6: 街への帰還口（F1のみ）
            for (const [dc, dr] of adjOffsets) {
                const nc = spawnCol + dc, nr = spawnRow + dr;
                if (nr >= 0 && nr < result.data.length && nc >= 0 && nc < result.data[0].length
                    && result.data[nr][nc] === 0) {
                    result.data[nr][nc] = 6;
                    break;
                }
            }
        }
        if (config.hasStairsUp) {
            // tileId=11: 上り階段（F2, F3）
            for (const [dc, dr] of adjOffsets) {
                const nc = spawnCol + dc, nr = spawnRow + dr;
                if (nr >= 0 && nr < result.data.length && nc >= 0 && nc < result.data[0].length
                    && result.data[nr][nc] === 0) {
                    result.data[nr][nc] = 11;
                    break;
                }
            }
        }

        // MAPS を更新してからワープ
        MAPS[mapId] = {
            name:           config.floorName,
            allowEncounter: false,
            enemySpawns:    result.enemySpawns,
            data:           result.data
        };
        this.warpTo(mapId, result.spawnPixelX, result.spawnPixelY);
    }

    draw() {
        if (!state.gameStarted) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const currentMap = MAPS[state.currentMapId];
        const mapData = currentMap.data;

        // 1. 背景レイヤー
        for (let row = 0; row < mapData.length; row++) {
            for (let col = 0; col < mapData[row].length; col++) {
                const x = col * TILE_SIZE;
                const y = row * TILE_SIZE;
                // 屋内の場合は床(mapchipの別箇所)、屋外は草
                if (state.currentMapId === 'library') {
                    this.ctx.fillStyle = '#2c3e50'; // 深い青灰色の床
                    this.ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
                } else {
                    this.ctx.drawImage(state.assets.mapchip, 0, 128, TILE_SIZE, TILE_SIZE, x, y, TILE_SIZE, TILE_SIZE);
                }
            }
        }

        // 2. オブジェクトレイヤー (重ね描き)
        for (let row = 0; row < mapData.length; row++) {
            for (let col = 0; col < mapData[row].length; col++) {
                const x = col * TILE_SIZE;
                const y = row * TILE_SIZE;
                const tileId = mapData[row][col];

                if (tileId === 1) {
                    // 巨大な扉 (2x2)
                    this.ctx.drawImage(state.assets.door, 0, 0, 130, 130, x, y, TILE_SIZE * 2, TILE_SIZE * 2);
                } else if (tileId === 2) {
                    // 商人
                    this.ctx.drawImage(state.assets.npc, 32, 0, TILE_SIZE, TILE_SIZE, x, y, TILE_SIZE, TILE_SIZE);
                } else if (tileId === 4) {
                    // 自宅/ベッド (赤茶色)
                    this.ctx.fillStyle = '#8b4513';
                    this.ctx.fillRect(x + 4, y + 4, TILE_SIZE - 8, TILE_SIZE - 8);
                } else if (tileId === 5) {
                    // ダンジョン入り口 (青)
                    this.ctx.fillStyle = 'blue';
                    this.ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
                } else if (tileId === 6) {
                    // 街への帰還口 (黄色)
                    this.ctx.fillStyle = 'yellow';
                    this.ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
                } else if (tileId === 7) {
                    // NPCの家 (灰色)
                    this.ctx.fillStyle = 'grey';
                    this.ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
                } else if (tileId === 8) {
                    // 図書館入口 (ドア風)
                    this.ctx.fillStyle = '#6e4b3b';
                    this.ctx.fillRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);
                } else if (tileId === 9) {
                    // 本棚 (屋内用)
                    this.ctx.fillStyle = '#4b2c20';
                    this.ctx.fillRect(x + 2, y, TILE_SIZE - 4, TILE_SIZE);
                    this.ctx.strokeStyle = '#d4af37';
                    this.ctx.beginPath();
                    this.ctx.moveTo(x + 6, y + 8); this.ctx.lineTo(x + TILE_SIZE - 6, y + 8);
                    this.ctx.moveTo(x + 6, y + 16); this.ctx.lineTo(x + TILE_SIZE - 6, y + 16);
                    this.ctx.stroke();
                } else if (tileId === 10) {
                    // 下り階段
                    this.ctx.fillStyle = '#553322';
                    this.ctx.fillRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);
                    this.ctx.fillStyle = '#ffcc44';
                    this.ctx.font = 'bold 16px monospace';
                    this.ctx.textBaseline = 'middle';
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText('▼', x + TILE_SIZE / 2, y + TILE_SIZE / 2);
                    this.ctx.textAlign = 'left';
                    this.ctx.textBaseline = 'top';
                } else if (tileId === 11) {
                    // 上り階段
                    this.ctx.fillStyle = '#553322';
                    this.ctx.fillRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);
                    this.ctx.fillStyle = '#44ccff';
                    this.ctx.font = 'bold 16px monospace';
                    this.ctx.textBaseline = 'middle';
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText('▲', x + TILE_SIZE / 2, y + TILE_SIZE / 2);
                    this.ctx.textAlign = 'left';
                    this.ctx.textBaseline = 'top';
                } else if (tileId === 12) {
                    // 宝箱（未開封）
                    const bx = x + 3, by = y + 6, bw = TILE_SIZE - 6, bh = TILE_SIZE - 10;
                    // 箱本体
                    this.ctx.fillStyle = '#7a4a10';
                    this.ctx.fillRect(bx, by + 6, bw, bh - 6);
                    // 蓋
                    this.ctx.fillStyle = '#a05c14';
                    this.ctx.fillRect(bx, by, bw, 8);
                    // 金の縁取り
                    this.ctx.strokeStyle = '#ffd700';
                    this.ctx.lineWidth = 1.5;
                    this.ctx.strokeRect(bx, by, bw, bh);
                    // 中央の錠前
                    this.ctx.fillStyle = '#ffd700';
                    this.ctx.fillRect(bx + bw / 2 - 3, by + bh / 2 - 3, 6, 6);
                    this.ctx.lineWidth = 1;
                } else if (tileId === 13) {
                    // 空箱（開封済み）
                    const bx = x + 3, by = y + 6, bw = TILE_SIZE - 6, bh = TILE_SIZE - 10;
                    // 箱本体（暗め）
                    this.ctx.fillStyle = '#3a2008';
                    this.ctx.fillRect(bx, by + 6, bw, bh - 6);
                    // 蓋（開いた状態：上にずらして描画）
                    this.ctx.fillStyle = '#5a3010';
                    this.ctx.fillRect(bx, by - 4, bw, 7);
                    // くすんだ縁取り
                    this.ctx.strokeStyle = '#886622';
                    this.ctx.lineWidth = 1.5;
                    this.ctx.strokeRect(bx, by, bw, bh);
                    this.ctx.lineWidth = 1;
                }
            }
        }

        // 2.5 敵シンボル描画（プレイヤーの下レイヤー）
        for (const enemy of state.floorEnemies) {
            enemy.draw(this.ctx);
        }

        // 3. プレイヤー描画
        this.player.draw(this.ctx);

        // 3.5 フォグオブウォー（ダンジョンのみ・HUDの下に描画）
        this.drawFog();

        // 4. HUD描画
        this.drawHud();
    }

    drawFog() {
        // ダンジョンフロアのみ適用（街・図書館は通常表示）
        if (!DUNGEON_CONFIGS[state.currentMapId]) return;

        const w = this.canvas.width;
        const h = this.canvas.height;

        // オフスクリーンキャンバスをサイズに合わせて用意
        if (!this.fogCanvas || this.fogCanvas.width !== w || this.fogCanvas.height !== h) {
            this.fogCanvas = document.createElement('canvas');
            this.fogCanvas.width  = w;
            this.fogCanvas.height = h;
            this.fogCtx = this.fogCanvas.getContext('2d');
        }

        const fctx  = this.fogCtx;
        const visionR = TILE_SIZE * 5;          // 視野半径: 5タイル（160px）
        const px = this.player.x + TILE_SIZE / 2; // プレイヤー中心X
        const py = this.player.y + TILE_SIZE / 2; // プレイヤー中心Y

        // 霧キャンバスを暗闇で塗りつぶす
        fctx.clearRect(0, 0, w, h);
        fctx.fillStyle = 'rgba(0, 0, 0, 0.92)';
        fctx.fillRect(0, 0, w, h);

        // destination-out でプレイヤー周囲に「明かりの穴」を開ける
        fctx.globalCompositeOperation = 'destination-out';
        const grad = fctx.createRadialGradient(px, py, visionR * 0.45, px, py, visionR);
        grad.addColorStop(0, 'rgba(0, 0, 0, 1)'); // 中心: 完全に透明（明るく見える）
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)'); // 外縁: 効果なし（暗闇のまま）
        fctx.fillStyle = grad;
        fctx.beginPath();
        fctx.arc(px, py, visionR, 0, Math.PI * 2);
        fctx.fill();
        fctx.globalCompositeOperation = 'source-over';

        // メインキャンバスにフォグを重ねる（HUDは後に描くので上に出る）
        this.ctx.drawImage(this.fogCanvas, 0, 0);
    }

    drawHud() {
        if (!state.gameStarted) return;
        const ctx = this.ctx;
        const pd = state.playerData;
        const x = 8, y = 8;
        const lineH = 18;

        // 半透明背景パネル
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(x - 4, y - 4, 170, 90);

        ctx.font = 'bold 12px monospace';
        ctx.textBaseline = 'top';

        // HP ラベル
        ctx.fillStyle = '#fff';
        ctx.fillText('HP', x, y);

        // HPバー 背景
        ctx.fillStyle = '#444';
        ctx.fillRect(x + 22, y + 2, 100, 10);

        // HPバー 本体（色変化）
        const ratio = Math.max(0, pd.hp / pd.maxHp);
        ctx.fillStyle = ratio > 0.5 ? '#22cc44' : ratio > 0.25 ? '#ffcc00' : '#ff3333';
        ctx.fillRect(x + 22, y + 2, Math.floor(100 * ratio), 10);

        // HP 数値
        ctx.fillStyle = '#fff';
        ctx.fillText(`${pd.hp}/${pd.maxHp}`, x + 126, y);

        // コイン
        ctx.fillText(`コイン: ${pd.coins}`, x, y + lineH);

        // 欠片
        ctx.fillText(`欠片: ${pd.currentFragments} / ${pd.requiredFragments}`, x, y + lineH * 2);

        // 装備（武器）
        const wName = pd.equipment.weapon
            ? (SHOP_ITEMS.find(i => i.id === pd.equipment.weapon)?.name || '')
            : 'なし';
        ctx.fillStyle = '#aaa';
        ctx.font = '10px monospace';
        ctx.fillText(`武器: ${wName}`, x, y + lineH * 3 + 2);

        // 現在地
        const mapName = MAPS[state.currentMapId] ? MAPS[state.currentMapId].name : '';
        ctx.fillStyle = '#88bbff';
        ctx.fillText(mapName, x, y + lineH * 4 + 2);
    }

    // インタラクションキー（Enter）が押された時の挙動
    onInteractionKey() {
        // メッセージ表示中の判定はInputHandlerで最優先で行うため、ここでは非表示時のみ動作
        this.checkInteraction();
    }

    // 周囲のオブジェクトをチェック
    checkInteraction() {
        if (state.isEventActive || !state.gameStarted) return;

        let checkX = this.player.x + TILE_SIZE / 2;
        let checkY = this.player.y + TILE_SIZE / 2;

        if (this.player.direction === 0) checkY += TILE_SIZE;
        else if (this.player.direction === 1) checkX -= TILE_SIZE;
        else if (this.player.direction === 2) checkX += TILE_SIZE;
        else if (this.player.direction === 3) checkY -= TILE_SIZE;

        const col = Math.floor(checkX / TILE_SIZE);
        const row = Math.floor(checkY / TILE_SIZE);
        const mapData = MAPS[state.currentMapId].data;

        if (row >= 0 && row < mapData.length && col >= 0 && col < mapData[0].length) {
            const tileId = mapData[row][col];
            if (tileId === 1 || tileId === 3) {
                if (state.currentMapId === 'dungeon1_f4') {
                    if (state.playerData.currentFragments >= state.playerData.requiredFragments) {
                        this.showMessageWithCallback("欠片の力で封印が解けた…！",
                            () => this.warpTo('boss_room', 4 * TILE_SIZE, 7 * TILE_SIZE));
                    } else {
                        this.showMessage(`欠片が足りない…\n1F〜3Fで戦い、欠片を集めよう。\n(${state.playerData.currentFragments} / ${state.playerData.requiredFragments})`);
                    }
                }
            } else if (tileId === 2) {
                if (this.shop) {
                    const hint = MERCHANT_HINTS[Math.floor(Math.random() * MERCHANT_HINTS.length)];
                    // ヒント → 購入確認 → ショップ、と2回に分けて表示
                    this.showMessageWithCallback(
                        `商人「${hint}」`,
                        () => this.showMessageWithCallback(
                            `商人「何か買っていくかい？」`,
                            () => this.shop.open()
                        )
                    );
                }
            } else if (tileId === 12) {
                // 宝箱を開ける
                mapData[row][col] = 13; // 空箱に変える
                const rand = Math.random();
                if (rand < 0.3) {
                    // 30%：ポーション
                    state.playerData.inventory.potion = (state.playerData.inventory.potion || 0) + 1;
                    this.showMessage(`宝箱を開けた！\nポーションを1個手に入れた！\n（残り: ${state.playerData.inventory.potion}個）`);
                } else {
                    // 70%：コイン 5〜20
                    const coins = 5 + Math.floor(Math.random() * 16);
                    state.playerData.coins += coins;
                    this.showMessage(`宝箱を開けた！\nコイン${coins}枚を手に入れた！\n（所持: ${state.playerData.coins}枚）`);
                }
            } else if (tileId === 13) {
                // 空箱
                this.showMessage("空の宝箱だ…\nすでに誰かが開けたようだ。");
            } else if (tileId === 4) {
                state.playerData.hp = state.playerData.maxHp;
                this.showMessage("自宅のベッドで休んだ。HPが全回復した！");
            } else if (tileId === 9) {
                // 本棚を調べる
                const data = LIBRARY_DATA.chapter1;
                this.showMessage(`【${data.title}】<br>${data.content}`);
            }
        }
    }

    showMessage(text) {
        this._pendingCallback = null;
        state.isEventActive = true;
        const msgWin = document.getElementById('message-window');
        const content = document.getElementById('message-content');
        content.innerHTML = text;
        msgWin.style.display = 'block';
    }

    showMessageWithCallback(text, callback) {
        state.isEventActive = true;
        this._pendingCallback = callback;
        const msgWin = document.getElementById('message-window');
        const content = document.getElementById('message-content');
        content.innerHTML = text;
        msgWin.style.display = 'block';
    }

    closeMessage() {
        const msgWin = document.getElementById('message-window');
        msgWin.style.display = 'none';
        state.isEventActive = false;
        if (this.input) this.input.reset();
        if (this._pendingCallback) {
            const cb = this._pendingCallback;
            this._pendingCallback = null;
            cb();
        }
    }

    // ステータス画面のトグル（Mキー）
    toggleStatusScreen() {
        const screen = document.getElementById('status-screen');
        if (!screen) return;

        const isOpen = !screen.classList.contains('hidden');

        if (isOpen) {
            // 閉じる
            screen.classList.add('hidden');
            state.isEventActive = false;
            if (this.input) this.input.reset();
            return;
        }

        // バトル中・ショップ中は開かない
        if (this.battle && this.battle.active) return;
        const shopScreen = document.getElementById('shop-screen');
        if (shopScreen && !shopScreen.classList.contains('hidden')) return;

        // 描画してから開く
        this.renderStatusScreen();
        screen.classList.remove('hidden');
        state.isEventActive = true;
    }

    // ステータス画面のDOM更新
    renderStatusScreen() {
        const pd = state.playerData;
        if (!pd) return;

        // 名前・章
        document.getElementById('st-name').textContent = state.playerName || '冒険者';
        document.getElementById('st-chapter').textContent = `第${pd.chapter || 1}章`;

        // HP
        document.getElementById('st-hp').textContent = `${pd.hp} / ${pd.maxHp}`;

        // 攻撃力（装備ボーナス付き表示）
        const baseAtk = pd.baseAttack || 0;
        const wpnId = pd.equipment?.weapon;
        const wpnItem = wpnId ? SHOP_ITEMS.find(it => it.id === wpnId) : null;
        const wpnBonus = wpnItem ? (wpnItem.atk || 0) : 0;
        if (wpnBonus > 0) {
            document.getElementById('st-atk').textContent =
                `${baseAtk} + ${wpnBonus}（${wpnItem.name}） = ${baseAtk + wpnBonus}`;
        } else {
            document.getElementById('st-atk').textContent = `${baseAtk}`;
        }

        // 防御力（装備ボーナス付き表示）
        const baseDef = pd.baseArmor || 0;
        const armId = pd.equipment?.armor;
        const armItem = armId ? SHOP_ITEMS.find(it => it.id === armId) : null;
        const armBonus = armItem ? (armItem.def || 0) : 0;
        if (armBonus > 0) {
            document.getElementById('st-def').textContent =
                `${baseDef} + ${armBonus}（${armItem.name}） = ${baseDef + armBonus}`;
        } else {
            document.getElementById('st-def').textContent = `${baseDef}`;
        }

        // コイン
        document.getElementById('st-coins').textContent = `${pd.coins} G`;

        // 所持品
        document.getElementById('st-weapon').textContent =
            wpnItem ? `${wpnItem.name}（ATK+${wpnBonus}）` : 'なし';
        document.getElementById('st-armor').textContent =
            armItem ? `${armItem.name}（DEF+${armBonus}）` : 'なし';
        document.getElementById('st-potion').textContent =
            `${pd.inventory?.potion || 0}個`;

        // 欠片バー
        const fragments = pd.currentFragments || 0;
        const required = pd.requiredFragments || 10;
        const pct = required > 0 ? Math.min(100, Math.round(fragments / required * 100)) : 0;
        document.getElementById('st-fragment-bar').style.width = `${pct}%`;
        document.getElementById('st-fragments').textContent = `${fragments} / ${required}`;
    }
}

let engine;
let prologue;

document.getElementById('start-btn').addEventListener('click', () => {
    document.getElementById('title-screen').classList.remove('active');
    document.getElementById('prologue-screen').classList.add('active');
    prologue.start();
});

window.onload = () => {
    state.assets.mapchip.src = 'assets/mapchip.png';
    state.assets.player.src = 'assets/player.png';
    state.assets.enemy.src = 'assets/enemy.png';
    state.assets.npc.src = 'assets/npc.png';
    state.assets.door.src = 'assets/door_chap1.png';
    state.assets.symbolWeak.src   = 'assets/symbol_weak.png';
    state.assets.symbolMedium.src = 'assets/symbol_medium.png';
    state.assets.symbolStrong.src = 'assets/symbol_strong.png';
    prologue = new PrologueManager();
    console.log("Assets loading started.");
};
