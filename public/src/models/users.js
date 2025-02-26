"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../database/db"));
class User extends sequelize_1.Model {
}
exports.User = User;
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    googleId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true, // Optional Google ID
        unique: false,
    },
    facebookId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true, // Optional Google ID
        unique: false,
    },
    fullname: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true, // ✅ Allows null passwords
    },
}, {
    sequelize: db_1.default,
    paranoid: true, // Enables soft delete
    tableName: "users",
    timestamps: true, // Enables createdAt and updatedAt
});
exports.default = User;
