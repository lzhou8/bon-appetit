var middlewareObject = {};
var Restaurant = require("../models/restaurant");
var Comment = require("../models/comment");

// Middleware - verify restaurant ownership
middlewareObject.verifyRestaurantOwnership = function(req, res, next) {
     if (req.isAuthenticated()){
         Restaurant.findById(req.params.id, function(err, foundRestaurant){
            if(err){
                res.redirect("/restaurants");
            } else {
                 // Then, check if user is authorized to edit the restaurant
                 if (foundRestaurant.author.id.equals(req.user._id)) {
                      next();
                 } else {
                     //  Otherwise, redirect user
                     res.redirect("back");
                 }
            }
        });
     } else {
        res.redirect("back");
    }
}

// Middleware - verify who can edit/remove comments
middlewareObject.verifyCommentOwnership = function(req, res, next) {
     if (req.isAuthenticated()){
         Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                 // Then, check if user is authorized to edit the comment
                 if (foundComment.author.id.equals(req.user._id)) {
                      next();
                 } else {
                     //  Otherwise, redirect user
                     res.redirect("back");
                 }
            }
        });
     } else {
        res.redirect("back");
    }
}

// Middleware - check if user is logged in
middlewareObject.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = middlewareObject;



