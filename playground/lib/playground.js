$(function () {
  class LevelResolver {
    constructor(scenario) {
      //this.scenario = JSON.parse(JSON.stringify(scenario));
      this.scenario = scenario;
      this.level = {};
      this.maxLevel = 1;     
    }

    // 走査の基点
    run() {
      let that = this;
      let over = this.getEdgeCount();
      this.traceScenes(0, 1);     
      // 記録したレベル値を書き戻し
      this.scenario.scenes.forEach(function(scene) {
        let level = that.level[scene.id];
        if (level) {
          scene.level = level;
        } else {
          scene.level = that.maxLevel;
        }
        // 一定数以上のリンクを持つシーンは最下層に移動
        if (over.includes(scene.id)) {
          scene.level = that.maxLevel + 1;
        }
      });      
    }

    // 指定されたidをキーにリンク先シーンを順に走査
    traceScenes(id, level) {
      let that = this;
      // 既にレベルが存在すれば終了
      if (this.level[id]) { return; }
      this.level[id] = level;
      let children = this.getToScenes(id);
      children.forEach(function(scene) {
        that.traceScenes(scene.id, level + 1);
      });
      if (this.maxLevel < level) {
        this.maxLevel = level; 
      }
    }

    // 指定のidからリンクしているシーンを取得
    getToScenes(id) {
      let to_ids = [];
      // 現在のidがリンク元（from）であるシーンidを取得
      this.scenario.edges.forEach(function(edge) {
        if (String(edge.from) === String(id)) {
          to_ids.push(edge.to);
        }
      });
      // リンク先シーンをまとめて取得
      return this.scenario.scenes.filter(function(scene) {
        return to_ids.includes(String(scene.id));
      });
    }
    // シーンへのFrom/Toリンク個数をカウント（一定数以上のリンクがあるシーンを返す）
    getEdgeCount() {
      let to_id = {};
      let from_id = {};
      this.scenario.edges.forEach(function(edge) {
        if (to_id[edge.to]) {
          to_id[edge.to] += 1;
        } else {
          to_id[edge.to] = 1;
        }
        if (from_id[edge.from]) {
          from_id[edge.from] += 1;
        } else {
          from_id[edge.from] = 1;
        }
      });

      let result = [];
      Object.keys(from_id).forEach(function(id) {
        if (from_id[id] > 15) {
          result.push(id);
        }
      });
      Object.keys(to_id).forEach(function(id) {
        if (to_id[id] > 15) {
          result.push(id);
        }
      });
      return result;
    }

    // 以下未使用
    // 指定のidにリンクしているシーンを取得
    // getFromScenes(id) {
    //   let from_ids = [];
    //   // 現在のidにリンクしている（to）であるシーンidを取得
    //   this.scenario.edges.forEach(function(edge) {
    //     if (String(edge.to) === String(id)) {
    //       from_ids.push(edge.from);
    //     }
    //   });
    //   // リンク元シーンをまとめて取得
    //   return this.scenario.scenes.filter(function(scene) {
    //     return from_ids.includes(String(scene.id));
    //   });
    // }

    // // 指定されたidをキーにシーンを取得
    // getSceneById(id) {
    //   return this.scenario.scenes.find(function(scene) {
    //     return String(scene.id) === String(id);
    //   });
    // }
  }

  // フローチャート
  let network = null;
  // フローチャートの絞り込み条件
  let filter_where = [];
  // 設定情報
  // let config = {};
  // グリッド
  let grid = {};
  // サイドバー
  // let side_set = new Set();
  // グリッドになんらかの更新が発生したか
  let isUpdatedInGrid = false;
  // ヘルプページ（キャッシュ）
  let help_page;
  // ヘルプページ（スタック。移動用）
  let related_help = [];

  // 共通データ
  let Common = {
    HELP_URL: 'https://sorcerian.hateblo.jp/entry/2018/11/01/211745#',
    // シーン＆エッジのインデックス番号
    SCENE_INDEX: 8,
    EDGE_INDEX : 9,
    // マイストレージの名前
    MY_STORAGE: 'pg2_save',
    // ストレージの一時保存名（ロード時）
    LOAD_NAME: 'pg2_load',
    // ストレージの一時保存名（実行時）、ウィンドウ名
    RUN_NAME: 'pg2_run',
    // 設定の名前
    CONFIG_NAME: 'pgflow_config',
    // 初期設定
    INIT_CONFIG: {
      author: 'Unnamed',
      disp: 'auto',
      increment: 10
    },
    // 初期データ
    INIT_DATA_EMPTY: {
      title: '',
      author: '',
      init: {
        basic: {},
        constraint: {},
        bgm: {},
        label: {},
        intro: {},
      },
      groups: [],
      items: [],
      flags: [],
      params: [],
      enemies: [],
      results: [],
      licence: [],
      scenes: [],
      edges: []
    },
    // 初期データ
    INIT_DATA: {
      title: 'Untitled',
      author: 'Unnamed',
      init: {
        basic: {
          summary: '',
          imgset: ''
        },
        constraint: {
          race: '',
          sex: '',
          age: ''
        },
        bgm: {
          main: '',
          happy: '',
          bad: ''
        },
        label: {
          free1: '',
          free2: '',
          free3: ''
        },
        intro: {
          keywords: '',
          description: ''
        },
      },
      groups: [
        {
          start: 0,
          end: 1,
          title: 'Introduction',
          rule: ''
        }
      ],
      items: [
        {
          id: 'i01',
          name: 'Item-01',
          text: 'Item description...'
        }
      ],
      flags: [
        {
          id: 'f01',
          text: 'Flag description...'
        }
      ],
      params: [
        {
          id: 'p01',
          min: 0,
          max: 100,
          initial: 50,
          text: 'Param description...'
        }
      ],
      enemies: [
        {
          id: 'm01',
          name: 'Enemy-01',
          element: 'earth',
          attack: 'physics',
          func: 'L+R-STR',
          drop: 'mon/2',
          text: 'Enemy description...'
        }
      ],
      results: [
        {
          id: 'r01',
          name: 'Result-01',
          level: 1,
          text: 'Result description...'
        }
      ],
      licence: [
        {
          name: 'Bgm-01',
          category: 'bgm',
          creator: 'SText',
          url: 'https://example.com/'
        }
      ],
      scenes: [
        {
          id: '0',
          summary: 'プロローグ',
          label: '0:\nプロローグ',
          text: 'ここにプロローグを書きます。',
          group: 'prologue'
        },
        {
          id: '1',
          summary: '本文',
          label: '1:\n本文',
          text: 'ここからが本文です。'
        }
      ],
      edges: [
        {
          from: '0',
          to: '1',
          label: '次へ'
        }
      ]
    }
  };

  // 共通関数
  let Util = {
    // シナリオデータをリフレッシュ（new_data：新しいシナリオオブジェクト）
    refreshScenario: function(new_data) {
      scenario = JSON.parse(JSON.stringify(new_data));
      Util.createAllGrid();
    },
    // 設定情報をロード
    loadConfig: function() {
      let conf = localStorage[Common.CONFIG_NAME];
      try {
        if (conf) {
          return JSON.parse(conf);
        } else {
          return Common.INIT_CONFIG;
        }
      } catch(e) {
        return Common.INIT_CONFIG;
      }
    },
    // 設定情報をセーブ
    saveConfig: function(data) {
      if (data) {
        localStorage[Common.CONFIG_NAME] = JSON.stringify(data);
        return true;
      } else {
        return false;
      }
    },
    // 階層付け（戻り値は階層付きシナリオデータ）
    updateLevel() {
      let lr = new LevelResolver(scenario);
      lr.run();
      return lr.scenario;
    },
    // アイテム／敵などのソート
    sortFn: function(m, n) {
      try {
        return Number(m.id.substring(1)) - Number(n.id.substring(1));
      } catch(e) {
        console.error(e);
        return 0;
      }
    },

    // 「hoge/foo」を「hoge > foo」に変換
    transferQuery: function(selector) {
      return  selector.replace(/\//g, ' > ');
    },

    // ヘルプページの取得
    getHelpPage: function(selector) {
      $.get('./lib/reference.xml')
        .done(function(result) {
          help_page = result;
          Util.showHelpDialog(selector);
        });
    },

    // セレクターに合致した要素をダイアログに反映＆表示
    // 引数selectorは「init/basic/imgset」など
    showHelpDialog: function(selector) {
      let btn_obj =  [
        {
          text: '閉じる',
          click: function() {
            related_help = [];
            $(this).dialog('close');
            Util.closeAllSidebar();
          }
        },
      ];
      if (related_help.length > 0) {
        btn_obj.unshift({
          text: '戻る',
          click: function() {
            Util.showHelpDialog(related_help.pop());
          }
        });
      }

      if (help_page) {
        let el = $(Util.transferQuery(selector), help_page);
        // 本文
        let txt;
        if (el.children().length === 0) {
          txt = el.text();
        } else {
          txt = el.children('outline').text();
        }

        // 共通テキスト
        let ref = el.attr('ref');
        if (ref) {
          txt += $(Util.transferQuery(ref), help_page).text();
        }
        $('#help-dialog > #help-body').html(marked(txt));

        // 関連ドキュメントを生成
        let related = [];
        if (el.attr('related')) {
          let at_related = [];
          if (el.attr('related') === '@child') {
            el.children().each(function(i, e) {
              let tagName = $(e).prop('tagName');
              if (tagName !== 'outline') {
                at_related.push(`${el.prop('tagName')}/${tagName}`);
              }
            });
          } else {
            at_related = el.attr('related').split(',');
          }
          at_related.forEach(function(exp) {
            let rel_e = $(Util.transferQuery(exp), help_page);
            let rel_name = rel_e.attr('name');
            if (!rel_name) {
              rel_name = rel_e.prop('tagName')
            }
            related.push(`<li data-cur="${selector}" data-rel="${exp}">
              <span class="ui-icon ui-icon-circle-arrow-e"></span>
              ${rel_name}（${rel_e.attr('overview')}）</li>`);
          });
        }
        $('#help-dialog > #related-help').html(related.join(''));

        // ダイアログを生成
        $('#help-dialog')
          .dialog({
            title: `${el.prop('tagName')}（${el.attr('overview')}）`,
            buttons: btn_obj
          })
          .dialog('open');
      } else {
        Util.getHelpPage(selector);
      }
      Util.closeAllSidebar();
    },

    // ヘルプテキストを取得（未完成）
    // getHelpText: function(key) {
    //   let result = '';
    //   if (!help_page) {
    //     fetch('https://sorcerian.hateblo.jp/entry/2018/11/01/211745')
    //       .then(function(response) {
    //         return response.text();
    //       })
    //       .then(function(data) {
    //         help_page = $(data);
    //       });
    //   }
    //   // <key>-begin～<key>-endを取得
    //   $(`#${key}-begin`, help_page).parent().nextUntil(`:has(#${key}-end)`)
    //     .each(function(index, elem) {
    //       result += elem.outerHTML;
    //     });
    //   return result;
    // },

    // scene idの最大値を取得
    maxSceneId: function() {
      return Math.max.apply(null,
        scenario.scenes.map(function(s) {
          if (s.id >= 90000) {
            return 0;
          }
          return s.id;
        }));
    },
    // シナリオ内の項目をソート
    sortScenario: function() {
      scenario.groups.sort(function(m, n) {
        return Number(m.start) - Number(n.start);
      });
      scenario.items.sort(Util.sortFn);
      scenario.flags.sort(Util.sortFn);
      scenario.enemies.sort(Util.sortFn);
      scenario.results.sort(Util.sortFn);
    },
    // シーンをid値でソート
    sortScenes: function() {
      scenario.scenes.sort((m, n) => {
        return Number(m.id) - Number(n.id);
      });
    },
    // リンクをfrom、order値でソート
    sortEdges: function() {
      scenario.edges.sort((m, n) => {
        let m_from = Number(m.from);
        let n_from = Number(n.from);
        let m_order = Number(m.order);
        let n_order = Number(n.order);
        if (m_from !== n_from) {
          return m_from - n_from;
        } else {
          return m_order - n_order;
        }
      });
    },
    // 指定のfrom、orderの組み合わせで既存のリンクが存在するか
    isDuplicateOrderedEdge: function(from, order) {
      return scenario.edges.some(function(value) {
        return Number(value.from) === Number(from) &&
         Number(value.order) === Number(order);
      })
    },

    // 重複のないリンクorderを生成（from：リンク元、start：order最小値）
    detectLinkOrder: function(from, start) {
      while (true) {
        if (Util.isDuplicateOrderedEdge(from, start)) {
          start++;
        } else {
          return start;
        }
      }
    },
    // 指定のidが既存のidと重複するか（アイテム～実績）
    isDuplicateId: function(id, data) {
      return data.some(function(value) {
        return value.id === id;
      });
    },

    // 指定のidが既存のシーンidと重複するか
    isDuplicateScene: function(id) {
      return scenario.scenes.some(function(value) {
        return Number(value.id) === Number(id);
      })
    },
    // 指定のidが既存のシーンに存在しないか
    isNewScene: function(id) {
      return !Util.isDuplicateScene(id);
    },
    // 指定のidの次の空きシーンを算出
    nextScene: function(id) {
      let next_id = Number(id);
      while (true) {
        next_id += Number(global_config.increment);
        if (Util.isNewScene(next_id)) {
          return next_id;
        }
      }
    },
    // 指定の情報でノードを生成
    addNode(id, summary) {
      if (Util.isDuplicateScene(id)) {
        toastr.error('id値が重複しています。', '不正なid');
        return false;
      } else {
        scenario.scenes.push(
          {
            id: String(id),
            summary: summary,
            label: `${id}:\n${summary}`,
            text: '',
          }
        );
        Util.sortScenes();
        return true;
      }
    },
    // 指定のScene Idを変更
    changeNodeId(old_id, new_id) {
      scenario.scenes.forEach(function(scene) {
        if (String(scene.id) === old_id) {
          scene.id = new_id;
          scene.label = `${new_id}\n${scene.summary}`;
        }
      });
      scenario.edges.forEach(function(edge) {
        if (String(edge.from) === old_id) {
          edge.from = new_id;
        }
        if (String(edge.to) === old_id) {
          edge.to = new_id;
        }
      });
    },
    // 指定のScene Idを入替
    swapNodeId(old_id, new_id) {
      scenario.scenes.forEach(function(scene) {
        if (String(scene.id) === old_id) {
          scene.id = new_id;
          scene.label = `${new_id}\n${scene.summary}`;
          return; // スキップ
        }
        if (String(scene.id) === new_id) {
          scene.id = old_id;
          scene.label = `${old_id}\n${scene.summary}`;
        }
      });
      scenario.edges.forEach(function(edge) {
        // from、toを処理済みか
        let done_from = false;
        let done_to = false;
        if (String(edge.from) === old_id) {
          edge.from = new_id;
          done_from = true;
        }
        if (String(edge.to) === old_id) {
          edge.to = new_id;
          done_to = true;
        }
        // done_xxxx：処理済みのものを重ねて処理しない
        if (!done_from && String(edge.from) === new_id) {
          edge.from = old_id;
        }
        if (!done_to && String(edge.to) === new_id) {
          edge.to = old_id;
        }
      });
      console.log(scenario);
    },
    // 指定の情報でリンクidを生成
    generateLinkId: function(from, to) {
      return `custom${from}-${to}-${Math.floor( Math.random() * 100000 )}`;
    },
    // 指定の情報でリンクを生成
    // from：リンク元、to：リンク先、label：ラベル文字列
    // kind：リンク種別（''｜R｜X｜Q）
    // add：追加情報（追加リンク）
    // correct：正解文字列（kind='Q'のみ）
    addLink: function(from, to, label,
      kind = '', add = '', correct = '') {
      // orderを決定
      let order = Util.detectLinkOrder(from, 90);
      // 種別に応じた処理
      if (!kind) {
        scenario.edges.push(
          {
            "from": from,
            "to": to,
            "label": label,
            "id": Util.generateLinkId(from, to)
          }
        );
      } else if (kind === 'R' || kind === 'X') {
        // リンク先を統合
        let tos = [];
        tos.push(to);
        tos = tos.concat(add.split(','));
        // 重複除去
        tos = [...(new Set(tos))];
        for (let tmp_to of tos) {
          scenario.edges.push(
            {
              "from": from,
              "to": tmp_to,
              "label": label,
              "type": kind,
              "order": order,
              //(kind === 'R' ? 97 : 98),
              "id": Util.generateLinkId(from, tmp_to)
            }
          );
        }
      } else if (kind === 'Q') {
        scenario.edges.push(
          {
            "from": from,
            "to": to,
            "label": label,
            "type": 'Q',
            "correct": correct,
            "order": order,//99,
            "id": Util.generateLinkId(from, to)
          }
        );
        scenario.edges.push(
          {
            "from": from,
            "to": add,
            "label": label,
            "type": 'Q',
            "order": order,//99,
            "id": Util.generateLinkId(from, add)
          }
        );   
      }
    },
    // 指定のidでリンクを削除
    deleteLink(id) {
      let index = scenario.edges.findIndex(function(edge) {
        return edge.id === id;
      });
      return scenario.edges.splice(index, 1);
    },
    // 指定idのシーンと、関連するリンクを削除
    deleteScene(id) {
      if (id == 0) {
        toastr.error('id=0のシーンは削除できません。', '不正な操作');
        return;
      }
      let index = scenario.scenes.findIndex(function(scene) {
        return scene.id === id;
      });
      scenario.scenes.splice(index, 1);
      while (true) {
        let e_index = scenario.edges.findIndex(function(edge) {
          return edge.from === id || edge.to === id;
        });
        console.log(e_index);
        if (e_index !== -1) {
          scenario.edges.splice(e_index, 1);
        } else {
          break;
        }
      }
      return true;
    },
    // 指定されたシーンを取得
    getSceneById: function(id) {
      return scenario.scenes.find(function(elem) {
        return elem.id === id; 
      });
    },

    // リンクリストを生成
    createLinkList: function(id) {
      $('#scene-select #edges-list').empty();
      $('#scene-select #edges-list').append(
        '<option value="" selected>編集するリンクを選択</option>');
      Util.sortEdges();
      scenario.edges.forEach(function(value) {
        if (value.from === id) {
          $('<option></option>')
            .attr('value', value.id)
            .text(`${value.to}: ${value.label}`)
            .appendTo('#scene-select #edges-list');
        }
      });
    },

    // リンクリストを生成
    createSortLinkList: function(id) {
      Util.sortEdges();
      return scenario.edges.filter(function(value) {
        return value.from === id;
      });
    },

    // カラーリストを生成
    createColorList: function(id, colors = [ 
      'Purple', 'Olive', 'Blue', 'Gray', 'Green', 'Silver',
      'Teal', 'Red', 'Fuchsia', 'Aqua', 'Yellow', /* 'White' */
    ]) {
      let elem = $(id);
      elem.empty();
      elem.append('<option value="">既定</option>');
      for(let color of colors) {
        elem.append(
          $('<option></option>').
            val(color).
            text(color).
            css('background-color', color)
        );
      }
    },

    // 指定されたシーンの情報をフォームに反映
    setSceneInfo: function(id) {
      if (id !== undefined) {
        Util.enableTab(Common.SCENE_INDEX);
        let scene = Util.getSceneById(id);
        $('#scene-select #id').val(scene.id);
        $('#scene-select #summary').val(scene.summary);
        $('#scene-select #end').val(scene.end);
        $('#scene-select #items').val(scene.items);
        $('#scene-select #flags').val(scene.flags);
        $('#scene-select #params').val(scene.params);
        $('#scene-select #enemies').val(scene.enemies);
        $('#scene-select #dice').val(scene.dice);
        $('#scene-select #result').val(scene.result);
        $('#scene-select #nexts').val(scene.nexts);
        $('#scene-select #rule').val(scene.rule);
        $('#scene-select #bgm').val(scene.bgm);
        $('#scene-select #se').val(scene.se);
        $('#scene-select #hp').val(scene.hp);
        $('#scene-select #mp').val(scene.mp);
        $('#scene-select #state').val(scene.state);
        $('#scene-select #str').val(scene.str);
        $('#scene-select #int').val(scene.int);
        $('#scene-select #dex').val(scene.dex);
        $('#scene-select #krm').val(scene.krm);
        $('#scene-select #stars').val(scene.stars);
        $('#scene-select #free1').val(scene.free1);
        $('#scene-select #free2').val(scene.free2);
        $('#scene-select #free3').val(scene.free3);
        $('#scene-select #hp_max').val(scene.hp_max);
        $('#scene-select #mp_max').val(scene.mp_max);
        $('#scene-select #str_max').val(scene.str_max);
        $('#scene-select #int_max').val(scene.int_max);
        $('#scene-select #dex_max').val(scene.dex_max);
        $('#scene-select #krm_max').val(scene.krm_max);
        $('#scene-select #fixed').prop('checked', !!scene.fixed);
        $('#scene-select #exclude').prop('checked', !!scene.exclude);
        $('#scene-select #exclude').prop('checked', !!scene.exclude);
        $('#scene-select #color').val(scene.color);
        if (scene.text) {
          editor.setValue(scene.text);
        } else {
          editor.setValue('');
        }
        editor.focus();
        editor.clearSelection();

        // リンクリストを生成
        Util.createLinkList(id);
        // $('#scene-select #edges-list').empty();
        // $('#scene-select #edges-list').append(
        //   '<option value="" selected>編集するリンクを選択</option>');
        // Util.sortEdges();
        // scenario.edges.forEach(function(value) {
        //   if (value.from === id) {
        //     $('<option></option>')
        //       .attr('value', value.id)
        //       .text(`${value.to}: ${value.label}`)
        //       .appendTo('#scene-select #edges-list');
        //   }
        // });
      }
    },
    // 指定されたエッジを取得
    getEdgeById: function(id) {
      return scenario.edges.find(function(elem) {
        return elem.id === id; 
      });
    },
    // 指定されたエッジの情報をフォームに反映
    setEdgeInfo: function(id) {
      Util.enableTab(Common.EDGE_INDEX);
      let edge = Util.getEdgeById(id);
      $('#edge #id').val(edge.id);
      $('#edge #from').val(edge.from);
      $('#edge #to').val(edge.to);
      $('#edge #order').val(edge.order);
      $('#edge #label').val(edge.label);
      $('#edge #condition').val(edge.condition);
      $('#edge #type').val(edge.type);
      $('#edge #correct').val(edge.correct);
      $('#edge #cache').val(edge.cache);
    },
    // 指定されたオブジェクトを要素に変換
    // @params name：要素名、data：変換対象のオブジェクト
    // @return 生成された要素（jQuery obj）、中身が空の場合はfalse
    objToElement: function(name, data) {
      let flag = false;
      let result = $(`<${name}></${name}>`);
      for (let key of Object.keys(data)) {
        if (data[key] !== undefined && data[key] !== '') {
          if (key === 'text') {
            result.text(data[key]);
          } else if (key === 'label' || key === 'X' || key === 'y') {
            ; // なにもしない
          } else {
            result.attr(key, data[key]);
          }
          flag = true;
        }
      }
      if (flag) {
        return result;
      }
      return false;
    },
    // 指定範囲でフローチャートを生成
    // level：階層計算を行うか
    // focus_id：フォーカスするシーンのid
    // fit：キャンバスにチャートを合わせるか
    createNetwork: function(opts = {}) {
      // 既定値の設定
      opts = Object.assign(
        {
          level: true,
          focus_id: null,
          fit: false
        }, opts);

      // 再描画前に階層構造を再計算
      if (opts.level) {
        Util.updateLevel();
        //Util.refreshScenario(Util.updateLevel());
      }

      // 変更前の拡大率を保存
      let scale = 1.0;
      if (network) {
        scale = network.getScale();
      }
      // フローチャートを破棄
      Util.destroyNetwork();
      // 絞り込み条件が空の場合の既定値
      if (filter_where.length === 0) {
        filter_where = [{start: 0, end: 99999}];
      }
      // let from = $('#range-from').val();
      // let to = $('#range-to').val();
      // if (!from) { from = 0; }
      // if (!to) { from = 99999; }
  
      // フローチャートの生成
      network = new vis.Network(
        document.getElementById('flow-area'),
        {
          autoResize: false,
          //nodes: new vis.DataSet(scenario.scenes),
          nodes: new vis.DataSet(
            scenario.scenes.filter(function(value){
              let result = false;
              for (let cond of filter_where) {
                if (Number(cond.start) <= Number(value.id) &&
                  Number(value.id) <= Number(cond.end)) {
                    result = true;
                    break;
                  }
              }
              return result;

              // return Number(value.id) >= Number(from) &&
              //   Number(value.id) <= Number(to);
            })
          ),
          edges: new vis.DataSet(scenario.edges)
        },
        {
          physics: false,
          interaction:{hover:true},
          groups: {
            prologue: {
              color: '#3f0',
            },
            happy: {
              color: '#ffc',
            },
            bad: {
              color: '#96f',
            }
          },
          // ★フロチャ調整用★
          layout: {
            improvedLayout: false,
            hierarchical: {
              enabled: true,
              levelSeparation: 100,

              nodeSpacing: 100,
              blockShifting: true,
              edgeMinimization: true,

              direction: 'UD',
              sortMethod: 'directed',
              treeSpacing: 70,
            }
          },
          manipulation: {
            enabled: false,
            addNode: function(data, callback) {
              document.getElementById('node-add').onclick = function(data, callback) {
                data.id = $('#node-id').val();
                data.summary = $('#node-summary').val();
                data.label = data.id + ':\n' + data.summary;
                // 重複チェック
                if (scenario.scenes.some(function(value) { return value.id === data.id })) {
                  window.alert('重複したidは登録できません。');
                  callback(null);
                  return;
                } else {
                  $('#scene-dialog').dialog('close');
                  // データの追加
                  scenario.scenes.push(data);
                  scenario.scenes.sort((m, n) => {
                    return Number(m.id) - Number(n.id);
                  });
                  callback(data);
                  let tmp_pos = network.getViewPosition();
                  network.moveNode(data.id, tmp_pos.x, tmp_pos.y);
                }
              }.bind(this, data, callback);
              document.getElementById('node-cancel').onclick = function() {
                $('#scene-dialog').dialog('close');
              };
              $('#scene-dialog').dialog('open');
            },
            addEdge: function(data,callback) {
              scenario.edges.push(data);
              callback(data);
            },
            editEdge: function(data, callback) {
              let edge = Util.getEdgeById(data.id);
              edge.from = data.from;
              edge.to = data.to;
              Util.disableTab();
              callback(data);
            },
            deleteNode: function(data, callback) {
              if (confirm('Sceneを削除しても良いですか？')) {
                let node = Util.getSceneById(data.nodes[0]);
                // ノード0は削除不可
                if (Number(node.id) === 0) {
                  window.alert('id=0のノードは削除できません。');
                  callback(null);
                  return;
                }
                // ノードの削除
                scenario.scenes = scenario.scenes.filter(function(value) {
                  return value.id !== node.id;
                });
                scenario.edges = scenario.edges.filter(function(value) {
                  return value.from !== node.id && value.to !== node.id;
                });
                Util.disableTab();
                callback(data);
              } else {
                callback(null);
              }
            },
            deleteEdge: function(data, callback) {
              if (confirm('Edgeを削除しても良いですか？')) {
                for (ed of data.edges) {
                  scenario.edges = scenario.edges.filter(function(value) {
                    console.log(value);
                    console.log(ed);
                    console.log('----')
                    return value.id !== ed;
                  });
                }
                Util.disableTab();
                callback(data);
              } else {
                callback(null);
              }
            }
          },
          locale: 'ja',
          locales: {
            ja: {
              edit: 'Edit',
              del: 'Delete Selected',
              back: 'Back',
              addNode: 'Add Scene',
              addEdge: 'Add Link',
              editNode: 'Edit Scene',
              editEdge: 'Edit Link',
              addDescription: 'Click in an empty space to place a new scene.',
              edgeDescription: 'Click on a scene and drag the link to another scene to connect them.',
              editEdgeDescription: 'Click on the control points and drag them to a scene to connect to it.',
              createEdgeError: 'Cannot link edges to a cluster.',
              deleteClusterError: 'Clusters cannot be deleted.',
              editClusterError: 'Clusters cannot be edited.'
            }
          },
          nodes: {
            shape: 'box',
            size: 20,
            font: {
              size: 12
            },
            color: {
              background: 'skyblue',
              highlight: {
                border: '#f00',
                background: '#f90',
              }
            }
          },
          edges: {
            arrows: 'to',
            smooth: {
              'enabled': true,
              'type': 'curvedCCW',
              'roundness': 0.1
            },
            font: {
              size: 12,
              color: 'rgba(0,0,0,0)',
              strokeWidth: 0,
              //align: 'middle'
            },
            chosen: {
              label: function(values) {
                values.color = '#f00';
                values.strokeWidth = 2;
                values.mod = 'bold';
              }
            },
            color: {
              color: 'skyblue',
              hover: '#f90',
              highlight: '#f00'
            }

          }
        }
      );
      // 拡大率を復元
      network.moveTo({
        scale: scale
      });

      // 元々の選択ノードにフォーカス
      if (opts.focus_id) {
        network.focus(opts.focus_id);
        network.selectNodes([ opts.focus_id ]);
      }

      // 元々の選択リンクにフォーカス
      // if (opts.focus_link) {
      //   let edge = opts.focus_link;
      //   network.selectEdges([ edge.id ]);
      //   let coords = network.getPositions([edge.from, edge.to]);
      //   network.moveTo({
      //     position: {
      //       x: coords[edge.from].x + coords[edge.to].x / 2,
      //       y: coords[edge.from].y + coords[edge.to].y / 2
      //     }
      //   });
      // }

      // キャンバスサイズに合わせる
      if (opts.fit) {
        network.fit();
      }
  
      // ノード選択時にフォームに反映
      network.on('selectNode', function(e) {
        let id = this.getNodeAt(e.pointer.DOM);
        Util.setSceneInfo(id);
      });
  
      // エッジ選択時にフォームに反映
      network.on('selectEdge', function(e) {
        if (e.nodes.length !== 0) { return; }
        let id = network.getEdgeAt(e.pointer.DOM);
        if (id !== undefined) {
          Util.setEdgeInfo(id);
        }
      });

      // コンテキストメニュー
      network.on('oncontext', function(e) {
        let org_e = e.event;
        // シーンタブとチャート上の選択ノードとが等しい場合
        if ($('#scene-select #id').val() === e.nodes[0]) {         
          $('#chart-menu').css({
            display: 'block',
            top: org_e.pageY,
            left: org_e.pageX
          });
          org_e.preventDefault();
        }
      });
    },
    // ネットワークを初期化
    destroyNetwork: function() {
      if (network !== null) {
        network.destroy();
        network = null;
      }
    },

    // グリッドを生成
    // selector：グリッドの反映先、data：対象のデータ、
    // cols：列情報、opts：グリッドオプション、helpName：ヘルプリンク先
    createGrid: function(selector, data, cols, opts, helpName, checkid = true ) {
      if (data === undefined) { data = []; }
      let grid = new Slick.Grid(selector, data, cols, opts);
      grid.setSelectionModel(new Slick.CellSelectionModel());
      // 既存行の削除
      grid.onClick.subscribe(function (e, args) {
        if ($(e.target).hasClass('btn-delete')) {
          data.splice(args.row, 1);
          grid.invalidate();
        }
      });
      grid.onCellChange.subscribe(function(e, args) {
        // id更新時にソートを実行
        if (args.cell === 0) {
          isUpdatedInGrid = true;
        }
      });
      grid.onAddNewRow.subscribe(function (e, args) {
        let item = args.item;
        if (checkid) {
          if (!item.id) {
            toastr.error('idを入力してください。', 'Id Error');
            return;
          }
          if (Util.isDuplicateId(item.id, data)) {
            toastr.error('idが重複しています。', 'Id Error');
            return;
          }
        }
        grid.invalidateRow(data.length);
        data.push(item);
        grid.updateRowCount();
        grid.render();
        // ソート用更新マーク
        isUpdatedInGrid = true;
      });
      grid.onHeaderClick.subscribe(function (e, args) {
        Util.showHelpDialog(`${helpName}/${args.column.id}`);
        //window.open(Common.HELP_URL + helpName, 'help');
      });
      return grid;
    },
    // SlickGridによるid検証
    // value：入力値、prefix：接頭辞、
    // name：項目名、name_e：項目名（英語）
    validateId: function(value, prefix, name, name_e) {
      let msg = '';
      if (value === null ||
          value === undefined ||
          value.trim() === '') {
        msg = `${name}のidは空にはできません。`;
      } else if (!value.startsWith(prefix)) {
        msg = `${name}のidは「${prefix}～」形式で入力してください。`;
      } else if (Util.isDuplicateId(value, scenario[name_e])) {
        msg = `${name}のidが重複しています。`;
      }
      // エラーであれば、トースト表示
      if (msg) {
        toastr.error(msg, 'Id Error');
        return { valid: false, msg: msg };
      } else {
        return { valid: true, msg: null };
      }
      // if (value != null &&
      //     value != undefined &&
      //     value.trim() != '' &&
      //     value.startsWith(prefix)) {
      //   return { valid: true, msg: null };
      // } else {
      //   let msg = `${name}のidは「${prefix}～」形式で入力してください。`;
      //   toastr.error(msg, 'Id Error');
      //   return { valid: false, msg: msg };
      // }
    },
    // すべてのグリッドを初期化
    createAllGrid() {
      // SlickGridの共通オプション
      let grid_opts = {
        editable: true,
        enableAddRow: true,
        enableCellNavigation: true,
        asyncEditorLoading: false,
        autoEdit: false
      };

      // グループ一覧の描画
      grid['groups'] = 
      Util.createGrid('#groups_grid', scenario.groups, 
        [
          { id: 'start', name: '開始No.', field: 'start', width: 70, editor: Slick.Editors.Integer },
          { id: 'end', name: '終了No.', field: 'end', width: 70, editor: Slick.Editors.Integer },
          { id: 'title', name: 'グループ名', field: 'title', width: 250, editor: Slick.Editors.Text },
          { id: 'rule', name: 'ルールid', field: 'rule', width: 70, editor: Slick.Editors.Integer },
          {id: 'delete', name: '削除', field: '', width: 35,
          formatter: function () { return '<input type="button" class="btn-delete" value="×" />'; } }
        ], grid_opts, 'group', false);

      // アイテム一覧の描画
      grid['items'] = 
      Util.createGrid('#items_grid', scenario.items, 
        [
          { id: 'id', name: 'id', field: 'id', width: 50, editor: Slick.Editors.Text,
            validator: function(value) {
              return Util.validateId(value, 'i', 'アイテム', 'items');
            } },
          { id: 'name', name: '名前', field: 'name', width: 80, editor: Slick.Editors.Text },
          { id: 'target', name: '効果対象', field: 'target', width: 60, editor: SelectEditor,
            options: [ '', 'hp', 'mp', 'state', 'str', 'int', 'dex', 'krm', 'free1', 'free2', 'free3', 'param', 'none' ]
          },
          { id: 'effect', name: '効果値', field: 'effect', width: 80, editor: Slick.Editors.Text },
          { id: 'text', name: '説明', field: 'text', width: 250, editor: Slick.Editors.Text },
          { id: 'shared', name: '共有', field: 'shared', width: 50, editor: SelectEditor,
            options: ['', 'true'] },
          { id: 'delete', name: '削除', field: '', width: 35,
          formatter: function () { return '<input type="button" class="btn-delete" value="×" />'; } }
        ], grid_opts, 'item');

      // フラグ一覧の描画
      grid['flags'] = 
      Util.createGrid('#flags_grid', scenario.flags,
        [
          { id: 'id', name: 'id', field: 'id', width: 50, editor: Slick.Editors.Text,
            validator: function(value) {
              return Util.validateId(value, 'f', 'フラグ', 'flags');
            }
          },
          { id: 'text', name: '説明', field: 'text', width: 300, editor: Slick.Editors.Text },
          { id: 'delete', name: '削除', field: '', width: 35,
          formatter: function () { return '<input type="button" class="btn-delete" value="×" />'; } }
        ], grid_opts, 'flag');

      // 内部パラメーター一覧の描画
      if (scenario.params === undefined) { scenario.params = []; }
      grid['params'] = 
      Util.createGrid('#params_grid', scenario.params,
        [
          { id: 'id', name: 'id', field: 'id', width: 50, editor: Slick.Editors.Text,
            validator: function(value) {
              return Util.validateId(value, 'p', '内部パラメーター', 'params');
            } 
          },
          { id: 'min', name: '最小値', field: 'min', width: 60, editor: Slick.Editors.Text },
          { id: 'max', name: '最大値', field: 'max', width: 60, editor: Slick.Editors.Text },
          { id: 'initial', name: '初期値', field: 'initial', width: 60, editor: Slick.Editors.Text },
          { id: 'text', name: '説明', field: 'text', width: 300, editor: Slick.Editors.Text },
          {id: 'delete', name: '削除', field: '', width: 35,
          formatter: function () { return '<input type="button" class="btn-delete" value="×" />'; } }
        ], grid_opts, 'param');

      // 敵一覧の描画
      grid['enemies'] = 
      Util.createGrid('#enemies_grid', scenario.enemies,
        [
          { id: 'id', name: 'id', field: 'id', width: 50, editor: Slick.Editors.Text,
            validator: function(value) {
              return Util.validateId(value, 'm', 'モンスター', 'enemies');
            } 
          },
          { id: 'name', name: '名前', field: 'name', width: 80, editor: Slick.Editors.Text },
          { id: 'element', name: '属性', field: 'element', editor: SelectEditor,
            options: [ '', 'earth', 'water', 'fire', 'wind', 'spirit' ] },
          // { id: 'attack', name: '攻撃', field: 'attack', width: 80, editor: AutoCompleteEditor,
          //   dataSource: [ 'physics', 'magic', 'both', 'free1', 'free2', 'free3',
          //     'poison', 'frozen', 'stone', 'curse', 'forget', 'str', 'int', 'dex', 'krm', 'pxx' ] },
          { id: 'attack', name: '攻撃', field: 'attack', width: 80, editor: SelectEditor,
            options: [ '', 'physics', 'magic', 'both', 'free1', 'free2', 'free3',
              'poison', 'frozen', 'stone', 'curse', 'forget', 'str', 'int', 'dex', 'krm' ] },
          { id: 'func', name: 'ダメージ式', field: 'func', width: 80,
            editor: Slick.Editors.LongText,
            validator: function(value) {
              if (value.includes('<')) {
                let msg = 'ダメージ式では「&lt;」ではなく「&gt;」を利用してください。';
                toastr.error(msg, 'Func Error');
                return { valid: false, msg: msg };
              } else if (value.includes('ML') || value.includes('MR')) {
                let msg = '「ML」は「LM」、「MR」は「RM」です。';
                toastr.error(msg, 'Func Error');
                return { valid: false, msg: msg };
              } else {
                return { valid: true, msg: null };
              }
            }
          },
          { id: 'drop', name: 'ドロップ', field: 'drop', width: 80, editor: AutoCompleteEditor,
            dataSource: [ 'mon/', 'tue/', 'wed/', 'thu/', 'fri/', 'sat/', 'sun/', 'free1/', 'free2/', 'free3', ] },
          { id: 'text', name: '説明', field: 'text', width: 180, editor: Slick.Editors.LongText },
          { id: 'hp', name: '敵HP', field: 'hp', width: 40, editor: Slick.Editors.Text },
          { id: 'func_opp', name: '敵ダメージ式', field: 'func_opp', width: 90, editor: Slick.Editors.LongText },
          { id: 'delete', name: '削除', field: '', width: 35,
          formatter: function () { return '<input type="button" class="btn-delete" value="×" />'; } }
        ], grid_opts, 'enemy');

      // 実績一覧の描画
      grid['results'] = 
      Util.createGrid('#results_grid', scenario.results,
        [
          { id: 'id', name: 'id', field: 'id', width: 50, editor: Slick.Editors.Text,
            validator: function(value) {
              return Util.validateId(value, 'r', '実績', 'results');
            } 
          },
          { id: 'name', name: '名前', field: 'name', width: 100, editor: Slick.Editors.Text },
          { id: 'level', name: 'Lv.', field: 'level', width: 30, editor: SelectEditor,
            options: [ '1', '2', '3', '4', '5' ] },
          { id: 'text', name: '説明', field: 'text', width: 150, editor: Slick.Editors.Text },
          {id: 'delete', name: '削除', field: '', width: 35,
          formatter: function () { return '<input type="button" class="btn-delete" value="×" />'; } }
        ], grid_opts, 'result');

      // ライセンス一覧の描画
      grid['works'] = 
      Util.createGrid('#works_grid', scenario.licence,
        [
          { id: 'name', name: '名前', field: 'name', width: 100, editor: Slick.Editors.Text },
          { id: 'category', name: '分類', field: 'category', width: 70, editor: SelectEditor,
            options: [ '', 'bgm', 'picture' ] },
          { id: 'creator', name: '作者', field: 'creator', width: 80, editor: Slick.Editors.Text },
          { id: 'url', name: 'URL', field: 'url', width: 230, editor: Slick.Editors.Text },
          {id: 'delete', name: '削除', field: '', width: 35,
          formatter: function () { return '<input type="button" class="btn-delete" value="×" />'; } } 
        ], grid_opts, 'work', false);
    },

    // 単一／複数選択ボタン付きのサイドバーを生成（メンバー名対応）
    createSelectSidebar: function(trigger, target, 
      member, type, label, value, onSubmit) {
      let dataset = scenario[member];
      if (member === 'groups') {
        dataset = [
          {
            start: 0,
            end: 99999,
            title: 'フィルター解除'
          }
        ].concat(dataset);
      }
      // 処理はデータセット版に委譲
      Util.createSelectSidebarForDataset(trigger, target, 
        dataset, type, label, value, onSubmit);
    },

    // 単一／複数選択ボタン付きのサイドバーを生成
    // trigger：トリガーとなる要素（セレクター式）
    // target：サイドバーとなる要素のベース名（id値）
    // dataset：リスト対象のデータ（オブジェクト配列）
    // type：ボタンの種類（radio／check／plus_minus）
    // label：ラジオ／チェックボックスのラベルとなるプロパティ、またはラベルを生成する関数（引数は対象のオブジェクト、戻り値はラベル値）
    // value：ラジオ／チェックボックスの値となるプロパティ、またはラベルを生成する関数（引数は対象のオブジェクト、戻り値はオプション値）
    // onSubmit：サブミット時の処理（引数はトリガー要素、リスト要素）
    createSelectSidebarForDataset: function(trigger, target, 
      dataset, type, label, value, onSubmit) {
      // サイドバーとなる要素（id値）
      let s_name = `sidr_${target}`;
      // リスト要素（セレクター）
      let s_list = `#${s_name} #${s_name}_list`;
      // サブミットボタン（セレクター）
      let s_submit = `#${s_name} #${s_name}_submit`;
      // キャンセルボタン（セレクター）
      let s_cancel = `#${s_name} #${s_name}_close`;
      // 先頭ボタン
      let s_lead = `#${s_name} .btn-lead`;
      // triggerへのサイドバーの紐付け
      $(trigger).sidr({
        name: s_name,
        displace: false,
        onOpen: function() {
          $(s_list).empty();
          // let dataset = scenario[member];
          // if (member === 'groups') {
          //   dataset = [
          //     {
          //       start: 0,
          //       end: 99999,
          //       title: 'フィルター解除'
          //     }
          //   ].concat(dataset);
          // }
          // データセットが関数の場合の加工処理
          let v_dataset;
          if (typeof(dataset) === 'function') {
            v_dataset = dataset();
          } else {
            v_dataset = dataset;
          } 
          for(let obj of v_dataset) {
            let elem;
            let v_label;  // ラベル文字列
            let v_value;  // オプション値
            // 引数labelの処理
            if (typeof(label) === 'function') {
              v_label = label(obj);
            } else {
              v_label = obj[label];
            }
            // 引数valueの処理
            if (typeof(value) === 'function') {
              v_value = value(obj);
            } else {
              v_value = obj[value];
            }
            // if (Array.isArray(value)) {
            //   v_value = `${obj[value[0]]}-${obj[value[1]]}`
            // } else {
            //   v_value = obj[value]
            // }
            // 種別ごとに要素を生成
            switch (type) {
              case 'check':
                elem = `<li>
                  <label>${v_label}<input type="checkbox"
                    class="sidr-item" value="${v_value}" /></label>
                </li>`;
                break;
              case 'radio':
                elem = `<li>
                  <label>${v_label}<input type="radio" name="${s_name}"
                  class="sidr-item" value="${v_value}" /></label>
                </li>`;
                break;
              case 'plus_minus':
                elem = `<tr>
                  <td>
                    <label>＋<input type="checkbox"
                      class="sidr-item ${s_name}_plus" value="${v_value}" /></label>
                  </td>
                  <td class="sidr-elem"><span>${v_label}</span></td>
                  <td>
                    <label>－<input type="checkbox"
                      class="sidr-item ${s_name}_minus" value="${v_value}" /></label>
                  </td>
                </tr>`;
                break;
              case 'inputs' :
                elem = `<tr>
                  <td class="sidr-elem">${v_label}</td>
                  <td class="sidr-elem">
                    <input id="sidr_${v_value}_input" type="text" size="8" />
                  </td>
                </tr>`;
                break;
              case 'sort' :
                elem = `<li id="${v_value}">
                  <div class="ui-state-highlight ui-corner-all">${v_label}</div>
                </li>`;
                break;
              default:
                throw new Error('type属性の値が不正です。');
            }
            $(s_list).append(elem);
          }
          if (type === 'sort') {
            $(s_list).sortable({
              forcePlaceholderSize: true,
              cursor: 'move',
              opacity: 0.2
            });
          }
          // データ量が多い場合にだけ先頭ボタンを表示
          if (dataset.length > 30) {
            $(s_lead).show();
          } else {
            $(s_lead).hide();
          }
          // 配下のチェックボックスを整形
          $(`${s_list} .sidr-item`).checkboxradio({
            icon: false
          });
        }
      });
      // 選択を確定した時
      $(s_submit).click(function() {
        let result;
        switch (type) {
          case 'check':
            result = [];
            $(`${s_list} .sidr-item:checked`).each(function() {
              result.push($(this).val());
            });
            result = result.join(',');
            break;
          case 'radio':
            result = $(`${s_list} .sidr-item:checked`).val()
            break;
          case 'plus_minus':
            result = [];
            $(`${s_list} .sidr_${target}_plus:checked`).each(function() {
              result.push($(this).val());
            });
            $(`${s_list} .sidr_${target}_minus:checked`).each(function() {
              result.push('-' + $(this).val());
            });
            result = result.join(',');
            break;
          case 'inputs' :
            result = [];
            $(`${s_list} .sidr-elem input[type="text"]`).each(function() {             
              let v = $(this).val();
              if (v !== undefined && v.trim() !== '') {
                let id = $(this).attr('id'); // sidr_p01_inputs
                result.push(`${id.split('_')[1]}:${v}`);
              }
            });
            result = result.join(',');
            break;
          default:
            break;
        }
        if (onSubmit) {
          onSubmit(result, trigger, s_list);
        } else {
          $(trigger).val(result)
            .trigger('input');
        }
        $.sidr('close', s_name);
      });
      // 選択をキャンセルした時
      $(s_cancel).click(function() {
        $.sidr('close', s_name);
      });
    },

    // すべてのサイドバーを閉じる
    closeAllSidebar() {
      $('.mysidr').each(function(index, e) {
        $.sidr('close', $(e).attr('id'));
      });
    },

    // テキスト入力リンクの生成（For createMoveButton）
    createQuestLink: function(group) {
      let tmp_correct = '';
      let tmp_to = [];
      for (let value of group) {
        if (value.correct) {
          tmp_to[0] = value.to;
          tmp_correct = value.correct;
        } else {
          tmp_to[1] = value.to;
        }
      }
      return `[${tmp_correct},${tmp_to.join(',')}](Q)`;
    },
    // 自由移動リンクの生成（For createMoveButton）
    createFreeLink: function(group) {
      let tmp_to = [];
      for (let value of group) {
        tmp_to.push(value.to);
      }
      return `[${tmp_to.join(',')}](X)`;
    },
    // ランダムリンクの生成（For createMoveButton）
    createRandomLink: function(group) {
      let tmp_label = '';
      let tmp_cache = '';
      let tmp_condition = '';
      let tmp_to = [];
      for (let value of group) {
        if (value.cache) { tmp_cache = value.cache; }
        if (value.condition) { tmp_condition = value.condition; }
        if (value.label) { tmp_label = value.label; }
        tmp_to.push(value.to);
      }

      // リンク先の加工
      let to = tmp_to.join(',');
      if (tmp_cache) { to += `;${tmp_cache}`; }

      if (tmp_condition) {
        return `[${tmp_label}](${to} "${tmp_condition}")`;
      } else {
        return `[${tmp_label}](${to})`;
      }
    },
    // 標準リンクの生成（For createMoveButton）
    createStandardLink: function(link) {
      // let value = group[0];
      if (link.condition) {
        return `[${link.label}](${link.to} "${link.condition}")`;
      } else {
        return `[${link.label}](${link.to})`;
      }
    },
    // 指定されたid値のシーン移動ボタンを生成
    // return：生成された移動ボタン（改行区切り文字列）
    createMoveButton: function(id) {
      // 最終的な移動ボタン
      let result = [];
      // グループ化されたEdge（orderの同じものをまとめた二次元配列）
      let output = [];
      scenario.edges.filter(function(value) {
        return value.from === id;
      }).sort(function(v1, v2) {
        if (!v1.order) { v1.order = 0; }
        if (!v2.order) { v2.order = 0; }
        return Number(v1.order) - Number(v2.order);
      })
      .forEach(function(value){
        let last_out = output[output.length - 1];
        if (last_out && last_out[0].order === value.order) {
          last_out.push(value);
        } else {
          output.push([ value ]);
        }
      });

      for (let group of output) {
        switch(group[0].type) {
          case 'Q':
            result.push(Util.createQuestLink(group));
            break;
          case 'X':
            result.push(Util.createFreeLink(group));
            break;
          case 'R':
            result.push(Util.createRandomLink(group));
            break;
          default:
            for (let link of group) {
              result.push(Util.createStandardLink(link));
            }
            break;
        }
      }
      // 移動先リンクがない場合、エラーログ
      if (result.length === 0) {
        if (!Util.getSceneById(id).end) {
          console.warn(`No Link: ${id}`);
        }
      }
      return result.join('\n');
    },
    // 指定されたidのタブを有効化＆フォーカス
    enableTab: function(id) {
      $('#edit-area')
        .tabs('enable', id)
        .tabs('option', 'active', id);
    },
    // ［シーン］［リンク］タブを無効化
    disableTab: function() {
      $('#edit-area')
        .tabs('option', 'active', 0)
        .tabs('option', 'disabled', [ Common.SCENE_INDEX, Common.EDGE_INDEX ]);
    },
    // 現在のシナリオデータからscenario.xmlを生成
    // 戻り値：XML文字列
    createXml: function() {
      let result = $('<scenario ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
        'xsi:noNamespaceSchemaLocation="http://www.web-deli.com/sorcerian/next/stext/common/sgml.xsd">' +
        '</scenario>');
      let inits = $('<init></init>');
      let groups = $('<groups></groups>');
      let items = $('<items></items>');
      let flags = $('<flags></flags>');
      let params = $('<params></params>');
      let enemies = $('<enemies></enemies>');
      let results = $('<results></results>');
      let licence = $('<licence></licence>');
      // scenario要素
      result.attr('title', scenario.title);
      result.attr('author', scenario.author);
      // init要素
      let basic = Util.objToElement('basic', scenario.init.basic);
      if (basic) { inits.append(basic); }
      let constraint = Util.objToElement('constraint', scenario.init.constraint);
      if (constraint) { inits.append(constraint); }
      let bgm = Util.objToElement('bgm', scenario.init.bgm);
      if (bgm) { inits.append(bgm); }
      let label = Util.objToElement('label', scenario.init.label);
      if (label) { inits.append(label); }
      let intro = Util.objToElement('intro', scenario.init.intro);
      if (intro) { inits.append(intro); }
      result.append(inits);
      // groups要素
      for (let t_group of scenario.groups) {
        let group = Util.objToElement('group', t_group);
        if (group) { groups.append(group); }
      }
      result.append(groups);
      // items要素
      for (let t_item of scenario.items) {
        let item = Util.objToElement('item', t_item);
        if (item) { items.append(item); }
      }
      result.append(items);
      // flags要素
      for (let t_flag of scenario.flags) {
        let flag = Util.objToElement('flag', t_flag);
        if (flag) { flags.append(flag); }
      }
      result.append(flags);
      // parameters要素
      for (let t_param of scenario.params) {
        let param = Util.objToElement('param0', t_param);
        if (param) { params.append(param); }
      }
      result.append(params);
      // enemies要素
      for (let t_enemy of scenario.enemies) {
        let enemy = Util.objToElement('enemy', t_enemy);
        if (enemy) { enemies.append(enemy); }
      }
      result.append(enemies);
      // results要素
      for (let t_result of scenario.results) {
        let result = Util.objToElement('result', t_result);
        if (result) { results.append(result); }
      }
      result.append(results);
      // licence要素
      for (let t_work of scenario.licence) {
        let work = Util.objToElement('work', t_work);
        if (work) { licence.append(work); }
      }
      result.append(licence);
      // scene要素
      for (let t_scene of scenario.scenes) {
        let scene = Util.objToElement('scene', t_scene);
        scene.text(scene.text() + '\n\n' +
          Util.createMoveButton(scene.attr('id')));
        if (scene) { result.append(scene); }
      }
      // 整形したものを出力（<param>要素はHTML予約なので<param0>で退避）
      return vkbeautify.xml('<?xml version="1.0" encoding="utf-8"?>\n' +
        (result.get(0).outerHTML
          .replace(/<param0(.+?)>/gi, '<param$1>')
          .replace(/<\/param0>/gi, '</param>'))
      );
    },
    // 指定された要素（jQueryオブジェクト）をオブジェクトに変換（For createJson）
    elementToObj: function(obj, isLabel) {
      let result = {};
      let t_obj = obj.get(0);
      if (t_obj) {
        let attrs = t_obj.attributes;
        for (let attr of attrs) {
          result[attr.name] = attr.value;
        }
        if (t_obj.textContent) {
          result.text = t_obj.textContent;
        }
        if (isLabel) {
          result.label = t_obj.id + ':\n' + t_obj.getAttribute('summary');
        }
      }
      return result;
    },
    // 指定されたend属性からグループを判定
    // （For createJson）
    // attr_end：end属性、obj：グループ追加のオブジェクト
    setGroupByEnd(attr_end, obj) {
      switch(attr_end) {
        case 'happy': 
          obj.group = 'happy';
          break;
        case 'bad' :
          obj.group = 'bad';
          break;
        default :
          delete obj.group;
          break;
      }
    },
    // 指定されたscenario.xml（文字列）からJSON形式を生成
    createJson(data) {
      let result = $.extend(true, {}, Common.INIT_DATA_EMPTY);
      let parser = new DOMParser();
      let s_data = parser.parseFromString(data, 'text/xml');
      result.title = $('scenario', s_data).attr('title');
      result.author = $('scenario', s_data).attr('author');
      result.init.basic = Util.elementToObj($('init > basic', s_data));
      result.init.constraint = Util.elementToObj($('init > constraint', s_data));
      result.init.bgm = Util.elementToObj($('init > bgm', s_data));
      result.init.label = Util.elementToObj($('init > label', s_data));
      result.init.intro = Util.elementToObj($('init > intro', s_data));
      $('groups > group', s_data).each(function(i, elem) {
        result.groups.push(Util.elementToObj($(elem)));
      });
      $('items > item', s_data).each(function(i, elem) {
        result.items.push(Util.elementToObj($(elem)));
      });
      $('flags > flag', s_data).each(function(i, elem) {
        result.flags.push(Util.elementToObj($(elem)));
      });
      $('params > param', s_data).each(function(i, elem) {
        result.params.push(Util.elementToObj($(elem)));
      });
      $('enemies > enemy', s_data).each(function(i, elem) {
        result.enemies.push(Util.elementToObj($(elem)));
      });
      $('results > result', s_data).each(function(i, elem) {
        result.results.push(Util.elementToObj($(elem)));
      });
      $('licence > work', s_data).each(function(i, elem) {
        result.licence.push(Util.elementToObj($(elem)));
      });
      var link = /\[(.+?)\]\(([\dQX,;]{1,})(?: "(.+?)")?\)/gi;
      $('scene', s_data).each(function(i, elem) {
        let body = $(elem).text();
        let order = 0;
        while((link_result = link.exec(body)) !== null) {
          order++;
          let tmp_to = link_result[2];
          let tmp_condition = link_result[3] ? link_result[3] : '';
          let tmp_label = link_result[1];
          switch(tmp_to) {
            case 'Q':
              tmp_label = tmp_label.split(',');
              result.edges.push({
                from: elem.id,
                to: tmp_label[1],
                label: '',
                type: 'Q',
                correct: tmp_label[0],
                order: String(order)
              });
              result.edges.push({
                from: elem.id,
                to: tmp_label[2],
                label: '',
                type: 'Q',
                order: String(order)
              });
              break;
            case 'X':
              tmp_label = tmp_label.split(',');
              for (let tmp of tmp_label) {
                result.edges.push({
                  from: elem.id,
                  to: tmp,
                  label: '',
                  type: 'X',
                  order: String(order)
                });
              }
              break;
            default:
              if (tmp_to.indexOf(',') === -1) {
                result.edges.push({
                  from: elem.id,
                  to: tmp_to,
                  label: tmp_label,
                  condition: tmp_condition,
                  order: String(order)
                });
              } else {
                // 「;」以降がキャッシュ時間
                tmp_cache = tmp_to.split(';');
                tmp_to = tmp_cache[0].split(',');
                tmp_cache = tmp_cache[1];
                is_first = true;  // 初回ループか
                for (let tmp of tmp_to) {
                  let tmp_link = {
                    from: elem.id,
                    to: tmp,
                    label: tmp_label,
                    type: 'R',
                    condition: tmp_condition,
                    order: String(order)
                  };
                  // 最初のリンクだけにcacheを反映
                  if (is_first) {
                    tmp_link.cache = tmp_cache;
                    is_first = false;
                  }
                  result.edges.push(tmp_link);
                }
              }
              break;
          }
        }
        // sceneオブジェクト生成
        let s_obj = Util.elementToObj(
          //$(elem).text(body.replace(link, '')),
          $(elem).text(body.replace(link, '').trimEnd()),
          true);
        if(Number(s_obj.id) === 0) {
          s_obj.group = 'prologue';
        } else if (s_obj.end) {
          Util.setGroupByEnd(s_obj.end, s_obj);
        }
        result.scenes.push(s_obj);
      });
      return JSON.stringify(result);
    },

    // 算用数字を漢数字に変換
    numToKanji: function(nums) {
      let result = '';
      let tbl = { '1' : '一', '2' : '二', '3' : '三', '4' : '四', '5' : '五',
        '6' : '六', '7' : '七', '8' : '八', '9' : '九', '0' : '〇' };
      for (num of String(nums)) {
        result += tbl[num];
      }
      return result;
    },

    // アンカータグの生成（createHtml用）
    createLinkTag: function(id, edges) {
      let result = [];
      edges.forEach(function(value) {
        if (value.from === id) {
          result.push(`<a href="#${value.to}">［${value.label} ${Util.numToKanji(value.to)}へ］</a>`);
        }
      });
      return result.join('<br />');
    },

    // 現在のシナリオデータをHTML形式に変換
    createHtml() {
      let html = $('<html></html>')
        .append(
          $('<head></head>')
            .append(
              $('<meta></meta>').attr('charset', 'UTF-8'))
            .append(
              $('<title></title>').text(scenario.title))
            .append(
              $('<style></style>').text(`body {
                writing-mode: vertical-rl;
                text-orientation: upright;
              }`)
            )
        );
      let body = $('<body></body>');

      // シャッフル
      // let s = new StextShuffle(scenario);
      // s.run();
      // s.scenario.scenes.sort((m, n) => {
      //   return Number(m.id) - Number(n.id);
      // });

      scenario.scenes.forEach(function(value) {
        $('<div class="scene"></div>')
          .attr('id', value.id)
          .html('<h3>【' + Util.numToKanji(value.id) + '】</h3>'
            + marked(value.text)
            //value.text.replace(/\n/gi, '<br />')
            + '<p>' + Util.createLinkTag(value.id, scenario.edges) + '</p>'
            + '<hr />')
          .appendTo(body);
      });
      html.append(body);
      // markdown動作せず
      // $('.scene', html).markdown();
      return '<!DOCTYPE html>' +
        html.get(0).outerHTML;
    },

    // アンカータグの生成（createEpub用）
    createLinkText:function(id, edges) {
      let result = [];
      edges.forEach(function(value) {
        if (value.from === id) {
          result.push(`<a href="bodymatter_0_${value.to}.xhtml">［${value.label} ${Util.numToKanji(value.to)}へ］</a>`);
        }
      });
      return result.join('\n\n');
    },

    // 現在のシナリオデータをEPUB形式に変換（でんでんコンバーター）
    createEpub: function() {
      let result = '';
      scenario.scenes.forEach(function(value) {
        result += `【${Util.numToKanji(value.id)} 】

${value.text}

${Util.createLinkText(value.id, scenario.edges)}

==============

`;
      });
      result += `
# 付録

## 敵情報

名前|属性|攻撃|概要
----|----|----|----
`;

      let elem = { '': '無', 'earth': '地', 'fire': '火', 'water': '水', 'wind': '風', 'spirit': '霊' };
      let atk  = { 'physics': '物理', 'magic': '魔法', 'both': '物理／魔法',
        'str': 'STR', 'int': 'INT', 'dex': 'DEX', 'krm': 'KRM',
       'free1': 'FREE1', 'free2': 'FREE2', 'free3': 'FREE3' };
      scenario.enemies.forEach(function(value) {
        result += `${value.name}|${elem[value.element]}|${atk[value.attack]}|${value.text}\n`;
      });
      result += `

## アイテム情報

名前|概要
----|----
`;
      scenario.items.forEach(function(value) {
        result += `${value.name}|${value.text}\n`;
      });
      result += `

## 実績情報

名前|Lv|概要
----|----|----
`;  
      scenario.results.forEach(function(value) {
        result += `${value.name}|${Util.numToKanji(value.level)}|${value.text}\n`;
      });
      return result;
    },

    // データをダウンロード
    // @params content：データ本体、name：ファイル名
    download: function(content, name) {
      var blob = new Blob([ content ],
        { 'type': 'application/octet-stream' });
      var anchor = document.createElement('a');
      anchor.href = window.URL.createObjectURL(blob);
      anchor.download = name;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    }
  };

  // ★★★★★★★★★★★★★★★★★★★★★★Entry Point★★★★★★★★★★★★★★★★★★★★★★★★★★★
  // 設定情報
  let global_config = Util.loadConfig();
  // シナリオデータ
  let scenario;
  // Editor2Flow
  if (localStorage['editor2flow']) {
    sessionStorage.setItem(Common.LOAD_NAME, Util.createJson(localStorage['editor2flow']));
    localStorage.removeItem('editor2flow');
  }
  // シナリオの読み込み
  try {
    scenario = JSON.parse(sessionStorage.getItem(Common.LOAD_NAME));
    sessionStorage.removeItem(Common.LOAD_NAME);
  } catch(e) {
    console.log(e);
  }
  if (!scenario) {
    scenario = $.extend(true, {}, Common.INIT_DATA);
    // 著者情報を初期化
    scenario.author = global_config.author;
  }

  // 追加要素の対応
  if (!scenario.init.basic) { scenario.init.basic = {}; }
  if (!scenario.params)     { scenario.params = []; }
  // 初期化時に増分値を設定
  // $('#ctrl_incre').val(global_config.increment);

  // 初期化時にアイテム／フラグ等をソート
  Util.sortScenario();

  // フローチャートの初期化
  Util.createNetwork({ fit: true });
  // network.fit();

  // 基本情報を初期化
  $('#title').val(scenario.title);
  $('#author').val(scenario.author);
  $('#basic-summary').prop('checked', !!scenario.init.basic.summary);
  $('#basic-imgset').prop('checked', !!scenario.init.basic.imgset);
  $('#constraint-race').val(scenario.init.constraint.race);
  $('#constraint-sex').val(scenario.init.constraint.sex);
  $('#constraint-age').val(scenario.init.constraint.age);
  $('#bgm-main').val(scenario.init.bgm.main);
  $('#bgm-happy').val(scenario.init.bgm.happy);
  $('#bgm-bad').val(scenario.init.bgm.bad);
  $('#label-hp').val(scenario.init.label.hp);
  $('#label-mp').val(scenario.init.label.mp);
  $('#label-state').val(scenario.init.label.state);
  $('#label-str').val(scenario.init.label.str);
  $('#label-int').val(scenario.init.label.int);
  $('#label-dex').val(scenario.init.label.dex);
  $('#label-krm').val(scenario.init.label.krm);
  $('#label-free1').val(scenario.init.label.free1);
  $('#label-free2').val(scenario.init.label.free2);
  $('#label-free3').val(scenario.init.label.free3);
  $('#intro-keywords').val(scenario.init.intro.keywords);
  $('#intro-description').val(scenario.init.intro.description);

  // 基本情報配下の入力値を反映
  $('#basic input').on('input', function(e) {
    let id = e.target.id.split('-');
    if (id.length === 1) {
      scenario[id[0]] = $(this).val();
    } else {
      scenario.init[id[0]][id[1]] = $(this).val();
      // summary属性の処理
      if ((id[1] === 'summary' || id[1] === 'imgset') && !$(this).prop('checked')) {
        scenario.init[id[0]][id[1]] =  undefined;
      }
    }
    // console.log('input')
  });

  // 種族／年齢／性別ボックスの加工
  $('.sidr-race-item, .sidr-age-item, .sidr-sex-item').checkboxradio({
    icon: false
  });

  //［基本］タブ内での種族処理
  $('#basic #constraint-race').sidr({
    name: 'sidr_races',
    displace: false
  });

  // 種族選択を確定した時
  $('#sidr_races_submit').click(function() {
    let result = [];
    $('.sidr-race-item:checked').each(function() {
      result.push($(this).val());
    });
    $('#basic #constraint-race')
      .val(result.join(','))
      .trigger('input');
    $.sidr('close', 'sidr_races');
  });
  
  // 種族選択をキャンセルした時
  $('#sidr_races_close').click(function() {
    $.sidr('close', 'sidr_races');
  });

  // ［基本］タブ内での年齢処理
  $('#basic #constraint-age').sidr({
    name: 'sidr_ages',
    displace: false
  });

  // 年齢選択を確定した時
  $('#sidr_ages_submit').click(function() {
    let result = [];
    $('.sidr-age-item:checked').each(function() {
      result.push($(this).val());
    });
    $('#basic #constraint-age')
      .val(result.join(','))
      .trigger('input');
    $.sidr('close', 'sidr_ages');
  });
  
  // 年齢選択をキャンセルした時
  $('#sidr_ages_close').click(function() {
    $.sidr('close', 'sidr_ages');
  });

  // ［基本］タブ内での性別処理
  $('#basic #constraint-sex').sidr({
    name: 'sidr_sexes',
    displace: false
  });

  // 性別選択を確定した時
  $('#sidr_sexes_submit').click(function() {
    let result = [];
    $('.sidr-sex-item:checked').each(function() {
      result.push($(this).val());
    });
    $('#basic #constraint-sex')
      .val(result.join(','))
      .trigger('input');
    $.sidr('close', 'sidr_sexes');
  });
  
  // 性別選択をキャンセルした時
  $('#sidr_sexes_close').click(function() {
    $.sidr('close', 'sidr_sexes');
  });

  // ファイル選択ボックスココカラ
  // 参照ボタンクリック時にファイル選択ボックスを表示
  $('#basic #bgm-main-ref').click(function(e) {
    $('#basic #bgm-main-file').click();
  });

  // ファイル選択時にテキストボックスに反映
  $('#basic #bgm-main-file').change(function(e) {
    let name = $(this).get(0).files[0].name;
    $('#basic #bgm-main')
      .val(name.substring(0, name.lastIndexOf('.mp3')))
      .trigger('input');
  });

  // 参照ボタンクリック時にファイル選択ボックスを表示
  $('#basic #bgm-happy-ref').click(function(e) {
    $('#basic #bgm-happy-file').click();
  });

  // ファイル選択時にテキストボックスに反映
  $('#basic #bgm-happy-file').change(function(e) {
    let name = $(this).get(0).files[0].name;
    $('#basic #bgm-happy')
      .val(name.substring(0, name.lastIndexOf('.mp3')))
      .trigger('input');
  });
  
  // 参照ボタンクリック時にファイル選択ボックスを表示
  $('#basic #bgm-bad-ref').click(function(e) {
    $('#basic #bgm-bad-file').click();
  });

  // ファイル選択時にテキストボックスに反映
  $('#basic #bgm-bad-file').change(function(e) {
    let name = $(this).get(0).files[0].name;
    $('#basic #bgm-bad')
      .val(name.substring(0, name.lastIndexOf('.mp3')))
      .trigger('input');
  });
  // ファイル選択ボックスココマデ

  // ダイナミックヘルプ（新版）
  $('#basic label, #scene label, .dynamic_help').dblclick(function(e) {
    Util.showHelpDialog($(this).attr('data-help'));
  });

  // ダイナミックヘルプ（関連）
  $('#help-dialog > #related-help').on('click', 'li', function(e) {
    // 戻り先を記録
    related_help.push($(this).attr('data-cur'));
    Util.showHelpDialog($(this).attr('data-rel'));
  });

  // ダイナミックヘルプ（基本情報）
  // $('#basic label').dblclick(function(e) {
  //   //let id = $(this).find('input, select').attr('id').split('-')[1];
  //   let id = $(this).find('input, select').attr('id');
  //   window.open(Common.HELP_URL + id, 'help');
  // });

  // ダイナミックヘルプ（シーン情報）
  // $('#scene label').dblclick(function(e) {
  //   // let id = $(this).find('input, select').attr('id');
  //   let id = $(this).attr('data-help');
  //   window.open(Common.HELP_URL + id, 'help');
  // });

  // ダイナミックヘルプの抑制
  $('#basic label > input, #basic label > select, #scene label > input, #scene label > select').dblclick(function(e) {
    e.stopPropagation();
  });
  
  // 未使用（消さないこと）
  // $('#scene label').tooltip({
  //   items: '[data-help]',
  //   classes: {
  //     'ui-tooltip': 'my-tooltip'
  //   },
  //   content: function() {
  //     return Util.getHelpText(
  //       $(this).attr('data-help')
  //     ); 
  //   }
  // });

  // ダイアログを初期化（ヘルプ）
  $('#help-dialog').dialog({
    autoOpen: false,
    width: 640,
    minHeight: 300,
    maxHeight: 500,
    show: 500,
    hide: 500,
    modal: true,
    position: {
      of : '#flow-area',
      at: 'center top',
      my: 'left top',
    },
    // open: function() {
    // },
    // buttons: {
    //   '閉じる': function() {
    //     $(this).dialog('close');
    //     Util.closeAllSidebar();
    //   }
    // }
  });

  // ダイアログを初期化（設定情報）
  $('#pg-config').dialog({
    autoOpen: false,
    width: 320,
    show: 500,
    hide: 500,
    modal: true,
    position: {
      of : '#flow-area',
      at: 'left top',
      my: 'left top',
    },
    open: function() {
      $('#config-author').val(global_config.author);
      $('#config-disp').val(global_config.disp);
      $('#config-incre').val(global_config.increment);
    },
    buttons: {
      '確定': function() {
        // 設定情報を反映
        global_config.author = $('#config-author').val();
        global_config.disp = $('#config-disp').val();
        global_config.increment = $('#config-incre').val();
        // ボックスにも反映
        $('#ctrl_incre').val(global_config.increment);
        Util.saveConfig(global_config);
        $(this).dialog('close');
      },
      'キャンセル': function() {
        $(this).dialog('close');
      }
    }
  });

  // ダイアログを初期化（シーン生成）
  $('#scene-dialog').dialog({
    autoOpen: false,
    width: 320,
    show: 500,
    hide: 500,
    modal: true,
    position: {
      of : '#flow-area',
      at: 'left top',
      my: 'left top',
    },
    open: function() {
      $('#node-id').val('');
      $('#node-summary').val('');
    }
  });

  // ダイアログを初期化（リンク付きシーン生成）
  $('#scene-dialog-link').dialog({
    autoOpen: false,
    width: 320,
    show: 500,
    hide: 500,
    modal: true,
    position: {
      of : '#flow-area',
      at: 'left top',
      my: 'left top',
    },
    open: function() {
      $('#node-link-id').val(
        Util.nextScene(
          $('#scene-attr #id').val()
        )
      );
      $('#node-link-summary').val('');
      $('#node-link-caption').val('次へ');
    },
    buttons: {
      '追加': function() {
        let from = $('#scene-attr #id').val();
        let id = $('#node-link-id').val();
        if (Util.addNode(
          id,
          $('#node-link-summary').val())) {
          // 成功時にリンクも追加
          $(this).dialog('close');
          // console.log(`${from}->${id}`);
          Util.addLink(from, id, $('#node-link-caption').val());
          Util.createNetwork({ focus_id: from });
          // network.focus(from);
          // network.selectNodes([ from ]);
          //let pos = network.getPosition(from);

        }
      },
      'キャンセル': function() {
        $(this).dialog('close');
      }
    }
  });

  // ダイアログを初期化（シーンid変更）
  $('#scene-change-dialog').dialog({
    autoOpen: false,
    width: 320,
    show: 500,
    hide: 500,
    modal: true,
    position: {
      of : '#flow-area',
      at: 'left top',
      my: 'left top',
    },
    open: function() {
      // 現在のシーンidを設定
      $('#old-id').val($('#scene-attr #id').val());
      $('#new-id').val('');
    },
    buttons: {
      '変更': function() {
        let old_id = $('#old-id').val();
        let new_id = $('#new-id').val();
        // new_idが既存の場合は入れ替え、さもなくば旧idを新idに
        if (Util.isDuplicateScene(new_id)) {
          Util.swapNodeId(old_id, new_id);
          // toastr.error('id値が重複しています。', '不正なid');
          // return;
        } else {
          Util.changeNodeId(old_id, new_id);
        }
        // scenario.scenes.forEach(function(scene) {
        //   if (String(scene.id) === old_id) {
        //     scene.id = new_id;
        //     scene.label = `${new_id}\n${scene.summary}`;
        //   }
        // });
        // scenario.edges.forEach(function(edge) {
        //   if (String(edge.from) === old_id) {
        //     edge.from = new_id;
        //   }
        //   if (String(edge.to) === old_id) {
        //     edge.to = new_id;
        //   }
        // });
        Util.createNetwork({ focus_id: new_id });
        //network.selectNodes([ new_id ]);
        Util.setSceneInfo(new_id);
        $(this).dialog('close');
      },
      'キャンセル': function() {
        $(this).dialog('close');
      }
    }
  });

  // ダイアログを初期化（リンク生成）
  $('#edge-dialog').dialog({
    autoOpen: false,
    width: 320,
    show: 500,
    hide: 500,
    modal: true,
    position: {
      of : '#flow-area',
      at: 'left top',
      my: 'left top',
    },
    open: function() {
      // すべての値を初期化
      $('#from-id').text(
        $('#scene-select #id').val()
      );
      $('#edge-dialog #edge-caption').val('次へ');
      $('#to-id').val('');
      $('#edge-kind').val('');
      $('#edge-add').val('');
      $('#edge-correct').val('');
    },
    buttons: {
      '追加': function() {
        let from = $('#edge-dialog #from-id').text();
        let to = $('#edge-dialog #to-id').val();
        let label = $('#edge-dialog #edge-caption').val();
        if (!label) { label = '次へ'; }
        let kind = $('#edge-dialog #edge-kind').val();
        let add = $('#edge-dialog #edge-add').val();
        let correct = $('#edge-dialog #edge-correct').val();

        // リンク先の必須チェック
        if (!to) {
          toastr.error(`リンク先のidは必須です。`, '不正な値');
          return;  
        }
        // リンク先の存在チェック
        if (Util.isNewScene(to)) {
          toastr.error(`リンク先のidが存在しません。`, '不正な値');
          return;  
        }
        // 追加情報の必須チェック
        if (['R', 'X', 'Q'].includes(kind)) {
          if (!add) {
            toastr.error(`通常以外のリンクでは追加情報は必須です。`, '不正な値');
            return;  
          }
        }
        // テキスト入力の場合のエラーチェック
        if (kind === 'Q' && add.includes(',')) {
          toastr.error(`追加情報には間違い時のリンク先を指定してください。<br>
            正解時のリンク先はid欄に指定します。`, '不正な値');
          return;
        }
        if (kind === 'Q' && !correct) {
          toastr.error(`［テキスト入力］選択時には、正解文字列は必須です。`, '不正な値');
          return;
        }

        // 種別に応じた処理（特殊リンクはページに一つを前提にorderは種別ごと固定）        
        Util.addLink(from, to, label, kind, add, correct);
        Util.createNetwork({ focus_id: from });
        // network.selectNodes([ from ]);
        Util.setSceneInfo(from);
        $(this).dialog('close');
      },
      'キャンセル': function() {
        $(this).dialog('close');
      },
    }
  });

  $('#edge-dialog #edge-kind').change(function() {
    let v = $(this).val();
    $('#edge-dialog #edge-add').attr('placeholder', function() {
      if (v === '') {
        return '';
      } else if (v === 'R' || v === 'X') {
        return '他のリンク先（カンマ区切り）';
      } else if (v === 'Q') {
        return '間違いの時のリンク先';
      }
    });
  });

  // ダイアログを初期化（範囲指定）
  $('#range-dialog').dialog({
    autoOpen: false,
    width: 400,
    show: 500,
    hide: 500,
    modal: true,
    position: {
      of : '#flow-area',
      at: 'left top',
      my: 'left top',
    },
    buttons: {
      '絞り込み': function() {
        Util.createNetwork({ fit: true });
        //network.fit();
        $(this).dialog('close');
      },
      'キャンセル': function() {
        $(this).dialog('close');
      }
    },
    open: function() {
      // 初期化
    }
  });

  // ダイアログを初期化（EPUB）
  $('#epub-dialog').dialog({
    autoOpen: false,
    width: 650,
    show: 500,
    hide: 500,
    modal: true,
    position: {
      of : '#flow-area',
      at: 'left top',
      my: 'left top',
    },
    buttons: {
      'エクスポート': function() {
        Util.download(Util.createEpub(), 'scenario.txt');
        $(this).dialog('close');
      },
      'キャンセル': function() {
        $(this).dialog('close');
      }
    }
  });

  // ダイアログを初期化（シナリオ投稿）
  $('#upload-dialog').dialog({
    autoOpen: false,
    width: 800,
    show: 500,
    hide: 500,
    modal: true,
    buttons: {
      '投稿': function() {
        let key = localStorage.getItem('pgflow_key');
        if (!key) {
          key = new Date().getTime().toString(16);
          localStorage.setItem('pgflow_key', key);
        }
        let p = {
          email: $('#upload-email').val(),
          tag: $('#upload-tag').val(),
          level: $('#upload-level').val(),
          intro: $('#upload-intro').val(),
          comment: $('#upload-comment').val(),
          ftp: $('#upload-ftp').prop('checked') ? $('#upload-ftp').val() : '',
        };
        localStorage.setItem('pgflow_post', JSON.stringify(p));
        // アップロードデータの準備
        let data = new FormData();
        data.append('key', key);
        data.append('email', p.email);
        data.append('tag', p.tag);
        data.append('level', p.level);
        data.append('intro', p.intro);
        data.append('comment', p.comment);
        data.append('ftp', p.ftp);
        data.append('scenario',
          new Blob([ Util.createXml() ], { type: "text/xml"}),
          'scenario.xml'
        );
        let bgms = $('#upload-bgms').get(0).files;
        let ses = $('#upload-ses').get(0).files;
        let pics = $('#upload-pics').get(0).files;
        for (let i = 0; i < bgms.length; i++) { data.append('bgms[]', bgms[i]); }
        for (let i = 0; i < ses.length; i++)  { data.append('ses[]',  ses[i]); }
        for (let i = 0; i < pics.length; i++) { data.append('pics[]', pics[i]); }

        // アップロード処理
        try {
          fetch('upload.php', {
            method: 'POST',
            redirect: 'follow',

            body: data
          })
          .then(function(res){
            if (res.ok) {
              window.alert('投稿に成功しました。');
            } else {
              window.alert('投稿に失敗しました。\nファイルの合計サイズが上限（8mb）を超過していないかなど、ご確認ください。');
            }
          });
        } catch(e) {
          console.log(e);
        }
        $(this).dialog('close');
      },
      'キャンセル': function() {
        $(this).dialog('close');
      }
    },
    open: function() {
      let p = JSON.parse(localStorage.getItem('pgflow_post'));
      if(p) {
        $('#upload-email').val(p.email);
        $('#upload-tag').val(p.tag);
        $('#upload-level').val(p.level);
        $('#upload-intro').val(p.intro);
        $('#upload-comment').val(p.comment);        
        if (p.ftp) {
          $('#upload-ftp').prop('checked', true);
        }
      }
    }
  });
  // ［投稿］ダイアログのツールヒントを有効化
  $('#upload-dialog label').tooltip();

  // ［投稿］ボタンでダイアログを開く
  $('#ctrl_post').click(function() {
    $('#upload-dialog').dialog('open');
  });

  // ［シーン］タブ内での更新
  $('#scene-select input:not(.no-update), #scene-select select:not(.no-update)').on('input', function(e) {
    let id = $('#scene-select #id').val();
    // console.log(`scene_input ${id}`);
    if (id) {
      let scene = Util.getSceneById(id);
      scene[e.target.id] = $(this).val();
      if (e.target.id === 'summary') {
        scene.label = scene.id + ':\n' + scene.summary;
        // Util.createNetwork({
        //   focus_id: scene.id,
        //   level: false
        // });
        // network.selectNodes([ scene.id ]);
      } else if (e.target.id === 'exclude') {
        if(!$(this).prop('checked')) {
          scene[e.target.id] = undefined;
        }
      } else if (e.target.id === 'fixed') {
        if(!$(this).prop('checked')) {
          scene[e.target.id] = undefined;
        }
      } else if (e.target.id === 'end') {
        // end属性にグループ付与
        Util.setGroupByEnd($(this).val(), scene);
        Util.createNetwork({
          focus_id: scene.id,
          level: false
        });
        //network.selectNodes([ scene.id ]);
      } else if (e.target.id === 'color') {
        if (!scene[e.target.id]) {
          delete scene[e.target.id];
        }
        Util.createNetwork({
          focus_id: scene.id,
          level: false
        });
      }
    }
  });

  // ［サマリー］欄更新時に再描画
  $('#scene-select input#summary').on('change', function(e) {
    let id = $('#scene-select #id').val();
    if (id) {
      let scene = Util.getSceneById(id);
      Util.createNetwork({
        focus_id: scene.id,
        level: false
      });
      network.selectNodes([ scene.id ]);
    }
  });

  // ［シーン］タブ内でのアイテム処理
  Util.createSelectSidebar(
    '#scene-select #items',
    'items',
    'items',
    //scenario.items,
    'plus_minus',
    'name',
    'id'
  );

  // ［シーン］タブ内でのフラグ処理
  Util.createSelectSidebar(
    '#scene-select #flags',
    'flags',
    'flags',
    //scenario.flags,
    'plus_minus',
    'text',
    'id'
  );

  // ［シーン］タブ内でのparam処理
  Util.createSelectSidebar(
    '#scene-select #params',
    'params',
    'params',
    //scenario.flags,
    'inputs',
    'text',
    'id'
  );
    
  // ［シーン］タブ内での敵処理
  Util.createSelectSidebar(
    '#scene-select #enemies',
    'enemies',
    'enemies',
    //scenario.enemies,
    'check',
    'name',
    'id'
  );
    
  // ［シーン］タブ内での実績処理
  Util.createSelectSidebar(
    '#scene-select #result',
    'results',
    'results',
    //scenario.results,
    'radio',
    'name',
    'id'
  );

  // ［シーン］タブ内でのソートリンク処理
  Util.createSelectSidebarForDataset(
    '#scene-select #scene-sortlink',
    'sorts',
    function() {
      return Util.createSortLinkList(
        $('#scene-attr #id').val()
      );
    },
    'sort',
    'label',
    'id',
    function(result, trigger, s_list) {
      let order = 1;
      let sorted = $(s_list).sortable('toArray');
      // リスト内の順序を元にorder属性を振りなおし
      for (let id of sorted) {
        let edge = Util.getEdgeById(id);
        edge.order = order;
        order++;
      }
    }
  );

  // ［シーン］タブ内での次シナ処理
  // Util.createSelectSidebarForDataset(
  //   '#scene-select #nexts',
  //   'results',
  //   [],
  //   'check',
  //   'title',
  //   'id'
  // );

  // 参照ボタンクリック時にファイル選択ボックスを表示
  $('#scene-select #bgm-ref').click(function(e) {
    $('#scene-select #bgm-file').click();
  });

  // ファイル選択時にテキストボックスに反映
  $('#scene-select #bgm-file').change(function(e) {
    let name = $(this).get(0).files[0].name;
    $('#scene-select #bgm')
      .val(name.substring(0, name.lastIndexOf('.mp3')))
      .trigger('input');
  });

  // 参照ボタンクリック時にファイル選択ボックスを表示
  $('#scene-select #se-ref').click(function(e) {
    $('#scene-select #se-file').click();
  });

  // ファイル選択時にテキストボックスに反映
  $('#scene-select #se-file').change(function(e) {
    let name = $(this).get(0).files[0].name;
    $('#scene-select #se')
      .val(name.substring(0, name.lastIndexOf('.mp3')))
      .trigger('input');
  });
  
  // カーソル移動時に候補リストをクローズ
  $('#scene-select input').blur(function() {
    $('#scene-select #dice, #scene-select #hp, #scene-select #mp, #scene-select #stars, #scene-select #str, #scene-select #int, #scene-select #dex, #scene-select #krm, #scene-select #free1, #scene-select #free2, #scene-select #free3').autocomplete('close');
  });

  $('#scene-select #dice')
  .autocomplete({
    minLength: 0,
    source: [ '6:2', 'high:3' ],
    close: function(e, ui) {
      $(this).trigger('input');
    }
  });

  // hp／mp属性のオートコンプリート
  $('#scene-select #hp, #scene-select #mp')
  .autocomplete({
    minLength: 0,
    source: [ '1', '-5..-1', 'full' ],
    close: function(e, ui) {
      $(this).trigger('input');
    }
  });

  // stars属性のオートコンプリート
  $('#scene-select #stars')
  .autocomplete({
    minLength: 0,
    source: [ '0,0,0,0,0,0,0', 'divN' ],
    close: function(e, ui) {
      $(this).trigger('input');
    }
  });

  // str～krm属性のオートコンプリート
  $('#scene-select #str, #scene-select #int, #scene-select #dex, #scene-select #krm').autocomplete({
    minLength: 0,
    source: [ '1', '@5' ],
    close: function(e, ui) {
      $(this).trigger('input');
    }
  });

  // free1～3属性のオートコンプリート
  $('#scene-select #free1, #scene-select #free2, #scene-select #free3').autocomplete({
    minLength: 0,
    source: [ '1', '-5..-1', '@5' ],
    close: function(e, ui) {
      $(this).trigger('input');
    }
  });

  $('#scene-select #hp_max, #scene-select #mp_max, #scene-select #str_max, #scene-select #int_max, #scene-select #dex_max, #scene-select #krm_max').autocomplete({
    minLength: 0,
    source: [ '1', '1..5' ],
    close: function(e, ui) {
      $(this).trigger('input');
    }
  });

  // ブラウザー標準のオートコンプリートを無効化＆フォーカス時に表示
  $('.ac')
  // address-level4はブラウザーが認識するが、補完しないであろう値
  .attr('autocomplete', 'address-level4')
  .focus(function() {
    $(this).autocomplete('search', '');
  });
  
  // ［シーン］タブ内でのエッジ選択
  $('#scene-select #edges-list').on('change', function(e) {
    network.selectEdges([ $(this).val() ]);
    Util.setEdgeInfo($(this).val());
  });

  // ［リンク］タブ内のfrom選択
  Util.createSelectSidebar(
    '#edge #from',
    'fscene',
    'scenes',
    //scenario.scenes,
    'radio',
    'label',
    'id'
  );

  // ［リンク］タブ内のto選択
  Util.createSelectSidebar(
    '#edge #to',
    'tscene',
    'scenes',
    //scenario.scenes,
    'radio',
    'label',
    'id'
  );

  // ［リンク］タブ内での更新
  $('#edge input, #edge select').on('input', function(e) {
    let id = $('#edge #id').val();
    let edge = Util.getEdgeById(id);
    if (id) {      
      edge[e.target.id] = $(this).val();
    }
    // let coords = network.getViewPosition();
    // if (['from', 'to', 'label'].includes(e.target.id)) {
    //   if (e.target.id === 'label') {
    //     Util.createNetwork({ 
    //       level: false
    //     });
    //   } else {
    //     Util.createNetwork();
    //   }     
    //   network.selectEdges([ id ]);
    //   network.moveTo({ position: coords });

      // let coords = network.getPositions([edge.from, edge.to]);
      // network.moveTo({
      //   position: {
      //     x: coords[edge.from].x + coords[edge.to].x / 2,
      //     y: coords[edge.from].y + coords[edge.to].y / 2
      //   }
      // });
    // }
    //console.log('edge_input');
  });

  // from/to、ラベル更新時に再描画
  $('#edge #from, #edge #to, #edge #label').on('change', function(e) {
    let id = $('#edge #id').val();
    let coords = network.getViewPosition();
    if (e.target.id === 'label') {
      Util.createNetwork({ 
        level: false
      });
    } else {
      Util.createNetwork();
    }     
    network.selectEdges([ id ]);
    network.moveTo({ position: coords });
  });

  // サイドバーの実績欄、次シナ入力のサイドバーを生成  
  $.get('../stext/stext.xml').done(function(data) {
    let tmp_scenario_set = [];
    $('scenario > work', data).each(function() {
      $('#sidr_links_result_s').append(
        $('<option></option>').
          attr('value', $(this).attr('id')).
          text($(this).attr('title'))
      );
      tmp_scenario_set.push(
        {
          id: $(this).attr('id'),
          title: $(this).attr('title')
        }
      );  
    });
    // ［シーン］タブ内での次シナ処理
    Util.createSelectSidebarForDataset(
      '#scene-select #nexts',
      'nexts',
      tmp_scenario_set,
      'check',
      'title',
      'id'
    );
  });
  // 実績（シナリオ）選択時に実績一覧を取得
  $('#sidr_links_result_s').change(function(e) {
    $.get(`../stext/${$(this).val()}/scenario.xml`).done(function(data) {
      $('#sidr_links_result').empty()
        .append('<option>実績を選択</option>');
      $('results > result', data).each(function() { 
        $('#sidr_links_result').append(
          $('<option></option>').
            attr('value', $(this).attr('id') + ':' + $('#sidr_links_result_s').val()).
            text($(this).attr('name'))
        );
      });
    });
  });

  // ［リンク］タブ内での条件式処理
  $('#edge #condition').sidr({
    name: 'sidr_links',
    displace: false,
    onOpen: function() {
      $('#sidr_links_cond').val('');
      // アイテム欄を生成
      $('#sidr_links_item').empty()
        .append('<option>アイテムを選択</option>');
      for(let item of scenario.items) {
        $('#sidr_links_item').append(`<option value="${item.id}">${item.name}</option>`);
      }
      // フラグ欄を生成
      $('#sidr_links_flag').empty()
        .append('<option>フラグを選択</option>');
      for(let flag of scenario.flags) {
        $('#sidr_links_flag').append(`<option value="${flag.id}">${flag.text}</option>`);
      }
      // 内部パラ欄を生成
      $('#sidr_links_param').empty()
        .append('<option>パラメーターを選択</option>');
      for(let param of scenario.params) {
        $('#sidr_links_param').append(`<option value="${param.id}:99">${param.text}</option>`);
      }
    }
  });

  // 条件式シートの選択ボックスの選択をテキストエリアに反映
  $('#sidr_links_list select:not(.no-update)').change(function() {
    // console.log('BG');
    let cond = $('#sidr_links_cond');
    cond.val(cond.val() + $(this).val());
  });

  // 条件式シートのボタンの選択をテキストエリアに反映
  $('#sidr_links button').click(function() {
    let cond = $('#sidr_links_cond');
    cond.val(cond.val() + $(this).val());
  });

  // 条件式編集を確定した時
  $('#sidr_links_submit').click(function() {
    $('#edge #condition')
      .val($('#sidr_links_cond').val())
      .trigger('input');
    $.sidr('close', 'sidr_links');
  });

  // 条件式編集をキャンセルした時
  $('#sidr_links_close').click(function() {
    $.sidr('close', 'sidr_links');
  });

  // SlickGridの初期化
  Util.createAllGrid();

  // エディターの生成
  let editor = ace.edit('scene-editor');
  ace.config.loadModule('ace/ext/language_tools', function(lang) {
    editor.completers = [lang.snippetCompleter];
    // delete lang.textCompleter;
    // delete lang.keyWordCompleter;
    editor.setOptions({
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: true
    });
    const snippetManager = ace.require('ace/snippets').snippetManager;
    const config = ace.require('ace/config');
    ace.config.loadModule('ace/snippets/markdown', function(m) {
      if (m) {
        snippetManager.files.markdown = m;
        //m.snippets = snippetManager.parseSnippetFile(m.snippetText);
        //m.snippets.splice(0);
        let s_list = [
          { title: 'image', body: '![${1:text}](${2:file})' },
          { title: 'title', body: '\\${title}' },
          { title: 'name', body: '\\${name}' },
          { title: 'job', body: '\\${job}' },
          { title: 'hp', body: '\\${hp}' },
          { title: 'mp', body: '\\${mp}' },
          { title: 'str', body: '\\${str}' },
          { title: 'int', body: '\\${int}' },
          { title: 'dex', body: '\\${dex}' },
          { title: 'krm', body: '\\${krm}' },
          { title: 'free1', body: '\\${free1}' },
          { title: 'free2', body: '\\${free2}' },
          { title: 'free3', body: '\\${free3}' },
          { title: 'race', body: '\\${race?${1:fighter}:${2:wizard}:${3:dwarf}:${4:elf}}' },
          { title: 'sex', body: '\\${sex?${1:male}:${2:female}}' },
          { title: 'state', body: '\\${state?${1:normal}:${2:poison}:${3:frozen}:${4:stone}:${5:forget}}' },
          { title: 'age', body: '\\${age?${1:young}:${2:adult}:${3:old}}' },
          { title: 'rand', body: '\\${rand?${1:min}:${2:max}}' },
          { title: 'msg', body: '\\${msg?${1:arg1}:${2:arg2}:...}' },
          { title: 'enemy:name', body: '\\${var?m${1:id}:name}' },
          { title: 'enemy:element', body: '\\${var?m${1:id}:element}' },
          { title: 'enemy:text', body: '\\${var?m${1:id}:text}' },
          { title: 'result:name', body: '\\${var?r${1:id}:name}' },
          { title: 'result:level', body: '\\${var?r${1:id}:level}' },
          { title: 'result:text', body: '\\${var?r${1:id}:text}' },
          { title: 'param:text', body: '\\${var?p${1:id}:text}' },
          { title: 'param:value', body: '\\${var?p${1:id}:value}' },
          { title: 'result:count', body: '\\${result?${1:id}}' },
          { title: 'result:rate', body: '\\${result_rate?${1:id}}' },
          { title: 'import', body: '\\${import ${1:id}}' },
          { title: 'input', body: '\\${input?${1:init}}' },
          { title: 'if', body: '\\${if ${1:condition}}${2:body}\\${/if}' },
          { title: 'effect', body: '\\${effect ${1:type}}${2:body}\\${/effect}' },
          { title: 'ruby', body: '\\${${1:word}|${2:ruby}}' },
          { title: 'blue', body: '%blue%${1:body}%/%' },
          { title: 'red', body: '%red%${1:body}%/%' },
          { title: 'purple', body: '%purple%${1:body}%/%' },
          { title: 'white', body: '%white%${1:body}%/%' },
          { title: 'tweet', body: '\\${tweet}${1:body}\\${/tweet}' },
        ];
        m.snippets = [];
        for (let item of s_list) {
          m.snippets.push(
            {
                content: item.body,
                name: item.title,
                tabTrigger: item.title
            }
          );
        }
        snippetManager.register(m.snippets, m.scope);
      }
    });
  });
  editor.$blockScrolling = Infinity;
  // editor.setOptions({
    // enableBasicAutocompletion: true,
    // enableSnippets: true,
    // enableLiveAutocompletion: true
  // });
  editor.getSession().setUseWrapMode(true);
  editor.setTheme('ace/theme/chrome');
  editor.session.setMode('ace/mode/markdown');

  // エディター内の反映
  editor.on('input', function(e) {
    let id = $('#scene-select #id').val();
    if (id) {
      let scene = Util.getSceneById(id);
      scene.text = editor.getValue();
    }
  });

  // エディター領域の拡張
  $('#scene #scene-ext').click(function(e) {
    let sa = $('#scene-attr');
    let se = $('#scene-editor');
    if (se.hasClass('editor-big')) {
      $(this).text('エディター領域を拡げる');
      sa.show();
      se.removeClass('editor-big')
        .css('height', '210px');
      editor.resize(true);
    } else {
      $(this).text('エディター領域を狭める');
      sa.hide();
      se.addClass('editor-big')
        .css('height', '630px');
      editor.resize(true);
    }
  });

  // 現在のノードを削除
  $('#scene #scene-delscene, #ctx-scene-remove').click(function() {
    if (!confirm('この操作は元には戻せません！\n現在のシーンを削除しても構いませんか？')) {
      return;
    }
    let id = $('#scene-attr #id').val();
    Util.deleteScene(id);
    Util.createNetwork();
    $('#chart-menu').css('display', 'none');
  });

  // リンク選択ボックスを生成
  $('#scene #edges-list').focus(function(e) {
    let id = $('#scene-attr #id').val();
    Util.createLinkList(id);
  });

  // リンク追加ダイアログ
  $('#scene #scene-addedge, #chart-menu #ctx-edge-add').click(function(e) {
    $('#edge-dialog').dialog('open');
    $('#chart-menu').css('display', 'none');
  });

  // シーン追加ダイアログ
  $('#scene #scene-addscene, #chart-menu #ctx-scene-add').click(function(e) {
    $('#scene-dialog-link').dialog('open');
    $('#chart-menu').css('display', 'none');
  });

  // シーン変更ダイアログ
  $('#scene #scene-changescene').click(function(e) {
    if ($('#scene-select #id').val() === '0') {
      toastr.error('Scene 0は変更できません。', '変更不可');
      return;
    }
    $('#scene-change-dialog').dialog('open');
  });

  // カラーリストを生成
  Util.createColorList('#scene #color');

  // リンク追加ダイアログ内でのシーン選択
  Util.createSelectSidebar(
    '#edge-dialog #to-id',
    'scene',
    'scenes',
    //scenario.scenes,
    'radio',
    'label',
    'id'
  );

  // リンク追加ダイアログ内でのシーン選択
  Util.createSelectSidebar(
    '#edge-dialog #edge-add',
    'scenes',
    'scenes',
    //scenario.scenes,
    'check',
    'label',
    'id'
  );

  // 現在のリンクを削除
  $('#edge #edge-deledge').click(function() {
    if (!confirm('この操作は元には戻せません！\n現在のリンクを削除しても構いませんか？')) {
      return;
    }
    let id = $('#edge #id').val();
    Util.deleteLink(id);
    Util.createNetwork();
  });

  // タブの生成
  $('#edit-area')
    .tabs()
    .tabs({
      activate: function(e, ui) {
        let keys = Object.keys(grid);
        for(let key of keys) {
          grid[key].navigateNext();
        }
        // グリッドを再ソート
        if (isUpdatedInGrid) {
          Util.sortScenario();
          Util.createAllGrid();
          isUpdatedInGrid = false;
        }
        // すべてのサイドバーをクローズ
        Util.closeAllSidebar();
      }
    });
  Util.disableTab();

  // タグ入力ボックス（保留）
  //$('.tagsin').tagsInput();

  // コントロールパネル
  // ［テスト実行］ボタン
  $('#ctrl_run').click(function(e) {
    localStorage.setItem(Common.RUN_NAME, Util.createXml());
    // 本番環境／テスト環境の振り分け
    if (location.host.indexOf('web-deli.com') === -1) {
      window.open('../index.html?id=pg2', Common.RUN_NAME);
    } else {
      window.open('../game.aspx?id=pg2', Common.RUN_NAME);
    }
  });

  // ［タグ追加］ボタン
  $('#ctrl_tag').click(function(e) {
    $('#tag-menu').css({
      display: 'block',
      top: e.pageY,
      left: e.pageX
    });
  });

  // ［タグ追加］ボタン（コンテキストメニュー）
  $('#tag-menu li').click(function(e) {
    var command = {
      'red': '%red%$0%/%',
      'blue': '%blue%$0%/%',
      'white': '%white%$0%/%',
      'if': '${if condition}$0${/if}',
      '*import': '${import 99999}',
      'effect': '${effect type}$0${/effect}',
      '*input': '${input?0}',
      'ruby': '${$0|ruby}',
      '*title': '${title}',
      '*name': '${name}',
      '*race': '${race?FIG:WIZ:DWA:ELF}',
      '*sex': '${sex?M:F}',
      '*state': '${state?NOR:POI:FRO:STO:FOR}',
      '*age': '${age?Y:A:O}',
      '*var': '${var?key:prop}',
      '*random': '${rand?min:max}',
      '*msg': '${msg?str1:str2:...}',
      'tweet': '${tweet}%0%${/tweet}',
      '*capture': '![caption](path)',
    };
    let comm = command[$(this).data('command')];
    if (comm.startsWith('*')) {
      editor.insert(comm);
    } else {
      editor.insert(comm.replace('$0', editor.getCopyText()));
    }
    editor.focus();
    $('#tag-menu').css('display', 'none');
  });

  // ［ダウンロード］ボタン
  $('#ctrl_dl').click(function(e){
    $('#dl-menu').css({
      display: 'block',
      top: e.pageY,
      left: e.pageX
    });
  });

  // ［ダウンロード］ボタン（コンテキストメニュー）
  $('#dl-menu li').click(function(e) {
    // ★フロチャ調整用★
    // 現在位置を記録
    // scenario.scenes.forEach(function(scene) {
    //   let pos = network.getPositions(scene.id)[scene.id];
    //   scene.x = pos.x;
    //   scene.y = pos.y;
    // });
    switch($(this).data('command')) {
      case 'json':
        // ★フロチャ調整用★
        // 現在位置を破棄（固定位置用）
        scenario.scenes.forEach(function(scene) {
          delete scene.x;
          delete scene.y;
        });
        Util.download(vkbeautify.json(JSON.stringify(scenario)), 'stext.json');  
        break;
      case 'xml':
        Util.download(Util.createXml(), 'scenario.xml');
        break;
      case 'html':
        Util.download(Util.createHtml(), 'scenario.html');
        break;
      case 'epub':
        $('#epub-dialog').dialog('open');
        // Util.download(Util.createEpub(), 'scenario.txt');
        // toastr.info(`.txt形式は<a href="https://conv.denshochan.com/" target="help">でんでんコンバーター</a>向けのフォーマットです。本ファイルをでんでんコンバーターにかけることでEPUBファイルを生成できます。<br>変換時に使用できるスタイルシート／設定ファイルは<a href="./template/denden.zip" target="help">こちらからダウンロード</a>できます。`, '.txt形式について');
        break;
      case 'storage':
        window.alert('データをブラウザーに保存しました。\n保存済みのデータは［マイストレージ］テンプレートからロードできます。');
        localStorage.setItem(Common.MY_STORAGE, JSON.stringify(scenario));
        break;
      default:
        console.log('Unknown Error!!');
    }
    $('#dl-menu').css('display', 'none');
  });

  // ［ヘルプ］ボタン
  $('#ctrl_help').click(function(e) {
    $('#help-menu').css({
      display: 'block',
      top: e.pageY,
      left: e.pageX
    });
  });

  // ［フィルター］ボタン（新）
  Util.createSelectSidebar(
    '#ctrl_filter',
    'groups',
    'groups',
    // [
    //   {
    //     start: 0,
    //     end: 99999,
    //     title: 'フィルター解除'
    //   }
    // ].concat(scenario.groups),
    'check',
    function(obj) {
      return `${obj['title']}<br />（${obj['start']}－${obj['end']}）`;
    },
    function(obj) {
      return `${obj['start']}-${obj['end']}`;
    },
    function(result) {
      filter_where = [];
      // 条件式を分解
      for (let cond of result.split(',')) {
        if (!cond) { break; }
        let tmp_cond = cond.split('-');
        filter_where.push({
          start: tmp_cond[0],
          end: tmp_cond[1]
        });
      }
      // デバッグ用
      // sessionStorage.setItem('flow_filter',
      //   JSON.stringify(filter_where));
      Util.createNetwork({ fit: true });
    }
  );

  // シャッフル
  $('#ctrl_shuffle').click(function() {
    if (!confirm('全シーンidをシャッフルします。\nこの操作は元に戻せませんが、続けますか？')) {
      return;
    }
    let s = new StextShuffle(scenario);
    s.run();
    Util.refreshScenario(s.scenario);
    Util.sortScenes();
    // scenario = JSON.parse(JSON.stringify(s.scenario));
    Util.createNetwork({ fit: true });
    Util.disableTab();
    // localStorage.setItem(Common.MY_STORAGE, JSON.stringify(s.scenario));
    // console.log(s.scenario);
  });

  // 設定ダイアログ
  $('#ctrl_config').click(function() {
    $('#pg-config').dialog('open');
  });

  // テンプレート選択
  $('#ctrl_template').change(function(e) {
    var selected = $(this).val();
    if (selected === 'storage') {
      var save = localStorage.getItem(Common.MY_STORAGE);
      if (save) {
        sessionStorage.setItem(Common.LOAD_NAME, save);
        location.reload();
      } else {
        window.alert('セーブデータは存在しません。');
      }
    } else {
      if (selected) {
        let path;
        // @付きはscenario.xmlを取得
        if (selected.startsWith('@')) {
          path = `../stext/${selected.substring(1)}/scenario.xml`;
        } else {
          path = `./template/${selected}`;
        }

        //$.ajax('./template/' + selected, {
        $.ajax(path, {
          dataType: 'text'
        }).done(function(data) {
          // @付きはxmlからの変換
          if (selected.startsWith('@')) {
            data = Util.createJson(data);
          }
          sessionStorage.setItem(Common.LOAD_NAME, data);
          location.reload();
        });
      }
    }
  });

  // ［インポート］ボタンで選択ボックスを表示
  $('#ctrl_import').click(function(e) {
    $('#ctrl_load').click();
  });

  // ファイルをPlaygroundにロード
  $('#ctrl_load').change(function(e) {
    let inputs = $(this).get(0).files;
    let name = inputs[0].name;
    let reader = new FileReader();
    $(reader).on('load', function() {
      // .json or .xml
      if (name.endsWith('.json')) {
        sessionStorage.setItem(Common.LOAD_NAME, reader.result);
      } else {
        sessionStorage.setItem(Common.LOAD_NAME, Util.createJson(reader.result));
      }
      location.reload();
    });
    reader.readAsText(inputs[0], 'UTF-8');
  });

  // シーン選択ボックス クリック時に最新情報に更新
  $('#ctrl_scene').mousedown(function(e) {
    $('#ctrl_scene').empty();
    $('<option></option>')
      .attr('value', '')
      .text('編集するシーンを選択')
      .appendTo('#ctrl_scene');
    for (let scene of scenario.scenes) {
      label = scene.label;
      if (scene.id == 0 || scene.end) {
        label = '★' + label;
      }
      $('<option></option>')
        .attr('value', scene.id)
        .text(label)
        .appendTo('#ctrl_scene');
    }
  });

  // シーン選択ボックス 選択時にシーン移動
  $('#ctrl_scene').change(function(e) {
    let id = $(this).val();
    Util.setSceneInfo(id);
    network.selectNodes([ id ]);
  });
  
  // 簡易シーン追加（β版）
  $('#ctrl_addscene').click(function(e) {
    //let pos = network.getViewPosition();
    // let incre = Number($('#ctrl_incre').val());
    let incre = Number(global_config.increment); 
    if (!incre || incre < 1) { incre = 1; }
    incre = Math.floor(incre);
    let new_id = Number(Util.maxSceneId()) + incre;
    scenario.scenes.push(
      {
        id: String(new_id),
        summary: 'New',
        label: `${new_id}:\nNew`,
        text: '',
      }
    );
    Util.createNetwork();
  });
    
  // コンテキストメニューの削除
  $(':not(.cxt)').click(function(e) {
    if (e.target.id !== 'ctrl_dl') {
      $('#dl-menu').css('display', 'none');
    }
    if (e.target.id !== 'ctrl_help') {
      $('#help-menu').css('display', 'none');
    }
    if (e.target.id !== 'ctrl_tag') {
      $('#tag-menu').css('display', 'none');
    }
    if (e.target.id !== 'chart-menu') {
      $('#chart-menu').css('display', 'none');
    }
  });

  let is_active = true;
  // Editorへの遷移
  $('#ctrl_flow2editor').click(function(){
    is_active = false;
    toastr.clear();
    toastr.options = {
      positionClass: 'toast-bottom-full-width',
      closeButton: false,
      timeOut: 0,
      extendedTimeOut: 0
    };
    toastr.error('PgEditorにて編集中です。PgFlowに戻るには、PgEditorの［PgFlowで編集］ボタンを押してください。',
      'Playground Editorで編集中');
    $('body').css('opacity', 0.2);

    localStorage['flow2editor'] = Util.createXml();
    window.open('./editor.html', 'pgeditor');
  });

  // ページ移動時の警告
  $(window).on('beforeunload', function(){
      if (is_active) {
        return "ページを閉じてもよろしいですか？";
      }
  });

  // TIPS表示
  let tips = [
    'フローチャート上では、プロローグ／エピローグ（happy/bad）を表すシーンが色で区別されています。目的のシーンを探す手掛かりになるでしょう。',
    'フローチャート上では、シーン単位にカラーリングが可能です。下書き、重要なフラグのあるシーンなどをマーキングしておくと良いでしょう。',
    'フローチャートで目的のシーンが探しにくい場合には、右上のシーン選択ボックスを利用してみましょう。シーンid順に表示されています。',
    'フローチャートやシーン選択ボックス上では、サマリーテキストが表示されます。シーンごとにできるだけ判りやすい名前を付けましょう。',
    'シーン選択ボックス上では、プロローグとエピローグが★でマーキングされています。目的のシーンを探す手掛かりになるでしょう。',
    'フローチャート上のリンクが見難い場合には、［シーン］タブからリンク選択ボックスを利用してみましょう。',
    'Playgroundのデータは、.json形式（Playgroundの内部形式）、.xml形式（STextの実行形式）などで保存できます。',
    'Playgroundのデータは、.txt形式（でんでんコンバーター向け）にも出力できます。EPUB形式の電子書籍も手軽に作成が可能です。',
    'scenario.xml（STextの実行形式）を.json形式（Playgroundの内部形式）に変換することも可能です。既存のシナリオをPlayground Flowにインポートして、どんどん動作確認してみましょう。',
    'Playgroundでは、.html形式での出力もできます。条件分岐、音楽機能などは利用できなくなりますが、Kindle配信などしている人にも利用して戴けると嬉しいです。',
    '.json形式（Playgroundの内部形式）のファイルは、Playground上部のファイル選択ボタンからインポート＆編集できます。',
    'Playground Flowでは、個々のシーンをNode、リンクをEdgeと呼びます。',
    'シーンを跨ってテキストを一括置換したい場合には、Playground Editorに切り替えると良いでしょう。［Ctrl］＋［H］でテキストの一括置き換えが可能です（正規表現にも対応）。',
    '［PgEditorで編集］ボタンを押すことで現在編集中のシナリオをPlayground Editorで編集できます。',
    '［シーン］タブからはもシーンを追加できます。その場合、現在のシーンからのリンクも自動生成されるので、積極的に利用していきましょう。',
    'フォーム上のラベルをダブルクリックすることで、該当する項目のヘルプページを表示できます。',
    'アイテム／フラグ編集のグリッドからタイトル行をダブルクリックすることで、該当する項目のヘルプページを表示できます。',
    'フィルター機能を利用することで、フローチャートに表示するシーン範囲を限定し、大きなシナリオでも見やすく表示できます。',
    '［シンプルサンプル］は、5Sceneの中にも、戦闘、フラグ、アイテム、実績、エンディングなどの基本機能を備えています。STextの基礎を見渡すのに便利です。',
    '［20Sceneサンプル］は、単方向で分岐と移動の枠組みだけを備えたサンプルです。20Sceneあるので、簡単な物語ならば、テキストを追加するだけでシナリオができてしまいます。',
    '［実践サンプル］は、実際に公開されているシナをテンプレートとして公開したものです。実際の物語がどんなしくみで実装されているのかを確認してみてください。',
    '［機能テスト］は、STextの動作確認のためのテンプレート。リンク関係など判りにくい動作例を載せています。',
    '［セーブ］ボタンではブラウザーに一時的にデータを保存できます。保存したデータは［マイストレージ］テンプレートから取り出せますよ。',
    'Playground Flowは現在β版です。バグかなと思ったら、Twitter（@yy7512）までお知らせください。',
    'Playground Flowは現在β版です。こんな機能あったらいいなと思ったら、Twitter（@yy7512）までお気軽にお寄せください。',
    'Playground Flowは現在β版です。ご利用に際しては、データのバックアップ／保存を小まめに行うようにしてください。',
    'アイテム／フラグなどの項目はid値について昇順で自動ソートされます。番号の大小が乱れた時は一度開き直すと良いでしょう。',
    'シーンはフローチャートとからだけでなく、右上の選択ボックスからも選べます。プロローグ／エンディングには★が付いているので、探す時の手懸りにどうぞ。',
    'シーンテキストを編集するエディターには様々なショートカットが用意されています。詳しくはヘルプを参照してください。',
    '［シーン］タブから［アイテム］［フラグ］［敵］［実績］欄にフォーカスすると、サイドバーが開いて、設定済みの情報を選択できます。',
    '［シーン］タブから［HP］～［FREE3］欄にフォーカスすると、入力可能なオプションがリスト表示されます。',
    '複数のリンクを順序決めしたい場合、［シーン］タブの［表示ソート］をクリックします。リンクの順序をドラッグ＆ドロップで変更できます。',
    '［リンク］タブから［条件式］欄にフォーカスすると、サイドパネルに条件式生成エディターが開きます。',
    '現在のシーンに紐づいたシーンを新規作成したいならば、［シーン］タブから［シーン追加］ボタンをクリックします。',
    '［シーン］タブでidの［変更］ボタンをクリックすると、新しいidを振ったり、既存のidとスワップしたりできます。',
    'シーンidはシャッフルすることも可能です。.html、.txt形式の出力前には一度シャッフルすることをお勧めします。',
  ];
  toastr.options.closeButton = true;
  toastr.options.positionClass = 'toast-bottom-full-width';
  toastr.options.showDuration = 300;
  toastr.options.hideDuration = 1000;
  toastr.options.preventDuplicates = true;
  toastr.options.timeOut = 7000;
  toastr.info(tips[Math.floor(Math.random() * tips.length)], 'TIPS');
});
