const express = require('express');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin'); // Новый middleware для админов
const Product = require('../models/Product');
const User = require('../models/User');
const upload = require('../utils/fileUpload');
const Order = require('../models/Order');
const router = express.Router();

router.use(auth, admin);

router.get('/check-access', (req, res) => {
    res.json({ message: 'Access granted', user: req.user });
});

router.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/product', upload.single('image'), async (req, res) => {
    const { name, price, description, category, stock } = req.body;
    const product = new Product(
        {
            name,
            price,
            description,
            category,
            stock,
            image: req.file ? `/uploads/${req.file.filename}` : null
        }
    );
    await product.save();
    res.status(201).json(product);
});

router.get('/users', async (req, res) => {
    const users = await User.find().select('-password');
    res.json(users);
});

router.put('/users/:id/permissions', async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.params.id,
        { isAdmin: req.body.isAdmin },
        { new: true }
    ).select('-password');
    res.json(user);
});

router.get('/orders', async (req, res) => {
    const orders = await Order.find().populate('user', 'name email').populate('items.product', 'name price');
    res.json(orders);
});

module.exports = router;