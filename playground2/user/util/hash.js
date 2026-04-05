const bcrypt = require('bcrypt');

function hash(password) {
    return bcrypt.hashSync(password, 10);
}

function comparePassword(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword);
}

module.exports = {
    hashPassword: hash,
    comparePassword
}