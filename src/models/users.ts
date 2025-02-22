import { Model, DataTypes } from "sequelize";
import sequelize from "../database/db";

export class User extends Model {
  public id!: number;
  public googleId?: string;
  public facebookId?:string
  public fullname!: string;
  public email!: string;
  public password?: string; // Optional password field
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    googleId: {
      type: DataTypes.STRING,
      allowNull: true, // Optional Google ID
      unique: true,
    },
    facebookId: {
      type: DataTypes.STRING,
      allowNull: true, // Optional Google ID
      unique: true,
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true, // ✅ Allows null passwords
    },
  },
  {
    sequelize,
    paranoid: true, // Enables soft delete
    tableName: "users",
    timestamps: true, // Enables createdAt and updatedAt
  }
);

export default User;
