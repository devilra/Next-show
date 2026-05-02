const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");
const { cloudinary } = require("../../config/cloudinaryConfig"); // Ensure this path is correct

const Blog = sequelize.define("Blog", {
  title: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  bannerImage: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  imagePublicId: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  shortDescription: { 
    type: DataTypes.TEXT, 
    allowNull: false 
  },
  longDescription: { 
    type: DataTypes.TEXT, 
    allowNull: true 
  },
  starCast: { type: DataTypes.STRING },
  directedBy: { type: DataTypes.STRING, allowNull: false },
  producedBy: { type: DataTypes.STRING },
  cinematography: { type: DataTypes.STRING },
  newsDate: { type: DataTypes.STRING },
  category: { type: DataTypes.STRING },
  order: { type: DataTypes.INTEGER, defaultValue: 1 },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  tableName: "movie_blogs", // Forces it to use the same table name
  timestamps: true,
  hooks: {
    // 🔥 This automatically deletes the image from Cloudinary when you delete the blog
    beforeDestroy: async (blog) => {
      try {
        if (blog.imagePublicId) {
          await cloudinary.uploader.destroy(blog.imagePublicId);
          console.log("Deleted image from Cloudinary");
        }
      } catch (error) {
        console.error("Cloudinary Delete Error:", error);
      }
    }
  }
});

module.exports = Blog;