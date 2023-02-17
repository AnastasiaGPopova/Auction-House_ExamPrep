const mongoose = require('mongoose')

const auctionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: [4, "Too short! Title should be at least 4 characters !"]
    }, 
    description: {
        type: String,
        //required: true,
        maxLength: [200, "Too long! Description max 200 characters !"]
    
    },
    category: {
        type: String,
        required: true,
        enum: { values:["estate", "vehicles", "furniture", "other", "electronics"], message:'Type field can be only "Vehicles", "Real Estate", "Electronics", "Furniture", "Other" !'}
       // minLength: [6, "Too short! Keyword should be at least 6 characters !"]
    },
    imageUrl: {
        type: String,
        required: true,
        // match: /^https?:\/\//
        validate : {
            validator: function (value){
                return value.startsWith("http://") || value.startsWith("https://")
            },
            message: "Invalid URL!"
        }
    }, 
    price: {
        type: Number,
        required: true,
        min: 0
        //maxLength: [15, "Too long! Location should be 15 characters !"]
    },
    author: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    bidderUsers:[{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],
    
    // createdAt: {
    //     type: Date, default: Date.now
    // },
}, { timestamps: true })

const Auction = mongoose.model('Auction', auctionSchema)
module.exports = Auction