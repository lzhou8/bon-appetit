var express = require("express");
var router = express.Router();
var Restaurant = require("../models/restaurant");

// INDEX route - show all restaurants
router.get("/", function(req, res){
    
    // Get all restaurants from database
    Restaurant.find({}, function(err, restaurants){
        if(err){
            console.log(err);
        } else {
            res.render("restaurants/index", {restaurants: restaurants});
        }
    });
});

// CREATE route - add new restaurant
router.post("/", isLoggedIn, function(req, res){
    
    // Get data from form
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;

    var author = {
        id: req.user._id,
        username: req.user.username
    };
    
     var newRestaurant = {name: name, image: image, description: description, author: author};
    
    // Create new restaurant
    Restaurant.create(newRestaurant, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/restaurants");
        }
    });
});

// NEW route - show form to create a new restaurant
router.get("/new", isLoggedIn, function(req, res){
    res.render("restaurants/new");

});

// SHOW route - show info about one restaurant
router.get("/:id", function(req,res){
    // Find restaurant with corresponding ID
    Restaurant.findById(req.params.id).populate("comments").exec(function(err, foundRestaurant){
        if(err){
            console.log(err);
        } else {
            console.log(foundRestaurant);
            res.render("restaurants/show", {foundRestaurant: foundRestaurant});
        }
    });
});

// EDIT route
router.get("/:id/edit", verifyRestaurantOwnership, function(req,res){
    
    // Check if user is logged in
    Restaurant.findById(req.params.id, function(err, foundRestaurant){
        res.render("restaurants/edit", {restaurant: foundRestaurant});
    });
});

// UPDATE route
router.put("/:id", verifyRestaurantOwnership, function(req,res){
   // Find and update restaurant
   Restaurant.findByIdAndUpdate(req.params.id, req.body.restaurant, function(err, updatedRestaurant){
       if(err){
           res.redirect("/restaurants");
       } else {
           res.redirect("/restaurants/" + req.params.id);
       }
   });
   // Redirect somewhere
});

// DESTROY route
router.delete("/:id", verifyRestaurantOwnership, function(req,res){
    Restaurant.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/restaurants");
        } else {
            res.redirect("/restaurants");
        }
    })
});

// Middleware - check if user is logged in
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

// Middleware - verify restaurant ownership
function verifyRestaurantOwnership(req, res, next) {
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
module.exports = router;