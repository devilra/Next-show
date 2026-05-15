const slugify = require("slugify");
const moment = require("moment");
const CentralizedNewsModel = require("../../models/CentralizedNewsModels/CentralizedNewsModel");
const _ = require("lodash");
const fs = require("fs");
const path = require("path");
const sequelize = require("../../config/db");
const { Op } = require("sequelize");

// exports.createNews = async (req, res) => {
//   const t = await sequelize.transaction();
//   console.log("body", req.body);
//   try {
//     const {
//       title,
//       shortDescription,
//       longDescription,
//       newsImages,
//       imageFolderId,
//       videoUrl,
//       categories,
//       newsTypes,
//       tags,
//       isTrending,
//       status, // DRAFT or PUBLISHED
//       additionalFields,
//     } = req.body;

//     // 1. Mandatory Fields Check
//     if (!title || !shortDescription || !longDescription) {
//       return res.status(400).json({
//         success: false,
//         message: "Title, Short and Long Descriptions are required.",
//       });
//     }

//     // 2. Slugify Logic
//     const slug = slugify(title, {
//       lower: true,
//       strict: true,
//       trim: true,
//     });

//     // ------------------------------------------------------------
//     // NEW: Duplicate Check Logic
//     // Intha slug-la vera news irukka-nu check panrom
//     const existingNews = await CentralizedNewsModel.findOne({
//       where: { slug: slug },
//     });

//     if (existingNews) {
//       return res.status(400).json({
//         success: false,
//         message: "News Slug Already Defined",
//       });
//     }

//     // 3. Status & Date Logic (Unga screenshot format-padi)
//     let finalStatus = "PUBLISHED";
//     let finalPublishedAt = null;
//     let finalImageFolderId = null;

//     if (status === "DRAFT") {
//       finalStatus = "DRAFT";
//       finalPublishedAt = null; // Draft-na date clear aagidum
//     } else {
//       finalStatus = "PUBLISHED";
//       finalPublishedAt = moment().format("YYYY-MM-DD HH:mm:ss");
//     }

//     // ==========================================
//     // ✅ AUTO EXTRACT FOLDER ID
//     // ==========================================

//     if (newsImages && Array.isArray(newsImages) && newsImages.length > 0) {
//       const firstImage = newsImages[0];
//       const parts = firstImage.split("/");
//       finalImageFolderId = parts[3] || null;
//     }

//     // 4. Create News Record in DB
//     const newNews = await CentralizedNewsModel.create({
//       title,
//       slug,
//       shortDescription,
//       longDescription,
//       newsImages: newsImages || [],
//       imageFolderId: finalImageFolderId,
//       videoUrl: videoUrl || [],
//       categories,
//       newsTypes,
//       tags: tags || [],
//       isTrending: isTrending || false,
//       status: finalStatus,
//       publishedAt: finalPublishedAt, // Inga formatted date store aagum
//       additionalFields: additionalFields || {
//         contentBlocks: [],
//         relatedNews: [],
//         faq: [],
//         polls: [],
//         widgets: [],
//         seo: {},
//         references: [],
//         timeline: [],
//         movieCards: [],
//       },
//     });

//     return res.status(201).json({
//       success: true,
//       message: `News ${finalStatus === "DRAFT" ? "saved as draft" : "published"} successfully!`,
//       data: newNews,
//     });
//   } catch (error) {
//     if (error.name === "SequelizeUniqueConstraintError") {
//       return res.status(400).json({
//         success: false,
//         message: "A news with this title already exists.",
//       });
//     }
//     return res.status(500).json({ success: false, error: error.message });
//   }
// };

