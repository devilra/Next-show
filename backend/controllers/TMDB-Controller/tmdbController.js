const axios = require("axios");

exports.getTMDBMovieDetails = async (req, res) => {
  try {
    // Testing purpose-kaga dynamic params-ah skip pannittu direct ID poduvom
    const testMovieId = "550"; // Fight Club movie ID
    const ROOT_URL = "https://api.themoviedb.org/3";
    const apiKey = process.env.TMDB_API_KEY;

    // Direct-ah fetch panni response-ah check pannuvom
    const movieRes = await axios.get(
      `${ROOT_URL}/discover/movie?api_key=${apiKey}&with_original_language=ta&region=IN&sort_by=primary_release_date.desc`,
    );

    // Ippo full data-vaiyum return pannuvom, appo thaan Postman-la ellathaiyum paaka mudiyum
    res.status(200).json({
      success: true,
      raw_data: movieRes.data, // TMDB kudukkura original data
    });
  } catch (error) {
    console.error("TMDB Fetch Error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      error_details: error.response?.data || error.message,
    });
  }
};
