//TO DO
const jtw = require('../lib/jsonwebtoken')
const config = require('../configurations/configPorts.js')

exports.authentication = async (req, res, next) => {
    const token = req.cookies['auth']

    if(token){
        //logged user
        try{
        const decodedToken = await jtw.verify(token, config.SECRET)
        req.user = decodedToken
        req.authenticated = true
        res.locals.username = decodedToken.email
        res.locals.firstName = decodedToken.firstName
        res.locals.isAuthenticated = true

        } catch(err){
            console.log(err.message)
            res.clearCookie('auth')
            return res.redirect('/404')
        }
    } else {
        //guest user
    }

    next()

}

exports.isAuthenticated = (req, res, next) => {

    if(!req.authenticated){
        return res.redirect('/login')
    }
    next()
}