const jwt = require('jsonwebtoken');

const ACCESS_SECRET = 'OLJIGYIFVTCHVJHVJKBJJD';
const REFRESH_SECRET = 'HBVKBGUOHONGVJVLVHIKL';

function createAccessToken(user) {
    return jwt.sign({email: user.email}, ACCESS_SECRET, { expiresIn: '1m' });
}
function createRefreshToken(user) {
    return jwt.sign({email: user.email}, REFRESH_SECRET, { expiresIn: '1h' });
}
function verifyAccessToken(token) {
    return  jwt.verify(token, ACCESS_SECRET);
}
function verifyRefreshToken(token) {
    return  jwt.verify(token, REFRESH_SECRET);
}

module.exports = {
    createAccessToken,
    createRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
}