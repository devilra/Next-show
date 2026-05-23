const sequelize = require("../../config/db");
const UserWatchLaterModel = require("../../models/UserAuth/UserWatchLater");

exports.toggleWatchLater = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const userId = req.user.id;
    // ==================================================
    // ✅ GET BODY
    // ==================================================
    const { newsId, reminderDate } = req.body;
    // ==================================================
    // ✅ VALIDATION
    // ==================================================
    if (!newsId) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,

        message: "News ID is required",
      });
    }
    // ==================================================
    // ✅ CHECK EXISTING
    // ==================================================
    const existingWatchLater = await UserWatchLaterModel.findOne({
      where: {
        userId,
        newsId,
      },
      transaction,
    });

    // ==================================================
    // ✅ REMOVE
    // ==================================================
    if (existingWatchLater) {
      await existingWatchLater.destroy({ transaction });
      // ================================================
      // ✅ COMMIT
      // ================================================
      await transaction.commit();
      return res.status(200).json({
        success: true,

        added: false,

        message: "Removed from watch later",
      });
    }
    // ==================================================
    // ✅ CREATE
    // ==================================================
    await UserWatchLaterModel.create(
      {
        userId,
        newsId,
        reminderDate: reminderDate || null,
      },
      {
        transaction,
      },
    );
    // ==================================================
    // ✅ COMMIT
    // ==================================================
    await transaction.commit();

    return res.status(200).json({
      success: true,

      added: true,

      message: "Added to watch later",
    });
  } catch (error) {
    // ==================================================
    // ✅ ROLLBACK
    // ==================================================
    await transaction.rollback();
    console.log("TOGGLE WATCH LATER ERROR", error);

    return res.status(500).json({
      success: false,

      message: "Failed to update watch later",

      error: error.message,
    });
  }
};

// ======================================================
// ✅ CHECK WATCH LATER STATUS
// ======================================================

exports.checkWatchLaterStatus = async (req, res) => {
  try {
    // ==================================================
    // ✅ GET USER
    // ==================================================
    const userId = req.user.id;
    // ==================================================
    // ✅ GET NEWS ID
    // ==================================================
    const { newsId } = req.params;
    // ==================================================
    // ✅ VALIDATION
    // ==================================================
    if (!newsId) {
      return res.status(400).json({
        success: false,

        message: "News ID is required",
      });
    }

    // ==================================================
    // ✅ FIND
    // ==================================================
    const existingWatchLater = await UserWatchLaterModel.findOne({
      where: {
        userId,
        newsId,
      },
    });

    return res.status(200).json({
      success: true,

      inWatchLater: !!existingWatchLater,
    });
  } catch (error) {
    console.log("CHECK WATCH LATER STATUS ERROR", error);

    return res.status(500).json({
      success: false,

      message: "Failed to check watch later status",

      error: error.message,
    });
  }
};

// ======================================================
// ✅ GET USER WATCH LATER
// ======================================================
exports.getUserWatchLater = async (req, res) => {
  try {
    // ================================================
    // ✅ GET USER
    // ================================================
    const userId = req.user.id;
    // ================================================
    // ✅ LIMIT
    // ================================================
    const limit = Number(req.query.limit) || 20;
    // ================================================
    // ✅ GET DATA
    // ================================================
    const watchLaterList = await UserWatchLaterModel.findAll({
      where: {
        userId,
      },
      order: [["createdAt", "DESC"]],
      limit,
    });
    return res.status(200).json({
      success: true,

      count: watchLaterList.length,

      data: watchLaterList,
    });
  } catch (error) {
    console.log("GET WATCH LATER ERROR", error);

    return res.status(500).json({
      success: false,

      message: "Failed to fetch watch later",

      error: error.message,
    });
  }
};

// ======================================================
// ✅ REMOVE SINGLE WATCH LATER
// ======================================================
exports.removeWatchLaterItem = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const userId = req.user.id;
    const { watchLaterId } = req.params;
    const watchLaterItem = await UserWatchLaterModel.findOne({
      where: {
        id: watchLaterId,
        userId,
      },
      transaction,
    });
    // ================================================
    // ✅ NOT FOUND
    // ================================================
    if (!watchLaterItem) {
      await transaction.rollback();

      return res.status(404).json({
        success: false,

        message: "Watch later item not found",
      });
    }
    // ================================================
    // ✅ DELETE
    // ================================================
    await watchLaterItem.destroy({ transaction });
    // ================================================
    // ✅ COMMIT
    // ================================================

    await transaction.commit();
    return res.status(200).json({
      success: true,

      message: "Removed from watch later",
    });
  } catch (error) {
    await transaction.rollback();

    console.log("REMOVE WATCH LATER ERROR", error);

    return res.status(500).json({
      success: false,

      message: "Failed to remove watch later",

      error: error.message,
    });
  }
};

exports.clearAllWatchLater = async (req, res) => {
  // ====================================================
  // ✅ TRANSACTION
  // ====================================================

  const transaction = await sequelize.transaction();

  try {
    // ==================================================
    // ✅ GET USER
    // ==================================================

    const userId = req.user.id;

    // ==================================================
    // ✅ CHECK EXISTING DATA
    // ==================================================

    const existingWatchLater = await UserWatchLaterModel.count({
      where: {
        userId,
      },

      transaction,
    });

    // ==================================================
    // ✅ ALREADY EMPTY
    // ==================================================

    if (existingWatchLater === 0) {
      await transaction.rollback();

      return res.status(200).json({
        success: true,

        alreadyCleared: true,

        message: "Watch later already empty",
      });
    }

    // ==================================================
    // ✅ DELETE ALL
    // ==================================================

    await UserWatchLaterModel.destroy({
      where: {
        userId,
      },

      transaction,
    });

    // ==================================================
    // ✅ COMMIT
    // ==================================================

    await transaction.commit();

    return res.status(200).json({
      success: true,

      cleared: true,

      message: "All watch later cleared successfully",
    });
  } catch (error) {
    // ==================================================
    // ✅ ROLLBACK
    // ==================================================

    await transaction.rollback();

    console.log("CLEAR WATCH LATER ERROR", error);

    return res.status(500).json({
      success: false,

      message: "Failed to clear watch later",

      error: error.message,
    });
  }
};
