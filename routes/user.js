const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const listingController = require("../controllers/user.js");

router.get("/signup", listingController.renderSignupForm);

router.post("/signup", wrapAsync(listingController.signup));

// LOGIN

router.get("/login", listingController.renderLoginForm);

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapAsync(listingController.login)
);

// USSER LOGOUT ROUTE
router.get("/logout", listingController.logout);

module.exports = router;
