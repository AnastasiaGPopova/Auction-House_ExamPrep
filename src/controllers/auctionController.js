const Auction = require('../models/Auction')
const User = require('../models/User')
const auctionService = require('../services/auctionService')
const auctionUtility = require('../utils/auctionUtility')
const parser = require('../utils/parser')



exports.getAuctionCreationPage = (req, res) => {
    res.render('create')
}

exports.postCreatedAuction = async (req, res) => {
    const { title, category, imageUrl, price, description } = req.body

    try {
        if (!title || !category || !imageUrl || !price) {
            throw new Error("Title, category and imageUrl are requiered fields!")
        }
        const newAuction = await auctionService.createNew({ title, category, imageUrl, price, description, author: req.user._id })//encoded body-to, which we receive, will create a new cube
        //redirect
        res.redirect('/')

    } catch (error) {
        const errors = parser.parseError(error)
        res.render('create', { errors })
    }

}

exports.getDetails = async (req, res) => {

    let currentAuction = await auctionService.getOne(req.params.auctionId)//it makes a request to the DB and gives us back all accessories with all details and infos/not only the ID/
        .populate('bidderUsers')
        .populate('author')
        .lean()

    if (!currentAuction) {
        return res.redirect('/404')
    }

    let isLogged = false
    let bidArray = []
    currentAuction.bidderUsers.map(x => {
        bidArray.push(`${x.profile.firstName} ${x.profile.lastName}`)
    })
    let isBid = true
    if (bidArray.length == 0) {
        isBid = false
    }

    bidArray = bidArray.join(', ')
    let isBidAlreadyLast = false
    if (req.user) {
        isLogged = true

        const isOwner = auctionUtility.isAuctionOwner(req.user, currentAuction)
        if (isBid) {
            isBidAlreadyLast = await auctionUtility.isBidAlreadyLast(req.user, req.params.auctionId)
        }

        res.render('details', { currentAuction, isLogged, isOwner, isBid, bidArray, isBidAlreadyLast })
    } else {
        res.render('details', { currentAuction, isLogged })
    }
}

exports.bid = async (req, res) => {

    const currentAuction = await auctionService.getOne(req.params.auctionId)
    const isOwner = auctionUtility.isAuctionOwner(req.user, currentAuction)
    const { bidAmount } = req.body

    let isLogged = true

    if (isOwner) {
        res.redirect('/')
    }

    try {
        currentAuction.bidderUsers.push(req.user._id)

        if (bidAmount <= currentAuction.price) {
            throw new Error("Low bid!")
        }

        currentAuction.price = bidAmount
        await currentAuction.save()
        res.redirect(`/${req.params.auctionId}/details`)

    } catch (error) {
        const errors = parser.parseError(error)
        let currentAuction = await auctionService.getOne(req.params.auctionId)//it makes a request to the DB and gives us back all accessories with all details and infos/not only the ID/
            .populate('bidderUsers')
            .populate('author')
            .lean()
        res.render('details', { currentAuction, isLogged, isOwner, errors })
    }
}


exports.getEditPage = async (req, res) => {
    const currentAuction = await auctionService.getOne(req.params.auctionId).populate('author').lean()
    const isOwner = auctionUtility.isAuctionOwner(req.user, currentAuction)

    if (!isOwner) {
        res.redirect('/')
    } else {
        const categories = auctionUtility.generateMethod(currentAuction.category)
        res.render('edit', { currentAuction, categories })
    }
}



exports.postEditedAuction = async (req, res) => {
    const { title, category, imageUrl, price, description } = req.body

    try {
        if (!title || !category || !imageUrl || !price) {
            throw new Error("Title, category and imageUrl are requiered fields!")
        }
        const updatedAuction = await auctionService.update(req.params.auctionId, { title, category, imageUrl, price, description })//encoded body-to, which we receive, will create a new cube

        res.redirect(`/${req.params.auctionId}/details`)

    } catch (error) {
        const errors = parser.parseError(error)
        res.render(`edit`, { errors })
    }
}


exports.getDeleteAuction = async (req, res) => {
    const auction = await auctionService.getOne(req.params.auctionId).populate('author').lean()
    const isOwner = auctionUtility.isAuctionOwner(req.user, auction)

    if (!isOwner) {
        res.redirect('/')
    } else {
        const test = await auctionService.delete(req.params.auctionId)
        res.redirect('/')
    }
}

exports.getClosedPage = async (req,res) => {
    const allUnactive = await auctionService.getAllUnactive().populate('bidderUsers')
                                                             .populate('author')
                                                             .lean()
    res.render('closed-auctions', {allUnactive})
}

exports.postClosed = async (req, res) => {
    const currentAuction = await auctionService.getOne(req.params.auctionId)
    const currentAuction2 = await auctionService.getOne(req.params.auctionId).populate('bidderUsers')
    .populate('author')
    .lean()

    let winnerName = ''

    console.log(currentAuction2.bidderUsers.length)

    if(currentAuction2.bidderUsers.length > 0){
        const lastBidder = currentAuction2.bidderUsers.pop()
        winnerName = `${lastBidder.profile.firstName} ${lastBidder.profile.lastName}`
    } else {
        
        winnerName = `${currentAuction2.author.profile.firstName} ${currentAuction2.author.profile.lastName}`
    }

    currentAuction.isOpened = false
    currentAuction.winner = winnerName

    await currentAuction.save()
    res.redirect('/closedAuctions')
}