# SORCERIAN Text (Web-based Gamebook Engine)

Automatically generate game books from scenario data.

People called this plugin.....**Sorcerian Text**.

## Dependencies

- jQuery
- jQuery Markdown
- Sidr
- SmartMenus
- toastr
- Zoombox
- SlickGrid（Playground Flow Only）
- Ace Editor（Playground Flow/Editor）
- vis.js（Playground Flow）
- jQuery UI（Playground Flow/Editor）
- vkBeautify（GBAT2SText only）

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

## Online Preview

https://snext1220.github.io/stext/