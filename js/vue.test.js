import Vue from 'vue';
let user = new Vue({
    data: function () {
        return {
            name: 'John',
            address: {
                country: 'China',
                city: 'guangzhou'
            }
        };
    },
    created(){
        let json = JSON.stringify(this.$data);
        this.reset = () => {
            Object.assign(this.$data, JSON.parse(json));
        };
    }
});

test('reset deep copied data & trigger the property changed!', (done) => {
    expect(user.address.city).toEqual('guangzhou');//initialed data

    user.address.city = 'hunan';

    expect(user.address.city).toEqual('hunan');

    user.$watch('address.city', (newValue, oldValue) => {
        expect(newValue).toEqual('guangzhou');
        expect(oldValue).toEqual('hunan');
        done();
    });

    user.reset();//reset methods will trigger property changed.
    expect(user.address.city).toEqual('guangzhou');

});