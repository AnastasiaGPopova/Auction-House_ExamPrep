//--------Configuring the router /which gets exported at the end----------
const express = require('express')
const Router = express.Router
const router = Router()
// ----------------------------------


//----- importing the controllers----------
const auctionController = require('./controllers/auctionController')
const homeController = require('./controllers/homeController')
const authController = require('./controllers/authController.js')
const {isAuthenticated} = require('./middlewares/authMiddleware.js')

//-------------------------------------------


router.get('/', homeController.getHomePage)
router.get('/browse', homeController.getBrowsePage)


//Login and Register

router.get('/login', authController.loginPage)
router.get('/register', authController.registerPage)
router.post('/register', authController.postRegisterUser)
router.post('/login', authController.postLoginUser)


//auction creation
router.get('/create', isAuthenticated, auctionController.getAuctionCreationPage )
router.post('/create', isAuthenticated, auctionController.postCreatedAuction)

//Details Page
router.get('/:auctionId/details', auctionController.getDetails)

 //bid
router.post('/:auctionId/bid', isAuthenticated, auctionController.bid)
// // router.get('/post/:postId/voteDown', isAuthenticated, postController.voteDown)

 //Edit page
router.get('/:auctionId/edit', isAuthenticated, auctionController.getEditPage)
router.post('/:auctionId/edit', isAuthenticated, auctionController.postEditedAuction)

//Delete post
router.get('/:auctionId/delete', isAuthenticated, auctionController.getDeleteAuction)

 //close
router.get('/:auctionId/close', isAuthenticated, auctionController.postClosed)
router.get('/closedAuctions', isAuthenticated, auctionController.getClosedPage)
// router.post('/search', isAuthenticated, auctionController.getSearchPagewithResults)


router.get('/logout', isAuthenticated, authController.logout)
// router.get('*', homeController.getErrorPage404)
// router.get('/404', homeController.getErrorPage404)



module.exports = router