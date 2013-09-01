/*!
 * emoji support plugin for AirEditor
 *
 * Copyright(c) 2013 Weilao <qqq123026689@126.com>
 * MIT Licensed
 */
(function (window) {
	var EmojiPlugin = window.EmojiPlugin = function () {
		return this;
	};
	var proto = EmojiPlugin.prototype = new AirEditor.Plugin();
	proto.init = function (editor) {
		this.editor = editor;
	};

	proto.showEmojiPicker = function () {
		// TODO this is the next step
		alert('showEmojiPicker');
	};


	// Insert a emoji
	// We can not insert a custom image directly, so we insert
	// a fakeImg instead, then replace it with our emoji image.
	proto.insertEmoji = function (emojiChar) {
		var editor = this.editor;
		var fakeImgEl,
			fakeImgUrl = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
			fakeImgRegExp = new RegExp('<img src="' + fakeImgUrl + '">', 'ig');

		editor.focus();
		document.execCommand('InsertImage', false, fakeImgUrl);
		fakeImgEl = editor.el.querySelector('img[src="' + fakeImgUrl + '"]');

		var unifiedEmojiChar = jEmoji.softbankToUnified(emojiChar),
			emojiImg = jEmoji.unifiedToImage(unifiedEmojiChar);
		fakeImgEl.outerHTML = fakeImgEl.outerHTML.replace(fakeImgRegExp, emojiImg);
		editor.trigger('input');
		editor.focus();
	};
})(window);