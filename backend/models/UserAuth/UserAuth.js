const { DataTypes } = require("sequelize");
const sequalize = require("../../config/db");

const UserAuthModel = sequalize.define(
  "UserAuth",
  {
    // ======================================================
    // ✅ USER ID
    // ======================================================

    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    // ======================================================
    // ✅ FULL NAME
    // ======================================================

    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Full name is required",
        },
        len: {
          args: [2, 80],
          msg: "Full name must be between 2 and 80 characters",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      lowercase: true,
      validate: {
        isEmail: {
          msg: "Please enter valid email",
        },
        notEmpty: {
          msg: "Email is required",
        },
      },
    },
    // ======================================================
    // ✅ PASSWORD
    // GOOGLE LOGIN USER -> NULL
    // ======================================================
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [6, 100],
          msg: "Password must be minimum 6 characters",
        },
      },
      allowNull: true,
    },
    // ======================================================
    // ✅ PROFILE IMAGE
    // ======================================================

    profileImage: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    profileFolderId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // ======================================================
    // ✅ AUTH PROVIDER
    // ======================================================

    authProvider: {
      type: DataTypes.ENUM("manual", "google"),
      allowNull: false,
      defaultValue: "manual",
    },
    // ======================================================
    // ✅ GOOGLE ID
    // ======================================================

    googleId: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    // ======================================================
    // ✅ USER ROLE
    // ======================================================

    role: {
      type: DataTypes.ENUM("USER", "ADMIN"),
      allowNull: false,
      defaultValue: "USER",
    },
    // ======================================================
    // ✅ ACCOUNT STATUS
    // ======================================================

    accountStatus: {
      type: DataTypes.ENUM("ACTIVE", "BLOCKED", "DELETED"),
      allowNull: false,
      defaultValue: "ACTIVE",
    },
    // ======================================================
    // ✅ EMAIL VERIFIED
    // ======================================================

    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // ======================================================
    // ✅ LAST LOGIN
    // ======================================================

    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // ======================================================
    // ✅ LOGIN COUNT
    // ======================================================

    loginCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    // ======================================================
    // ✅ PASSWORD RESET TOKEN
    // ======================================================

    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // ======================================================
    // ✅ PASSWORD RESET EXPIRE
    // ======================================================

    resetPasswordExpire: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    lastLoginIP: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastActiveAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    failedLoginAttempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    accountLockedUntil: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    refreshToken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
      // unique: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    gender: {
      type: DataTypes.ENUM("Male", "Female", "Other"),
      allowNull: true,
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    preferredLanguage: {
      type: DataTypes.STRING,
      defaultValue: "en",
    },
    lastViewedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    totalWatchTime: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    preferences: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
    },
    lastDeviceInfo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    pushNotificationToken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    subscriptionType: {
      type: DataTypes.ENUM("FREE", "PREMIUM", "VIP"),
      defaultValue: "FREE",
    },
    isProfileCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "user_auths",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["email", "username"],
        name: "unique_user_email_username",
      },
    ],
  },
);

module.exports = UserAuthModel;
