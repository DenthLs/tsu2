const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');

module.exports = async (req, res, next) => {
    // Получить токен из заголовка


    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Верифицировать токен
        req.user = jwt.verify(token, config.JWT_SECRET); /*await User.findById(decoded.id).select('-password');*/
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};