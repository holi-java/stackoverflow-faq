(function () {
    var COMPONENT_ID = 'highlight-' + +new Date;
    var highlighter = {
        init: function () {
            this.bindEvents();
        },
        /**
         *
         */
        bindEvents: function () {
            var self = this;
            $('.swatch').on('click', function () {
                $('.swatch').removeClass('active');
                $(this).addClass('active');
            });
            $('.content').mouseup(function () {
                if (self.actived().hasClass('clear')) {
                    self.clear();
                } else {
                    self.highlight();
                }
            });

        },
        actived: function () {
            return $('.swatch.active');
        },
        color: function () {
            return this.actived().css('background-color');
        },
        /**
         *
         */
        highlight: function () {
            var self = this;
            self.run(function (selection) {
                self.select(selection.getRangeAt(0)).//
                then(merge(function (left, right) {
                    var p1 = left.parentNode;
                    var p2 = right.parentNode;

                    var a1 = self.compare(left);
                    var a2 = self.compare(right);
                    return (a1 && a2 && p1.parentNode == p2.parentNode) ||
                        (!a1 && !a2 && p1 == p2) ||
                        (a1 && !a2 && p1.parentNode == p2) ||
                        (!a1 && a2 && p2.parentNode == p1);
                })).then(filter(function (part) {
                    return !self.compare(part);
                })).then(function (parts) {
                    parts.map(function (node) {
                        node.wrap(self.component());
                    });
                }).catch(function (e) {
                    console.log(e);
                });
                selection.removeAllRanges();
            });
        },
        component: function () {
            return $('<span data-toggle="' + COMPONENT_ID + '">').css('background-color', this.color()).get(0);
        },
        compare: function (text) {
            var self = this;
            var parent = $(text).parent();
            var highlighted = parent.is(self.selector());
            var color = parent.css('background-color');
            return highlighted && color == self.color();
        },
        selector: function () {
            return '[data-toggle="?"]'.replace(/\?/, COMPONENT_ID);
        },
        clear: function () {
            var self = this;
            self.run(function (selection) {
                self.select(selection.getRangeAt(0)).then(apply(function (part) {
                    var text = $(part.split().node);
                    while (true) {
                        var comp = text.closest(self.selector());
                        if (!comp || !comp.length) {
                            break;
                        }
                        var children = comp.contents();
                        var first = children[0], last = children[children.length - 1];
                        if (text.is(last)) {
                            comp.after(text);
                        } else if (text.is(first)) {
                            comp.before(text);
                        } else {
                            var heading = comp.clone().empty();
                            for (var i = 0; i < children.length; i++) {
                                if (text.is(children[i])) {
                                    break;
                                }
                                heading.append(children[i]);
                            }
                            comp.before(heading).before(text);
                        }

                        if (first == last) comp.remove();
                    }
                }));
            });
        },
        select: function (range) {
            return select(
                {text: range.startContainer, offset: range.startOffset},
                {text: range.endContainer, offset: range.endOffset}
            );
        },
        run: function (callback) {
            var selection = window.getSelection();
            if (!/^\s*$/.test(selection && selection.toString())) {
                callback.call(this, selection);
                selection.removeAllRanges();
            }
        }
    };

    highlighter.init();

})();