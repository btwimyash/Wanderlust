const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Listing = require("../Major Project/models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
const Review = require("../Major Project/models/review");
const { reviewSchema } = require("./schema.js");

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.engine('ejs', ejsMate);
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));

const Mongo_url = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    mongoose.connect(Mongo_url);
}

app.get("/", (req, res) => {
    res.send("Hii! I am root!");
});

const validateListing = (req, res, next) => {
    console.log("Incoming request body:", req.body);
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, error);
    } 
    next();
};

const validateReview = (req, res, next) => {
    console.log("Incoming request body:", req.body);
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, error);
    } 
    next();
};

// app.get("/testListing", async (req, res) => {
//     let listing1 = new Listing({
//         title: "My new Villa",
//         des: "By the Beach",
//         price: 2000,
//         location: "Goa",
//         Country: "India"
//     });
//     await listing1.save();
//     res.send("added successfully!!");
// });

//index route
app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

//new route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

//create routes
app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {
    if (!req.body.Listings) {
        throw new ExpressError(400, "Send valid data for listing");
    }
    const newListing = new Listing(req.body.Listings);
    await newListing.save();
    res.redirect("/listings");  
}));

//show route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
}));

//edit route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

//update route
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
    if (!req.body.Listings) {
        throw new ExpressError(400, "Send valid data for listing");
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.Listings });
    console.log(req.body);
    res.redirect(`/listings/${id}`);
}));

//delete route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect(`/listings/`);
}));

//Reviews
//post route
app.post("/listings/:id/reviews",validateReview, wrapAsync(async (req,res)=>{
    let { id } = req.params;
    let listing= await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("new review saved");
    res.redirect(`/listings/${id}`);
}));

//Delete review Route
app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async (req,res)=>{
    let {id,reviewId}=req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    res.redirect(`/listings/${id}`);
}))

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
    // next(err);
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("listings/error.ejs", { message });
});

app.listen(8081, () => {
    console.log("Server is listening on port 8081");
});