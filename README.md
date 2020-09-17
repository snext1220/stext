# SORCERIAN Text (Web-based Gamebook Engine) ![](https://img.shields.io/github/v/release/snext1220/stext)

Automatically generate game books from scenario data.

People called this plugin.....**Sorcerian Text**.

## Dependencies

- [jQuery](https://jquery.com/)
- [jQuery Markdown](https://github.com/taknakamu/jquery-markdown)
- [Sidr](https://www.berriart.com/sidr/)
- [SmartMenus](https://www.smartmenus.org/)
- [toastr](https://github.com/CodeSeven/toastr)
- [Zoombox](http://grafikart.github.io/Zoombox/)
- [JavaScript Cookie](https://github.com/js-cookie/js-cookie)
- [jQuery SelectBox](https://github.com/marcj/jquery-selectBox)
- [SlickGrid（Playground Flow）](https://slickgrid.net/)
- [Ace Editor（Playground Flow/Editor）](https://ace.c9.io/)
- [vis.js（Playground Flow）](https://visjs.org/)
- [jQuery UI（Playground Flow/Editor）](https://jqueryui.com/)
- [vkBeautify（GBAT2SText）](https://github.com/vkiryukhin/vkBeautify)

## Example

```javascript
$(function() {
  // Run Scenario（Production Mode）
  $('#main').startGame('scepter');

  // Run Scenario（Debug Mode：display debug panel）
  $('#main').startGame('scepter', true);

  // GBAT2SText（Download converted code）
  $('#gbat').gbat2stext();

  // GBAT2SText（Param: Converted code）
  $('#gbat').gbat2stext(function(result) {
    ...Process the converted code...
  });

  // Save data backup (Param: selector for scenario code)
  $('#backup').backupData('#scenario');
  
  // Save data restore
  $('#restore').restoreData();
});
```

## Manual

+ https://sorcerian.hateblo.jp/entries/2017/12/21 (For Developer)
+ https://sorcerian.hateblo.jp/entries/2017/12/20 (For Player)

## Online Preview

https://snext1220.github.io/stext/
