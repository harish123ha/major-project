const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  const allData = await Listing.find({});
  res.render("listings/index.ejs", { allData });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  console.log(url);
  console.log(filename);
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();

  req.flash("success", "New listing added!");
  res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "The listing you trying to request is not exist!!!!");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listingEdit = await Listing.findById(id);
  res.render("listings/edit.ejs", { listingEdit });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;

  const listingPatch = await Listing.findById(id);
  const listingUpdate = await Listing.findByIdAndUpdate(id, {
    ...req.body.listing,
  });
  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    listingUpdate.image = { url, filename };
    await listingUpdate.save();
  }
  req.flash("success", "Listing Updated Successfully");
  res.redirect(`/listings/${id}/show`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("owner");
  let deleted = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted successful");
  res.redirect("/listings");
};

module.exports.searchBar = async (req, res) => {
  let { search } = req.query;

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

  req.flash("success", "data found");
  res.render("listings/index.ejs", { allData: data });
};
