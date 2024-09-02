const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const isLoggedIn = require("../middleware.js");
const { isreviewAuthor, validateReview } = require("../middleware.js");
const listingController = require("../controllers/review.js");

// STARTING REVEIWS HERE

// LISTING REVIEWS GET DATA AND SAVE

router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(listingController.creatReview)
);

// LISTINGS REVIEWS DELETE DATA STARTING HERE

router.delete(
  "/:reviewId",
  isLoggedIn,
  isreviewAuthor,
  wrapAsync(listingController.destroyReview)
);

// LISTINGS REVIEWS DELETE DATA CLOSING HERE

// CLOSING REVEIWS HERE

module.exports = router;
