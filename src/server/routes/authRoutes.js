const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const config = require('../config');
const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({ email, password, name });
        await user.save();

        const token = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ token, user: { id: user._id, email: user.email, name: user.name } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user._id, email: user.email, name: user.name, isAdmin: user.isAdmin } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

router.get('/verify', (req, res) => {
    res.json({ valid: true, user: req.user });
});

module.exports = router;