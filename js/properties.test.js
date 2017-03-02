test('use [name] set dynamic properties into object', () => {
    let name = `n` + new Date;
    let foo = {};

    foo[name] = 'bar';

    expect(foo[name]).toEqual('bar');
});