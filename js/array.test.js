describe('duration between siblings', () => {
    function duration(timestamps) {
        var last = timestamps.pop();
        var durations = [];
        while (timestamps.length) {
            durations.push(last - (last = timestamps.pop()));
        }
        return durations.reverse();
    }


    it('pair', () => {
        expect(duration([1, 3])).toEqual([2]);
    });

    it('three', () => {
        expect(duration([1, 3, 7])).toEqual([2, 4]);
    });
});