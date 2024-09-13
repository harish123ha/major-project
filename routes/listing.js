const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const isLoggedIn = require("../middleware.js");
const { isOwner } = require("../middleware.js");
const { validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const Listing = require("../models/listing.js");

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

router.get("/search", async (req, res) => {
  let { search } = req.query;
  console.log("srsdfad===", search);

  let data = await Listing.find({
    $or: [
      { country: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ],
  });
  if (data == "") {
    req.flash("error", "The Desired Search data not found");
    return res.redirect("/listings");
  }
  console.log(data);
  req.flash("success", "data found");
  res.render("listings/index.ejs", { allData: data });

  // if (!allData == [Array]) {
  //   res.redirect("/listings", { allData });
  // } else {
  //   req.flash("error", "data not found");
  //   res.redirect("/listings");
  // }
});

module.exports = router;
