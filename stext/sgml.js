(function($) {
  // ルートパス
  var ROOT = 'stext/';
  var COMMON  = 'common/'
  var CAPTURE  = 'capture/'

  // シナリオコード
  var scenario_code;

  // シナリオデータ
  var scenario_data;

  // フラグ一覧
  var flags_map = {};

  // モンスター一覧
  var enemies_map = {};

  // アイテム一覧
  var items_map = {};

  // 実績一覧
  var results_map = {};

  // セーブデータ
  var save_data;

  // グローバルセーブデータ
  var global_save_data;
  var GLOBAL_SAVE_DATA_KEY = 'sorcerian_text';

  // ターゲット要素（ゲームブックの表示先）
  var target;

  // ダイアログ本体（ステータスダイアログ／アイテムリスト）
  var dialog;
  var dialog_item;

  // デバッグモードか
  var debug_mode = false;

  // 現在再生中のBGM
  var bgm;
  var bgm_name; // 名前（bgm_*.mp3の「*」のみ。メインは空）

  // 基本データ
  var Common = {
    // 男性の名前
    male_name  : [ 'ボブ', 'デュエル', 'ゴルカス', 'ジェノバン', 'グーラン', 'ジャンビエ', 'グログス', 'コル', 'フロニアス', 'グーリム', 'カザミィ', 'ソロン', 'ゼン', 'ヴォル', 'マルス', 'レイザー', 'ミリオン', 'エリック', 'ジロ', 'ソード', 'ディル', 'ガタビア', 'ラウア', 'ハルビン', 'グドン', 'ジャミル', 'ディカン', 'ダート', 'タットワ5世', 'ディカン', 'ホド', 'ゲプラー', 'コクマー', 'グレアム', 'ロウポー', 'ラッツ', 'ソルト', 'ランブル', 'ネイル', 'ルシアン', 'ギム', 'チェイサー', 'ルワン', 'ゾーク', 'オルム', 'テュモー', 'バロン', 'カメロン', 'トード', 'グンダ', 'フラジオレ', 'ファン＝フレディ', 'ファネッサ3世', 'クリフト4世', 'クォール', 'ディオン', 'ホゼア', 'ロラッド', 'バルナ', 'ティゲロ', 'テト', 'ニフト', 'オーサー', 'ゲディス', 'レオン', 'アンドリュー', 'キリー', 'トーマス', 'エディ', 'ノーマス', 'ギルデン', 'ノーネーム', 'ユイター', 'デュオン', 'ペトス', 'フェリス', 'スラン', 'アルフレッド', 'ソクラム', 'アルモス', 'ログレック', 'ラルーゴ', 'キッド', 'ドレイク', 'ウォルトス', 'レスター', 'テリー', 'グラハン', 'ラドール', 'ウェステル', 'フェスタ', 'バンブー', 'ゲルフス', 'ドン・コサック', 'ベオグラード', 'ピエール', 'タルフ', 'エヴァン', 'ドゥール', 'バルガス', 'アーサー', 'ガッシュ', 'エルウッド', 'ヘルナー', 'エリック', 'ジャグラー', 'アラン', 'ロニアス', 'アスタル', 'ボルックス', 'ラドナー', 'ギルバレス', 'ジャレス', 'ルー', 'スズキ', 'ジロサ', 'サントリーニ', 'ルルイエ', 'コーラル', 'ボマード', 'ナルシス', 'マーヴァル', 'クール', 'ヨシュア', 'エヴァム', 'ジャンク', 'ボイド', 'ヘクター', 'デンキブラウン', 'バイアス', 'ブロイム', 'ディンギル', 'リグ', 'バド', 'ジード', 'ラルザス', 'ガイキナ', 'ロッド', 'ケイン', 'ルーミス', 'タジート', 'ブレイス', 'ディンクス', 'マーク', 'ホホホ', 'テシター', 'J.B', 'ジン', 'マック', 'リラ', 'ジバ', 'バーラン', 'ポジティル', 'ネガティル', 'ファルカス', 'ファウネス', 'ファルカス', 'チェン', 'パズス12世', 'タムタム', 'リーク・ディオン', 'タウラー', 'ラルディ', 'ノーマス', 'アドロン', 'ロカルノ', 'ゲラン', 'シュヴェーリン', 'ローラン', 'ウェッジ', 'アントロノフ', 'キム', 'ヤン', 'デフ', 'ミケロ', 'クール', 'ティエンルン', 'コウ', 'マルク', 'オーエン', 'トート', 'グート', 'マウアー', 'ザンダー', 'バルダ', 'キーリエ', 'マルス', 'セム', 'ターバ', 'グロス', 'クルトン', 'ザムル', 'エルフィン', 'グラハン', 'ガウェイン', 'アドル', 'ゴーバン', 'ドギ', 'ルタ', 'ダレス', 'ダルク＝ファクト', 'クーブラ＝カーン', 'ガルシウス', 'クロノス', 'カイロス', 'ディアルド', 'チッタ', 'カズン', 'ルイス', 'セネリー', 'ライネル', 'エス', 'カリー', 'ドレイク', 'ダニー', 'ドリー', 'ケイリス', 'ノートン', 'クラウド', 'ウォーリー', 'レイモンド', 'サザール', 'メテオロイド', 'ナッシュ', 'ルロイ', 'ライトル', 'カディアン', 'ブラウン', 'シュナイダー', 'セシル', 'グレンザー', 'ゴイル', 'ビル', 'グリメルム', 'ガルベス', 'ジルドバ', 'アレクシウスX世', 'ピエール', 'ジェラルド', 'ロベルト', 'エティス', 'アル＝ファルコ', 'ラシーン', 'ロデム', 'J.D.マックス', 'パーム', 'シド' ],
    // 女性の名前
    female_name: [ 'エスター', 'クリスティ', 'アイリーン', 'フェルディナン', 'リタ', 'トーヤ', 'ノルン', 'ウィンディーネ', 'プリム', 'ピアナ', 'エメラーダ', 'エレア', 'エヴァ', 'リム', 'ビナー', 'ティファレト', 'ミラドゥ', 'パナシェ', 'ミモザ', 'リューズ', 'エレーナ', 'リーア', 'キアラ', 'オルアラ', 'クオレ', 'セーナ', 'リーザ', 'セリナ', 'リリィ', 'ピピ', 'ビヌス', 'アンナ', 'リュシエル', 'フィレン', 'カレン', 'エリン', 'ローラ', 'マーベラ', 'ジョセフィーヌ', 'アネリーナ', 'リオナ', 'ジョアンナ', 'レニッサ', 'ジェニス', 'グリンダ', 'マティナ', 'ローナ', 'コッキー', 'チェルシー', 'ネリス', 'アリーナ', 'フェリッサ', 'マリエル', 'ベララ', 'ジョゼフ', 'ニッカ', 'テキーラ', 'ソルティ', 'パイン', 'ウィズ', 'カンニバル', 'ミント', 'リーン', 'ミル', 'ディアンナ', 'レティア', 'サフィス', 'エミス', 'ヴァムリー', 'サリア', 'ナイジェス', 'ミューリア', 'エミリア', 'シャル', 'バーバラ', 'オビア', 'スチュアート', 'ベーラ', 'サマリーヌ', 'フィアネ', 'レナ', 'ソル', 'ネイラ', 'セレーネ', 'アルバ', 'ラン', 'ルー・パズス', 'シルフィ', 'ミレット', 'レフィーナ', 'モスマ', 'チブル', '鈴鈴', '明明', 'ティキ', 'サリア', 'ミュール', 'ダール', 'ミンナ', 'レーシャ', 'エレイア', 'レア', 'フィーナ', 'ジャネット', 'ナリス', 'ソチ', 'ポーラス', 'ロキア', 'フリージ', 'エスメレー', 'エレナ', 'アルティ', 'エビオラ', 'フィナ' ],
    // 称号
    title: ['武器屋の親父', 'ペンタウァの長老', 'トラベラーズインの宿主', '人と上手に話したい', 'ペンタウァ近衛隊長', 'タリスマンの見張り', '瞑想中', '砂漠の飯炊き', '狂戦士', 'エレベーターの管理人', '盗賊の頭領', '暗き沼の魔法使い', 'ロマンシア国王', 'アゾルバ国王', 'ペンタウァ国王', '蚕職人', '妖精王', '暗黒の魔導士', 'クイーンマリー号船長', 'キタブ・アル・アジフの持ち主', 'メデューサハンターの弟子', 'ファルコムマン', '戦士の亡霊', '海賊の子孫', 'いけにえの神官', '東の村の村長', '麻薬中毒者', 'ヴァネルバの王', '銀の竪琴屋', '近衛隊長', '復讐の呪術師', 'ラフォーヌの森の管理人', 'リドニア王国の元兵士', '姫の教育係', '大魔王', '紫ウニの王子', 'ベララの家族', '時計塔の番人', '時計塔の魔女', 'ナルキッソス号船長', 'ディンギル王国の3神官', 'バドティビラ工場の指揮官', 'シュメール国王', 'サンサーラの山賊', '南村の村長', 'アイテム屋WIZの店主', '旅の吟遊詩人', '古代イスマリアの王', '時の神殿の書記官', '闇の王', 'ランドル村長', '魔法学校の校長', '魔法学校の用務員', 'マリオネットの王', 'ペンタウァの近衛兵', '陽の中の闇人', '赤毛の冒険者', '光の王', 'イリアスンの執政官', '魔の下僕', 'メデューサハンター', '邪神教徒', '邪神教々祖', '砂漠の王', '鍵の番人', 'ローデシア辺境司令官', '宇宙からの訪問者', '黒竜仙人', '猿大聖', '極楽寺の僧兵', 'ジャグラー族', '迷宮建築の第一人者', 'フリース村の村長', 'ペンタウァ一の科学者アンド予言者', '暴れザル', '魔法学校の校長', '人魚３姉妹の長女', 'マリオネットの王', '探求の学徒', '旅芸人の一座', '猛獣使い', '流れの傭兵', '氷の魔女', 'パペッテの人形遣い', 'バーテンダー', '宮仕えのシャーマン', '薬草亭の主人', '水門の管理人' ],

    // キャラクター初期値（種族、性別、HP、MP、STR、INT、DEX、KRM）
    pc_init: [
      ['FIGHTER', 'MALE',   85, 55, 7, 3, 6, 4],
      ['FIGHTER', 'FEMALE', 80, 60, 6, 4, 6, 4],
      ['WIZARD',  'MALE',   55, 85, 4, 8, 5, 3],
      ['WIZARD',  'FEMALE', 50, 90, 3, 8, 5, 4],
      ['DWARF',   'MALE',   90, 50, 8, 2, 8, 2],
      ['DWARF',   'FEMALE', 85, 55, 7, 3, 8, 2],
      ['ELF',     'MALE',   65, 75, 4, 6, 5, 5],
      ['ELF',     'FEMALE', 60, 80, 2, 7, 5, 6]
    ],

    // 魔法
    magic: {
      'HEAL':        [ 0, 0, 0, 1, 0, 1, 0, 'HPを15回復' ],
      'PEACE':       [ 0, 0, 1, 0, 1, 0, 0, 'MPを10回復' ],
      'CURE':        [ 0, 0, 0, 0, 1, 0, 1, '毒回復' ],
      'MELT':        [ 0, 1, 0, 0, 1, 1, 1, '凍結を回復' ],
      'STONE-FLESH': [ 0, 0, 0, 1, 1, 1, 1, '石化を回復' ],
      'UN-CURCE':    [ 2, 0, 1, 0, 0, 1, 0, '呪いを回復' ],
      'AIR-HAND':    [ 1, 0, 1, 0, 1, 0, 1, '見えない拳の衝撃で、忘却を回復' ],
      'RESURRECT':   [ 0, 0, 0, 1, 3, 0, 1, 'HP/MP半分で復活（但し、冒険に一度だけ）' ],
      'REDUCE-LIFE': [ 0, 1, 1, 0, 1, 1, 0, '体力を犠牲に（HP-25）、すべての状態異常を回復' ],
      'REJUVENATE':  [ 0, 2, 0, 1, 0, 0, 1, '時の流れを巻き戻し（現在の判定をやり直し）' ],
      'PROTECT':     [ 1, 0, 0, 1, 1, 0, 1, 'HPダメージを半減' ],
      'HOLY-WATER':  [ 0, 0, 2, 2, 0, 0, 0, 'MPダメージを半減' ],
      'CHANGE-AIR':  [ 1, 0, 0, 1, 1, 1, 0, '戦闘を回避（アイテムは得られない）' ],
      'GIVE-VIGOR':  [ 1, 1, 1, 0, 0, 1, 0, '敵の攻撃力が2倍＆取得アイテム2倍' ],
      'EXPLOSION':   [ 0, 1, 0, 1, 0, 1, 2, '地属性の敵を全滅' ],
      'DELUGE':      [ 4, 0, 0, 0, 0, 1, 0, '火属性の敵を全滅' ],
      'FREEZE':      [ 0, 2, 0, 0, 0, 1, 2, '水属性の敵を全滅' ],
      'DESTROY-A':   [ 1, 0, 4, 0, 0, 0, 0, '風属性の敵を全滅' ],
      'LIGHT-CROSS': [ 0, 2, 0, 2, 0, 1, 0, '霊属性の敵を全滅' ],
      'NOILA-TEM':   [ 1, 1, 1, 1, 1, 1, 1, 'すべての属性の敵を全滅' ],
    },

    // シナリオクリア時に入手できるアイテム
    global_items: {
      'happy' : {
        'gi01' : { name: '金の卵', desc: '月の欠片を5個所有した状態で冒険を開始' },
        'gi02' : { name: 'ガラティーン', desc: '火星の欠片を5個所有した状態で冒険を開始' },
        'gi03' : { name: '五元素のマント', desc: '水星の欠片を5個所有した状態で冒険を開始' },
        'gi04' : { name: 'アマゾンの剣', desc: '木星の欠片を5個所有した状態で冒険を開始' },
        'gi05' : { name: '幸福のコイン', desc: '金星の欠片を5個所有した状態で冒険を開始' },
        'gi06' : { name: 'ムラサメブレード', desc: '土星の欠片を5個所有した状態で冒険を開始' },
        'gi07' : { name: 'G・スレイヤー', desc: '太陽の欠片を5個所有した状態で冒険を開始' },
        'gi08' : { name: '水晶の剣', desc: '左サイコロが5以上の時、そのシーンでHPを1回復' },
        'gi09' : { name: '王様の杖', desc: '左サイコロが5以上の時、そのシーンでMPを1回復' },
        'gi10' : { name: 'ブルーリボン', desc: '戦闘ダメージを1減算' },
        'gi11' : { name: '王家のダイヤモンド', desc: '罠ダメージを1減算' },
        'gi12' : { name: '不老長寿の水', desc: '冒険中に一度だけHPを半分回復できる' },
        'gi13' : { name: 'タリスマン', desc: '冒険中に一度だけMPを半分回復できる' },
        'gi14' : { name: '鏡の盾', desc: 'HPダメージを1減算' },
        'gi15' : { name: '銀の竪琴', desc: 'MPダメージを1減算' },
        'gi16' : { name: 'パンドラの箱', desc: '右サイコロが4以上の時、戦闘回避が可能' },
        'gi17' : { name: '魔法の絨毯', desc: '右サイコロが5以上の時、罠回避' },
        'gi18' : { name: '中和剤', desc: '毒耐性' },
        'gi19' : { name: '聖水', desc: '呪い耐性' },
        'gi20' : { name: 'チルドの実', desc: '凍結耐性' },
        'gi21' : { name: '銀のハーモニカ', desc: '石化耐性' },
        'gi22' : { name: '真実の鏡', desc: '忘却耐性' },
        'gi23' : { name: 'D・スレイヤー', desc: 'すべての星を1個所有した状態で冒険を開始' },
      },
      'bad' : {
        'bgi01' : { name: '塩酸', desc: 'シーン毎にダイス合計が5未満でHPを1減算、5以上でMPを1回復' },
        'bgi02' : { name: '紅玉', desc: 'シーン毎にダイス合計が5未満でMPを1減算、5以上でHPを1回復' },
        'bgi03' : { name: '血まみれの斧', desc: '冒険開始時に呪い。解除で3回まで星消費せず魔法発動可' },
        'bgi04' : { name: 'トリカブト', desc: '冒険開始時に毒。但し、解除までシーン毎にMPを1回復' },
        'bgi05' : { name: 'ギャルのパンティー', desc: '冒険開始時に忘却。但し、解除までSTR/INT0でない方を10' },
      }
    }
  };

  // ユーティリティ
  var Util = {
    // min～maxの乱数を生成
    random: function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // ゼロ未満は0、11以上は10に丸める
    minMaxGuard: function(num) {
      if (num <  0) { return 0; }
      if (num > 10) { return 10; }
      return num;
    },

    // 配列から任意の要素を取得
    randomArray: function(data) {
      return data[Math.floor(Math.random() * data.length)];
    },

    // 配列dataに値valueを追加（ただし、重複時は追加しない）
    pushUnique: function(data, value) {
      if (data.indexOf(value) === -1) {
        data.push(value);
        return true;
      }
      return false;
    },

    // 配列dataから値valueを除去
    shiftUnique: function(data, value) {
      return data.filter(function(elem) {
        return elem !== value;
      });
    },

    // 先頭文字を除去
    ltrim: function(str) {
      return str.substr(1);
    },

    // セーブデータをストレージに保存
    saveStorage: function() {
      localStorage[scenario_code] = JSON.stringify(save_data);
    },

    // セーブデータをストレージから取得
    loadStorage: function() {
      save_data = JSON.parse(localStorage[scenario_code]);
    },

    // グローバルセーブデータをストレージに保存
    saveStorageGlobal: function() {
      localStorage[GLOBAL_SAVE_DATA_KEY] = JSON.stringify(global_save_data);
    },

    // グローバルセーブデータをストレージから取得
    loadStorageGlobal: function() {
      global_save_data = JSON.parse(localStorage[GLOBAL_SAVE_DATA_KEY]);
    },

    // セーブデータの初期化
    initSavedata: function() {
      var pc_base = this.randomArray(Common.pc_init);
      var hp_m = this.random(pc_base[2], pc_base[2] + 10);
      var mp_m = this.random(pc_base[3], pc_base[3] + 10);
      var str_i = this.minMaxGuard(this.random(pc_base[4], pc_base[4] + 2));
      var int_i = this.minMaxGuard(this.random(pc_base[5], pc_base[5] + 2));
      var dex_i = this.minMaxGuard(this.random(pc_base[6], pc_base[6] + 2));
      var krm_i = this.minMaxGuard(this.random(pc_base[7], pc_base[7] + 2));
      // 旧セーブデータからメモを取得
      var old_data = localStorage[scenario_code];
      var old_memo = '';
      if(old_data) {
        old_data = JSON.parse(old_data);
        old_memo = old_data.memos;
      }

      save_data = {
        // キャラクター情報
        chara: {
          // 名前
          name: (
            pc_base[1] === 'MALE' ?
              this.randomArray(Common.male_name) :
              this.randomArray(Common.female_name)
          ),
          // 称号
          title: this.randomArray(Common.title),
          // 種族
          race: pc_base[0],
          // 性別
          sex: pc_base[1],
          // 年齢帯
          age: this.randomArray(['YOUNG', 'ADULT', 'OLD']),
          // 状態異常
          state: '',
          // HP最大値
          hp_m: hp_m,
          // HP現在値
          hp:  hp_m,
          // MP最大値
          mp_m: mp_m,
          // MP最小値
          mp: mp_m,
          // 強さの初期値（0～10）
          str_i: str_i,
          // 強さの現在値（0～10）
          str: str_i,
          // 賢さの初期値（0～10）
          int_i: int_i,
          // 賢さの現在値（0～10）
          int: int_i,
          // 器用さの初期値（0～10）
          dex_i: dex_i,
          // 器用さの現在値（0～10）
          dex: dex_i,
          // 魅力の初期値（0～10）
          krm_i: krm_i,
          // 魅力の現在値（0～10）
          krm: krm_i,
          // 自由ステータス
          free1: 0,
          free2: 0
        },
        // 所有している七惑星の欠片（月、火星、水星、木星、金星、土星、太陽）
        stars: [0, 0, 0, 0, 0, 0, 0],
        // 所有しているアイテム
        items: [],
        // 所有しているフラグ
        flags: [],
        // 冒険メモ（自由入力欄）
        memos: old_memo,       
        // 現在のシーン番号
        scene: 0,
        // 経過シーン
        ellapsed_scene: 0,
        // 現在再生中のBGM（メインは空文字列）
        bgm: '',
        // ボーナス（グローバルアイテム）
        bonus: this.randomArray(global_save_data.items),
        // エンディングに到達したか
        isEnded: false
      };
      this.saveStorage();
    },

    // グローバルなセーブデータを初期化
    initGlobalSaveData: function() {
      global_save_data = {
        items: [],
        results: {},
        bgm: true,
        panel: true
      };
      this.saveStorageGlobal(GLOBAL_SAVE_DATA_KEY);
    },

    // シナリオデータが有効であるか（開発中）
    validateScenario: function() {
      var error_messages = [];
      var tmp_scenes = [];  // シーンidのリスト
      // id値が指定された配列内に存在するか
      // org：idリスト、value：チェックする値（カンマ区切り）
      var checkId = function(org, value, scene_id) {
        if (value === undefined || value === '') { return; }
        var ids = value.trim().split(',');
        var keys = Object.keys(org);
        ids.forEach(function(id) {
          id = id.replace('-', '');
          if(keys.indexOf(id) === -1) {
            error_messages.push({
              scene_id: scene_id,
              message: id.startsWith('i') ?
                'アイテムコード' + id + 'が未登録です。' :
                  (id.startsWith('f') ? 'フラグコード' + id + 'が未登録です。' :
                    (id.startsWith('m') ? '敵コード' + id + 'が未登録です。' :
                      '実績コード' + id + 'が未登録です。'))
            });
          }
        });
      };

      // scene要素を順に処理
      $('scene', scenario_data).each(function(index, scene){
        var tmp_s = $(scene);
        // 重複するidがあればエラー（さもなくばリストに追加）
        if (tmp_scenes.indexOf(tmp_s.attr('id')) === -1) {
          tmp_scenes.push(tmp_s.attr('id'));
        } else {
          error_messages.push({
            scene_id: tmp_s.attr('id'),
            message: 'scene－idが重複しています。'
          });
        }
        // 各種id値をチェック
        checkId(items_map, tmp_s.attr('items'), tmp_s.attr('id'));
        checkId(flags_map, tmp_s.attr('flags'), tmp_s.attr('id'));
        checkId(enemies_map, tmp_s.attr('enemies'), tmp_s.attr('id'));
        checkId(results_map, tmp_s.attr('result'), tmp_s.attr('id'));
      });
      return error_messages;
    },

    // 指定された魔法を利用できるかを判定（引数は個々の魔法情報配列）
    canUseMagic: function(magic) {
      if(save_data.stars[0] < magic[0] ||
         save_data.stars[1] < magic[1] ||
         save_data.stars[2] < magic[2] ||
         save_data.stars[3] < magic[3] ||
         save_data.stars[4] < magic[4] ||
         save_data.stars[5] < magic[5] ||
         save_data.stars[6] < magic[6]) {
        return false;
      } else {
        return true;
      }
    },

    // @items属性（at_items）の値に応じて、セーブデータのitemsプロパティを更新
    updateItems: function(at_items) {
      if(!at_items) { return; }
      var items = save_data.items;
      var at_items = at_items.split(',');

      for (var i = 0; i < at_items.length; i++) {
        var item = at_items[i].trim();

        if (item.indexOf('-') === 0) {
          item = this.ltrim(item);
          items = this.shiftUnique(items, item);
        } else {
          this.pushUnique(items, item);
        }
      }
      save_data.items = items;
    },

    // @flags属性（at_flags）の値に応じて、セーブデータのflagsプロパティを更新
    updateFlags: function(at_flags) {
      if(!at_flags) { return; }
      var flags = save_data.flags;
      var at_flags = at_flags.split(',');

      for (var i = 0; i < at_flags.length; i++) {
        var flag = at_flags[i].trim();
        this.pushUnique(flags, flag);
      }
    },

    // @result属性（at_result）の値に応じて、グローバルセーブデータのresultsプロパティを更新
    updateResults: function(at_result) {
      if(!at_result) { return; }
      // resultsプロパティの存在チェック（セーブデータ変更時の処理要検討）
      if (global_save_data['results'] === undefined) {
        global_save_data['results'] = {};
      }
      var results = global_save_data.results;
      // 現在のシナリオの実績情報がなく、シナリオコードが「<」で始まらない場合
      if (results[scenario_code] === undefined &&
        scenario_code.indexOf('<') !== 0) {
        results[scenario_code] = [];
      }
      if(this.pushUnique(results[scenario_code], at_result) === true) {
        this.toast('実績「' + results_map[at_result].name + '」を獲得');
      }
      this.saveStorageGlobal();
    },

    // 指定されたメッセージをトースト表示
    toast: function(msg) {
      $('.toast').remove();
      $('body').append('<div class="toast">' + msg + '</div>');
      var leftpos = $('body').width() / 2 - $('.toast').outerWidth() / 2;
      $('.toast').css('left', leftpos).hide().fadeIn('fast');
      setTimeout(function() {
        $('.toast').fadeOut('slow',function(){
          $(this).remove();
        });
      }, 4000);
    },

    // num個のサイコロ（HTML文字列）を取得
    cube: function(num) {
      if (num === undefined) { num = 1; }
      var html = '';
      for (var i = 0; i < num; i++) {
        html += '<img src="' + ROOT + COMMON +'cube' + this.random(1, 6)
          + '.png" class="dice" />';
      }
      return html;
    },

    // ドロップアイテムの生成
    dropItem: function(element) {
      if(!element) { return ''; }
      var drop = {
        '地': [ '木星', '火星', '土星', '－', '－' ],
        '火': [ '火星', '太陽', '火星', '－', '－' ],
        '水': [ '水星', '月', '金星', '－', '－' ],
        '風': [ '金星', '水星', '月', '－', '－' ],
        '霊': [ '土星', '太陽', '月', '－', '－' ]
      };
      return this.randomArray(drop[element]);
    },

    // ダメージ式／回避方法を選択
    selectFunc: function(func) {
      return Util.randomArray(func.split(',')).trim();
    },

    // 状態異常によるステータス補正
    // 補正値の反映は現在では無効（どこかで修正を）
    deltaStatus: function(state) {
      switch(state) {
        case 'frozen' :
          var state_desc = 'すべてのステータスを-2';
          var str_d = -2;
          var int_d = -2;
          var dex_d = -2;
          var krm_d = -2;
          break;
        case 'stone' :
          var state_desc = 'すべてのステータスを-1（30scene経過で死亡）';
          var str_d = -1;
          var int_d = -1;
          var dex_d = -1;
          var krm_d = -1;
          break;
        case 'forget' :
          var state_desc = 'STR／INTのうち、高い方が0に（20scene経過で解除）';
          if(save_data.chara.str < save_data.chara.int) {
            var str_d = 0;
            var int_d = save_data.chara.int * -1;
          } else {
            var str_d = save_data.chara.str * -1;
            var int_d = 0;
          }
          var dex_d = 0;
          var krm_d = 0;
          break;
        case 'poison' :
          var state_desc = 'シーン経過ごとにHPを-1';
          var str_d = 0;
          var int_d = 0;
          var dex_d = 0;
          var krm_d = 0;
          break;
        case 'curse' :
          var state_desc = '魔法の利用が不可（UN-CURSEを除く）';
          var str_d = 0;
          var int_d = 0;
          var dex_d = 0;
          var krm_d = 0;
          break;
        default : 
          var state_desc = '－';
          var str_d = 0;
          var int_d = 0;
          var dex_d = 0;
          var krm_d = 0;
          break;
      }
      return [ str_d, int_d, dex_d, krm_d, state_desc ];
    },

    // 指定されたキーでボーナスアイテムを取得
    getBonusItem: function(bonus) {
      if(bonus.indexOf('bgi') === 0) {
        return Common.global_items.bad[bonus];
      } else {
        return Common.global_items.happy[bonus];
      }
    },

    // シナリオデータを初期化
    initScenario: function() {
      Util.initSavedata();
      Util.initDialog();

      // 最初のシーンを取得
      Util.createScene(0);
      history.pushState(0, 'Scene 0');
    },

    // ダイアログを初期化
    initDialog: function() {
      // ステータスダイアログを初期化
      $.get(ROOT + COMMON + 'dialog.html')
        .done(function(data) {
          dialog = $(data);
          $('#name', dialog).text(save_data.chara.name);
          $('#title', dialog).text(save_data.chara.title);
          $('#race', dialog).text(save_data.chara.race);
          $('#sex', dialog).text(save_data.chara.sex);
          $('#hp_m', dialog).text(save_data.chara.hp_m);
          $('#mp_m', dialog).text(save_data.chara.mp_m);
          $('#str_i', dialog).text(save_data.chara.str_i);
          $('#int_i', dialog).text(save_data.chara.int_i);
          $('#dex_i', dialog).text(save_data.chara.dex_i);
          $('#krm_i', dialog).text(save_data.chara.krm_i);
          $('#age',  dialog).text(save_data.chara.age);
          $('#chara_face', dialog).attr('src',
            ROOT + COMMON + String(save_data.chara.sex).toLowerCase() + '_' +
              String(save_data.chara.age).toLowerCase() + '_' + 
              String(save_data.chara.race).toLowerCase() + '.png');
          if(save_data.bonus) {
            var b = Util.getBonusItem(save_data.bonus);
            $('#bonus', dialog).text(b.desc + '（' + b.name + '）');
          }
          // ★mobile★
          dialog.insertBefore(target).hide();
       });

       // ボーナスアイテムダイアログを初期化
       $.get(ROOT + COMMON + 'dialog_list.html')
        .done(function(data) {
          dialog_item = $(data);

          // グッドアイテムを一覧表示
          for(var i = 0; i < 24; i++) {
            if(i < 10) {
              num = '0' + i;
            } else {
              num = i;
            }
            num = 'gi' + num;
            //if (global_save_data.items.includes(num)) {
            if ($.inArray(num, global_save_data.items) !== -1) {
              $('#' + num, dialog_item).
                attr('src', ROOT + COMMON + num + '.png').
                attr('class', 'bonus_item');
            } else {
              $('#' + num, dialog_item).
                attr('src', ROOT + COMMON + 'gi99.png');
            }
          }

          // バッドアイテムを一覧表示
          for(var i = 1; i < 6; i++) {
            if(i < 10) {
              num = '0' + i;
            } else {
              num = i;
            }
            num = 'bgi' + num;
            //if (global_save_data.items.includes(num)) {
            if ($.inArray(num, global_save_data.items) !== -1) {
              $('#' + num, dialog_item).
                attr('src', ROOT + COMMON + num + '.png').
                attr('class', 'bonus_item');
            } else {
              $('#' + num, dialog_item).
                attr('src', ROOT + COMMON + 'gi99.png');
            }
          }
        });
    },

    // ステータスダイアログを生成
    createDialog: function() {
      $('#hp', dialog).attr('value', save_data.chara.hp);
      $('#mp', dialog).attr('value', save_data.chara.mp);
      $('[name="state"]', dialog).each(function() {
        var state = $(this).attr('value');
        if(state ===  save_data.chara.state) {
          $(this).attr('checked', 'checked');
        } else {
          $(this).removeAttr('checked');
        }
      });
      $('#ellapsed_scene', dialog).text(save_data.ellapsed_scene + ' scene');
      $('#free1', dialog).attr('value', save_data.chara.free1);
      $('#free2', dialog).attr('value', save_data.chara.free2);
      $('#str', dialog).attr('value', save_data.chara.str);
      $('#int', dialog).attr('value', save_data.chara.int);
      $('#dex', dialog).attr('value', save_data.chara.dex);
      $('#krm', dialog).attr('value', save_data.chara.krm);
      $('#s_mon', dialog).attr('value', save_data.stars[0]);
      $('#s_tue', dialog).attr('value', save_data.stars[1]);
      $('#s_wed', dialog).attr('value', save_data.stars[2]);
      $('#s_thu', dialog).attr('value', save_data.stars[3]);
      $('#s_fri', dialog).attr('value', save_data.stars[4]);
      $('#s_sat', dialog).attr('value', save_data.stars[5]);
      $('#s_sun', dialog).attr('value', save_data.stars[6]);
      var delta = this.deltaStatus(
        $('[name="state"][checked="checked"]', dialog).attr('value'));
      $('#str_d', dialog).text('（' + delta[0] + '）');
      $('#int_d', dialog).text('（' + delta[1] + '）');
      $('#dex_d', dialog).text('（' + delta[2] + '）');
      $('#krm_d', dialog).text('（' + delta[3] + '）');
      $('#state_desc', dialog).text(delta[4]);
      $('#memos', dialog).text(save_data.memos);

      // 魔法選択ボックスを生成
      var magic_box = $('#magic', dialog);
      magic_box.empty();
      for(var key in Common.magic) {
        var magic = Common.magic[key];
        var option = $('<option></option>')
          .attr('value', key)
          .attr('title', magic[8])
          .text(key + '（' + magic[7] + '）');
        // 魔法が使えなければ、オプションは無効に
        if(!Util.canUseMagic(magic)) {
          option.attr('disabled', 'disabled');
        }
        option.appendTo(magic_box);
      }

      // 現在所持しているアイテム一覧を表示
      var items = [];
      for(var i = 0; i < save_data.items.length; i++) {
        var item = items_map[save_data.items[i]];
        items.push('・' + item.name + '（' + item.desc + '）');
      }
      $('#items', dialog).text(items.join('\r'));

      // 現在所持しているフラグ一覧を表示
      var flags = $('#flags', dialog);
      flags.empty();
      for(var i = 0; i < save_data.flags.length; i++) {
        var flag_text = flags_map[save_data.flags[i]];
        if (flag_text.indexOf('*') !== 0) {
          var tmp = '<option ';
          //if (i == save_data.flags.length - 1) { tmp += 'selected'; }
          tmp += '>・' + flags_map[save_data.flags[i]] + '</option>';
          flags.append(tmp);
        }
      }
      $('#flags > option:last', dialog).attr('selected', 'selected');

      // 現在所持しているフラグ一覧を表示（旧コード）
      //var flags = [];
      //for(var i = 0; i < save_data.flags.length; i++) {
      //  flags.push('・' + flags_map[save_data.flags[i]]);
      //}
      //$('#flags', dialog).text(flags.join('\r'));

      // ★mobile★
      dialog.slideDown(500);
      $('#status_change').val('Equipment');
      $('#status_basic').show();
      $('#status_equip').hide();
      target.slideUp(500);
      //$.zoombox.html(dialog.html(),
      //   {
      //     width: 640,
      //     height: 480
      //   }
      // );
    },

    // エンディングの処理（resultはhappy／bad）
    endScenario: function(result) {
      if(!result) { return; }

      // エンディングでライセンス情報を表示
      console.log('***********License Info.***********');
      var tmp_license = { 'bgm': '音楽', 'picture': '画像' };
      $('license work', scenario_data).each(function() {
        var license_url = $(this).attr('url');
        console.log($(this).attr('name') +
          '(' + tmp_license[$(this).attr('category')] + '): ' +
          $(this).attr('creator') + ' '
          + (license_url !== undefined ? license_url : '')
        );        
      });
      console.log('***********License Info.***********');

      $('<p><a href="#" onclick="location.reload(true)" class="scenebtn">' +
        '最初から冒険に挑戦する</a></p>').insertBefore($('#cubes', target));

      // エンディングフラグ
      save_data.isEnded = true;
      localStorage.removeItem(scenario_code);

      // ボーナスアイテムの選択
      var bonus_item, o_bonus_item, audio_path;
      switch(result) {
        case 'happy' :
          bonus_item = Util.randomArray(Object.keys(Common.global_items.happy));
          o_bonus_item = Common.global_items.happy[bonus_item];
          audio_path = ROOT + scenario_code + '/bgm_happy.mp3';
          break;
        case 'bad' :
          // バッドアイテムは20％未満の確率で入手
          if(Util.random(0, 100) < 20) {
            bonus_item = Util.randomArray(Object.keys(Common.global_items.bad));
            o_bonus_item = Common.global_items.bad[bonus_item];            
          }
          audio_path = ROOT + scenario_code + '/bgm_bad.mp3';
          break;
      }

      // エンディングテーマ再生
      if(bgm) { bgm.pause(); }
      bgm = new Audio(audio_path);
      bgm.loop = true;
      if(global_save_data.bgm) { bgm.play(); }

      if(bonus_item) {
        Util.pushUnique(global_save_data.items, bonus_item);
        Util.saveStorageGlobal();
        
        // アイテム表示
        $.get('stext/common/dialog_bonus.html').then(function(data) {
          var bonus_dialog = $(data);
          $('#bonus_img', bonus_dialog).attr('src', ROOT + COMMON + bonus_item + '.png');
          $('#bonus_item', bonus_dialog).text(o_bonus_item.name);
          $('#bonus_item_desc', bonus_dialog).text(o_bonus_item.desc);

          setTimeout(function() {
            $.zoombox.html(bonus_dialog.html(),
              {
                width: 480,
                height: 200
              }
            );  
          }, 2000);
        });
      }
    },

    // そのシーンに直接の番号指定で移動可能かを判定
    canSceneMove: function(scene_num, allow_num) {
      return allow_num.split(',').indexOf(scene_num) !== -1
      // 旧コード
      //var scene = $('scene[id="' + scene_num + '"][allowMove]', scenario_data);
      //return scene.length != 0 ? true : false;
    },

    // 指定されたBGMを再生
    playBgm: function(path) {
      if(bgm) { bgm.pause(); }
      bgm = new Audio(path);
      bgm.loop = true;
      if(global_save_data.bgm) { bgm.play(); }
    },
    
    // 現在のシーン情報を取得＆画面の生成
    createScene: function(scene_num) {
      // エンディングフラグが立っている場合は、初期化処理を実行
      if(save_data.isEnded) {
        location.reload(true);
        return;
      }

      // スクロール位置をページ上部に移動
      $(window).scrollTop(0);

      var scene = $('scene[id="' + scene_num + '"]', scenario_data);

      // シーンテキストの整形（カラーリング＆URL）
      var tmp_scene = scene.text();
      tmp_scene = tmp_scene.replace(/%(blue|red|purple)%/gi, '&nbsp;<span style="color:$1">');
      tmp_scene = tmp_scene.replace(/%\/%/gi, '</span>&nbsp;');
      tmp_scene = tmp_scene.replace(/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/gi,
        '<a href="$&" data-link="auto" target="_blank">$&</a>');
      target.html(tmp_scene);
      //target.text(scene.text());
      target.markdown();

      // ヘッダーテキスト／コントロールパネルの生成
      $('<h5 id="scenario_title">' + 
        '<img id="ctrl_show" src="' + ROOT + COMMON + 'ctrl_show.png" /></a> ' +
        $('scenario', scenario_data).attr('title') +
          '【' + scene_num + '】</span></h5>' + 
        '<div id="control_panel">' +
        '<img id="ctrl_home" src="' + ROOT + COMMON + 'ctrl_home.png" /></a>　' +
        '<img id="status_open" src="' + ROOT + COMMON + 'ctrl_status.png" />　' +
        '<img id="item_list" src="' + ROOT + COMMON + 'ctrl_bonus.png" />　' +
        '<img id="audio_onoff" src="' + ROOT + COMMON + 'ctrl_audio_' +
          (global_save_data.bgm ? 'on' : 'off') + '.png" />　' +
        '<img id="ctrl_reload" src="' + ROOT + COMMON + 'ctrl_results.png" />　' +
        '<img id="ctrl_help" src="' + ROOT + COMMON + 'ctrl_help.png" />' +
        '</div>')
        .prependTo(target);

      // パネル非表示状態になっている場合、パネルを非表示に
      if(!global_save_data.panel) {
        $('#control_panel').hide();
      }

      console.log('debug:' + debug_mode);
      // デバッグモードが有効の場合、デバッグウィンドウを表示
      if(debug_mode) {
        $('<div id="debug_panel"><form>' +
        '<label>Scene：<input id="debug_id" type="text" size="5" /></label>　' +
        '<label>Items：<input id="debug_items" type="text" size="7" /></label>　' +
        '<label>Flags：<input id="debug_flags" type="text" size="7" /></label>　' +
        '<input id="debug_reload" type="button" value="Reload" />' +
        '</form></div>')
        .prependTo(target);

        // 現在の状態をデバッグウィンドウに反映
        $('#debug_panel #debug_id').val(scene_num);
        $('#debug_panel #debug_items').val(save_data.items.join(','));
        $('#debug_panel #debug_flags').val(save_data.flags.join(','));
        // セーブデータを上書きの上、シーン移動
        $('#debug_panel #debug_reload').click(function(e) {
          var debug_items = $('#debug_panel #debug_items').val().trim();
          var debug_flags = $('#debug_panel #debug_flags').val().trim();
          if(debug_items !== '') {
            save_data.items = debug_items.split(',');
          } else {
            save_data.items = [];
          }
          if(debug_flags !== '') {
            save_data.flags = debug_flags.split(',');
          } else {
            save_data.flags = [];
          }
          Util.saveStorage();
          Util.createScene($('#debug_panel #debug_id').val());
        });
      }

      // サイコロの表示
      target.append('<center id="cubes">' + Util.cube(2) + '</center>');

      // 移動ボタンの整形
      $('a', target).addClass('scenebtn');

      // 外部リンク
      $('a[data-link="auto"]', target).removeClass('scenebtn');

      // 移動用ボタンの整形
      var tmp_move = $('a[href="X"]', target);
      tmp_move
        .removeClass('scenebtn')
        .addClass('scene_move')
        .attr('data-allow', tmp_move.text())
        .text('移動する')
        .before('<input type="number" id="toscene" class="scene_move" />')
        .add('#toscene')
        .wrapAll('<div></div>');

      // 挿絵の整形
      var a_img = $('a:has(img)', target);
      a_img.each(function(index, elem) {
        var img_path = ROOT + scenario_code + '/' + CAPTURE + $(elem).attr('href');
        $(elem).attr('href', img_path)
          .removeClass('scenebtn')
          .addClass('scenepic')
          .find('img')
          .attr('src', img_path);  
      });
      $('a.scenepic').zoombox();

      // シーンのモンスター情報を取得
      if(scene.attr('enemies')) {
        var e_table = 
          $('<table class="enemy">');
        var enemies = scene.attr('enemies').split(',');
        for (var i = 0; i < enemies.length; i++) {
          var enemy = enemies_map[enemies[i]];
          var row = '<tr class="enemy_row" data-enemy="' + enemies[i] + '"><th>' + enemy.name;
          if(enemy.element) { row += '（' + enemy.element + '）'; }
          row += '</th><td>' + enemy.attack + '</td><td>';
          if(enemy.func) { row += Util.selectFunc(enemy.func); }
          row += '</td><td>' + this.dropItem(enemy.element);
          row += '</td></tr>';
          e_table.append(row);
        }
        e_table.insertBefore('a.scenebtn:first');
      }

      // 現在のフラグ／アイテム情報を取得
      var flags = save_data.flags;
      var items = save_data.items;

      // title属性付きのボタンを非表示（ただし、「-～」を表示状態に）
      $('a[title]', target).hide();
      $('a[title^="-"]', target).show();

      // 指定のフラグを所持している場合にだけボタンだけを表示（「-」で所持していない場合に非表示）
      for (var i = 0; i < flags.length; i++) {
        $('a[title="' + flags[i] + '"]', target).show();
        $('a[title="-' + flags[i] + '"]', target).hide();
      }

      // 指定のフラグ＆アイテムを所持している場合にだけボタンを表示（複数フラグ＆アイテム対応）
      var multi_flags = $('a[title*=","]', target);     
      multi_flags.each(function(index, elem) {
        var multi_ids = $(elem).attr('title');
        if (multi_ids.indexOf('-') !== 0) {
          // 通常のマルチフラグ処理（指定フラグ＆アイテムを全て所有でボタン表示）
          var show_flag = true; // ボタンを表示するか
          var multi_ids_values = multi_ids.split(',');
          for (var i = 0; i < multi_ids_values.length; i++) {
            if (flags.indexOf(multi_ids_values[i].trim()) === -1 &&
              items.indexOf(multi_ids_values[i].trim()) === -1) {
              show_flag = false;
              break;
            }
          }
          // 全フラグが存在すればボタンを表示
          if (show_flag) {
            $(elem).show();
          }
        } else {
          // 「-」付きのマルチフラグ処理
          var hide_flag = true; // ボタンを非表示にするか
          var multi_ids_values = multi_ids.substring(1).split(',');
          for (var i = 0; i < multi_ids_values.length; i++) {
            if (flags.indexOf(multi_ids_values[i].trim()) === -1 &&
              items.indexOf(multi_ids_values[i].trim()) === -1) {
              hide_flag = false;
              break;
            }
          }
          // 全フラグが存在すればボタンを非表示に
          if (hide_flag) {
            $(elem).hide();
          }
        }
      });

      // 指定のアイテムを所有している場合にだけボタンを表示（「-」で所持していない場合に非表示）
      for (var i = 0; i < items.length; i++) {
        $('a[title="' + items[i] + '"]', target).show();
        $('a[title="-' + items[i] + '"]', target).hide();
      }

      // 指定の魔法が利用できる場合にだけボタンを表示
      for(var key in Common.magic) {
        if (Util.canUseMagic(Common.magic[key])) {
          $('a[title="m' + key + '"]', target).show();
        }
      }

      /* BGM再生 */
      // 再生すべきBGMのパスを生成
      var tmp_path = '';
      var new_bgm = scene.attr('bgm');
      // セーブデータに保存済みのパスを取得（空の場合はメイン）
      if (save_data.bgm) {
        tmp_path = '/bgm_' + save_data.bgm + '.mp3';
      } else {
        tmp_path = '/bgm.mp3';
      }
      // bgm属性による上書き
      if(new_bgm !== undefined) {
        if(new_bgm === '') {
          tmp_path = '/bgm.mp3';
        } else {
          tmp_path = '/bgm_' + new_bgm + '.mp3';
        }
      }
      var audio_path = ROOT + scenario_code + tmp_path;

      // 初期立ち上げ時、画面遷移時（bgm属性ありで、以前から変化した）に再生
      if(!bgm ||
        (bgm && new_bgm !== undefined && new_bgm !== save_data.bgm)) {
        Util.playBgm(audio_path);
        if (new_bgm === undefined) {
          save_data.bgm = '';
        } else {
          save_data.bgm = new_bgm;
        }
      }
      /* BGM再生ココマデ */

      // シーン移動時にBGMを切替（旧コード）
      /*
      if(scene.attr('bgm')) {
        new_bgm_name = scene.attr('bgm');
        if(new_bgm_name === 'main') { new_bgm_name = ''; }
        // 現在再生中のBGMと異なる場合にのみ切替
        if(bgm_name !== new_bgm_name) {
          bgm_name = new_bgm_name;
          if(bgm) { bgm.pause(); }
          if(bgm_name === '') {
            var audio_path = ROOT + scenario_code + '/bgm.mp3';
          } else {
            var audio_path = ROOT + scenario_code + '/bgm_' + bgm_name + '.mp3';
          }
          bgm = new Audio(audio_path);
          bgm.loop = true;
          if(global_save_data.bgm) { bgm.play(); }
        }
      }
      */

      // シーン表示時に効果音を再生（未検証）
      if(scene.attr('se')) {
        var se = new Audio(ROOT + scenario_code + '/' + scene.attr('se') + '.mp3');
        se.loop = false;
        se.play();
      }

      // 現在のシーンのフラグ情報／アイテム／実績情報を反映
      Util.updateItems(scene.attr('items'));
      Util.updateFlags(scene.attr('flags'));
      Util.updateResults(scene.attr('result'));

      // 現在のシーン番号を保存
      save_data.scene = scene_num;
      save_data.ellapsed_scene++;

      // ストレージに反映
      Util.saveStorage();

      // エンディング処理
      Util.endScenario(scene.attr('end'));

      console.log(save_data);
    }
  };

  // プラグイン本体
  // 引数code：シナリオコード、またはシナリオ文字列
  // 引数debug：デバッグウィンドウを表示するか（既定はfalse）
  $.fn.extend({
    startGame: function(code, debug) {
      scenario_code = code;
      target = this;
      if(!debug) { debug = false; }
      debug_mode = debug;

      /** EventListener **/
      // 移動ボタンをクリックで次のシーンに移動
      target.on('click', 'a.scenebtn', function(e) {
        var num = $(this).attr('href');
        // 複数移動先が指定されている場合、ランダムに選択
        if (num.indexOf(',') !== -1) {
          num = Util.randomArray(num.split(',')).trim();
        }
        // 履歴に追加
        history.pushState(num, 'Scene ' + num);
        Util.createScene(num);
        e.preventDefault();
      });

      // 指定シーンに移動
      target.on('click', 'a.scene_move', function(e) {
        var num = $('#toscene').val();
        var allow_num = $(this).attr('data-allow');
        if(Util.canSceneMove(num, allow_num)) {
          history.pushState(num, 'Scene ' + num);
          Util.createScene(num);
        } else {
          Util.toast('指定された番号には移動できないようだ');
        }
        e.preventDefault();
      });

      // 敵一覧をクリックで詳細情報を表示
      target.on('click', 'tr.enemy_row', function(e) {
        var enemy = enemies_map[$(this).attr('data-enemy')];
        Util.toast('<b>' + enemy.name + '</b><br/>' + enemy.desc);
      });

      // ダイス回転音を準備
      var ad = new Audio(ROOT + COMMON + 'dice.mp3');

      // ダイスの回転
      var rotate_count;
      var rotateCube = function() {
        rotate_count++;
        $('#cubes').html(Util.cube(2));
        if(rotate_count > 20) { return; }
        setTimeout(rotateCube, 50);
      };
        
      // サイコロをリロード
      target.on('click', '#cubes', function(e) {
        ad.play();
        rotate_count = 1;
        rotateCube(this);
      });

      // ステータスオープンボタンでステータスダイアログを表示
      target.on('click', '#status_open', function(e) {
        Util.createDialog();
        e.preventDefault();
      });

      // 右クリック時にステータスダイアログを表示
      target.on('contextmenu', function(e) {
        Util.createDialog();
        e.preventDefault();
      });

      // BGMオンオフ
      target.on('click', '#audio_onoff', function(e) {
        if(bgm) {
          if (global_save_data.bgm) {
            global_save_data.bgm = false;
            $(this).attr('src', ROOT + COMMON + 'ctrl_audio_off.png');
            bgm.pause();
          } else {
            global_save_data.bgm = true;
            $(this).attr('src', ROOT + COMMON + 'ctrl_audio_on.png');
            bgm.play();
          }
          Util.saveStorageGlobal();
        }
      });

      // ステータス保存（ステータスダイアログ）
      $(document).on('click', '#dialog_body #status_save', function(e) {
        save_data.chara.hp = $('#dialog_body #hp').val();
        save_data.chara.mp = $('#dialog_body #mp').val();
        save_data.chara.free1 = $('#dialog_body #free1').val();
        save_data.chara.free2 = $('#dialog_body #free2').val();
        save_data.chara.str = $('#dialog_body #str').val();
        save_data.chara.int = $('#dialog_body #int').val();
        save_data.chara.dex = $('#dialog_body #dex').val();
        save_data.chara.krm = $('#dialog_body #krm').val();
        save_data.chara.state = $('#dialog_body [name="state"]:checked').val();
        save_data.stars[0] = $('#dialog_body #s_mon').val();
        save_data.stars[1] = $('#dialog_body #s_tue').val();
        save_data.stars[2] = $('#dialog_body #s_wed').val();
        save_data.stars[3] = $('#dialog_body #s_thu').val();
        save_data.stars[4] = $('#dialog_body #s_fri').val();
        save_data.stars[5] = $('#dialog_body #s_sat').val();
        save_data.stars[6] = $('#dialog_body #s_sun').val();
        save_data.memos    = $('#dialog_body #memos').val();
        Util.saveStorage();
        // ★mobile★
        dialog.slideUp(500);
        target.slideDown(500);
        //$.zoombox.close()
      });

      // ステータスダイアログのクローズ
      $(document).on('click', '#dialog_body #status_close', function(e) {
        dialog.slideUp(500);
        target.slideDown(500);
      });

      // 状態異常のステータスへの反映（ステータスダイアログ）
      $(document).on('click', '#dialog_body [name="state"]', function(e) {
        var delta = Util.deltaStatus($(this).val());
        $('#dialog_body #str_d').text('（' + delta[0] + '）');
        $('#dialog_body #int_d').text('（' + delta[1] + '）');
        $('#dialog_body #dex_d').text('（' + delta[2] + '）');
        $('#dialog_body #krm_d').text('（' + delta[3] + '）');
        $('#dialog_body #state_desc').text(delta[4]);
      });

      // 星の減算処理（magic：魔法情報、index：星番号0～6、name：星の名前）
      var useStar = function(magic, index, name) {
        if(magic[index] > 0) {
          var num = $('#dialog_body ' + name).val()
          $('#dialog_body ' + name).val(num - magic[index]);
        }
      };

      // 魔法実行時の星消費（ステータスダイアログ）未検証
      $(document).on('click', '#dialog_body #magic_run', function(e) {
        e.preventDefault();
        var magic = Common.magic[
          $('#dialog_body #magic option:selected').val()];
        if (!magic) { return; }
        if($('#dialog_body #s_mon').val() < magic[0] ||
           $('#dialog_body #s_tue').val() < magic[1] ||
           $('#dialog_body #s_wed').val() < magic[2] ||
           $('#dialog_body #s_thu').val() < magic[3] ||
           $('#dialog_body #s_fri').val() < magic[4] ||
           $('#dialog_body #s_sat').val() < magic[5] ||
           $('#dialog_body #s_sun').val() < magic[6]) {
          window.alert('星が不足しているため、魔法を発動できません！');
          return;
        }
        useStar(magic, 0, '#s_mon');
        useStar(magic, 1, '#s_tue');
        useStar(magic, 2, '#s_wed');
        useStar(magic, 3, '#s_thu');
        useStar(magic, 4, '#s_fri');
        useStar(magic, 5, '#s_sat');
        useStar(magic, 6, '#s_sun');
      });

      // ★mobile★
      $(document).on('click', '#dialog_body #status_change', function(e) {
        var b = $('#status_basic');
        if (b.css('display') === 'none') {
          $('#status_change').val('Equipment');
          $('#status_basic').show();
          $('#status_equip').hide();
        } else {
          $('#status_change').val('Basic Status');
          $('#status_basic').hide();
          $('#status_equip').show();
        }
      });

      // ［+］スピナーで直前のテキストボックス値をインクリメント
      $(document).on('click', '#dialog_body .spinner_up', function(e) {
        var prev = $(this).prev();
        prev.val(Number(prev.val()) + 1);
      });

      // ［-］スピナーで直後のテキストボックス値をインクリメント
      $(document).on('click', '#dialog_body .spinner_down', function(e) {
        var next = $(this).next();
        next.val(Number(next.val()) - 1);
      });

      // ボーナスアイテム一覧を表示
      target.on('click', '#item_list', function(e) {
        $.zoombox.html(dialog_item.html(), {
          width: 650,
          height: 450
        });
      });

      // ボーナスアイテムリストをクリックでアイテムの説明を表示
      $(document).on('click', '#dialog_list img.bonus_item', function(e) {
        var id = e.target.id;
        var o_bonus_item;
        if (id.startsWith('gi')) {
          o_bonus_item = Common.global_items.happy[id];
        } else {
          o_bonus_item = Common.global_items.bad[id];
        }
        $('#dialog_list #bonus_msg').text(o_bonus_item.name + '（' +
          o_bonus_item.desc + '）');
      });

      // ホームボタンでページ移動
      target.on('click', '#ctrl_home', function(e) {
        location.href = 'http://www.web-deli.com/sorcerian/next/stext.aspx';
      });

      // 実績情報を表示（旧リロードボタン）
      target.on('click', '#ctrl_reload', function(e) {
        $.get(ROOT + COMMON + 'dialog_result.html')
        .done(function(data) {
          // 実績の数
          var result_count = 0;
          // 獲得した実績の数
          var get_result = 0;
          var trophy = [ '', 'ノーマル', 'ブロンズ', 'シルバー', 'ゴールド', 'プラチナ' ];
          var dialog_results = $(data);
          Object.keys(results_map).forEach(function(key){
            result_count++;
            if (global_save_data['results'][scenario_code] !== undefined &&            
              global_save_data['results'][scenario_code].indexOf(key) !== -1) {
              get_result++;
              var row = '<tr>' +
                '<td><img src="' + ROOT + COMMON + 'trophy' + results_map[key].level +
                '.png" title="' + trophy[results_map[key].level] + '" /></td>' +
                '<td><h3>' +  results_map[key].name + '（Lv.' + 
                results_map[key].level + '）</h3>' +
                '<p>' +  results_map[key].desc + '</p></td>' +
                '</tr>';
            } else {
              var row = '<tr>' +
                '<td><img src="' + ROOT + COMMON + 'trophy0.png" title="実績未達" /></td>' +
                '<td><h3>???????????????</h3>' +
                '<p>???????????????</p></td>' +
                '</tr>';
            }
            $('.result_list', dialog_results).append(row);
          });
          // 到達度を反映
          var result_rate = (get_result / result_count * 100).toFixed(1);
          $('#result_rate', dialog_results).text('Rate:' + result_rate + '%');
          $.zoombox.html(dialog_results.html(),
          {
            width: 480,
            height: 200
          });
        });
      });

      // ヘルプボタンでページ移動
      target.on('click', '#ctrl_help', function(e) {
        window.open('http://d.hatena.ne.jp/sorcerian/20171220');
      });

      // コントロールパネルの表示／非表示
      target.on('click', '#scenario_title', function(e) {
        var ctrl = $('#control_panel');
        if(ctrl.css('display') === 'none') {
          $('#control_panel').slideDown();
          global_save_data.panel = true;
        } else {
          $('#control_panel').slideUp();
          global_save_data.panel = false;
        }
        Util.saveStorageGlobal();
      });

      // 履歴情報の復帰
      $(window).on('popstate', function(e) {
        Util.createScene(e.originalEvent.state);
      });

      // スプラッシュ画面クリック時に音楽を再生
      $(document).on('touchstart', '.zoombox_mask', function() {
        if(global_save_data.bgm && bgm.paused) {
          bgm.play();
        }
      });
      /** EventListener **/

      // グローバルセーブデータが存在しない場合は初期化
      if(localStorage[GLOBAL_SAVE_DATA_KEY]) {
        Util.loadStorageGlobal();
      } else {
        Util.initGlobalSaveData();
      }

      // bgm.mp3が存在したら、再生開始（旧コード）
      /*
      var audio_path = ROOT + scenario_code + '/bgm.mp3';
      $.get(audio_path).then(function() {
        bgm = new Audio(audio_path);
        bgm.loop = true;
        if(global_save_data.bgm) {
          bgm.play();
          //bgm.volume = 0.2;
        }
      });
      */

      // スプラッシュ画面の起動
      $.zoombox.open(ROOT + COMMON + 'title.png', { duration: 400 });

      // 初期化処理
      var done_read = function(result) {
        // シナリオデータを取得
        scenario_data = result;
        //console.log(scenario_data);

        // 魔法の星を演算（配列末尾に「星の種類 数...」を設定）
        for(var key in Common.magic) {
          var magic = Common.magic[key];
          var stars = '';
          var star_names = [ '月', '火', '水', '木', '金', '土', '太' ];
          for (var i = 0; i < 7; i++) {
            if(magic[i] > 0) {
              stars += star_names[i] + magic[i] + ' ';
            }
          }
          magic.push(stars);
        }
      
        // フラグ一覧を取得
        flags_map = {};
        $('flags > flag', scenario_data).each(function() {
          flags_map[$(this).attr('id')] = $(this).text().trim();
        });
        //console.log(flags_map);
      
        // モンスター覧を取得
        enemies_map = {};
        $('enemies > enemy', scenario_data).each(function() {
          enemies_map[$(this).attr('id')] = {
            name: $(this).attr('name'),
            element: $(this).attr('element'),
            attack: $(this).attr('attack'),
            func: $(this).attr('func'),
            desc: $(this).text()
          }
        });
        //console.log(enemies_map);
      
        // アイテム一覧を取得
        items_map = {};
        $('items > item', scenario_data).each(function() {
          items_map[$(this).attr('id')] = {
            name: $(this).attr('name'),
            desc: $(this).text().trim()
          };
        });
        //console.log(items_map);

        // 実績一覧を取得
        results_map = {};
        $('results > result', scenario_data).each(function() {
          results_map[$(this).attr('id')] = {
            name: $(this).attr('name'),
            level: $(this).attr('level'),
            desc: $(this).text().trim()
          };
        });
        //console.log(results_map);

        // デバッグモードではシナリオのデータ検証
        if (debug_mode === true) {
          var errors = Util.validateScenario();
          console.log('検証結果' + errors);
          if (errors.length !== 0) {
            var msgs = '<h3>scenario.xmlでエラーが検出されました。</h3>';
            msgs += '<ul class="errorlist">';
            errors.forEach(function(err) {
              msgs += '<li>Scene ' + err.scene_id + ': ' + err.message + '</li>';
            });
            msgs += '</ul>';
            target.html(msgs);
            return;
          }
        }
      
        // ストレージに情報がある場合は続きから再開
        if (localStorage[scenario_code]) {
          if (confirm('以前のデータが残っています。' +
              '\r続きから開始しますか？')) {
            Util.loadStorage();
            Util.initDialog();
            // 再開時に経過日数の加算分を減算
            save_data.ellapsed_scene--;
            var num = save_data.scene;
            Util.createScene(num);
            history.pushState(num, 'Scene ' + num);
            return;
          }
        }
      
        // ストレージに情報がない場合には最初からゲームを開始
        // ゲーム情報を初期化
        Util.initScenario();
      
        window.alert('キャラが新規作成されました。\r' +
          'ステータスダイアログは画面右クリックで開くことができます。');
      };
      
      // シナリオコード
      scenario_code = scenario_code.trim();
      // 文字列が渡された場合には、シナリオデータとして処理
      if (scenario_code.indexOf('<') === 0) {
        var tmp_data = $(scenario_code);
        scenario_code = 'playground';
        global_save_data['results']['playground'] = [];
        Util.saveStorageGlobal();
        done_read(tmp_data);
      // シナリオコードが渡された場合にはscenario.xmlを読み込み
      } else {
        $.get(ROOT + scenario_code + '/scenario.xml')
          .done(done_read)
          .fail(function(xhr, status, error) {
            throw new Error('scenario code is invalid.');
          });
      }
    },
    // GBAT形式からSText形式への変換
    // this：ファイル選択ボックス
    // 引数callback：変換結果の変更方法を表す関数（引数）。無指定時はファイルダウンロード
    gbat2stext: function(callback) {
      $(this).change(function(e) {
        // 現在読み取り中のファイル番号（0～inputs.length - 1）
        var file_num = 0;

        // シナリオデータの外枠を準備
        var result = $('<scenario ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
        'xsi:noNamespaceSchemaLocation="http://www.web-deli.com/sorcerian/next/stext/common/sgml.xsd">\n' +
        '</scenario>');
        var items = $('<items>\n</items>');
        var flags = $('<flags>\n</flags>');
        var enemies = $('<enemies>\n</enemies>');
        var results = $('<results>\n</results>');
        var license = $('<license>\n</license>');
        
        // 個々のファイルを変換
        var readFile = function(e) {
          // .gbatファイルを取得
          var gbat = $(this.result);

          // title／author属性を設定（最初のひとつを優先）
          var title_author = $('title', gbat).text().trim().split('@');
          if (!result.attr('title')) {
            result.attr('title', title_author[0]);
            result.attr('author', title_author[1]);
          }

          // section要素を順に処理
          $('section', gbat).each(function(i, section) {
            // ヘッダーを処理中であるか
            var header_on = false;
            // 各種属性を初期化
            var attrs = { };

            // id値を設定（1は強制的に0に）
            attrs.id = Number($('number', section).text());
            if(attrs.id === 1) { attrs.id = 0; }

            if ($('> summary', section).text().toLowerCase() === 'link') {
              return true;
            }

            // テキストを生成
            var body = '\n';
            // text要素配下のパラグラフを順に出力
            $('> text p', section).each(function(j, para) {
              var tmp_para = $(para).text();
              // 「@@」でヘッダー処理のオンオフ
              if (tmp_para.trim() === '@@') {
                header_on = !header_on;
                return true;
              }

              // ヘッダー処理中の場合
              if (header_on) {
                // 空行はスキップ
                if(!tmp_para) { return true; }
                // アイテム処理
                if (tmp_para.indexOf('i') === 0) {
                  var item = tmp_para.split(':')
                  $('<item></item>')
                    .attr('id', item[0])
                    .attr('name', item[1])
                    .text(item[2])
                    .appendTo(items);
                // フラグ処理
                } else if (tmp_para.indexOf('f') === 0) {
                  var flag = tmp_para.split(':')
                  $('<flag></flag>')
                    .attr('id', flag[0])
                    .text(flag[1])
                    .appendTo(flags);          
                // 敵／罠の処理
                } else if (tmp_para.indexOf('m') === 0) {
                  var enemy = tmp_para.split(':')
                  $('<enemy></enemy>')
                    .attr('id', enemy[0])
                    .attr('name', enemy[1])
                    .attr('element', enemy[2])
                    .attr('attack', enemy[3])
                    .attr('func', enemy[4])
                    .text(enemy[5])
                    .appendTo(enemies);
                // 実績の処理
                } else if (tmp_para.indexOf('r') === 0) {
                  var result = tmp_para.split(':')
                  $('<result></result>')
                    .attr('id', result[0])
                    .attr('name', result[1])
                    .attr('level', result[2])
                    .text(result[3])
                    .appendTo(results);
                // ライセンス処理 
                } else if (tmp_para.indexOf('w') === 0) {
                  var work = tmp_para.split(':')
                  $('<work></work>')
                    .attr('name', work[1])
                    .attr('category', work[2])
                    .attr('creator', work[3])
                    .attr('url', work[4])
                    .appendTo(license);                    
                // シーン個別の属性を処理
                } else if (tmp_para.indexOf('@') === 0) {
                  var attr = tmp_para.substring(1).split(':');
                  // ★未検証★空文字列を認識するように
                  if(attr[1] === undefined) { attr[1] = ''; }
                  attrs[attr[0]] = attr[1];
                }
              // ヘッダー処理オフの場合、本文として追加
              } else {
                body += tmp_para + '\n';
              }
            });
            body += '\n';
            // choise要素配下の分岐を順に出力
            $('choices choice', section).each(function(k, cho) {
                var caption = $('text p', cho).text().trim().split('@');
                var dest = $('destination', cho).text();

                // 「999」は自由移動ボックス、それ以外はリンクボタン
                if (dest === '999') {
                  var tmp = '[';
                  tmp += caption[0];
                  tmp += '](X)\n';
                } else {
                  var tmp = '[';
                  tmp += caption[0];
                  tmp += '](';
                  tmp += dest;
                  // ランダム分岐
                  if (caption[2]) {
                    tmp += ',' + caption[2];
                  }
                  // フラグ／アイテム条件
                  if (caption[1]) {
                    tmp += ' "' + caption[1] + '"';
                  }
                  tmp += ')\n';
                }
                body += tmp;
            });

            // scene要素を組み立て
            var scene = $('<scene></scene>\n')
              .attr('id', attrs.id)
              .text(body);
            if (attrs.items !== undefined) { scene.attr('items', attrs.items); }
            if (attrs.flags !== undefined) { scene.attr('flags', attrs.flags); }
            if (attrs.enemies !== undefined) { scene.attr('enemies', attrs.enemies); }
            if (attrs.bgm !== undefined) { scene.attr('bgm', attrs.bgm); }
            if (attrs.se !== undefined) { scene.attr('se', attrs.se); }
            if (attrs.allowMove !== undefined) { scene.attr('allowMove', attrs.allowMove); }
            if (attrs.result !== undefined) { scene.attr('result', attrs.result); }
            if (attrs.end !== undefined) { scene.attr('end', attrs.end); }
            scene.appendTo(result);
          });

          // 共通情報を追加
          license.prependTo(result);
          results.prependTo(result);
          enemies.prependTo(result);
          flags.prependTo(result);
          items.prependTo(result);

          // 未処理のファイルがなくなったら出力処理
          file_num++;
          if (file_num >= inputs.length) {
            // コールバックが指定されていたら、それで処理
            if (callback) {
              callback(result);
            // さもなければ、ダウンロード処理
            } else {
              var content = '<?xml version="1.0" encoding="utf-8"?>\n' +
                result.get(0).outerHTML;
              var blob = new Blob([ content ], { 'type': 'application/octet-stream' });
              //location.href = window.URL.createObjectURL(blob);
              var anchor = document.createElement('a');
              anchor.href = window.URL.createObjectURL(blob);
              anchor.download = 'scenario.xml';
              anchor.click();
            }
          // 未処理のファイルがある場合は処理継続
          } else {
            reader.readAsText(inputs[file_num], 'UTF-8');    
          }
        };

        // ファイルの読み込みを開始
        var inputs = $(this).get(0).files;
        var reader = new FileReader();
        $(reader).on('load', readFile);
        reader.readAsText(inputs[file_num], 'UTF-8');
      });
    }
  });
})(jQuery);
