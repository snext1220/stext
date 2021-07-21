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
    editor.commands.addCommand({
        name: 'dynamicHelp',
        bindKey: { win: 'F1',  mac: 'Command-Q' },
        exec: function(editor) {
          var sel = editor.getCopyText();
          if (sel.indexOf('=') !== -1) {
            sel = sel.substring(0, sel.indexOf('='));
          }
          window.open('https://sorcerian.hateblo.jp/entry/2018/11/01/211745#'
            + sel.replace(/[<>=" ]/gi, ''), 'help');
        }
    });
  
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
        'scene': '<scene id="100" items="-i01,i02" flags="f01,f02" enemies="m01,m02" end="happy" se="hoge" result="r01"><![CDATA[\n\n]]></scene>',
        'item': '<item id="i99" name="アイテム名">アイテム説明</item>',
        'flag': '<flag id="f99">フラグ説明</flag>',
        'enemy': '<enemy id="m99" name="モンスター／罠名" element="earth" attack="physics" func="式／回避条件" drop="mon/2">モンスター説明</enemy>',
        'result': '<result id="r01" name="実績名" level="1">実績の説明</result>',
        'work': '<work name="曲名" category="bgm" creator="作者名" url="作品アドレス"></work>',
        'constraint': '<constraint race="FIGHTER,WIZARD" sex="FEMALE" age="YOUNG,ADULT"></constraint>',
        'bgm': '<bgm main="@town02" happy="@field04" bad="@town01"></bgm>',
        'label': '<label free1="" free2="" free3="" />',
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
      return "ページを閉じてもよろしいですか？";
    });
  
    // Editor2Flow
    $('#pg_editor2flow').click(function(e){
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
                  if (['outline', 'common'].includes($(e).prop('tagName'))) { return true; }

                  
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
                      c_node.text(`#${alias}`);
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

      let tree = $('#sgml_tree_body');
      $.get('./lib/reference.xml')
      .done(function(result){
          tree.empty();
          $(result)
              .children()
              .each(function(index, e) {
                  let name = `${$(e).prop('tagName')} ―― ${$(e).attr('overview')}`;
                  let c_node = $(`<li data-jstree='{ "opened" : true }'>${name}</li>`)
                    .attr('data-help', 'scenario');
                  tree.append(c_node);
                  setChildNode(e, c_node, 0);
                  //console.log($(e).prop('tagName'));
              });
          $('#tree-area')
              .on('select_node.jstree', function(e, data) {
                // console.log(data.node.data.help);
                let selector = data.node.data.help.replace(/\//g, ' > ');
                $.get('./lib/reference.xml')
                  .done(function(result) {
                    // console.log($(selector, result).text());
                    let txt;
                    let el = $(selector, result);
                    if (el.children().length === 0) {
                      txt = el.text();
                    } else {
                      console.log(el.children('outline'));
                      txt = el.children('outline').text();
                    }
                    $('#sidr_help > #sidr_help_body').html(marked(txt));
                    $.sidr('open', 'sidr_help');
                  });              
              })
              .jstree();
      });

    // トースト用Tips
    var tips = [
      'エディター上で要素／属性を選択した状態で［F1］キー（macでは［Command］－［Q］）を押すと、対応する要素／属性の説明が別タブで表示されます。',
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