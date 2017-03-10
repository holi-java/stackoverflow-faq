/**
 * Created by holi on 3/8/17.
 */
import $ from 'jquery';

describe('jquery', () => {
    describe('each', () => {
        test('this', () => {
            let array = [1, 2, 3];
            let result = [];

            $.each(array, function () {
                result.push(this);
            });

            expect(result).toEqual(array);
        });
    });

    describe('map', () => {

        test('array', () => {
            let array = [1, 2, 3];
            let result = $.map(array, function (it) {
                return it;
            });

            expect(result).toEqual(array);
        });
    });
});
