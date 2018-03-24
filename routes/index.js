var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// Landing route
router.get("/", function(req, res){
    res.render("landing");
});

// Show sign up form
router.get("/register", function(req, res){
    res.render("register");
});

// Handle sign up logic
router.post("/register", function(req, res){
    // Create new user
    var newUser = new User({username: req.body.username});
    // Register new user
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/restaurants");
        });
    });
});

// Show login form
router.get("/login", function(req, res){
    res.render("login");
});

// Handle login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/restaurants",
        failureRedirect: "/login"
    }), function(req, res){
});

// Logout route 
router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/restaurants");
});

// Middleware - check if user is logged in
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;