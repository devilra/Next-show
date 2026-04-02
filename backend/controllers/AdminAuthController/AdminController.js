const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AdminAuth = require("../../models/AdminAuth/adminAuth");

// 🔑 JWT Secret Key - இதை .env file-இல் இருந்து load செய்வது சிறந்தது.
const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_OPTIONS = {
  httpOnly: true, // Client side JavaScript access செய்ய முடியாது
  secure: true,
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 நாட்கள் (7 days)
};

// ---------------------------
// 🛡️ JWT Generate செய்யும் Function
// ---------------------------

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: "7d", // 7 நாட்கள் கழித்து Token காலாவதியாகும்
  });
};

// ---------------------------
// 1. Admin Register (புதிய Admin-ஐ உருவாக்குதல்)
// ---------------------------

exports.registerAdmin = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Please fill in all required fields (Name, Email, Password).",
    });
  }

  try {
    const adminExists = await AdminAuth.findOne({ where: { email } });
    if (adminExists) {
      return res.status(400).json({
        message: "This email address is already registered.",
      });
    }

    // 2. Password-ஐ Hash செய்யவும்
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. புதிய Admin-ஐ உருவாக்கவும்
    const admin = await AdminAuth.create({
      name,
      email,
      password: hashedPassword,
      role: role || "moderator", // role கொடுக்கப்படாவிட்டால் default 'moderator'
    });

    // 4. JWT-ஐ உருவாக்கி Cookie-இல் சேமிக்கவும்
    const token = generateToken(admin.id);
    res.cookie("admin_jwt", token, COOKIE_OPTIONS);

    // 5. Response அனுப்பவும்
    res.status(201).json({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      message: "Admin registered successfully.",
    });
  } catch (error) {
    console.error("Admin Registration Error:", error);
    res.status(500).json({
      message: "An error occurred on the server.",
    });
  }
};

// ---------------------------
// 2. Admin Login (உள்நுழைவு)
// ---------------------------

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required.",
    });
  }

  try {
    // 1. Admin-ஐ Email மூலம் கண்டுபிடிக்கவும்
    const admin = await AdminAuth.findOne({ where: { email } });

    if (!admin) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // 2. Password-ஐ சரிபார்க்கவும்
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // 3. JWT-ஐ உருவாக்கி Cookie-இல் சேமிக்கவும்
    const token = generateToken(admin.id);
    res.cookie("admin_jwt", token, COOKIE_OPTIONS);

    // Response
    res.status(200).json({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      message: "Logged in successfully.",
    });
  } catch (error) {
    console.error("Admin Login Error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// ---------------------------
// 3. Get Me Admin (தற்போதைய Admin விவரங்களைப் பெறுதல்)
// ---------------------------

exports.getMeAdmin = async (req, res) => {
  // 💡 குறிப்பு: இந்த Controller-க்கு முன்னால் ஒரு 'auth middleware' பயன்படுத்தப்பட வேண்டும்.
  // அந்த middleware, JWT-ஐ சரிபார்த்து, Admin ID-ஐ 'req.admin' அல்லது 'req.user' இல் வைத்திருக்கும்.

  // இப்போது, middleware இல்லாததால், நேரடியாக cookie-இல் இருந்து படிக்க முயற்சிக்கிறோம்.
  // ஆனால், middleware-ஐப் பயன்படுத்துவதே சரியான முறை.

  if (!req.admin) {
    return res.status(401).json({
      message: "Unauthorized. Token is missing or has expired.",
    });
  }

  res.status(200).json({
    id: req.admin.id,
    name: req.admin.name,
    email: req.admin.email,
    role: req.admin.role,
  });
};

// ---------------------------
// 4. Admin Logout (வெளியேறுதல்)
// ---------------------------

exports.logoutAdmin = (req, res) => {
  // Cookie-ஐ நீக்குவதன் மூலம் Logout செய்யலாம்
  res.clearCookie("admin_jwt", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
};
