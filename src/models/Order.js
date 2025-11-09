"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    products: [{ productId: String, quantity: { type: Number, default: 1 } }],
    amount: { type: Number, required: true },
    paymentId: String,
    orderId: String,
    status: { type: String, default: 'pending' }, // pending, completed
    createdAt: { type: Date, default: Date.now }
});
exports.Order = (0, mongoose_1.model)('Order', orderSchema);
