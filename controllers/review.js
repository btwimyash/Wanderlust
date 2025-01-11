const Review = require("../models/review");
const Listing = require("../models/listing");

module.exports.createReview = async (req,res)=>{
    let { id } = req.params;
    let listing= await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    console.log(newReview);
    await newReview.save();
    await listing.save();

    console.log("new review saved");
    req.flash("success","Review Added Successfully!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyReview = async (req,res)=>{
    let {id,reviewId}=req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
};