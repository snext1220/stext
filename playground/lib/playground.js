$(function () {
  // フローチャート
  let network = null;
  // 共通データ
  let Common = {
    // ストレージの保存名（ロード時）
    LOAD_NAME: 'pg2_load',
    // ストレージの保存名（実行時）、ウィンドウ名
    RUN_NAME: 'pg2_run',
    // 初期データ
    INIT_DATA_EMPTY: {
      title: '',
      author: '',
      init: {
        constraint: {},
        bgm: {},
        label: {},
        intro: {},
      },
      items: [],
      flags: [],
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
          description: ''
        },
      },

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
          text: 'ここにプロローグを書きます。'
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
    // 指定されたシーンを取得
    getSceneById: function(id) {
      return scenario.scenes.find(function(elem) {
        return elem.id === id; 
      });
    },
    // 指定されたエッジを取得
    getEdgeById: function(id) {
      return scenario.edges.find(function(elem) {
        return elem.id === id; 
      });
    },
    // 指定されたオブジェクトを要素に変換
    // @params name：要素名、data：変換対象のオブジェクト
    // @return 生成された要素（jQuery obj）、中身が空の場合はfalse
    objToElement: function(name, data) {
      let flag = false;
      let result = $(`<${name}></${name}>`);
      for (let key of Object.keys(data)) {
        if (data[key]) {
          if (key === 'text') {
            result.text(data[key]);
          } else if (key === 'label') {
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
    createNetwork: function() {
      Util.destroyNetwork();
      let from = $('#range-from').val();
      let to = $('#range-to').val();
      if (!from) { from = 0; }
      if (!to) { from = 99999; }
  
      // フローチャートの生成
      network = new vis.Network(
        document.getElementById('flow-area'),
        {
          //nodes: new vis.DataSet(scenario.scenes),
          nodes: new vis.DataSet(
            scenario.scenes.filter(function(value){
              return value.id >= from && value.id <= to;
            })
          ),
          edges: new vis.DataSet(scenario.edges)
        },
        {
          physics: false,
          interaction:{hover:true},
          manipulation: {
            //enabled: true
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
                  callback(data);
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
              let node = Util.getSceneById(data.nodes[0]);
              scenario.scenes = scenario.scenes.filter(function(value) {
                return value.id !== node.id;
              });
              scenario.edges = scenario.edges.filter(function(value) {
                return value.from !== node.id && value.to !== node.id;
              });
              Util.disableTab();
              callback(data);
            },
            deleteEdge: function(data, callback) {
              scenario.edges = scenario.edges.filter(function(value) {
                return value.id === data.id;
              });
              Util.disableTab();
              callback(data);
            }
          },
          nodes: {
            shape: 'box',
            size: 20,
            color: 'skyblue'
          },
          edges: {
            arrows: 'to',
            smooth: false
          }
        }
      );
  
      // ノード選択時にフォームに反映
      network.on('selectNode', function(e) {
        let id = this.getNodeAt(e.pointer.DOM);
        if (id !== undefined) {
          Util.enableTab(6);
          let scene = Util.getSceneById(id);
          $('#scene-select #id').text(scene.id);
          $('#scene-select #summary').val(scene.summary);
          $('#scene-select #end').val(scene.end);
          $('#scene-select #items').val(scene.items);
          $('#scene-select #flags').val(scene.flags);
          $('#scene-select #enemies').val(scene.enemies);
          $('#scene-select #bgm').val(scene.bgm);
          $('#scene-select #se').val(scene.se);
          $('#scene-select #hp').val(scene.hp);
          $('#scene-select #mp').val(scene.mp);
          $('#scene-select #stars').val(scene.stars);
          $('#scene-select #free1').val(scene.free1);
          $('#scene-select #free1').val(scene.free2);
          $('#scene-select #free3').val(scene.free3);
          if (scene.text) {
            editor.setValue(scene.text);
          } else {
            editor.setValue('');
          }
          editor.focus();
        }
      });
  
      // エッジ選択時にフォームに反映
      network.on('selectEdge', function(e) {
        if (e.nodes.length !== 0) { return; }
        let id = this.getEdgeAt(e.pointer.DOM);
        if (id !== undefined) {
          Util.enableTab(7);
          let edge = Util.getEdgeById(id);
          $('#edge #id').val(edge.id);
          $('#edge #from').text(edge.from);
          $('#edge #to').text(edge.to);
          $('#edge #label').val(edge.label);
          $('#edge #condition').val(edge.condition);
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
    // 指定されたid値のシーン移動ボタンを生成
    // return：生成された移動ボタン（改行区切り文字列）
    createMoveButton: function(id) {
      let result = [];
      scenario.edges.forEach(function(value) {
        if (value.from === id) {
          if (value.condition) {
            result.push(`[${value.label}](${value.to} "${value.condition}")`);
          } else {
            result.push(`[${value.label}](${value.to})`);
          }
        }
      });
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
        .tabs('option', 'disabled', [ 6, 7 ]);
    },
    // 現在のシナリオデータからscenario.xmlを生成
    // 戻り値：XML文字列
    createXml: function() {
      let result = $('<scenario ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
        'xsi:noNamespaceSchemaLocation="http://www.web-deli.com/sorcerian/next/stext/common/sgml.xsd">' +
        '</scenario>');
      let inits = $('<init></init>');
      let items = $('<items></items>');
      let flags = $('<flags></flags>');
      let enemies = $('<enemies></enemies>');
      let results = $('<results></results>');
      let licence = $('<licence></licence>');
      // scenario要素
      result.attr('title', scenario.title);
      result.attr('author', scenario.author);
      // init要素
      let constraint = Util.objToElement('constraint', scenario.init.constraint);
      if (constraint) { inits.append(constraint); }
      let bgm = Util.objToElement('bgm', scenario.init.bgm);
      if (bgm) { inits.append(bgm); }
      let label = Util.objToElement('label', scenario.init.label);
      if (label) { inits.append(label); }
      result.append(inits);
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
      // 整形したものを出力
      return vkbeautify.xml('<?xml version="1.0" encoding="utf-8"?>\n' +
        result.get(0).outerHTML);
    },
    // 指定された要素（jQueryオブジェクト）をオブジェクトに変換
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

    // 指定されたscenario.xml（文字列）からJSON形式を生成
    createJson(data) {
      let result = $.extend(true, {}, Common.INIT_DATA_EMPTY);
      let parser = new DOMParser();
      let s_data = parser.parseFromString(data, 'text/xml');
      result.title = $('scenario', s_data).attr('title');
      result.author = $('scenario', s_data).attr('author');
      result.init.constraint = Util.elementToObj($('init > constraint', s_data));
      result.init.bgm = Util.elementToObj($('init > bgm', s_data));
      result.init.label = Util.elementToObj($('init > label', s_data));
      result.init.into = Util.elementToObj($('init > label', s_data));
      $('items > item', s_data).each(function(i, elem) {
        result.items.push(Util.elementToObj($(elem)));
      });
      $('flags > flag', s_data).each(function(i, elem) {
        result.flags.push(Util.elementToObj($(elem)));
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
      var link = /\[(.+?)\]\((\d{1,})(?: "(.+?)")?\)/gi;
      $('scene', s_data).each(function(i, elem) {
        let body = $(elem).text();
        while((link_result = link.exec(body)) !== null) {
          result.edges.push({
            from: elem.id,
            to: link_result[2],
            label: link_result[1] ? link_result[1] : ''
          });
        }
        result.scenes.push(
          Util.elementToObj(
            $(elem).text(body.replace(link, '').trim()), true));
      });
      return JSON.stringify(result);
    },

    // アンカータグの生成（createHtml用）
    createLinkTag: function(id) {
      let result = [];
      scenario.edges.forEach(function(value) {
        if (value.from === id) {
          result.push(`<a href="#${value.to}">［${value.label}］</a>`);
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
        );
      let body = $('<body></body>');
      scenario.scenes.forEach(function(value) {
        $('<div></div>')
          .attr('id', value.id)
          .html('<h3>【' + value.id + '】</h3>' +
            value.text.replace(/\n/gi, '<br />')
            + '<br />' + Util.createLinkTag(value.id)
            + '<hr />')
          .appendTo(body);
      });
      html.append(body);
      return '<!DOCTYPE html>' +
        html.get(0).outerHTML;
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

  // シナリオデータ
  let scenario;
  try {
    scenario = JSON.parse(sessionStorage.getItem(Common.LOAD_NAME));
    sessionStorage.removeItem(Common.LOAD_NAME);
  } catch(e) {
    console.log(e);
  }
  if (!scenario) {
    scenario = $.extend(true, {}, Common.INIT_DATA);
  }

  // フローチャートの初期化
  Util.createNetwork();

  // 基本情報を初期化
  $('#title').val(scenario.title);
  $('#author').val(scenario.author);
  $('#constraint-race').val(scenario.init.constraint.race);
  $('#constraint-sex').val(scenario.init.constraint.sex);
  $('#constraint-age').val(scenario.init.constraint.age);
  $('#bgm-main').val(scenario.init.bgm.main);
  $('#bgm-happy').val(scenario.init.bgm.happy);
  $('#bgm-bad').val(scenario.init.bgm.bad);
  $('#label-free1').val(scenario.init.label.free1);
  $('#label-free2').val(scenario.init.label.free2);
  $('#label-free3').val(scenario.init.label.free3);
  $('#intro-description').val(scenario.init.intro.description);

  // 基本情報配下の入力値を反映
  $('#basic input').change(function(e) {
    let id = e.target.id.split('-');
    if (id.length === 1) {
      scenario[id[0]] = $(this).val();
    } else {
      scenario.init[id[0]][id[1]] = $(this).val();
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
        Util.createNetwork();
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

  // ［シーン］タブ内での更新
  $('#scene-select input, #scene-select select').on('change', function(e) {
    let id = $('#scene-select #id').text();
    if (id) {
      let scene = Util.getSceneById(id);
      scene[e.target.id] = $(this).val();
      if (e.target.id === 'summary') {
        scene.label = scene.id + ':\n' + scene.summary;
        Util.createNetwork();
      }
    }
  });

  // ［リンク］タブ内での更新
  $('#edge input').on('input', function(e) {
    let id = $('#edge #id').val();
    if (id) {
      let edge = Util.getEdgeById(id);
      edge[e.target.id] = $(this).val();
    }
    if (e.target.id === 'label') {
      Util.createNetwork();
    }
  });

  // SlickGridの共通オプション
  let grid_opts = {
    editable: true,
    enableAddRow: true,
    enableCellNavigation: true,
    asyncEditorLoading: false,
    autoEdit: false
  };

  // アイテム一覧
  let item_cols = [
    { id: 'id', name: 'id', field: 'id', width: 50, editor: Slick.Editors.Text },
    { id: 'name', name: '名前', field: 'name', width: 80, editor: Slick.Editors.Text },
    { id: 'text', name: '説明', field: 'text', width: 300, editor: Slick.Editors.Text },
    {id: 'delete', name: '削除', field: '', width: 35,
     formatter: function () { return '<input type="button" class="btn-delete" value="×" />'; } }
  ];

  // アイテム一覧の描画
  let items_grid = new Slick.Grid('#items_grid', scenario.items, item_cols, grid_opts);
  items_grid.setSelectionModel(new Slick.CellSelectionModel());
  // 既存行の削除
  items_grid.onClick.subscribe(function (e, args) {
    if ($(e.target).hasClass('btn-delete')) {
      scenario.items.splice(args.row, 1);
      items_grid.invalidate();
    }
  });
  items_grid.onAddNewRow.subscribe(function (e, args) {
    var item = args.item;
    items_grid.invalidateRow(scenario.items.length);
    scenario.items.push(item);
    items_grid.updateRowCount();
    items_grid.render();
  });

  // フラグ一覧
  let flag_cols = [
    { id: 'id', name: 'id', field: 'id', width: 50, editor: Slick.Editors.Text },
    { id: 'text', name: '説明', field: 'text', width: 300, editor: Slick.Editors.Text },
    {id: 'delete', name: '削除', field: '', width: 35,
     formatter: function () { return '<input type="button" class="btn-delete" value="×" />'; } }
  ];

  // フラグ一覧の描画
  let flags_grid = new Slick.Grid('#flags_grid', scenario.flags, flag_cols, grid_opts);
  flags_grid.setSelectionModel(new Slick.CellSelectionModel());
  // 既存行の削除
  flags_grid.onClick.subscribe(function (e, args) {
    if ($(e.target).hasClass('btn-delete')) {
      scenario.flags.splice(args.row, 1);
      flags_grid.invalidate();
    }
  });
  // 新規行の追加
  flags_grid.onAddNewRow.subscribe(function (e, args) {
    var item = args.item;
    flags_grid.invalidateRow(scenario.flags.length);
    scenario.flags.push(item);
    flags_grid.updateRowCount();
    flags_grid.render();
  });

  // 敵一覧
  let enemy_cols = [
    { id: 'id', name: 'id', field: 'id', width: 50, editor: Slick.Editors.Text },
    { id: 'name', name: '名前', field: 'name', width: 80, editor: Slick.Editors.Text },
    { id: 'element', name: '属性', field: 'element', editor: SelectEditor,
      options: [ '', 'earth', 'water', 'fire', 'wind', 'spirit' ] },
    { id: 'attack', name: '攻撃', field: 'attack', width: 80, editor: SelectEditor,
      options: [ '', 'physics', 'magic', 'both', 'free1', 'free2', 'free3',
        'poison', 'frozen', 'stone', 'curse', 'forget' ] },
    { id: 'func', name: 'ダメージ式', field: 'func', width: 80,
      editor: Slick.Editors.LongText },
    { id: 'drop', name: 'ドロップ', field: 'drop', width: 80, editor: AutoCompleteEditor,
      dataSource: [ 'mon/', 'tue/', 'wed/', 'thu/', 'fri/', 'sat/', 'sun/', 'free1/', 'free2/', 'free3', ] },
    { id: 'text', name: '説明', field: 'text', width: 180, editor: Slick.Editors.LongText },
    {id: 'delete', name: '削除', field: '', width: 35,
    formatter: function () { return '<input type="button" class="btn-delete" value="×" />'; } }
  ];

  // 敵一覧の描画
  let enemies_grid = new Slick.Grid('#enemies_grid', scenario.enemies, enemy_cols, grid_opts);
  enemies_grid.setSelectionModel(new Slick.CellSelectionModel());
  enemies_grid.onClick.subscribe(function (e, args) {
    if ($(e.target).hasClass('btn-delete')) {
      scenario.enemies.splice(args.row, 1);
      enemies_grid.invalidate();
    }
  });
  enemies_grid.onAddNewRow.subscribe(function (e, args) {
    var item = args.item;
    enemies_grid.invalidateRow(scenario.enemies.length);
    scenario.enemies.push(item);
    enemies_grid.updateRowCount();
    enemies_grid.render();
  });

  // 実績一覧
  let result_cols = [
    { id: 'id', name: 'id', field: 'id', width: 50, editor: Slick.Editors.Text },
    { id: 'name', name: '名前', field: 'name', width: 100, editor: Slick.Editors.Text },
    { id: 'level', name: 'Lv.', field: 'level', width: 30, editor: SelectEditor,
      options: [ '1', '2', '3', '4', '5' ] },
    { id: 'text', name: '説明', field: 'text', width: 150, editor: Slick.Editors.Text },
    {id: 'delete', name: '削除', field: '', width: 35,
    formatter: function () { return '<input type="button" class="btn-delete" value="×" />'; } }
  ];

  // 実績一覧の描画
  let results_grid = new Slick.Grid('#results_grid', scenario.results, result_cols, grid_opts);
  results_grid.setSelectionModel(new Slick.CellSelectionModel());
  results_grid.onClick.subscribe(function (e, args) {
    if ($(e.target).hasClass('btn-delete')) {
      scenario.results.splice(args.row, 1);
      results_grid.invalidate();
    }
  });
  results_grid.onAddNewRow.subscribe(function (e, args) {
    var item = args.item;
    results_grid.invalidateRow(scenario.results.length);
    scenario.results.push(item);
    results_grid.updateRowCount();
    results_grid.render();
  });

  // ライセンス一覧
  let work_cols = [
    { id: 'name', name: '名前', field: 'name', width: 100, editor: Slick.Editors.Text },
    { id: 'category', name: '分類', field: 'category', width: 70, editor: SelectEditor,
      options: [ 'bgm', 'picture' ] },
    { id: 'creator', name: '作者', field: 'creator', width: 80, editor: Slick.Editors.Text },
    { id: 'url', name: 'URL', field: 'url', width: 230, editor: Slick.Editors.Text },
    {id: 'delete', name: '削除', field: '', width: 35,
    formatter: function () { return '<input type="button" class="btn-delete" value="×" />'; } } 
  ];

  // ライセンス一覧の描画
  let works_grid = new Slick.Grid('#works_grid', scenario.licence, work_cols, grid_opts);
  works_grid.setSelectionModel(new Slick.CellSelectionModel());
  works_grid.onClick.subscribe(function (e, args) {
    if ($(e.target).hasClass('btn-delete')) {
      scenario.licence.splice(args.row, 1);
      works_grid.invalidate();
    }
  });
  works_grid.onAddNewRow.subscribe(function (e, args) {
    var item = args.item;
    works_grid.invalidateRow(scenario.licence.length);
    scenario.licence.push(item);
    works_grid.updateRowCount();
    works_grid.render();
  });

  // エディターの生成
  let editor = ace.edit('scene-editor');
  editor.$blockScrolling = Infinity;
  editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true
  });
  editor.getSession().setUseWrapMode(true);
  editor.setTheme('ace/theme/chrome');
  editor.session.setMode('ace/mode/markdown');

  // エディター内の反映
  editor.on('change', function(e) {
    let id = $('#scene-select #id').text();
    if (id) {
      let scene = Util.getSceneById(id);
      scene.text = editor.getValue();
    }
  });
  
  // タブの生成
  $('#edit-area').tabs();
  Util.disableTab();

  // タグ入力ボックス（保留）
  //$('.tagsin').tagsInput();

  // レイアウトの区切り線
  /*
  $('#main').split({
    orientation: 'vertical',
    limit: 10,
    position: '50%'
  });

  $('#scene-select').split({
    orientation: 'horizontal',
    limit: 10,
    position: '50%'
  });
  */
  
  // コントロールパネル
  // ［テスト実行］ボタン
  $('#ctrl_run').click(function(e) {
    localStorage.setItem(Common.RUN_NAME, Util.createXml());
    window.open('../index.html?id=pg2', Common.RUN_NAME);
  });

  // ［タグ追加］ボタン
  $('#ctrl_tag').click(function(e) {
    window.alert('未実装です。従来のPlaygroundからMarkdown修飾だけを残したものを提供予定です。');
  });

  // ［セーブ］ボタン
  $('#ctrl_save').click(function(e) {
    window.alert('データをブラウザーに保存しました。');
    console.log(scenario);
    localStorage.setItem('pg2_save', JSON.stringify(scenario));
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
    switch($(this).data('command')) {
      case 'json':
        Util.download(vkbeautify.json(JSON.stringify(scenario)), 'stext.json');  
        break;
      case 'xml':
        Util.download(Util.createXml(), 'scenario.xml');
        break;
      case 'html':
        Util.download(Util.createHtml(), 'scenario.html');
        break;
      default:
        console.log('Unknown Error!!');
    }
    /*
    if ($(this).data('command') === 'json') {
      Util.download(vkbeautify.json(JSON.stringify(scenario)), 'stext.json');
    } else {
      Util.download(Util.createXml(), 'scenario.xml');
    }
    */
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

  // ［フィルター］ボタン
  $('#ctrl_filter').click(function(e) {
    console.log('TEST');
    $('#range-dialog').dialog('open');
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

  // コンテキストメニューの削除
  $(':not(#dl-menu,#help-menu)').click(function(e) {
    if (e.target.id !== 'ctrl_dl') {
      $('#dl-menu').css('display', 'none');
    }
    if (e.target.id !== 'ctrl_help') {
      $('#help-menu').css('display', 'none');
    }
  });

  // TIPS表示
  let tips = [
    'Playgroundのデータは、.json形式（Playgroundの内部形式）、または、.xml形式（STextの実行形式）のいずれかで保存できます。',
    'scenario.xml（STextの実行形式）を.json形式（Playgroundの内部形式）に変換することも可能です。既存のシナリオをNew Playgroundにインポートして、どんどん動作確認してみましょう。',
    'Playgroundでは、将来的に.html形式での出力も検討しています。条件分岐、音楽機能などは利用できなくなりますが、Kindle配信などしている人にはニーズがあります、か？？？',
    '.json形式（Playgroundの内部形式）のファイルは、Playground上部のファイル選択ボタンからインポート＆編集できます。',
    'New Playgroundでは、個々のシーンをNode、リンクをEdgeと呼びます。',
    'フィルター機能を利用することで、フローチャートに表示するシーン範囲を限定し、大きなシナリオでも見やすく表示できます。',
    'New Playgroundは現在、プロトタイプ版です。本番シナリオの編集にはまだ利用しないようにしてください。',
    'New Playgroundは現在、プロトタイプ版です。ご利用に際しては、データのバックアップ／保存を小まめに行うようにしてください。'
  ];
  toastr.options.closeButton = true;
  toastr.options.positionClass = 'toast-bottom-full-width';
  toastr.options.showDuration = 300;
  toastr.options.hideDuration = 1000;
  toastr.options.timeOut = 7000;
  toastr.info(tips[Math.floor(Math.random() * tips.length)], 'TIPS');
});
