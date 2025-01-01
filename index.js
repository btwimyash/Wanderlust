const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Listing = require("../Major Project/models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

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

app.get("/testListing", async (req, res) => {
    let listing1 = new Listing({
        title: "My new Villa",
        des: "By the Beach",
        price: 2000,
        location: "Goa",
        Country: "India"
    });
    await listing1.save();
    res.send("added successfully!!");
});

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
app.post("/listings", wrapAsync(async (req, res, next) => {
    if(!req.body.Listings){
        throw new ExpressError(400,"Send valid data for listing");
    }
    const newListing = new Listing(req.body.Listings);
    // console.log(req.body.Listings);
    await newListing.save();
    res.redirect("/listings");
}));

//show route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
}));

//edit route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

//update route
app.put("/listings/:id", wrapAsync(async (req, res) => {
    if(!req.body.Listings){
        throw new ExpressError(400,"Send valid data for listing");
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.Listings });
    res.redirect(`/listings/${id}`);
}));

//delete route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect(`/listings/`);
}));

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
    next(err);
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).send(message);
});

app.listen(8081, () => {
    console.log("Server is listening on port 8081");
});