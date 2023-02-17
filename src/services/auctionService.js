const Auction = require('../models/Auction')

exports.getOne= (auctionId) => Auction.findById(auctionId)
exports.getAllActive = () => Auction.find({isOpened: true})
exports.getAllUnactive = () => Auction.find({isOpened: false})
exports.getLastAdded = () => Auction.find({}).sort({createdAt: -1})
exports.update = (auctionId, data) => Auction.findByIdAndUpdate(auctionId, data, {runValidators: true})
exports.delete = (auctionId) => Auction.findByIdAndDelete(auctionId, {runValidators: true})
exports.getSearchedbyType = (item) => Auction.find({}).where('type').equals(`${item}`)
exports.createNew = (data) => Auction.create(data)
exports.getSearchedbyItem = (item) => {
    const regex = new RegExp(item, 'i') // i for case insensitive
    return Auction.find({title: {$regex: regex}})
    }
