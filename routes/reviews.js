const express = require('express')
const route = express.Router({mergeParams:true})
// de truy cap id qua router thi can phai co 

const {validateReview} = require('../utils/validateForCampgroundSchema')
const catchAsync = require('../utils/catchAsync')
const {isLoggedIn, isReviewAuthor} = require('../utils/middlewareForUser')
const reviewController = require('../controllers/review')

route.post('/', isLoggedIn , validateReview,catchAsync(reviewController.createReview))
route.delete('/:reviewId', isLoggedIn , isReviewAuthor, catchAsync(reviewController.deleteReview))

module.exports = route