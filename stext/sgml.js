(function($) {
  // ルートパス
  var ROOT = 'stext/';
  var COMMON  = 'common/'
  //var DIALOG  = 'dialog/'
  var CAPTURE  = 'capture/'
  var BGM = 'bgm/'
  var SE = 'se/'

  // シナリオコード
  var scenario_code;

  // シナリオデータ
  var scenario_data;

  // 利用可能なジョブ
  var enabled_jobs;

  // フラグ一覧
  var flags_map = {};

  // パラメーター一覧
  var params_map = {};

  // モンスター一覧
  var enemies_map = {};

  // アイテム一覧
  var items_map = {};

  // 実績一覧
  var results_map = {};

  // BGM一覧
  var bgms_map = {};

  // セーブデータ
  var save_data;

  // グローバルセーブデータ
  var global_save_data;
  var GLOBAL_SAVE_DATA_KEY = 'sorcerian_text';

  // ターゲット要素（ゲームブックの表示先）
  var target;

  // ダイアログ本体（ステータスダイアログ／アイテムリスト）
  //var dialog;
  //var dialog_item;

  // ダイアログ本体（改訂版）
  var dialog_elem = {};

  // デバッグモードか
  var debug_mode = false;

  // 現在再生中のBGM
  var bgm;
  var bgm_name; // 名前（bgm属性の指定値「@field01」など。メインは空）

  // 利用するストレージ
  var storage = localStorage;

  // 現在のダイス
  var dice_obj = null;

  // ダイスの現在値（旧）
  var dice = [ 1, 1 ];

  // シーン単位のツイートメッセージ
  var tweet_message;

  // 基本データ
  var Common = {
    // 男性の名前
    male_name  : [ 'ボブ', 'デュエル', 'ゴルカス', 'ジェノバン', 'グーラン', 'ジャンビエ', 'グログス', 'コル', 'フロニアス', 'グーリム', 'カザミィ', 'ソロン', 'ゼン', 'ヴォル', 'マルス', 'レイザー', 'ミリオン', 'エリック', 'ジロ', 'ソード', 'ディル', 'ガタビア', 'ラウア', 'ハルビン', 'グドン', 'ジャミル', 'ディカン', 'ダート', 'タットワ5世', 'ディカン', 'ホド', 'ゲプラー', 'コクマー', 'グレアム', 'ロウポー', 'ラッツ', 'ソルト', 'ランブル', 'ネイル', 'ルシアン', 'ギム', 'チェイサー', 'ルワン', 'ゾーク', 'オルム', 'テュモー', 'バロン', 'カメロン', 'トード', 'グンダ', 'フラジオレ', 'ファン＝フレディ', 'ファネッサ3世', 'クリフト4世', 'クォール', 'ディオン', 'ホゼア', 'ロラッド', 'バルナ', 'ティゲロ', 'テト', 'ニフト', 'オーサー', 'ゲディス', 'レオン', 'アンドリュー', 'キリー', 'トーマス', 'エディ', 'ノーマス', 'ギルデン', 'ノーネーム', 'ユイター', 'デュオン', 'ペトス', 'フェリス', 'スラン', 'アルフレッド', 'ソクラム', 'アルモス', 'ログレック', 'ラルーゴ', 'キッド', 'ドレイク', 'ウォルトス', 'レスター', 'テリー', 'グラハン', 'ラドール', 'ウェステル', 'フェスタ', 'バンブー', 'ゲルフス', 'ドン・コサック', 'ベオグラード', 'ピエール', 'タルフ', 'エヴァン', 'ドゥール', 'バルガス', 'アーサー', 'ガッシュ', 'エルウッド', 'ヘルナー', 'エリック', 'ジャグラー', 'アラン', 'ロニアス', 'アスタル', 'ボルックス', 'ラドナー', 'ギルバレス', 'ジャレス', 'ルー', 'スズキ', 'ジロサ', 'サントリーニ', 'ルルイエ', 'コーラル', 'ボマード', 'ナルシス', 'マーヴァル', 'クール', 'ヨシュア', 'エヴァム', 'ジャンク', 'ボイド', 'ヘクター', 'デンキブラウン', 'バイアス', 'ブロイム', 'ディンギル', 'リグ', 'バド', 'ジード', 'ラルザス', 'ガイキナ', 'ロッド', 'ケイン', 'ルーミス', 'タジート', 'ブレイス', 'ディンクス', 'マーク', 'ホホホ', 'テシター', 'J.B', 'ジン', 'マック', 'リラ', 'ジバ', 'バーラン', 'ポジティル', 'ネガティル', 'ファルカス', 'ファウネス', 'ファルカス', 'チェン', 'パズス12世', 'タムタム', 'リーク・ディオン', 'タウラー', 'ラルディ', 'ノーマス', 'アドロン', 'ロカルノ', 'ゲラン', 'シュヴェーリン', 'ローラン', 'ウェッジ', 'アントロノフ', 'キム', 'ヤン', 'デフ', 'ミケロ', 'クール', 'ティエンルン', 'コウ', 'マルク', 'オーエン', 'トート', 'グート', 'マウアー', 'ザンダー', 'バルダ', 'キーリエ', 'マルス', 'セム', 'ターバ', 'グロス', 'クルトン', 'ザムル', 'エルフィン', 'グラハン', 'ガウェイン', 'アドル', 'ゴーバン', 'ドギ', 'ルタ', 'ダレス', 'ダルク＝ファクト', 'クーブラ＝カーン', 'ガルシウス', 'クロノス', 'カイロス', 'ディアルド', 'チッタ', 'カズン', 'ルイス', 'セネリー', 'ライネル', 'エス', 'カリー', 'ドレイク', 'ダニー', 'ドリー', 'ケイリス', 'ノートン', 'クラウド', 'ウォーリー', 'レイモンド', 'サザール', 'メテオロイド', 'ナッシュ', 'ルロイ', 'ライトル', 'カディアン', 'ブラウン', 'シュナイダー', 'セシル', 'グレンザー', 'ゴイル', 'ビル', 'グリメルム', 'ガルベス', 'ジルドバ', 'アレクシウスX世', 'ピエール', 'ジェラルド', 'ロベルト', 'エティス', 'アル＝ファルコ', 'ラシーン', 'ロデム', 'J.D.マックス', 'パーム', 'シド' ],
    // 女性の名前
    female_name: [ 'エスター', 'クリスティ', 'アイリーン', 'フェルディナン', 'リタ', 'トーヤ', 'ノルン', 'ウィンディーネ', 'プリム', 'ピアナ', 'エメラーダ', 'エレア', 'エヴァ', 'リム', 'ビナー', 'ティファレト', 'ミラドゥ', 'パナシェ', 'ミモザ', 'リューズ', 'エレーナ', 'リーア', 'キアラ', 'オルアラ', 'クオレ', 'セーナ', 'リーザ', 'セリナ', 'リリィ', 'ピピ', 'ビヌス', 'アンナ', 'リュシエル', 'フィレン', 'カレン', 'エリン', 'ローラ', 'マーベラ', 'ジョセフィーヌ', 'アネリーナ', 'リオナ', 'ジョアンナ', 'レニッサ', 'ジェニス', 'グリンダ', 'マティナ', 'ローナ', 'コッキー', 'チェルシー', 'ネリス', 'アリーナ', 'フェリッサ', 'マリエル', 'ベララ', 'ジョゼフ', 'ニッカ', 'テキーラ', 'ソルティ', 'パイン', 'ウィズ', 'カンニバル', 'ミント', 'リーン', 'ミル', 'ディアンナ', 'レティア', 'サフィス', 'エミス', 'ヴァムリー', 'サリア', 'ナイジェス', 'ミューリア', 'エミリア', 'シャル', 'バーバラ', 'オビア', 'スチュアート', 'ベーラ', 'サマリーヌ', 'フィアネ', 'レナ', 'ソル', 'ネイラ', 'セレーネ', 'アルバ', 'ラン', 'ルー・パズス', 'シルフィ', 'ミレット', 'レフィーナ', 'モスマ', 'チブル', '鈴鈴', '明明', 'ティキ', 'サリア', 'ミュール', 'ダール', 'ミンナ', 'レーシャ', 'エレイア', 'レア', 'フィーナ', 'ジャネット', 'ナリス', 'ソチ', 'ポーラス', 'ロキア', 'フリージ', 'エスメレー', 'エレナ', 'アルティ', 'エビオラ', 'フィナ' ],
    // 称号
    title: ['武器屋の親父', 'ペンタウァの長老', 'トラベラーズインの宿主', '人と上手に話したい', 'ペンタウァ近衛隊長', 'タリスマンの見張り', '瞑想中', '砂漠の飯炊き', '狂戦士', 'エレベーターの管理人', '盗賊の頭領', '暗き沼の魔法使い', 'ロマンシア国王', 'アゾルバ国王', 'ペンタウァ国王', '蚕職人', '妖精王', '暗黒の魔導士', 'クイーンマリー号船長', 'キタブ・アル・アジフの持ち主', 'メデューサハンターの弟子', 'ファルコムマン', '戦士の亡霊', '海賊の子孫', 'いけにえの神官', '東の村の村長', '麻薬中毒者', 'ヴァネルバの王', '銀の竪琴屋', '近衛隊長', '復讐の呪術師', 'ラフォーヌの森の管理人', 'リドニア王国の元兵士', '姫の教育係', '大魔王', '紫ウニの王子', 'ベララの家族', '時計塔の番人', '時計塔の魔女', 'ナルキッソス号船長', 'ディンギル王国の3神官', 'バドティビラ工場の指揮官', 'シュメール国王', 'サンサーラの山賊', '南村の村長', 'アイテム屋WIZの店主', '旅の吟遊詩人', '古代イスマリアの王', '時の神殿の書記官', '闇の王', 'ランドル村長', '魔法学校の校長', '魔法学校の用務員', 'マリオネットの王', 'ペンタウァの近衛兵', '陽の中の闇人', '赤毛の冒険者', '光の王', 'イリアスンの執政官', '魔の下僕', 'メデューサハンター', '邪神教徒', '邪神教々祖', '砂漠の王', '鍵の番人', 'ローデシア辺境司令官', '宇宙からの訪問者', '黒竜仙人', '猿大聖', '極楽寺の僧兵', 'ジャグラー族', '迷宮建築の第一人者', 'フリース村の村長', 'ペンタウァ一の科学者アンド予言者', '暴れザル', '魔法学校の校長', '人魚３姉妹の長女', 'マリオネットの王', '探求の学徒', '旅芸人の一座', '猛獣使い', '流れの傭兵', '氷の魔女', 'パペッテの人形遣い', 'バーテンダー', '宮仕えのシャーマン', '薬草亭の主人', '水門の管理人' ],

    // 種族／性別／年齢
    race: [ 'FIGHTER', 'WIZARD', 'DWARF', 'ELF' ],
    sex: [ 'MALE', 'FEMALE' ],
    age: [ 'YOUNG', 'ADULT', 'OLD' ],

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
      'PROTECT':     [ 1, 0, 0, 1, 1, 0, 1, 'HPダメージを半減（1ターンのみ）' ],
      'HOLY-WATER':  [ 0, 0, 2, 2, 0, 0, 0, 'MPダメージを半減（1ターンのみ）' ],
      'CHANGE-AIR':  [ 1, 0, 0, 1, 1, 1, 0, '戦闘を回避（アイテムは得られない）' ],
      'GIVE-VIGOR':  [ 1, 1, 1, 0, 0, 1, 0, '敵の攻撃力が2倍＆取得アイテム2倍' ],
      'EXPLOSION':   [ 0, 1, 0, 1, 0, 1, 2, '地属性の敵を全滅' ],
      'DELUGE':      [ 4, 0, 0, 0, 0, 1, 0, '火属性の敵を全滅' ],
      'FREEZE':      [ 0, 2, 0, 0, 0, 1, 2, '水属性の敵を全滅' ],
      'DESTROY-A':   [ 1, 0, 4, 0, 0, 0, 0, '風属性の敵を全滅' ],
      'LIGHT-CROSS': [ 0, 2, 0, 2, 0, 1, 0, '霊属性の敵を全滅' ],
      'NOILA-TEM':   [ 1, 1, 1, 1, 1, 1, 1, 'すべての属性の敵を全滅' ],
    },

    jobs: {
      'のうふ' : [ 'FWDE', 'MF', 'YAO' ],
      'れんきんじゅつ' : [ 'W', 'M', 'YAO' ],
      'ようへい' : [ 'FDE', 'M', 'YA' ],
      'うらないし' : [ 'WE', 'MF', 'YAO' ],
      'こうふ' : [ 'FD', 'M', 'YA' ],
      'どろぼう' : [ 'FWDE', 'MF', 'YAO' ],
      'そうりょ' : [ 'W', 'MF', 'YAO' ],
      'しょうにん' : [ 'FWE', 'MF', 'YAO' ],
      'せんいん' : [ 'FD', 'M', 'YA' ],
      'とうし' : [ 'FDE', 'MF', 'Y' ],
      'どうけし' : [ 'WE', 'MF', 'YAO' ],
      'かじや' : [ 'FD', 'M', 'YAO' ],
      'きこり' : [ 'FD', 'M', 'YA' ],
      'かりうど' : [ 'FDE', 'M', 'YAO' ],
      'きとうし' : [ 'WE', 'M', 'YAO' ],
      'あくまばらい' : [ 'W', 'M', 'YAO' ],
      'せんきょうし' : [ 'W', 'MF', 'YAO' ],
      'いしゃ' : [ 'WE', 'M', 'AO' ],
      'かんごふ' : [ 'FWE', 'F', 'YAO' ],
      'ぱんや' : [ 'FWE', 'MF', 'YAO' ],
      'りょうし' : [ 'FD', 'MF', 'YA' ],
      'だいく' : [ 'FD', 'M', 'YAO' ],
      'ちょうこくか' : [ 'FWDE', 'MF', 'O' ],
      'おりこ' : [ 'WDE', 'F', 'YAO' ],
      'すみやき' : [ 'FD', 'MF', 'YAO' ],
      'コック' : [ 'WE', 'MF', 'YAO' ],
      'スパイ' : [ 'FWE', 'M', 'YA' ],
      'ぼくどう' : [ 'FWDE', 'MF', 'Y' ],
      'ようじんぼう' : [ 'FDE', 'M', 'Y' ],
      'ぎんゆうしじん' : [ 'WE', 'M', 'YAO' ],
      'ぎょしゃ' : [ 'FD', 'MF', 'YAO' ],
      'はかもり' : [ 'FWDE', 'M', 'O' ],
      'しゃほん' : [ 'WE', 'M', 'O' ],
      'こなひき' : [ 'FD', 'MF', 'YA' ],
      'かせいふ' : [ 'FWDE', 'F', 'YAO' ],
      'おどりこ' : [ 'E', 'F', 'Y' ],
      'はなや' : [ 'FWE', 'F', 'YAO' ],
      'いしく' : [ 'D', 'MF', 'YA' ],
      'かみゆい' : [ 'FWDE', 'F', 'AO' ],
      'したてや' : [ 'WDE', 'F', 'YAO' ],
      'いとつむぎ' : [ 'D', 'F', 'YAO' ],
      'うたうたい' : [ 'FWE', 'F', 'YA' ],
      'かみすき' : [ 'WD', 'MF', 'O' ],
      'つうやく' : [ 'DE', 'MF', 'YAO' ],
      'やくざいし' : [ 'FWE', 'MF', 'AO' ],
      'ほねさいくし' : [ 'D', 'MF', 'O' ],
      'わたしもり' : [ 'FW', 'M', 'YA' ],
      'やくそうとり' : [ 'WE', 'MF', 'YAO' ],
      'そうぎや' : [ 'FW', 'M', 'O' ],
      'ワインづくり' : [ 'FWDE', 'MF', 'YA' ],
      'こじき' : [ 'FWDE', 'MF', 'YAO' ],
      'ちょうきょうし' : [ 'DE', 'MF', 'A' ],
      'ほうせきさいくし' : [ 'D', 'MF', 'O' ],
      'かごづくり' : [ 'FD', 'MF', 'O' ],
      'かぎや' : [ 'D', 'MF', 'AO' ],
      'くつし' : [ 'FDE', 'MF', 'O' ],
      'はくせいづくり' : [ 'FD', 'MF', 'O' ],
      'ゆみし' : [ 'FE', 'MF', 'O' ],
      'チーズづくり' : [ 'FD', 'F', 'YAO' ],
      'さんば' : [ 'FW', 'F', 'AO' ]   
    },

    // シナリオクリア時に入手できるアイテム
    global_items: {
      'happy' : {
        'gi01' : { name: '金の卵', desc: '月の欠片を5個所有した状態で冒険を開始する' },
        'gi02' : { name: 'ガラティーン', desc: '火星の欠片を5個所有した状態で冒険を開始する' },
        'gi03' : { name: '五元素のマント', desc: '水星の欠片を5個所有した状態で冒険を開始する' },
        'gi04' : { name: 'アマゾンの剣', desc: '木星の欠片を5個所有した状態で冒険を開始する' },
        'gi05' : { name: '幸福のコイン', desc: '金星の欠片を5個所有した状態で冒険を開始する' },
        'gi06' : { name: 'ムラサメブレード', desc: '土星の欠片を5個所有した状態で冒険を開始する' },
        'gi07' : { name: 'G・スレイヤー', desc: '太陽の欠片を5個所有した状態で冒険を開始する' },
        'gi08' : { name: '水晶の剣', desc: '30％の確率でシーンごとにHPを1回復する', type: 'status' },
        'gi09' : { name: '王様の杖', desc: '30％の確率でシーンごとにMPを1回復する', type: 'status' },
        'gi10' : { name: 'ブルーリボン', desc: '冒険開始時にSTRを1加算する' },
        'gi11' : { name: '王家のダイヤモンド', desc: '冒険開始時にINTを1加算する' },
        'gi12' : { name: '不老長寿の水', desc: '冒険中に一度だけHPを半分回復しても良い', type: 'status' },
        'gi13' : { name: 'タリスマン', desc: '冒険中に一度だけMPを半分回復しても良い', type: 'status' },
        'gi14' : { name: '鏡の盾', desc: '戦闘時のHPダメージが1減算される', type: 'battle' },
        'gi15' : { name: '銀の竪琴', desc: '戦闘時のMPダメージが1減算される', type: 'battle' },
        'gi16' : { name: 'パンドラの箱', desc: '右サイコロが4以上の時、戦闘を回避しても良い（ただし、アイテムは入手できない）', type: 'battle' },
        'gi17' : { name: '魔法の絨毯', desc: '右サイコロが6の時、戦闘を回避できる（アイテムも入手可）', type: 'battle' },
        'gi18' : { name: '中和剤', desc: '毒耐性', type: 'status' },
        'gi19' : { name: '聖水', desc: '呪い耐性', type: 'status' },
        'gi20' : { name: 'チルドの実', desc: '凍結耐性', type: 'status' },
        'gi21' : { name: '銀のハーモニカ', desc: '石化耐性', type: 'status' },
        'gi22' : { name: '真実の鏡', desc: '忘却耐性', type: 'status' },
        'gi23' : { name: 'D・スレイヤー', desc: 'すべての星を1個所有した状態で冒険を開始する' },
      },
      'bad' : {
        'bgi01' : { name: '塩酸', desc: 'シーンごとに30％の確率でHP1ダメージ、40％の確率でMPを1回復する', type: 'status' },
        'bgi02' : { name: '紅玉', desc: 'シーンごとに30％の確率でMP1ダメージ、40％の確率でHPを1回復する', type: 'status' },
        'bgi03' : { name: '血まみれの斧', desc: '冒険開始時に呪い。ただし、解除後に3回まで星消費せず攻撃魔法を利用できる', type: 'magic' },
        'bgi04' : { name: 'トリカブト', desc: '冒険開始時に毒。ただし、解除まで魔法ダメージを半減できる', type: 'battle' },
        'bgi05' : { name: 'ギャルのパンティー', desc: '冒険開始時に忘却。ただし、解除時に0になっていたステータスを+1できる', type: 'status' },
      }
    },

    // 星の表示名
    star_names: { 'mon': '月', 'tue': '火星', 'wed': '水星', 'thu': '木星', 'fri': '金星', 'sat': '土星', 'sun': '太陽', '': null },

    // 状態異常＆攻撃の表示名
    state_names: { '': '正常', 'poison': '毒', 'frozen': '凍結',
      'stone': '石化', 'curse': '呪い', 'forget': '忘却',
      'physics': '物理', 'magic': '魔法', 'both': '物理／魔法',
      'str': 'STR', 'int': 'INT', 'dex': 'DEX', 'krm': 'KRM',
      'free1': 'FREE1', 'free2': 'FREE2', 'free3': 'FREE3' },

    // 属性の表示名
    element_names: { 'earth': '地', 'fire': '火', 'water': '水', 'wind': '風', 'spirit': '霊' }
  };

  // Toastr共通設定
  toastr.options.closeButton = true;
  toastr.options.positionClass = "toast-bottom-left";
  toastr.options.showDuration = 300;
  toastr.options.hideDuration = 1000;
  toastr.options.timeOut = 5000;

  // SE操作
  let SeAudio = {
    // 効果音を再生（name：効果音のベース名）
    play(name, common = false) {
      if (global_save_data.bgm) {
        let a;
        if (common) {
          a = new Audio(`${ROOT}${COMMON}${SE}${name}.mp3`);
        } else {
          a = new Audio(`${ROOT}${scenario_code}/${BGM}${SE}${name}.mp3`);
        }
        a.volume = 0.9;
        a.loop = false;
        a.play();
      }
    },

    // BGMを再生 
    playBgm(path) {
      if(bgm) { bgm.pause(); }
      bgm = new Audio(path);
      bgm.volume = 0.2;
      bgm.loop = true;
      if(global_save_data.bgm) {
        bgm.play();
      }
    }
  };

  let Cache = {
    setItem(name, value, expires) {
      Cookies.set(`stext_cache_${name}`, value, { expires: expires, path: '' })
    },
    getItem(name) {
      return Cookies.get(`stext_cache_${name}`);
    }
  };

  // ボーナス情報
  let Bonus = {
    // シナリオ開始時の適用ボーナス表示
    showBonusMessage() {
      let msg;
      if (save_data.bonus) {
        if (save_data.bonus.indexOf('bgi') === 0) {
          msg = Common.global_items.bad[save_data.bonus];
        } else {

          msg = Common.global_items.happy[save_data.bonus];
        }
        toastr.info(msg.desc, `BONUS（${msg.name}）`);
      }
      // ボーナスメッセージの設定
      this.setBonusMessage();
    },

  　// シナリオ開始時のボーナス適用
    initBonusStatus() {
      switch(save_data.bonus) {
        case 'gi01':
          Util.updateStarById('mon', 5);
          break;
        case 'gi02':
          Util.updateStarById('tue', 5);
          break;
        case 'gi03':
          Util.updateStarById('wed', 5);
          break;
        case 'gi04':
          Util.updateStarById('thu', 5);
          break;
        case 'gi05':
          Util.updateStarById('fri', 5);
          break;
        case 'gi06':
          Util.updateStarById('sat', 5);
          break;
        case 'gi07':
          Util.updateStarById('sun', 5);
          break;
        case 'gi10':
          Util.updateStr2Krm(1, 0, 0, 0);
          break;
        case 'gi11':
          Util.updateStr2Krm(0, 1, 0, 0);
          break;
        case 'gi23':
          Util.updateStarById('mon', 1);
          Util.updateStarById('tue', 1);
          Util.updateStarById('wed', 1);
          Util.updateStarById('thu', 1);
          Util.updateStarById('fri', 1);
          Util.updateStarById('sat', 1);
          Util.updateStarById('sun', 1);
          break;
        case 'bgi03':
          Util.updateState('curse');
          break;
        case 'bgi04':
          Util.updateState('poison');
          break;
        case 'bgi05':
          Util.updateState('forget');
          break;
      }
    },

    // ステータスシートなどへのボーナスメッセージ設定
    setBonusMessage(){
      let b = Util.getBonusItem(save_data.bonus);
      if (b && b.type) {
        $(`#sidr_${b.type}_bonus`).text(`BONUS APPLYING： ${b.desc}`);
      }
    },

    // シーン単位のボーナス更新
    updateStatusByBonus() {
      switch(save_data.bonus) {
        case 'gi08':
          Util.processByWeight([0.3], function() {
            Util.updateHpMp(1, 0);
          });
          break;
        case 'gi09':
          Util.processByWeight([0.3], function() {
            Util.updateHpMp(0, 1);
          });  
          break;
        case 'bgi01':
          Util.processByWeight([0.3, 0.4], function() {
            Util.updateHpMp(-1, 0);
          }, function() {
            Util.updateHpMp(0, 1);
          });
          break;
        case 'bgi02':
          Util.processByWeight([0.3, 0.4], function() {
            Util.updateHpMp(0, -1);
          }, function() {
            Util.updateHpMp(1, 0);
          });  
          break;
      }
    },

    // 適用ダメージに応じてダメージ量を調整
    // damage：元のダメージ値、type：ダメージの種類（hp、mp）
    // 戻り値は調整後のダメージ
    adjustBattleDamage(damage, type) {
      switch(save_data.bonus) {
        case 'gi14':
          if (type === 'hp') { damage--; }
          break;
        case 'gi15':
          if (type === 'mp') { damage--; }
          break;
      }
      return damage;
    },


    // ボーナス耐性と引数state（設定する状態異常）とが等しい場合、設定不可
    guardState(state) {
      let data = {
        gi18: 'poison',
        gi19: 'curse',
        gi20: 'frozen',
        gi21: 'stone',
        gi22: 'forget'
      };
      if (state === data[save_data.bonus]) {
        return false;
      }
      return true;

    // 'gi18' : { name: '中和剤', desc: '毒耐性' },
    // 'gi19' : { name: '聖水', desc: '呪い耐性' },
    // 'gi20' : { name: 'チルドの実', desc: '凍結耐性' },
    // 'gi21' : { name: '銀のハーモニカ', desc: '石化耐性' },
    // 'gi22' : { name: '真実の鏡', desc: '忘却耐性' },
    }
  };

  // プレイヤーランク情報
  let PlayerRank = {
    // レベル別ポイント
    LEVEL_POINTS: [ 100, 150, 170, 180, 200 ],
    // ランク情報（定数）
    RANK_INFO: [
      { pt: 50, en: 'Novice Adventurer', jp: '駆け出し' },
      { pt: 100, en: 'Initiate', jp: '新参者' },
      { pt: 200, en: 'Aspirant', jp: '大志を抱く者' },
      { pt: 300, en: 'Battler', jp: '戦人（いくさびと）' },
      { pt: 500, en: 'Adept', jp: '熟練者' },
      { pt: 700, en: 'Chevalier', jp: '義侠の者' },
      { pt: 1000, en: 'Conjurer', jp: '奇術師' },
      { pt: 1300, en: 'Theurgist', jp: '神々に祈る者' },
      { pt: 1600, en: 'Warrior', jp: '古つわもの' },
      { pt: 2000, en: 'Enchanter', jp: '魅了する者' },
      { pt: 2500, en: 'Warlock', jp: '七つの塔の魔術師' },
      { pt: 3000, en: 'Sorcerer', jp: 'ソーサリアン' },
      { pt: 3500, en: 'Necromancer', jp: '死者と語る者' },
      { pt: 4000, en: 'Illusionist', jp: '幻惑を魅せる者' },
      { pt: 5000, en: 'Master Lord', jp: '偉大なる領主' },
      { pt: 99999, en: 'Dragon Slayer', jp: 'ドラゴンスレイヤー' },
    ],
    // シナリオのクリア数
    scena_count: 0,
    // シナリオの総数
    scena_all: 0,
    // ボーナスの取得数
    bonus_count: 0,
    // ボーナスの総数
    bonus_all: 0,
    // シナリオ情報
    scena_infos: {},
    // 取得実績総数
    scena_results_count: 0,
    // 実績総数
    scena_results_all: 0,
    // 経験値
    exp_count: 0,
    // 経験値の総計
    exp_all: 0,

    // PlayerRankを初期化
    init() {
      let that = this;
      let g_save;
      if (localStorage['sorcerian_text']) {
        g_save = JSON.parse(localStorage['sorcerian_text']);
        this.bonus_count = g_save.items.length;
      }

      this.bonus_all =
        Object.keys(Common.global_items.happy).length +
        Object.keys(Common.global_items.bad).length;


      $.get(ROOT + 'stext.xml').done(function(data) {
        let scenas = $('scenario > work', data);
        that.scena_all = scenas.length;

        $('scenario > work', data).each(function(i) {
          let id = $(this).attr('id');
          let results_count = 0;
          let is_cleared = false;

          // クリア有無／取得実績の取得
          if (g_save) {
            let results = g_save.results[id];
            if (results) {
              results_count = results.length;
    
              let clears = $(this).attr('clears');
              if (clears) {
                clears = clears.split(',');
                for (var j = 0; j < clears.length; j++) {
                  if (results.indexOf(clears[j]) !== -1) {
                    that.scena_count++;
                    is_cleared = true;
                    break;
                  }
                }
              }
            }
          }

          // シナリオ個別の情報を取得
          that.scena_infos[id] = {
            // レベル
            level: Number($(this).attr('level')),
            // タイトル
            title: $(this).attr('title'),
            // クリア済みか
            is_cleared,
            // 取得実績数
            results_count,
            // 実績総数
            results_all: Number($(this).attr('results'))
          };

          // 実績の総数
          that.scena_results_all += Number($(this).attr('results'))
        });
        that.calculateExp();
      });
    },
    // 現在の実績に応じて経験値を演算
    // ボーナスアイテム（個数×10）
    // シナリオレベルでクリア得点を決定（L1：100＜150＜170＜180＜200：L5）
    // 実績（個数×2）
    // 以上を合計したものがプレイヤースコア
    calculateExp() {
      // 経験値の初期化（ボーナス得点）
      this.exp_count = this.bonus_count * 10;
      this.exp_all = this.bonus_all * 10;

      let results_sum = 0;
      for(let k of Object.keys(this.scena_infos)) {
        let info = this.scena_infos[k];
        // クリア得点を加算
        if (info.is_cleared) {
          this.exp_count += this.LEVEL_POINTS[Number(info.level) - 1];
        }
        this.exp_all += this.LEVEL_POINTS[Number(info.level) - 1];

        results_sum += info.results_count;
      }
      // 実績ボーナスの加算
      this.exp_count += results_sum * 2;
      this.scena_results_count = results_sum;
    },
    // 指定されたシナリオコード（code）に対して実績カウントを追加
    incrementResult(code) {
      if (this.scena_infos[code]) {
        this.scena_infos[code].results_count++;
      } else {
        this.scena_infos[code] = {
          results_count: 1
        };
      }
      // 経験値を再計算
      this.calculateExp();
    },
    // 現在の経験値に応じてランクを取得
    getRank() {
      for (let i = 0; i < this.RANK_INFO.length; i++) {
        let rank = this.RANK_INFO[i];
        if (this.exp_count < rank.pt) {
          return {
            level: i,
            en: rank.en,
            jp: rank.jp
          };
        }
      }
    } 
  };

  // サイドバー
  let SideBar = {
    // 現在のシーンで最初にBattleSheetを開いたか
    isFirstOpenBattleSheet: true,
    cube: function(num) {
      if (num === undefined) { num = 1; }
      var html = '';
      for (let i = 0; i < num; i++) {
        // ダイスの値を保管
        dice[i] = Util.random(1, 6);
        html += `<img src="${ROOT}${COMMON}cube${dice[i]}.png" class="dice" />`;
      }
      return html;
    },
    // ［+］スピナーで直前のテキストボックス値をインクリメント
    incrementValue(e) {
      let prev = $(this).prev();
      prev.val(Number(prev.val()) + 1);
    },
    // ［-］スピナーで直後のテキストボックス値をインクリメント
    decrementValue(e) {
      let next = $(this).next();
      next.val(Number(next.val()) - 1);
    },
    // 現在の状態異常に応じてスタイル（ダイアログ）を変更
    setStateStyle() {
      let hp = $('#sidr_status_hp');
      let str = $('#sidr_status_str');
      let int = $('#sidr_status_int');
      let dex = $('#sidr_status_dex');
      let krm = $('#sidr_status_krm');
      let magic = $('#sidr_magic_magic');
      let poison = $('[name="sidr_status_state"][value="poison"]').prop('checked');
      var frozen = $('[name="sidr_status_state"][value="frozen"]').prop('checked');
      var stone =  $('[name="sidr_status_state"][value="stone"]').prop('checked');
      var curse =  $('[name="sidr_status_state"][value="curse"]').prop('checked');
      var forget = $('[name="sidr_status_state"][value="forget"]').prop('checked');

      // 状態異常スタイルをすべて解除
      var clazz = 'dialog_poison dialog_frozen dialog_stone dialog_curse dialog_forget';
      hp.removeClass(clazz);
      str.removeClass(clazz);
      int.removeClass(clazz);
      dex.removeClass(clazz);
      krm.removeClass(clazz);
      magic.removeClass(clazz);

      if (poison) {
        hp.addClass('dialog_poison');
      } else if (frozen) {  
        str.addClass('dialog_frozen');
        int.addClass('dialog_frozen');
        dex.addClass('dialog_frozen');
        krm.addClass('dialog_frozen');
      } else if (stone) {  
        str.addClass('dialog_stone');
        int.addClass('dialog_stone');
        dex.addClass('dialog_stone');
        krm.addClass('dialog_stone');
      } else if (curse) {  
        magic.addClass('dialog_curse');
      } else if (forget) {
        if (save_data.chara.str < save_data.chara.int) {
          int.addClass('dialog_forget');
        } else {
          str.addClass('dialog_forget');
        }
      }
    },
    // 状態異常によるステータス補正
    // 補正値の反映は現在では無効（どこかで修正を）
    deltaStatus: function(state) {
      let result;
      switch(state) {
        case 'frozen' :
          result = {
            state_desc: 'すべてのステータスを-2',
            str_d: -2,
            int_d: -2,
            dex_d: -2,
            krm_d: -2
          };
          break;
        case 'stone' :
          result = {
            state_desc: 'すべてのステータスを-1（30scene経過で死亡）',
            str_d: -1,
            int_d: -1,
            dex_d: -1,
            krm_d: -1
          };
          break;
        case 'forget' :
          result = {
            state_desc: 'STR／INTのうち、高い方が0に（20scene経過で解除）',
            dex_d: 0,
            krm_d: 0  
          };
          if(save_data.chara.str < save_data.chara.int) {
            result.str_d = 0;
            result.int_d = save_data.chara.int * -1;
          } else {
            result.str_d = save_data.chara.str * -1;
            result.int_d = 0;
          }
          break;
        case 'poison' :
          result = {
            state_desc: 'シーン経過ごとにHPを-1',
            str_d: 0,
            int_d: 0,
            dex_d: 0,
            krm_d: 0
          }
          break;
        case 'curse' :
          result = {
            state_desc: '魔法の利用が不可（UN-CURSEを除く）',
            str_d: 0,
            int_d: 0,
            dex_d: 0,
            krm_d: 0
          };
          break;
        default :
          result = {
            state_desc: '－',
            str_d: 0,
            int_d: 0,
            dex_d: 0,
            krm_d: 0
          };
          break;
      }
      return result;
    },

    // 指定されたステータスラベルを設定
    // target：反映先のセレクター、name：ステータス名
    setStatusLabel(flabel, target, name) {
      let tmp = flabel.nsAttr(name);
      if (tmp) {
        $(Util.formatMessage(target, name)).text(tmp);
        // hp、mpのみmaxの表記の置換
        if (name === 'hp' || name === 'mp') {
          target = target.replace('_label', '_m_label');
          $(Util.formatMessage(target, name)).text(tmp + ' MAX');
        }
      };
    },

    // すべてのステータスラベルを設定
    setAllStatusLabels(target) {
      let flabel = $('init > label', scenario_data);
      if (flabel) {
        let names = ['hp', 'mp', 'state',
          'str', 'int', 'dex', 'krm', 'free1', 'free2', 'free3'];
        for (let name of names) {
          SideBar.setStatusLabel(flabel, target, name);
        }
      }
    },

    // 簡易ステータスの整形
    showSimpleStatus() {
      SideBar.setAllStatusLabels('#simple_status #simple_status_#{0}_label');
      $('#sidr_battle #simple_status_hp').text(save_data.chara.hp);
      $('#sidr_battle #simple_status_mp').text(save_data.chara.mp);
      $('#sidr_battle #simple_status_str').text(save_data.chara.str);
      $('#sidr_battle #simple_status_int').text(save_data.chara.int);
      $('#sidr_battle #simple_status_dex').text(save_data.chara.dex);
      $('#sidr_battle #simple_status_krm').text(save_data.chara.krm);
      let f_label = $('init > label', scenario_data);
      if (f_label.nsAttr('free1') || f_label.nsAttr('free2') || f_label.nsAttr('free3')) {
      //if ($('init > label', scenario_data).length !== 0) {
        $('#sidr_battle #simple_status_frees').show(); 
        $('#sidr_battle #simple_status_f1').text(save_data.chara.free1);
        $('#sidr_battle #simple_status_f2').text(save_data.chara.free2);
        $('#sidr_battle #simple_status_f3').text(save_data.chara.free3);
      } else {
        $('#sidr_battle #simple_status_frees').hide(); 
      }
      let state = $('#sidr_battle #simple_status_state');
      state
        .text(Common.state_names[save_data.chara.state])
        .removeClass('status_poison status_frozen status_stone status_curse status_forget');

      // 状態異常の場合、文字色、背景画像を変更
      if (save_data.chara.state) {
        state.addClass(`status_${save_data.chara.state}`);
        target.addClass('main_bad');
      } else {
        target.removeClass('main_bad');
      }
    },

    // 魔法の実行処理（magic_id：魔法コード）
    runMagic(magic_id) {
      let msg;
      switch(magic_id) {
        case 'HEAL':
          Util.updateHpMp('15', undefined);
          msg = 'HPが15回復した！';
          break;
        case 'PEACE':
          Util.updateHpMp(undefined, '10');
          msg = 'MPが10回復した！';
          break;
        case 'CURE':
          Util.updateState('-poison');
          msg = '毒を解除した！';
          break;
        case 'MELT':
          Util.updateState('-frozen');
          msg = '凍結を解除した！';
          break;
        case 'STONE-FLESH':
          Util.updateState('-stone');
          msg = '石化を解除した！';
          break;
        case 'UN-CURCE':
          Util.updateState('-curse');
          msg = '呪いを解除した！';
          break;
        case 'AIR-HAND':
          Util.updateState('-forget');
          msg = '忘却を解除した！';
          break;
        case 'RESURRECT':
          Util.updateHpMp('half', 'half');
          msg = '復活に成功した！ただし、HP/MPともに上限の半分となった。';
          break;
        case 'REDUCE-LIFE':
          Util.updateHpMp('-25', undefined);
          Util.updateState('-all');
          msg = '状態異常を解除した。';
          break;
        case 'REJUVENATE':
          msg = '直前の判定を一度だけリトライしても良い。';
          break;
        case 'PROTECT':
          msg = '物理ダメージを半減できる。ダメージ式上のボックスを「1/2」に設定せよ。';
          break;
        case 'HOLY-WATER':
          msg = '魔法ダメージを半減できる。ダメージ式上のボックスを「x1/2」に設定せよ。';
          break;
        case 'CHANGE-AIR':
          msg = '本シーンの戦闘をすべて回避できる（ボス戦闘を除く）。';
          break;
        case 'GIVE-VIGOR':
          msg = '敵の攻撃力が2倍になる。ダメージ式上のボックスを「x2」に設定せよ。また、勝利時はドロップアイテムボタンを2回押すこと。';
          break;
        case 'EXPLOSION':
          msg = '地属性の敵は全滅した。ダメージボタンを押さずに、ドロップアイテムボタンを押して良い。';
          break;
        case 'DELUGE':
          msg = '火属性の敵は全滅した。ダメージボタンを押さずに、ドロップアイテムボタンを押して良い。';
          break;
        case 'FREEZE':
          msg = '水属性の敵は全滅した。ダメージボタンを押さずに、ドロップアイテムボタンを押して良い。';
          break;
        case 'DESTROY-A':
          msg = '風属性の敵は全滅した。ダメージボタンを押さずに、ドロップアイテムボタンを押して良い。';
          break;
        case 'LIGHT-CROSS':
          msg = '霊属性の敵は全滅した。ダメージボタンを押さずに、ドロップアイテムボタンを押して良い。';
          break;
        case 'NOILA-TEM':
          msg = '全属性の敵が全滅した。ダメージボタンを押さずに、ドロップアイテムボタンを押して良い。';
          break;
        default:
          throw new Error('魔法の指定が間違っています。');
      };
      toastr.success(msg, '魔法の行使');
      Util.saveStorage();
    },

    // サイドバーのオープン
    openSideBar(base) {
      $.sidr('open', `sidr_${base}`);
    },

    // サイドバーの生成（基本）
    createSideBar(base, template, onOpen, onSubmit) {
      let s_name = `sidr_${base}`;
      // テンプレートをメイン要素の前に
      $(template).insertBefore(target);
      // メニューにサイドバーを紐付け
      $(`#menu_${base}`).sidr({
        name: s_name,
        displace: false,
        onOpen: onOpen
      });
      target.parent().on('click', `#${s_name}_submit`, function() {
        onSubmit();
        $.sidr('close', s_name);
      });
      target.parent().on('click', `#${s_name}_close`, function() {
        $.sidr('close', s_name);
      });
    },

    // バトルシートの生成 
    createBattleSheet() {
      let that = this;
      let template = $(`<div id="sidr_battle">
        <p id="sidr_battle_bonus" class="bonus_msg"></p>
        <table class="enemy">
        <thead>
        <tr class="enemy_title">
          <th id="check_cell"></th>
          <th>名前／属性</th>
          <th><span id="hp_cell">HP</span></th>
          <th>攻撃</th>
          <th title="現在のダイス値に従って、ダメージを反映させます。">
            ダメージ 
            <select id="damage_delta">
              <option value="2">x2</option>' + 
              <option value="1" selected>x1</option>
              <option value="0.5">x1/2</option>
              <option value="0.25">x1/4</option>
            </select>
          </th>
          <th title="記載されたドロップアイテムをステータスに反映させます。">戦利品</th>
          </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
        <center id="cubes"></center>
        <div id="simple_status">
          <span id="simple_status_hp_label">HP</span>
            :<span id="simple_status_hp" class="status_v"></span>　
          <span id="simple_status_mp_label">MP</span>
            :<span id="simple_status_mp" class="status_v"></span>　|　
          <span id="simple_status_str_label">STR</span>
            :<span id="simple_status_str" class="status_v"></span>　
          <span id="simple_status_int_label">INT</span>
            :<span id="simple_status_int" class="status_v"></span>　
          <span id="simple_status_dex_label">DEX</span>
            :<span id="simple_status_dex" class="status_v"></span>　
          <span id="simple_status_krm_label">KRM</span>
            :<span id="simple_status_krm" class="status_v"></span>　｜　
          <span id="simple_status_frees">
            <br />
            <span id="simple_status_free1_label">F1</span>
              :<span id="simple_status_f1" class="status_v"></span>　
            <span id="simple_status_free2_label">F2</span>
              :<span id="simple_status_f2" class="status_v"></span>　
            <span id="simple_status_free3_label">F3</span>
              :<span id="simple_status_f3" class="status_v"></span>　｜　
          </span>
          <span id="simple_status_state" class="status_v"></span>　
        </div>
        <div id="sidr_battle_close" class="sidr_close">閉じる</div>
        <div id="common_rule"></div>
      </div>`);

      // 敵一覧をクリックで詳細情報を表示
      target.parent().on('click', '#sidr_battle tr.enemy_row', function(e) {
        let enemy = enemies_map[$(this).nsAttr('data-enemy')];
        toastr.options.timeOut = 5000;
        toastr.info(enemy.desc, enemy.name);
      });

      // 敵撃破チェックでのイベント抑止
      target.parent().on('click','#sidr_battle input.enemy_check', function(e) {
        e.stopImmediatePropagation();
      });

      // ［HP］ボタンでの自動計算
      target.parent().on('click', '#sidr_battle .enemy_hp', function(e) {

        e.stopImmediatePropagation();

        let hp = Number($(this).val());
        let org_hp = $(this).nsAttr('data-org_hp');
        let func_opp = $(this).nsAttr('data-func_opp');
        let damage = Util.computeDamage(func_opp);
        if (damage < 0) { damage = 0; }
        hp -= damage;
        if (hp <= 0) { hp = 0; }
        $(this).val(hp);
        // 内部パラメーターの反映
        if (org_hp.startsWith('p')) {
          Util.updateParams(`${org_hp}:@${hp}`);
          Util.saveStorage();
        }
        toastr.success(
          `${damage} Hit!`,
          '敵へのダメージ'
        );
      });

      // ダメージボタンでの算出
      target.parent().on('click', '#sidr_battle .enemy_func', function(e) {
        e.stopImmediatePropagation();
        toastr.options.timeOut = 5000;

        let func = $(this).nsAttr('data-func');
        let attack = $(this).nsAttr('data-attack');

        // ステータス攻撃の場合
        let regStr = /(str|int|dex|krm)([0-9]{0,2})/i;
        if (regStr.test(attack)) {
          if (Util.judgeExpression(func)) {
            SeAudio.play('guard', true);
            toastr.info(
              '回避に成功した。',
              'ステータス攻撃'
            );
          } else {
            let sts = regStr.exec(attack);
            // STRの場合はSTR1と見なす
            if (!sts[2]) { sts[2] = 1; }
            switch (sts[1].toLowerCase()) {
              case 'str':
                Util.updateStr2Krm(Number(sts[2]) * -1, 0, 0, 0);
                break;
              case 'int':
                Util.updateStr2Krm(0, Number(sts[2]) * -1, 0, 0);
                break;
              case 'dex':
                Util.updateStr2Krm(0, 0, Number(sts[2]) * -1, 0);
                break;
              case 'krm':              
                Util.updateStr2Krm(0, 0, 0, Number(sts[2]) * -1);
                break;
            }
            SeAudio.play('state', true);
            toastr.error(
              Util.getStatusLabel(sts[1]) + 'が低下した！',
              'ステータス攻撃'
            );

          }
        // 状態異常の場合の判定
        } else if ([ 'poison', 'frozen', 'stone', 'curse', 'forget' ].indexOf(attack) !== -1) {
          // 左辺・不等号・右辺に分割
          // let cond = func.split(/([<>])/);
          // let l_damage = Util.computeDamage(cond[0]);
          // let r_damage = Util.computeDamage(cond[2]);
          // let canEscape;
          // if (cond[1] === '<') {
          //   canEscape = l_damage < r_damage;
          // } else {
          //   canEscape = l_damage > r_damage;
          // }
          if (Util.judgeExpression(func)) {
            SeAudio.play('guard', true);
            toastr.info(
              '回避に成功した。',
              '状態異常'
            );
          } else {
            if(Util.updateState(attack)) {
              SeAudio.play('state', true);
              toastr.error(
                '「' + Common.state_names[attack] + '」を受けた！',
                '状態異常'
              );
            }
          }
        } else {
          // physics／magicの場合、ダメージ式の解析
          let damage = Util.computeDamage(func);
          let h_damage = Bonus.adjustBattleDamage(damage, 'hp');
          let m_damage = Bonus.adjustBattleDamage(damage, 'mp');
          // 負数はゼロに丸め
          if (damage < 0) { damage = 0; }
          if (h_damage < 0) { h_damage = 0; }
          if (m_damage < 0) { m_damage = 0; }

          let t_msg;  // トーストメッセージ
          let is_damaged = false; // ダメージを受けたか

          switch (attack) {
            case 'physics' :
              if (h_damage > 0) { is_damaged = true; }
              save_data.chara.hp = Number(save_data.chara.hp) - h_damage;
              t_msg = `${Util.getStatusLabel('hp')}に${h_damage}のダメージ！（現在値：${save_data.chara.hp}）` ;
              break;
            case 'magic' :
              if (m_damage > 0) { is_damaged = true; }
              save_data.chara.mp = Number(save_data.chara.mp) - m_damage;
              t_msg = `${Util.getStatusLabel('mp')}に${m_damage}のダメージ！（現在値：${save_data.chara.mp}）` ;
              break;
            case 'both' :
              if (h_damage > 0 || m_damage > 0) { is_damaged = true; }
              save_data.chara.hp = Number(save_data.chara.hp) - h_damage;
              save_data.chara.mp = Number(save_data.chara.mp) - m_damage;
              t_msg = `${Util.getStatusLabel('hp')}/${Util.getStatusLabel('mp')}に${h_damage}/${m_damage}のダブルダメージ！（現在値：${save_data.chara.hp}/${save_data.chara.mp}）` ;
              break;
            case 'free1' :
              if (damage > 0) { is_damaged = true; }
              save_data.chara.free1 = Number(save_data.chara.free1) - damage;
              t_msg = `${Util.getStatusLabel('free1')}に${damage}のダメージ！（現在値：${save_data.chara.free1}）` ;
              break;
            case 'free2' :
              if (damage > 0) { is_damaged = true; }
              save_data.chara.free2 = Number(save_data.chara.free2) - damage;
              t_msg = `${Util.getStatusLabel('free2')}に${damage}のダメージ！（現在値：${save_data.chara.free2}）` ;
              break;
            case 'free3' :
              if (damage > 0) { is_damaged = true; }
              save_data.chara.free3 = Number(save_data.chara.free3) - damage;
              t_msg = `${Util.getStatusLabel('free3')}に${damage}のダメージ！（現在値：${save_data.chara.free3}）` ;
              break;
            default :
              break;
          }
          if (!is_damaged) {
            t_msg = '敵の攻撃を防ぎきった！';
            SeAudio.play('guard', true);
            toastr.info(t_msg, '被ダメージ');  
          } else {
            SeAudio.play('damage', true);
            toastr.error(t_msg, '被ダメージ');
          }
        }
        Util.saveStorage();
        that.showSimpleStatus();
      });
  
      // ドロップアイテムボタンでステータスを加算
      target.parent().on('click', '#sidr_battle input.enemy_drop', function(e) {
        e.stopImmediatePropagation();
        let drops = $(this).nsAttr('data-drop').split('/');
        if (drops.length === 2) {
          // 星の加算（ex. tue/2）
          Util.updateStarById(drops[0], drops[1]);
          toastr.options.timeOut = 5000;
          toastr.info(
            `${Common.star_names[drops[0]]}の欠片を${drops[1]}個取得しました。`,
            'アイテム獲得'
          );
        } else {
          if (drops[0] === 'item') {
            // アイテムの取得（ex. item/i01/武器）
            Util.updateItems(drops[1].trim());
            toastr.options.timeOut = 5000;
            toastr.info(
              `${drops[2]}を取得しました。`,
              'アイテム獲得'
            );
          } else if (drops[0] === 'flag') {
            // フラグの付与（ex. flag/f01/脱出成功）
            Util.updateFlags(drops[1].trim());
            toastr.options.timeOut = 5000;
            toastr.info(
              `フラグ「${drops[2]}」を獲得しました。`,
              'フラグ獲得'
            );
          } else if (drops[0] === 'param') {
            // 自由パラメーターの付与（ex. param/p01:xxx/Value）
            Util.updateParams(drops[1].trim());
            toastr.options.timeOut = 5000;
            toastr.info(
              `「${drops[2]}」を獲得しました。`,
              '獲得'
            );
          } else {
            // freeX属性の加算（ex. free1/50/50Gold）
            let at_free1 = (drops[0] === 'free1' ? drops[1] : 0);
            let at_free2 = (drops[0] === 'free2' ? drops[1] : 0);
            let at_free3 = (drops[0] === 'free3' ? drops[1] : 0);
            Util.updateFrees(at_free1, at_free2, at_free3);
            toastr.options.timeOut = 5000;
            toastr.info(
              `${drops[2]}を取得しました。`,
              'アイテム獲得'
            );
          }
        }
        SeAudio.play('drop', true);
        Util.saveStorage();
        that.showSimpleStatus();
      });

      // ダイス回転音を準備
      // let ad = new Audio(ROOT + COMMON + 'dice.mp3');
      // ダイスの回転
      // let rotate_count;
      // let rotateCube = function() {
      //   rotate_count++;
      //   $('#sidr_battle #cubes').html(that.cube(2));
      //   if(rotate_count > 20) { return; }
      //   setTimeout(rotateCube, 50);
      // };
      // サイコロをリロード
      // target.parent().on('click', '#sidr_battle #cubes', function(e) {
      //   SeAudio.play('dice', true);
      //   rotate_count = 1;
      //   rotateCube();
      // });

      this.createSideBar(
        'battle',
        template,
        function() {
          // 現在のscene要素
          let current_scene = $(`scene[id=${save_data.scene}]`, scenario_data);

          // ダイスの反映
          // $('#sidr_battle #cubes').html(that.cube(2));
          let d_type, d_num;
          let at_dice = current_scene.nsAttr('dice');
          if (at_dice) {
            let dices = at_dice.split(':');
            d_type = dices[0];
            d_num  = dices[1];
          }
          dice_obj = new RpgDice(
            '#sidr_battle #cubes',
            (d_type ? d_type : 6),
            (d_num ? d_num : 2),
          );
          dice_obj.show();

          // 簡易ステータスの反映
          that.showSimpleStatus();

          // 共通ルールの反映
          Util.showRuleText(current_scene.nsAttr('rule'));

          // 以降の処理は最初開いた時だけ実行
          if (SideBar.isFirstOpenBattleSheet) {
            SideBar.isFirstOpenBattleSheet = false;
          } else {
            return;
          }

          // 敵／罠リストの整形
          let enemy_list = $('#sidr_battle .enemy tbody');
          enemy_list.empty();

          let at_enemies = current_scene.nsAttr('enemies');
          if (at_enemies) {
            let show_hp = false;  // HP列を表示するか
            let enemies = at_enemies.split(',');
            for (let key of enemies) {
              let enemy = enemies_map[key];
              // 攻撃方法を取得（STR～は末尾の数字を除去）
              let atk = enemy.attack;
              let atk_org = atk;  // 名前に変換前
              if (/^(str|int|dex|krm)/i.test(atk)) {
                atk = atk.replace(/[0-9]{1,2}/, '');
                atk_org = atk;
              }
              atk = Common.state_names[atk];
              let row = $(`<tr class="enemy_row" data-enemy="${key}">
                <td>
                  <input type="checkbox" class="enemy_check" />
                </td>
                <th>
                  <img class="enemy_elem" />　
                  ${enemy.name}
                </th>
                <td class="hp_cell">
                  <input type="button" class="enemy_hp" />
                </td>
                <td>
                  <img class="enemy_attack" />　
                  <span class="enemy_attack_old"></span>
                </td>
                <td>
                  <div class="enemy_func"></div>
                  <span class="enemy_func_old"></span>
                </td>
                <td>
                  <input type="button" class="enemy_drop" />
                  <span class="enemy_drop_old"></span>
                </td>
              </tr>`);
              if (enemies.length === 1) {
                $('.enemy_check', row).hide();
              }
              if(enemy.element) {
                $('.enemy_elem', row)
                  .attr({
                    src: `${ROOT}${COMMON}attr_${enemy.element}.png`,
                    title: Common.element_names[enemy.element]
                  });
              } else {
                $('.enemy_elem', row)
                  .attr({
                    src: `${ROOT}${COMMON}attr_none.png`,
                    title: '無'
                  });
              }

              if (enemy.hp) {
                let hp = enemy.hp;
                // 内部パラメーター対応（現在値で置換）
                if (enemy.hp.startsWith('p')) {
                  hp = Util.getParamValue(hp);
                }
                $('.enemy_hp', row)
                  .attr('data-func_opp', enemy.func_opp)
                  .attr('data-org_hp', enemy.hp)
                  .val(hp);
                show_hp = true;
              } else {
                $('.enemy_hp', row).hide();
              }

              if (atk) {
                $('.enemy_attack', row).attr({
                  src: `${ROOT}${COMMON}atk_${atk_org}.png`,
                  title: atk
                });
                $('.enemy_attack_old', row).hide();
              } else {
                $('.enemy_attack', row).hide();
                $('.enemy_attack_old', row).text(enemy.attack);
              }
              if(enemy.func) {
                if (enemy.func.indexOf('*') === 0) {
                  $('.enemy_func', row).hide();
                  $('.enemy_func_old', row).text(
                    Util.selectFunc(enemy.func.substring(1))
                  );
                } else {
                  let tmp_func = Util.selectFunc(enemy.func);
                  $('.enemy_func', row)
                    .attr({
                      'data-func': tmp_func,
                      'data-attack': enemy.attack,
                    })
                    .text(tmp_func);
                  $('.enemy_func_old', row).hide();
                }
              } else {
                $('.enemy_func', row).hide();
                $('.enemy_func_old', row).hide();
              }
              let tmp_d = Util.dropItem(enemy); 
              if (tmp_d.name) {
                $('.enemy_drop', row)
                  .val(tmp_d.name)
                  .attr('data-drop', tmp_d.drop)
                $('.enemy_drop_old', row).hide();
              } else {
                $('.enemy_drop', row).hide();
              }


              // let row = `<tr class="enemy_row" data-enemy="${key}">`;
              // if (enemies.length > 1) {
              //   row += `<td>
              //     <input type="checkbox" class="enemy_check" />
              //   </td>`;
              //   $('#check_cell').show();
              // } else {
              //   $('#check_cell').hide();
              // }
              // row += `<th>`;
              // if(enemy.element) {
              //   row += `<img src="${ROOT}${COMMON}attr_${enemy.element}.png" title="${ Common.element_names[enemy.element] } + '" />　`;
              // } else {
              //   row += `<img src="${ROOT}${COMMON}attr_none.png" title="無" />　`;
              // }
              // row += `${enemy.name}</th><td>`;
              // if (atk) {
              //   row += '<img src="' + ROOT + COMMON + 'atk_' + enemy.attack + '.png" title="' + atk + '" /></a>　';
              // } else {
              //   row += enemy.attack;
              // }
              // row += '</td><td>';
              // if(enemy.func) {
              //   if (enemy.func.indexOf('*') === 0) {
              //     row += Util.selectFunc(enemy.func.substring(1));
              //   } else {
              //     let tmp_func = Util.selectFunc(enemy.func);
              //     // 改行対応で「>」の前に空白を挿入
              //     row += `<div class="enemy_func" data-func="${tmp_func}" data-attack="${enemy.attack}">${tmp_func}</div>`;
              //   }
              // }
              // row += `</td><td>`;
              // let tmp_d = Util.dropItem(enemy); 
              // if (tmp_d.name) {
              //   row += `<input type="button" class="enemy_drop" value="${tmp_d.name}" data-drop="${tmp_d.drop}" />`;
              // } else {
              //   row += `－`;
              // }
              // row += `</td></tr>`;
              enemy_list.append(row);
            }
            // HP有の魔物がいない場合、HP列を非表示
            if (!show_hp) {
              $('#sidr_battle #hp_cell').hide();
            }
            $('#sidr_battle table.enemy').show();
          } else {
            $('#sidr_battle table.enemy').hide();
            // enemy_list.append('<p>ここには、モンスターの気配はないようだ。</p>');
          }
        },
        function() {}
      );
    },

    // プレイヤーランク情報
    createPlayerRankInfo() {
      this.createSideBar(
        'rank',
        `<div id="sidr_rank" class="sidr_info">
          <table id="sidr_rank_summary" class="sidr_list_noline">
            <tr>
            <td colspan="4">
              <img id="rank_pic" src="" align="left" />
              <div>
                PLAYER LV. <span id="rank_lv"></span>
                <h3>
                <span id="rank_en"></span>
                <span id="rank_jp"></span>
                </h3>
              </div>
            </td>
            </tr>
            <tr>
              <th>CLEAR</th>
              <td id="rank_clear"></td>
              <th>RESULT</th>
              <td id="rank_result"></td>
            </tr>
            <tr>
              <th>BONUS</th>
              <td id="rank_bonus"></td>
              <th>EXP.</th>
              <td id="rank_exp"></td>
            </tr>
          </table>
          <table id="sidr_rank_list" class="sidr_list">
            <thead>
            <tr>
              <th>No.</th>
              <th>Title</th>
              <th>Clear</th>
              <th>Result Rate</th>
            </tr>
            <thead>
            <tbody></tbody>
          </table>
          <div id="sidr_rank_close" class="sidr_close">閉じる</div>
        </div>`,
        function() {
          // サマリ表示
          let rank = PlayerRank.getRank();
          $('#sidr_rank #rank_pic').attr('src', `${ROOT}${COMMON}/rank/rank${rank.level}.png`);
          $('#sidr_rank #rank_jp').text(rank.jp);
          $('#sidr_rank #rank_en').text(`"${rank.en}"`);
          $('#sidr_rank #rank_lv').text(rank.level);
          $('#sidr_rank #rank_clear').text(`${PlayerRank.scena_count}/${PlayerRank.scena_all}`);
          $('#sidr_rank #rank_result').text(`${PlayerRank.scena_results_count}/${PlayerRank.scena_results_all}`);
          $('#sidr_rank #rank_bonus').text(`${PlayerRank.bonus_count}/${PlayerRank.bonus_all}`);
          $('#sidr_rank #rank_exp').text(`${PlayerRank.exp_count}/${PlayerRank.exp_all}`);

          // 詳細表示
          let b = $('#sidr_rank #sidr_rank_list tbody');
          b.empty();
          let i = 1;
          for (let key in PlayerRank.scena_infos) {
            let inf = PlayerRank.scena_infos[key];
            b.append(`<tr>
              <td>${i++}</td>
              <td>${inf.title}</td>
              <td>${inf.is_cleared ? '○' : '' }</td>
              <td>${ Math.floor(inf.results_count / inf.results_all * 100)}%（${inf.results_count}/${inf.results_all}）</td>
            </tr>`);
          }
        },
        function() {}
      );
    },

    // 基本情報
    createBasicInfo() {
      // 種族、性別、年齢ボックスを初期化
      let initOpts = function() {
        let { races, sex, ages } = Util.getCharacterConstraint();
        // 種族ボックス
        let o_races = races ? races : Common.race;
        let jq_race = $('#sidr_basic_race', template);
        jq_race.empty();
        for (let o_race of o_races) {
          $('<option></option>')
            .attr('value', o_race)
            .text(o_race)
            .appendTo(jq_race);
        }
        // 性別ボックス
        let o_sexes = sex ? [ sex ] : Common.sex;
        let jq_sex = $('#sidr_basic_sex', template);
        jq_sex.empty();
        for (let o_sex of o_sexes) {
          $('<option></option>')
            .attr('value', o_sex)
            .text(o_sex)
            .appendTo(jq_sex);
        }
        // 年齢ボックス
        let o_ages = ages ? ages : Common.age;
        let jq_age = $('#sidr_basic_age', template);
        jq_age.empty();
        for (let o_age of o_ages) {
          $('<option></option>')
            .attr('value', o_age)
            .text(o_age)
            .appendTo(jq_age);
        }
      };

      // 顔イメージを変更（引数はrace、sex、age）
      let selectImage = function(race, sex, age) {
        if (!race) { race = save_data.chara.race; }
        if (!sex)  { sex = save_data.chara.sex; }
        if (!age)  { age = save_data.chara.age; }
        let path = `${ROOT}${COMMON}`;
        let imgset = $('init > basic', scenario_data).attr('imgset');
        if (imgset === 'custom') {
          path = `${ROOT}${scenario_code}/chara/`;
        }
        path += String(sex).toLowerCase() + '_'
          + String(age).toLowerCase() + '_'
          + String(race).toLowerCase() + '.png';
        $('#sidr_basic_chara_face').attr('src', path);
      };

      // 職業選択ボックスを生成
      let createJobBox = function() {
        let job_box = $('#sidr_basic #sidr_basic_job');
        job_box.empty();
        for(let job of enabled_jobs) {
          $('<option></option>')
            .attr('value', job)
            .text(job)
            .appendTo(job_box);
        }
        if (enabled_jobs.includes(save_data.chara.job)) {
          job_box.val(save_data.chara.job);
        } else {
          // 現在の条件が合致しない場合、のうふにフォルーバック
          job_box.val('のうふ');
        }
      };

      // 種族、性別、年齢に変更があった場合、顔イメージ、職業選択ボックスも再生成
      target.parent().on('change', '#sidr_basic_race, #sidr_basic_sex, #sidr_basic_age',
        function(e) {
          Util.initJobs(true);
          createJobBox();
          selectImage(
            $('#sidr_basic #sidr_basic_race').val(),
            $('#sidr_basic #sidr_basic_sex').val(),
            $('#sidr_basic #sidr_basic_age').val()
          );
        });

      let template = $(`<div id="sidr_basic" class="sidr_info">
        <p class="side_tab">
          <img src="${ROOT}${COMMON}side/sc_status.png" class="cross" data-title="status" />
          <img src="${ROOT}${COMMON}side/sc_magic.png" class="cross" data-title="magic" />
          <img src="${ROOT}${COMMON}side/sc_item.png" class="cross" data-title="item" />
        </p>
        <img id="sidr_basic_chara_face" class="capture" align="right" />
        <h2>
          "<span id="sidr_basic_title"></span>"
          <!--<span id="sidr_basic_name"></span>-->
          <input id="sidr_basic_name" type="text" />
        </h2>
        <i>
          <span id="sidr_basic_ellapsed_scene"></span>
        </i>
        <table class="sidr_list_noline sidr_basic_table">
        <tr>
          <th>CLASS：</th>
          <td>
            <select id="sidr_basic_race"></select>
            <select id="sidr_basic_sex"></select>
          </td>
        </tr>
        <tr>
          <th>AGE：</th>
          <td>
            <select id="sidr_basic_age"></select>
          </td>
        </tr>
        <tr>
          <th>JOB：</th>
          <td><select id="sidr_basic_job"></select></td>
        </tr>
        </table>
        <hr />
        <textarea id="sidr_basic_memos" placeholder="君は冒険中のメモをここに記録しておいても構わないし、脳裏に留めておいても構わない。"></textarea>
        <div id="sidr_basic_submit" class="sidr_submit">確定</div>
        <div id="sidr_basic_close" class="sidr_close">閉じる</div>
      </div>`);

      // let template = $(`<div id="sidr_basic" class="sidr_info">
      //   <img id="sidr_basic_chara_face" align="right" />
      //   <h2>
      //     "<span id="sidr_basic_title"></span>"
      //     <span id="sidr_basic_name"></span>
      //   </h2>
      //   <i>
      //     <span id="sidr_basic_ellapsed_scene"></span>
      //   </i>
      //   <table class="sidr_list_noline sidr_basic_table">
      //   <tr>
      //     <th>CLASS：</th>
      //     <td>
      //       <span id="sidr_basic_race"></span>　
      //       <span id="sidr_basic_sex"></span>
      //     </td>
      //   </tr>
      //   <tr>
      //     <th>AGE：</th>
      //     <td><span id="sidr_basic_age"></span></td>
      //   </tr>
      //   <tr>
      //     <th>JOB：</th>
      //     <td><select id="sidr_basic_job"></select></td>
      //   </tr>
      //   </table>
      //   <hr />
      //   <textarea id="sidr_basic_memos" placeholder="君は冒険中のメモをここに記録しておいても構わないし、脳裏に留めておいても構わない。"></textarea>
      //   <div id="sidr_basic_submit" class="sidr_submit">確定</div>
      //   <div id="sidr_basic_close" class="sidr_close">閉じる</div>
      // </div>`);
      // 個々の項目を初期化
      // $('#sidr_basic_chara_face', template).attr('src',
      // ROOT + COMMON + String(save_data.chara.sex).toLowerCase()
      //  + '_'
      //  + String(save_data.chara.age).toLowerCase() + '_'
      //  + String(save_data.chara.race).toLowerCase() + '.png');

      // 種族／性別／年齢ボックスを初期化
      initOpts();
      $('#sidr_basic_title', template).text(save_data.chara.title);
      $('#sidr_basic_ellapsed_scene', template).text(`${save_data.ellapsed_scene} scene`);
      //$('#sidr_basic_name', template).text(save_data.chara.name);
      // $('#sidr_basic_race', template).text(save_data.chara.race);
      // $('#sidr_basic_sex', template).text(save_data.chara.sex);
      // $('#sidr_basic_age', template).text(save_data.chara.age);

      // 職業選択ボックスを生成
      // let job_box = $('#sidr_basic_job', template);
      // job_box.empty();
      // for(let job of enabled_jobs) {
      //   $('<option></option>')
      //     .attr('value', job)
      //     .text(job)
      //     .appendTo(job_box);
      // }

      // サイドバーを生成
      this.createSideBar(
        'basic',
        template,
        function() {   
          // 顔イメージを差し替え
          selectImage();
          $('#sidr_basic #sidr_basic_name').val(save_data.chara.name);
          $('#sidr_basic #sidr_basic_race').val(save_data.chara.race);
          $('#sidr_basic #sidr_basic_sex').val(save_data.chara.sex);
          $('#sidr_basic #sidr_basic_age').val(save_data.chara.age);
          $('#sidr_basic #sidr_basic_ellapsed_scene').text(`${save_data.ellapsed_scene} scene`);
          // 職業選択ボックスを生成
          createJobBox();
          //$('#sidr_basic #sidr_basic_job').val(save_data.chara.job);
          $('#sidr_basic #sidr_basic_memos').val(save_data.memos);
        },
        function() {
          save_data.chara.name = $('#sidr_basic #sidr_basic_name').val();
          save_data.chara.race = $('#sidr_basic #sidr_basic_race').val();
          save_data.chara.sex = $('#sidr_basic #sidr_basic_sex').val();
          save_data.chara.age = $('#sidr_basic #sidr_basic_age').val();
          save_data.chara.job = $('#sidr_basic #sidr_basic_job').val();
          save_data.memos = $('#sidr_basic #sidr_basic_memos').val();
          Util.saveStorage();
        }
      );
    },
    // Items & Flags
    createItemFlagInfo() {
      // ［details］ボタンでアイテム詳細を表示
      target.parent().on('click', '#sidr_item_details', function(e) {
        let id = $('#sidr_item #sidr_item_item').val();
        if (!id) { return; }
        let item = items_map[id];
        toastr.success(item.desc, item.name);
      });

      // ［use］ボタンでアイテムを使用
      target.parent().on('click', '#sidr_item_use', function(e) {
        let id = $('#sidr_item #sidr_item_item').val();
        if (!id) { return; }
        let item = items_map[id];
        // target属性の値に応じて自動計算を分岐
        if (item.target) {
          switch (item.target) {
            case 'hp':
              Util.updateHpMp(item.effect, 0);
              break;
            case 'mp':
              Util.updateHpMp(0, item.effect);
              break;
            case 'state':
              Util.updateState(item.effect);
              break;
            case 'str':
              Util.updateStr2Krm(item.effect, 0, 0, 0);
              break;
            case 'int':
              Util.updateStr2Krm(0, item.effect, 0, 0);
              break; 
            case 'dex':
              Util.updateStr2Krm(0, 0, item.effect, 0);
              break; 
            case 'krm':
              Util.updateStr2Krm(0, 0, 0, item.effect);
              break; 
            case 'free1':
              Util.updateFrees(item.effect, 0, 0);
              break; 
            case 'free2':
              Util.updateFrees(0, item.effect, 0);
              break; 
            case 'free3':
              Util.updateFrees(0, 0, item.effect);
              break;
            default:
              break;
          } 
          // アイテムを消費
          Util.updateItems(`-${id}`);
          Util.saveStorage();
          toastr.success(
            item.desc,
            `${item.name}を使った。`);
        } else {
          toastr.error(
            `...しかし、なにも起こらなかった...`,
            `${item.name}を使った。`);
        }
        $.sidr('close', 'sidr_item');
      });

      this.createSideBar(
        'item',
        `<div id="sidr_item" class="sidr_info">
          <p class="side_tab">
            <img src="${ROOT}${COMMON}side/sc_status.png" class="cross" data-title="status" />
            <img src="${ROOT}${COMMON}side/sc_chara.png" class="cross" data-title="basic" />
            <img src="${ROOT}${COMMON}side/sc_magic.png" class="cross" data-title="magic" />
          </p>

          <h2><img src="${ROOT}${COMMON}side/items_flags.png" alt="Items & Flags" /></h2>
          <div>
            ITEMS：
            <input type="button" id="sidr_item_details" value="DETAILS" />
            <input type="button" id="sidr_item_use" value="USE" /><br/>
            <select id="sidr_item_item" size="6"></select>
            <!--<textarea id="sidr_item_item"></textarea>-->
          </div>
          <div>
            FLAGS：<br />
            <select id="sidr_item_flag" size="6"></select>
            <!--<textarea id="sidr_item_flag"></textarea>-->
          </div>
         <div id="sidr_item_close" class="sidr_close">閉じる</div>
       </div>`,
        function() {
          // 現在所持しているアイテム一覧を表示
          let items = $('#sidr_item #sidr_item_item');
          items.empty();
          //let items = [];
          for (let key of save_data.items) {
            let item = items_map[key];
            if (item.target) {
              items.append(`<option value="${key}" class="canuse">★ ${item.name}（${item.desc}）</option>`);
            } else {
              items.append(`<option value="${key}">${item.name}（${item.desc}）</option>`);
            }
            //items.push(`・${item.name}（${item.desc}）`);
          }
          items
            .selectBox({ mobile: true })
            .selectBox('refresh');
          //$('#sidr_item #sidr_item_item').text(items.join('\r'));

          // 現在所持しているフラグ一覧を表示
          let flags = $('#sidr_item #sidr_item_flag');
          flags.empty();
          //let flags = [];
          for (let key of save_data.flags) {
            let f_text = flags_map[key];
            if (f_text.indexOf('*') !== 0) {
              flags.append(`<option value="${key}">・${f_text}</option>`);
              //flags.push(`・${f_text}`);
            }
          }
          flags
            .selectBox({ mobile: true })
            .selectBox('refresh');

          // $('#sidr_item #sidr_item_flag').text(flags.join('\r'));
        },
        function() {}
      );
    },
    // 基本ステータス
    createStatusSheet() {
      let that = this;
      let template = $(`<div id="sidr_status" class="sidr_info">
        <p class="side_tab">
          <img src="${ROOT}${COMMON}side/sc_chara.png" class="cross" data-title="basic" />
          <img src="${ROOT}${COMMON}side/sc_magic.png" class="cross" data-title="magic" />
          <img src="${ROOT}${COMMON}side/sc_item.png" class="cross" data-title="item" />
        </p>
        <h2>
          <img src="${ROOT}${COMMON}side/status.png" alt="Status" />
        </h2>
        <p id="sidr_status_bonus" class="bonus_msg"></p>
        <table id="sidr_status_list">
          <tr>
          <td>
            <div>
              <span id="sidr_status_hp_label">HP</span><br />
              <input type="button" class="spinner_down" value="-" />
              <input id="sidr_status_hp" type="text" />
              <input type="button" class="spinner_up" value="+" />
            </div>
            <div>
              <span id="sidr_status_hp_m_label">HP MAX</span><br />
              <input type="button" class="spinner_down" value="-" />
              <input id="sidr_status_hp_m" type="text" />
              <input type="button" class="spinner_up" value="+" />
            </div>
            <div>
              <span id="sidr_status_mp_label">MP</span><br />
              <input type="button" class="spinner_down" value="-" />
              <input type="text" id="sidr_status_mp" />
              <input type="button" class="spinner_up" value="+" />
            </div>
            <div>
              <span id="sidr_status_mp_m_label">MP MAX</span><br />
              <input type="button" class="spinner_down" value="-" />
              <input type="text" id="sidr_status_mp_m" />
              <input type="button" class="spinner_up" value="+" />
            </div>
          </td>
          <td>
            <div>
            <span id="sidr_status_str_label">STR</span><br />
            <input type="button" class="spinner_down" value="-" />
            <input type="text" id="sidr_status_str" />
            <input type="button" class="spinner_up" value="+" />
            ／<span id="sidr_status_str_i"></span>
            <!--<input type="text" id="sidr_status_str_i" />-->
            </div>
            <div>
            <span id="sidr_status_int_label">INT</span><br />
            <input type="button" class="spinner_down" value="-" />
            <input type="text" id="sidr_status_int" />
            <input type="button" class="spinner_up" value="+" />
            ／<span id="sidr_status_int_i"></span>
            <!--<input type="text" id="sidr_status_int_i" />-->
            </div>
            <div>
            <span id="sidr_status_dex_label">DEX</span><br />
            <input type="button" class="spinner_down" value="-" />
            <input type="text" id="sidr_status_dex" />
            <input type="button" class="spinner_up" value="+" />
            ／<span id="sidr_status_dex_i"></span>
            <!--<input type="text" id="sidr_status_dex_i" />-->
            </div>
            <div>
            <span id="sidr_status_krm_label">KRM</span><br />
            <input type="button" class="spinner_down" value="-" />
            <input type="text" id="sidr_status_krm" />
            <input type="button" class="spinner_up" value="+" />
            ／<span id="sidr_status_krm_i"></span>
            <!--<input type="text" id="sidr_status_krm_i" />-->
            </div>
          </td>
          </tr>
          <tr>
          <td colspan="2">
            <div>
            <span id="sidr_status_state_label">STATE</span><br />
            <label><input type="radio" name="sidr_status_state" value="" />正常</label>
            <label><input type="radio" name="sidr_status_state" value="poison" />毒</label>
            <label><input type="radio" name="sidr_status_state" value="frozen" />凍結</label>
            <label><input type="radio" name="sidr_status_state" value="stone" />石化
            (<span id="sidr_status_stone_scene">0</span>)</label>
            <label><input type="radio" name="sidr_status_state" value="curse" />呪い</label>
            <label><input type="radio" name="sidr_status_state" value="forget" />忘却
            (<span id="sidr_status_forget_scene">0</span>)</label>
            <div id="sidr_status_state_desc">－－－</div>
            </div>
          </td>
          </tr>
        </table>
        <div>
          <table id="sidr_status_free_list">
          <tr>
            <td><span id="sidr_status_free1_label">FREE1</span></td>
            <td><span id="sidr_status_free2_label">FREE2</span></td>
            <td><span id="sidr_status_free3_label">FREE3</span></td>
          </tr>
          <tr>
            <td>
            <input type="button" class="spinner_down" value="-" />
            <input type="text" id="sidr_status_free1" />
            <input type="button" class="spinner_up" value="+" />・ 
            </td>
            <td>
            <input type="button" class="spinner_down" value="-" />
            <input type="text" id="sidr_status_free2" />
            <input type="button" class="spinner_up" value="+" />・ 
            </td>
            <td>
            <input type="button" class="spinner_down" value="-" />
            <input type="text" id="sidr_status_free3" />
            <input type="button" class="spinner_up" value="+" /> 
            </td>
          </tr>
          </table>

          <!--
          <label class="entry">FREE：</label><br />
          <table id="sidr_status_free_list">
          <tr>
          <td>
          <input type="button" class="spinner_down" value="-" />
          <input type="text" id="sidr_status_free1" />
          <input type="button" class="spinner_up" value="+" />・
          <span class="free-label">
          <br />
          <span id="sidr_status_free_label1"></span>
          </span>
          </td>
          <td>
          <input type="button" class="spinner_down" value="-" />
          <input type="text" id="sidr_status_free2" />
          <input type="button" class="spinner_up" value="+" />・
          <span class="free-label">
            <br />
            <span id="sidr_status_free_label2"></span>
          </span>
          </td>
          <td>
          <input type="button" class="spinner_down" value="-" />
          <input type="text" id="sidr_status_free3" />
          <input type="button" class="spinner_up" value="+" />
          <span class="free-label">
            <br />
            <span id="sidr_status_free_label3"></span>
          </span>
          </td>
          </tr>
          </table>
          -->
        </div>
        <div id="sidr_status_submit" class="sidr_submit">確定</div>
        <div id="sidr_status_close" class="sidr_close">閉じる</div>
      </div>`);
      // ステータスの初期化
      // $('#sidr_status_hp_m', template).text(save_data.chara.hp_m);
      // $('#sidr_status_mp_m', template).text(save_data.chara.mp_m);
      $('#sidr_status_str_i', template).text(save_data.chara.str_i);
      $('#sidr_status_int_i', template).text(save_data.chara.int_i);
      $('#sidr_status_dex_i', template).text(save_data.chara.dex_i);
      $('#sidr_status_krm_i', template).text(save_data.chara.krm_i);
      // 状態異常のステータスへの反映（ステータスダイアログ）
      target.parent().on('click', '[name="sidr_status_state"]', function(e) {
        let delta = that.deltaStatus($(this).val());
        $('#sidr_status #sidr_status_state_desc').text(delta.state_desc);
        that.setStateStyle();
      });
      // ［+］［-］ボタンでの星の加減算
      target.parent().on('click', '#sidr_status .spinner_up, .sgml.spinner_up', this.incrementValue);
      target.parent().on('click', '#sidr_status .spinner_down, .sgml.spinner_down', this.decrementValue);
      // サイドバーの生成
      this.createSideBar(
        'status',
        template,
        function() {
          $('#sidr_status #sidr_status_hp').val(save_data.chara.hp);
          $('#sidr_status #sidr_status_mp').val(save_data.chara.mp);
          // 暫定
          // $('#sidr_status #sidr_status_hp_m').text(save_data.chara.hp_m);
          // $('#sidr_status #sidr_status_mp_m').text(save_data.chara.mp_m);

          // 上限値の設定
          $('#sidr_status #sidr_status_hp_m').val(save_data.chara.hp_m);
          $('#sidr_status #sidr_status_mp_m').val(save_data.chara.mp_m);
          $('#sidr_status #sidr_status_str_i').val(save_data.chara.str_i);
          $('#sidr_status #sidr_status_int_i').val(save_data.chara.int_i);
          $('#sidr_status #sidr_status_dex_i').val(save_data.chara.dex_i);
          $('#sidr_status #sidr_status_krm_i').val(save_data.chara.krm_i);

          $('#sidr_status [name="sidr_status_state"]').each(function() {
            var state = $(this).nsAttr('value');
            if(state === save_data.chara.state) {
              $(this).prop('checked', true);
            } else {
              $(this).prop('checked', false);
            }
          });
          $('#sidr_status #sidr_status_stone_scene').text(save_data.chara.stone_scene);
          $('#sidr_status #sidr_status_forget_scene').text(save_data.chara.forget_scene);
          // 状態異常に応じてスタイルを設定
          that.setStateStyle();
          let delta = that.deltaStatus($('[name="sidr_status_state"]:checked').val());
          $('#sidr_status #sidr_status_state_desc').text(delta.state_desc);
          $('#sidr_status #sidr_status_free1').val(save_data.chara.free1);
          $('#sidr_status #sidr_status_free2').val(save_data.chara.free2);
          $('#sidr_status #sidr_status_free3').val(save_data.chara.free3);
          // ラベルを設定
          SideBar.setAllStatusLabels('#sidr_status #sidr_status_#{0}_label');
          // let flabel = $('init > label', scenario_data);
          // if (flabel) {
          //   let setLabel = function(name) {
          //     let tmp = flabel.nsAttr(name);
          //     if (tmp) {
          //       $(`#sidr_status #sidr_status_${name}_label`).text(tmp);
          //     }
          //   };
          //   setLabel('hp');
          //   setLabel('mp');
          //   setLabel('state');
          //   setLabel('str');
          //   setLabel('int');
          //   setLabel('dex');
          //   setLabel('krm');
          //   setLabel('free1');
          //   setLabel('free2');
          //   setLabel('free3');
          // }

          $('#sidr_status #sidr_status_str').val(save_data.chara.str);
          $('#sidr_status #sidr_status_int').val(save_data.chara.int);
          $('#sidr_status #sidr_status_dex').val(save_data.chara.dex);
          $('#sidr_status #sidr_status_krm').val(save_data.chara.krm);

        },
        function() {
          save_data.chara.hp = $('#sidr_status #sidr_status_hp').val();
          save_data.chara.mp = $('#sidr_status #sidr_status_mp').val();
          save_data.chara.hp_m = $('#sidr_status #sidr_status_hp_m').val();
          save_data.chara.mp_m = $('#sidr_status #sidr_status_mp_m').val();
          save_data.chara.free1 = $('#sidr_status #sidr_status_free1').val();
          save_data.chara.free2 = $('#sidr_status #sidr_status_free2').val();
          save_data.chara.free3 = $('#sidr_status #sidr_status_free3').val();
          // save_data.chara.str_i = $('#sidr_status #sidr_status_str_i').val();
          // save_data.chara.int_i = $('#sidr_status #sidr_status_int_i').val();
          // save_data.chara.dex_i = $('#sidr_status #sidr_status_dex_i').val();
          // save_data.chara.krm_i = $('#sidr_status #sidr_status_krm_i').val();
          save_data.chara.str = $('#sidr_status #sidr_status_str').val();
          save_data.chara.int = $('#sidr_status #sidr_status_int').val();
          save_data.chara.dex = $('#sidr_status #sidr_status_dex').val();
          save_data.chara.krm = $('#sidr_status #sidr_status_krm').val();
          Util.updateState($('#sidr_status [name="sidr_status_state"]:checked').val());
          //save_data.chara.state = $('#sidr_status [name="sidr_status_state"]:checked').val();
          Util.saveStorage();
          that.showSimpleStatus();
        }
      );
    },

    // 魔法発動シートの生成
    createMagicSheet() {
      let that = this;
      // 星の減算処理（magic：魔法情報、index：星番号0～6、name：星の名前）
      let useStar = function(magic, index, name) {
        if(magic[index] > 0) {
          let e_star = $(`#sidr_magic #sidr_magic_${name}`);
          let num = Number(e_star.val());
          e_star.val(num - magic[index]);
        }
      };

      let template = $(`<div id="sidr_magic" class="sidr_info">
      <p class="side_tab">
        <img src="${ROOT}${COMMON}side/sc_status.png" class="cross" data-title="status" />
        <img src="${ROOT}${COMMON}side/sc_chara.png" class="cross" data-title="basic" />
        <img src="${ROOT}${COMMON}side/sc_item.png" class="cross" data-title="item" />
      </p>
      <h2><img src="${ROOT}${COMMON}side/magic.png" alt="Magic & STARS" /></h2>
      <p id="sidr_magic_bonus" class="bonus_msg"></p>
      <div>
        <select id="sidr_magic_magic"></select>
        <input type="button" id="sidr_magic_run" value="Shoot" />
      </div>
      <table id="sidr_magic_list">
        <tr>
          <td>
            <div>
            月
            <input type="button" class="spinner_down" value="-" />
            <input type="text" id="sidr_magic_mon" />
            <input type="button" class="spinner_up" value="+" />
            </div>
            <div>
            火
            <input type="button" class="spinner_down" value="-" />
            <input type="text" id="sidr_magic_tue" />
            <input type="button" class="spinner_up" value="+" />
            </div>
            <div>
            水
            <input type="button" class="spinner_down" value="-" />
            <input type="text" id="sidr_magic_wed" />
            <input type="button" class="spinner_up" value="+" />
            </div>
            <div>
            木
            <input type="button" class="spinner_down" value="-" />
            <input type="text" id="sidr_magic_thu" />
            <input type="button" class="spinner_up" value="+" />  
            </div>  
          </td>
          <td>
            <div>
            金
            <input type="button" class="spinner_down" value="-" />
            <input type="text" id="sidr_magic_fri" />
            <input type="button" class="spinner_up" value="+" />
            </div>
            <div>
            土
            <input type="button" class="spinner_down" value="-" />
            <input type="text" id="sidr_magic_sat" />
            <input type="button" class="spinner_up" value="+" />
            </div>
            <div>
            太
            <input type="button" class="spinner_down" value="-" />
            <input type="text" id="sidr_magic_sun" />
            <input type="button" class="spinner_up" value="+" />
            </div>
          </td>
        </tr>
      </table>
      <div id="sidr_magic_submit" class="sidr_submit">確定</div>
      <div id="sidr_magic_close" class="sidr_close">閉じる</div>
      </div>`);
      // ［+］［-］ボタンでの星加算
      target.parent().on('click', '#sidr_magic .spinner_up', this.incrementValue);
      target.parent().on('click', '#sidr_magic .spinner_down', this.decrementValue);
      // 魔法発動ボタンクリック時に星を減算
      $('#sidr_magic_run', template).click(function(e) {
        e.preventDefault();
        let magic_id = $('#sidr_magic #sidr_magic_magic').val();
        // 呪いで実行不可
        if (save_data.chara.state === 'curse' &&
            magic_id !== 'UN-CURCE') {
          toastr.warning(`魔法を詠唱できない！君は呪われている！！`, '状態異常');
          return false;
        }

        let magic = Common.magic[magic_id];
        if (!magic) { return; }
        if($('#sidr_magic #sidr_magic_mon').val() < magic[0] ||
           $('#sidr_magic #sidr_magic_tue').val() < magic[1] ||
           $('#sidr_magic #sidr_magic_wed').val() < magic[2] ||
           $('#sidr_magic #sidr_magic_thu').val() < magic[3] ||
           $('#sidr_magic #sidr_magic_fri').val() < magic[4] ||
           $('#sidr_magic #sidr_magic_sat').val() < magic[5] ||
           $('#sidr_magic #sidr_magic_sun').val() < magic[6]) {
          window.alert('星が不足しているため、魔法を発動できません！');
          return;
        }
        useStar(magic, 0, 'mon');
        useStar(magic, 1, 'tue');
        useStar(magic, 2, 'wed');
        useStar(magic, 3, 'thu');
        useStar(magic, 4, 'fri');
        useStar(magic, 5, 'sat');
        useStar(magic, 6, 'sun');
        // 魔法を自動処理
        that.runMagic(magic_id);
        SeAudio.play('magic', true);
        $('#sidr_magic #sidr_magic_submit').click();
        that.showSimpleStatus();
      });
      // ［+］ボタンでの星加算
      // $('.spinner_up', template).click(this.incrementValue());
      // サイドバーの生成
      this.createSideBar(
        'magic',
        template,
        function() {
          // 呪い時のスタイル設定
          if (save_data.chara.state === 'curse') {
            $('#sidr_magic_magic').addClass('dialog_curse');
          } else {
            $('#sidr_magic_magic').removeClass('dialog_curse');
          }
          // 魔法ボタンの準備
          let magic_box = $('#sidr_magic #sidr_magic_magic');
          magic_box.empty();
          for (let key in Common.magic) {
            let magic = Common.magic[key];
            let option = $('<option></option>')
              .attr('value', key)
              .attr('title', magic[8])
              .text(`${key}（${magic[7]}）`);
            // 魔法が使えなければ、オプションは無効に
            if (!Util.canUseMagic(magic, key)) {
              option.attr('disabled', 'disabled');
            }
            option.appendTo(magic_box);
          }
          // 星の設定
          $('#sidr_magic #sidr_magic_mon').val(save_data.stars[0]);
          $('#sidr_magic #sidr_magic_tue').val(save_data.stars[1]);
          $('#sidr_magic #sidr_magic_wed').val(save_data.stars[2]);
          $('#sidr_magic #sidr_magic_thu').val(save_data.stars[3]);
          $('#sidr_magic #sidr_magic_fri').val(save_data.stars[4]);
          $('#sidr_magic #sidr_magic_sat').val(save_data.stars[5]);
          $('#sidr_magic #sidr_magic_sun').val(save_data.stars[6]);
        },
        function() {
          save_data.stars[0] = $('#sidr_magic #sidr_magic_mon').val();
          save_data.stars[1] = $('#sidr_magic #sidr_magic_tue').val();
          save_data.stars[2] = $('#sidr_magic #sidr_magic_wed').val();
          save_data.stars[3] = $('#sidr_magic #sidr_magic_thu').val();
          save_data.stars[4] = $('#sidr_magic #sidr_magic_fri').val();
          save_data.stars[5] = $('#sidr_magic #sidr_magic_sat').val();
          save_data.stars[6] = $('#sidr_magic #sidr_magic_sun').val();
          Util.saveStorage();
        }
      );
    },

    // ボーナス情報
    createBonusInfo() {
      let template = $(`<div id="sidr_bonus" class="sidr_info">
        <h2><img src="${ROOT}${COMMON}side/bonus.png" alt="Bonus" /></h2>
        <ul id="sidr_bonus_list">
          <li><img id="gi01" /></li>
          <li><img id="gi02" /></li>
          <li><img id="gi03" /></li>
          <li><img id="gi04" /></li>
          <li><img id="gi05" /></li>
          <li><img id="gi06" /></li>
          <li><img id="gi07" /></li>
          <li><img id="gi08" /></li>
          <li><img id="gi09" /></li>
          <li><img id="gi10" /></li>
          <li><img id="gi11" /></li>
          <li><img id="gi12" /></li>
          <li><img id="gi13" /></li>
          <li><img id="gi14" /></li>
          <li><img id="gi15" /></li>
          <li><img id="gi16" /></li>
          <li><img id="gi17" /></li>
          <li><img id="gi18" /></li>
          <li><img id="gi19" /></li>
          <li><img id="gi20" /></li>
          <li><img id="gi21" /></li>
          <li><img id="gi22" /></li>
          <li><img id="gi23" /></li>
          <li><img id="bgi01" /></li>
          <li><img id="bgi02" /></li>
          <li><img id="bgi03" /></li>
          <li><img id="bgi04" /></li>
          <li><img id="bgi05" /></li>
        </ul>
        <div id="sidr_bonus_close" class="sidr_close">閉じる</div>
      </div>`);

      // テンプレートにアイテム情報を反映
      // count：アイテムの個数、prefix：gi（Good）、bgi（Bad）
      let addItemList = function(count, prefix) {
        let num;
        for(let i = 1; i <= count; i++) {
          if(i < 10) {
            num = `0${i}`;
          } else {
            num = i;
          }
          num = `${prefix}${num}`;
          let img = $(`#${num}`, template);
          if ($.inArray(num, global_save_data.items) !== -1) {
            img.
              attr('src', `${ROOT}${COMMON}${num}.png`).
              attr('class', 'bonus_item');
          } else {
            img.
              attr('src', `${ROOT}${COMMON}gi99.png`);
          }
          // 現在適用中のボーナスはハイライト
          if (save_data.bonus === num) {
            img.parent().css('background-color', '#7fffd4');
          }
        }
      };
      // グッドアイテムを一覧表示
      addItemList(Object.keys(Common.global_items.happy).length, 'gi');
      // バッドアイテムを一覧表示
      addItemList(Object.keys(Common.global_items.bad).length, 'bgi');
      // アイテムクリックで詳細を表示
      target.parent().on('click', '#sidr_bonus_list img.bonus_item', function(e) {
        let id = e.target.id;
        let o_bonus_item;
        if (id.startsWith('gi')) {
          o_bonus_item = Common.global_items.happy[id];
        } else {
          o_bonus_item = Common.global_items.bad[id];
        }
        toastr.success(o_bonus_item.desc, o_bonus_item.name);
      });

      // サイドバーの生成
      this.createSideBar(
        'bonus',
        template,
        function() {},
        function() {}
      );
    },

    // 実績情報
    createResultInfo() {
      this.createSideBar(
        'result',
        `<div id="sidr_result" class="sidr_info">
          <h2><img src="${ROOT}${COMMON}side/results.png" alt="Results" /></h2>
          <div id="sidr_result_rate">Rate: 0.0%</div>
          <table id="sidr_result_list">
          </table>
          <div id="sidr_result_close" class="sidr_close">閉じる</div>
        </div>`,
        function() {
          // 実績の数
          let result_count = 0;
          // 獲得した実績の数
          let get_result = 0;
          let trophy = [ '', 'ノーマル', 'ブロンズ', 'シルバー', 'ゴールド', 'プラチナ' ];
          let list = $('#sidr_result #sidr_result_list');
          list.empty();
          Object.keys(results_map).forEach(function(key){
            let row;
            result_count++;
            if (global_save_data['results'][scenario_code] !== undefined &&            
              global_save_data['results'][scenario_code].indexOf(key) !== -1) {
              get_result++;
              row = `<tr>
                <td>
                  <img src="${ROOT}${COMMON}trophy${results_map[key].level}.png"
                    title="${trophy[results_map[key].level]}" />
                </td>
                <td>
                  <h3>${results_map[key].name}
                  （Lv.${results_map[key].level}）</h3>
                  <p>${results_map[key].desc}</p>
                </td>
              </tr>`;
            } else {
              row = `<tr>
                <td>
                  <img src="${ROOT}${COMMON}trophy0.png"
                    title="実績未達" />
                </td>
                <td>
                  <h3>???????????????</h3>
                  <p>???????????????</p>
                </td>
              </tr>`;
            }
            list.append(row);
          });
          // 到達度を反映
          let result_rate = (get_result / result_count * 100).toFixed(1);
          $('#sidr_result #sidr_result_rate').text(`Rate:${result_rate}%`);
        },
        function() {}
      );
    },

    // すべてのサイドバーを生成
    createAll() {
      this.createBasicInfo();
      this.createStatusSheet();
      this.createMagicSheet();
      this.createItemFlagInfo();
      this.createResultInfo();
      this.createBonusInfo();
      this.createPlayerRankInfo();
      this.createBattleSheet();
      target.parent().on('click', 'img.cross', function(e) {
        $.sidr('open', `sidr_${$(this).attr('data-title')}`);
      });
    },

    // すべてのサイドバーをクローズ
    closeAll() {
      let bases = ['basic', 'status', 'magic', 'item', 'result', 'bonus', 'rank', 'battle'];
      for (let base of bases) {
        $.sidr('close', `sidr_${base}`);
      }
    }
  };

  // コントロールパネル（New）
  let ControlPanel = {
    init() {
      $(`<nav class="main-nav" role="navigation">
        <!-- Mobile menu toggle button (hamburger/x icon) -->
        <input id="main-menu-state" type="checkbox" />
        <label class="main-menu-btn" for="main-menu-state">
          <span class="main-menu-btn-icon"></span> Toggle main menu visibility
        </label>
        
        <h2 class="nav-brand"><a href="./">
          <img src="./stext/common/menu/game_logo.png"/>
          <!--<span class="pconly" style="vertical-align: top;">SORCERIAN Text</span>-->
        </a></h2>
        
        <!-- Sample menu definition -->
        <ul id="main-menu" class="sm sm-blue">
          <li><a id="menu_status" title="ステータス" href="#">
            <img class="icon" data-base="status"/></a></li>
          <li><a id="menu_magic" title="魔法" href="#">
            <img class="icon" data-base="magic"/></a></li>
          <li><a title="情報" href="#">
           <img class="icon" data-base="info"/></a>
            <ul>
              <li><a id="menu_basic" title="キャラ情報" data-en="Character">Character</a></li>
              <li><a id="menu_item" title="アイテム/フラグ" data-en="Items & Flags">Items & Flags</a></li>
              <li><a id="menu_result" title="実績" data-en="Results">Result</a></li>
              <li><a id="menu_bonus" title="ボーナス" data-en="Bonus">Bonus</a></li>
              <li><a id="menu_rank" title="プレイヤーランク" data-en="Player Rank">Player Rank</a></li>
            </ul>
          </li>
          <li><a title="システム" href="#"><img class="icon" data-base="system"/></a>
            <ul>
              <li><a id="menu_backup" title="バックアップ" data-en="Backup">Backup</a></li>
              <li><a id="menu_restore" title="リストア" data-en="Restore">Restore</a><input id="menu_restore_select" type="file" accept=".stext" /></li>
              <li><a href="https://sorcerian.hateblo.jp/entries/2017/12/20"
                title="ヘルプ" data-en="Help">Help</a></li>
              <li><a href="./" title="終了" data-en="Exit">Exit</a></li>
            </ul>
          </li>
          <li>
            <a id="menu_audio">
              <img src="./stext/common/menu_audio_on.png" />
            </a>
          </li>
        </ul>
      </nav>`).insertBefore(target);

      // メニューの制御
      let mainmenu = $('#main-menu');
      mainmenu.smartmenus({
        noMouseOver: true,
        subMenusSubOffsetX: 1,
        subMenusSubOffsetY: -8
      });

      let $mainMenuState = $('#main-menu-state');
      if ($mainMenuState.length) {
        // animate mobile menu
        target.parent().on('change', '#main-menu-state', function(e) {
        //$mainMenuState.change(function(e) {
          let $menu = $('#main-menu');
          if (this.checked) {
            $menu.hide().slideDown(250, function() { $menu.css('display', ''); });
          } else {
            $menu.show().slideUp(250, function() { $menu.css('display', ''); });
          }
        });
        // hide mobile menu beforeunload
        $(window).bind('beforeunload unload', function() {
          if ($mainMenuState[0].checked) {
            $mainMenuState[0].click();
          }
        });

        // 
        $('#main-menu img.icon').attr('src', function() {
          return `${ROOT}${COMMON}menu/${$(this).attr('data-base')}.png`;
        });
      
        $('#main-menu img.icon').hover(
          function() {
            $(this).attr('src',
            `${ROOT}${COMMON}menu/${$(this).attr('data-base')}_jp.png`);
          },
          function() {
            $(this).attr('src',
            `${ROOT}${COMMON}menu/${$(this).attr('data-base')}.png`);
          }
        );
      
        $('#main-menu a[data-en]').hover(
          function() {
            if ($(this).attr('data-sub')) {
              $(this).html($(this).attr('title') +
                '<span class="sub-arrow"></span>');
            } else {
              $(this).text($(this).attr('title'));
            }
          },
          function() {
            if ($(this).attr('data-sub')) {
              $(this).html($(this).attr('data-en') +
                '<span class="sub-arrow"></span>');
            } else {
              $(this).text($(this).attr('data-en'));
            }
          }
        );

      }
      // 以上、メニュー本体の制御

      // サイドパネル表示ボタンの生成
      $('<div id="menu_battle">Battle Sheet</div>').insertBefore(target);

      // バックアップの実行
      target.parent().on('click', '#menu_backup', function() {
        Util.downloadSavedata(scenario_code, storage[scenario_code]);
      });

      // リストアの実行（ファイル選択）
      target.parent().on('click', '#menu_restore', function() {
        $('#menu_restore_select').click();
      });
      // ファイル選択でリストア開始
      target.parent().on('change', '#menu_restore_select',function() {
        // 現在のシナリオコードと不一致はエラー
        if (scenario_code !== this.files[0].name.split('-')[0]) {
          window.alert('失敗：現在のシナリオ以外のバックアップはUtilityページからリストアしてください。');
          return;
        }
        Util.restoreSaveData(this, function() {
          window.alert('リストアに成功しました。\nゲームを再起動します。');
          location.reload();
        });
      });

      // オーディオ初期表示
      $('#menu_audio > img').attr('src',
        `${ROOT}${COMMON}menu_audio_${ global_save_data.bgm ? 'on' : 'off'}.png`);
      // BGMオンオフ
      target.parent().on('click', '#menu_audio', function(e) {
        if(bgm) {
          if (global_save_data.bgm) {
            global_save_data.bgm = false;
            $('img', this).attr('src',
              `${ROOT}${COMMON}menu_audio_off.png`);
            bgm.pause();
          } else {
            global_save_data.bgm = true;
            $('img', this).attr('src',
              `${ROOT}${COMMON}menu_audio_on.png`);
            bgm.play();
          }
          Util.saveStorageGlobal();
        }
      });
    }
  };

  // 条件式のための関数群
  let SgmlFunc = {
    // fn:range(40)
    // per％の確率でtrue
    random: function(per) {
      return Util.random(0, 100) <= per;
    },

    // fn:include(2,f01,f02,f03)
    // ids（フラグ／アイテム）をmin個以上持てばtrue
    include: function(min, ...ids) {
      let count = 0;
      for (let id of ids) {
        if (save_data.flags.indexOf(id) !== -1 ||
            save_data.items.indexOf(id) !== -1) {
          count++;
        }  
      }
      return count >= min;
    },

    // fn:range(str,5,10)
    // keyがmin以上max未満でtrue（keyはhp、mp、str～krm、free1～3）
    range: function(key, min, max) {
      let v = 0;
      if (key.startsWith('p')) {
        v = Number(Util.getParamValue(key));
      } else if (key === 'e') {
        v = Number(save_data.ellapsed_scene);
      } else {
        v = Number(Util.getStatusValue(key));
      }
      return min <= v && v < max;
    },

    // fn:cycle(30,3,1)
    // size：1周scene数、div：分割数、index：その何番目か
    cycle: function(size, div, index) {
      let current = Number(save_data.ellapsed_scene);
      size  = Number(size);
      div   = Number(div);
      index = Number(index); 
      // 現在のシーンが何週目か
      let t_cycle = Math.floor(current / size);
      // 現在の周回の先頭／末尾シーン
      let min = (t_cycle * size) + (div * (index - 1)) + 1;
      let max = (t_cycle * size) + (div * index);
      return min <= current && current <= max;
    }
  };

  // ユーティリティ
  var Util = {
    // msec秒だけ処理を休止
    sleep: function(msec) {
      var startMsec = new Date();
      // 指定ミリ秒間だけループさせる（CPUは常にビジー状態）
      while (new Date() - startMsec < msec);
    },

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

    // メッセージをフォーマット
    // format：書式文字列、args：埋め込む値
    formatMessage: function(format, ...args) {
      let result = format;
      for (let i = 0; i < args.length; i++) {
        let holder = '#{' + i + '}';
        result = result.replace(holder, args[i]);
      }
      return result
    },

    // オブジェクトをディープコピー
    deepCopyObject: function(obj) {
      var tmp_obj = JSON.stringify(obj);
      return JSON.parse(tmp_obj);
    },

    // 一定確率で指定の処理を実行
    // weight：重みづけ（合計1未満の配列＝[0.3, 0.4...]）
    // funcs：実行すべき処理（可変長引数）
    processByWeight(weights, ...funcs) {
      let num = 0;
      let rand = Math.random();
      for (let i = 0; i < weights.length; i++) {
        num += weights[i];
        if (rand < num) {
          funcs[i]();
          return;
        }
      }
    },

    // セーブデータをストレージに保存
    saveStorage: function() {
      storage[scenario_code] = JSON.stringify(save_data);
    },

    // セーブデータをストレージから取得
    loadStorage: function() {
      save_data = JSON.parse(storage[scenario_code]);
    },

    // グローバルセーブデータをストレージに保存
    saveStorageGlobal: function() {
      storage[GLOBAL_SAVE_DATA_KEY] = JSON.stringify(global_save_data);
      //storage[GLOBAL_SAVE_DATA_KEY + '_double'] = storage[GLOBAL_SAVE_DATA_KEY];
    },

    // グローバルセーブデータをストレージから取得
    loadStorageGlobal: function() {
      //global_save_data = JSON.parse(storage[GLOBAL_SAVE_DATA_KEY]);
      global_save_data = $.extend(
        true,
        {},
        Util.getEmptyGlobalSaveData(),
        JSON.parse(storage[GLOBAL_SAVE_DATA_KEY])
      );
      Util.saveStorageGlobal(GLOBAL_SAVE_DATA_KEY);
    },

    // 種族、性別、年齢の制約情報を取得
    getCharacterConstraint: function() {
      let constraint = $('init > constraint', scenario_data);
      let init = {
        races: null,
        sex: null,
        ages: null
      };
      if (constraint) {
        let init_races = constraint.nsAttr('race');
        if (init_races) { init.races = init_races.split(','); }
        init.sex = constraint.nsAttr('sex');
        let init_ages = constraint.nsAttr('age');
        if (init_ages) { init.ages = init_ages.split(','); }
      }
      return init;
    },

    // 指定されたステータスのラベルを取得
    getStatusLabel: function(name) {
      let result = '';
      let flabel = $('init > label', scenario_data);
      if (flabel) {
        result = flabel.nsAttr(name);
        if (result) {
          return result;
        }
      }
      return name.toUpperCase();
    },

    // セーブデータの初期化
    initSavedata: function() {
      // 制約情報を取得
      let { races: init_races, sex: init_sex, ages: init_ages } = Util.getCharacterConstraint();
      // var constraint = $('init > constraint', scenario_data);
      // var init_races, init_sex, init_ages;
      // if (constraint) {
      //   var init_races = constraint.nsAttr('race');
      //   if (init_races) { init_races = init_races.split(','); }
      //   var init_sex = constraint.nsAttr('sex');
      //   var init_ages = constraint.nsAttr('age');
      //   if (init_ages) { init_ages = init_ages.split(','); }
      // }
      // 種族／性別で絞り込まれたpc_initからランダムに取得
      var pc_base = this.randomArray(Common.pc_init.
        // 種族でフィルター（無指定でスキップ）
        filter(function(value) {
          if (init_races) {
            return init_races.includes(value[0]);
          } else {
            return true;
          }
        }).
        // 性別でフィルター（無指定でスキップ）
        filter(function(value) {
          if (init_sex) {
            return init_sex === value[1];
          } else {
            return true
          }
        })
      );
      var hp_m = this.random(pc_base[2], pc_base[2] + 10);
      var mp_m = this.random(pc_base[3], pc_base[3] + 10);
      var str_i = this.minMaxGuard(this.random(pc_base[4], pc_base[4] + 2));
      var int_i = this.minMaxGuard(this.random(pc_base[5], pc_base[5] + 2));
      var dex_i = this.minMaxGuard(this.random(pc_base[6], pc_base[6] + 2));
      var krm_i = this.minMaxGuard(this.random(pc_base[7], pc_base[7] + 2));
      // 旧セーブデータからメモを取得
      var old_data = storage[scenario_code];
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
          age: this.randomArray(
            ['YOUNG', 'ADULT', 'OLD'].
              filter(function(value) {
                if (init_ages) {
                  return init_ages.includes(value);
                } else {
                  return true;
                }
            })
          ),
          // 職業
          job: '',
          // 状態異常
          state: '',
          // 石化／忘却の経過シーン数
          stone_scene: 0,
          forget_scene: 0,
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
          free2: 0,
          free3: 0
        },
        // 所有している七惑星の欠片（月、火星、水星、木星、金星、土星、太陽）
        stars: [0, 0, 0, 0, 0, 0, 0],
        // 所有しているアイテム
        items: [],
        // 所有しているフラグ
        flags: [],
        // 所有しているパラメーター
        params: {},
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

      // 現在の条件で利用可能な職業を初期化＆現在の職業を設定
      this.initJobs();
      save_data.chara.job = this.randomArray(enabled_jobs);

      this.saveStorage();
    },

    getEmptyGlobalSaveData: function() {
      return {
        // 所有しているボーナスアイテム
        items: [],
        // 所有している実績（「シナリオコード: 実績」の形式）
        results: {},
        // BGMを再生するか
        bgm: true,
        // コントロールパネルを表示するか
        panel: true
      };
    },

    // グローバルなセーブデータを初期化
    initGlobalSaveData: function() {
      global_save_data = Util.getEmptyGlobalSaveData();
      // global_save_data = {
      //   // 所有しているボーナスアイテム
      //   items: [],
      //   // 所有している実績（「シナリオコード: 実績」の形式）
      //   results: {},
      //   // BGMを再生するか
      //   bgm: true,
      //   // コントロールパネルを表示するか
      //   panel: true
      // };
      this.saveStorageGlobal(GLOBAL_SAVE_DATA_KEY);
    },

    // 利用可能なジョブを初期化
    // 引数input：基本シートからの入力か
    initJobs: function(input) {
      enabled_jobs = Object.keys(Common.jobs).filter(function(name) {
        var cond = Common.jobs[name];
        if (input) {
          // シートからの変更時
          var race = $('#sidr_basic #sidr_basic_race').val();
          var sex = $('#sidr_basic #sidr_basic_sex').val();
          var age = $('#sidr_basic #sidr_basic_age').val();
        } else {
          // 初期化時
          var race = save_data.chara.race;
          var sex = save_data.chara.sex;
          var age = save_data.chara.age;
        }
        return cond[0].indexOf(race.charAt(0)) !== -1 &&
          cond[1].indexOf(sex.charAt(0)) !== -1 &&
          cond[2].indexOf(age.charAt(0)) !== -1;
        // return cond[0].indexOf(save_data.chara.race.charAt(0)) !== -1 &&
        //   cond[1].indexOf(save_data.chara.sex.charAt(0)) !== -1 &&
        //   cond[2].indexOf(save_data.chara.age.charAt(0)) !== -1;
      });
    },

    // セーブデータのダウンロード処理
    // 引数scena_id：シナリオコード、data：データ本体
    downloadSavedata: function(scena_id, data) {
      var ua = navigator.userAgent.toLowerCase();
      if (ua.indexOf('safari') !== -1 &&
        ua.indexOf('chrome') === -1 && ua.indexOf('edge') === -1){
          window.open('./stext/download.php?id=' + scena_id +
          '&data=' + data);
      } else {
        var blob = new Blob([ data ], { 'type': 'application/octet-stream' });
        var anchor = document.createElement('a');
        anchor.href = window.URL.createObjectURL(blob);
        anchor.download = scena_id + '-' + (new Date()).getTime()  + '.stext';
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
      }
    },

    // セーブデータをリストア
    // 引数el：ファイル入力ボックス（Element）、
    // done：リストア終了時の処理（function）
    restoreSaveData: function(el, done) {
      var input = el.files[0];
      var fname = input.name.split('-')[0];
      var reader = new FileReader();
      $(reader).on('load', function() {
        if (fname === 'all') {
          var data = reader.result.split('\n');
          var key = '';
          var value = '';
          for (var i = 0; i < data.length; i++) {
            if (i % 2 === 0) {
              key = data[i];
            } else {
              value = data[i];
              if (value) {
                storage[key] = value;
              }
            }
          }
        } else {
          storage[fname] = reader.result;
        }
        done();
      });
      reader.readAsText(input, 'UTF-8');
    },

    // 再生すべきbgmのパスを生成
    buildBgmPath: function(base) {
      // 指定ファイルが空ならば、メインテーマ
      if (base === '') {
        base = bgms_map.main;
      }
      // 指定ファイルがSText標準の場合
      if (base.indexOf('@') === 0) {
        return ROOT + COMMON + BGM + base.substring(1) + '.mp3';
      } else {
        return ROOT + scenario_code + '/' + BGM + base + '.mp3';
      }
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
        if (tmp_scenes.indexOf(tmp_s.nsAttr('id')) === -1) {
          tmp_scenes.push(tmp_s.nsAttr('id'));
        } else {
          error_messages.push({
            scene_id: tmp_s.nsAttr('id'),
            message: 'scene－idが重複しています。'
          });
        }
        // 各種id値をチェック
        checkId(items_map, tmp_s.nsAttr('items'), tmp_s.nsAttr('id'));
        checkId(flags_map, tmp_s.nsAttr('flags'), tmp_s.nsAttr('id'));
        checkId(enemies_map, tmp_s.nsAttr('enemies'), tmp_s.nsAttr('id'));
        checkId(results_map, tmp_s.nsAttr('result'), tmp_s.nsAttr('id'));
      });
      return error_messages;
    },

    // 引数destが90000（戻る）の場合のリンク先（それ以外はそのまま引数を返す）
    // 内部パラメーターp99があればその値、さもなければfalse（ブラウザーバック）
    getBackLinkNumber(dest) {
      if (Number(dest) === 90000) {
        if (save_data.params) {
          let back = save_data.params['p99'];
          return (back ? back : false);
        } else {
          return false;
        }
      }
      return dest;
    },

    // ランダムリンクから移動先を決定
    // dest：リンク先（「to1,to2,...;7」の形式）
    // 「;7」はキャッシュの日数
    getRandomLinkNumber(dest) {
      if (dest.indexOf(',') !== -1) {
        let tmp = dest.split(';');
        let result = Util.randomArray(tmp[0].split(',')).trim();
        // キャッシュ有効時
        if (tmp[1]) {
          let name = `random_${scenario_code}${save_data.scene}`;
          // キャッシュが存在する場合には上書き
          cval = Cache.getItem(name);
          if (cval) {
            result = cval;
          } else {
            Cache.setItem(name, result, Number(tmp[1]));
          }
        }
        return result;
      }
      return dest;
    },

    // スプラッシュ画面の起動
    // showSplash() {
    //   $.zoombox.open(ROOT + COMMON + 'title.png', { duration: 400 });
    // },

    // 指定された魔法を利用できるかを判定
    // 引数magic：個々の魔法情報配列、key：魔法名（任意） 
    canUseMagic: function(magic, key) {
      if(save_data.stars[0] < magic[0] ||
         save_data.stars[1] < magic[1] ||
         save_data.stars[2] < magic[2] ||
         save_data.stars[3] < magic[3] ||
         save_data.stars[4] < magic[4] ||
         save_data.stars[5] < magic[5] ||
         save_data.stars[6] < magic[6]) {
        return false;
      } else {
        if (save_data.chara.state === 'curse' &&
            key !== 'UN-CURCE') {
          return false;
        } else {
          return true;
        }
      }
    },

    // 指定された魔法を利用できるかを判定（引数はm＜魔法名＞）
    canUseMagicByName: function(name) {
      if (name.indexOf('m') === 0) {
        return Util.canUseMagic(Common.magic[name.substring(1)]);
      }
      return false;
    },
    
    // 指定されたパラメーター条件を満たしているかを判定（引数はp＜id＞:値）
    ifParam: function(cond) {
      if (cond.startsWith('p')) {
        let [p_name, p_value] = cond.split(':');
        // 現在値を取得
        let current = save_data.params[p_name];
        // 未初期化の場合は初期化
        if (!current) {
          current = params_map[p_name].initial;
        }
        // 数値の場合（@付き）
        if (p_value.startsWith('@')) {
          return Number(p_value.substring(1)) === Number(current);         
        // 文字列の場合
        } else if (!$.isNumeric(p_value)) {
          return p_value === current;
        // 数値の場合（@なし）
        } else {
          return Number(current) >= Number(p_value)
        }
      }
      return false;
    },

    // 指定されたステータス条件を満たしているかを判定（引数はo＜条件＞）
    ifStatus: function(cond) {
      if (cond.indexOf('o') === 0) {
        // 「oSTR6+」のような文字列を分解
        var cond_set = cond.match(
          /o(hp|mp|str|int|dex|krm|freei|freeii|freeiii)\s*(\d{1,})(\+|-)\s*/i);
        cond_set[1] = cond_set[1].toLowerCase();
        cond_set[1] = cond_set[1].replace('freeiii', 'free3');
        cond_set[1] = cond_set[1].replace('freeii', 'free2');
        cond_set[1] = cond_set[1].replace('freei',  'free1');
        var current_value = save_data.chara[cond_set[1]];
        // 「-」であれば指定値未満か、「+」であれば指定値より大きいかを判定
        if (cond_set[3] === '-') {
          return current_value < Number(cond_set[2]);
        } else {
          return current_value > Number(cond_set[2]);
        }
      }
      return false;
    },

    // 指定された経過日数条件を満たしているかを判定（引数はe＜条件＞）
    ifEllapsedScene(cond) {
      if (cond.startsWith('e')) {
        let current = Number(save_data.ellapsed_scene);
        let cond_set = cond.substring(1).split(':');
        if (cond_set.length === 1) {
          return Number(current) >= Number(cond_set[0]);
        } else if (cond_set.length === 3) {
          let cycle = Number(cond_set[0]);  // 1周scene数
          let div   = Number(cond_set[1]);  // 分割数
          let index = Number(cond_set[2]);  // その何番目か

          // 現在のシーンが何週目か
          let t_cycle = Math.floor(current / cycle);
          // 現在のシーンの分割時のシーン数
          // let t_div = Math.floor(cycle / div);
          // 現在の周回の先頭シーン
          let min = (t_cycle * cycle) + (div * (index - 1)) + 1;
          let max = (t_cycle * cycle) + (div * index);
          return min <= current && current <= max;
        } else {
          console.error('Ellapsed_scene condition is invalid.');
        }
      }
      return false;
    },

    // 種族／性別／年齢／状態異常の合致を確認
    isCharaState: function(state) {
      if (state.indexOf('x') === 0) {
        var tmp_state = [save_data.chara.race, save_data.chara.sex,
          save_data.chara.age, save_data.chara.state.toUpperCase(),
          save_data.chara.job ];
        return tmp_state.indexOf(state.substring(1).toUpperCase()) !== -1;
      }
      return false;
    },

    // 条件関数から真偽を判定
    ifFunction: function(exp) {
      let result = exp.match(/fn:(?<name>[a-z0-9]+)\[(?<args>.*?)\]/i);
      if (result) {
        let name = result.groups.name;
        let args = result.groups.args.split(',');
        switch (name) {
          case 'random' :
            return SgmlFunc.random(...args);
          case 'include' :
            return SgmlFunc.include(...args);
          case 'range' :
            return SgmlFunc.range(...args);
          case 'cycle' :
            return SgmlFunc.cycle(...args);
          default :
            throw new Error('Function Name is invalid.');
        }
      }
      return false;
    },

    // 指定された星を所有しているかを確認（個々の判定＝s1:1:1:1:1:1:1, 総計＝s10）
    hasStars: function(at_stars) {
      if (at_stars.indexOf('s') === 0) {
        var stars = save_data.stars;
        if (at_stars.indexOf(':') !== -1) {
          at_stars = at_stars.substring(1).split(':');
          // 所持数がひとつでも下回っていたら不可
          for (var i = 0; i < at_stars.length; i++) {
            if (Number(stars[i]) < at_stars[i]) {
              return false;
            }
          }
        } else {
          at_stars = Number(at_stars.substring(1));
          // 所持する星の総数を演算
          var star_sum = 0;
          for (var i = 0; i < 7; i++) {
            star_sum += Number(stars[i]);
          }
          if (star_sum < at_stars) {
            return false;
          }
        }
        return true;
      }
      return false;
    },

    // 指定された実績を持っているか（引数はr01:scepterの形式）
    hasResult: function(result) {
      if (result.indexOf('r') === 0) {
        var results = result.split(':');
        var info = global_save_data['results'][results[1].trim()];
        if (info !== undefined) {
          return info.indexOf(results[0].trim()) !== -1
        }
      }
      return false;
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

        // 隠しフラグのみ削除可
        if (flag.indexOf('-') === 0) {
          flag = this.ltrim(flag);
          if (flags_map[flag].indexOf('*') === 0) {
            flags = this.shiftUnique(flags, flag);
          } else {
            console.log(flag + '：隠しフラグ以外は削除できません。'); 
          }
        } else {
          this.pushUnique(flags, flag);
        }
      }
      save_data.flags = flags;
    },

    // @params属性（at_params）の値に応じて、セーブデータのparamsプロパティを更新
    updateParams: function(at_params) {
      if(!at_params) { return; }
      // パラメーター情報を取得
      let params = save_data.params;
      if (!params) {
        save_data.params = {};
      }
      for(let p of at_params.split(',')) {
        let [p_name, p_value] = p.split(':');
        let current = params[p_name];
        // 未初期化の場合は初期化
        if (!current) {
          current = params_map[p_name].initial;
        }
        // 値の更新（文字列ではそのままセット）
        if (isNaN(p_value) && !p_value.startsWith('@')) {
          current = p_value;
        } else {
          if (p_value.startsWith('@')) {
            current = p_value.substring(1);
          } else {
            let min = params_map[p_name].min;
            let max = params_map[p_name].max;
            let tmp_current = Number(current) + Number(p_value);
            if (min && max) {
              if (tmp_current < Number(min)) {
                current = Number(min);
              } else if (tmp_current > Number(max)) {
                current = Number(max);
              } else {
                current = tmp_current;  
              }
            } else {
              current = tmp_current;
            }
          }
        }
        params[p_name] = current;
      }
      save_data.params = params;
    },

    // 現在の状態異常に応じてステータスを更新
    updateStates: function() {
      // 毒の場合はシーンごとにHP-1
      if (save_data.chara.state === 'poison') {
        save_data.chara.hp -= 1;
        save_data.chara.stone_scene = 0;
        save_data.chara.poison_scene = 0;
      // 石化／忘却では経過シーンを記録
      } else if (save_data.chara.state === 'stone') {
        save_data.chara.stone_scene += 1;
        save_data.chara.forget_scene = 0;
        // 30scene経過で死亡通知
        if (save_data.chara.stone_scene === 30) {
          toastr.error('原因：石化より30Sceneが経過したため', 'あなたは死んでしまった');
        }
      } else if (save_data.chara.state === 'forget') {
        save_data.chara.forget_scene += 1;
        save_data.chara.stone_scene = 0;
        // 20scene経過で死亡通知
        if (save_data.chara.forget_scene === 20) {
          toastr.success('20Scene経過で忘却が解消された！', '忘却解除');
          save_data.chara.forget_scene = 0;
          Util.updateState('-forget');
        }
      } else {
        save_data.chara.stone_scene = 0;
        save_data.chara.forget_scene = 0;
      }
    },

    // @stars属性（at_stars）の値に応じて、セーブデータのstarsプロパティを更新
    updateStars: function(at_stars) {
      if(!at_stars) { return; }
      var stars = save_data.stars;
      // 「1,1,1,...」の形式の場合、個別の星に反映
      if (at_stars.indexOf(",") !== -1) {
        at_stars = at_stars.split(',');
        // stars属性の内容を順に反映
        for (var i = 0; i < at_stars.length; i++) {
          stars[i] = Number(stars[i]) + Number(at_stars[i].trim());
          // 減算で負数になった星はゼロ丸め
          if (stars[i] < 0) { stars[i] = 0; }
        }
      // 「div2」の形式で、すべての星を1/2（2の部分は可変） 
      } else if (at_stars.indexOf('div') === 0) {
        at_stars = at_stars.substring(3);
        for (var i = 0; i < 7; i++) {
          stars[i] = Math.floor(Number(stars[i]) / Number(at_stars));
        }
      }
      save_data.stars = stars;
    },

    // 移動ボタンの条件式に応じて、セーブデータのstarsプロパティを更新（成否をtrue／falseで返す）
    updateStarsByMagic: function(cond) {
      // 無指定、または「-」条件ではなにもしない
      if (cond === undefined || cond.indexOf('-') === 0) {
        return true;
      }
      var stars = save_data.stars.concat();
      // 指定された魔法で星を減算（星の何れかが0未満でfalse）
      var useStar = function(magic) {
        for (var i = 0; i < stars.length; i++) {
          stars[i] -= magic[i];
          if (stars[i] < 0) { return false; }
        }
        return true;
      };
      // 「+」条件式から魔法に関する条件のみを抽出
      var conds = cond.split(',').filter(function(value) {
        return value.indexOf('m') === 0;
      });
      // 該当する魔法分だけ星を減算
      for (var i = 0; i < conds.length; i++) {
        var magic = Common.magic[conds[i].substring(1)];
        if (!magic) { return; }
        // 魔法が使える＆減算後も星が足りているか
        if (Util.canUseMagic(magic)) {
          if (!useStar(magic)) { return false; };
        } else {
          return false;
        }
      }
      // 星を反映
      save_data.stars = stars;
      Util.saveStorage();
      return true;
    },

    // star（キーsun、mon...）とvalue（加算値）で更新
    updateStarById: function(star, value) {
      var num = Object.keys(Common.star_names).indexOf(star);
      save_data.stars[num] = Number(save_data.stars[num]) + Number(value);
    },

    // 更新データ（at_obj）の値に基づいて、セーブデータの
    // hp_m/mp_m、str_i/int_i/dex_i/krm_iを更新
    // at_objには、hp_m/mp_m、str_i～krm_iプロパティ
    updateHp2KrmMax: function(at_obj) {
      let props = ['hp_m', 'mp_m',
        'str_i', 'int_i', 'dex_i', 'krm_i'];
      // propがat_objに存在する場合だけ処理
      for (prop of props) {
        if (at_obj[prop]) {
          let v = at_obj[prop].split('..');
          if (v[1]) {
            v[0] = Util.random(Number(v[0]), Number(v[1]));
          }
          // ★懸案★現在は負数を許容
          save_data.chara[prop] = Number(save_data.chara[prop]) + Number(v[0]);
        }
      }
    },

    // @hp（at_hp）、@mp（at_mp）の値に応じて、
    // セーブデータのhp、mpプロパティを更新
    updateHpMp: function(at_hp, at_mp) {
      // hp属性の処理
      if (at_hp) {
        // full指定で全快
        if (at_hp === 'full') {
          save_data.chara.hp = save_data.chara.hp_m;
        } else if (at_hp === 'half') {
          save_data.chara.hp = Math.floor(save_data.chara.hp_m / 2);
        } else {
          // 「-5..-1」で-5～-1の意味
          var hp = String(at_hp).split('..');
          if (hp[1]) {
            hp[0] = Util.random(Number(hp[0]), Number(hp[1]));
          }
          save_data.chara.hp = Number(save_data.chara.hp) + Number(hp[0]);
          // 上限を超えた場合には上限丸め
          if (save_data.chara.hp > save_data.chara.hp_m) {
            save_data.chara.hp = save_data.chara.hp_m;
          }
        }
      }
      // mp属性の処理
      if (at_mp) {
        // full指定で全快
        if (at_mp === 'full') {
          save_data.chara.mp = save_data.chara.mp_m;
        } else if (at_mp === 'half') {
          save_data.chara.mp = Math.floor(save_data.chara.mp_m / 2);
        } else {
          // 「-5..-1」で-5～-1の意味
          var mp = String(at_mp).split('..');
          if (mp[1]) {
            mp[0] = Util.random(Number(mp[0]), Number(mp[1]));
          }
          save_data.chara.mp = Number(save_data.chara.mp) + Number(mp[0]);
          // 上限を超えた場合には上限丸め
          if (save_data.chara.mp > save_data.chara.mp_m) {
            save_data.chara.mp = save_data.chara.mp_m;
          }
        }
      }
    },

    // @str（at_str）, @int（at_int）, @dex（at_dex）,@krm（at_krm）の値に応じて、
    // セーブデータのstr、int、dex、krmプロパティを更新
    updateStr2Krm: function(at_str, at_int, at_dex, at_krm) {
      // str属性の処理
      if (at_str) {
        // full指定で初期値に
        if (at_str === 'full') {
          save_data.chara.str = save_data.chara.str_i;
        // @num指定で、指定値を設定
        } else if (String(at_str).indexOf('@') === 0) {
          save_data.chara.str = Number(at_str.substring(1));
        } else {
          save_data.chara.str = Number(save_data.chara.str) + Number(at_str);
        }
      }
      // int属性の処理
      if (at_int) {
        // full指定で初期値に
        if (at_int === 'full') {
          save_data.chara.int = save_data.chara.int_i;
        // @num指定で、指定値を設定
        } else if (String(at_int).indexOf('@') === 0) {
          save_data.chara.int = Number(at_int.substring(1));
        } else {
          save_data.chara.int = Number(save_data.chara.int) + Number(at_int);
        }
      }
      // dex属性の処理
      if (at_dex) {
        // full指定で初期値に
        if (at_dex === 'full') {
          save_data.chara.dex = save_data.chara.dex_i;
        // @num指定で、指定値を設定
        } else if (String(at_dex).indexOf('@') === 0) {
          save_data.chara.dex = Number(at_dex.substring(1));
        } else {
          save_data.chara.dex = Number(save_data.chara.dex) + Number(at_dex);
        }
      }
      // krm属性の処理
      if (at_krm) {
        // full指定で初期値に
        if (at_krm === 'full') {
          save_data.chara.krm = save_data.chara.krm_i;
        // @num指定で、指定値を設定
        } else if (String(at_krm).indexOf('@') === 0) {
          save_data.chara.krm = Number(at_krm.substring(1));
        } else {
          save_data.chara.krm = Number(save_data.chara.krm) + Number(at_krm);
        }
      }
    },

    // @free1（at_free1）, @free2（at_free2）, @free3（at_free3）の値に応じて、
    // セーブデータのfree1、free2、free3プロパティを更新
    updateFrees: function(at_free1, at_free2, at_free3) {
      // 入力値を「..」で分離
      // 引数input：5、1..5の形式、戻り値：Number
      let range = function(input) {
        var output = String(input).split('..');
        if (output[1]) {
          output[0] = Util.random(Number(output[0]), Number(output[1]));
        }
        return Number(output[0]);
      };

      if (at_free1) {
        if (at_free1.indexOf('@') === 0) {
          save_data.chara.free1 = Number(at_free1.substring(1));
        } else {
          save_data.chara.free1 = Number(save_data.chara.free1) + range(at_free1);
        }
      }
      if (at_free2) {
        if (at_free2.indexOf('@') === 0) {
          save_data.chara.free2 = Number(at_free2.substring(1));
        } else {
          save_data.chara.free2 = Number(save_data.chara.free2) + range(at_free2);
        }
      }
      if (at_free3) {
        if (at_free3.indexOf('@') === 0) {
          save_data.chara.free3 = Number(at_free3.substring(1));
        } else {
          save_data.chara.free3 = Number(save_data.chara.free3) + range(at_free3);
        }
      }
    },

    // @state属性（at_state）の値に応じて、状態異常を更新
    updateState: function(at_state) {
      if (at_state === undefined) { return; }
      if (at_state.indexOf('-') === 0) {
        let state = at_state.substring(1);
        if (state === 'all') {
          // 無条件解除
          save_data.chara.state = '';
        } else {
          // 現在指定の異常の場合のみ解除
          if (save_data.chara.state === state) {
            save_data.chara.state = '';
          }
        }
      } else {
        if (Bonus.guardState(at_state)) {
          save_data.chara.state = at_state;
        } else {
          let name = Common.state_names[at_state];
          toastr.warning(`${name}耐性が作動！${name}を防いだ！！`, 'シナリオボーナス');
          return false;
        }
      }
      return true;
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
        toastr.options.timeOut = 5000;
        toastr.success(results_map[at_result].name, '実績獲得');
        //this.toast('実績「' + results_map[at_result].name + '」を獲得');
        try {
          PlayerRank.incrementResult(scenario_code);
        } catch(e) {
          console.log(e);
        }
      }
      this.saveStorageGlobal();
    },

    // 指定されたメッセージをトースト表示
    // toast: function(msg) {
    //   $('.toast').remove();
    //   $('body').append('<div class="toast">' + msg + '</div>');
    //   var leftpos = $('body').width() / 2 - $('.toast').outerWidth() / 2;
    //   $('.toast').css('left', leftpos).hide().fadeIn('fast');
    //   setTimeout(function() {
    //     $('.toast').fadeOut('slow',function(){
    //       $(this).remove();
    //     });
    //   }, 4000);
    // },

    // num個のサイコロ（HTML文字列）を取得
    // cube: function(num) {
    //   if (num === undefined) { num = 1; }
    //   var html = '';
    //   for (var i = 0; i < num; i++) {
    //     // ダイスの値を保管
    //     dice[i] = this.random(1, 6);
    //     html += '<img src="' + ROOT + COMMON +'cube' + dice[i] + '.png" class="dice" />';
    //   }
    //   return html;
    // },

    // ドロップアイテムの生成
    // 戻り値：オブジェクト（drop：data-dropの値、name：表示名）
    dropItem: function(enemy) {
      // drop属性がある場合は、こちらで生成
      if(enemy.drop) {
        // drop属性が複数指定の場合には分解
        let t_drop = Util.selectDrop(enemy.drop);
        var drops = t_drop.split('/');
        //var drops = enemy.drop.split('/');
        var star_name = Common.star_names[drops[0]];
        // 星指定の場合
        if (star_name) {
          var num = (drops[1] === '1' ? '' : '×' + drops[1]);
          return {
            drop: t_drop,
            name: star_name + num
          };
        // 星以外の指定の場合
        } else {
          return {
            drop: t_drop,
            name: drops[2]
          };
        }
      }
      // drop属性がない場合には、element属性に基づいて生成
      if(!enemy.element) {
        return { name: null };
      }
      var drop = {
        // ★暫定
        //'地': [ 'thu', 'tue', 'sat', '', '' ],
        //'火': [ 'tue', 'sun', 'tue', '', '' ],
        //'水': [ 'wed', 'mon', 'fri', '', '' ],
        //'風': [ 'fri', 'wed', 'mon', '', '' ],
        //'霊': [ 'sat', 'sun', 'mon', '', '' ],
        // 新仕様
        'earth': [ 'thu', 'tue', 'sat', '', '' ],
        'fire': [ 'tue', 'sun', 'tue', '', '' ],
        'water': [ 'wed', 'mon', 'fri', '', '' ],
        'wind': [ 'fri', 'wed', 'mon', '', '' ],
        'spirit': [ 'sat', 'sun', 'mon', '', '' ]
      };
      var tmp_d = Util.randomArray(drop[enemy.element]);
      return {
        drop: (tmp_d ? tmp_d + '/1' : ''),
        name: Common.star_names[tmp_d]
      };
    },

    // 判定式funcに従って、回避判定（回避成功でtrue）
    judgeExpression: function(func) {
      // 左辺・不等号・右辺に分割
      let cond = func.split(/([<>])/);
      let l_damage = Util.computeDamage(cond[0]);
      let r_damage = Util.computeDamage(cond[2]);
      let canEscape;
      if (cond[1] === '<') {
        canEscape = l_damage < r_damage;
      } else {
        canEscape = l_damage > r_damage;
      }
      return canEscape;
    },

    // ダメージ式funcに従って、ダメージを算出
    computeDamage: function(func) {
      var damage = 0;
      var func_re = /([\+\-]?)(\d*)(RM|LM|R|L|M|STR|INT|DEX|KRM|FREE1|FREE2|FREE3)?]?/gi;
      var result;
      while ((result = func_re.exec(func)) != null) {
        var sign = 1; // 符号
        var num = 1;  // 係数
        var param = 1;  // パラメーター値
        if (result[0] === '') { break; }
        // 符号の決定
        if (result[1] === '-') {
          sign = -1;
        }
        // 係数の決定
        if (result[2]) {
          num = Number(result[2]);
        }
        // ステータス値の状態異常補正
        var tmp_status = {
          str: Number(save_data.chara.str),
          int: Number(save_data.chara.int),
          dex: Number(save_data.chara.dex),
          krm: Number(save_data.chara.krm)
        };
        switch (save_data.chara.state) {
          case 'frozen':
            tmp_status.str -= 2; 
            tmp_status.int -= 2; 
            tmp_status.dex -= 2; 
            tmp_status.krm -= 2; 
            break;
          case 'stone':
            tmp_status.str -= 1; 
            tmp_status.int -= 1; 
            tmp_status.dex -= 1; 
            tmp_status.krm -= 1; 
            break;
          case 'forget':
            if (tmp_status.str < tmp_status.int) {
              tmp_status.int = 0;
            } else {
              tmp_status.str = 0;
            }
            break;
        }
        // パラメーター値の決定
        switch (result[3]) {
          case 'L' :
          case 'R' :
          case 'LM' :
          case 'RM' :
          case 'M' :
            param = dice_obj.getRoll(result[3]);
            break;
          // case 'L':
          //   param = dice[0];
          //   break;
          // case 'R':
          //   param = dice[1];
          //   break;
          case 'STR':
          case 'INT':
          case 'DEX':
          case 'KRM':
            param = tmp_status[result[3].toLowerCase()];
            break;
          case 'FREE1':
          case 'FREE2':
          case 'FREE3':
            param = save_data.chara[result[3].toLowerCase()];
            break;
          default:
            param = 1;
            break;
        }
        // ダメージを加算
        damage += sign * num * param;
      }
      // ダメージ補正
      damage *= Number($('#damage_delta').val());
      return Math.floor(damage);
    },

    // ダメージ式／回避方法を選択
    selectFunc: function(func) {
      return Util.randomArray(func.split(',')).trim();
    },

    // ドロップアイテムを選択
    selectDrop: function(drop) {
      return Util.randomArray(drop.split(',')).trim();
    },

    // 指定されたキーでボーナスアイテムを取得
    getBonusItem: function(bonus) {
      if (!bonus) { return; }
      if(bonus.indexOf('bgi') === 0) {
        return Common.global_items.bad[bonus];
      } else {
        return Common.global_items.happy[bonus];
      }
    },

    // ページ上の構成画面を初期化
    initView() {
      ControlPanel.init();
      //Util.initDialog();
      Util.createCommonTweet();
      PlayerRank.init();
      SideBar.createAll();
      Bonus.showBonusMessage();
      //Bonus.initBonusStatus();
    },

    // シナリオデータを初期化
    initScenario: function() {
      Util.initSavedata();
      Util.initView();
      Bonus.initBonusStatus();

      // 最初のシーンを取得
      Util.createScene(0);
      //history.pushState(0, 'Scene 0');

      // 初期化トースト＋Basicダイアログ
      SideBar.openSideBar('basic');
      toastr.options.timeOut = 5000;
      toastr.info(
        'ステータスは画面右クリックで確認できます。',
        'キャラが作成されました。'
      );
    },

    // セーブデータを次のシナリオに複製
    // nexts：コピー先のシナリオ（配列）
    copyNextScenario: function(nexts) {
      var c_save = Util.deepCopyObject(save_data);
      /*
      c_save.chara.state = '';
      c_save.chara.stone_scene = 0;
      c_save.chara.forget_scene = 0;
      c_save.chara.free1 = 0;
      c_save.chara.free2 = 0;
      c_save.chara.free3 = 0;
      */
      c_save.items = c_save.items.filter(function(id) {
        return (items_map[id].shared !== undefined);
      });
      c_save.flags = [];
      c_save.params = {};
      c_save.scene = 0;
      c_save.ellapsed_scene = 0;
      c_save.bgm = '';
      c_save.isEnded = false;

      for (var i = 0; i < nexts.length; i++) {
        localStorage[nexts[i].trim()] = JSON.stringify(c_save);
      }
    },

    // エンディングの処理（resultはhappy／bad、nextは次のシナリオ、changeBgmはBGMを変更するか）
    endScenario: function(result, next, changeBgm) {
      if(!result) { return; }

      // エンディングフラグ
      save_data.isEnded = true;
      Util.saveStorage();
      //storage.removeItem(scenario_code);

      if(next) {
        Util.copyNextScenario(next.split(','));
      }

      // エンディングでライセンス情報を表示
      console.log('***********Licence Info.***********');
      var tmp_licence = { 'bgm': '音楽', 'picture': '画像' };
      $('licence > work', scenario_data).each(function() {
        var licence_url = $(this).nsAttr('url');
        console.log($(this).nsAttr('name') +
          '(' + tmp_licence[$(this).nsAttr('category')] + '): ' +
          $(this).nsAttr('creator') + ' ' +
          (licence_url !== undefined ? licence_url : '')
        );
      });
      console.log('***********Licence Info.***********');

      // end属性によってリンクを分岐
      if (result === 'bad') {
        $('<p><a href="#" id="end_reload" class="scenebtn">' +
          '最初から冒険に挑戦する</a></p>').appendTo(target);
      } else if (result === 'happy') {
        $('<p><a href="#" id="end_exit" class="scenebtn">' +
          'ペンタウァに帰還する</a></p>').appendTo(target);
      }

      // ボーナスアイテムの選択
      var bonus_item, o_bonus_item, audio_path;
      switch(result) {
        case 'happy' :
          bonus_item = Util.randomArray(Object.keys(Common.global_items.happy));
          o_bonus_item = Common.global_items.happy[bonus_item];
          //audio_path = ROOT + scenario_code + '/bgm_happy.mp3';
          audio_path = Util.buildBgmPath(bgms_map.happy);
          break;
        case 'bad' :
          // バッドアイテムは20％未満の確率で入手
          if(Util.random(0, 100) < 20) {
            bonus_item = Util.randomArray(Object.keys(Common.global_items.bad));
            o_bonus_item = Common.global_items.bad[bonus_item];            
          }
          audio_path = Util.buildBgmPath(bgms_map.bad);
          //audio_path = ROOT + scenario_code + '/bgm_bad.mp3';
          break;
      }

      // エンディングテーマ再生
      if (changeBgm) {
        SeAudio.playBgm(audio_path);
      }

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
    },

    // 共通ルールを取得＆反映
    showRuleText: function(rule) {
      if (rule === undefined) {
        rule = '99999';
      }
      Util.showImage(
        $('#common_rule')
          .html(
            Util.decorateText(
              $('scene#' + rule, scenario_data)
            )
          )
          .markdown()
      );
    },

    // target：加工対象の要素
    showImage: function(target) {
      let a_img = $('a:has(img)', target);
      a_img.each(function(index, elem) {
        let img_path = `${ROOT}${scenario_code}/${CAPTURE}${$(elem).attr('href')}`;
        $(elem).attr('href', img_path)
          .removeClass('scenebtn')
          .addClass('scenepic')
          .find('img')
          .attr('src', img_path);  
      });
      $('a.scenepic', target).zoombox();
    },

    // 指定されたステータス値を取得（hp、mp、str～krm、free1～3）
    getStatusValue: function(key) {
      return save_data.chara[key];
    },

    // 指定された内部パラメーター値を取得
    getParamValue: function(id) {
      let v = 0;
      // セーブデータから現在値を取得
      if (save_data.params) {
        v = save_data.params[id];
      }
      // セーブデータにない場合はinitial値
      if (!v) {
        v = params_map[id].initial;
      }
      return v;
    },

    // 本文中のSGML式 ${...} を解析
    interpolation: function(match, sub) {
      var tmp_sub = sub.split('?');
      var m_var = tmp_sub[0];
      if (tmp_sub[1]) {
        var m_params = tmp_sub[1].split(':');
      }
      switch (m_var) {
        case 'name' :
          return save_data.chara.name;
        case 'title' :
          return save_data.chara.title;
        case 'hp' :
          return save_data.chara.hp;
        case 'mp' :
          return save_data.chara.mp;
        case 'str' :
          return save_data.chara.str;
        case 'int' :
          return save_data.chara.int;
        case 'dex' :
          return save_data.chara.dex;
        case 'krm' :
          return save_data.chara.krm;
        case 'free1' :
          return save_data.chara.free1;
        case 'free2' :
          return save_data.chara.free2;
        case 'free3' :
          return save_data.chara.free3;
        // result、result_rateは暫定
        case 'result' :
          let info = PlayerRank.scena_infos[m_params[0]];
          if (info) {
            return info.results_count;
          } else {
            return '?????';
          }
        case 'result_rate' :
          let info_r = PlayerRank.scena_infos[m_params[0]];
          if (info_r) {
            return Math.floor(info_r.results_count / info_r.results_all * 100);
          } else {
            return '?????';
          }
        case 'race' :
          switch (save_data.chara.race) {
            case 'FIGHTER' :
              return m_params[0];
            case 'WIZARD' :
              return m_params[1];
            case 'DWARF' :
              return m_params[2];
            case 'ELF' :
              return m_params[3];
            default :
              return 'Unknown Race';
          }
        case 'sex' :
          switch (save_data.chara.sex) {
            case 'MALE' :
              return m_params[0];
            case 'FEMALE' :
              return m_params[1];
            default :
              return 'Unknown Sex';
          }
        case 'age' :
          switch (save_data.chara.age) {
            case 'YOUNG' :
              return m_params[0];
            case 'ADULT' :
              return m_params[1];
            case 'OLD' :
              return m_params[2];  
            default :
              return 'Unknown Age';
          }
        case 'state' :
          switch (save_data.chara.state) {
            case '' :
              return m_params[0];
            case 'poison' :
              return m_params[1];
            case 'frozen' :
              return m_params[2];
            case 'stone' :
              return m_params[3];  
            case 'curse' :
              return m_params[4];  
            case 'forget' :
              return m_params[5];  
            default :
              return 'Unknown State';
          }
        case 'rand' :
          return Util.random(Number(m_params[0]), Number(m_params[1]));
        case 'msg' :
          return Util.randomArray(m_params);
        case 'var' :
          if (m_params[0].startsWith('p')) {
            let p = params_map[m_params[0]];
            switch (m_params[1]) {             
              case 'text' :
                return p.desc;
              case 'value' :
                return Util.getParamValue(m_params[0]);
                // let v = 0;
                // // セーブデータから現在値を取得
                // if (save_data.params) {
                //   v = save_data.params[m_params[0]];
                // }
                // // セーブデータにない場合はinitial値
                // if (!v) {
                //   return p.initial;
                // }
                // return v;
            };
          } else if (m_params[0].startsWith('m')) {
            let m = enemies_map[m_params[0]];
            switch (m_params[1]) {
              case 'name' :
                return m.name;
              case 'element' :
                return Common.element_names[m.element];
              case 'text' :
                return m.desc;
            }
          } else if (m_params[0].startsWith('i')) {
            let i = items_map[m_params[0]];
            switch (m_params[1]) {
              case 'name' :
                return i.name;
              case 'text' :
                return i.desc;
            }
          } else if (m_params[0].startsWith('r')) {
            let r = results_map[m_params[0]];
            switch (m_params[1]) {
              case 'name' :
                return r.name;
              case 'level' :
                return r.level;
              case 'text' :
                return r.desc;
            }
          }
          return 'Unknow Variable';
        case 'input' :
          return '<input type="button" class="spinner_down sgml" value="-" />'
            + '<input type="text" class="sgml" value="' + m_params[0] + '" />'
            + '<input type="button" class="spinner_up sgml" value="+" />';
        default :
          return match;
      }
    },

    // 条件式（単一）を判定し、true／falseを返す
    conditionSingle: function(cond) {
      cond = cond.trim();
      return save_data.flags.indexOf(cond) !== -1 ||
        save_data.items.indexOf(cond) !== -1 ||
        Util.canUseMagicByName(cond) ||
        Util.ifParam(cond) ||
        Util.ifStatus(cond) ||
        Util.ifEllapsedScene(cond) ||
        Util.isCharaState(cond) ||
        Util.hasStars(cond) ||
        Util.hasResult(cond) ||
        Util.ifFunction(cond);
    },

    // 引数org_cond（条件式cond,cond,...）の判定
    // すべてのcondがtrueである
    conditionAllTrue: function(org_cond) {
      var result = true;
      var conds = org_cond.split(',');
      for (var i = 0; i < conds.length; i++) {
        if (!Util.conditionSingle(conds[i])) {
          result = false;
          break;
        }
      }
      return result;
    },

    // 引数org_condの判定（&、|を可能に）
    conditionFull: function(org_cond) {
      var eval_str = '';
      var ope = /([\&\|\!\(\)]{1,2})/;
      var conds = org_cond.split(ope);
      for (var i = 0; i < conds.length; i++) {
        var c = conds[i];
        if (!c) { continue; }
        if (ope.test(c)) {
          eval_str += c;
        } else {
          if (c.indexOf('-') !== 0) {
            eval_str += Util.conditionSingle(c);
          } else {
            eval_str += !Util.conditionSingle(c.substring(1));
          }
        }
      }
      return eval(eval_str);
    },

    // 条件式の種類に応じて、呼び出しのメソッドを切り替え
    // 将来的に、ここでconditionXxxxxメソッドを切り替えていく
    judgeMultiCondition: function(org_cond) {
      org_cond = org_cond.split('#NOT#').join('!');
      org_cond = org_cond.split('#AND#').join('&');
      org_cond = org_cond.split('#OR#').join('|');
      org_cond = org_cond.split('#L#').join('(');
      org_cond = org_cond.split('#R#').join(')');
      org_cond = org_cond.replace(/fn:[a-z0-9]+\(.*?\)/gi, function(match) {
        return match
          .replace('(', '[')
          .replace(')', ']');
      });
      console.log(org_cond);

      if (org_cond.includes('fn:') ||
            /([\&\|\!\(\)]{1})/.test(org_cond)) {
        return Util.conditionFull(org_cond);
      } else if (org_cond.indexOf('-') !== 0) {
        // 指定の条件をすべて満たしていれば真
        return Util.conditionAllTrue(org_cond);
      } else {
        // 指定の条件をすべて満たしていなければ真
        return !Util.conditionAllTrue(org_cond.substring(1));
      }
      return false;
    },

    // 条件式によるシーンボタンの表示／非表示
    showSceneButton: function() {
      $('a[title]', target).hide();
      var scene_button = $('a[title]', target);
      scene_button.each(function(index, elem) {
        try {
          if(Util.judgeMultiCondition($(elem).nsAttr('title'))) {
            $(elem).show();
          }
        } catch (e) {
          console.error('Parse Error: リンク条件式');
          console.error(elem);
          console.error(e);
        }
      });
    },

    // ${import}によるテキストインポート
    importText: function(match, id) {
      return $('scene#' + id, scenario_data)
        .text();
    },

    // ${if}による分岐制御
    ifCondition: function(match, cond, body) {
      if(Util.judgeMultiCondition(cond)) {
        return body;
      } else {
        return '';
      }
    },

    // ${effect}によるアニメーションの付与
    applyEffect: function(tmp_scene) {
      let effect_index = 0;
      let effect_count = 0;
      // .tell_effect1～Nまで順にエフェクトを再生
      function runEffect() {
        let clazz = `.tell_effect${++effect_index}`;
        $(clazz)
          .show()
          .textillate({
          in: {
            effect: $(clazz).attr('data-effect'),
            callback: function() {
              if (effect_index <= effect_count) {
                runEffect();
              }
            }
          }
        });
      }
      setTimeout(runEffect, 100);
      // エフェクト適用のためのHTMLを準備
      return tmp_scene.replace(/\${effect[\s]+(.+?)}([\s\S]+?)\${\/effect}/gi, function(match, args, body) {
        let clazz = `tell_effect${++effect_count}`;
        return `<div class="${clazz}" data-effect="${args}" style="display:none;">${body}</div>`;
      });
    },

    // Tweetボタンの生成
    parseTweet: function(match, body) {
      tweet_message = body;
      return body;
    },

    // ツイートボタンを生成
    // 引数type：標準（common）、シーン固有（custom）
    // 引数msg：ツイート本文
    // 引数cache：作成済みのツイートボタンを利用
    createTweet: function(type, msg, cache) {
      if (!msg) {
        msg = '原作30周年記念企画「SORCERIAN Text」ユーザー参加型のゲームブック版ソーサリアン';
      }
      if (type === 'custom') {
        var show = $('.socialbtn.twitter_custom');
        var hide = $('.socialbtn.twitter');
      } else {
        var show = $('.socialbtn.twitter');
        var hide = $('.socialbtn.twitter_custom');
      }
      if (!cache) {
        show.empty();
        show.append(
          $('<a href="https://twitter.com/share" class="twitter-share-button" data-count="horizontal" data-lang="ja" data-url="https://www.web-deli.com/sorcerian/text/" data-via="snext1220" data-related="snext1220" data-hashtags="falcom,stext">Tweet</a>').attr('data-text', msg) 
        ).append(
          '<script src="https://platform.twitter.com/widgets.js" charset="UTF-8"></script>'
        );
      }
      show.show();
      hide.hide();
    },

    // シナリオ共通ツイートを生成
    createCommonTweet: function() {
      Util.createTweet('common',
        $('init > intro', scenario_data).nsAttr('description')
      );
    },

    // シーン内のテキストを修飾
    // 引数tmp_scene：シーンオブジェクト
    decorateText: function(tmp_scene) {
      let ex = tmp_scene.nsAttr('exclude');
      let end = tmp_scene.nsAttr('end');
      tmp_scene = tmp_scene.text();
      // インポート処理
      tmp_scene = tmp_scene.replace(/\${import[\s]+(.+?)}/gi, this.importText);
      // 自動インポート（exclude属性、end属性ありで除外）
      if (!ex && !end) {
        tmp_scene += this.importText(null, 99998).trim();
      }
      // 新規構文のエスケープ処理
      tmp_scene = tmp_scene.replace(/(\[.+?\]\([\d,]{1,} ")(.+?)("\))/gi, function(match, sub1, sub2, sub3) {
        sub2 = sub2.split('!').join('#NOT#');
        sub2 = sub2.split('&').join('#AND#');
        sub2 = sub2.split('|').join('#OR#');
        sub2 = sub2.split('(').join('#L#');
        sub2 = sub2.split(')').join('#R#');
        return sub1 + sub2 + sub3;
      });
      // カラーリング＆URL処理
      tmp_scene = tmp_scene.replace(/%(blue|red|purple|white)%/gi, '&nbsp;<span style="color:$1">');
      tmp_scene = tmp_scene.replace(/%\/%/gi, '</span>&nbsp;');
      tmp_scene = tmp_scene.replace(/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/gi,
        '<a href="$&" data-link="auto" target="_blank">$&</a>');
      // ${if cond}...${/if}による条件分岐
      tmp_scene = tmp_scene.replace(/\${if[\s]+(.+?)}([\s\S]+?)\${\/if}/gi, this.ifCondition);
      // ${effect args}...${/effect}によるアニメーションの適用
      tmp_scene = Util.applyEffect(tmp_scene);
      // ${tweet}...${/tweet}によるTwitter反映
      tmp_scene = tmp_scene.replace(/\${tweet}([\s\S]+?)\${\/tweet}/gi, this.parseTweet);
      // ${...}の箇所を式の内容に応じて処理
      tmp_scene = tmp_scene.replace(/\${(.+?)}/gi, this.interpolation);
      // ${text|ruby}の箇所をruby要素で修飾（ルビ）
      tmp_scene = tmp_scene.replace(/\${(.+?)\|(.+?)}/gi,
        '<ruby>$1<rp>（</rp><rt>$2</rt><rp>）</rp></ruby>');
      return tmp_scene;
    },

    // 現在のシーン情報を取得＆画面の生成
    // 引数scene_num：シーン番号
    // 引数options：オプション（reverse：戻るか、conditions：条件式）
    createScene: function(scene_num, options) {
      if (options === undefined) { options = {}; }

      // BattleSheetの表示状態を初期化
      SideBar.isFirstOpenBattleSheet = true;
    
      // ツイートメッセージを初期化
      tweet_message = null;

      // サイドバーをすべて非表示
      SideBar.closeAll();

      // エンディングフラグが立っている場合は、初期化処理を実行
      if(save_data.isEnded) {
        location.reload(true);
        return;
      }
      // 条件式に応じて、処理を実施（魔法による星演算のみ）
      // 失敗時はトースト表示して、処理終了
      if(!Util.updateStarsByMagic(options.conditions)) {
        toastr.options.timeOut = 4000;
        toastr.warning('星が不足しているようだ。');
        return;
      }

      // スクロール位置をページ上部に移動
      $(window).scrollTop(0);

      var scene = $('scene[id="' + scene_num + '"]', scenario_data);

      // ［戻る］でない場合にだけシーンの自動化処理
      if (!options.reverse) {
        // 現在のシーンのフラグ情報／アイテム／Free欄／実績情報を反映
        Util.updateItems(scene.nsAttr('items'));
        Util.updateFlags(scene.nsAttr('flags'));
        Util.updateParams(scene.nsAttr('params'));
        Util.updateStars(scene.nsAttr('stars'));
        Util.updateHp2KrmMax({
          hp_m: scene.nsAttr('hp_max'),
          mp_m: scene.nsAttr('mp_max'),
          str_i:scene.nsAttr('str_max'),
          int_i:scene.nsAttr('int_max'),
          dex_i:scene.nsAttr('dex_max'),
          krm_i:scene.nsAttr('krm_max')
        });
        Util.updateHpMp(scene.nsAttr('hp'), scene.nsAttr('mp'));
        Util.updateStr2Krm(scene.nsAttr('str'), scene.nsAttr('int'), scene.nsAttr('dex'), scene.nsAttr('krm'));
        Util.updateFrees(scene.nsAttr('free1'), scene.nsAttr('free2'), scene.nsAttr('free3'));
        Util.updateState(scene.nsAttr('state'));
        Util.updateStates();
        Util.updateResults(scene.nsAttr('result'));
        Bonus.updateStatusByBonus();

        // 現在のシーン番号を保存
        save_data.scene = scene_num;
        save_data.ellapsed_scene++;
        // ストレージに反映＆履歴を追加
        Util.saveStorage();
        history.pushState(save_data, 'Scene ' + scene_num);
      } else if (options.restore) {
        // 復帰時は履歴の記録だけを実施
        history.pushState(save_data, 'Scene ' + scene_num);
      }

      // シーンテキストの整形
      target.html(Util.decorateText(scene));
      target.markdown();

      // ツイートボタンの生成
      if (tweet_message) {
        Util.createTweet('custom', tweet_message);
      } else {
        Util.createTweet('common', null, true);
      }

      // ヘッダーテキスト
      let basic = $('init > basic', scenario_data);
      let at_summary;
      if (basic) {
        at_summary = basic.nsAttr('summary');
      }
      if (at_summary) {
        $(`<h5 id="scenario_title">${$('scenario', scenario_data).nsAttr('title')}</h5>
           <h3 class="scene_summary">${scene.nsAttr('summary')}</h3>`).prependTo(target);
      } else {
        $(`<h5 id="scenario_title">
            ${$('scenario', scenario_data).nsAttr('title')}
            【${scene_num}】
          </h5>`).prependTo(target);
      }

      // サイドパネル表示ボタンのカラー生成
      // var side_p = $('<div id="side_show">Battle Sheet</div>');
      if (scene.nsAttr('enemies')) {
        $('#menu_battle').css('background-color', 'Red');
      } else {
        $('#menu_battle').css('background-color', 'Black');
      }

      SideBar.showSimpleStatus();

      // デバッグモードが有効の場合、デバッグウィンドウを表示
      if(debug_mode) {
        $(`<div id="debug_panel">
          <form>
            <label>Scene：<input id="debug_id" type="text" size="5" /></label>　
            <label>Params：<input id="debug_params" type="text" size="25" /></label><br />
            <label>Items：<input id="debug_items" type="text" size="15" /></label>　
            <label>Flags：<input id="debug_flags" type="text" size="20" /></label>　
            <input id="debug_reload" type="button" value="Reload" />
          </form>
        </div>`)
        .prependTo(target);

        // 現在の状態をデバッグウィンドウに反映
        $('#debug_panel #debug_id').val(scene_num);
        let t_params = [];
        if (save_data.params) {
          for (key in save_data.params) {
            t_params.push(`${key}:${save_data.params[key]}`);
          }
          $('#debug_panel #debug_params').val(t_params.join(','));  
        }
        $('#debug_panel #debug_items').val(save_data.items.join(','));
        $('#debug_panel #debug_flags').val(save_data.flags.join(','));
        // セーブデータを上書きの上、シーン移動
        $('#debug_panel #debug_reload').click(function(e) {
          var debug_params = $('#debug_panel #debug_params').val().trim();
          var debug_items = $('#debug_panel #debug_items').val().trim();
          var debug_flags = $('#debug_panel #debug_flags').val().trim();

          // パラメーター情報を反映
          let new_params = {};
          if(debug_params !== '') {
            for (let t_param of debug_params.split(',')) {
              let [t_key, t_value] = t_param.split(':');
              new_params[t_key] = t_value;
            }
          }
          save_data.params = new_params;

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
        .wrapAll('<div class="xbtn"></div>');

      // 文字列入力用ボタンの整形
      var tmp_strinput = $('a[href="Q"]', target);
      tmp_strinput
        .removeClass('scenebtn')
        .addClass('quest_str')
        .attr('data-yesno', tmp_strinput.text())
        .text('回答する')
        .before('<input type="text" id="stranswer" class="quest_str" />')
        .add('#stranswer')
        .wrapAll('<div class="xbtn"></div>');

      // 挿絵の整形
      Util.showImage(target);
      // var a_img = $('a:has(img)', target);
      // a_img.each(function(index, elem) {
      //   var img_path = ROOT + scenario_code + '/' + CAPTURE + $(elem).attr('href');
      //   $(elem).attr('href', img_path)
      //     .removeClass('scenebtn')
      //     .addClass('scenepic')
      //     .find('img')
      //     .attr('src', img_path);  
      // });
      // $('a.scenepic').zoombox();

      // 条件付きボタンの表示／非表示
      Util.showSceneButton();

      // 現時点で非表示になっているボタンと、その直後の改行を削除
      $('.scenebtn:hidden + br', target).remove();
      $('a[title]:hidden', target).remove();

      // リンクURLに含まれる<em>タグをアンダースコアに書き戻し
      $('a[data-link="auto"]', target).attr('href', function(index, old) {
        return old.split('<em>').join('_');
      });

      /* BGM再生 */
      // save_data.bgm→bgm属性の順で再生曲を設定
      var at_bgm = scene.nsAttr('bgm');
      var new_bgm = save_data.bgm;
      if (at_bgm !== undefined) {
        new_bgm = at_bgm;
      }
      // 再生すべき曲が現在の曲と異なれば、曲を切り替え
      if (new_bgm !== bgm_name) {
        SeAudio.playBgm(Util.buildBgmPath(new_bgm));
        bgm_name = new_bgm;
        // セーブデータ、履歴も反映
        save_data.bgm = new_bgm;
        Util.saveStorage();
        history.replaceState(save_data, 'Scene ' + scene_num);
      }
      /* BGM再生ココマデ */

      // シーン表示時に効果音を再生
      if(scene.nsAttr('se')) {
        SeAudio.play(scene.nsAttr('se'));
      }
    
      // エンディング処理（bgm属性が指定されている場合、エンディング曲に変更しない）
      Util.endScenario(scene.nsAttr('end'), scene.nsAttr('nexts'), (scene.nsAttr('bgm') === undefined));
    }
  };

  class RpgDice {
    // target：ダイスの反映先
    // type：ダイス型（数値：1～20、文字列：dicesetのキー）
    // num：ダイスの個数（2～5）
    constructor(target, type = 6 , num = 2) {
      // カスタムのダイス定義
      this.diceset = {
        'high' : [4, 5, 6],
        'cheat_l': [1, 1, 1, 2, 3, 4, 5, 6],
        'cheat_h': [1, 2, 3, 4, 5, 6, 6, 6],
      };
      // ダイスの型
      this.type = type;
      // ダイスを反映させる先（セレクター式）
      this.target = target;
      // ダイスの個数
      this.num = num;
      // ダイスの現在値（初期値はすべて1）
      this.current = new Array(this.num);
      this.current.fill(1);
      // ダイスの回転数（内部用途）
      this.rotateCount = 1;
      // イベントリスナーの登録
      let that = this;
      $(this.target)
        .off()
        .on('click', function() {
          that.rotate(that);
        });
    }

    // ダイスのベース名を取得（private）
    getImageName() {
      // ダイスの上限値
      let dice_max = 0;
      if ($.isNumeric(this.type)) {
        dice_max = Number(this.type);
      } else {
        dice_max = Math.max(...this.diceset[this.type]);
      }
      if (dice_max > 6) {
        return 'cube_num';
      } else {
        return 'cube';
      }
    }

    // ダイスのためのHTMLを生成（private）
    getHtml() {
      let html = '';
      for (let i = 0; i < this.num; i++) {
        // ダイスの値を保管
        if ($.isNumeric(this.type)) {
          this.current[i] = Util.random(1, Number(this.type));
        } else {
          this.current[i] = Util.randomArray(this.diceset[this.type]);
        }
        html += `<img src="${ROOT}${COMMON}cube/${this.getImageName()}${this.current[i]}.png" class="dice" />`;
      }
      return html;
    }

    // 1回分のローテート（private）
    rotateOne(that) {
      that.rotateCount++;
      $(that.target).html(that.getHtml());
      if(that.rotateCount > 20) { return; }
      setTimeout(that.rotateOne, 50, that);
    }

    // ダイスを振る
    rotate(that) {
      SeAudio.play('dice', true);
      that.rotateCount = 1;
      that.rotateOne(that);
    }

    // ダイスの現在状態を反映
    show() {
      $(this.target).html(this.getHtml());
    }

    // 出目を取得
    getRoll(key) {
      switch(Number(this.num)) {
        case 2:
          if (key === 'L') { return this.current[0]; }
          if (key === 'R') { return this.current[1]; }
          break;
        case 3:
          if (key === 'L') { return this.current[0]; }
          if (key === 'M') { return this.current[1]; }
          if (key === 'R') { return this.current[2]; }
          break;
        case 4:
          if (key === 'L')  { return this.current[0]; }
          if (key === 'LM') { return this.current[1]; }
          if (key === 'RM') { return this.current[2]; }
          if (key === 'R')  { return this.current[3]; }
          break;
        case 5:
          if (key === 'L')  { return this.current[0]; }
          if (key === 'LM') { return this.current[1]; }
          if (key === 'M')  { return this.current[2]; }
          if (key === 'RM') { return this.current[3]; }
          if (key === 'R')  { return this.current[4]; }
          break;
      }
      return 0;
    }
  }
  // テストコード
  // let d = new RpgDice('#test_result', 6, 2);
  // d.rotate();
  // $(document).on('click', '#test_result', function(e) {
  //   console.log('TEST');
  //   d.rotate();
  // });

  // プラグイン本体
  // 引数code：シナリオコード、またはシナリオ文字列
  // 引数debug：デバッグウィンドウを表示するか（既定はfalse）
  // 引数isPost：ポスト先のフォルダーを見に行くか（既定はfalse）
  $.fn.extend({
    startGame: function(code, debug, isPost) {
      scenario_code = code;
      dialog_elem['main'] = target = this;
      if(!debug) { debug = false; }
      debug_mode = debug;
      if(!isPost) { isPost = false; }

      // 背景画像を設定
      target.addClass('main_back');

      // イベントリスナーの初期化
      target.off();
      target.parent().off();
      $(document).off('click', '#dialog_list img.bonus_item');
      $(window).off('popstate');

      /** EventListener **/
      // 移動ボタンをクリックで次のシーンに移動
      target.on('click', 'a.scenebtn', function(e) {
        e.preventDefault();
        // バッドエンド時のボタンであれば処理を終了
        if (e.target.id === 'end_reload') {
          return;
        // ハッピーエンド時のボタンであればトップへ
        } else if (e.target.id === 'end_exit') {
          location.href = 'https://www.web-deli.com/sorcerian/text/';
          return;
        }

        var num = $(this).nsAttr('href');
        var cond = $(this).nsAttr('title');
        // 複数移動先が指定されている場合、ランダムに選択
        num = Util.getRandomLinkNumber(num);

        // リンク先90000で履歴バック（戻り値falseならばブラウザーバック）
        // if (Number(num) === 90000) {
        //   history.back();
        //   return false;
        // }
        num = Util.getBackLinkNumber(num);
        if (num === false) {
          history.back();
          return false;
        }

        // 履歴に追加
        //history.pushState(num, 'Scene ' + num);
        Util.createScene(num, { conditions: cond });

        // BGMが再生中でなければ強制的に再生
        if (bgm && bgm.paused && global_save_data.bgm) {
          bgm.play();
        }
      });

      // 終了時のリロード（Playgroundのみ確認ダイアログ）
      target.on('click', '#end_reload', function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (scenario_code === 'playground') {
          if (!confirm('ページをリロードしても宜しいですか？\nリロード時には、エディター上の編集内容も削除されます。シナリオ編集中の場合は、内容を保存してください。')) {
            return;
          }
        }
        location.reload(true);
      });

      // 指定シーンに移動
      target.on('click', 'a.scene_move', function(e) {
        var num = $('#toscene').val();
        var allow_num = $(this).nsAttr('data-allow');
        if(Util.canSceneMove(num, allow_num)) {
          //history.pushState(num, 'Scene ' + num);
          Util.createScene(num);
        } else {
          toastr.options.timeOut = 4000;
          toastr.warning('指定された番号には移動できないようだ');
        }
        e.preventDefault();
      });

      // 回答の成否を判定（文字列入力ボックス）
      target.on('click', 'a.quest_str', function(e) {
        var answer = $('#stranswer').val();
        var yn = $(this).nsAttr('data-yesno').split(',');
        if(answer === yn[0]) {
          var to_move = yn[1];
        } else {
          var to_move = yn[2];
        }
        //history.pushState(to_move, 'Scene ' + to_move);
        Util.createScene(to_move);
        e.preventDefault();
      });

      // 右クリック時にステータスダイアログを表示
      target.on('contextmenu', function(e) {
        $.sidr('open', 'sidr_status');
        e.preventDefault();
        //Util.createDialog();
      });

      // 履歴情報の復帰
      $(window).on('popstate', function(e) {
        // エンディングでは［戻る］は不可
        if (save_data.isEnded) {
          return;
        }
        // 履歴から過去のセーブデータを復元
        if (e.originalEvent.state != null) {
          save_data = e.originalEvent.state;
          Util.saveStorage();
          Util.createScene(e.originalEvent.state.scene, { reverse: true });
        }        
      });

      // 再開画面（［はじめから］ボタン）
      target.on('click', '#restart #tmp_init', function(e) {
        Util.initScenario();
      });

      // 再開画面（［続きから］ボタン）
      target.on('click', '#restart #tmp_continue', function(e) {
        Util.initJobs();
        Util.initView();
 
        // 再開時に経過日数の加算分を減算（廃止）
        // save_data.ellapsed_scene--;
        var num = save_data.scene;
        Util.createScene(num, { reverse: true, restore: true });
      }); 
      /** EventListener **/

      // グローバルセーブデータが存在しない場合は初期化
      if(storage[GLOBAL_SAVE_DATA_KEY]) {
        Util.loadStorageGlobal();
      } else {
        Util.initGlobalSaveData();
      }

      // 初期化処理
      var done_read = function(result) {
        // シナリオデータを取得
        scenario_data = result;

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
          flags_map[$(this).nsAttr('id')] = $(this).text().trim();
        });

        // パラメーター一覧を取得
        $('params > param', scenario_data).each(function() {
          params_map[$(this).nsAttr('id')] = {
            min: $(this).nsAttr('min'),
            max: $(this).nsAttr('max'),
            initial: $(this).nsAttr('initial'),
            desc: $(this).text().trim()
          };
        });
        // 予約パラメーター
        // params_map['p99'] = {
        //   initial: 0,
        //   desc: '戻り先の保存先'
        // };
      
        // モンスター覧を取得
        enemies_map = {};
        $('enemies > enemy', scenario_data).each(function() {
          enemies_map[$(this).nsAttr('id')] = {
            name: $(this).nsAttr('name'),
            element: $(this).nsAttr('element'),
            hp: $(this).nsAttr('hp'),
            attack: $(this).nsAttr('attack'),
            func: $(this).nsAttr('func'),
            func_opp: $(this).nsAttr('func_opp'),
            drop: $(this).nsAttr('drop'),
            desc: $(this).text().trim()
          }
        });

        // アイテム一覧を取得
        items_map = {};
        $('items > item', scenario_data).each(function() {
          items_map[$(this).nsAttr('id')] = {
            name: $(this).nsAttr('name'),
            shared: $(this).nsAttr('shared'),
            target: $(this).nsAttr('target'),
            effect: $(this).nsAttr('effect'),
            desc: $(this).text().trim()
          };
        });

        // 実績一覧を取得
        results_map = {};
        $('results > result', scenario_data).each(function() {
          results_map[$(this).nsAttr('id')] = {
            name: $(this).attr('name'),
            level: $(this).nsAttr('level'),
            desc: $(this).text().trim()
          };
        });

        // BGM情報を取得
        var init_bgms = $('init > bgm', scenario_data);
        var i_main = init_bgms.nsAttr('main');
        var i_happy = init_bgms.nsAttr('happy');
        var i_bad = init_bgms.nsAttr('bad');
        bgms_map = {
          main: i_main === undefined ? 'main' : i_main,
          happy: i_happy === undefined ? 'happy' : i_happy,
          bad: i_bad === undefined ? 'bad' : i_bad
        };

        // デバッグモードではシナリオのデータ検証
        if (debug_mode === true) {
          var errors = Util.validateScenario();
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
        if (storage[scenario_code]) {
          Util.loadStorage();
          // エンディングに到達済みの場合は強制初期化
          if (!save_data.isEnded) {
            var msg = '<div id="restart">' +
              '<h3>Welcome to SORCERIAN Text!!</h3>' +
              '<p>以前のデータが残っています。<br />' +
              '続きから開始しますか？</p>' +
              '<button id="tmp_continue">続きから</button> ' +
              '<button id="tmp_init">最初から</button>' +
              '</div>';
            target.html(msg);
            return;
          }
        }
        // ストレージに情報がない場合には最初からゲームを開始
        // ゲーム情報を初期化
        Util.initScenario();
      };
      
      // シナリオコード
      scenario_code = scenario_code.trim();
      // 文字列が渡された場合には、シナリオデータとして処理
      if (scenario_code.indexOf('<') === 0) {
        //var tmp_data = $(scenario_code);
        var parser = new DOMParser();
        var tmp_data = parser.parseFromString(scenario_code, 'text/xml');
        scenario_code = 'playground';
        global_save_data['results']['playground'] = [];
        Util.saveStorageGlobal();
        done_read(tmp_data);
      // シナリオコードが渡された場合にはscenario.xmlを読み込み
      } else {
        if (isPost) {
          var scena_path = `playground/post/${scenario_code}/scenario.xml`;
        } else {
          var scena_path = ROOT + scenario_code + '/scenario.xml';
        }
        $.get(scena_path)
        // $.get(ROOT + scenario_code + '/scenario.xml')
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
        var inits = $('<init>\n</init>');
        var items = $('<items>\n</items>');
        var flags = $('<flags>\n</flags>');
        var enemies = $('<enemies>\n</enemies>');
        var results = $('<results>\n</results>');
        var license = $('<licence>\n</licence>');
        
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
                // 種族／年齢／種族の制約
                if (tmp_para.indexOf('pc') === 0) {
                  var pc = tmp_para.split(':')
                  var cons = $('<constraint></constraint>');
                  if (pc[1]) { cons.attr('race', pc[1]); }
                  if (pc[2]) { cons.attr('sex',  pc[2]); }
                  if (pc[3]) { cons.attr('age',  pc[3]); }
                  cons.appendTo(inits);
                // BGMの設定
                } else if (tmp_para.indexOf('bgm') === 0) {
                  var bgm = tmp_para.split(':')
                  var initBgm = $('<bgm></bgm>');
                  if (bgm[1]) { initBgm.attr('main', bgm[1]); }
                  if (bgm[2]) { initBgm.attr('happy',bgm[2]); }
                  if (bgm[3]) { initBgm.attr('bad',  bgm[3]); }
                  initBgm.appendTo(inits);
                } else if (tmp_para.indexOf('label') === 0) {
                  var label = tmp_para.split(':')
                  var initLabel = $('<label></label>');
                  if (label[1]) { initLabel.attr('free1', label[1]); }
                  if (label[2]) { initLabel.attr('free2', label[2]); }
                  if (label[3]) { initLabel.attr('free3', label[3]); }
                  initLabel.appendTo(inits);
                // ツイート文の設定
                } else if (tmp_para.indexOf('intro') === 0) {
                  var intro = tmp_para.split(':')
                  var initIntro = $('<intro></intro>');
                  if (intro[1]) { initIntro.attr('description', intro[1]); }
                  initIntro.appendTo(inits);
                // アイテム処理
                } else if (tmp_para.indexOf('i') === 0) {
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
                    .attr('drop', enemy[5])
                    .text(enemy[6])
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
                    .attr('url', (work[4] ? '//' + work[4] : ''))
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

                // 「999」は自由移動ボックス、「998」は文字列入力欄、それ以外はリンクボタン
                if (dest === '999') {
                  var tmp = '[';
                  tmp += caption[0];
                  tmp += '](X)\n';
                } else if (dest === '998') {
                  var tmp = '[';
                  tmp += caption[0];
                  tmp += '](Q)\n';
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
            if (attrs.stars !== undefined) { scene.attr('stars', attrs.stars); }
            if (attrs.hp !== undefined) { scene.attr('hp', attrs.hp); }
            if (attrs.mp !== undefined) { scene.attr('mp', attrs.mp); }
            if (attrs.free1 !== undefined) { scene.attr('free1', attrs.free1); }
            if (attrs.free2 !== undefined) { scene.attr('free2', attrs.free2); }
            if (attrs.free3 !== undefined) { scene.attr('free3', attrs.free3); }
            if (attrs.bgm !== undefined) { scene.attr('bgm', attrs.bgm); }
            if (attrs.se !== undefined) { scene.attr('se', attrs.se); }
            //if (attrs.allowMove !== undefined) { scene.attr('allowMove', attrs.allowMove); }
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
          inits.prependTo(result);

          // 未処理のファイルがなくなったら出力処理
          file_num++;
          if (file_num >= inputs.length) {
            // コールバックが指定されていたら、それで処理
            if (callback) {
              callback(result);
            // さもなければ、ダウンロード処理
            } else {
              var content = vkbeautify.xml(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                result.get(0).outerHTML
              );
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
    },

    // ストレージ上のセーブデータを「xxxxx-99999.stext」として出力
    // （xxxxxxはシナリオコード、99999はタイムスタンプ）
    // this：ボタン
    // 引数selector：シナリオコードを表すフォーム要素（セレクター式）
    backupData: function(selector) {
      $(this).click(function() {
        var content = '';
        var storage = localStorage;
        var scenario = $(selector).val();
        if (scenario === 'all') {
          // シナリオデータからidあり、unpublishedなしのwork要素を取得
          $.get(ROOT + 'stext.xml')
            .done(function(data) {
              var ids = [ GLOBAL_SAVE_DATA_KEY ];
              $('work[id]:not([unpublished])', data).each(function(i, elm){
                ids.push($(elm).attr('id'));
              });
              for (var i = 0; i < ids.length; i++) {
                var tmp_data = storage[ids[i]];
                if (tmp_data) {
                  content += ids[i] + '\n';
                  content += tmp_data + '\n';
                }
              }
              Util.downloadSavedata(scenario, content);
            });
        } else {
          content = storage[scenario];
          if (!content) {
            window.alert('データが存在しません！');
            return;
          }
          Util.downloadSavedata(scenario, content);
        }
      });
    },

    // バックアップしたセーブデータをストレージに書き戻す
    // this：ファイル選択ボックス
    restoreData: function() {
      $(this).change(function() {
        Util.restoreSaveData(this, function() {
          window.alert('リストアが完了しました。\r（起動している場合は）ゲーム画面をリロードしてください。');
        });
      });
    },

    // 空白除去版のattrメソッド
    nsAttr: function(name) {
      var v = $(this).attr(name);
      if (v === undefined) { return; }
      return v.replace(/\s+/g, '');
    }
  });
})(jQuery);
