const mongoose = require("mongoose");
const Review = require("../models/review.js");

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

// STARTING IF LISTING IS DELETING THEN ALL REVIEWS SHOULD BE DELETED

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

//  CLOSIING IF LISTING IS DELETING THEN ALL REVIEWS SHOULD BE DELETED

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
