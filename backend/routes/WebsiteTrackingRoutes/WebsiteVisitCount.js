const express = require("express");
const {
  initializeSessionAndTrackTraffic,
  getTrafficSummary,
  trackExit,
} = require("../../controllers/Website-Track-Controllers/WebsiteCountIncrease");

const router = express.Router();

router.post("/initialize-session", initializeSessionAndTrackTraffic);
router.post("/track-exit", trackExit);
router.get("/website-analytics", getTrafficSummary);

module.exports = router;
