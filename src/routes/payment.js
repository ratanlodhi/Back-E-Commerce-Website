"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentController_1 = require("../controllers/paymentController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post('/create-order', auth_1.authenticateToken, paymentController_1.createOrder);
router.post('/verify', paymentController_1.verifyPayment); // Webhook doesn't need auth
exports.default = router;
