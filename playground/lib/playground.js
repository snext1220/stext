$(function () {
  // フローチャート
  let network = null;
  // フローチャートの絞り込み条件
  let filter_where = [];
  // 共通データ
  let Common = {
    HELP_URL: 'https://sorcerian.hateblo.jp/entry/2018/11/01/211745#',
    // マイストレージの名前
    MY_STORAGE: 'pg2_save',
    // ストレージの一時保存名（ロード時）
    LOAD_NAME: 'pg2_load',
    // ストレージの一時保存名（実行時）、ウィンドウ名
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
      groups: [],
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
          keywords: '',
          description: ''
        },
      },
      groups: [
        {
          start: 0,
          end: 1,
          title: 'Introduction'
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
    // アイテム／敵などのソート
    sortFn: function(m, n) {
      return Number(m.id.substring(1)) - Number(n.id.substring(1));
    },
    // シナリオ内の項目をソート
    sortScenario: function() {
      scenario.groups.sort(function(m, n) {
        Number(m.start) - Number(m.end);
      });
      scenario.items.sort(Util.sortFn);
      scenario.flags.sort(Util.sortFn);
      scenario.enemies.sort(Util.sortFn);
      scenario.results.sort(Util.sortFn);
    },
    // 指定されたシーンを取得
    getSceneById: function(id) {
      return scenario.scenes.find(function(elem) {
        return elem.id === id; 
      });
    },
    // 指定されたシーンの情報をフォームに反映
    setSceneInfo: function(id) {
      if (id !== undefined) {
        Util.enableTab(7);
        let scene = Util.getSceneById(id);
        $('#scene-select #id').text(scene.id);
        $('#scene-select #summary').val(scene.summary);
        $('#scene-select #end').val(scene.end);
        $('#scene-select #items').val(scene.items);
        $('#scene-select #flags').val(scene.flags);
        $('#scene-select #enemies').val(scene.enemies);
        $('#scene-select #result').val(scene.result);
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

        // リンクリストを生成
        $('#scene-select #edges-list').empty();
        $('#scene-select #edges-list').append(
          '<option value="" selected>編集するリンクを選択</option>');
        scenario.edges.forEach(function(value) {
          if (value.from === id) {
            $('<option></option>')
              .attr('value', value.id)
              .text(`${value.to}: ${value.label}`)
              .appendTo('#scene-select #edges-list');
          }
        });
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
      Util.enableTab(8);
      let edge = Util.getEdgeById(id);
      $('#edge #id').val(edge.id);
      $('#edge #from').text(edge.from);
      $('#edge #to').text(edge.to);
      $('#edge #order').val(edge.order);
      $('#edge #label').val(edge.label);
      $('#edge #condition').val(edge.condition);
      $('#edge #type').val(edge.type);
      $('#edge #correct').val(edge.correct);
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
    createNetwork: function() {
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
          layout: {
            improvedLayout: false,
            hierarchical: {
              enabled: true,
              levelSeparation: 100,
              direction: 'UD',
              sortMethod: 'directed'
            }
          },
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
              'roundness': 0.3
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
    createGrid: function(selector, data, cols, opts, helpName) {
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
      grid.onAddNewRow.subscribe(function (e, args) {
        let item = args.item;
        grid.invalidateRow(data.length);
        data.push(item);
        grid.updateRowCount();
        grid.render();
      });
      grid.onHeaderClick.subscribe(function (e, args) {
        window.open(Common.HELP_URL + helpName, 'help');
      });
    },

    // 単一／複数選択ボタン付きのサイドバーを生成
    // trigger：トリガーとなる要素（セレクター式）
    // target：サイドバーとなる要素のベース名（id値）
    // dataset：リスト対象のデータ（オブジェクト配列）
    // type：ボタンの種類（radio／check／plus_minus）
    // label：ラジオ／チェックボックスのラベルとなるプロパティ、またはラベルを生成する関数（引数は対象のオブジェクト、戻り値はラベル値）
    // value：ラジオ／チェックボックスの値となるプロパティ、またはラベルを生成する関数（引数は対象のオブジェクト、戻り値はオプション値）
    // onSubmit：サブミット時の処理（引数はトリガー要素、リスト要素）
    createSelectSidebar: function(trigger, target, dataset, type, label, value, onSubmit) {
      // サイドバーとなる要素（id値）
      let s_name = `sidr_${target}`;
      // リスト要素（セレクター）
      let s_list = `#${s_name} #${s_name}_list`;
      // サブミットボタン（セレクター）
      let s_submit = `#${s_name} #${s_name}_submit`;
      // キャンセルボタン（セレクター）
      let s_cancel = `#${s_name} #${s_name}_close`;
      // triggerへのサイドバーの紐付け
      $(trigger).sidr({
        name: s_name,
        displace: false,
        onOpen: function() {
          $(s_list).empty();
          for(let obj of dataset) {
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
              default:
                throw new Error('type属性の値が不正です。');
            }
            $(s_list).append(elem);
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
      let tmp_condition = '';
      let tmp_to = [];
      for (let value of group) {
        if (value.condition) { tmp_condition = value.condition; }
        if (value.label) { tmp_label = value.label; }
        tmp_to.push(value.to);
      }
      if (tmp_condition) {
        return `[${tmp_label}](${tmp_to.join(',')} "${tmp_condition}")`;
      } else {
        return `[${tmp_label}](${tmp_to.join(',')})`;
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
        .tabs('option', 'disabled', [ 7, 8 ]);
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
      $('enemies > enemy', s_data).each(function(i, elem) {
        result.enemies.push(Util.elementToObj($(elem)));
      });
      $('results > result', s_data).each(function(i, elem) {
        result.results.push(Util.elementToObj($(elem)));
      });
      $('licence > work', s_data).each(function(i, elem) {
        result.licence.push(Util.elementToObj($(elem)));
      });
      var link = /\[(.+?)\]\(([\dQX,]{1,})(?: "(.+?)")?\)/gi;
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
                order: order
              });
              result.edges.push({
                from: elem.id,
                to: tmp_label[2],
                label: '',
                type: 'Q',
                order: order
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
                  order: order
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
                  order: order
                });
              } else {
                tmp_to = tmp_to.split(',');
                for (let tmp of tmp_to) {
                  result.edges.push({
                    from: elem.id,
                    to: tmp,
                    label: tmp_label,
                    type: 'R',
                    condition: tmp_condition,
                    order: order
                  });
                }
              }
              break;
          }
        }
        // sceneオブジェクト生成
        let s_obj = Util.elementToObj(
          $(elem).text(body.replace(link, '').trim()), true);
        if(Number(s_obj.id) === 0) {
          s_obj.group = 'prologue';
        } else if (s_obj.end) {
          Util.setGroupByEnd(s_obj.end, s_obj);
        }
        result.scenes.push(s_obj);
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

  // ★★★★★★★★★★★★★★★★★★★★★★Entry Point★★★★★★★★★★★★★★★★★★★★★★★★★★★
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
  }
  // 初期化時にアイテム／フラグ等をソート
  Util.sortScenario();

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
  $('#intro-keywords').val(scenario.init.intro.keywords);
  $('#intro-description').val(scenario.init.intro.description);

  // 基本情報配下の入力値を反映
  $('#basic input').on('input', function(e) {
    let id = e.target.id.split('-');
    if (id.length === 1) {
      scenario[id[0]] = $(this).val();
    } else {
      scenario.init[id[0]][id[1]] = $(this).val();
    }
    console.log('input')
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

  // ダイナミックヘルプ（基本情報）
  $('#basic label').dblclick(function(e) {
    let id = $(this).find('input, select').attr('id').split('-')[1];
    window.open(Common.HELP_URL + id, 'help');
  });

  // ダイナミックヘルプ（シーン情報）
  $('#scene label').dblclick(function(e) {
    let id = $(this).find('input, select').attr('id');
    window.open(Common.HELP_URL + id, 'help');
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
          comment: $('#upload-comment').val()
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
    let id = $('#scene-select #id').text();
    if (id) {
      let scene = Util.getSceneById(id);
      scene[e.target.id] = $(this).val();
      if (e.target.id === 'summary') {
        scene.label = scene.id + ':\n' + scene.summary;
        Util.createNetwork();
        network.selectNodes([ scene.id ]);
      } else if (e.target.id === 'end') {
        // end属性にグループ付与
        Util.setGroupByEnd($(this).val(), scene);
        Util.createNetwork();
        network.selectNodes([ scene.id ]);
      }
    }
    console.log('scene_input');
  });

  // ［シーン］タブ内でのアイテム処理
  Util.createSelectSidebar(
    '#scene-select #items',
    'items',
    scenario.items,
    'plus_minus',
    'name',
    'id'
  );

  // ［シーン］タブ内でのフラグ処理
  Util.createSelectSidebar(
    '#scene-select #flags',
    'flags',
    scenario.flags,
    'plus_minus',
    'text',
    'id'
  );
    
  // ［シーン］タブ内での敵処理
  Util.createSelectSidebar(
    '#scene-select #enemies',
    'enemies',
    scenario.enemies,
    'check',
    'name',
    'id'
  );
    
  // ［シーン］タブ内での実績処理
  Util.createSelectSidebar(
    '#scene-select #result',
    'results',
    scenario.results,
    'radio',
    'name',
    'id'
  );

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
    source: [ '1', '@5', 'full' ],
    close: function(e, ui) {
      $(this).trigger('input');
    }
  });

  // free1～3属性のオートコンプリート
  $('#scene-select #free1, #scene-select #free2, #scene-select #free3').autocomplete({
    minLength: 0,
    source: [ '1', '@5' ],
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

  // ［リンク］タブ内での更新
  $('#edge input, #edge select').on('input', function(e) {
    let id = $('#edge #id').val();
    if (id) {
      let edge = Util.getEdgeById(id);
      edge[e.target.id] = $(this).val();
    }
    if (e.target.id === 'label') {
      Util.createNetwork();
      network.selectEdges([ id ]);
    }
    console.log('edge_input');
  });

  // サイドバーの実績欄を生成
  $.get('../stext/stext.xml').done(function(data) {
    $('scenario > work', data).each(function() { 
      $('#sidr_links_result_s').append(
        $('<option></option>').
          attr('value', $(this).attr('id')).
          text($(this).attr('title'))
      );
    }); 
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
    }
  });

  // 条件式シートの選択ボックスの選択をテキストエリアに反映
  $('#sidr_links_list select:not(.no-update)').change(function() {
    console.log('BG');
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

  // SlickGridの共通オプション
  let grid_opts = {
    editable: true,
    enableAddRow: true,
    enableCellNavigation: true,
    asyncEditorLoading: false,
    autoEdit: false
  };

  // アイテム一覧の描画
  Util.createGrid('#groups_grid', scenario.groups, 
    [
      { id: 'start', name: '開始No.', field: 'start', width: 70, editor: Slick.Editors.Integer },
      { id: 'end', name: '終了No.', field: 'end', width: 70, editor: Slick.Editors.Integer },
      { id: 'title', name: 'グループ名', field: 'title', width: 250, editor: Slick.Editors.Text },
      {id: 'delete', name: '削除', field: '', width: 35,
      formatter: function () { return '<input type="button" class="btn-delete" value="×" />'; } }
    ], grid_opts, 'group');

  // アイテム一覧の描画
  Util.createGrid('#items_grid', scenario.items, 
    [
      { id: 'id', name: 'id', field: 'id', width: 50, editor: Slick.Editors.Text },
      { id: 'name', name: '名前', field: 'name', width: 80, editor: Slick.Editors.Text },
      { id: 'text', name: '説明', field: 'text', width: 300, editor: Slick.Editors.Text },
      {id: 'delete', name: '削除', field: '', width: 35,
      formatter: function () { return '<input type="button" class="btn-delete" value="×" />'; } }
    ], grid_opts, 'item');

  // フラグ一覧の描画
  Util.createGrid('#flags_grid', scenario.flags,
    [
      { id: 'id', name: 'id', field: 'id', width: 50, editor: Slick.Editors.Text },
      { id: 'text', name: '説明', field: 'text', width: 300, editor: Slick.Editors.Text },
      {id: 'delete', name: '削除', field: '', width: 35,
      formatter: function () { return '<input type="button" class="btn-delete" value="×" />'; } }
    ], grid_opts, 'flag');

  // 敵一覧の描画
  Util.createGrid('#enemies_grid', scenario.enemies,
    [
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
    ], grid_opts, 'enemy');

  // 実績一覧の描画
  Util.createGrid('#results_grid', scenario.results,
    [
      { id: 'id', name: 'id', field: 'id', width: 50, editor: Slick.Editors.Text },
      { id: 'name', name: '名前', field: 'name', width: 100, editor: Slick.Editors.Text },
      { id: 'level', name: 'Lv.', field: 'level', width: 30, editor: SelectEditor,
        options: [ '1', '2', '3', '4', '5' ] },
      { id: 'text', name: '説明', field: 'text', width: 150, editor: Slick.Editors.Text },
      {id: 'delete', name: '削除', field: '', width: 35,
      formatter: function () { return '<input type="button" class="btn-delete" value="×" />'; } }
    ], grid_opts, 'result');

  // ライセンス一覧の描画
  Util.createGrid('#works_grid', scenario.licence,
    [
      { id: 'name', name: '名前', field: 'name', width: 100, editor: Slick.Editors.Text },
      { id: 'category', name: '分類', field: 'category', width: 70, editor: SelectEditor,
        options: [ 'bgm', 'picture' ] },
      { id: 'creator', name: '作者', field: 'creator', width: 80, editor: Slick.Editors.Text },
      { id: 'url', name: 'URL', field: 'url', width: 230, editor: Slick.Editors.Text },
      {id: 'delete', name: '削除', field: '', width: 35,
      formatter: function () { return '<input type="button" class="btn-delete" value="×" />'; } } 
    ], grid_opts, 'work');

  // エディターの生成
  let editor = ace.edit('scene-editor');
  editor.$blockScrolling = Infinity;
  editor.setOptions({
    // enableBasicAutocompletion: true,
    // enableSnippets: true,
    // enableLiveAutocompletion: true
  });
  editor.getSession().setUseWrapMode(true);
  editor.setTheme('ace/theme/chrome');
  editor.session.setMode('ace/mode/markdown');

  // エディター内の反映
  editor.on('input', function(e) {
    let id = $('#scene-select #id').text();
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

  // タブの生成
  $('#edit-area').tabs();
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
      '*ruby': '${text|ruby}',
      'if': '${if condition}$0${/if}',
      '*import': '${import 99999}',
      '*input': '${input?0}',
      '*input': '${input?0}',
      '*title': '${title}',
      '*race': '${race?FIG:WIZ:DWA:ELF}',
      '*sex': '${sex?M:F}',
      '*state': '${state?NOR:POI:FRO:STO:FOR}',
      '*age': '${age?Y:A:O}',
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
    switch($(this).data('command')) {
      case 'json':
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
      case 'storage':
        window.alert('データをブラウザーに保存しました。');
        console.log(scenario);
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
    [
      {
        start: 0,
        end: 99999,
        title: 'フィルター解除'
      }
    ].concat(scenario.groups),
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
      Util.createNetwork();
    }
  );

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
        $.ajax('./template/' + selected, {
          dataType: 'text'
        }).done(function(data) {
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
  });

  // Editorへの遷移
  $('#ctrl_flow2editor').click(function(){
    localStorage['flow2editor'] = Util.createXml();
    window.open('../playground.aspx', 'pgeditor');
  });

  // ページ移動時の警告
  $(window).on('beforeunload', function(){
    return "ページを閉じてもよろしいですか？";
  });

  // TIPS表示
  let tips = [
    'フローチャート上では、プロローグ／エピローグ（happy/bad）を表すシーンが色で区別されています。目的のシーンを探す手掛かりになるでしょう。',
    'フローチャートで目的のシーンが探しにくい場合には、右上のシーン選択ボックスを利用してみましょう。シーンid順に表示されています。',
    'フローチャートやシーン選択ボックス上では、サマリーテキストが表示されます。シーンごとにできるだけ判りやすい名前を付けましょう。',
    'シーン選択ボックス上では、プロローグとエピローグが★でマーキングされています。目的のシーンを探す手掛かりになるでしょう。',
    'フローチャート上のリンクが見難い場合には、［シーン］タブからリンク選択ボックスを利用してみましょう。',
    'Playgroundのデータは、.json形式（Playgroundの内部形式）、.xml形式（STextの実行形式）などで保存できます。',
    'scenario.xml（STextの実行形式）を.json形式（Playgroundの内部形式）に変換することも可能です。既存のシナリオをNew Playgroundにインポートして、どんどん動作確認してみましょう。',
    'Playgroundでは、.html形式での出力もできます。条件分岐、音楽機能などは利用できなくなりますが、Kindle配信などしている人にも利用して戴けると嬉しいです。',
    '.json形式（Playgroundの内部形式）のファイルは、Playground上部のファイル選択ボタンからインポート＆編集できます。',
    'Playground Flowでは、個々のシーンをNode、リンクをEdgeと呼びます。',
    'フォーム上のラベルをダブルクリックすることで、該当する項目のヘルプページを表示できます。',
    'アイテム／フラグ編集のグリッドからタイトル行をダブルクリックすることで、該当する項目のヘルプページを表示できます。',
    'フィルター機能を利用することで、フローチャートに表示するシーン範囲を限定し、大きなシナリオでも見やすく表示できます。',
    '［シンプルサンプル］は、5Sceneの中にも、戦闘、フラグ、アイテム、実績、エンディングなどの基本機能を備えています。STextの基礎を見渡すのに便利です。',
    '［20Sceneサンプル］は、単方向で分岐と移動の枠組みだけを備えたサンプルです。20Sceneあるので、簡単な物語ならば、テキストを追加するだけでシナリオができてしまいます。',
    '［機能テスト］は、STextの動作確認のためのテンプレート。リンク関係など判りにくい動作例を載せています。',
    '［セーブ］ボタンではブラウザーに一時的にデータを保存できます。保存したデータは［マイストレージ］テンプレートから取り出せますよ。',
    'Playground Flowは現在β版です。バグかなと思ったら、Twitter（@yy7512）までお知らせください。',
    'Playground Flowは現在β版です。こんな機能あったらいいなと思ったら、Twitter（@yy7512）までお気軽にお寄せください。',
    'Playground Flowは現在β版です。ご利用に際しては、データのバックアップ／保存を小まめに行うようにしてください。',
    'アイテム／フラグなどの項目はロード時にid値について昇順でソートされます。番号の大小が乱れた時は一度開き直すと良いでしょう。',
    'シーンはフローチャートとからだけでなく、右上の選択ボックスからも選べます。プロローグ／エンディングには★が付いているので、探す時の手懸りにどうぞ。',
    'シーンテキストを編集するエディターには様々なショートカットが用意されています。詳しくはヘルプを参照してください。',
    '［シーン］タブから［アイテム］［フラグ］［敵］［実績］欄にフォーカスすると、サイドバーが開いて、設定済みの情報を選択できます。',
    '［シーン］タブから［HP］～［FREE3］欄にフォーカスすると、入力可能なオプションがリスト表示されます。',
    '［リンク］タブから［条件式］欄にフォーカスすると、サイドパネルに条件式生成エディターが開きます。',
  ];
  toastr.options.closeButton = true;
  toastr.options.positionClass = 'toast-bottom-full-width';
  toastr.options.showDuration = 300;
  toastr.options.hideDuration = 1000;
  toastr.options.timeOut = 7000;
  toastr.info(tips[Math.floor(Math.random() * tips.length)], 'TIPS');
});
