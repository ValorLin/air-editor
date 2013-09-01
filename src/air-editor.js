/*!
 * emoji support plugin for AirEditor
 *
 * Copyright(c) 2013 Weilao <qqq123026689@126.com>
 * MIT Licensed
 */
(function (window) {
	var array = [],
		each = array.forEach,
		slice = array.slice;

	var AirEditor = window.AirEditor = function (opts) {
		opts = this.opts = opts || {};
		if ('undefined' === typeof opts.elId) {
			throw('opts.elId is required');
		}

		var elId = this.elId = opts.elId,
			el = this.el = document.getElementById(elId);

		// Set the default html as prevHtml, since we can
		// use preHtml to check if the editor's html has
		// been changed.
		this.prevHtml = this.html();

		// Bind events to detect editor element change.
		el.addEventListener('keyup', this.inputCheck.bind(this));
		el.addEventListener('paste', this.inputCheck.bind(this));
		el.addEventListener('drop', this.inputCheck.bind(this));

		this.initPlugins(opts.plugins || []);
		el.setAttribute('contenteditable', 'true');
		this.trigger('ready', this, opts);
	};

	var proto = AirEditor.prototype;

	proto.plugins = [];
	// Call init functions of the given plugins.
	proto.initPlugins = function (plugins) {
		var editor = this;
		plugins.forEach(function (plugin) {
			editor.plugins.push(plugin);
			plugin.init(editor, editor.opts);
		});
	};

	// Get or set the editor's text.
	proto.text = function (text, opts) {
		if (!arguments.length) {
			return this._getText();
		}

		this._setText(text);
		if (!opts.silent) {
			this.trigger('change', text);
		}
		return this;

	};

	// Get the editor's value in text format.
	proto._getText = function () {
		var character, r,
			editorEl = this.el,
		// To avoid directly change the editor's el, we
		// create an temp element.
			tmpEditorEl = document.createElement('div'),
			childNodes = editorEl.querySelectorAll('div,span,img');
		tmpEditorEl.innerHTML = editorEl.innerHTML;

		each.call(childNodes, function (child) {
			// If there is a data-char attribute in the
			// childNode, replace the childNode with
			// data-char attribute value.
			character = child.getAttribute('data-char');
			if (character) {
				r = new RegExp(child.outerHTML, 'g');
				tmpEditorEl.innerHTML =
					tmpEditorEl.innerHTML.replace(r, character);
			}
		});
		return tmpEditorEl.innerText;
	};

	// Set the editor's value in text format.
	proto._setText = function (text) {
		var r, lines = text.split('\n'),
			firstLine = lines.shift();

		each.call(lines, function (line, i) {
			// Wrap lines with div tag.
			r = new RegExp('(' + line + ')');
			lines[i] = line.replace(r, '<div>$1</div>');

			// If the last line is a empty line, there
			// should be a div which contains a <br> tag.
			if (i !== lines.length - 1 && line === '') {
				lines[i] = '<div><br></div>';
			}
		});
		return this.el.innerHTML = firstLine + lines.join('');
	};

	// Set or get the editor's innerHTML.
	proto.html = function (html, opts) {
		opts = opts || {};
		if (!arguments.length) {
			return this.el.innerHTML;
		}
		this.el.innerHTML = html;
		if (!opts.silent) {
			this.trigger('change', html);
		}
		return this;
	};

	proto.inputCheck = function () {
		var self = this;
		// SetTimeout to delay the check function. If you
		// don't do this, you may got editor's html before
		// event handlers were execute, and after that the
		// editor's html was changed suddenly.
		setTimeout(function () {
			if (self.prevHtml !== self.html()) {
				self.trigger('input');
				self.prevHtml = self.html();
			}
		}, 0);
	};

	/*
	 *  Event part
	 */


	proto._events = {};
	// Add event listener
	proto.on = function (name, callback, scope) {
		var handlers = this._events[name] || (this._events[name] = []);
		handlers.push({
			fn   : callback,
			scope: scope
		});
	};

	// Remove event listener
	proto.off = function (name, targetFn) {
		var handlers = this._events[name],
			targetIndex = -1;
		// Find index of the event handler which has the
		// target function.
		handlers.forEach(function (handler, i) {
			if (handler.fn === targetFn) {
				targetIndex = i;
			}
		});
		// Delete the handler if it was found.
		if (targetIndex !== -1) {
			handlers.splice(targetIndex, 1);
		}
		// When all callback of the event has been deleted,
		// the event should be delete either.
		if (!handlers.length) {
			delete this._events[name];
		}
	};

	// Fire an event
	proto.trigger = function (name) {
		// Arguments without arg1(name)
		var args = slice.call(arguments, 1),
			handlers = this._events[name] || [];
		// Execute all the handler's fn.
		handlers.forEach(function (handler) {
			handler.fn.apply(handler.scope, args);
		});
	};

	var Plugin = AirEditor.Plugin = function () {
		return this;
	};
	Plugin.prototype.init = function () {
		throw('function "Plugin.init()" must be implement in subclasses');
	};


})
	(window);