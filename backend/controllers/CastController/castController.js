const fs = require("fs");
const slugify = require("slugify");
const Cast = require("../../models/Cast/Cast");

exports.createCast = async (req, res) => {
  try {
    let data = req.body;

    // Check if data is an array (Bulk) or single object
    const isBulk = Array.isArray(data);
    const actorsToCreate = isBulk ? data : [data];

    // Processing each actor in the list
    const processedData = actorsToCreate.map((actor) => {
      // 1. Slug Generate
      if (!actor.slug && actor.name) {
        actor.slug = slugify(actor.name, { lower: true, strict: true });
      }

      // 🌟 FIX: Auto Replace Special Dash in activeYears
      if (actor.activeYears && typeof actor.activeYears === "string") {
        // \u2013 is En Dash (–), \u2014 is Em Dash (—)
        // Ithu rendu vanthaalum namma normal hyphen (-) ah mathiduvom
        actor.activeYears = actor.activeYears.replace(/[\u2013\u2024]/g, "-");
      }

      // 2. JSON fields-ai parse pannuvom (Only if it's a string)
      const jsonFields = [
        "profession",
        "languages",
        "otherIndustries",
        "knownFor",
        "genres",
        "notableAwards",
      ];
      jsonFields.forEach((field) => {
        if (actor[field] && typeof actor[field] === "string") {
          try {
            actor[field] = JSON.parse(actor[field]);
          } catch (e) {
            actor[field] = actor[field].split(",").map((i) => i.trim());
          }
        }
      });

      return actor;
    });

    // 3. Use bulkCreate for multiple records
    const result = await Cast.bulkCreate(processedData, {
      validate: true, // Data correct-ah irukanu check pannum
      // updateOnDuplicate: [
      //   "name",
      //   "realName",
      //   "gender",
      //   "profession",
      //   "activeYears",
      //   "netWorth",
      //   "knownFor",
      //   "popularityScore",
      //   "shortBio",
      // ],
    });

    res.status(201).json({
      success: true,
      total: result.length,
      message: `${result.length} Cast(s) created successfully!`,
      data: result,
    });
  } catch (error) {
    console.error("Cast Create Error:", error);

    // 🌟 Duplicate Entry-ah kandupudichi clear error message anupuvom
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        success: false,
        message: "Duplicate Error: I actor/slug already database exists!",
        errorDetail: error.errors.map((e) => e.message), // Example: "slug must be unique"
        duplicateValue: error.errors[0].value,
      });
    }

    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Cast list for React Select (Dropdown)
// @route   GET /api/v1/casts/select-list
exports.getCastList = async (req, res) => {
  try {
    // Attributes-la nammaku mukkkiyamana details mattum edukurom
    // Ithu payload size-ah kuraikum

    const casts = await Cast.findAll({
      attributes: ["id", "name", "profileImage", "profession"],
      where: {
        isActive: true, // Active-ah irukura cast mattum
      },
      order: [["name", "ASC"]], // Alphabetical order-la kootitu varom
    });

    // React Select format-ku transform panrom (value and label)
    const options = casts.map((castInstance) => {
      const cast = castInstance.get({ plain: true });
      let professionArray = [];

      // 1. JSON string-ah iruntha parse panrom
      if (cast.profession && typeof cast.profession === "string") {
        try {
          professionArray = JSON.parse(cast.profession);
        } catch (error) {
          // Oru vela normal comma separated string-ah iruntha
          professionArray = cast.profession.split(",").map((p) => p.trim());
        }
      } else if (Array.isArray(cast.profession)) {
        professionArray = cast.profession;
      }

      return {
        value: cast.id,
        label: cast.name,
        image: cast.profileImage,
        // Array-oda first element-ah katturom (e.g., "Music Director")
        profession: professionArray.length > 0 ? professionArray : "N/A",
      };
    });

    return res.status(200).json({
      success: true,
      count: options.length,
      data: options,
    });
  } catch (error) {
    console.error("Fetch Cast List Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
