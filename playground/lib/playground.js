$(function () {
  var scenario = {
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
        id: 0,
        summary: 'プロローグ',
        label: '0:\nプロローグ'
      },
      {
        id: 1,
        summary: '本文',
        label: '1:\n本文'
      }
    ],
    edges: [
      {
        from: 0,
        to: 1,
        label: '次へ'
      }
    ]
  };

  // ダイアログを初期化
  $('#scene-dialog').dialog({
    autoOpen: false,
    width: 200,
    show: 500,
    hide: 500,
    modal: true,
    position: {
      of : '#flow-area',
      at: 'left top',
      my: 'left top',
    },
    open: function() {
      // 初期化
    }
  });

  // フローチャートの生成
  let network = new vis.Network(
    document.getElementById('flow-area'),
    {
      nodes: new vis.DataSet(scenario.scenes),
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
            $('#scene-dialog').dialog('close');
            scenario.scenes.push(data);
            callback(data);
          }.bind(this, data, callback);
          document.getElementById('node-cancel').onclick = function() {
            $('#scene-dialog').dialog('close');
          };
          $('#scene-dialog').dialog('open');
        },
        editEdge: function(data, callback) {
          console.log(data);
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

  network.on('select', function(e) {
    let id = this.getNodeAt(e.pointer.DOM);
    if (id !== undefined) {
      // 問題あり
      let scene = scenario.scenes[id];
      $('#scene-select #id').text(scene.id);
      $('#scene-select #summary').val(scene.summary);
      $('#scene-select #bgm').val(scene.bgm);
      $('#scene-select #se').val(scene.se);
      $('#scene-select #items').val(scene.items);
      $('#scene-select #flags').val(scene.flags);
      $('#scene-select #enemies').val(scene.enemies);
      $('#scene-select #hp').val(scene.hp);
      $('#scene-select #mp').val(scene.mp);
      $('#scene-select #stars').val(scene.stars);
      $('#scene-select #free1').val(scene.free1);
      $('#scene-select #free1').val(scene.free2);
      $('#scene-select #free3').val(scene.free3);
      editor.setValue(scene.text);
    }
  });

  // 
  $('#scene-select input').on('input', function(e) {
    let id = $('#scene-select #id').text();
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
    { id: 'text', name: '説明', field: 'text', width: 200, editor: Slick.Editors.Text }
  ];

  // アイテム一覧の描画
  let items_grid = new Slick.Grid('#items_grid', scenario.items, item_cols, grid_opts);
  items_grid.setSelectionModel(new Slick.CellSelectionModel());
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
    { id: 'text', name: '説明', field: 'text', width: 200, editor: Slick.Editors.Text }
  ];

  // フラグ一覧の描画
  let flags_grid = new Slick.Grid('#flags_grid', scenario.flags, flag_cols, grid_opts);
  flags_grid.setSelectionModel(new Slick.CellSelectionModel());
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
    { id: 'element', name: '属性', field: 'element', editor: Slick.Editors.Text },
    { id: 'func', name: 'ダメージ式', field: 'func', width: 80,
      editor: Slick.Editors.LongText },
    { id: 'drop', name: 'ドロップ', field: 'drop', width: 80, editor: Slick.Editors.Text },
    { id: 'text', name: '説明', field: 'text', width: 180, editor: Slick.Editors.LongText }
  ];

  // 敵一覧の描画
  let enemies_grid = new Slick.Grid('#enemies_grid', scenario.enemies, enemy_cols, grid_opts);
  enemies_grid.setSelectionModel(new Slick.CellSelectionModel());
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
    { id: 'level', name: 'Lv.', field: 'level', width: 30, editor: Slick.Editors.Integer },
    { id: 'text', name: '説明', field: 'text', width: 150, editor: Slick.Editors.Text }
  ];

  // 実績一覧の描画
  let results_grid = new Slick.Grid('#results_grid', scenario.results, result_cols, grid_opts);
  results_grid.setSelectionModel(new Slick.CellSelectionModel());
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
    { id: 'category', name: '分類', field: 'category', width: 50, editor: Slick.Editors.Text },
    { id: 'creator', name: '作者', field: 'creator', width: 80, editor: Slick.Editors.Text },
    { id: 'url', name: 'URL', field: 'url', width: 120, editor: Slick.Editors.Text }
  ];

  // ライセンス一覧の描画
  let works_grid = new Slick.Grid('#works_grid', scenario.licence, work_cols, grid_opts);
  works_grid.setSelectionModel(new Slick.CellSelectionModel());
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

  // タブの生成
  $('#edit-area').tabs();

  // レイアウトの区切り線
  $('#main').split({
    orientation: 'vertical',
    limit: 10,
    position: '50%'
  });

  /*
  $('#scene-select').split({
    orientation: 'horizontal',
    limit: 10,
    position: '50%'
  });
  */
  
  // コントロールパネル
  // シナリオのセーブ
  $('#ctrl_save').click(function(e) {
    console.log(scenario);
  });



});
