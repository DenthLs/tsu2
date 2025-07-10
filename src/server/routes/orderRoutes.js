const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const router = express.Router();

// Создать заказ
router.post('/', auth, async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod } = req.body;

        // Рассчитать общую сумму и обновить количество товаров
        let total = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: `Product ${item.product} not found` });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Not enough stock for ${product.name}` });
            }

            total += product.price * item.quantity;
            orderItems.push({
                product: item.product,
                quantity: item.quantity,
                price: product.price
            });

            // Обновить количество товара
            product.stock -= item.quantity;
            await product.save();
        }

        const order = new Order({
            user: req.user.id,
            items: orderItems,
            total,
            shippingAddress,
            paymentMethod
        });

        const savedOrder = await order.save();
        res.status(201).json(savedOrder);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Получить заказы пользователя
router.get('/my-orders', auth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).populate('items.product');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;