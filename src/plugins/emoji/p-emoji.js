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
		editor.on('input', function () {
			this.insertEmoji('😎');
		}, this);
	};

	proto.showEmojiPicker = function () {
		alert('showEmojiPicker');
	};


	// Insert a emoji
	// We can not insert a custom image, so we insert a
	// fakeImg, then replace it with our emoji image.
	proto.insertEmoji = function (emojiChar) {
		var editor = this.editor;

		var fakeImgEl,
			fakeImgUrl = '',
			fakeImgRegExp = new RegExp('<img src="' + fakeImgUrl + '">', 'ig');
		document.execCommand('InsertImage', false, fakeImgUrl);
		fakeImgEl = editor.el.querySelector('img[src="' + fakeImgUrl + '"]');

		var unifiedEmojiChar = jEmoji.softbankToUnified(emojiChar),
			emojiImg = jEmoji.unifiedToImage(unifiedEmojiChar);
		fakeImgEl.outerHTML = fakeImgEl.outerHTML.replace(fakeImgRegExp, emojiImg);
	};

//	proto.emojifyContent = function () {
//		var html , text, editor = this.editor;
//		text = editor.text();
//		text = jEmoji.softbankToUnified(text);
//		html = jEmoji.unifiedToHTML(text);
//		editor.text(html, {silent: true});
//	};
})(window);