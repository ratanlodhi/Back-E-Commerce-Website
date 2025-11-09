"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserOrders = void 0;
const Order_1 = require("../models/Order");
const Product_1 = require("../models/Product");
const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await Order_1.Order.find({ userId }).sort({ createdAt: -1 });
        // Populate product details
        const populatedOrders = await Promise.all(orders.map(async (order) => {
            const products = await Promise.all(order.products.map(async (item) => {
                const product = await Product_1.Product.findById(item.productId);
                return { ...product?.toObject(), quantity: item.quantity };
            }));
            return { ...order.toObject(), products };
        }));
        res.json(populatedOrders);
    }
    catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getUserOrders = getUserOrders;
