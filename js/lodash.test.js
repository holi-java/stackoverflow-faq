/**
 * Created by holi on 3/8/17.
 */
import _ from 'lodash';
describe('lodash', () => {
    //@ref http://stackoverflow.com/questions/42662746/return-true-if-value-matches-any-of-nested-object-value/42662883#42662883
    describe('includes', () => {
        var value = {
            foo: 'bar',
            fuzz: 'buzz',
            value2: {
                key: 'value'
            }
        };
        
        function includes(collection, values) {
            return [].concat(values).every((value) => {
                return Object.keys(collection).some((key) => {
                    let it = collection[key];
                    return typeof it == 'object' ? includes(it, value) : _.includes(it, value);
                })
            });
        }

        it('check single value', () => {
            expect(includes(value, 'bar')).toBe(true);
            expect(includes(value, 'baz')).toBe(false);
        });

        it('check multi values', () => {
            expect(includes(value, ['bar', 'buzz'])).toBe(true);
            expect(includes(value, ['baz', 'buzz'])).toBe(false);
        });

        it('check value in depth', () => {
            expect(includes(value, 'value')).toBe(true);
            expect(includes(value, 'no-exists')).toBe(false);
        });
    });
});