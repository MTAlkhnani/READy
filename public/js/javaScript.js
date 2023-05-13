function search_books(sourceElement){
  let searchBox = document.getElementById("search-box");

  // get the text entered by the user
  let searchText = searchBox.value;
  alert(searchText);
}

var swiper = new Swiper(".books-slider", {
  loop:true,
  centeredSlides: true,
  autoplay: {
    delay: 9500,
    disableOnInteraction: false,
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  },
});

var swiper = new Swiper(".featured-slider", {
  spaceBetween: 10,
  loop:true,
  centeredSlides: true,
  autoplay: {
    delay: 9500,
    disableOnInteraction: false,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    450: {
      slidesPerView: 2,
    },
    768: {
      slidesPerView: 3,
    },
    1024: {
      slidesPerView: 4,
    },
  },
});

const searchForm = document.querySelector('.search-form');
document.querySelector('#search-btn').onclick = () => {
  searchForm.classList.toggle('active')
};

// Find all the cart buttons in the new releases section
const newReleasesCartBtns = document.querySelectorAll('#newRealses .cart-btn, #bestsellers .cart-btn');

// Add a click event listener to each button
// newReleasesCartBtns.forEach(button => {
//   button.addEventListener('click', () => {
//     alert('New book added to cart!');
//   });
// });

// const wishlistCartBtns = document.querySelectorAll('#newRealses .wishlist-btn, #bestsellers .wishlist-btn');

// // Add a click event listener to each button
// wishlistCartBtns.forEach(button => {
//   button.addEventListener('click', () => {
//     alert('New book added to wishlist!');
//   });
// });