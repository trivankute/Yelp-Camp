const Campground = require('../models/campground.js')
const Review = require('../models/review')

const createReview = async(req,res,next)=>{
    const campground = await Campground.findById(req.params.id)
    const review = await new Review(req.body.review)    
    review.author = req.user._id
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success','Successfully made a review')
    res.redirect(`/campgrounds/${req.params.id}`)
}

const deleteReview = async(req,res)=>{
    const {id, reviewId} = req.params
    const campground = await Campground.findById(id)
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash('success','Successfully deleted a review')
    res.redirect(`/campgrounds/${id}`)
}

module.exports = {
    createReview,
    deleteReview
}