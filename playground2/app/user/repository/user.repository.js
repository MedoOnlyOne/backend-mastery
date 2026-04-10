const {users} = require('../model/user.model');

function findUserByEmail (email) {
    return users.find((u) => u.email === email);
}

function createUser(email, hashedPassword) {
    const user = {email, password: hashedPassword};
    users.push(user);
    return user;
}

module.exports = {
    findUserByEmail,
    createUser
};