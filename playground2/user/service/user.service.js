const {findUserByEmail, createUser} = require('../repository/user.repository');
const {hashPassword, comparePassword} = require('../util/hash');
const jwt= require('../util/jwt');

async function registerUser(email, password) {
    if (!email || !password) {
        throw new Error('Invalid email or password');
    }
    const existingUser = findUserByEmail(email);
    if (existingUser) {
        throw new Error('User already exists');
    }
    const hashedPassword = await hashPassword(password);
    const user = createUser(email, hashedPassword);
    return user;
}

async function login(email, password) {
    if (!email || !password) {
        throw new Error('Invalid credentials');
    }
    const user = findUserByEmail(email);
    if(!user) {
        throw new Error('Invalid credentials');
    }
    const isMatch = await comparePassword(password, user.password);
    if(!isMatch) {
        throw new Error('Invalid credentials');
    }
    const accessToken = await jwt.createAccessToken(user);
    const refreshToken = await jwt.createRefreshToken(user);
    return {accessToken, refreshToken};
}

async function generateAccessToken(token) {
    if (!token) {
        throw new Error('Invalid token');
    }
    const user = await jwt.verifyRefreshToken(token);
    if(!user) {
        throw new Error('Invalid token');
    }
    const accessToken = await jwt.createAccessToken(user);
    return accessToken;
}

async function getProfile(token) {
    if (!token) {
        throw new Error('Invalid token');
    }
    const user = await jwt.verifyAccessToken(token);
    if(!user) {
        throw new Error('Invalid token');
    }
    return user;
}

module.exports = {
    registerUser,
    login,
    generateAccessToken,
    getProfile
}