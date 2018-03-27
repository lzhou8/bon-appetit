var express = require("express");
var router = express.Router();
var Restaurant = require("../models/restaurant");
var middleware = require("../middleware");

// INDEX route - show all restaurants
router.get("/", function(req, res){
    
    // get all restaurants from database
    Restaurant.find({}, function(err, restaurants){
        if(err){
            console.log(err);
        } else {
            res.render("restaurants/index", {restaurants: restaurants});
        }
    });
});

// CREATE route - add new restaurant
router.post("/", middleware.isLoggedIn, function(req, res){
    
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
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("restaurants/new");

});

// SHOW route - show info about one restaurant
router.get("/:id", function(req,res){
    // Find restaurant with corresponding ID
    Restaurant.findById(req.params.id).populate("comments").exec(function(err, foundRestaurant){
        if(err){
            console.log(err);
             res.redirect("/restaurants");
        } else {
            console.log(foundRestaurant);
            res.render("restaurants/show", {foundRestaurant: foundRestaurant});
        }
    });
});

// EDIT route
router.get("/:id/edit", middleware.verifyRestaurantOwnership, function(req,res){
    // Check if user is logged in
    Restaurant.findById(req.params.id, function(err, foundRestaurant){
        res.render("restaurants/edit", {restaurant: foundRestaurant});
    });
});

// UPDATE route
router.put("/:id", middleware.verifyRestaurantOwnership, function(req,res){
   // Find and update restaurant
   Restaurant.findByIdAndUpdate(req.params.id, req.body.restaurant, function(err, updatedRestaurant){
       if(err){
           res.redirect("/restaurants");
       } else {
           res.redirect("/restaurants/" + req.params.id);
       }
   });
});

// DESTROY route
router.delete("/:id", middleware.verifyRestaurantOwnership, function(req,res){
    Restaurant.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/restaurants");
        } else {
            res.redirect("/restaurants");
        }
    })
});

module.exports = router;