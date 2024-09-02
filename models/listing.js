const mongoose = require("mongoose");
const Review = require("../models/review.js");

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    default:
      "https://a0.muscache.com/im/pictures/miso/Hosting-36123656/original/d76c75a4-751c-4016-a12f-b20ebfd9e8c1.jpeg?im_w=720",
    set: (v) =>
      v === ""
        ? "https://a0.muscache.com/im/pictures/miso/Hosting-36123656/original/d76c75a4-751c-4016-a12f-b20ebfd9e8c1.jpeg?im_w=720"
        : v,
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
