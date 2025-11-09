"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProducts = void 0;
const Product_1 = require("../models/Product");
const getProducts = async (_req, res) => {
    try {
        const products = await Product_1.Product.find();
        res.json(products);
    }
    catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getProducts = getProducts;
