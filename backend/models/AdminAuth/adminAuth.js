const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const AdminAuth = sequelize.define(
  "AdminAuth",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100), // Size specify செய்வது நல்லது
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // 💡 Optional: Admin role-களை குறிக்க
    role: {
      type: DataTypes.ENUM("super_admin", "moderator", "editor"),
      defaultValue: "moderator",
    },
    // 💡 isActive field-ஐ User Model-இல் இருந்து சேர்த்தல்
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    // ❌ register_date, register_month, register_year fields நீக்கப்பட்டுள்ளன.
    // ✅ அதற்கு பதிலாக, கீழே உள்ள options-இல் உள்ள timestamps: true-ஐப் பயன்படுத்துக.
  },
  {
    timestamps: true,
    tableName: "AdminAuth",
    indexes: [
      {
        unique: true,
        fields: ["email"], // 'email' field-கு Unique key
        name: "admin_email_unique", // Index Name
      },
    ],
  }
);

module.exports = AdminAuth;
