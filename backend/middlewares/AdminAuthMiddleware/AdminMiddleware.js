const jwt = require("jsonwebtoken");
const AdminAuth = require("../../models/AdminAuth/adminAuth");

const JWT_SECRET = process.env.JWT_SECRET;
exports.AdminAuthProtect = async (req, res, next) => {
  let token;

  // 1. Request Cookies-இல் 'admin_jwt' இருக்கிறதா என சரிபார்க்கவும்
  if (req.cookies.admin_jwt) {
    token = req.cookies.admin_jwt;
  }

  if (!token) {
    return res.status(401).json({
      message: "Not authorized to access this route. Token is missing.",
    });
  }

  try {
    // 2. Token-ஐ Decode செய்யவும்

    const decode = jwt.verify(token, JWT_SECRET);

    // 3. ID மூலம் Admin-ஐ DB-யில் இருந்து எடுக்கவும்
    req.admin = await AdminAuth.findByPk(decode.id, {
      attributes: {
        exclude: ["password"], // Password field-ஐ அனுப்பக்கூடாது
      },
    });

    if (!req.admin) {
      return res.status(401).json({
        message: "Admin associated with this token was not found.",
      });
    }

    next(); // அடுத்த Controller Function-க்கு செல்லவும்
  } catch (error) {
    console.error("Token Verification Error:", error.message);
    return res.status(401).json({
      message: "Not authorized. Token is invalid or has expired.",
    });
  }
};
