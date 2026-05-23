// ======================================================
// ✅ USER AUTH CONTROLLER
// FILE: controllers/UserAuthController/UserAuthController.js
// ======================================================

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const UserAuthModel = require("../../models/UserAuth/UserAuth");

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
    // ======================================================
    // ✅ VALIDATION
    // ======================================================

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ======================================================
    // ✅ PASSWORD LENGTH
    // ======================================================
    if (password.length < 6) {
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
        email: email.toLowerCase(),
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
    const hashedPassword = await bcrypt.hash(password, 10);
    // ======================================================
    // ✅ CREATE USER
    // ======================================================
    const newUser = await UserAuthModel.create({
      fullName,
      email: email.toLowerCase(),
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
    // ======================================================
    // ✅ VALIDATION
    // ======================================================
    if (!email || !password) {
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
        email: email.toLowerCase(),
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
    const isPasswordMatch = await bcrypt.compare(password, user.password);

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