exports.createNews = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    // ======================================================
    // ✅ ARRAY NORMALIZE
    // ======================================================

    let newsData = req.body;

    if (!Array.isArray(newsData)) {
      newsData = [newsData];
    }

    const createdNews = [];

    // ======================================================
    // ✅ LOOP ALL NEWS
    // ======================================================

    for (const news of newsData) {
      // ======================================================
      // ✅ REMOVE FRONTEND ONLY FIELD
      // ======================================================

      delete news.__errors;

      const {
        title,
        shortDescription,
        longDescription,
        newsImages,
        imageFolderId,
        videoUrl,
        categories,
        newsTypes,
        tags,
        isTrending,
        status,
        additionalFields,
      } = news;

      // ======================================================
      // ✅ VALIDATION
      // ======================================================

      if (!title || !shortDescription || !longDescription) {
        await t.rollback();

        return res.status(400).json({
          success: false,
          message:
            "Title, Short Description and Long Description are required.",
        });
      }

      // ======================================================
      // ✅ CLEAN TITLE
      // ======================================================

      const cleanTitle = title.trim();

      // ======================================================
      // ✅ SLUG
      // ======================================================

      const baseSlug = slugify(cleanTitle, {
        lower: true,
        strict: true,
        trim: true,
      });

      // unique slug
      const finalSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

      // ======================================================
      // ✅ DUPLICATE CHECK
      // ======================================================

      const existingNews = await CentralizedNewsModel.findOne({
        where: {
          [Op.or]: [
            {
              title: {
                [Op.like]: cleanTitle,
              },
            },
            {
              slug: finalSlug,
            },
          ],
        },
        transaction: t,
      });

      if (existingNews) {
        await t.rollback();

        return res.status(400).json({
          success: false,
          message: `"${cleanTitle}" news already exists!`,
        });
      }

      // ======================================================
      // ✅ STATUS LOGIC
      // ======================================================

      let finalStatus = "PUBLISHED";
      let finalPublishedAt = null;

      if (status === "DRAFT") {
        finalStatus = "DRAFT";
        finalPublishedAt = null;
      } else if (status === "ARCHIVED") {
        finalStatus = "ARCHIVED";
        finalPublishedAt = null;
      } else {
        finalStatus = "PUBLISHED";

        finalPublishedAt = moment().format("YYYY-MM-DD HH:mm:ss");
      }

      // ======================================================
      // ✅ AUTO IMAGE FOLDER ID
      // ======================================================

      let finalImageFolderId = imageFolderId || null;

      if (newsImages && Array.isArray(newsImages) && newsImages.length > 0) {
        const uploadedImage = newsImages.find(
          (img) => typeof img === "string" && img.startsWith("/uploads/"),
        );

        if (uploadedImage) {
          const parts = uploadedImage.split("/");

          finalImageFolderId = parts[3] || null;
        }
      }

      // ======================================================
      // ✅ CREATE NEWS
      // ======================================================

      const newNews = await CentralizedNewsModel.create(
        {
          title: cleanTitle,

          slug: finalSlug,

          shortDescription,

          longDescription,

          newsImages: Array.isArray(newsImages) ? newsImages : [],

          imageFolderId: finalImageFolderId,

          videoUrl: Array.isArray(videoUrl) ? videoUrl : [],

          categories: Array.isArray(categories) ? categories : [],

          newsTypes: Array.isArray(newsTypes) ? newsTypes : [],

          tags: Array.isArray(tags) ? tags : [],

          isTrending: isTrending || false,

          status: finalStatus,

          publishedAt: finalPublishedAt,

          additionalFields: additionalFields || {
            contentBlocks: [],
            relatedNews: [],
            faq: [],
            polls: [],
            widgets: [],
            seo: {},
            references: [],
            timeline: [],
            movieCards: [],
          },
        },
        {
          transaction: t,
        },
      );

      createdNews.push(newNews);
    }

    // ======================================================
    // ✅ COMMIT
    // ======================================================

    await t.commit();

    return res.status(201).json({
      success: true,

      message: `${createdNews.length} news published successfully!`,

      data: createdNews,
    });
  } catch (error) {
    // ======================================================
    // ✅ ROLLBACK
    // ======================================================

    if (t) {
      await t.rollback();
    }

    console.log("NEWS CREATE ERROR:", error);

    // ======================================================
    // ✅ UNIQUE ERROR
    // ======================================================

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        success: false,
        message: "Duplicate news detected.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.getAllNewsAdmin = async (req, res) => {
  try {
    const newsList = await CentralizedNewsModel.findAll({
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      data: newsList,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.getNewsDetailsBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    // console.log("Slug", slug);

    // 1. Slug Check
    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "News Not Found",
      });
    }

    // 2. Find Published News Only
    const news = await CentralizedNewsModel.findOne({
      where: {
        slug: slug,
        status: "PUBLISHED",
      },
    });

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found or it might be in draft.",
      });
    }

    // ⬇️ SEO & Analytics: Yarachum click panna viewCount-ah +1 panrom
    await news.increment("viewCount", { by: 1 });

    // ✅ JSON Parse Helper

    const parseJSONField = (field, fallback) => {
      try {
        if (!field) return fallback;
        if (typeof field !== "string") {
          return field;
        }

        return JSON.parse(field);
      } catch (error) {
        return fallback;
      }
    };
    // ✅ Parsed Response

    const parsedNews = {
      ...news.toJSON(),
      newsImages: parseJSONField(news.newsImages, []),
      videoUrl: parseJSONField(news.videoUrl, []),
      categories: parseJSONField(news.categories, []),
      newsTypes: parseJSONField(news.newsTypes, []),
      tags: parseJSONField(news.tags, []),
      reactions: parseJSONField(news.reactions, {}),
      additionalFields: parseJSONField(news.additionalFields, {}),
      formattedDate: moment(news.publishedAt).format("MMM D, YYYY"),
    };

    return res.status(200).json({
      success: true,
      data: parsedNews,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateNews = async (req, res) => {
  try {
    const { id } = req.params;

    // =====================================================
    // ✅ FIND EXISTING NEWS
    // =====================================================

    const existingNews = await CentralizedNewsModel.findByPk(id);

    if (!existingNews) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    // =====================================================
    // ✅ JSON PARSE HELPER
    // =====================================================

    const parseJSONField = (field, fallback) => {
      try {
        if (!field) return fallback;

        // already object or array
        if (typeof field === "object") {
          return field;
        }

        // string JSON
        if (typeof field === "string") {
          return JSON.parse(field);
        }

        return fallback;
      } catch (error) {
        return fallback;
      }
    };

    // =====================================================
    // ✅ ALLOWED UPDATE FIELDS
    // =====================================================

    const allowedFields = [
      "title",
      "shortDescription",
      "longDescription",
      "newsImages",
      "videoUrl",
      "authorName",
      "categories",
      "newsTypes",
      "tags",
      "isTrending",
      "status",
      "additionalFields",
      "imageFolderId",
    ];

    const updateData = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    // =====================================================
    // ✅ STRINGIFIED JSON PARSE
    // =====================================================

    if (updateData.newsImages !== undefined) {
      updateData.newsImages = parseJSONField(updateData.newsImages, []);
    }

    if (updateData.videoUrl !== undefined) {
      updateData.videoUrl = parseJSONField(updateData.videoUrl, []);
    }

    if (updateData.categories !== undefined) {
      updateData.categories = parseJSONField(updateData.categories, []);
    }

    if (updateData.newsTypes !== undefined) {
      updateData.newsTypes = parseJSONField(updateData.newsTypes, []);
    }

    if (updateData.tags !== undefined) {
      updateData.tags = parseJSONField(updateData.tags, []);
    }

    // =====================================================
    // ✅ IMPORTANT
    // FULL REPLACE FOR JSON EDITOR
    // =====================================================

    if (updateData.additionalFields !== undefined) {
      updateData.additionalFields = parseJSONField(
        updateData.additionalFields,
        {},
      );
    }

    // =====================================================
    // ✅ EXISTING IMAGES
    // =====================================================

    const existingImages = parseJSONField(existingNews.newsImages, []);

    // =====================================================
    // ✅ NEW IMAGE UPLOAD HANDLE
    // =====================================================

    if (req.files && req.files.length > 0) {
      const uploadedImages = req.files.map((file) => {
        return `/uploads/news/${req.uploadDirName}/${file.filename}`;
      });

      updateData.newsImages = [
        ...(updateData.newsImages || existingImages),
        ...uploadedImages,
      ];
    }

    // =====================================================
    // ✅ AUTO IMAGE FOLDER ID
    // =====================================================

    const imageSource = updateData.newsImages || existingImages;

    if (Array.isArray(imageSource) && imageSource.length > 0) {
      const firstImage = imageSource[0];

      const parts = firstImage.split("/");

      updateData.imageFolderId = parts[3] || existingNews.imageFolderId;
    }

    // =====================================================
    // ✅ TITLE UPDATE → AUTO SLUG UPDATE
    // =====================================================

    if (updateData.title && updateData.title !== existingNews.title) {
      const newSlug = slugify(updateData.title, {
        lower: true,
        strict: true,
        trim: true,
      });

      const slugExists = await CentralizedNewsModel.findOne({
        where: {
          slug: newSlug,
        },
      });

      if (
        slugExists &&
        slugExists.id.toString() !== existingNews.id.toString()
      ) {
        return res.status(400).json({
          success: false,
          message: "Slug already exists",
        });
      }

      updateData.slug = newSlug;
    }

    // =====================================================
    // ✅ STATUS LOGIC
    // =====================================================

    if (updateData.status === "PUBLISHED") {
      if (!existingNews.publishedAt) {
        updateData.publishedAt = moment().format("YYYY-MM-DD HH:mm:ss");
      }
    }

    if (updateData.status === "DRAFT") {
      updateData.publishedAt = null;
    }

    // =====================================================
    // ✅ UPDATE NEWS
    // =====================================================

    await existingNews.update(updateData);

    // =====================================================
    // ✅ FETCH UPDATED NEWS
    // =====================================================

    const updatedNews = await CentralizedNewsModel.findByPk(id);

    // =====================================================
    // ✅ FINAL PARSED RESPONSE
    // =====================================================

    const parsedNews = {
      ...updatedNews.toJSON(),

      newsImages: parseJSONField(updatedNews.newsImages, []),

      videoUrl: parseJSONField(updatedNews.videoUrl, []),

      categories: parseJSONField(updatedNews.categories, []),

      newsTypes: parseJSONField(updatedNews.newsTypes, []),

      tags: parseJSONField(updatedNews.tags, []),

      reactions: parseJSONField(updatedNews.reactions, {}),

      additionalFields: parseJSONField(updatedNews.additionalFields, {}),
    };

    return res.status(200).json({
      success: true,
      message: "News updated successfully",
      data: parsedNews,
    });
  } catch (error) {
    // =====================================================
    // ✅ VALIDATION ERROR
    // =====================================================

    if (error.name === "SequelizeValidationError") {
      const messages = error.errors.map((err) => err.message);

      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: messages,
      });
    }

    // =====================================================
    // ✅ DATABASE ERROR
    // =====================================================

    if (error.name === "SequelizeDatabaseError") {
      return res.status(500).json({
        success: false,
        message: "Database syntax or connection error.",
        error: error.message,
      });
    }

    // =====================================================
    // ✅ GENERIC ERROR
    // =====================================================

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

exports.deleteNews = async (req, res) => {
  try {
    const { id } = req.params;

    // ======================================================
    // ✅ ID VALIDATION
    // ======================================================

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "News ID is required",
      });
    }

    // ======================================================
    // ✅ FIND NEWS
    // ======================================================

    const existingNews = await CentralizedNewsModel.findByPk(id);

    if (!existingNews) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    // ======================================================
    // ✅ DELETE IMAGES FROM SERVER
    // ======================================================

    let newsImages = existingNews.newsImages || [];
    if (typeof newsImages === "string") {
      try {
        newsImages = JSON.parse(newsImages);
      } catch (error) {
        newsImages = [];
      }
    }

    // Delete all images

    for (const imagePath of newsImages) {
      try {
        if (!imagePath) continue;

        // "/uploads/news/2026-05-11/file.jpg"
        const cleanPath = imagePath.startsWith("/")
          ? imagePath.substring(1)
          : imagePath;
        const absolutePath = path.join(
          __dirname,
          "..",
          "..",
          "public",
          cleanPath,
        );
        // File exists check

        if (fs.existsSync(absolutePath)) {
          fs.unlinkSync(absolutePath);
          console.log(`[NEWS IMAGE DELETE SUCCESS]: ${absolutePath}`);
        }
      } catch (imageError) {
        console.log(`[NEWS IMAGE DELETE ERROR]: ${imageError.message}`);
      }
    }

    // ======================================================
    // ✅ DELETE NEWS FROM DB
    // ======================================================
    await existingNews.destroy();

    // ======================================================
    // ✅ SUCCESS RESPONSE
    // ======================================================

    return res.status(200).json({
      success: true,
      message: "News deleted successfully",
    });
  } catch (error) {
    // ======================================================
    // ✅ SEQUELIZE DB ERROR
    // ======================================================

    if (error.name === "SequelizeDatabaseError") {
      return res.status(500).json({
        success: false,
        message: "Database error occurred",
        error: error.message,
      });
    }

    // ======================================================
    // ✅ GENERIC ERROR
    // ======================================================

    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting news",
      error: error.message,
    });
  }
};
