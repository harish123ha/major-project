const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.creatReview = async (req, res) => {
  let { id } = req.params;
  let listingId = await Listing.findById(id);
  const newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listingId.reviews.push(newReview);
  const result = await newReview.save();
  await listingId.save();
  req.flash("success", "New review added!");
  res.redirect(`/listings/${listingId._id}/show`);
  // res.redirect(`/listings/${id}/show`);
};

module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;
  let reviewDelete = await Review.findByIdAndDelete(reviewId);
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  req.flash("success", "Review Deleted!");
  res.redirect(`/listings/${id}/show`);
};
