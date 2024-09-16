const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const isLoggedIn = require("../middleware.js");
const { isOwner } = require("../middleware.js");
const { validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const Listing = require("../models/listing.js");

// const multer = require("multer");
// const { storage } = require("../cloudConfig.js");
// // const upload = multer({ dest: "uploads/" });
// const upload = multer({ storage });

// ALL LISTINGS

router.get("/", wrapAsync(listingController.index));

//CREATE NEW LISTINGS

router.get("/new", isLoggedIn, listingController.renderNewForm);

router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(listingController.createListing)
);

// router.post("/", async (req, res) => {
//   // res.send(req.body);
//   let file = req.files.image;
//   const fileInfo = await cloudinary.uploader.upload(
//     file.tempFilePath,
//     (err, result) => {}
//   );
//   console.log(fileInfo.url);
//   console.log(fileInfo.original_filename);
// });

// show ejs

router.get("/:id/show", wrapAsync(listingController.showListing));

// EDIT

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

router.patch(
  "/:id",
  isLoggedIn,
  isOwner,
  // upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.updateListing)
);

// DELETE LISTINGS

router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing)
);

// search bar

router.get("/search", wrapAsync(listingController.searchBar));

module.exports = router;
