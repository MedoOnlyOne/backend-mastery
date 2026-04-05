// imports
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// init
const app = express();
const port = process.env.PORT || 3000;
const ACCESS_SECRET = 'OLJIGYIFVTCHVJHVJKBJJD';
const REFRESH_SECRET = 'HBVKBGUOHONGVJVLVHIKL';
let users = []; // in memory DB


// middleware
app.use(express.json());

// endpoints
app.post('/user', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({message: 'Invalid email or password'});
    }
    const user = users.find((u) => u.email === email);
    if(user) {
        return res.status(400).json({message: 'User already exists'});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({email, password: hashedPassword});
    console.log(users);
    return res.status(201).json({message: 'User created successfully'});
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({message: 'Invalid email or password'});
    }
    const user = users.find((u) => u.email === email);
    if(!user) {
        return res.status(401).json({message: 'Invalid email or password'});
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
        return res.status(401).json({message: 'Invalid email or password'});
    }
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);
    return res.status(200).json({accessToken: accessToken, refreshToken: refreshToken});
});

app.post('/refresh', async (req, res) => {
    const token = req.body.token;
    if (!token) {
        return res.status(400).json({message: 'Invalid token'});
    }
    if (!token) {
        return res.status(400).json({message: 'Invalid token'});
    }
    try {
        const user = jwt.verify(token, REFRESH_SECRET);
        const newAccessToken = createAccessToken(user);
        return res.status(200).json({newAccessToken});
    } catch(err) {
        return res.status(400).json({message: 'Invalid token'});
    }
});

app.get('/me', async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    console.log(token);
    if (!token) {
        return res.status(400).json({message: 'Invalid token'});
    }
    try {
        const user = jwt.verify(token, ACCESS_SECRET);
        return res.status(200).json({email: user.email});
    } catch(err) {
        return res.status(400).json({message: 'Invalid token'});
    }
});

// helper functions
function createAccessToken(user) {
    return jwt.sign({email: user.email}, ACCESS_SECRET, { expiresIn: '1m' });
}
function createRefreshToken(user) {
    return jwt.sign({email: user.email}, REFRESH_SECRET, { expiresIn: '1h' });
}

// run
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});


