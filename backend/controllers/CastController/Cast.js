const { cloudinary } = require("../../config/cloudinaryConfig");
const { Cast } = require("../../models/associationIndex");

// 1. ➕ CREATE with Unique Check & Gender
exports.createCast = async (req, res) => {
  try {
    const { name, gender } = req.body;
    // 🕵️ Unique Check: Same name-la actor irukkangala nu check pannum
    const existingCast = await Cast.findOne({
      where: {
        name,
      },
    });

    if (existingCast) {
      // Oru velai actor iruntha, Cloudinary-la ippo upload aana file-ah delete pannanum (Storage waste aaga koodathu)
      if (req.file) {
        await cloudinary.uploader.destroy(req.file.filename);
      }
      return res
        .status(400)
        .json({ message: "Actor with this name already exists!" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Profile image is required!" });
    }
  } catch (error) {}
};
