//adding configuring of handlebars
const handlebars = require('express-handlebars')

function setupViewEngine(app) {
    app.engine('hbs', handlebars.engine({
        extname: 'hbs',
    }))
    
    app.set('view engine', 'hbs')
    app.set('views', './src/views') //we say where the views folder will be

}

module.exports = setupViewEngine

