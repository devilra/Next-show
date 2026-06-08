// ======================================================
// ✅ USER AUTH CONTROLLER
// FILE: controllers/UserAuthController/UserAuthController.js
// ======================================================

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const UserAuthModel = require("../../models/UserAuth/UserAuth");
const fs = require("fs");
const path = require("path");
const sequelize = require("../../config/db");

// ======================================================
// ✅ GOOGLE CLIENT
// ======================================================
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ======================================================
// ✅ GENERATE JWT TOKEN
// ======================================================
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
};

// ======================================================
// ✅ COOKIE OPTIONS
// ======================================================
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// ======================================================
// ✅ MANUAL SIGNUP
// ======================================================
exports.manualSignup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const cleanFullName = fullName?.trim();
    const cleanEmail = email?.trim()?.toLowerCase();
    const cleanPassword = password?.trim();

    // ======================================================
    // ✅ VALIDATION
    // ======================================================

    if (!cleanFullName || !cleanEmail || !cleanPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ======================================================
    // ✅ PASSWORD LENGTH
    // ======================================================
    if (cleanPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // ======================================================
    // ✅ EMAIL CHECK
    // ======================================================
    const existingUser = await UserAuthModel.findOne({
      where: {
        email: cleanEmail,
      },
    });

    // ======================================================
    // ✅ DUPLICATE EMAIL
    // ======================================================

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // ======================================================
    // ✅ HASH PASSWORD
    // ======================================================
    const hashedPassword = await bcrypt.hash(cleanPassword, 10);
    // ======================================================
    // ✅ CREATE USER
    // ======================================================
    const newUser = await UserAuthModel.create({
      fullName: cleanFullName,
      email: cleanEmail,
      password: hashedPassword,
      authProvider: "manual",
      isEmailVerified: false,
      loginCount: 1,
      lastLoginAt: new Date(),
    });

    // ======================================================
    // ✅ TOKEN
    // ======================================================

    const token = generateToken(newUser);
    // ======================================================
    // ✅ AUTO LOGIN AFTER SIGNUP
    // ======================================================
    res.cookie("userToken", token, cookieOptions);

    return res.status(201).json({
      success: true,
      message: "Signup successful",
      // token,
      user: {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
        profileImage: newUser.profileImage,
      },
    });
  } catch (error) {
    console.log("MANUAL SIGNUP ERROR", error);

    // ======================================================
    // ✅ SEQUELIZE UNIQUE ERROR
    // ======================================================
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }
    // ======================================================
    // ✅ NETWORK / SERVER ERROR
    // ======================================================
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// ======================================================
// ✅ MANUAL LOGIN
// ======================================================

exports.manualLogin = async (req, res) => {
  console.log("manual login", req.body);
  try {
    const { email, password } = req.body;

    const cleanEmail = email?.trim()?.toLowerCase();
    const cleanPassword = password?.trim();

    // ======================================================
    // ✅ VALIDATION
    // ======================================================
    if (!cleanEmail || !cleanPassword) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }
    // ======================================================
    // ✅ FIND USER
    // ======================================================
    const user = await UserAuthModel.findOne({
      where: {
        email: cleanEmail,
      },
    });
    // ======================================================
    // ✅ USER NOT FOUND
    // ======================================================
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    // ======================================================
    // ✅ GOOGLE ACCOUNT CHECK
    // ======================================================
    if (user.authProvider === "google") {
      return res.status(400).json({
        success: false,
        message: "Please continue with Google login",
      });
    }

    // ======================================================
    // ✅ ACCOUNT STATUS
    // ======================================================

    if (user.accountStatus !== "ACTIVE") {
      return res.status(403).json({
        success: false,
        message: "Account blocked",
      });
    }
    // ======================================================
    // ✅ PASSWORD CHECK
    // ======================================================
    const isPasswordMatch = await bcrypt.compare(cleanPassword, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    // ======================================================
    // ✅ UPDATE LOGIN INFO
    // ======================================================
    user.lastLoginAt = new Date();
    user.loginCount += 1;
    await user.save();

    // ======================================================
    // ✅ TOKEN
    // ======================================================
    const token = generateToken(user);
    // ======================================================
    // ✅ LOGIN COOKIE
    // ======================================================
    res.cookie("userToken", token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      // token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.log("MANUAL LOGIN ERROR", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// ======================================================
// ✅ GOOGLE LOGIN / SIGNUP
// ======================================================

exports.googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    // console.log("Credential", credential);
    // ======================================================
    // ✅ TOKEN REQUIRED
    // ======================================================
    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential missing",
      });
    }
    // ======================================================
    // ✅ VERIFY TOKEN
    // ======================================================
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    // ======================================================
    // ✅ GOOGLE DATA
    // ======================================================
    const payload = ticket.getPayload();
    const googleId = payload.sub;
    const email = payload.email?.toLowerCase();
    const fullName = payload.name;
    const profileImage = payload.picture;
    const emailVerified = payload.email_verified;

    // ======================================================
    // ✅ FIND USER
    // ======================================================
    let user = await UserAuthModel.findOne({
      where: {
        email,
      },
    });

    // ======================================================
    // ✅ NEW USER -> AUTO SIGNUP
    // ======================================================
    // ======================================================
    // ✅ NEW USER -> AUTO SIGNUP
    // ======================================================

    if (!user) {
      user = await UserAuthModel.create({
        fullName,
        email,
        googleId,
        profileImage,
        authProvider: "google",
        isEmailVerified: emailVerified,
        loginCount: 1,
        lastLoginAt: new Date(),
      });
    }
    // ======================================================
    // ✅ EXISTING MANUAL ACCOUNT
    // ======================================================
    else if (user.authProvider === "manual" && !user.googleId) {
      user.googleId = googleId;
      user.profileImage = user.profileImage || profileImage;
      // user.lastLoginAt = new Date();
      // user.loginCount += 1;
      await user.save();
    }
    // ======================================================
    // ✅ BLOCKED USER
    // ======================================================
    if (user.accountStatus !== "ACTIVE") {
      return res.status(403).json({
        success: false,
        message: "Account blocked",
      });
    }
    // ======================================================
    // ✅ UPDATE LOGIN
    // ======================================================
    user.lastLoginAt = new Date();
    user.loginCount += 1;
    await user.save();
    // ======================================================
    // ✅ JWT TOKEN
    // ======================================================
    const token = generateToken(user);
    // ======================================================
    // ✅ AUTO LOGIN
    // ======================================================
    res.cookie("userToken", token, cookieOptions);
    return res.status(200).json({
      success: true,
      message: "Google login successful",
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.log("GOOGLE LOGIN ERROR", error);
    // ======================================================
    // ✅ GOOGLE TOKEN ERROR
    // ======================================================
    if (
      error.message?.includes("Token used too late") ||
      error.message?.includes("Wrong number of segments")
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid Google token",
      });
    }
    // ======================================================
    // ✅ NETWORK ERROR
    // ======================================================
    return res.status(500).json({
      success: false,
      message: "Google login failed",
      error: error.message,
    });
  }
};

