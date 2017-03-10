describe('back reference', () => {
    it('matching with regex.exec()', () => {
        let source = `foo foo bar word ooh ooh ooh yes`;

        let regex = /(\w+)(?:\W+\1)+\W+(\w+)/g;

        expect(regex.exec(source)[2]).toEqual('bar');
        expect(regex.exec(source)[2]).toEqual('yes');
        expect(regex.exec(source)).toBeNull();
    });
});

describe('time', () => {
    function format(time) {
        return time.replace(/(?:0)?(\d+):(?:0)?(\d+).*/, '$1h $2m');
    }

    it('normal', () => {
        expect(format('22:24:55')).toEqual('22h 24m')
    });

    it('starts with `0`', () => {
        expect(format('02:04:55')).toEqual('2h 4m')
    });
});


describe('format mobile number', () => {
    function format(phoneNumber) {
        return phoneNumber.replace(/\s+/g, '').replace(/(.)(\d{4})(\d)/, '+44 ($1)$2 $3');
    }

    it('mobile format with whitespace', () => {
        expect(format('015395 30612')).toEqual('+44 (0)1539 530612');
    });

    it('mobile format without whitespace', () => {
        expect(format('01539530612')).toEqual('+44 (0)1539 530612');
    });
});

describe('strings', () => {
    let strings = (s) => {
        let regex = /'((?:\\'|[^'])*)'|"((?:\\"|[^"])*)"|[^'"\s]+/g;
        let results = [];
        while (true) {
            let ret = regex.exec(s);
            if (!ret)break;

            results.push((ret[2] || ret[1] || ret[0]).replace(/\\(.)/g, '$1'));
        }
        return results;
    };

    test('split with whitespaces', () => {
        expect(strings('foo bar')).toEqual(['foo', 'bar']);
    });

    test('single-quoted string', () => {
        expect(strings(`'foo' 'bar'`)).toEqual(['foo', 'bar']);
        expect(strings(`'foo bar'`)).toEqual(['foo bar']);
    });

    test('double-quoted string', () => {
        expect(strings(`"foo bar"`)).toEqual(['foo bar'])
        expect(strings(`"foo'bar"`)).toEqual(["foo'bar"])
    });

    test('escape quotes with \\', () => {
        expect(strings(`'foo\\'bar'`)).toEqual(["foo'bar"])
        expect(strings(`"foo\\"bar"`)).toEqual(['foo"bar'])
    });

    test('complex example', () => {
        let source = `abc 111 'ddd ee' ffff '123 45' end`;
        expect(strings(source)).toEqual(['abc', '111', 'ddd ee', 'ffff', '123 45', 'end']);
    });
});


describe('replace variables', function () {
    function format(tpl, binding) {
        if (typeof binding != 'function') return format(tpl, function (_, name) {
            return binding[name];
        });
        return tpl.replace(/\$(\w+)/g, binding);
    }

    const tpl = "<a href='$site/$path'>$path</a>";
    const options = {site: 'example.com', path: 'home'};

    it('replace with lazy binding function', () => {
        let link = format(tpl, function (_, name) {
            return options[name];
        });

        expect(link).toEqual("<a href='example.com/home'>home</a>");
    });

    it('replace with variables binding', () => {
        expect(format(tpl, options)).toEqual("<a href='example.com/home'>home</a>");
    });
});


function merge(url, params, rest) {
    var params = typeof params == 'object' ? params : Object.defineProperty({}, params, {
                enumerable: true,
                value: rest
            }),
        parts = url.split(/\?/), host = parts.shift(), query = parts.join(''),
        regSymbols = /[.?*+^$[\]\\(){}|-]/g;

    for (var name in params) {
        var value = encodeURIComponent(params[name]),
            rawName = name.replace(regSymbols, "\\$&"),
            name = encodeURIComponent(name);

        var ret = query.replace(new RegExp('((?:^|&)(?:' + (name + '|' + rawName) + ')=)([\\w%]+)'), "$1" + value);

        query = ret != query ? ret : [query, name + "=" + value].join(query ? '&' : '');
    }

    return query ? host + '?' + query : host;
}

describe('merge parameter', () => {

    it('starts with ?', () => {
        expect(merge('www.example.com?foo=bar', 'foo', 'baz'))
            .toEqual('www.example.com?foo=baz');
    });

    it('starts with &', () => {
        expect(merge('www.example.com?id=1&foo=bar', 'foo', 'baz'))
            .toEqual('www.example.com?id=1&foo=baz');
    });

    it('no params', () => {
        expect(merge('www.example.com', 'foo', 'baz'))
            .toEqual('www.example.com?foo=baz');
    });

    it('add param if param is missing', () => {
        expect(merge('www.example.com?id=1', 'foo', 'baz'))
            .toEqual('www.example.com?id=1&foo=baz');
    });

    it('merge encoded param value', () => {
        expect(merge('www.example.com?foo=bar%20baz', 'foo', 'baz'))
            .toEqual('www.example.com?foo=baz');
    });

    it('merge encoded param name', () => {
        expect(merge('www.example.com?foo%20value=bar', 'foo value', 'baz'))
            .toEqual('www.example.com?foo%20value=baz');
    });

    it('merge with encoded param', () => {
        expect(merge('www.example.com?foo=bar', 'foo', 'bar baz'))
            .toEqual('www.example.com?foo=bar%20baz');
    });

    it('add encoded param', () => {
        expect(merge('www.example.com', 'foo', 'bar baz'))
            .toEqual('www.example.com?foo=bar%20baz');
    });

    it('merge multi-params', () => {
        expect(merge('www.example.com', {foo: 'bar', fuzz: 'buzz'}))
            .toEqual('www.example.com?foo=bar&fuzz=buzz');
    });

    it('return URL must be consistent when replace url with empty params if url with no params', () => {
        expect(merge('www.example.com', {}))
            .toEqual('www.example.com');
    });

    it('merge param with brackets', () => {
        expect(merge('www.example.com?[foo]=bar', '[foo]', 'baz'))
            .toEqual('www.example.com?[foo]=baz');
    });
});


describe('matching address', () => {
    const regex = /^Newsletter pour (?:\s*(\w+(?: \w+)*) )?<?((\S+)@(([^.]+)\.[^>]+))>?\s*$/i;


    test('address without header', () => {
        let result = "Newsletter pour ome@yahoo.com".match(regex);

        expect(result[1]).toBeUndefined();
        expect(result[2]).toEqual('ome@yahoo.com');
        expect(result[3]).toEqual('ome');
        expect(result[4]).toEqual('yahoo.com');
        expect(result[5]).toEqual('yahoo');
    });

    test('email without sharps', () => {
        let result = "Newsletter pour ome ome@yahoo.com".match(regex);
        expect(result[1]).toEqual('ome');
        expect(result[2]).toEqual('ome@yahoo.com');
    });

    test('email enclosed with sharps', () => {
        let result = "Newsletter pour ome <ome@yahoo.com>".match(regex);

        expect(result[1]).toEqual('ome');
        expect(result[2]).toEqual('ome@yahoo.com');
    });

    test('header includes whitespaces', () => {
        let result = "Newsletter pour ome sanni john ome@yahoo.com".match(regex);

        expect(result[1]).toEqual('ome sanni john');
        expect(result[2]).toEqual('ome@yahoo.com');
    });

    test('header includes whitespaces & email eclosed with sharps', () => {
        let result = "Newsletter pour ome sanni john <ome@yahoo.com>".match(regex);

        expect(result[1]).toEqual('ome sanni john');
        expect(result[2]).toEqual('ome@yahoo.com');
    });
});


