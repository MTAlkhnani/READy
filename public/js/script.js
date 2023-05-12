searchForm = document.querySelector('.search-form')

document.querySelector('#search-btn').onclick = () => {
  searchForm.classList.toggle('active')
}

/****************************************************************************/
// Get the cart items container element
const cartItems = document.querySelector('.cart-items')

// Get the total price element
const totalPrice = document.querySelector('.cart-total p')

// Get the checkout button element
const checkoutBtn = document.querySelector('.cart-total button')
// cart-shipping
const shippingText = document.querySelector('.cart-shipping p')
// cart-shipping
const shippingThings = document.querySelector('.cart-shipping')
// Add event listeners to the quantity buttons
const minusBtns = document.querySelectorAll('.minus-btn')
const plusBtns = document.querySelectorAll('.plus-btn')

minusBtns.forEach(function (btn) {
  btn.addEventListener('click', function () {
    const input = btn.nextElementSibling
    const currentValue = parseInt(input.value)
    if (currentValue > 1) {
      input.value = currentValue - 1
      updateCartTotal()
    }
  })
})

plusBtns.forEach(function (btn) {
  btn.addEventListener('click', function () {
    const input = btn.previousElementSibling
    const currentValue = parseInt(input.value)
    input.value = currentValue + 1
    updateCartTotal()
  })
})

// Add event listener to the remove buttons
const removeBtns = document.querySelectorAll('.cart-item-remove button')

// removeBtns.forEach(function (btn) {
//   btn.addEventListener('click', function () {
//     const cartItem = btn.parentElement.parentElement.parentElement
//     cartItem.remove()
//     updateCartTotal()
//   })
// })

// Function to update the cart total
function updateCartTotal () {
  let cartItemsTotal = 0
  const cartItemPrices = document.querySelectorAll('.cart-item-price')
  const cartItemQuantities = document.querySelectorAll('.cart-item-quantity input')

  for (let i = 0; i < cartItemPrices.length; i++) {
    const price = parseFloat(cartItemPrices[i].textContent.replace('$', ''))
    const quantity = parseInt(cartItemQuantities[i].value)
    cartItemsTotal += price * quantity
  }

  // totalPrice.textContent = "Total: $" + cartItemsTotal.toFixed(2);

  // Update the cart total and checkout button based on the selected book type and shipping cost
  const shippingCost = 20
  const bookType = document.querySelector('[name=book-type]:checked').value
  let total = cartItemsTotal
  if (bookType !== 'ebook' && cartItems.innerHTML !== '') {
    total += shippingCost
    checkoutBtn.innerHTML = 'Purchase'
    shippingText.innerHTML = 'Shipping: $20'
  } else if (bookType === 'ebook' && cartItems.innerHTML !== '') {
    shippingText.innerHTML = ''
    checkoutBtn.innerHTML = 'Purchase'
  }
  totalPrice.textContent = 'Total: $' + total.toFixed(2)
}

// // Add event listener to the checkout button (no need for it)
// checkoutBtn.addEventListener('click', function () {
//   // alert('Thank you for your purchase!')
//   // cartItems.innerHTML = ''
//   // shippingThings.innerHTML = '' // <----- this is how the cart is emptied
//   // totalPrice.textContent = 'Total: $0.00'
//   // updateCartTotal()

// })

// Add event listener to the book type radio buttons
const bookTypeElems = document.querySelectorAll('[name=book-type]')
for (let i = 0; i < bookTypeElems.length; i++) {
  bookTypeElems[i].addEventListener('change', function () {
    updateCartTotal()
  })
}

// This js code below is for the credit card info pop up

const creditCardButton = document.getElementById('credit-card-button')
const creditCardModal = document.getElementById('credit-card-modal')
const firstNameInput = document.getElementById('first-name')
const lastNameInput = document.getElementById('last-name')
const cardNumberInput = document.getElementById('card-number')
const expiryMonthInput = document.getElementById('expiry-month')
const expiryYearInput = document.getElementById('expiry-year')
const cvvInput = document.getElementById('cvv')
const submitPaymentButton = document.getElementById('submit-payment-button')
const form = creditCardModal.querySelector('form')
validateForm()
function validateForm () {
  const isValid =
    firstNameInput.validity.valid &&
    lastNameInput.validity.valid &&
    cardNumberInput.validity.valid &&
    expiryMonthInput.validity.valid &&
    expiryYearInput.validity.valid &&
    cvvInput.validity.valid

  if (isValid) {
    submitPaymentButton.style.opacity = '1'
    submitPaymentButton.style.backgroundColor = '#007bff'
    submitPaymentButton.style.cursor = 'pointer'
  } else {
    submitPaymentButton.style.opacity = '1'
    submitPaymentButton.style.backgroundColor = '#ccc'
    submitPaymentButton.style.cursor = 'default'
  }

  submitPaymentButton.disabled = !isValid
}

firstNameInput.addEventListener('input', validateForm)
lastNameInput.addEventListener('input', validateForm)
cardNumberInput.addEventListener('input', validateForm)
expiryMonthInput.addEventListener('input', validateForm)
expiryYearInput.addEventListener('input', validateForm)
cvvInput.addEventListener('input', validateForm)

creditCardButton.addEventListener('click', () => {
  creditCardModal.style.display = 'block'
})

creditCardModal.addEventListener('click', (event) => {
  if (event.target === creditCardModal) {
    creditCardModal.style.display = 'none'
  }
})

form.addEventListener('submit', (event) => {
  event.preventDefault()
  form.reset()
  submitPaymentButton.style.opacity = '1'
  submitPaymentButton.style.backgroundColor = '#ccc'
  submitPaymentButton.style.cursor = 'default'
  creditCardModal.style.display = 'none'
  alert('Thank you for your purchase!')
  cartItems.innerHTML = ''
  shippingThings.innerHTML = '' // <----- this is how the cart is emptied
  totalPrice.textContent = 'Total: $0.00'
  updateCartTotal()
})

// box-container

// const CartBtns = document.querySelectorAll('.box-container .cart-btn');

// Add a click event listener to each button
// CartBtns.forEach(button => {
//   button.addEventListener('click', () => {
//     alert('New book added to cart!');
//   });
// });

// const WishlistBtns = document.querySelectorAll('.box-container .wishlist-btn');

// // Add a click event listener to each button
// WishlistBtns.forEach(button => {
//   button.addEventListener('click', () => {
//     alert('New book added to wishlist!');
//   });
// });
