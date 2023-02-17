const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        match: /^[a-zA-Z0-9]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+/
        //minLength: [5, "Username should be at least 3 characters long!"]
    },
    password: {
        type: String,
        required: true,
        minLength: [5, 'Password too short! Password should be at least 5 characters long! ']
    },
    profile: {
        firstName: {
            type: String,
            required: true,
            minLength: [1, "First name should be at least 1 characters long!"]
        },
        lastName: {
            type: String,
            required: true,
            minLength: [1, "Last name should be at least 1 characters long!"]
        }
    },
    closedAuctions: [{
        type: mongoose.Types.ObjectId,
        ref: 'Auction'
    }]
})

userSchema.pre('save', function (next) {
    if (!this.isModified('password')) {
        return next()
    }
    bcrypt.hash(this.password, 10)
        .then(hash => {
            this.password = hash
            next()
        })
})

userSchema.method('validatePassword', function (password) {
    return bcrypt.compare(password, this.password) //this.password is the encrypted password. Password is the password that the user is giving

})

const User = mongoose.model('User', userSchema)
module.exports = User