// ======================================================
// ✅ LOGOUT
// ======================================================
exports.logoutUser = async (req, res) => {
  // console.log("Logout Calling");
  try {
    res.clearCookie("userToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Logout failed",
      error: error.message,
    });
  }
};

// ======================================================
// ✅ GET CURRENT USER
// ======================================================
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await UserAuthModel.findByPk(req.user.id, {
      attributes: [
        "id",
        "fullName",
        "email",
        "username",
        "gender",
        "profileImage",
        "role",
        "isEmailVerified",
        "accountStatus",
        "lastLoginAt",
        "lastActiveAt",
        "dateOfBirth",
      ],
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: "Failed to fetch user",
    });
  }
};

exports.updateProfileImage = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    // ======================================================
    // ✅ CURRENT USER ID
    // ======================================================
    const userId = req.user.id;
    // ======================================================
    // ✅ FILE CHECK
    // ======================================================
    if (!req.file) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message: "Profile image is required",
      });
    }
    // ======================================================
    // ✅ FIND USER
    // ======================================================
    const user = await UserAuthModel.findByPk(userId, {
      transaction,
    });
    if (!user) {
      await transaction.rollback();

      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // ======================================================
    // ✅ IMAGE PATH
    // ======================================================
    const profileImagePath = `/uploads/profile/${userId}/${req.file.filename}`;
    // ======================================================
    // ✅ UPDATE USER DATA
    // ======================================================
    user.profileFolderId = String(userId);
    user.profileImage = profileImagePath;
    // ======================================================
    // ✅ SAVE USER
    // ======================================================
    await user.save({ transaction });
    // ======================================================
    // ✅ COMMIT TRANSACTION
    // ======================================================
    await transaction.commit();
    // ======================================================
    // ✅ SUCCESS RESPONSE
    // ======================================================

    return res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      profileImage: profileImagePath,
      // user: {
      //   id: user.id,
      //   fullName: user.fullName,
      //   email: user.email,
      //   profileFolderId: user.profileFolderId,
      //   profileImage: user.profileImage,
      // },
    });
  } catch (error) {
    console.log("PROFILE IMAGE UPDATE ERROR", error);

    // ======================================================
    // ✅ ROLLBACK TRANSACTION
    // ======================================================

    await transaction.rollback();

    // ======================================================
    // ✅ DELETE NEWLY UPLOADED FILE IF DB FAILED
    // ======================================================

    if (req.file) {
      const uploadedFilePath = path.join(
        __dirname,
        "..",
        "..",
        "public",
        "uploads",
        "profile",
        String(req.user.id),
        req.file.filename,
      );

      if (fs.existsSync(uploadedFilePath)) {
        fs.unlinkSync(uploadedFilePath);
      }
    }

    // ======================================================
    // ✅ ERROR RESPONSE
    // ======================================================

    return res.status(500).json({
      success: false,
      message: "Failed to update profile image",
      error: error.message,
    });
  }
};

