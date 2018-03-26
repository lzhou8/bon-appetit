var express     = require("express");
var router      = express.Router({mergeParams: true});
var Restaurant  = require("../models/restaurant");
var Comment     = require("../models/comment");

// NEW route
router.get("/new", isLoggedIn, function(req, res){
    Restaurant.findById(req.params.id, function(err, restaurant){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {restaurant: restaurant})
        }
    });
});

// CREATE route
router.post("/", isLoggedIn, function(req, res){
    
    // Find restaurant by ID
    Restaurant.findById(req.params.id, function(err, restaurant){
       if(err){
           console.log(err);
           res.redirect("/restaurants");
       } else {
            // Create a new comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    // Add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // Save comment
                    comment.save();
                    // Add comment to the corresponding restaurant
                    restaurant.comments.push(comment);
                    restaurant.save();
                    res.redirect("/restaurants/" + restaurant._id);
                }
            });
       }
    });
});

// EDIT route
router.get("/:comment_id/edit", function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {restaurant_id: req.params.id, comment: foundComment}); 
        }
    });
});

// UPDATE route
router.put("/:comment_id", function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/restaurants/" + req.params.id);
       }
   });
});

// DESTROY route
router.delete("/:comment_id", function(req, res){
     Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/restaurants/" + req.params.id);
        }
    });
});

// Middleware - check if user is logged in
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;