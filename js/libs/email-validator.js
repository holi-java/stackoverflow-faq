function validate(email) {
    var fields = ['username', '`@`', 'domain'];
    return email.match(/^(\w*)(@?)(.*)$/).slice(1).reduce(function (errors, value, which) {
        if (!value) errors.push(fields[which]);
        return errors;
    }, []);
}

module.exports = validate;

