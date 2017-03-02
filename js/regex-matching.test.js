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