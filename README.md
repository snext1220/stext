# jQuery SGML（Sorcerian Gamebook Markup Language）plugin

Automatically generate game books from scenario data.

People called this plugin.....**Sorcerian Text**.

## Dependencies

- jQuery
- jQuery Markdown
- Zoombox
- vkBeautify（GBAT2SText only）

## Example

```
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
