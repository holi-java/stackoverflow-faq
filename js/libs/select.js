(function (context, factory) {
    if (typeof module != 'undefined' && typeof module.exports == 'object') {
        module.exports = factory(context);
    } else {
        factory(context, true);
    }
})(window || this, function (context, bind) {
    function promise(executor) {
        return new Promise(executor);
    }

    var $TYPE = 'nodeType', $TEXT = 'textContent', $PARENT = 'parentNode', $NEXT = 'nextSibling', $FIRST = 'firstChild', NIL = {};

    function leaf(node) {
        return node[$TYPE] == 3;
    }

    function next(node, tree) {
        var it = tree ? node[$FIRST] || node[$NEXT] : node[$NEXT];
        if (it) {
            if (leaf(it)) return it;
            return next(it, true);
        }
        var parent = node[$PARENT];
        return parent && next(parent);
    }

    function parent(node) {
        return node[$PARENT];
    }

    function wrap(node, start, end) {
        if (!node) throw 'node is null';
        if (!leaf(node)) throw 'node is not a leaf:' + node.tagName;
        var rawText = node[$TEXT];
        var rawLength = rawText.length;
        var self = {
            node: node,
            text: function (text) {
                if (text !== undefined) {
                    node.textContent = text;
                    return wrap(node, 0, text.length);
                }
                return rawText.substring(self.start(), self.end());
            },
            is: function (other) {
                return node == other.node;
            },
            start: function () {
                return start === NIL || !start ? 0 : start;
            },
            end: function () {
                return end === NIL || !end ? rawLength : end;
            },
            length: function () {
                return self.end() - self.start();
            },
            to: function (end) {
                return wrap(node, self.start(), end.end());
            },
            toLast: function () {
                return wrap(node, start, rawLength);
            },
            next: function () {
                var it = next(node);
                return it && wrap(it);
            },
            split: function () {
                if (self.length() >= rawLength) return self;
                var stack = [0].concat(self.start() || []).concat(self.end()).concat(self.end() != rawLength ? rawLength : []);
                var start = stack.shift();
                var separated = [];
                while (stack.length) {
                    var end = stack.shift();
                    var text = document.createTextNode(rawText.substring(start, end));
                    self.after(text);
                    separated.push(wrap(text));
                    start = end;
                }
                self.remove();
                return !self.start() ? separated[0] : separated[1];
            },
            remove: function (optimized) {
                var parent = node[$PARENT];
                if (optimized && parent.childNodes.length == 1) {
                    parent[$PARENT].removeChild(parent);
                }
                parent.removeChild(node);
                return this;
            },
            merge: function (other) {
                var it = self.split();
                return it.text(other.split().remove(true).text() + it.text());
            },
            after: function (e) {
                node[$PARENT].insertBefore(e, node);
                return this;
            },
            wrap: function (e) {
                e.appendChild(self.split().after(e).node);
            }
        };

        return self;
    }


    function select(start, end) {
        return promise(function (resolve) {
            start = wrap(start.text, start.offset, NIL), end = wrap(end.text, NIL, end.offset);
            var selected = [];
            while (start) {
                if (start.is(end)) {
                    selected.push(start.to(end));
                    break;
                }
                selected.push(start.toLast());
                start = start.next();
            }
            resolve(selected);
        });
    }

    function merge(filter) {
        return function (parts) {
            var result = [parts.shift()];
            while (parts.length) {
                var prev = result.pop();
                var next = parts.shift();
                if (filter(prev.node, next.node)) {
                    result.push(next.merge(prev));
                } else {
                    result.push(prev);
                    result.push(next);
                }
            }
            return result;
        }
    }

    function filter(test) {
        return function (parts) {
            return parts.filter(function (part) {
                return test(part.node);
            });
        }
    }

    function apply(consume) {
        return function (parts) {
            return parts.forEach(function (part) {
                return consume(part);
            });
        }
    }

    var exports = {
        __esModule: true,
        default: select,
        select: select,
        merge: merge,
        filter: filter,
        apply: apply
    };
    if (bind)for (var name in exports)context[name] = exports[name];
    return exports;
});
