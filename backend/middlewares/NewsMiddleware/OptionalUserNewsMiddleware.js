const jwt = require("jsonwebtoken");
const UserAuthModel = require("../../models/UserAuth/UserAuth");

exports.OptionalUserProtect = async (req, res, next) => {
  try {
    const token = req.cookies?.userToken;

    if (!token) {
      next();
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserAuthModel.findByPk(decode.id);
    if (user) {
      req.user = user;
    }
    next();
  } catch (error) {
    next();
  }
};
