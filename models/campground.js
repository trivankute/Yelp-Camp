const mongoose = require('mongoose');
const Schema = mongoose.Schema

// ops nay giup khi virtual cua schema van dc giu~ lai
// khi minh xai JSON.stringify de truyen du lieu
const ops = {toJSON: {virtuals:true}}

const CampgroundSchema = new Schema({
    title:String,
    image:
    [{
        url:String,
        filename:String,
    }]
    ,
    geometry:{
        type: {
            type: String,
            enum: ['Point'],
            required: true
          },
          coordinates: {
            type: [Number],
            required: true
          }
    },
    price:Number,
    description:String,
    location:String,
    author:
        {type:mongoose.Schema.Types.ObjectId,ref:"User"}
    ,
    reviews: [
        {type: mongoose.Schema.Types.ObjectId,
        ref:"Review"}
    ]
},ops)


CampgroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `<h3>${this.title}</h3>
    <span>${this.description.substring(0,20)}${(this.description.length>=20)?"...":"."}</span>
    </br>
    <a href="/campgrounds/${this._id}">Views this campground</a>`
})

module.exports = mongoose.model('Campground',CampgroundSchema)
