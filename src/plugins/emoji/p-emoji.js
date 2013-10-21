/*!
 * emoji support plugin for AirEditor
 *
 * Copyright(c) 2013 Weilao <qqq123026689@126.com>
 * MIT Licensed
 */
(function (_window) {

    var EmojiPlugin = _window.EmojiPlugin = function () {
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
        var editor, fakeImgEl, fakeImgRegExp,
            fakeImgUrl, unifiedEmojiChar, emojiImg;

        editor = this.editor;
        fakeImgUrl = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
        editor.focus();

        document.execCommand('InsertImage', false, fakeImgUrl);
        fakeImgEl = editor.el.querySelector('img[src="' + fakeImgUrl + '"]');

        unifiedEmojiChar = jEmoji.softbankToUnified(emojiChar);
        emojiImg = jEmoji.unifiedToImage(unifiedEmojiChar);
        fakeImgRegExp = new RegExp(fakeImgEl.outerHTML, 'ig');
        fakeImgEl.outerHTML = fakeImgEl.outerHTML.replace(fakeImgRegExp, emojiImg);
        editor.trigger('input');
        editor.focus();
    };

})(window);