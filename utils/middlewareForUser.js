
const Campground = require('../models/campground.js')
const Review = require('../models/review')

const isLoggedIn =
    (req,res,next) => {
    // console.log(req.path,req.originalUrl)
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error','You must be signed in first' )
        return res.redirect('/login')
    }
    else
    next()
}

const isAuthor = async function(req,res,next) {
    const {id} = req.params
    const campground = await Campground.findById(id)
    if(!campground.author.equals(req.user._id))
    {
        req.flash('error','This is not your campground')
        return res.redirect(`/campgrounds/${campground._id}`)
    }
    next()
}

const isReviewAuthor = async function(req,res,next) {
    const {id, reviewId} = req.params
    const review = await Review.findById(reviewId)
    const campground = await Campground.findById(id)
    if(!review.author.equals(req.user._id))
    {
        req.flash('error','This is not your review')
        return res.redirect(`/campgrounds/${campground._id}`)
    }
    next()
}

module.exports = {isLoggedIn,isAuthor,isReviewAuthor}