"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.sequelize = new sequelize_typescript_1.Sequelize({
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    dialect: "mysql",
    models: [__dirname + "/models"], // Automatically loads all models
    logging: false, // Disable SQL logging
    pool: {
        max: 10, // Max connections
        min: 0, // Min connections
        acquire: 30000, // Max time (ms) to get a connection
        idle: 10000, // Max idle time (ms) before releasing a connection
    },
    retry: {
        max: 3, // Retry failed connections up to 3 times
    },
});
// Test the database connection
exports.sequelize.authenticate()
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.error("Database connection failed:", err));
exports.default = exports.sequelize;
