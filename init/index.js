const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const data = require("./data.js");

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

main()
  .then((res) => {
    console.log("connection successful");
  })
  .catch((err) => {
    console.log(err);
  });

const initdb = async () => {
  await Listing.deleteMany({});
  console.log("deleted successful");
  // data = data.map((obj) => ({
  //   ...obj,
  //   owner: "66cc232a1cf0bcd7c341c4b7",
  // }));// not work
  await Listing.insertMany(data);
  console.log("inserting seccessful");
};

initdb();
