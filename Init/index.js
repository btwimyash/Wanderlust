const mongoose=require("mongoose");
const Listing=require("../models/listing");
const initData=require("./data");

const Mongo_url = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    mongoose.connect(Mongo_url);
}

const initDB=async ()=>{
   await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Data Added successfully!");
}

initDB();