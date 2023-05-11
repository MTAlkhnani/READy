const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    nameOfBook: String,
    priceOfBook: Number,
    rateOfBook: Object,
    descOfBook: String,
    imgSrc: String,
    authorOfBook: String,
    bookFormat: String,
    genreOfBook: String,
    pageNumOfBook: String,
})

// const userSchema = new mongoose.Schema({
//     name: String,
//     phone: String,
//     email: {
//         type: String,
//         required: true,
//     },
//     password: {
//         type: String,
//         required: true,
//     },
//     orders: [bookSchema],
//     wishlist: [bookSchema],
// })

module.exports = Book = mongoose.model("books", bookSchema)


