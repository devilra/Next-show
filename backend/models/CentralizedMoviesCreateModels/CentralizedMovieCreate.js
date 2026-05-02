const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");
const { cloudinary } = require("../../config/cloudinaryConfig");

const CentralizedMovieCreate = sequelize.define(
  "CentralizedMovieCreate",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // 🏷️ Padathoda Peru
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    // 🕒 AUTOMATION CONTROL - இதுதான் அந்த Boolean value
    // இது false-ஆக இருந்தால், சிஸ்டம் ஆட்டோமேட்டிக்கா தேதியை பார்த்து Section-ஐ மாற்றும்.
    // இது true-ஆக இருந்தால், அட்மின் மேனுவலா குடுக்குறது மட்டும் தான் இருக்கும்.

    isManualUpdate: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    // 🔥 TRENDING CONTROL
    isTrending: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // Default-ஆக false, அட்மின் நினைத்தால் true ஆக்கலாம்
    },

    // 📅 TRENDING SCHEDULING
    trendingStartDate: {
      type: DataTypes.DATEONLY,
      allowNull: true, // படம் ட்ரெண்டிங்கிற்கு வரும்போது இந்தத் தேதி விழும்
    },
    trendingDays: {
      type: DataTypes.INTEGER,
      defaultValue: 15, // 7 நாட்களுக்குப் பிறகு ஆட்டோமேட்டிக்காக ட்ரெண்டிங் லிஸ்டில் இருந்து மறையும்
    },
    // ✅ PUTHUSU: Dynamic Render-ku easy-ah irukum
    showInTheaters: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    // 📺 "New Movies" section-la intha movie varanuma?
    showInNewMovies: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    // 🎬 "Streaming Now" section-la intha movie varanuma?
    showInStreamingNow: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    // 🏠 HOME PAGE - "New Movies" Section-la varanuma?
    showInHomepage: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    // // 🔥 HOME PAGE - "Trending Now" Section-la varanuma?
    // showInHomeTrending: {
    //   type: DataTypes.BOOLEAN,
    //   defaultValue: false,
    // },

    // // 📱 HOME PAGE - "Streaming" Section-la varanuma? (PUTHUSU)
    // showInHomeStreaming: {
    //   type: DataTypes.BOOLEAN,
    //   defaultValue: false,
    // },

    // 🚦 Padathoda tharpothaiya nilai (Upcoming-aa illai release aayiducha?)
    status: {
      type: DataTypes.ENUM("UPCOMING", "RELEASED", "TRENDING"),
      defaultValue: "UPCOMING",
    },

    // 🎬 Section classification (Old ENUM - Optional, if you use Boolean flags above)
    streamType: {
      type: DataTypes.ENUM("TRENDING", "UPCOMING", "NEW_RELEASE"),
      // allowNull: false,
      defaultValue: "UPCOMING",
    },

    // 🎥 Iyakkunar (Director)
    director: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "TBA", // To Be Announced
    },
    // ✍️ Eluthalar (Writer) - NEWLY ADDED
    writer: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "TBA",
    },
    // 💰 Tayarippalar (Producer) - NEWLY ADDED
    producer: {
      type: DataTypes.STRING,
      defaultValue: "TBA",
    },
    // 👥 Nadigargal (Cast)
    cast: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: "",
    },
    // 🎭 RELEASE MODE: Idhu dhaan base condition
    // "THEATRICAL" -> Theatre-la release aagura padam
    // "DIRECT_STREAMING" -> Direct-ah OTT-la release aagura padam
    releaseMode: {
      type: DataTypes.ENUM("THEATRICAL", "DIRECT_STREAMING"),
      defaultValue: "THEATRICAL",
    },
    // 🕒 AUTOMATION FLAGS (Cron check panna easy-ah irukum)
    isTheatreReleased: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // releaseDate >= Today aagumbothu Cron true aakum
    },
    isStreamingReleased: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // ottReleaseDate >= Today aagumbothu Cron true aakum
    },
    // 📅 Release Date (DD-MM-YYYY)
    releaseDate: {
      // Future-la Date & Time venumna ippoae DATE nu maathikonga
      // Verum date mattum pothumna DATEONLY-ae irukattum
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    // 📅 Theater Release Date
    theatreReleaseDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },

    // 📅 OTT Release Date
    ottReleaseDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    // 🔞 Censor Certificate (U, U/A, A)
    certification: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "U/A 18+",
    },
    // 📺 Runtime (e.g., 2h 30m)
    durationOrSeason: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "N/A",
    },
    // 🌐 Primary Language
    language: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: "Tamil", // Unga primary language-ai default-ah vachukalam
    },
    // ⭐ IMDb Score
    imdbRating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    // 👨‍💻 Namma user-ga kudukura rating
    userRating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    // 🗳️ Total votes count
    ratingCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    // 👁️ Page views count
    viewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    // 🎬 Trailer link (YouTube)
    trailerUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
    },
    // 📺 Platform Handle (Array of Platforms)
    // Example: ["Netflix", "Disney+ Hotstar", "Amazon Prime"]
    availableOn: {
      type: DataTypes.JSON,
      defaultValue: ["Theatres"], // Default-ah theater-nu store aagum
    },
    // 🔗 OTT link or Ticket booking link
    watchUrl: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    // 🎵 Music Director
    musicDirector: {
      type: DataTypes.STRING,
      defaultValue: "N/A",
    },
    // 🎥 Cinematographer
    cinematography: {
      type: DataTypes.STRING,
      defaultValue: "N/A",
    },
    // 🏢 Production House
    productionHouse: {
      type: DataTypes.STRING,
      defaultValue: "N/A",
    },
    // 🔗 SEO Friendly URL
    // ✅ FIXED: Unique constraint with name to avoid "Too many keys"
    slug: {
      type: DataTypes.STRING,
      unique: "idx_unique_movie_slug",
    },
    // 🔍 SEO Title
    metaTitle: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    // 📄 SEO Description
    metaDescription: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },
    // 🎭 Genre
    genres: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: ["Drama"], // Common genre
    },
    // 📝 Long Description
    longDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: "",
    },
    // 🖼️ Cloudinary Image URL
    bannerImage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // 🆔 Cloudinary ID
    imagePublicId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // 🔹 Sort order
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    // 🟢 Record status
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    /**
     * 👥 Top Cast Section (Direct URL Method)
     * Format: [
     * { "name": "Dhanush", "role": "Murugan", "img": "https://image-link.com/dhanush.jpg" },
     * { "name": "Arun Vijay", "role": "Ashwin", "img": "https://image-link.com/arun.jpg" }
     * ]
     */
    // topCast: {
    //   type: DataTypes.JSON,
    //   allowNull: true,
    //   defaultValue: [],
    // },
    /**
     * 📸 Photos/Videos Section
     * Inga neenga YouTube URLs mattum store panna pothum.
     * Format: ["https://youtu.be/abc", "https://youtu.be/def"]
     */
    mediaLinks: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    /**
     * 📸 Movie Gallery Section (YouTube Links)
     * Admin will send: ["https://youtu.be/zdu0YzzJ10o", "https://youtu.be/id2"]
     * Store aagum pothu: ["zdu0YzzJ10o", "id2"] - ID mattum store panna easy-ah irukum.
     */
    galleryLinks: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    /**
     * 💰 ADVANCED BOX OFFICE DETAILS
     * Inga innum granular-ana data store pannalam.
     */
    boxOffice: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {
        budget: "N/A", // Total production + promotion cost
        verdict: "Pending", // Hit, Flop, Blockbuster, Average, Disaster

        // 🌍 Overall Totals
        totalIndiaGross: "0", // India full collection (with tax)
        totalIndiaNet: "0", // India collection (without tax - ithu thaan verdict-ku mukkiyam)
        totalOverseas: "0", // Foreign collection
        totalWorldwide: "0", // Global total

        // 📊 Area Wise Breakdown (Detailed)
        reports: [
          { area: "Tamil Nadu", collection: "0", share: "0" },
          { area: "Telugu States", collection: "0", share: "0" },
          { area: "Kerala", collection: "0", share: "0" },
          { area: "Karnataka", collection: "0", share: "0" },
          { area: "ROI (Rest of India)", collection: "0", share: "0" },
        ],

        // 📈 Daily Tracking
        dailyCollection: [
          { day: 1, date: "2026-04-12", amount: "0", occupancy: "0%" },
        ],

        // 📝 Additional Insights
        summary: "", // e.g., "Highest opening for the actor"
        preReleaseBusiness: "0", // Theater rights, Satellite, Digital rights sold value
      },
    },
    /**
     * 🏢 MOVIE RELEASE & THEATER DETAILS (Single Object Method)
     * Inga thaan distributors, screens, formats, matrum area-wise theaters ellamae irukkum.
     */
    releaseInfo: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {
        // 📢 Distribution & Reach
        distributors: {
          tamilNadu: [
            {
              circle: "Chennai City",
              name: "TBA",
              type: "TBA",
              subDistributors: [],
            },
            {
              circle: "Chengalpattu",
              name: "TBA",
              type: "TBA",
              subDistributors: ["Kanchipuram", "Tiruvallur"],
              company: "TBA",
            },
          ],
          // Kerala - Keeping same key structure as Tamil Nadu for consistency
          kerala: [
            {
              circle: "Kerala Total",
              name: "TBA",
              type: "TBA",
              company: "TBA",
              subDistributors: [],
            },
          ],
          // Karnataka
          karnataka: [
            {
              circle: "Karnataka Total",
              name: "TBA",
              type: "TBA",
              company: "TBA",
              subDistributors: [],
            },
          ],
          // Overseas & Others
          overseas: [
            {
              circle: "Worldwide (Excl. India)",
              name: "TBA",
              type: "TBA",
              subDistributors: [],
            },
          ],
        },
        // Digital & Satellite Rights (Direct values or TBA)
        rights: {
          satellite: "TBA",
          digital: "TBA",
          audio: "TBA",
        },
        // 🖥️ Global Screen Count (More Detailed)
        screenCount: {
          tamilNadu: 0,
          kerala: 0,
          karnataka: 0,
          teluguStates: 0,
          northIndia: 0,
          overseas: 0,
          worldwideTotal: 0,
        },
        // 🎞️ Formats available for this movie
        formats: ["2D", "3D", "IMAX", "4DX"],
        // 📍 Theater Schedule (District-wise array)
        theaterList: [],
      },
    },
    /**
     * 📺 STREAMING & DIGITAL RELEASE INFO (Final Detailed Array Format)
     */
    streamReleaseInfo: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {
        // 📱 OTT Details
        ott: [
          {
            platform: "TBA", // Netflix, Amazon Prime, etc.
            tentativeDate: null,
            confirmedDate: null,
            languages: ["Tamil"], // Multiple languages in one platform
            region: "Worldwide",
            url: "", // Watch Link
            quality: "4K UHD", // HD, 4K, Dolby Vision
          },
        ],

        // 📡 Satellite Rights (Array of Objects)
        // Multi-language channels-ku support pannum (e.g., Tamil: Sun TV, Telugu: Gemini TV)
        satellite: [
          {
            channel: "TBA",
            language: "Tamil", // Specific channel for specific language
            premierDate: null,
            premierTime: "TBA",
            rightsType: "Permanent",
          },
        ],

        // 🎵 Audio & Music Rights
        audio: [
          {
            label: "TBA", // Sony Music, T-Series, etc.
            languages: ["Tamil"], // 👈 Language added here
            streamingOn: ["Spotify", "YouTube Music", "Apple Music"],
            totalSongs: 0,
            allSongsUrl: "", // Jukebox link
          },
        ],

        // 📄 Partners
        contractDetails: {
          digitalPartner: "TBA",
          satellitePartner: "TBA",
        },
      },
    },
  },
  {
    tableName: "centralized_movie_create",
    timestamps: true,
    hooks: {
      beforeDestroy: async (instance) => {
        try {
          if (instance.imagePublicId) {
            await cloudinary.uploader.destroy(instance.imagePublicId);
          }
        } catch (error) {
          console.error("Cloudinary Delete Error:", error);
        }
      },
      beforeUpdate: async (instance) => {
        try {
          if (instance.changed("imagePublicId")) {
            const oldId = instance.previous("imagePublicId");
            if (oldId) await cloudinary.uploader.destroy(oldId);
          }
        } catch (error) {
          console.error("Cloudinary Update Error:", error);
        }
      },
    },
  },
);

module.exports = CentralizedMovieCreate;
