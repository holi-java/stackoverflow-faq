function parse(url) {
    var parts = url.match(/^([^#?]*?)?(\?.*?)?(#.*)?$/);
    return {
        uri: parts[1], search: parts[2], hash: parts[3],
        /**
         *
         * @param {string|*} that <b>string</b>/<b>object</b> has `href` property,e.g:location
         * @param {boolean} hash skip hash matching
         * @param {boolean} search  skip search matching
         * @returns {boolean} if url matched return `true`,otherwise return `false`.
         */
        match: function (that, hash, search) {
            var self = this, that = parse(typeof that == 'string' ? that : that.href);
            return (!self.uri || self.uri == that.uri)
                && (search || self.search == that.search)
                && (hash || self.hash == that.hash);
        }
    };
}

module.exports = parse;