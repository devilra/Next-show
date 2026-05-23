// ======================================================
// ✅ USER AUTH MIDDLEWARE
// FILE: middlewares/UserAuthMiddleware/UserAuthMiddleware.js
// ======================================================

const jwt = require("jsonwebtoken");
const UserAuthModel = require("../../models/UserAuth/UserAuth");

// ======================================================
// ✅ USER PROTECT MIDDLEWARE
// ======================================================
exports.UserProtect = async (req, res, next) => {
  // console.log("Middleware calling");
  try {
    let token;
    // ======================================================
    // ✅ TOKEN FROM COOKIE
    // ======================================================
    // console.log("Token", req.cookies?.userToken);
    if (req.cookies?.userToken) {
      token = req.cookies.userToken;
    }
    // ======================================================
    // ✅ TOKEN FROM HEADER
    // ======================================================
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // ======================================================
    // ✅ NO TOKEN
    // ======================================================
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login.",
      });
    }

    // ======================================================
    // ✅ VERIFY TOKEN
    // ======================================================
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ======================================================
    // ✅ FIND USER
    // ======================================================
    const user = await UserAuthModel.findByPk(decoded.id, {
      attributes: {
        exclude: ["password", "resetPasswordToken", "resetPasswordExpire"],
      },
    });

    // ======================================================
    // ✅ USER NOT FOUND
    // ======================================================
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
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
    // ✅ SAVE USER IN REQUEST
    // ======================================================
    req.user = user;
    next();
  } catch (error) {
    console.log("USER AUTH MIDDLEWARE ERROR", error);
    // ======================================================
    // ✅ TOKEN EXPIRED
    // ======================================================

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please login again.",
      });
    }
    // ======================================================
    // ✅ INVALID TOKEN
    // ======================================================
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

// ======================================================
// ✅ ADMIN PROTECT
// ======================================================
exports.AdminProtect = async (req, res, next) => {
  try {
    // ======================================================
    // ✅ USER ROLE CHECK
    // ======================================================
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Admin access only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Authorization failed",
    });
  }
};
