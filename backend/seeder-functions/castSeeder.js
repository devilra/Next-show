const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const Cast = require("../models/Cast/Cast");
const sequelize = require("../config/db");

const slugify = (text) => {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
};

async function seedCastsWithImages() {
  try {
    console.log("⏳ Connecting to Database...");
    await sequelize.authenticate();
    console.log("✅ DB Connected Successfully.");

    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
    await sequelize.sync({ force: true });
    console.log("✅ Tables synchronized.");

    // 📂 PATH FIX:
    // rootDir ippo 'backend' folder-ah point pannum
    const rootDir = path.join(__dirname, "..");
    const jsonFilePath = path.join(rootDir, "castSeeder.json");
    const rawFolder = path.join(rootDir, "raw_images");

    // Correct target: backend/public/uploads/casts
    const uploadFolder = path.join(rootDir, "public", "uploads", "casts");

    if (!fs.existsSync(jsonFilePath)) {
      console.error("❌ castSeeder.json file-ai kaanom at:", jsonFilePath);
      return;
    }

    const actorsData = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));

    // Target folder illana create pannuvom
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder, { recursive: true });
      console.log("📁 Created target upload folder.");
    }

    console.log(`🚀 Seeding started for ${actorsData.length} records...`);

    for (const actor of actorsData) {
      try {
        const finalSlug = actor.slug || slugify(actor.name);

        // 🛠️ DATA CLEANER
        const cleanData = (val) => {
          if (typeof val !== "string") return val;
          return val
            .replace(/\u2013|\u2014/g, "-")
            .replace(/\u20b9/g, "Rs. ")
            .replace(/[^\x00-\x7F]/g, "");
        };

        const cleanedActor = {};
        for (let key in actor) {
          cleanedActor[key] = cleanData(actor[key]);
        }

        let uniqueFileName = null;
        if (actor.imageFile) {
          const oldPath = path.join(rawFolder, actor.imageFile);

          if (fs.existsSync(oldPath)) {
            const extension = path.extname(actor.imageFile);
            uniqueFileName = `${finalSlug}-${Date.now()}${extension}`;
            const newPath = path.join(uploadFolder, uniqueFileName);

            fs.copyFileSync(oldPath, newPath);
            console.log(`📸 Image copied: ${uniqueFileName}`);
          } else {
            console.warn(
              `⚠️ Image NOT found: ${actor.imageFile} at ${oldPath}`,
            );
          }
        }

        const { id, ...otherFields } = cleanedActor;

        await Cast.create({
          ...otherFields,
          slug: finalSlug,
          profileImage: uniqueFileName,
          profileImagePublicId: null,
        });

        console.log(`✅ ${cleanedActor.name} added to DB.`);
      } catch (error) {
        console.error(`🔴 Error seeding ${actor.name}:`, error.message);
      }
    }

    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
    console.log("🏁 Seeding Finished!");
    process.exit(0);
  } catch (globalError) {
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
    console.error("❌ Fatal Error:", globalError.message);
    process.exit(1);
  }
}

seedCastsWithImages();
