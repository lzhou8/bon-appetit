var mongoose = require("mongoose");
var Comment = require("./models/comment");
var Restaurant = require("./models/restaurant");
var data = [
    {
        name: "Shake Shack", 
        image: "http://burgerdays.com/wp-content/uploads/2011/11/shackburger.jpg",
        description: "One of the best burger chains in the country"
    },
    {
        name: "Sushi Nakazawa",
        image: "https://i.pinimg.com/originals/d4/ed/2c/d4ed2c270c4914ad5904de4590654741.jpg",
        description: "An elegent sushi restaurant in NYC"
    }, 
    {
        name: "La Contenta Oeste",
        image: "https://pbs.twimg.com/media/DQyNbg8UEAQrrdG.jpg",
        description: "High-end Mexican restaurant in Greenwich Village, New York City"
    }
]
function seedDB() {
    Restaurant.remove({}, function(err){
        /*if(err){
            console.log(err);
        } else {
            console.log("Removed restaurants");
            data.forEach(function(seed){
               Restaurant.create(seed, function(err, restaurant){
                   if(err){
                       console.log(err);
                   } else {
                       console.log("Added a restaurant");
                       Comment.create(
                            {       
                                text: "This place is great!",
                                author: "Homer"
                            }, function(err,comment){
                                    if(err){
                                        console.log(err);
                                    } else {
                                        restaurant.comments.push(comment);
                                        restaurant.save();
                                        console.log("Created new comment");
                                    }
                                })
                            }
               });
            });
        
        }*/
    });
}

module.exports = seedDB;