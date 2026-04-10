const {findUserByEmail, createUser} = require('../repository/user.repository');
const {hashPassword, comparePassword} = require('../util/hash');
const {UserAlreadyExists, InvalidCredentials, InvalidToken} = require('../UserErrors');
const jwt= require('../util/jwt');

async function registerUser(email, password) {
    if (!email || !password) {
        throw InvalidCredentials;
    }
    const existingUser = findUserByEmail(email);
    if (existingUser) {
        throw UserAlreadyExists;
    }
    const hashedPassword = await hashPassword(password);
    const user = createUser(email, hashedPassword);
    return user;
}

async function login(email, password) {
    if (!email || !password) {
        throw InvalidCredentials;
    }
    const user = findUserByEmail(email);
    if(!user) {
        throw InvalidCredentials;
    }
    const isMatch = await comparePassword(password, user.password);
    if(!isMatch) {
        throw InvalidCredentials;
    }
    const accessToken = await jwt.createAccessToken(user);
    const refreshToken = await jwt.createRefreshToken(user);
    return {accessToken, refreshToken};
}

async function generateAccessToken(token) {
    if (!token) {
        throw InvalidToken;
    }
    const user = await jwt.verifyRefreshToken(token);
    if(!user) {
        throw InvalidToken;
    }
    const accessToken = await jwt.createAccessToken(user);
    return accessToken;
}

async function getProfile(token) {
    if (!token) {
        throw InvalidToken;
    }
    const user = await jwt.verifyAccessToken(token);
    if(!user) {
        throw InvalidToken;
    }
    return user;
}

module.exports = {
    registerUser,
    login,
    generateAccessToken,
    getProfile
}