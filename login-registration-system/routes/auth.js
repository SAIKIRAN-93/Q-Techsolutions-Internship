const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET Routes
router.get('/', (req, res) => {
    res.redirect('/login');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/dashboard', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.render('dashboard', { user: req.session.user });
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// POST Routes
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [
                { email: email }, 
                { username: username }
            ] 
        });
        
        if (existingUser) {
            return res.status(400).send('User already exists');
        }

        // Create new user with plain text password
        const newUser = new User({
            username: username,
            email: email,
            password: password  // Plain text password
        });

        await newUser.save();
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error registering user');
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user with exact email and password match
        const user = await User.findOne({
            email: email,
            password: password  // Plain text password comparison
        });

        if (!user) {
            return res.status(400).send('Invalid email or password');
        }

        req.session.user = user;
        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error logging in');
    }
});

module.exports = router;