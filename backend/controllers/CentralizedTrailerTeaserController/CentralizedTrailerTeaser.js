const sequelize = require("../../config/db");
const CentralizedTrailerTeaser = require("../../models/CentralizedTrailerTeaser/CentralizedTrailerTeaser");

exports.createBulkTrailerTeaser = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    let payload = req.body;

    // ====================================
    // PAYLOAD CHECK
    // ====================================
    if (!payload) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message: "Field is required",
      });
    }

    // ====================================
    // OBJECT → ARRAY
    // ====================================
    if (!Array.isArray(payload)) {
      payload = [payload];
    }

    // ====================================
    // EMPTY CHECK
    // ====================================
    if (payload.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Field cannot be empty",
      });
    }

    // ====================================
    // AUTO STATUS NORMALIZE
    // ====================================
    payload = payload.map((item) => {
      const media = {
        ...item,
      };
      // youtube url iruntha release
      if (media.youtubeUrl && !media.status && !media.scheduledAt) {
        media.status = "RELEASED";
      }
      // schedule date iruntha scheduled
      if (media.scheduledAt && !media.status) {
        media.status = "SCHEDULED";
      }
      return media;
    });
    let createdMedia;
    // ====================================
    // SINGLE CREATE
    // ====================================
    if (payload.length === 1) {
      createdMedia = await CentralizedTrailerTeaser.create(payload[0], {
        transaction,
      });
      await transaction.commit();
      return res.status(201).json({
        success: true,
        message: "Trailer created successfully",
        totalCreated: 1,
        data: createdMedia,
      });
    }
    // ====================================
    // BULK CREATE
    // ====================================
    createdMedia = await CentralizedTrailerTeaser.bulkCreate(payload, {
      validate: true,
      individualHooks: true,
      transaction,
    });

    await transaction.commit();
    return res.status(201).json({
      success: true,
      message: "Media created successfully",
      totalCreated: createdMedia.length,
      data: createdMedia,
    });
  } catch (error) {
    await transaction.rollback();
    console.log("CREATE BULK TRAILER ERROR", error);
    // ====================================
    // DUPLICATE TRAILER
    // ====================================

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        success: false,
        message: "Trailer already exists",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Failed to create media",
      error: error.message,
    });
  }
};

exports.getAllTrailerTeaser = async (req, res) => {
  try {
    // ====================================
    // ADMIN CHECK
    // ====================================

    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // ====================================
    // FETCH ALL MEDIA
    // ====================================

    const media = await CentralizedTrailerTeaser.findAll({
      order: [
        ["scheduledAt", "ASC"],
        ["createdAt", "DESC"],
      ],
    });

    // ====================================
    // SUCCESS
    // ====================================

    return res.status(200).json({
      success: true,

      totalRecords: media.length,

      data: media,
    });
  } catch (error) {
    console.log("GET ALL TRAILER TEASER ERROR", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch media",
      error: error.message,
    });
  }
};

exports.getUserSingleTrailerTeaser = async (req, res) => {
  try {
    const { slug } = req.params;
    const media = await CentralizedTrailerTeaser.findOne({
      where: {
        slug,
        status: "RELEASED",
      },
    });

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Media not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: media,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch media",
    });
  }
};

exports.getAdminSingleTrailerTeaserAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const media = await CentralizedTrailerTeaser.findByPk(id);

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Media not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: media,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch media",
    });
  }
};

exports.updateTrailerTeaser = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    // ====================================
    // ADMIN CHECK
    // ====================================
    if (!req.user?.id) {
      await transaction.rollback();

      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }
    // ====================================
    // FIND MEDIA
    // ====================================
    const media = await CentralizedTrailerTeaser.findByPk(id, {
      transaction,
    });
    if (!media) {
      await transaction.rollback();

      return res.status(404).json({
        success: false,
        message: "Media not found",
      });
    }

    const allowedFields = [
      "title",
      "mediaType",
      "status",
      "youtubeUrl",
      "shortDescription",
      "longDescription",
      "scheduledAt",
      "releasedAt",
      "isOfficial",
      "isFeatured",
      "additionalFields",
    ];

    const updateData = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    if (Object.keys(updateData).length === 0) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message: "No valid fields provided",
      });
    }
    // ====================================
    // UPDATE MEDIA
    // ====================================
    await media.update(updateData, {
      transaction,
      hooks: true,
    });
    await transaction.commit();
    return res.status(200).json({
      success: true,
      message: "Media updated successfully",
      data: media,
    });
  } catch (error) {
    await transaction.rollback();

    console.log("UPDATE TRAILER TEASER ERROR", error);

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        success: false,
        message: "Trailer already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update media",
      error: error.message,
    });
  }
};

exports.deleteTrailerTeaser = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    // ====================================
    // ADMIN CHECK
    // ====================================
    if (!req.user?.id) {
      await transaction.rollback();

      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }
    // ====================================
    // FIND MEDIA
    // ====================================
    const media = await CentralizedTrailerTeaser.findByPk(id, {
      transaction,
    });
    if (!media) {
      await transaction.rollback();

      return res.status(404).json({
        success: false,
        message: "Media not found",
      });
    }
    // ====================================
    // SOFT DELETE
    // ====================================
    await media.update(
      {
        status: "CANCELLED",
      },
      {
        transaction,
        hooks: true,
      },
    );
    // ====================================
    // COMMIT
    // ====================================
    await transaction.commit();

    return res.status(200).json({
      success: true,
      message: "Media deleted successfully",
    });
  } catch (error) {
    await transaction.rollback();

    console.log("DELETE TRAILER TEASER ERROR", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete media",
      error: error.message,
    });
  }
};
