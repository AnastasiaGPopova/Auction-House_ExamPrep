const  Auction = require('../models/Auction')
exports.isAuctionOwner = (user, auction) => {
    let isOwner = false
    if(user){
        if(user._id == auction.author._id){
            isOwner = true
        }
    }
   return isOwner
}



exports.isBidAlreadyLast = async (user, auctionId) => {
    const auction = await Auction.findById(auctionId).populate('bidderUsers').populate('author').lean()
    let isBidAlreadyLast = false
    //TO DO
    const lastBidder = auction.bidderUsers.pop()

    console.log(lastBidder.email)
    console.log(user.email)

    if(lastBidder.email == user.email){
        isBidAlreadyLast = true
    }
    return isBidAlreadyLast
}


exports.generateMethod = function (currentCategory){ //prepare view data

    // <option value="estate">Real Estate</option>
    // <option value="vehicles">Vehicles</option>
    // <option value="furniture">Furniture</option>
    // <option value="electronics">Electronics</option>
    // <option value="other">Other</option>
    const categories = [
        {
            key: "estate",
            label: "Real Estate",
            selected: false
        },
        {
            key: "vehicles",
            label: "Vehicles",
            selected: false
        },
        {
            key: "furniture",
            label: "Furniture",
            selected: false
        },
        {
            key: "electronics",
            label: "Electronics",
            selected: false
        },
        {
            key: "other",
            label: "Other",
            selected: false
        }
    ]

    const result = categories.map(x => x.key == currentCategory ? {...x, selected: true} : x)
    return result
}