const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    Listings: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required().min(0),
        country: Joi.string().required(),
        // image: Joi.object({
        //     url: Joi.string().uri().allow('').required(), 
        // }).required(),
        location: Joi.string().required(),
    }).required(),
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        comment: Joi.string().required(),
    }).required(),
});