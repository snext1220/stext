$(function() {
  let wordList = [
    { name: 'scenario', meta: 'element', score: 666 },
    { name: 'title', meta: 'attr(scenario)', score: 777 },
    { name: 'author', meta: 'attr(scenario)', score: 777 },
    { name: 'init', meta: 'element', score: 666 },
    { name: 'constraint', meta: 'element', score: 888 },
    { name: 'race', meta: 'attr(constraint)', score: 888 },
    { name: 'FIGHTER', meta: 'const(race)', score: 888 },
    { name: 'WIZARD', meta: 'const(race)', score: 888 },
    { name: 'DWARF', meta: 'const(race)', score: 888 },
    { name: 'ELF', meta: 'const(race)', score: 888 },
    { name: 'sex', meta: 'attr(constraint)', score: 888 },
    { name: 'MALE', meta: 'const(sex)', score: 888 },
    { name: 'FEMALE', meta: 'const(sex)', score: 888 },
    { name: 'age', meta: 'attr(constraint)', score: 888 },
    { name: 'YOUNG', meta: 'const(age)', score: 888 },
    { name: 'ADULT', meta: 'const(age)', score: 888 },
    { name: 'OLD', meta: 'const(age)', score: 888 },
    { name: 'bgm', meta: 'element', score: 888 },
    { name: 'main', meta: 'attr(bgm)', score: 888 },
    { name: 'happy', meta: 'attr(bgm)', score: 888 },
    { name: 'bad', meta: 'attr(bgm)', score: 888 },
    { name: 'label', meta: 'element', score: 888 },
    { name: 'free1', meta: 'attr(label)', score: 888 },
    { name: 'free2', meta: 'attr(label)', score: 888 },
    { name: 'free3', meta: 'attr(label)', score: 888 },
    { name: 'intro', meta: 'element', score: 888 },
    { name: 'description', meta: 'attr(intro)', score: 888 },
    { name: 'items', meta: 'element', score: 666 },
    { name: 'item', meta: 'element', score: 999 },
    { name: 'id', value: 'id="i', meta: 'attr(item)', score: 999 },
    { name: 'name', meta: 'attr(item)', score: 999 },
    { name: 'flags', meta: 'element', score: 666 },
    { name: 'flag', meta: 'element', score: 999 },
    { name: 'id', value: 'id="f', meta: 'attr(flag)', score: 999 },
    { name: 'enemies', meta: 'element', score: 666 },
    { name: 'enemy', meta: 'element', score: 999 },
    { name: 'id', value: 'id="m', meta: 'attr(enemy)', score: 999 },
    { name: 'name', meta: 'attr(enemy)', score: 999 },
    { name: 'element', meta: 'attr(enemy)', score: 999 },
    { name: 'earth', meta: 'const(element)', score: 888 },
    { name: 'fire', meta: 'const(element)', score: 888 },
    { name: 'water', meta: 'const(element)', score: 888 },
    { name: 'wind', meta: 'const(element)', score: 888 },
    { name: 'spirit', meta: 'const(element)', score: 888 },
    { name: 'attack', meta: 'attr(enemy)', score: 999 },
    { name: 'physics', meta: 'const(attack)', score: 888 },
    { name: 'magic', meta: 'const(attack)', score: 888 },
    { name: 'both', meta: 'const(attack)', score: 888 },
    { name: 'free1', meta: 'const(attack)', score: 888 },
    { name: 'free2', meta: 'const(attack)', score: 888 },
    { name: 'free3', meta: 'const(attack)', score: 888 },
    { name: 'poison', meta: 'const(attack)', score: 888 },
    { name: 'frozen', meta: 'const(attack)', score: 888 },
    { name: 'stone', meta: 'const(attack)', score: 888 },
    { name: 'curse', meta: 'const(attack)', score: 888 },
    { name: 'forget', meta: 'const(attack)', score: 888 },
    { name: 'func', meta: 'attr(enemy)', score: 999 },
    { name: 'STR', meta: 'const(func)', score: 888 },
    { name: 'INT', meta: 'const(func)', score: 888 },
    { name: 'DEX', meta: 'const(func)', score: 888 },
    { name: 'KRM', meta: 'const(func)', score: 888 },
    { name: 'FREE1', meta: 'const(func)', score: 888 },
    { name: 'FREE2', meta: 'const(func)', score: 888 },
    { name: 'FREE3', meta: 'const(func)', score: 888 },
    { name: 'drop', meta: 'attr(enemy)', score: 999 },
    { name: 'mon', meta: 'const(drop)', score: 888 },
    { name: 'tue', meta: 'const(drop)', score: 888 },
    { name: 'wed', meta: 'const(drop)', score: 888 },
    { name: 'thu', meta: 'const(drop)', score: 888 },
    { name: 'fri', meta: 'const(drop)', score: 888 },
    { name: 'sat', meta: 'const(drop)', score: 888 },
    { name: 'sun', meta: 'const(drop)', score: 888 },
    { name: 'results', meta: 'element', score: 666 },
    { name: 'result', meta: 'element', score: 999 },
    { name: 'id', value: 'id="r', meta: 'attr(result)', score: 999 },
    { name: 'name', meta: 'attr(result)', score: 999 },
    { name: 'level', meta: 'attr(result)', score: 999 },
    { name: 'licence', meta: 'element', score: 666 },
    { name: 'work', meta: 'element', score: 888 },
    { name: 'category', meta: 'attr(work)', score: 888 },
    { name: 'bgm', meta: 'const(category)', score: 777 },
    { name: 'picture', meta: 'const(category)', score: 777 },
    { name: 'creator', meta: 'attr(work)', score: 888 },
    { name: 'url', meta: 'attr(work)', score: 888 },
    { name: 'scene', meta: 'element', score: 999 },
    { name: 'id', meta: 'attr(scene)', score: 999 },
    { name: 'items', meta: 'attr(scene)', score: 888 },
    { name: 'flags', meta: 'attr(scene)', score: 888 },
    { name: 'enemies', meta: 'attr(scene)', score: 888 },
    { name: 'stars', meta: 'attr(scene)', score: 888 },
    { name: 'hp', meta: 'attr(scene)', score: 888 },
    { name: 'mp', meta: 'attr(scene)', score: 888 },
    { name: 'free1', meta: 'attr(scene)', score: 888 },
    { name: 'free2', meta: 'attr(scene)', score: 888 },
    { name: 'free3', meta: 'attr(scene)', score: 888 },
    { name: 'result', meta: 'attr(scene)', score: 888 },
    { name: 'bgm', meta: 'attr(scene)', score: 888 },
    { name: 'se', meta: 'attr(scene)', score: 888 },
    { name: 'end', meta: 'attr(scene)', score: 888 },
    { name: 'happy', meta: 'const(end)', score: 777 },
    { name: 'bad', meta: 'const(end)', score: 777 },
  ];
  
  // Aceエディターの準備
  let editor = ace.edit('editor');
  editor.$blockScrolling = Infinity;
  editor.setOptions({
    enableBasicAutocompletion: true,
    //enableSnippets: true,
    enableLiveAutocompletion: true
  });
  editor.getSession().setUseWrapMode(true);
  editor.setTheme('ace/theme/chrome');
  editor.session.setMode('ace/mode/markdown');
  
  // オートコンプリートの実装
  let langTools = ace.require('ace/ext/language_tools');
  langTools.addCompleter({
    getCompletions: function(editor, session, pos, prefix, callback) {
      if (prefix.length === 0) {
        callback(null, []);
        return;
      }
      callback(null,
        wordList
          .filter(function(ea) {
            return ea.name.indexOf(prefix) === 0
          })
          .map(function(ea) {
            return {
              name: ea.name, 
              value: ea.value === undefined ? ea.name : ea.value,
              score: ea.score,
              meta: ea.meta
            };
          })
      );
    }
  });
  
    // ダイナミックヘルプ
    // editor.commands.addCommand({
    //     name: 'dynamicHelp',
    //     bindKey: { win: 'F1',  mac: 'Command-Q' },
    //     exec: function(editor) {
    //       var sel = editor.getCopyText();
    //       if (sel.indexOf('=') !== -1) {
    //         sel = sel.substring(0, sel.indexOf('='));
    //       }
    //       window.open('https://sorcerian.hateblo.jp/entry/2018/11/01/211745#'
    //         + sel.replace(/[<>=" ]/gi, ''), 'help');
    //     }
    // });
  
  // ショートカット（コンテキストメニュー表示）
  $('#pg_tag').click(function(e) {
    $('#addmenu').css({
      display: 'block',
      top: e.pageY,
      left: e.pageX
    });
  });
  
  // タグ挿入
  $('.addcom').click(function(e) {
    var command = {
      'scene': '<scene id="0" summary="サマリ" items="i00" flags="f00" params="p01:1" enemies="m00" result="r00" hp="1" mp="1" stars="0,0,0,0,0,0,0" state="poison" str="1" int="1" dex="1" krm="1" free1="1" free2="1" free3="1"><![CDATA[\n\n]]></scene>',
      'scene_simple': '<scene id="0" summary="サマリ"><![CDATA[\n\n]]></scene>',
      'item': '<item id="i01" name="Item-01" target="hp" effect="1">Item description...</item>',
      'flag': '<flag id="f01">Flag description...</flag>',
      'param': '<param id="p01" min="0" max="100" initial="50">Param description...</param>',
      'enemy': '<enemy id="m01" name="Enemy-01" element="earth" attack="physics" func="L+R-STR" drop="mon/2" hp="10" func_opp="STR+INT">Enemy description...</enemy>',
      'result': '<result id="r01" name="Result-01" level="1">Result description...</result>',
      'work': '<work name="Bgm-01" category="bgm" creator="SText" url="https://example.com/"></work>',
      'basic': '<basic summary="true" imgset="custom"></basic>',
      'constraint': '<constraint race="FIGHTER,WIZARD" sex="FEMALE" age="YOUNG,ADULT"></constraint>',
      'bgm': '<bgm main="@town02" happy="@field04" bad="@town01"></bgm>',
      'label': '<label free1="" free2="" free3="" hp="" mp="" state="" str="" int="" dex="" krm=""></label>',
      'intro': '<intro keywords="" description="" />'
    };
    editor.insert(command[$(this).data('command')]);
    editor.focus();
    $('#addmenu').css('display', 'none');
  });
  
  // ショートカット（コンテキストメニュー表示）
  $('#pg_md').click(function(e) {
    $('#addmd').css({
      display: 'block',
      top: e.pageY,
      left: e.pageX
    });
  });
  
  // markdown拡張挿入
  $('#addmd li').click(function(e) {
    let command = {
      'link': '[$0](num)',
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
    $('#addmd').css('display', 'none');
  });
  
  // ［シナリオ実行］ボタン
  $('#pg_run').click(function(e){
    const RUN_NAME = 'pg2_run';
    localStorage.setItem(RUN_NAME, editor.getValue());
    if (location.host.indexOf('web-deli.com') === -1) {
      window.open('../index.html?id=pg2', RUN_NAME);
    } else {
      window.open('../game.aspx?id=pg2', RUN_NAME);
    }
  });
  
  // ［保存］ボタン
  $('#pg_save').click(function(e){
    localStorage['playground_editor'] = editor.getValue();
    window.alert('シナリオデータをブラウザーに保存しました。');
  });
  
  // ［GBATへ変換］ボタン
  $('#pg_gbat').click(function(e) {
    $('#gbat').click();
  });
  
  // ［ヘルプ］ボタン
  $('#pg_help').click(function(e){
    $('#helpmenu').css({
      display: 'block',
      top: e.pageY,
      left: e.pageX
    });
  });
  
  // リンク時にメニューを消去
  $('#helpmenu').click(function(e){
    $('#helpmenu').css('display', 'none');
  });
  
  // コンテキストメニューの削除
  $(':not(#addmenu,#helpmenu)').click(function(e) {
    if (e.target.id !== 'pg_tag') {
      $('#addmenu').css('display', 'none');
    }
    if (e.target.id !== 'pg_md') {
      $('#addmd').css('display', 'none');
    }
    if (e.target.id !== 'pg_help') {
      $('#helpmenu').css('display', 'none');
    }
  });
  
  // ［ダウンロード］ボタン
  $('#pg_dl').click(function(e){
    var blob = new Blob([ editor.getValue() ],
      { 'type': 'application/octet-stream' });
    var anchor = document.createElement('a');
    anchor.href = window.URL.createObjectURL(blob);
    anchor.download = 'scenario.xml';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  });
  
  // ［クリア］ボタン
  $('#pg_clear').click(function(e){
    if (confirm('編集内容をクリアしても良いですか？')) {
      editor.setValue('');
    }
  });

  $(window).on('beforeunload', function(){
    if (is_active) {
      return "ページを閉じてもよろしいですか？";
    }
  });

  // Flow2Editor移動でネガティブな状態か
  let is_active = true;
  // Editor2Flow
  $('#pg_editor2flow').click(function(e){
    is_active = false;
    toastr.clear();
    toastr.options = {
      positionClass: 'toast-bottom-full-width',
      closeButton: false,
      timeOut: 0,
      extendedTimeOut: 0
    };
    toastr.error('PgFlowにて編集中です。PgEditorに戻るには、PgFlowの［PgEditorで編集］ボタンを押してください。',
      'Playground Flowで編集中');
    $('body').css('opacity', 0.2);

    localStorage['editor2flow'] = editor.getValue();
    window.open('./', 'pgflow');
  });

  // 構文ハイライト
  $('[name="lang"]').change(function() {
    console.log($('[name="lang"]:checked').val());
    editor.session.setMode('ace/mode/' + $('[name="lang"]:checked').val());
  });
  
  // ファイル選択ボックス
  $('#gbat').gbat2stext(function(result) {
    editor.setValue(
      vkbeautify.xml(
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        result.get(0).outerHTML
      )
    );
  });
  
  var loadTemplate = function(selected, isFirst) {
    if (selected) {
      $.ajax('../stext/playground/' + selected, {
        dataType: 'text'
      }).done(function(data) {
        editor.setValue(vkbeautify.xml(data));
        if (isFirst) {
          window.alert('チュートリアルシナリオをロードしています。\r開始するには、上部のツールバーから［▶］ボタンを押してください。');
        }
      });
    }
  };

  // テンプレート選択
  $('#template').change(function(e) {
    var selected = $(this).val();
    if (selected === 'storage') {
      var save = localStorage['playground_editor'];
      if (save) {
        editor.setValue(save);
      } else {
        window.alert('セーブデータは存在しません。');
      }
    } else {
      loadTemplate(selected);
    }
  });
  
  // Flowからの遷移時
  if (localStorage['flow2editor']) {
    editor.setValue(
      vkbeautify.xml(
        localStorage['flow2editor']
      )
    );
    localStorage.removeItem('flow2editor');
  // 初期ロード時
  } else if (!localStorage['tutorial_off']) {
    loadTemplate('tutorial1.xml', true);
    localStorage['tutorial_off'] = 1;
  } else {
    loadTemplate('scenario_empty.xml');
  }

  // サイドバーの生成
  $('#region').sidr({
    name: 'sidr_help',
    displace: false,
    side: 'right'
  });

  $('.sidr-btn').click(function() {
    $.sidr('close', 'sidr_help');
  });

  // パスの生成
  function getPath(current) {
    let path = $(current).prop('tagName');
    $(current).parents().each(function(index, e) {
      path = `${$(e).prop('tagName')}/${path}`;
    })
    return path;
  }

  // ヘルプツリーの生成
  // parent：XML親要素、parent_node：親HTMLツリー、num：階層数
  function setChildNode(parent, parent_node, num) {
    parent = $(parent);
    //let name = parent.prop('tagName');
    let ch = parent.children();
    if (ch.length !== 0) {
      let subtree =$('<ul></ul>')
      ch.each(function(index, e) {
        //console.log(`${parent.prop('tagName')}:${$(e).prop('tagName')}`);
        let short_name = $(e).prop('tagName');
        let c_name = `${$(e).prop('tagName')} ―― ${$(e).attr('overview')}`;
        if (['outline', 'common', 'edge_flow', 'edge_common'].
          includes($(e).prop('tagName'))) { return true; }

        let c_node = $('<li></li>')
          .attr('data-help', getPath(e));
        if ($(e).children().length === 0) {
          c_node
            .attr('data-jstree', '{ "icon" : "jstree-file" }')
            .text(`#${c_name}`);
        } else {
          c_node.text(c_name);
          if (num < 1 && short_name !== 'scene') {
            c_node.attr('data-jstree', '{ "opened" : true }');
          }
        }
        let alias = $(e).attr('name');
        if (alias) {
          c_node.text(`#${alias} ―― ${$(e).attr('overview')}`);
        }

        subtree.append(c_node);
        if ($(e).children().length !== 0) {
          setChildNode(e, c_node, num + 1);
        }
      });
      $(parent_node).append(subtree);
    } else {
        // ToDo
    }
  }

  // 「hoge/foo」を「hoge > foo」に変換
  function transferQuery(selector) {
    return  selector.replace(/\//g, ' > ');
  }

  // ヘルプバーの生成
  function showHelpBar(selector) {
    // $('#help-tree').jstree(true).deselect_all();
    // $('#help-tree').jstree(true).select_node(
    //   selector.substring(selector.lastIndexOf('/') + 1), false, false);
    //   console.log(selector.substring(selector.lastIndexOf('/') + 1));

    let el = $(transferQuery(selector), ref_data);
    let title = el.prop('tagName');
    if (el.attr('name')) { title = el.attr('name'); }
    let txt = `### ${title} ― ${el.attr('overview')}\n\n`;

    if (el.children().length === 0) {
      txt += el.text();
    } else {
      txt += el.children('outline').text();
    }
    let ref = el.attr('ref');
    if (ref) {
      txt += $(transferQuery(ref), ref_data).text();
    }
    $('#sidr_help > #sidr_help_body').html(marked(txt));

    // 関連リンクの生成
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
        let rel_e = $(transferQuery(exp), ref_data);
        let rel_name = rel_e.attr('name');
        if (!rel_name) {
          rel_name = rel_e.prop('tagName')
        }
        related.push(`<li data-rel="${exp}">
          <span class="ui-icon ui-icon-circle-arrow-e"></span>
          ${rel_name}（${rel_e.attr('overview')}）</li>`);
      });
    }
    $('#sidr_help #sidr_help_related').html(related.join(''));
  }

  let ref_data;
  let tree = $('#sgml_tree_body');
  $.get('./lib/reference.xml')
  .done(function(result){
    ref_data = $(result);
    tree.empty();
    ref_data
      .children()
      .each(function(index, e) {
        let name = `${$(e).prop('tagName')} ―― ${$(e).attr('overview')}`;
        let c_node = $(`<li data-jstree='{ "opened" : true }'>${name}</li>`)
          .attr('data-help', 'scenario');
        tree.append(c_node);
        setChildNode(e, c_node, 0);
        //console.log($(e).prop('tagName'));
      });
    $('#help-tree')
      .on('select_node.jstree', function(e, data) {
        showHelpBar(data.node.data.help);
        // let txt;
        // let el = $(selector, ref_data);
        // if (el.children().length === 0) {
        //   txt = el.text();
        // } else {
        //   txt = el.children('outline').text();
        // }
        // let ref = el.attr('ref');
        // if (ref) {
        //   txt += $(transferQuery(ref), ref_data).text();
        // }
        // $('#sidr_help > #sidr_help_body').html(marked(txt));

        // // 関連リンクの生成
        // let related = [];
        // if (el.attr('related')) {
        //   el.attr('related').split(',').forEach(function(exp) {
        //     let rel_e = $(transferQuery(exp), ref_data);
        //     let rel_name = rel_e.attr('name');
        //     if (!rel_name) {
        //       rel_name = rel_e.prop('tagName')
        //     }
        //     related.push(`<li data-rel="${exp}">
        //       <span class="ui-icon ui-icon-circle-arrow-e"></span>
        //       ${rel_name}（${rel_e.attr('overview')}）</li>`);
        //   });
        // }
        // $('#sidr_help #sidr_help_related').html(related.join(''));

        $.sidr('open', 'sidr_help');          
      })
      .jstree({
        "plugins" : [ "search" ],
        "search" : {
          show_only_matches: true,
          show_only_matches_children: true
        }

      });
      // 検索時の挙動
      let to = false;
      $('#tree_keywd').on('input', function() {
        if(to) { clearTimeout(to); }
        to = setTimeout(function () {
          $('#help-tree').jstree(true)
            .search($('#tree_keywd').val());
        }, 250);
      });
  });

  // ダイナミックヘルプ（関連）
  $('#sidr_help #sidr_help_related').on('click', 'li', function(e) {
    showHelpBar($(this).attr('data-rel'));
  });

    // トースト用Tips
    var tips = [
      '左側のツリーから要素／属性を選択すると、右のサイドバーにヘルプドキュメントが表示されます。',
      'ヘルプツリー上部のテキストボックスからキーワードを入力すると、合致する要素／属性のみ表示されます。',
      '［試作用サンプル］テンプレートでは、あらかじめダミーデータが用意されています。これを書き換えることで、簡単なシナリオを手軽に作成できます。',
      'テストプレイ画面の上部に表示されているのは、デバッグパネルです。シーンidを入力することで、強制的にページを移動できます。',
      'テストプレイ画面の上部に表示されているのは、デバッグパネルです。アイテム／フラグidを入力することで、強制的にステータスを更新できます。',
      'シナリオ開発に慣れてきたら、空のテンプレートがお勧めです。余計なデータが含まれない、最低限の枠組みだけを自動生成してくれます。',
      '提供されている構文ハイライトはXML、Markdownの2種類。タグを編集する場合にはXMLを、テキストを編集する際にはMarkdownを利用します。',
      'GBATはゲームブック作成に特化したクライアントアプリ。Playgroundでは、GBATで作成した.gbatファイルを変換し、エディター上にインポートすることもできます。',
      'Playground Flowに作業環境を切り替えることで、シナリオのフローチャートを生成し、一望できます。最終的なリンクのチェックにどうぞ。',
      'テンプレートには、チュートリアルも用意されています。初めてPlaygroundに触るならば、こちらから確認してみると良いでしょう。',
      'Playground Editorでは、沢山のキーボードショートカットを用意しており、検索／置換はもちろん、行移動、コメントアウト、折り畳み、Undo／Redoなどの操作をキーボードだけで実行できます。',
      '［＜＋＞］ボタンでは、現在のカーソル位置にタグを挿入できます。',
      '［＜＋＞］ボタンでは、リンクや条件分岐も挿入できます。対象となるテキストを選択状態にしてから、メニューをクリックしてみましょう。',
      '［機能テスト］テンプレートでは、ソーサリアン Textの主な機能を網羅したデータが含まれています。詳細な機能を発見し、確認するのに役立つかもしれません。',
      '［ブラウザーに保存］ボタンで保存したデータは、テンプレートの「マイストレージ」から読み出すことができます。',
      '［ブラウザーに保存］ボタンで、現在のシナリオをブラウザーに一時的に保存できます。ただし、きちんと保存するには［ダウンロード］でファイルに保存しましょう。'
    ];
  
    toastr.options.closeButton = true;
    toastr.options.positionClass = 'toast-bottom-full-width';
    toastr.options.showDuration = 300;
    toastr.options.hideDuration = 1000;
    toastr.options.timeOut = 7000;
    toastr.info(tips[Math.floor(Math.random() * tips.length)], 'TIPS');
  
  });