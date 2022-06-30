if(process.env.NODE_ENV!=='production')
    {require('dotenv').config()}
const express = require('express')
const path = require('path')
const app = express()
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')

const MongoDBStore =  require('connect-mongo')

const usersRouter = require('./routes/users')
const campgroundsRouter = require('./routes/campgrounds')
const reviewsRouter = require('./routes/reviews')

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp"
// process.env.DB_URL
// mongodb://localhost:27017/yelp-camp
mongoose.connect(dbUrl,{
    // useNewUrlParse:true,
    // useCreateIndex:true,
    // useUnifiedTopology:true,
    // useFindAndModify:false
})
  .then(() => console.log("Connection to mongoDB opens"))
  .catch(error => handleError(error));
function handleError(error) {
    console.log(error)
}

const secret = process.env.SECRET || "trivandeptrai"

const options = {
    mongoUrl:dbUrl,
    secret,
    touchAfter: 24*60*60
}

app.use(session({
    store:MongoDBStore.create({...options}),
    name:"_van",
    secret,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        // secure:true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
 }))
app.use(flash())


app.use(helmet())

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/dv5vm4sqh/"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/dv5vm4sqh/"
];
const connectSrcUrls = [
    "https://*.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://events.mapbox.com",
    "https://res.cloudinary.com/dv5vm4sqh/"
];
const fontSrcUrls = [ "https://res.cloudinary.com/dv5vm4sqh/" ];
app.use(
    helmet.contentSecurityPolicy({
        directives : {
            defaultSrc : [],
            connectSrc : [ "'self'", ...connectSrcUrls ],
            scriptSrc  : [ "'unsafe-inline'", "'self'", ...scriptSrcUrls ],
            styleSrc   : [ "'self'", "'unsafe-inline'", ...styleSrcUrls ],
            workerSrc  : [ "'self'", "blob:" ],
            objectSrc  : [],
            imgSrc     : [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dotr7u5kq/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
                "https://images.unsplash.com/",
                "https://source.unsplash.com",
            ],
            fontSrc    : [ "'self'", ...fontSrcUrls ],
            mediaSrc   : [ "https://res.cloudinary.com/dv5vm4sqh/" ],
            childSrc   : [ "blob:" ]
        }
    })
);
// ensure pass.seesion is below session
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.engine('ejs',ejsMate)
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize({
    replaceWith:'_'
}))


app.use((req,res,next)=>{
    // tat ca template se truy cap vao currUser dc
    res.locals.currUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})


app.get('/',(req,res)=>{
    res.render('home')
})

// forUser route
app.use('/',usersRouter)



// campgrounds route
app.use('/campgrounds',campgroundsRouter)
// app.get('/campgrounds',catchAsync(async(req,res)=>{
//     const campgrounds = await Campground.find({})
//     res.render('campgrounds/index.ejs',{campgrounds})
// }))

// app.post('/campgrounds',validateCampground,catchAsync(async(req,res,next)=>{
    // if(!req.body.campground) next(new Express("No data",400))
    // web do co' validator cua bootstrap ngan cho user client ko an loi~ dc
    // nhung neu gian tiep post thi` se bi.
    // voi joi mk co the hien. thuc. hoa dc viec ko can` phai tu. tay code validation cho js
    // co the check validator for email dc lun
    
    // doi vs code nay thi ko can Joi, vi no se tu run validator
    // trong express
    // nho` joi thi` ben schema ben kia ko can khai bao required van dc
//     const campground = new Campground(req.body.campground)
//     await campground.save()
//     res.redirect(`/campgrounds/${campground._id}`)
// }))
// app.get('/campgrounds/new', catchAsync(async (req,res)=>{
//     res.render('campgrounds/new.ejs')
// }))
// app.get('/campgrounds/:id', catchAsync(async(req,res)=>{
//     const {id} = req.params
//     const campground = await Campground.findById(id).populate('reviews')
//     res.render('campgrounds/show.ejs',{campground})
// }))
// app.put('/campgrounds/:id',validateCampground,catchAsync(async(req,res)=>{
//     const {id} = req.params
//     const campground = await Campground.findByIdAndUpdate(id,req.body.campground,{runValidators:true})
//     res.redirect(`/campgrounds/${campground._id}`)
// }))
// app.delete('/campgrounds/:id',catchAsync(async(req,res)=>{
//     const {id} = req.params
//     const campground = await Campground.findById(id)
//     await Review.deleteMany({id:{$in:Campground.reviews}})
//     await Campground.findByIdAndDelete(id)
//     res.redirect('/campgrounds')
// }))
// app.get('/campgrounds/:id/edit',catchAsync(async (req,res)=>{
//     const {id} = req.params
//     const campground = await Campground.findById(id)
//     res.render('campgrounds/edit.ejs',{campground})
// }))


// reviews route
app.use('/campgrounds/:id/reviews',reviewsRouter)
// app.post('/campgrounds/:id/reviews',validateReview,catchAsync(async(req,res,next)=>{
//     const campground = await Campground.findById(req.params.id)
//     const review = await new Review(req.body.review)
//     campground.reviews.push(review)
//     await review.save()
//     await campground.save()
//     res.redirect(`/campgrounds/${req.params.id}`)
// }))
// app.delete('/campgrounds/:id/reviews/:reviewId',catchAsync(async(req,res)=>{
//     const {id, reviewId} = req.params
//     const campground = await Campground.findById(id)
//     await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
//     await Review.findByIdAndDelete(reviewId)
//     res.redirect(`/campgrounds/${id}`)
// }))





// chan. loi~ voi all and *, khi tat ca path deu ko vao, hoac match vs bat ki cai tren hoac path strange
app.all('*',(req,res,next)=>{
    next(new ExpressError("Page not found",404))
})
app.use((err,req,res,next)=>{
    const {message = "Syntax error",status = 500} = err
    if(!err.message)
        err.message = message
    res.status(status).render('error',{err})
})

const PORT = process.env.PORT || 3000

app.listen(PORT,(req,res)=>{
    console.log(`On my way on port ${PORT}`)
})