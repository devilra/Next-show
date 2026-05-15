const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");
const { CATEGORY_ENUM, NEWS_TYPE_ENUM } = require("./EnumConstant");

const CentralizedNewsModel = sequelize.define(
  "CentralizedNewsModel",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      //   unique: true, // SEO-vukku link (e.g., dune-prophecy-season-2)
    },
    // ⬇️ News-ai create panna Admin/User-oda ID (Reference)
    // userId: {
    //   type: DataTypes.UUID,
    //   allowNull: true, // News create panravangaloda ID
    //   references: {
    //     model: "users", // Unga User table name inga irukanum
    //     key: "id",
    //   },
    // },
    shortDescription: {
      type: DataTypes.TEXT, // Full article content
      allowNull: false,
    },
    longDescription: {
      type: DataTypes.TEXT, // Full article content
      allowNull: false,
    },
    newsImages: {
      type: DataTypes.JSON,
      // Example: [ "/uploads/news/img1.jpg", "/uploads/news/img2.jpg" ]
      allowNull: true, // News images illama kooda post podalaam (Optional)
      defaultValue: [],
    },
    // Oru vela neenga "Image Folder ID" nu thaniya vaikkanum nu nenechaa:
    imageFolderId: {
      type: DataTypes.UUID,
      allowNull: true, // News record create aagum podhu idhu add aagum
    },
    videoUrl: {
      type: DataTypes.JSON, // 📺 Youtube Embed Link inga store pannalam
      defaultValue: [],
      allowNull: true, // Ellaa news-kum video irukkaadhu, so True.
    },
    authorName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    categories: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
      validate: {
        isValidCategory(value) {
          if (!Array.isArray(value))
            throw new Error("Categories must be an array");
          // Imported CATEGORY_ENUM inga proper-ah work aagum
          const isValid = value.every((cat) => CATEGORY_ENUM.includes(cat));
          if (!isValid)
            throw new Error("One or more invalid categories detected!");
        },
      },
    },
    newsTypes: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
      validate: {
        isValidNewsType(value) {
          if (!Array.isArray(value))
            throw new Error("NewsTypes must be an array");
          // Imported NEWS_TYPE_ENUM inga proper-ah work aagum
          const isValid = value.every((type) => NEWS_TYPE_ENUM.includes(type));
          if (!isValid)
            throw new Error("One or more invalid news types detected!");
        },
      },
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      // Optional: Frontend-la irundhu varra tags array-thana nu validate pannalam
      validate: {
        isArray(value) {
          if (value && !Array.isArray(value)) {
            throw new Error("Tags must be an array of strings");
          }
        },
      },
    },
    // ... other fields ...
    viewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    readTime: {
      type: DataTypes.STRING, // e.g., "3 min read"
      allowNull: true,
    },
    // ⬇️ Reactions Logic using User IDs as References (JSON format-la list of IDs)
    reactions: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {
        fire: [], // [ "user_uuid_1", "user_uuid_2" ]
        wow: [], // [ "user_uuid_3" ]
        heart: [],
      },
    },
    isTrending: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    status: {
      type: DataTypes.ENUM("DRAFT", "PUBLISHED", "ARCHIVED", "DELETED"),
      allowNull: false,
      defaultValue: "DRAFT", // Default-ah draft-la irukkum, Admin publish panna dhaan visible aagum
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: true, // Draft-la irukum podhu date irukkaadhu
    },
    additionalFields: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {
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
      // validate: {
      //   isValidAdditionalFields(value) {
      //     // 1. Object check

      //     if (typeof value !== "object" || Array.isArray(value)) {
      //       throw new Error("additionalFields must be a valid object");
      //     }
      //     // 2. Allowed Keys

      //     const allowedKeys = [
      //       "contentBlocks",
      //       "relatedNews",
      //       "faq",
      //       "polls",
      //       "widgets",
      //       "seo",
      //       "references",
      //       "timeline",
      //       "movieCards",
      //     ];

      //     // 3. Extra unwanted keys check

      //     const incomingKeys = Object.keys(value);
      //     const invalidKeys = incomingKeys.filter(
      //       (key) => !allowedKeys.includes(key),
      //     );

      //     if (invalidKeys.length > 0) {
      //       throw new Error(
      //         `Invalid additionalFields keys: ${invalidKeys.join(", ")}`,
      //       );
      //     }
      //     // 4. Array validations
      //     const arrayFields = [
      //       "contentBlocks",
      //       "relatedNews",
      //       "faq",
      //       "polls",
      //       "widgets",
      //       "references",
      //       "timeline",
      //       "movieCards",
      //     ];

      //     for (const field of arrayFields) {
      //       if (value[field] !== undefined && !Array.isArray(value[field])) {
      //         throw new Error(`${field} must be an array`);
      //       }
      //     }

      //     // 5. seo object validation
      //     // 5. seo object validation
      //     if (value.seo !== undefined && typeof value.seo !== "object") {
      //       throw new Error("seo must be an object");
      //     }
      //   },
      // },
    },
  },
  {
    tableName: "centralized_news",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["slug"], // Ithu database level-la slug-ah unique-ah maintain pannum
      },
    ],
    hooks: {
      beforeValidate: (news, options) => {
        if (!news.authorName) {
          const authors = ["Thiru Kumaran", "Kali Raja", "Balaji", "Dinesh"];

          const randomIndex = Math.floor(Math.random() * authors.length);
          news.authorName = authors[randomIndex];
        }
      },
      beforeSave: (news, options) => {
        // Automatic Read Time Calculation
        if (news.longDescription) {
          const wordsPerMinute = 200;
          const text = news.longDescription.replace(/<[^>]*>/g, ""); // HTML tags irundha remove panna
          const wordCount = text
            .split(/\s+/)
            .filter((word) => word.length > 0).length;
          const minutes = Math.ceil(wordCount / wordsPerMinute);
          news.readTime = `${minutes} min read`;
        }
      },
    },
  },
);

module.exports = CentralizedNewsModel;
