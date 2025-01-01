const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Listing = require("../Major Project/models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

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
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
});

//new route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

//create routes
app.post("/listings", async (req, res, next) => {
    try {
        const newListing = new Listing(req.body.Listings);
        // console.log(req.body.Listings);
        await newListing.save();
        res.redirect("/listings");
    } catch(err) {
        console.error("Caught Error in Create Route:", err); 
        next(err);
    }
});

//show route
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
});

//edit route
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
});

//update route
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.Listings });
    res.redirect(`/listings/${id}`);
});

//delete route
app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect(`/listings/`);
});

app.use((err, req, res, next) => {
    res.send("Something went wrong!!");
    next();
});

app.listen(8081, () => {
    console.log("Server is listening on port 8081");
});