require("dotenv").config();
const express = require("express");
const app = express();
const PORT = 8080;
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js");
const flash = require("connect-flash");
const session = require("express-session");
const MongoStore = require("connect-mongo");
// passport
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
// routes folder
const listingRoute = require("./routes/listing.js");
const reviewRoute = require("./routes/review.js");
const userRoute = require("./routes/user.js");
// isLoggedIn middleware => is used for not to create listing befor login
const isLoggedIn = require("./middleware.js");

const path = require("path");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

const dbUrl = process.env.ATLASDB_URL;
// console.log(dbUrl);
// const mongoUrl = "mongodb://127.0.0.1:27017/wanderlust";
async function main() {
  await mongoose.connect(dbUrl);
}

main()
  .then((res) => {
    console.log("connection successful");
  })
  .catch((err) => {
    console.log(err);
  });

// connect mongo
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("error in mongo session", error);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httponly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());
// IF YOU WANT TO USER PASSPORT THE MAKE SURE YOU ARE USING SESSIONoPTION MEASN EXPRESS SESSIONS
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// STARTING HERE MIDDLEWARE FOR SHOWING FLASH OKAY

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

// CLOSEING HERE MIDDLEWARE FOR SHOWING FLASH OKAY

// STARTING HERE REQUIRING REVIEW.JS AND LISTING.J FROM ROUTES FOLDER

app.use("/listings", listingRoute);
app.use("/listings/:id/reviews", reviewRoute);
app.use("/", userRoute);

// CLOSING HERE REQUIRING REVIEW.JS AND LISTING.J FROM ROUTES FOLDER

// ERROR HANDLING

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not find"));
});

app.use((err, req, res, next) => {
  let { status = 500, message = "something went wrong" } = err;
  res.render("listings/error.ejs", { message });
});

app.listen(PORT, () => {
  console.log("app is listenint on port 8080...");
});
// sd
