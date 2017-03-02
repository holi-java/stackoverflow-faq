const validate = require('./libs/email-validator');

test('valid', () => {
    expect(validate('holi@qq.com')).toHaveLength(0);
});

test('no `@` is invalid', () => {
    expect(validate('holi')).toEqual(['`@`', 'domain']);
});


test('no domain is invalid', () => {
    expect(validate('holi@')).toEqual(['domain']);
});

test('no username is invalid', () => {
    expect(validate('@qq.com')).toEqual(['username']);
});