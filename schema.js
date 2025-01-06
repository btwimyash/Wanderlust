const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    Listings: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required().min(0),
        country: Joi.string().required(),
        image: Joi.object({
            url: Joi.string().required(),
        }).required(),
        location: Joi.string().required(),
    }).required(),
});