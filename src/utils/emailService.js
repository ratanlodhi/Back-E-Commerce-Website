"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOrderConfirmationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const Order_1 = require("../models/Order");
const User_1 = require("../models/User");
const Product_1 = require("../models/Product");
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail', // or your email service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
const sendOrderConfirmationEmail = async (orderId) => {
    try {
        const order = await Order_1.Order.findOne({ orderId });
        if (!order)
            return;
        const user = await User_1.User.findById(order.userId);
        if (!user)
            return;
        const productDetails = await Promise.all(order.products.map(async (item) => {
            const product = await Product_1.Product.findById(item.productId);
            return {
                name: product?.name || 'Unknown Product',
                quantity: item.quantity,
                price: product?.price || 0
            };
        }));
        const emailHtml = `
      <h2>Order Confirmation</h2>
      <p>Dear ${user.name},</p>
      <p>Thank you for your order! Your payment has been successfully processed.</p>
      <h3>Order Details:</h3>
      <ul>
        ${productDetails.map(item => `<li>${item.name} x ${item.quantity} - ₹${item.price * item.quantity}</li>`).join('')}
      </ul>
      <p><strong>Total Amount: ₹${order.amount}</strong></p>
      <p>Order ID: ${order._id}</p>
      <p>If you have any questions, please contact our support team.</p>
      <p>Best regards,<br>Ecom Store Team</p>
    `;
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Order Confirmation - Ecom Store',
            html: emailHtml
        });
        console.log('Order confirmation email sent to:', user.email);
    }
    catch (error) {
        console.error('Error sending email:', error);
    }
};
exports.sendOrderConfirmationEmail = sendOrderConfirmationEmail;
