const Campground = require('../models/campground') 
const Review = require('../models/review')
const {cloudinary} = require('../cloudinary')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({accessToken: mapBoxToken})

const indexRender = async(req,res)=>{
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index.ejs',{campgrounds})
}

const newRender = (req,res) => {
    res.render('campgrounds/new.ejs')
}

const createNew = async(req,res,next)=>{
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit:1
    }).send()
    const campground = new Campground(req.body.campground)
    campground.geometry = geoData.body.features[0].geometry
    campground.image = req.files.map(file => {
        return {url:file.path, filename:file.filename}}
        )
    campground.author = req.user._id
    await campground.save()
    req.flash('success','Successfully made a new campground')
    res.redirect(`/campgrounds/${campground._id}`)
}

const specificCampgroundRender = async(req,res)=>{
    const {id} = req.params
    // populated nest for author in reviews itself
    const campground = await Campground.findById(id).populate(
        {path:'reviews',
        populate:{
            path:'author'
        }
        })
        .populate('author')
    if(!campground)
    {
        req.flash('error','Cannot find campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show.ejs',{campground})
}

const updateCampground = async(req,res)=>{
    
    const {id} = req.params
    const campground = await Campground.findById(id)
    await Campground.findByIdAndUpdate(id,req.body.campground,{runValidators:true})

    const imgs = req.files.map(file => {
        return {url:file.path, filename:file.filename}}
        )
    campground.image.push(...imgs)

    if(campground.location !== req.body.campground.location)
    {
        const geoData = await geocoder.forwardGeocode({
            query: req.body.campground.location,
            limit:1
        }).send()
        campground.geometry = geoData.body.features[0].geometry
    }
    
    await campground.save()
    if(req.body.deleteImages)
    {
        for(let filename of req.body.deleteImages)
        {
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({$pull:{image:{filename:{$in:req.body.deleteImages}}}})
    }
    req.flash('success','Successfully updated')
    res.redirect(`/campgrounds/${campground._id}`)
}

const deleteCamground = async(req,res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id)
    if(campground.image.length>0)
    {
        for(let img of campground.image)
        {
            await cloudinary.uploader.destroy(img.filename)
        }
    }
    await Review.deleteMany({id:{$in:Campground.reviews}})
    await Campground.findByIdAndDelete(id)
    req.flash('success','Successfully deleted')
    res.redirect('/campgrounds')
}

const editCamgroundRender = async(req,res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id)
    if(!campground)
    {
        req.flash('error','Cannot find campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit.ejs',{campground})
}

module.exports = {
    indexRender,
    createNew,
    newRender,
    specificCampgroundRender,
    updateCampground,
    deleteCamground,
    editCamgroundRender
}