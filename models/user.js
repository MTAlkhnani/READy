const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    orders: [{
        nameOfBook: String,
        priceOfBook: String,
        ratingOfBook: Number,
    }],
    wishlist: [{
        nameOfBook: String,
        priceOfBook: String,
        ratingOfBook: Number,
    }],
})

module.exports = User = mongoose.model("users", userSchema)