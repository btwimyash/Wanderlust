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

const listings=require("./routes/listing.js");

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

app.use("/listings", listings);

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