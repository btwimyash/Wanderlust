const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Listing=require("../Major Project/models/listing");
const path=require("path");

app.use(express.urlencoded({ extended: true }));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

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
    let listing1=new Listing({
        title:"My new Villa",
        des:"By the Beach",
        price:2000,
        location:"Goa",
        Country:"India" 
    });
    await listing1.save();
    res.send("added successfully!!");
});

//index route
app.get("/listings",async (req,res)=>{
    const allListings= await Listing.find({});
    res.render("listings/index.ejs",{allListings});
});

//new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});

//create route
app.post("/listings",async(req,res)=>{
    const newListing= new Listing (req.body.Listings);
    // console.log(req.body.Listings);
    await newListing.save();
    res.redirect("/listings");
});

//show route
app.get("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    const data= await Listing.findById(id);
    res.render("listings/show.ejs",{data});
});


app.listen(8081, () => {
    console.log("Server is listening on port 8081");
});