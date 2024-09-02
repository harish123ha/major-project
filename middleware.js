const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError");
const { listingSchemas, reviewSchemas } = require("./schema.js");

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.rawHeaders = req.rawHeaders[33];
    req.session.paramsId = req.params.id;
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You are not logged in! Please login first ");
    return res.redirect("/login");
  }
  next();
};
module.exports = isLoggedIn;

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.paramsId || req.session.redirectUrl) {
    res.locals.paramsId = req.session.paramsId;
    res.locals.rawHeaders = req.session.rawHeaders;
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

// checking current user and owner user are same or not

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listingPatch = await Listing.findById(id);
  if (!listingPatch.owner.equals(res.locals.currentUser._id)) {
    req.flash("error", "You don't have permission");
    return res.redirect(`/listings/${id}/show`);
  }
  next();
};

// checking current user and author of review created is same of not

module.exports.isreviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currentUser._id)) {
    req.flash("error", "You are not the author of this review");
    return res.redirect(`/listings/${id}/show`);
  }

  next();
};

// VALIDATION FOR LISTING

module.exports.validateListing = (req, res, next) => {
  let result = listingSchemas.validate(req.body);
  if (result.error) {
    console.log(result.error);
    throw new ExpressError(400, result.error);
  }
  next();
};

// VALIDATION FOR review

module.exports.validateReview = (req, res, next) => {
  let result = reviewSchemas.validate(req.body);
  if (result.error) {
    throw new ExpressError(400, result.error);
  }
  next();
};
