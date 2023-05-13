const searchForm = document.querySelector('.search-form')

document.querySelector('#search-btn').onclick = () => {
  searchForm.classList.toggle('active')
}

const productData = {
  name: 'Product Name',
  description: 'Product Description',
  image: 'https://via.placeholder.com/250x250.png',
  rating: 0,
  numRatings: 0,
  totalRatings: 0,
  rated: false // new rated property to track if the user has already rated the product
}

// Set product data in HTML
const productElem = document.querySelector('.product')
const productRatingStarsElem = productElem.querySelector('.rating-stars')
const productRatingValueElem = productElem.querySelector('.rating-value')
const productAvgRatingElem = productElem.querySelector('.average-rating')
const successMassage = productElem.querySelector('.success-message')


productRatingValueElem.innerHTML = productData.rating.toFixed(1)

// Set rating stars based on rating value
const ratingStarsElems = productRatingStarsElem.querySelectorAll('i')


for (let i = 0; i < ratingStarsElems.length; i++) {
  ratingStarsElems[i].addEventListener('click', function () {
    if (productData.rated) {
      // disable rating if the user has already rated the product
      return
    }
    const rating = parseInt(this.getAttribute('data-rating'))
    productData.numRatings++
    productData.totalRatings += rating
    productData.rating = productData.totalRatings / productData.numRatings
    productRatingValueElem.innerHTML = productData.rating.toFixed(1)
    productAvgRatingElem.innerHTML = 'Rated: ' + productData.rating.toFixed(1)

    // Update rating stars
    for (let j = 0; j < ratingStarsElems.length; j++) {
      if (j < Math.floor(productData.rating)) {
        ratingStarsElems[j].classList.remove('fa-star-o')
        ratingStarsElems[j].classList.add('fa-star')
      } else {
        ratingStarsElems[j].classList.remove('fa-star')
        ratingStarsElems[j].classList.add('fa-star-o')
      }
    }

    productData.rated = true // set rated property to true to disable further ratings
    successMassage.setAttribute('style', 'color: green')

    // Disable rating stars
    for (let k = 0; k < ratingStarsElems.length; k++) {
      ratingStarsElems[k].removeEventListener('click', arguments.callee) // remove event listener
      ratingStarsElems[k].classList.remove('rating-active') // remove hover effect
    }
  })

  ratingStarsElems[i].addEventListener('mouseover', function () {
    if (productData.rated) { // disable hover effect if the user has already rated the product
      return
    }
    const rating = parseInt(this.getAttribute('data-rating'))
    for (let j = 0; j < ratingStarsElems.length; j++) {
      if (j < rating) {
        ratingStarsElems[j].classList.add('rating-active')
      } else {
        ratingStarsElems[j].classList.remove('rating-active')
      }
    }
  })

  ratingStarsElems[i].addEventListener('mouseout', function () {
    for (let j = 0; j < ratingStarsElems.length; j++) {
      ratingStarsElems[j].classList.remove('rating-active')
    }
  })
}

// const queryString = window.location.search;
// const urlParams = new URLSearchParams(queryString);

// const BookName = urlParams.get('name')
// document.getElementById('bookName').innerHTML = BookName;


// const BookImage = urlParams.get('img')
// console.log(BookImage)
// const bookImage = document.querySelector('.book-image');
// bookImage.setAttribute('src', BookImage);

// const BookPrice = urlParams.get('price')

// // price
// const bookPrice = document.querySelector('.price');
// bookPrice.textContent = '$' + BookPrice;

// const cartBtns = document.querySelectorAll('.cart-btn');
//     cartBtns.forEach(btn => {
//         btn.addEventListener('click', () => {
//             alert('New book added to cart!');
//         });
//     });

//     const wishlistBtns = document.querySelectorAll('.wishlist-btn');
//     wishlistBtns.forEach(btn => {
//         btn.addEventListener('click', () => {
//             alert('New book added to wishlist!');
//         });
//     });


