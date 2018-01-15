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

  // 現在再生中のBGM
  var bgm;

  // 基本データ
  var Common = {
    // 男性の名前
    male_name  : [ 'ボブ', 'デュエル', 'ゴルカス', 'ジェノバン', 'グーラン', 'ジャンビエ', 'グログス', 'コル', 'フロニアス', 'グーリム', 'カザミィ', 'ソロン', 'ゼン', 'ヴォル', 'マルス', 'レイザー', 'ミリオン', 'エリック', 'ジロ', 'ソード', 'ディル', 'ガタビア', 'ラウア', 'ハルビン', 'グドン', 'ジャミル', 'ディカン', 'ダート', 'タットワ5世', 'ディカン', 'ホド', 'ゲプラー', 'コクマー', 'グレアム', 'ロウポー', 'ラッツ', 'ソルト', 'ランブル', 'ネイル', 'ルシアン', 'ギム', 'チェイサー', 'ルワン', 'ゾーク', 'オルム', 'テュモー', 'バロン', 'カメロン', 'トード', 'グンダ', 'フラジオレ', 'ファン＝フレディ', 'ファネッサ3世', 'クリフト4世', 'クォール', 'ディオン', 'ホゼア', 'ロラッド', 'バルナ', 'ティゲロ', 'テト', 'ニフト', 'オーサー', 'ゲディス', 'レオン', 'アンドリュー', 'キリー', 'トーマス', 'エディ', 'ノーマス', 'ギルデン', 'ノーネーム', 'ユイター', 'デュオン', 'ペトス', 'フェリス', 'スラン', 'アルフレッド', 'ソクラム', 'アルモス', 'ログレック', 'ラルーゴ', 'キッド', 'ドレイク', 'ウォルトス', 'レスター', 'テリー', 'グラハン', 'ラドール', 'ウェステル', 'フェスタ', 'バンブー', 'ゲルフス', 'ドン・コサック', 'ベオグラード', 'ピエール', 'タルフ', 'エヴァン', 'ドゥール', 'バルガス', 'アーサー', 'ガッシュ', 'エルウッド', 'ヘルナー', 'エリック', 'ジャグラー', 'アラン', 'ロニアス', 'アスタル', 'ボルックス', 'ラドナー', 'ギルバレス', 'ジャレス', 'ルー', 'スズキ', 'ジロサ', 'サントリーニ', 'ルルイエ', 'コーラル', 'ボマード', 'ナルシス', 'マーヴァル', 'クール', 'ヨシュア', 'エヴァム', 'ジャンク', 'ボイド', 'ヘクター', 'デンキブラウン', 'バイアス', 'ブロイム', 'ディンギル', 'リグ', 'バド', 'ジード', 'ラルザス', 'ガイキナ', 'ロッド', 'ケイン', 'ルーミス', 'タジート', 'ブレイス', 'ディンクス', 'マーク', 'ホホホ', 'テシター', 'J.B', 'ジン', 'マック', 'リラ', 'ジバ', 'バーラン', 'ポジティル', 'ネガティル', 'ファルカス', 'ファウネス', 'ファルカス', 'チェン', 'パズス12世', 'タムタム', 'リーク・ディオン', 'タウラー', 'ラルディ', 'ノーマス', 'アドロン', 'ロカルノ', 'ゲラン', 'シュヴェーリン', 'ローラン', 'ウェッジ', 'アントロノフ', 'キム', 'ヤン', 'デフ', 'ミケロ', 'クール', 'ティエンルン', 'コウ', 'マルク', 'オーエン', 'トート', 'グート', 'マウアー', 'ザンダー', 'バルダ', 'キーリエ', 'マルス', 'セム', 'ターバ', 'グロス', 'クルトン', 'ザムル', 'エルフィン', 'グラハン', 'ガウェイン', 'アドル', 'ゴーバン', 'ドギ', 'ルタ', 'ダレス', 'ダルク＝ファクト', 'クーブラ＝カーン', 'ガルシウス', 'クロノス', 'カイロス', 'ディアルド', 'チッタ', 'カズン', 'ルイス', 'セネリー', 'ライネル', 'エス', 'カリー', 'ドレイク', 'ダニー', 'ドリー', 'ケイリス', 'ノートン', 'クラウド', 'ウォーリー', 'レイモンド', 'サザール', 'メテオロイド', 'ナッシュ', 'ルロイ', 'ライトル', 'カディアン', 'ブラウン', 'シュナイダー', 'セシル', 'グレンザー', 'ゴイル', 'ビル', 'グリメルム', 'ガルベス', 'ジルドバ', 'アレクシウスX世', 'ピエール', 'ジェラルド', 'ロベルト', 'エティス', 'アル＝ファルコ', 'ラシーン', 'ロデム', 'J.D.マックス', 'パーム', 'シド' ],
    // 女性の名前
    female_name: [ 'エスター', 'クリスティ', 'アイリーン', 'フェルディナン', 'リタ', 'トーヤ', 'ノルン', 'ウィンディーネ', 'プリム', 'ピアナ', 'エメラーダ', 'エレア', 'エヴァ', 'リム', 'ビナー', 'ティファレト', 'ミラドゥ', 'パナシェ', 'ミモザ', 'リューズ', 'エレーナ', 'リーア', 'キアラ', 'オルアラ', 'クオレ', 'セーナ', 'リーザ', 'セリナ', 'リリィ', 'ピピ', 'ビヌス', 'アンナ', 'リュシエル', 'フィレン', 'カレン', 'エリン', 'ローラ', 'マーベラ', 'ジョセフィーヌ', 'アネリーナ', 'リオナ', 'ジョアンナ', 'レニッサ', 'ジェニス', 'グリンダ', 'マティナ', 'ローナ', 'コッキー', 'チェルシー', 'ネリス', 'アリーナ', 'フェリッサ', 'マリエル', 'ベララ', 'ジョゼフ', 'ニッカ', 'テキーラ', 'ソルティ', 'パイン', 'ウィズ', 'カンニバル', 'ミント', 'リーン', 'ミル', 'ディアンナ', 'レティア', 'サフィス', 'エミス', 'ヴァムリー', 'サリア', 'ナイジェス', 'ミューリア', 'エミリア', 'シャル', 'バーバラ', 'オビア', 'スチュアート', 'ベーラ', 'サマリーヌ', 'フィアネ', 'レナ', 'ソル', 'ネイラ', 'セレーネ', 'アルバ', 'ラン', 'ルー・パズス', 'シルフィ', 'ミレット', 'レフィーナ', 'モスマ', 'チブル', '鈴鈴', '明明', 'ティキ', 'サリア', 'ミュール', 'ダール', 'ミンナ', 'レーシャ', 'エレイア', 'レア', 'フィーナ', 'ジャネット', 'ナリス', 'ソチ', 'ポーラス', 'ロキア', 'フリージ', 'エスメレー', 'エレナ', 'アルティ', 'エビオラ', 'フィナ' ],
    // 称号
    title: ['武器屋の親父', 'ペンタウァの長老', 'トラベラーズインの宿主', '人と上手に話したい', 'ペンタウァ近衛隊長', '', 'タリスマンの見張り', '瞑想中', '砂漠の飯炊き', '狂戦士', 'エレベーターの管理人', '盗賊の頭領', '暗き沼の魔法使い', 'ロマンシア国王', 'アゾルバ国王', 'ペンタウァ国王', '蚕職人', '妖精王', '暗黒の魔導士', 'クイーンマリー号船長', 'キタブ・アル・アジフの持ち主', 'メデューサハンターの弟子', 'ファルコムマン', '戦士の亡霊', '海賊の子孫', 'いけにえの神官', '東の村の村長', '麻薬中毒者', 'ヴァネルバの王', '銀の竪琴屋', '近衛隊長', '復讐の呪術師', 'ラフォーヌの森の管理人', 'リドニア王国の元兵士', '姫の教育係', '大魔王', '紫ウニの王子', 'ベララの家族', '時計塔の番人', '時計塔の魔女', 'ナルキッソス号船長', 'ディンギル王国の3神官', 'バドティビラ工場の指揮官', 'シュメール国王', 'サンサーラの山賊', '南村の村長', 'アイテム屋WIZの店主', '旅の吟遊詩人', '古代イスマリアの王', '時の神殿の書記官', '闇の王', 'ランドル村長', '魔法学校の校長', '魔法学校の用務員', 'マリオネットの王', 'ペンタウァの近衛兵', '陽の中の闇人', '赤毛の冒険者', '光の王', 'イリアスンの執政官', '魔の下僕', 'メデューサハンター', '邪神教徒', '邪神教々祖', '砂漠の王', '鍵の番人', 'ローデシア辺境司令官', '宇宙からの訪問者', '黒竜仙人', '猿大聖', '極楽寺の僧兵', 'ジャグラー族', '迷宮建築の第一人者', 'フリース村の村長', 'ペンタウァ一の科学者アンド予言者', '暴れザル', '魔法学校の校長', '人魚３姉妹の長女', 'マリオネットの王', '探求の学徒', '旅芸人の一座', '猛獣使い', '流れの傭兵', '氷の魔女', 'パペッテの人形遣い', 'バーテンダー', '宮仕えのシャーマン', '薬草亭の主人', '水門の管理人' ],

    // キャラクター初期値（種族、性別、HP、MP、STR、INT、DEX、KRM）
    pc_init: [
      ['FIGHTER', 'MALE',   90, 50,  7,  3,  6, 4],
      ['FIGHTER', 'FEMALE', 85, 55,  6,  4,  6, 4],
      ['WIZARD',  'MALE',   90, 50,  4, 10,  4, 2],
      ['WIZARD',  'FEMALE', 90, 50,  3,  9,  5, 3],
      ['DWARF',   'MALE',   90, 50, 10,  0,  9, 1],
      ['DWARF',   'FEMALE', 90, 50,  9,  1, 10, 0],
      ['ELF',     'MALE',   90, 50,  3,  6,  6, 5],
      ['ELF',     'FEMALE', 90, 50,  1,  7,  6, 6]
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
        'bgi01' : { name: '塩酸', desc: '左サイコロが2以下の時、そのシーンでHPを1減算' },
        'bgi02' : { name: '紅玉', desc: '右サイコロが2以下の時、そのシーンでMPを1減算' },
        'bgi03' : { name: '血まみれの斧', desc: '呪い状態で冒険を開始する' },
        'bgi04' : { name: 'トリカブト', desc: '毒状態で冒険を開始する' },
        'bgi05' : { name: 'ギャルのパンティー', desc: '忘却状態で冒険を開始する' },
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
      }
      return data;
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
      var hp_m = this.random(pc_base[2] - 10, pc_base[2] + 10);
      var mp_m = this.random(pc_base[3] - 10, pc_base[3] + 10);
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
          // 強さ（0～10）
          str: this.minMaxGuard(this.random(pc_base[4] - 2, pc_base[4] + 2)),
          // 賢さ（0～10）
          int: this.minMaxGuard(this.random(pc_base[5] - 2, pc_base[5] + 2)),
          // 器用さ（0～10）
          dex: this.minMaxGuard(this.random(pc_base[6] - 2, pc_base[6] + 2)),
          // 魅力（0～10）
          krm: this.minMaxGuard(this.random(pc_base[7] - 2, pc_base[7] + 2)),
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
        bgm: true,
        panel: true
      };
      this.saveStorageGlobal(GLOBAL_SAVE_DATA_KEY);
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
          var state_desc = 'すべてのステータスを-1（10scene経過で死亡）';
          var str_d = -1;
          var int_d = -1;
          var dex_d = -1;
          var krm_d = -1;
          break;
        case 'forget' :
          var state_desc = 'STR／INTのうち、高い方が0に';
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
          $('#age',  dialog).text(save_data.chara.age);
          $('#chara_face', dialog).attr('src',
            ROOT + COMMON + String(save_data.chara.sex).toLowerCase() + '_' +
              String(save_data.chara.age).toLowerCase() + '_' + 
              String(save_data.chara.race).toLowerCase() + '.png');
          if(save_data.bonus) {
            var b = Util.getBonusItem(save_data.bonus);
            $('#bonus', dialog).text(b.desc + '（' + b.name + '）');
          }
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
            if (global_save_data.items.includes(num)) {
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
            if (global_save_data.items.includes(num)) {
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
      $('#str', dialog).text(save_data.chara.str);
      $('#int', dialog).text(save_data.chara.int);
      $('#dex', dialog).text(save_data.chara.dex);
      $('#krm', dialog).text(save_data.chara.krm);
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
        var tmp = '<option ';
        if (i == save_data.flags.length - 1) { tmp += 'selected'; }
        tmp += '>・' + flags_map[save_data.flags[i]] + '</option>';
        flags.append(tmp);
      }

      // 現在所持しているフラグ一覧を表示（旧コード）
      //var flags = [];
      //for(var i = 0; i < save_data.flags.length; i++) {
      //  flags.push('・' + flags_map[save_data.flags[i]]);
      //}
      //$('#flags', dialog).text(flags.join('\r'));

      $.zoombox.html(dialog.html(),
        {
          width: 640,
          height: 480
        }
      );
    },

    // エンディングの処理（resultはhappy／bad）
    endScenario: function(result) {
      if(!result) { return; }

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
    canSceneMove: function(scene_num) {
      var scene = $('scene[id="' + scene_num + '"][allowMove]', scenario_data);
      return scene.length != 0 ? true : false;
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

      // シーンテキストの整形
      target.text(scene.text());
      target.markdown();

      // ヘッダーテキスト／コントロールパネルの生成（旧コード）
      /*
      $('<h5 id="scenario_title">' + 
        '<img id="status_open" src="' + ROOT + COMMON + 'status_open.png" />　' +
        '<span id="item_list">' +
        $('scenario', scenario_data).attr('title') +
          '【' + scene_num + '】</span>' + 
          '<img id="audio_onoff" src="' + ROOT + COMMON + 'audio_' +
          (global_save_data.bgm ? 'on' : 'off') + '.png" /></h5>')
        .prependTo(target);
      */
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
        '<img id="ctrl_reload" src="' + ROOT + COMMON + 'ctrl_reload.png" />　' +
        '<img id="ctrl_help" src="' + ROOT + COMMON + 'ctrl_help.png" />' +
        '</div>')
        .prependTo(target);

      // パネル非表示状態になっている場合、パネルを非表示に
      if(!global_save_data.panel) {
        $('#control_panel').hide();
      }

      // サイコロの表示
      target.append('<center id="cubes">' + Util.cube(2) + '</center>');

      // 移動ボタンの整形
      $('a', target).addClass('scenebtn');

      // 移動用ボタンの整形
      $('a[href="X"]', target)
        .removeClass('scenebtn')
        .addClass('scene_move')
        .text('移動する')
        .before('<input type="number" id="toscene" class="scene_move" />')
        .add('#toscene')
        .wrapAll('<div></div>');

      // 挿絵の整形
      var a_img = $('a:has(img)', target);
      var img_path = ROOT + scenario_code + '/' + CAPTURE + a_img.attr('href');
      a_img.attr('href', img_path)
        .removeClass('scenebtn')
        .addClass('scenepic')
        .find('img')
        .attr('src', img_path);
      $('a.scenepic').zoombox();

      // シーンのモンスター情報を取得
      if(scene.attr('enemies')) {
        var e_table = 
          $('<table class="enemy">');
        var enemies = scene.attr('enemies').split(',');
        for (var i = 0; i < enemies.length; i++) {
          var enemy = enemies_map[enemies[i]];
          var row = '<tr><th>' + enemy.name;
          if(enemy.element) { row += '（' + enemy.element + '）'; }
          row += '</th><td>' + enemy.attack + '</td><td>';
          if(enemy.func) { row += Util.selectFunc(enemy.func); }
          row += '</td><td>' + this.dropItem(enemy.element);
          row += '</td><td>' + enemy.desc + '</td></tr>';
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

      // 指定のフラグを所持している場合にだけボタンを表示（複数フラグ対応）
      var multi_flags = $('a[title*=","]', target);     
      multi_flags.each(function(index, elem) {
        var multi_ids = $(elem).attr('title');
        if (multi_ids.indexOf('-') !== 0) {
          // 通常のマルチフラグ処理（指定フラグを全て所有でボタン表示）
          var show_flag = true; // ボタンを表示するか
          var multi_ids_values = multi_ids.split(',');
          for (var i = 0; i < multi_ids_values.length; i++) {
            if (flags.indexOf(multi_ids_values[i].trim()) === -1) {
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
            if (flags.indexOf(multi_ids_values[i].trim()) === -1) {
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

      // 指定のアイテムを所有している場合にだけボタンを表示
      for (var i = 0; i < items.length; i++) {
        $('a[title="' + items[i] + '"]', target).show();
      }

      // 指定の魔法が利用できる場合にだけボタンを表示
      for(var key in Common.magic) {
        if (Util.canUseMagic(Common.magic[key])) {
          $('a[title="m' + key + '"]', target).show();
        }
      }

      // シーン表示時に効果音を再生（未検証）
      if(scene.attr('se')) {
        var se = new Audio(ROOT + scenario_code + '/' + scene.attr('se') + '.mp3');
        se.loop = false;
        se.play();
      }

      // 現在のシーンのフラグ情報／アイテム情報を反映
      Util.updateItems(scene.attr('items'));
      Util.updateFlags(scene.attr('flags'));

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

  // プラグイン本体（引数codeはシナリオコード、またはシナリオ文字列）
  $.fn.extend({
    startGame: function(code) {
      scenario_code = code;
      target = this; 

      /** EventListener **/
      // 移動ボタンをクリックで次のシーンに移動
      target.on('click', 'a.scenebtn', function(e) {
        var num = $(this).attr('href');
        history.pushState(num, 'Scene ' + num);
        Util.createScene(num);
        e.preventDefault();
      });

      // 指定シーンに移動
      target.on('click', 'a.scene_move', function(e) {
        var num = $('#toscene').val();
        if(Util.canSceneMove(num)) {
          history.pushState(num, 'Scene ' + num);
          Util.createScene(num);
        } else {
          window.alert('その番号には移動できません。');
        }
        e.preventDefault();
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
        $.zoombox.close()
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
        window.open('http://www.web-deli.com/sorcerian/next/stext.aspx');
      });

      // リロードボタンでページリロード
      target.on('click', '#ctrl_reload', function(e) {
        location.reload();
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

      // bgm.mp3が存在したら、再生開始
      var audio_path = ROOT + scenario_code + '/bgm.mp3';
      $.get(audio_path).then(function() {
        bgm = new Audio(audio_path);
        bgm.loop = true;
        if(global_save_data.bgm) {
          bgm.play();
        }
      });

      // スプラッシュ画面の起動
      $.zoombox.open(ROOT + COMMON + 'title.png', { duration: 400 });

      // 初期化処理
      var done_read = function(result) {
        // シナリオデータを取得
        scenario_data = result;
        console.log(scenario_data);
      
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
        $('flags > flag', scenario_data).each(function() {
          flags_map[$(this).attr('id')] = $(this).text().trim();
        });
        console.log(flags_map);
      
        // モンスター覧を取得
        $('enemies > enemy', scenario_data).each(function() {
          enemies_map[$(this).attr('id')] = {
            name: $(this).attr('name'),
            element: $(this).attr('element'),
            attack: $(this).attr('attack'),
            func: $(this).attr('func'),
            desc: $(this).text()
          }
        });
        console.log(enemies_map);
      
        // アイテム一覧を取得
        $('items > item', scenario_data).each(function() {
          items_map[$(this).attr('id')] = {
            name: $(this).attr('name'),
            desc: $(this).text().trim()
          };
        });
        console.log(items_map);
      
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
        done_read($(scenario_code));
      // シナリオコードが渡された場合にはscenario.xmlを読み込み
      } else {
        $.get(ROOT + scenario_code + '/scenario.xml')
          .done(done_read)
          .fail(function(xhr, status, error) {
            throw new Error('scenario code is invalid.');
          });
      }
    }
  });
})(jQuery);
