function SelectEditor(args) {
    var $select;
    var defaultValue;
    var scope = this;

    this.init = function () {
        var option_str = "";
        for( value of args.column.options ){
            option_str += "<OPTION value='" + value +"'>" + value + "</OPTION>";
        }
        $select = $("<SELECT tabIndex='0' class='editor-select'>"+ option_str +"</SELECT>");
        $select.appendTo(args.container);
        $select.focus();
    };

    this.destroy = function () {
        $select.remove();
    };

    this.focus = function () {
        $select.focus();
    };

    this.loadValue = function (item) {
        defaultValue = item[args.column.field];
        $select.val(defaultValue);
    };

    this.serializeValue = function () {
        return $select.val();
    };

    this.applyValue = function (item, state) {
        item[args.column.field] = state;
    };

    this.isValueChanged = function () {
        return ($select.val() != defaultValue);
    };

    this.validate = function () {
        return {
            valid: true,
            msg: null
        };
    };

    this.init();
}