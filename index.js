const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Listing=require("../Major Project/models/listing");

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

app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});