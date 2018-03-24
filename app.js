var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    User            = require("./models/user"),
    seedDB          = require("./seeds");

var commentRoutes       = require("./routes/comments"),
    restaurantRoutes    = require("./routes/restaurants"),
    indexRoutes         = require("./routes/index");

mongoose.connect("mongodb://localhost/food_guru");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
//seedDB(); // Seed the database

// Passport Configuration
app.use(require("express-session")({
    secret: "token",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

app.use(indexRoutes);
app.use("/restaurants/:id/comments", commentRoutes);
app.use("/restaurants", restaurantRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("FoodGuru has started..");
});


