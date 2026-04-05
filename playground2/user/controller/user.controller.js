const userService = require('../service/user.service');

async function registerUser(req, res, next) {
    const{email, password} = req.body;
    try{
        const user = await userService.registerUser(email, password);
        return res.status(201).json({email: user.email});
    } catch (err) {
        return res.status(400).json({message: err.message});
    }
}

async function login(req, res, next) {
    const{email, password} = req.body;
    try{
        const tokens = await userService.login(email, password);
        return res.status(200).json(tokens);
    } catch (err) {
        return res.status(401).json({message: err.message});
    }
}

async function generateAccessToken(req, res, next) {
    const token = req.body.token;
    try {
        const newAccessToken = await userService.generateAccessToken(token);
        return res.status(200).json({newAccessToken});
    } catch (err) {
        return res.status(401).json({message: err.message});
    }
}

async function getProfile(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    try{
        const user = await userService.getProfile(token);
        return res.status(200).json({email: user.email});
    } catch (err) {
        return res.status(401).json({message: err.message});
    }
}

module.exports = {
    registerUser,
    login,
    generateAccessToken,
    getProfile
}