"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/order.ts
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/:userId', auth_1.authenticateToken, orderController_1.getUserOrders);
exports.default = router;
