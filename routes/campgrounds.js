const express = require('express')
const router = express.Router();

const {validateCampground} = require('../utils/validateForCampgroundSchema')
const catchAsync = require('../utils/catchAsync')
const {isLoggedIn, isAuthor} = require('../utils/middlewareForUser')
const campgroundController = require('../controllers/campground') 
const multer  = require('multer')
// nodeJs automatically looks for index.js file
const {storage} = require('../cloudinary')
const upload = multer({ storage })

// order is important, /new must on top of /:id

router.route('/')
        .get(catchAsync(campgroundController.indexRender))
        .post(isLoggedIn, upload.array('image') ,validateCampground, catchAsync(campgroundController.createNew))
        // .post(upload.single('image'),(req,res)=>{
        //         console.log(req.body,req.file)
        // })
        // for array uploading
        // .post(upload.array('image'),(req,res)=>{
        //         console.log(req.body,req.files)
        //         res.send("it worked")
        // })

router.get('/new', isLoggedIn, campgroundController.newRender)

router.route('/:id')
        .get(catchAsync(campgroundController.specificCampgroundRender))
        .put(isLoggedIn, isAuthor, upload.array('image') ,validateCampground,catchAsync(campgroundController.updateCampground))
        .delete(isLoggedIn, isAuthor,catchAsync(campgroundController.deleteCamground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgroundController.editCamgroundRender))

module.exports = router;