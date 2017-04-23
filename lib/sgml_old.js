(function($) {
  // 一部で使用
  var ROOT = 'gb/';
  var COMMON = 'common/';
  var IMAGES = 'images/';

  // 現在のシーン情報を取得＆画面の生成
  var getScene = function(_this, name, number) {
    $.get(ROOT + name + '.xml')
      .done(function(data) {
         var scene = $('scene[id="' + number + '"]', data);
        _this.text(scene.text());
        _this.markdown();

        // サイコロの表示
        _this.append('<center>' + cube(2) + '</center>');

        // 移動ボタンの整形
        $('a', _this).addClass('scenebtn');
        $('a:has(img)', _this)
          .removeClass('scenebtn')
          .find('img')
          .addClass('scenepic');

        // 現在のフラグ／アイテム情報を取得
        var info = getObject(name + '_info');

        // title属性付きのボタンを非表示
        $('a[title]', _this).hide();
        // 指定のフラグを所持している場合にだけボタンだけを表示
        for (var i = 0; i < info.flags.length; i++) {
          $('a[title="f' + info.flags[i] + '"]', _this).show();
        }
        // 指定のアイテムを所有している場合にだけボタンを表示
        for (var i = 0; i < info.items.length; i++) {
          $('a[title="i' + info.items[i] + '"]', _this).show();
        }

        // フラグ情報を設定
        var flag = scene.attr('flag');
        if (flag) {
          info.flags.push(flag);
          $.unique(info.flags);
        }

        // アイテム情報を設定
        var item = scene.attr('item');
        if (item) {
          info.items.push(item);
          $.unique(info.items);
        }

        // ストレージに反映
        putObject(name + '_info', info);

        // 現在のシーン番号を保存
        localStorage[name] = number;
      })
      .fail(function(xhr, status, error){
        console.log(error);
      });
  };

  // サイコロを生成
  var cube = function(num) {
    if (num === undefined) { num = 1; }
    var html = '';
    for (var i = 0; i < num; i++) {
      var result = Math.ceil(Math.random() * 6);
      html += '<img src="' + ROOT + COMMON +'cube' + result
        + '.png" style="width: 50px"/>';
    }
    return html;
  };

  // ストレージにオブジェクトを保存
  var putObject = function(name, obj) {
    localStorage[name] = JSON.stringify(obj);
  };

  // ストレージからオブジェクトを取得
  var getObject = function(name) {
    return JSON.parse(localStorage[name]);
  };

  $.fn.extend({
    // ゲームの初期化
    startGame: function(name) {
      var _this = this; 
      // 移動ボタンで次のシーンに移動
      _this.on('click', 'a', function(e){
        var num = $(this).attr('href');
        history.pushState(num, 'Scene ' + num);
        getScene(_this, name, num);
        e.preventDefault();
      });

      // ストレージに情報がある場合は続きから再開
      if (localStorage[name]) {
        if (confirm('以前のデータが残っています。\r続きから開始しますか？')) {
          var t_num = localStorage[name];
          getScene(_this, name, t_num);
          history.pushState(t_num, 'Scene ' + t_num);
          return;
        }
      }

      // ストレージに情報がない場合には最初からゲームを開始
      // ゲーム情報を初期化
      var info = { flags:[], items: [] };
      putObject(name + '_info', info);

      // 最初のシーンを取得
      getScene(_this, name, 0);
      history.pushState(0, 'Scene 0');

      // 履歴情報の復帰
      $(window).on('popstate', function(e){
        getScene(_this, name, e.originalEvent.state);
      });
    },
    status: function(name) {
      this.click(function() {
        $.get(ROOT + COMMON + 'dialog.html')
          .done(function(data) {
            $.get(ROOT + name + '.xml')
              .done(function(res) {
                var items = $('items', res);
                var info = getObject(name + '_info');
                var result = '';
                for (var i = 0; i < info.items.length; i++) {
                  var item = info.items[i];
                  result +='<li>' + $('item[id="' + item + '"]', items).text() + '</li>';
                }
                $(data)
                  .find('ul')
                  .append(result)
                  .end()
                  .dialog({
                    width: 400,
                    height: 300,
                    modal: true
                  });
              });
          });
      });
    }
  });
})(jQuery);
