/*!
 * emoji support plugin for AirEditor
 *
 * Copyright(c) 2013 Weilao <qqq123026689@126.com>
 * MIT Licensed
 */
(function (_window) {

	var DebugerPlugin = _window.DebugerPlugin = function (opts) {
		opts = opts || {};
		this.globalEditorInstance = opts.globalEditorInstance === false || true;
		return this;
	};
	var proto = DebugerPlugin.prototype = new AirEditor.Plugin();
	proto.init = function (editor) {
		console.log('DebugerPlugin initialized:', arguments);
		this.editor = editor;
		this.initDebugSupport();
	};

	proto.initDebugSupport = function () {
		var editor = this.editor;
		editor.on('input', function () {
			console.log('trigger editor input', editor.text());
		});

		if (this.globalEditorInstance) {
			_window.airEditor = _window.airEditor || editor;
		}
	};


})(window);