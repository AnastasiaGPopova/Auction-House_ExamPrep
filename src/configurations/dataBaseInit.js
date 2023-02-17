const mongoose = require('mongoose')
const config = require('./configPorts.js')

async function dataBaseInit(){
    mongoose.set('strictQuery', false)
    await mongoose.connect(config.DB_uri)
    console.log("Database conntected")

}

module.exports = dataBaseInit