exports.updateUserAccountDetails = async (req, res) => {
  // ======================================================
  // ✅ START TRANSACTION
  // ======================================================

  const transaction = await sequelize.transaction();
  try {
    // ======================================================
    // ✅ CURRENT USER ID
    // ======================================================
    const userId = req.user.id;

    const updateData = req.body;
    const user = await UserAuthModel.findByPk(userId, {
      transaction,
    });
    if (!user) {
      await transaction.rollback();

      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // ======================================================
    // ✅ ALLOWED FIELDS
    // ======================================================
    const allowedFields = [
      "fullName",
      "email",
      "username",
      "gender",
      "dateOfBirth",
    ];
    // ======================================================
    // ✅ EMAIL DUPLICATE CHECK
    // ======================================================
    if (updateData.email !== undefined) {
      const existingEmail = await UserAuthModel.findOne({
        where: {
          email: updateData.email.trim().toLowerCase(),
        },
        transaction,
      });
      // ======================================================
      // ✅ EMAIL ALREADY EXISTS
      // ======================================================
      if (existingEmail && String(existingEmail.id) !== String(userId)) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }
    }
    // ======================================================
    // ✅ USERNAME DUPLICATE CHECK
    // ======================================================
    if (updateData.username !== undefined) {
      const existingUsername = await UserAuthModel.findOne({
        where: {
          username: updateData.username.trim(),
        },
        transaction,
      });

      // ======================================================
      // ✅ USERNAME ALREADY EXISTS
      // ======================================================

      if (existingUsername && String(existingUsername.id) !== String(userId)) {
        await transaction.rollback();

        return res.status(400).json({
          success: false,
          message: "Username already taken",
        });
      }
    }
    // ======================================================
    // ✅ DYNAMIC UPDATE
    // ======================================================
    Object.keys(updateData).forEach((key) => {
      // ============================================
      // ✅ ONLY ALLOWED FIELDS
      // ============================================
      if (allowedFields.includes(key)) {
        // ============================================
        // ✅ EMAIL LOWERCASE
        // ============================================
        if (key === "email") {
          user[key] = updateData[key]?.trim()?.toLowerCase();
        }
        // ============================================
        // ✅ STRING TRIM
        // ============================================
        else if (typeof updateData[key] === "string") {
          user[key] = updateData[key]?.trim();
        }
        // ============================================
        // ✅ NORMAL VALUE
        // ============================================
        else {
          user[key] = updateData[key];
        }
      }
    });
    // ======================================================
    // ✅ SAVE USER
    // ======================================================

    await user.save({
      transaction,
    });
    // ======================================================
    // ✅ COMMIT TRANSACTION
    // ======================================================

    await transaction.commit();
    // ======================================================
    // ✅ SUCCESS RESPONSE
    // ======================================================
    return res.status(200).json({
      success: true,
      message: "Account details updated successfully",

      // user: {
      //   id: user.id,
      //   fullName: user.fullName,
      //   email: user.email,
      //   username: user.username,
      //   gender: user.gender,
      //   dateOfBirth: user.dateOfBirth,
      // },
    });
  } catch (error) {
    console.log("UPDATE USER ACCOUNT DETAILS ERROR", error);
    // ======================================================
    // ✅ ROLLBACK
    // ======================================================

    await transaction.rollback();

    return res.status(500).json({
      success: false,
      message: "Failed to update account details",
      error: error.message,
    });
  }
};
