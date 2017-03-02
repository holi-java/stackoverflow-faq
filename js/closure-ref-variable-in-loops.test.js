/**
 * Created by holi on 3/1/17.
 */
test('closure ref variable defined by `var`', () => {
    let closures = [];
    for (var i = 0; i < 3; i++) {
        closures.push(() => i);
    }

    expect(closures.map(it => it())).toEqual([3, 3, 3]);
});


test('closure ref variable defined by `let`', () => {
    let closures = [];
    for (let i = 0; i < 3; i++) {
        closures.push(() => i);
    }

    expect(closures.map(it => it())).toEqual([0, 1, 2]);
});


test('closure ref variable from outer function', () => {
    let closures = [];
    for (var i = 0; i < 3; i++) {
        let fun = (j) => () => j;
        closures.push(fun(i));
    }

    expect(closures.map(it => it())).toEqual([0, 1, 2]);
});