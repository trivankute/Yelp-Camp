const baseJoi = require('joi')
const ExpressError = require('./ExpressError')
const sanitizeHTML = require('sanitize-html')

const extension = (joi) => ({
    type:'string',
    base: joi.string(),
    messages:{
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules:{
        escapeHTML:{
            validate(value,helpers){
                const clean = sanitizeHTML(value,{
                    allowedTags:[],
                    allowedAttributes:{},
                })
                if(clean!==value) return helpers.error('string.escapeHTML',{value})
                return clean
            }
        }
    }
})

const Joi = baseJoi.extend(extension)

const validateCampground = (req,res,next) =>{
    const campgroundSchema = Joi.object(
        {
            campground: Joi.object({
                title: Joi.string().required().escapeHTML(),
                price:Joi.number().required().min(0),
                // image: Joi.string().required(),
                location: Joi.string().required().escapeHTML(),
                description: Joi.string().required().escapeHTML()
            }).required(),
            deleteImages:Joi.array()

        }
        // loi~ abc is not allowed at joi Schema la vi`
        // trong req body chi? dc nhieu do' th ko dc hon
        // neu it hon required se loi, nhieu hon cx loi
        // nen phai them deleteImages vao
    )
    const result = campgroundSchema.validate(req.body)
    if(result.error)
    {
        throw new ExpressError(result.error.details[0].message,400)
    }
    else{
        next()
    }
}
const validateReview = (req,res,next) =>{
    const reviewSchema = Joi.object(
        {
            review: Joi.object({
                body:Joi.string().required().escapeHTML(),
                rating:Joi.number().required()
            })
        }
    )
    const result = reviewSchema.validate(req.body)
    if(result.error)
    {
        throw new ExpressError(result.error.details[0].message,400)
    }
    else{
        next()
    }
}
module.exports = {validateCampground, validateReview}