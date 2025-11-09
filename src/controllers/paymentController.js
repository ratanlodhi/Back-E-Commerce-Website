"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPayment = exports.createOrder = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const Order_1 = require("../models/Order");
const emailService_1 = require("../utils/emailService");
const getRazorpayInstance = () => {
    return new razorpay_1.default({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    });
};
const createOrder = async (req, res) => {
    try {
        const { amount, userId, products } = req.body; // amount in **paisa**
        const options = {
            amount: amount * 100, // Razorpay expects paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };
        const razorpayInstance = getRazorpayInstance();
        const razorpayOrder = await razorpayInstance.orders.create(options);
        // Save order as pending
        const order = new Order_1.Order({
            userId,
            products,
            amount,
            orderId: razorpayOrder.id,
            status: 'pending'
        });
        await order.save();
        res.json({
            orderId: razorpayOrder.id,
            currency: razorpayOrder.currency,
            amount: razorpayOrder.amount
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Payment initiation failed' });
    }
};
exports.createOrder = createOrder;
const verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } = req.body;
    // Verify signature (basic example)
    const crypto = require('crypto');
    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    shasum.update(razorpay_order_id + "|" + razorpay_payment_id);
    const digest = shasum.digest('hex');
    if (digest !== razorpay_signature) {
        return res.status(400).json({ error: 'Invalid signature' });
    }
    // Update order
    await Order_1.Order.findOneAndUpdate({ orderId: razorpay_order_id }, { paymentId: razorpay_payment_id, status: 'completed' });
    // Send order confirmation email
    await (0, emailService_1.sendOrderConfirmationEmail)(razorpay_order_id);
    res.json({ success: true });
};
exports.verifyPayment = verifyPayment;
