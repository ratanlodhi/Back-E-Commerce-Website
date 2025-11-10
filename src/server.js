"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const product_1 = __importDefault(require("./routes/product"));
const payment_1 = __importDefault(require("./routes/payment"));
const order_1 = __importDefault(require("./routes/order"));
const Product_1 = require("./models/Product");

dotenv_1.default.config();

const server = () => {
    const app = (0, express_1.default)();
    const PORT = process.env.PORT || 5000;

    // ✅ Allow CORS for your Vercel frontend and localhost for development
    const corsOptions = {
        origin: function (origin, callback) {
            const allowedOrigins = [
                "https://real-time-e-commerce-website-develo.vercel.app",
                "http://localhost:5173"
            ];
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) !== -1) {
                return callback(null, true);
            } else {
                return callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    };
    app.use((0, cors_1.default)(corsOptions));

    // Middleware
    app.use(express_1.default.json());

    // Routes
    app.use('/api/auth', auth_1.default);
    app.use('/api/products', product_1.default);
    app.use('/api/payment', payment_1.default);
    app.use('/api/orders', order_1.default);

    // Connect DB
    mongoose_1.default.connect(process.env.MONGO_URI)
        .then(() => console.log('✅ MongoDB connected'))
        .catch(err => console.error('❌ MongoDB error:', err));

    // Seed products (optional)
    const seedProducts = async () => {
        const count = await Product_1.Product.countDocuments();
        if (count === 0) {
            await Product_1.Product.insertMany([
                { name: 'Wireless Headphones', description: 'High-quality wireless headphones with noise cancellation', price: 150, category: 'Electronics' }
            ]);
            console.log('🛒 Products seeded');
        }
    };

    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        seedProducts();
    });
};

exports.server = server;
