//const Post = require('../models/Post.js')
const User = require('../models/User')
const { all } = require('../routes')
const auctionService = require('../services/auctionService')


exports.getHomePage = async (req, res) => {
        res.render('home')
}


exports.getBrowsePage = async (req, res) => {
        const allAuctions = await auctionService.getAll().lean()
        res.render('browse', {allAuctions})
}
// exports.getProfilePage = async (req,res) => {
//     const currentUser = await User.findById(req.user._id).lean()
//     const bookedHotels = await Hotel.find({bookedByUsers: req.user._id}).lean()
//     const hotels = bookedHotels.map(h => h.name)

//     res.render('auth/profile', { currentUser, hotels })

// }

// exports.getAboutPage = (req,res) => {
//     res.render('about')
// }

exports.getErrorPage404 = (req, res) => {
    res.render('404')
}