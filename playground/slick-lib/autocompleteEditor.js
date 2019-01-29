
function AutoCompleteEditor(args) {
    var $input;
    var defaultValue;
    var scope = this;
    var calendarOpen = false;
     this.keyCaptureList = [ Slick.keyCode.UP, Slick.keyCode.DOWN, Slick.keyCode.ENTER ];
    this.init = function () {
        $input = $("<INPUT id='tags' class='editor-text' />");
        $input.appendTo(args.container);
        $input.focus().select();
        $input.autocomplete({
            source: args.column.dataSource
        });
    };
    this.destroy = function () {
        $input.autocomplete("destroy");
        $input.remove();
   };
    this.focus = function () {
        $input.focus();
    };
    this.loadValue = function (item) {
        defaultValue = item[args.column.field];
        $input.val(defaultValue);
        $input[0].defaultValue = defaultValue;
        $input.select();
    };
    this.serializeValue = function () {
        return $input.val();
    };
    this.applyValue = function (item, state) {
        item[args.column.field] = state;
    };
    this.isValueChanged = function () {
        return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
    };
    this.validate = function () {
        return {
            valid: true,
            msg: null
        };
    };
    this.init();
  }