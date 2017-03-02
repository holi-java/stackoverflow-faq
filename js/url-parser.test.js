import parse from './libs/url-parser';
describe('parse url', () => {
    const normalize = (url) => {
        let result = parse(url);
        delete result.match;
        return result;
    };

    it('without hash & search', () => {
        expect(normalize('http://www.baidu.com')).toEqual({uri: 'http://www.baidu.com'});
    });

    it('with hash', () => {
        expect(normalize('http://www.baidu.com#hash')).toEqual({
            uri: 'http://www.baidu.com',
            hash: '#hash'
        });
    });

    it('with hash', () => {
        expect(normalize('http://www.baidu.com#hash')).toEqual({
            uri: 'http://www.baidu.com',
            hash: '#hash'
        });
    });

    it('with search', () => {
        expect(normalize('http://www.baidu.com?foo=bar')).toEqual({
            uri: 'http://www.baidu.com',
            search: '?foo=bar'
        });
    });

    it('both search & hash', () => {
        expect(normalize('http://www.baidu.com?foo=bar#hash')).toEqual({
            uri: 'http://www.baidu.com',
            search: '?foo=bar',
            hash: '#hash'
        });
    });

    it('hash only', () => {
        expect(normalize('#hash')).toEqual({hash: '#hash'});
    });

    it('search only', () => {
        expect(normalize('?foo=bar')).toEqual({search: '?foo=bar'});
    });
});

describe('match url', () => {
    it('matched with string `href`', () => {
        let href = 'http://www.baidu.com?foo=bar#hash';
        expect(parse(href).match(href)).toBe(true);
    });

    it('matched with object contains `href` attribute', () => {
        let href = 'http://www.baidu.com?foo=bar#hash';
        expect(parse(href).match({href: href})).toBe(true);
    });

    it('no href', () => {
        expect(parse('?foo=bar#hash').match('http://www.baidu.com?foo=bar#hash')).toBe(true);
    });

    it('exclude hash', () => {
        expect(parse('?foo=bar').match('http://www.baidu.com?foo=bar#hash', true)).toBe(true);
    });

    it('exclude search', () => {
        expect(parse('#hash').match('http://www.baidu.com?#hash', false, true)).toBe(true);
    });

});