test(`proxy callback receive arguments from others`, () => {
    let o = {foo: 'bar'};

    function get(target, callback) {
        return callback(target);
    }

    function foo(o) {
        return o.foo;
    }

    function proxy(callback) {
        return (o) => {
            return `proxy::${callback(o)}`;
        };
    }

    expect(get(o, foo)).toEqual('bar');
    expect(get(o, proxy(foo))).toEqual('proxy::bar');
});