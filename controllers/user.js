const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
  try {
    let { username, password, email } = req.body;
    let newUser = new User({ username, email });
    let registerUser = await User.register(newUser, password);
    req.login(registerUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "You Login Successfully");
      res.redirect("listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome to wanderlust ! ");

  if (res.locals.paramsId) {
    return res.redirect(res.locals.rawHeaders);
  }
  if (res.locals.redirectUrl) {
    res.redirect(res.locals.redirectUrl);
  } else {
    res.redirect("/listings");
  }
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next();
    }
    req.flash("success", "You Log Out");
    res.redirect("/listings");
  });
};
