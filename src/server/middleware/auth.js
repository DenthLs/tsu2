const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');

module.exports = async (req, res, next) => {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        req.user = jwt.verify(token, config.JWT_SECRET);
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};