describe('decalration lifting up', () => {
    test('variable not lifting up', () => {
        let foo = bar;
        let bar = () => {};

        expect(foo).toBeUndefined();
    });

    test('function lifting up', () => {
        let foo = bar;
        function bar(){};

        expect(foo).toEqual(expect.any(Function));
    });
});