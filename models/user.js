const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    nameOfBook: String,
    priceOfBook: Number,
    rateOfBook: Number,
    imgSrc: String,
})

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
    orders: [bookSchema],
    wishlist: [bookSchema],
})

module.exports = User = mongoose.model("users", userSchema)    
