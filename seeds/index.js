const mongoose = require('mongoose')
const cities = require('./cities.js')
const {places,descriptors} = require('./seedHelpers.js')
const Campground = require('../models/campground.js')
mongoose.connect('mongodb://localhost:27017/yelp-camp')
  .then(() => console.log("Connection to mongoDB opens"))
  .catch(error => handleError(error));
function handleError(error) {
    console.log(error)
}
const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)]
}
const seedDB = async() => {
    await Campground.deleteMany({})
    for (let i = 0;i<50;i++)
    {
        const random1000 = Math.floor(Math.random()*1000)
        const c = new Campground({
            location:`${cities[random1000].city},${cities[random1000].state}`
            ,title:`${sample(descriptors)} ${sample(places)}` ,
            geometry:{
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude]
            },
            image:
            [{
               url:"https://source.unsplash.com/collection/483251",
               filename:"fakePicture"
            }],
            description:"Rat depppp",
            price:Math.floor(Math.random()*1000),
            author:'62aeb8e41e30c8d406a6756e'
        })
        await c.save()
    }
    
    
}
seedDB()
    .then(() => console.log("DB connection done"))