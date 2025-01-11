const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

const listingController = require("../controllers/listings.js");

//index and create route
router.route("/")
    .get(wrapAsync(listingController.index))
    // .post(validateListing, isLoggedIn, wrapAsync(listingController.createListing));
    .post(upload.single('Listings[image]'), function (req, res, next) {
        res.send(req.file);
      });

    
//new route
router.get("/new", isLoggedIn, listingController.renderNewForm);


//show route,update route and delete route
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));


//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;