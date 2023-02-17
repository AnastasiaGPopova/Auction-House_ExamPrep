const express = require('express')
const cookieParser = require('cookie-parser')

const app = express()

const routes = require('./routes')
const config = require('./configurations/configPorts.js')

const setupViewEngine = require('./configurations/viewEngineHandleBars')
const dataBaseInit = require('./configurations/dataBaseInit.js')
const authMiddleware = require('./middlewares/authMiddleware.js')

setupViewEngine(app)


//----------another way of importing/calling setupViewEngine--------------------
// require('./configurations/viewEngineHandleBars')(app) /it gets the function directly and runs it
//--------------------------------------------------------------------------------


app.use("/static", express.static('src/public'))
app.use(cookieParser())
//-----Adding middleware-------
app.use(express.urlencoded({extended: false})) //Always! it returns a middleware which parse the url encoded body, this will be used for every request

app.use(authMiddleware.authentication)//before the routes and after cookies parser and urldecoded, we need to add the authMiddleware
//all requests will go trough the auth middleware

app.use(routes)

dataBaseInit()
            .then(() => app.listen(config.PORT, () => console.log(`Server is running on Port ${config.PORT} ...`)))
            .catch((err) => console.error(err))