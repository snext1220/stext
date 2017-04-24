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

  // ターゲット要素（ゲームブックの表示先）
  var target;

  // ダイアログ本体
  var dialog;

  // 基本データ
  var Common = {
    // 男性の名前
    male_name  : [ 'ボブ', 'デュエル', 'ゴルカス', 'ジェノバン', 'グーラン', 'ジャンビエ', 'グログス', 'コル', 'フロニアス', 'グーリム', 'カザミィ', 'ソロン', 'ゼン', 'ヴォル', 'マルス', 'レイザー', 'ミリオン', 'エリック', 'ジロ', 'ソード', 'ディル', 'ガタビア', 'ラウア', 'ハルビン', 'グドン', 'ジャミル', 'ディカン', 'ダート', 'タットワ5世', 'ディカン', 'ホド', 'ゲプラー', 'コクマー', 'グレアム', 'ロウポー', 'ラッツ', 'ソルト', 'ランブル', 'ネイル', 'ルシアン', 'ギム', 'チェイサー', 'ルワン', 'ゾーク', 'オルム', 'テュモー', 'バロン', 'カメロン', 'トード', 'グンダ', 'フラジオレ', 'ファン＝フレディ', 'ファネッサ3世', 'クリフト4世', 'クォール', 'ディオン', 'ホゼア', 'ロラッド', 'バルナ', 'ティゲロ', 'テト', 'ニフト', 'オーサー', 'ゲディス', 'レオン', 'アンドリュー', 'キリー', 'トーマス', 'エディ', 'ノーマス', 'ギルデン', 'ノーネーム', 'ユイター', 'デュオン', 'ペトス', 'フェリス', 'スラン', 'アルフレッド', 'ソクラム', 'アルモス', 'ログレック', 'ラルーゴ', 'キッド', 'ドレイク', 'ウォルトス', 'レスター', 'テリー', 'グラハン', 'ラドール', 'ウェステル', 'フェスタ', 'バンブー', 'ゲルフス', 'ドン・コサック', 'ベオグラード', 'ピエール', 'タルフ', 'エヴァン', 'ドゥール', 'バルガス', 'アーサー', 'ガッシュ', 'エルウッド', 'ヘルナー', 'エリック', 'ジャグラー', 'アラン', 'ロニアス', 'アスタル', 'ボルックス', 'ラドナー', 'ギルバレス', 'ジャレス', 'ルー', 'スズキ', 'ジロサ', 'サントリーニ', 'ルルイエ', 'コーラル', 'ボマード', 'ナルシス', 'マーヴァル', 'クール', 'ヨシュア', 'エヴァム', 'ジャンク', 'ボイド', 'ヘクター', 'デンキブラウン', 'バイアス', 'ブロイム', 'ディンギル', 'リグ', 'バド', 'ジード', 'ラルザス', 'ガイキナ', 'ロッド', 'ケイン', 'ルーミス', 'タジート', 'ブレイス', 'ディンクス', 'マーク', 'ホホホ', 'テシター', 'J.B', 'ジン', 'マック', 'リラ', 'ジバ', 'バーラン', 'ポジティル', 'ネガティル', 'ファルカス', 'ファウネス', 'ファルカス', 'チェン', 'パズス12世', 'タムタム', 'リーク・ディオン', 'タウラー', 'ラルディ', 'ノーマス', 'アドロン', 'ロカルノ', 'ゲラン', 'シュヴェーリン', 'ローラン', 'ウェッジ', 'アントロノフ', 'キム', 'ヤン', 'デフ', 'ミケロ', 'クール', 'ティエンルン', 'コウ', 'マルク', 'オーエン', 'トート', 'グート', 'マウアー', 'ザンダー', 'バルダ', 'キーリエ', 'マルス', 'セム', 'ターバ', 'グロス', 'クルトン', 'ザムル', 'エルフィン', 'グラハン', 'ガウェイン', 'アドル', 'ゴーバン', 'ドギ', 'ルタ', 'ダレス', 'ダルク＝ファクト', 'クーブラ＝カーン', 'ガルシウス', 'クロノス', 'カイロス', 'ディアルド', 'チッタ', 'カズン', 'ルイス', 'セネリー', 'ライネル', 'エス', 'カリー', 'ドレイク', 'ダニー', 'ドリー', 'ケイリス', 'ノートン', 'クラウド', 'ウォーリー', 'レイモンド', 'サザール', 'メテオロイド', 'ナッシュ', 'ルロイ', 'ライトル', 'カディアン', 'ブラウン', 'シュナイダー', 'セシル', 'グレンザー', 'ゴイル', 'ビル', 'グリメルム', 'ガルベス', 'ジルドバ', 'アレクシウスX世', 'ピエール', 'ジェラルド', 'ロベルト', 'エティス' ],
    // 女性の名前
    female_name: [ 'エスター', 'クリスティ', 'アイリーン', 'フェルディナン', 'リタ', 'トーヤ', 'ノルン', 'ウィンディーネ', 'プリム', 'ピアナ', 'エメラーダ', 'エレア', 'エヴァ', 'リム', 'ビナー', 'ティファレト', 'ミラドゥ', 'パナシェ', 'ミモザ', 'リューズ', 'エレーナ', 'リーア', 'キアラ', 'オルアラ', 'クオレ', 'セーナ', 'リーザ', 'セリナ', 'リリィ', 'ピピ', 'ビヌス', 'アンナ', 'リュシエル', 'フィレン', 'カレン', 'エリン', 'ローラ', 'マーベラ', 'ジョセフィーヌ', 'アネリーナ', 'リオナ', 'ジョアンナ', 'レニッサ', 'ジェニス', 'グリンダ', 'マティナ', 'ローナ', 'コッキー', 'チェルシー', 'ネリス', 'アリーナ', 'フェリッサ', 'マリエル', 'ベララ', 'ジョゼフ', 'ニッカ', 'テキーラ', 'ソルティ', 'パイン', 'ウィズ', 'カンニバル', 'ミント', 'リーン', 'ミル', 'ディアンナ', 'レティア', 'サフィス', 'エミス', 'ヴァムリー', 'サリア', 'ナイジェス', 'ミューリア', 'エミリア', 'シャル', 'バーバラ', 'オビア', 'スチュアート', 'ベーラ', 'サマリーヌ', 'フィアネ', 'レナ', 'ソル', 'ネイラ', 'セレーネ', 'アルバ', 'ラン', 'ルー・パズス', 'シルフィ', 'ミレット', 'レフィーナ', 'モスマ', 'チブル', '鈴鈴', '明明', 'ティキ', 'サリア', 'ミュール', 'ダール', 'ミンナ', 'レーシャ', 'エレイア', 'レア', 'フィーナ', 'ジャネット', 'ナリス', 'ソチ', 'ポーラス', 'ロキア', 'フリージ', 'エスメレー' ],
    // 称号
    title: ['武器屋の親父', 'ペンタウァの長老', 'トラベラーズインの宿主', '人と上手に話したい', 'ペンタウァ近衛隊長', '', 'タリスマンの見張り', '瞑想中', '砂漠の飯炊き', '狂戦士', 'エレベーターの管理人', '盗賊の頭領', '暗き沼の魔法使い', 'ロマンシア国王', 'アゾルバ国王', 'ペンタウァ国王', '蚕職人', '妖精王', '暗黒の魔導士', 'クイーンマリー号船長', 'キタブ・アル・アジフの持ち主', 'メデューサハンターの弟子', 'ファルコムマン', '戦士の亡霊', '海賊の子孫', 'いけにえの神官', '東の村の村長', '麻薬中毒者', 'ヴァネルバの王', '銀の竪琴屋', '近衛隊長', '復讐の呪術師', 'ラフォーヌの森の管理人', 'リドニア王国の元兵士', '姫の教育係', '大魔王', '紫ウニの王子', 'ベララの家族', '時計塔の番人', '時計塔の魔女', 'ナルキッソス号船長', 'ディンギル王国の3神官', 'バドティビラ工場の指揮官', 'シュメール国王', 'サンサーラの山賊', '南村の村長', 'アイテム屋WIZの店主', '旅の吟遊詩人', '古代イスマリアの王', '時の神殿の書記官', '闇の王', 'ランドル村長', '魔法学校の校長', '魔法学校の用務員', 'マリオネットの王', 'ペンタウァの近衛兵', '陽の中の闇人', '赤毛の冒険者', '光の王', 'イリアスンの執政官', '魔の下僕', 'メデューサハンター', '邪神教徒', '邪神教々祖', '砂漠の王', '鍵の番人', 'ローデシア辺境司令官' ],

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
      'STONE FLESH': [ 0, 0, 0, 1, 1, 1, 1, '石化を回復' ],
      'UN-CURCE':    [ 2, 0, 1, 0, 0, 1, 0, '呪いを回復' ],
      'AIR-HAND':    [ 1, 0, 1, 0, 1, 0, 1, '見えない拳の衝撃で、忘却を回復' ],
      'RESURRECT':   [ 0, 0, 0, 1, 3, 0, 1, 'HP/MP半分で復活（但し、冒険に一度だけ）' ],
      'REDUCE LIFE': [ 0, 1, 1, 0, 1, 1, 0, '体力を犠牲に（HP-25）、すべての状態異常を回復' ],
      'REJUVENATE':  [ 0, 2, 0, 1, 0, 0, 1, '時の流れを巻き戻し（現在の判定をやり直し）' ],
      'PROTECT':     [ 1, 0, 0, 1, 1, 0, 1, 'HPダメージを半減' ],
      'HOLY WATER':  [ 0, 0, 2, 2, 0, 0, 0, 'MPダメージを半減' ],
      'CHANGE AIR':  [ 1, 0, 0, 1, 1, 1, 0, '戦闘を回避（アイテムは得られない）' ],
      'GIVE VIGOR':  [ 1, 1, 1, 0, 0, 1, 0, '敵の攻撃力が2倍＆取得アイテム2倍' ],
      'EXPLOSION':   [ 0, 1, 0, 1, 0, 1, 2, '地属性の敵を全滅' ],
      'DELUGE':      [ 4, 0, 0, 0, 0, 1, 0, '火属性の敵を全滅' ],
      'FREEZE':      [ 0, 2, 0, 0, 0, 1, 2, '水属性の敵を全滅' ],
      'DESTROY.A':   [ 1, 0, 4, 0, 0, 0, 0, '風属性の敵を全滅' ],
      'LIGHT CROSS': [ 0, 2, 0, 2, 0, 1, 0, '霊属性の敵を全滅' ],
      'NOILA-TEM':   [ 1, 1, 1, 1, 1, 1, 1, 'すべての属性の敵を全滅' ],
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

    // セーブデータの初期化
    initSavedata: function() {
      var pc_base = this.randomArray(Common.pc_init);
      var hp_m = this.random(pc_base[2] - 10, pc_base[2] + 10);
      var mp_m = this.random(pc_base[3] - 10, pc_base[3] + 10)

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
        // 現在のシーン番号
        scene: 0,
        // 経過シーン
        ellapsed_scene: 0
      };
      this.saveStorage();
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
          this.shiftUnique(items, item);
        } else {
          this.pushUnique(items, item);
        }
      }
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
          + '.png" style="width: 50px"/>';
      }
      return html;
    },

    // ドロップアイテムの生成
    dropItem: function(element) {
      if(!element) { return ''; }
      var drop = {
        '地': [ '木星', '火星', '土星' ],
        '火': [ '火星', '太陽', '火星' ],
        '水': [ '水星', '月', '金星' ],
        '風': [ '金星', '水星', '月' ],
        '霊': [ '土星', '太陽', '月' ]
      };
      return this.randomArray(drop[element]);
    },

    // 状態異常によるステータス補正
    deltaStatus: function(state) {
      switch(state) {
        case 'frozen' :
          var state_desc = '全ステ-2';
          var str_d = -2;
          var int_d = -2;
          var dex_d = -2;
          var krm_d = -2;
          break;
        case 'stone' :
          var state_desc = '全ステ-1（10sceneで死）';
          var str_d = -1;
          var int_d = -1;
          var dex_d = -1;
          var krm_d = -1;
          break;
        case 'forget' :
          var state_desc = 'STR/INT高い方が0';
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
          var state_desc = 'HP-1/scene';
          var str_d = 0;
          var int_d = 0;
          var dex_d = 0;
          var krm_d = 0;
          break;
        case 'curse' :
          var state_desc = '魔法不可（除UN-CURSE）';
          var str_d = 0;
          var int_d = 0;
          var dex_d = 0;
          var krm_d = 0;
          break;
        default : 
          var state_desc = '';
          var str_d = 0;
          var int_d = 0;
          var dex_d = 0;
          var krm_d = 0;
          break;
      }
      return [ str_d, int_d, dex_d, krm_d, state_desc ];
    },

    // ステータスダイアログを初期化
    initDialog: function() {
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

      // 魔法選択ボックスを生成
      var magic_box = $('#magic', dialog);
      magic_box.empty();
      for(var key in Common.magic) {
        var magic = Common.magic[key];
        var option = $('<option></option>')
          .attr('value', key)
          .attr('title', magic[8])
          .text(key + '（' + magic[7] + '）');
        if(save_data.stars[0] < magic[0] ||
           save_data.stars[1] < magic[1] ||
           save_data.stars[2] < magic[2] ||
           save_data.stars[3] < magic[3] ||
           save_data.stars[4] < magic[4] ||
           save_data.stars[5] < magic[5] ||
           save_data.stars[6] < magic[6]) {
          option.attr('disabled', 'disabled');
        }
        option.appendTo(magic_box);
      }

      var items = [];
      for(var i = 0; i < save_data.items.length; i++) {
        var item = items_map[save_data.items[i]];
        items.push('・' + item.name + '（' + item.desc + '）');
      }
      $('#items', dialog).text(items.join('\r'));

      var flags = [];
      for(var i = 0; i < save_data.flags.length; i++) {
        flags.push('・' + flags_map[save_data.flags[i]]);
      }
      $('#flags', dialog).text(flags.join('\r'));

      $.zoombox.html(dialog.html(),
        {
          width: 640,
          height: 500
        }
      );
    },

    // 現在のシーン情報を取得＆画面の生成
    createScene: function(scene_num) { 
      var scene = $('scene[id="' + scene_num + '"]', scenario_data);

      // シーンテキストの整形
      target.text(scene.text());
      target.markdown();

      $('<h5 id="scenario_title">' + 
        $('scenario', scenario_data).attr('title') +
        '　【' + scene_num + '】' + '</h5>').prependTo(target);

      // サイコロの表示
      target.append('<center id="cubes">' + Util.cube(2) + '</center>');

      // 移動ボタンの整形
      $('a', target).addClass('scenebtn');

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
          if(enemy.func) { row += enemy.func; }
          row += '</td><td>' + this.dropItem(enemy.element);
          row += '</td><td>' + enemy.desc + '</td></tr>';
          e_table.append(row);
        }
        e_table.insertBefore('a.scenebtn:first');
      }

      // 現在のフラグ／アイテム情報を取得
      var flags = save_data.flags;
      var items = save_data.items;

      // title属性付きのボタンを非表示
      $('a[title]', target).hide();

      // 指定のフラグを所持している場合にだけボタンだけを表示
      for (var i = 0; i < flags.length; i++) {
        $('a[title="f' + flags[i] + '"]', target).show();
      }
      // 指定のアイテムを所有している場合にだけボタンを表示
      for (var i = 0; i < items.length; i++) {
        $('a[title="i' + items[i] + '"]', target).show();
      }

      // 現在のシーンのフラグ情報／アイテム情報を反映
      Util.updateItems(scene.attr('items'));
      Util.updateFlags(scene.attr('flags'));

      // 現在のシーン番号を保存
      save_data.scene = scene_num;
      save_data.ellapsed_scene++;

      // ストレージに反映
      Util.saveStorage();

      console.log(save_data);
    }
  };

  // プラグイン本体
  $.fn.extend({
    startGame: function(code) {
      scenario_code = code;
      target = this; 

      /** EventListener **/
      // 移動ボタンをクリックで次のシーンに移動
      target.on('click', 'a', function(e) {
        var num = $(this).attr('href');
        history.pushState(num, 'Scene ' + num);
        Util.createScene(num);
        e.preventDefault();
      });

      // サイコロをリロード
      target.on('click', '#cubes', function(e) {
        $(this).html(Util.cube(2));
      });

      // 右クリック時にステータスダイアログを表示
      target.on('contextmenu', function(e) {
        Util.createDialog();
        e.preventDefault();
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
          window.alert('星が不足しているため、魔法を行使できません！');
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

      // 履歴情報の復帰
      $(window).on('popstate', function(e) {
        Util.createScene(e.originalEvent.state);
      });
      /** EventListener **/

      // 初期化処理
      $.get(ROOT + scenario_code + '/scenario.xml')
        .done(function(result) {

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
              Util.loadStorage(scenario_code);
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
          Util.initSavedata();
          Util.initDialog();

          // 最初のシーンを取得
          Util.createScene(0);
          history.pushState(0, 'Scene 0');

          window.alert('キャラが新規作成されました。\r' +
            'ステータスダイアログは画面右クリックで開くことができます。');
        })
        .fail(function(xhr, status, error) {
          throw new Error('scenario code is invalid.');
        });
    }
  });
})(jQuery);
