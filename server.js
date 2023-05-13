const express = require('express')
const path = require('path')
const bcrypt = require('bcrypt')
const passport = require('passport')
const initilaizePassport = require('./passport-config')
const flash = require('express-flash')
const session = require('express-session')
const port = 3001
const mongoose = require('mongoose')
const User = require('./models/user')
const Book = require('./models/book')
const user = require('./models/user')
const book = require('./models/book')

uri = 'mongodb+srv://admin:admin@cluster0.moh5hyj.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(uri, {useNewUrlParser: true});

initilaizePassport(passport, async (email) => {
   const result = await User.find({email: email}) 
   return result[0];
})

// async function getMes() {
//     try {
//         const result = await client.db("appDB").collection("users").findOne({email: 'mtalkhnani@hotmail.com'})
//         console.log(result) 
//     } catch (error){
//         console.error(error)
//     } finally {
//         setTimeout(() => {client.close()}, 1500)
//     }
// }

// async function listDatabases(client) {
//     const databaseList = await client.db().admin().listDatabases();
//     databaseList.databases.forEach(element => {
//         console.log(element);
//     });
// }

// async function addUserToDB(client, user){
//     const result = await client.db("appDB").collection("users").insertOne(user)

//     console.log('new user add with the id of ' + result.insertedId)
// }
const app = express()
// app.set('views', path.join(__dirname, 'views'));
// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html')
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.use(flash())
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

app.set('view engine', 'ejs');

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect('/login');
    }
  }

  app.get('/', async (req, res) => {
    // console.log(req.user instanceof mongoose.Model);
    // mongoose.model('books').findOne();
    await Book.find({})
    .then((books) => {
      res.render('home', {
        user: req.user,
        books: books
      });
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
  });
  
app.get('/login', (req, res) => {
    res.render('login.ejs')
})
app.post('/login',  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))
app.get('/register', (req, res) => {
    res.render('register.ejs')
})
app.post('/register', async (req, res) => {
    const user = await User.findOne({
        email: req.body.email
      })

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10) //hashing the password
        //now we push the user to the database
        // console.log(req.body.name)
        // console.log(req.body.phone)
        // console.log(req.body.email)
        // console.log(req.body.password)
        // console.log(hashedPassword)
        if (user) {
            req.flash('error', 'Sorry, that name is taken. Maybe you need to <a href="/login">login</a>?');
            res.redirect('/register');
          } else if (req.body.email == "" || req.body.password == "") {
            req.flash('error', 'Please fill out all the fields.');
            res.redirect('/register');
          } else {
            const user = new User({
                name: req.body.name,
                phone: req.body.phone,
                email: req.body.email,
                password: hashedPassword,
                orders: [],
                wishlist: []
                })
                await user.save() // saving the user to DB
        
                console.log("user add to the database")
                res.redirect('/login')
          }

    } catch (error){
        console.error(error.message)
        res.redirect('/register')
    } 
})

app.get('/contactUs', (req, res) => {
    res.render('contactUs.ejs')
})

app.get('/wishlist', ensureAuthenticated, (req, res) => {
  User.findOne({email: req.user.email})
    .then((user) => {
      console.log(req.user.orders);
      // let var1=0;
      // user.orders.forEach(book => {
      //   var1+= parseFloat(book.priceOfBook);})
        // console.log(var1);
      res.render('wishlist.ejs', {
        wishlist: user.wishlist, user:req.user});
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
    
})
app.get('/cart', ensureAuthenticated, (req, res) => {
    // res.render('cart.ejs')
    User.findOne({email: req.user.email})
    .then((user) => {
      console.log(req.user.orders);
      let var1=0;
      user.orders.forEach(book => {
        var1+= parseFloat(book.priceOfBook);})
        // console.log(var1);
      res.render('cart.ejs', {
        orders: user.orders, var1:var1, user:req.user});
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
})
app.post('/cart', (req, res) => {
  console.log(req.body.user_email);
  let book;
  Book.find({ nameOfBook: req.body.book_name}).then(books => {
  book = books[0];
  console.log(book)
  User.findOne({ email: req.body.user_email}).then(user => {
    // console.log(user);
    // console.log(book);
    User.updateOne({email: req.body.user_email},{$addToSet:{ orders : book}}).then(function (sucess,error) {
      if (error) {
          console.log("error");
      } else {
          console.log(sucess);
      }
    }
    )
    
    
  })
 
})

res.redirect('back');

  
})

app.post('/cartfw', (req, res) => {
  console.log(req.body.user_email);
  let book;
  Book.find({ nameOfBook: req.body.book_name}).then(books => {
  book = books[0];
  console.log(book)
  User.findOne({ email: req.body.user_email}).then(user => {
    // console.log(user);
    // console.log(book);
    User.updateOne({email: req.body.user_email},{$addToSet:{ orders : book}}).then(function (sucess,error) {
      if (error) {
          console.log("error");
      } else {
          console.log(sucess);
      }
    }
    )
    console.log(book +"will be deleted");
      user.wishlist.pull(book);
      
      user.save();
      res.redirect('/wishlist');
    
  })
 
})


  
})




app.post('/delete', ensureAuthenticated, (req, res) => {
  let book;
  // const userId = req.params.userId;
  // let itemId = req.params.itemId;
  
  Book.find({ nameOfBook: req.body.book_name}).then(books => {
    book = books[0];
    User.findOne({ email: req.body.user}).then(user => {
      // console.log(user);
      // console.log(book);

      // User.updateOne({email: user.email},{$pop:{ orders : books}}).then(function (error,sucess) {
      //   if (error) {
      //       console.log(error);
      //   } else {
      //       console.log("sucsses");
      //   }
      // }
      // )
      console.log(book +"will be deleted");
      user.orders.pull(book);
      
      user.save();
      res.redirect('/cart');
      
    })
   
  })
      
      
    })


    app.post('/deletefW', ensureAuthenticated, (req, res) => {
      let book;
      // const userId = req.params.userId;
      // let itemId = req.params.itemId;
      
      Book.find({ nameOfBook: req.body.book_name}).then(books => {
        book = books[0];
        User.findOne({ email: req.body.user}).then(user => {
          // console.log(user);
          // console.log(book);
    
          // User.updateOne({email: user.email},{$pop:{ orders : books}}).then(function (error,sucess) {
          //   if (error) {
          //       console.log(error);
          //   } else {
          //       console.log("sucsses");
          //   }
          // }
          // )
          console.log(book +"will be deleted");
          user.wishlist.pull(book);
          
          user.save();
          res.redirect('/wishlist');
          
        })
       
      })
          
          
        })

app.post('/wishlist', (req, res) => {
  console.log(req.body.user_email);
  let book;
  Book.find({ nameOfBook: req.body.book_name}).then(books => {
  book = books[0];
  User.findOne({ email: req.body.user_email}).then(user => {
    // console.log(user);
    // console.log(book);
    User.updateOne({email: req.body.user_email},{$addToSet:{ wishlist : book}}).then(function (sucess,error) {
      if (error) {
          console.log("error");
      } else {
          console.log(sucess);
      }
    }
    )
    
    
  })
 
})

res.redirect('back');
})



app.get('/books', (req, res) => {
    Book.find({})
    .then((books) => {
      res.render('books.ejs', {
        books: books,
        user: req.user,
      });
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
})

// app.get('/book', (req, res) => {

//   res.render('book.ejs', { data });
// })
app.get('/book/:id', (req, res) => {
  const { id } = req.params;

  Book.findById(id)
    .then((book) => {
      res.render('Book.ejs', {book, user: req.user});
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
})

app.post('/book/:id/rate', (req, res) => {
  const { id } = req.params;
  const { rating } = req.body;
  console.log(rating)
  Book.findOne({ _id: id }).then((book) => {
    var total = parseInt(book.totalRate) + parseInt(rating) 
    console.log(total) 
    var index = parseInt(book.index) + 1
    var result = total/index;
    console.log(result)
    Book.updateOne({_id: id}, {$set: {rateOfBook: result, index: index, totalRate: total}}).then(function (sucess,error) {
      if (error) {
          console.log("error");
      } else {
          console.log(sucess);
          res.redirect(`/book/${book._id}`);
      }
    }
    )
  }).catch((err) => {
    console.error(err);
    res.sendStatus(500);
  });
  // Book.findOneAndUpdate(
  //   { _id: id },
  //   { $inc: { totalRate: rating, index: 1 }, $set: { rateOfBook: (this.totalRate + rating) / (this.index + 1)} },
  //   { new: true }
  // ).then((book) => {
  //     res.redirect(`/book/${book._id}`);
  //   })
  //   .catch((err) => {
  //     console.error(err);
  //     res.sendStatus(500);
  //   });
});

app.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/login');
    });
  });
  
// app.get('/book/rate', (req, res) => {
//   // rating = req.form['rating']
//   // console.log(rating)
//   // rate = req.query.rate
//   console.log('HKHJAFKFKJSDF')
// })
app.post('/sort', async (req, res) => {
  let selectedOptionSort = req.body.sort;
  try {
  if(selectedOptionSort === 'Price: Low to High') {
      const books = await Book.find({}).sort({ priceOfBook: 1 });
      res.render('books.ejs', {
        books: books,
        user: req.user
      })
  } else if(selectedOptionSort === 'Price: High to Low') {
    const books = await Book.find({}).sort({ priceOfBook: -1 });
    res.render('books.ejs', {
      books: books,
      user: req.user

    })
  } else if(selectedOptionSort === 'Rate: Low to High') {
    const books = await Book.find({}).sort({ rateOfBook: 1 });
    res.render('books.ejs', {
      books: books,
      user: req.user

    })
  } else if(selectedOptionSort === 'Rate: High to Low') {
      // sort by rate high to low
      const books = await Book.find({}).sort({ rateOfBook: -1 });
      res.render('books.ejs', {
        books: books,
        user: req.user

      })
  }

  let selectedRating = req.body.rate;
  // perform sorting based on the selected rating
  if(selectedRating === '5') {
    const books = await Book.find({rateOfBook: {$gte:5}});
    res.render('books.ejs', {
      books: books,
      user: req.user

    })
  } else if(selectedRating === '4') {
    const books = await Book.find({rateOfBook: {$gte:4}});
    res.render('books.ejs', {
      books: books,
      user: req.user

    })
  } else if(selectedRating === '3') {
    const books = await Book.find({rateOfBook: {$gte:3}});
    res.render('books.ejs', {
      books: books,
      user: req.user

    })
  } else if(selectedRating === '2') {
    const books = await Book.find({rateOfBook: {$gte:2}});
    res.render('books.ejs', {
      books: books,
      user: req.user

    })
  } else if(selectedRating === '1') {
    const books = await Book.find({rateOfBook: {$gte:1}});
    res.render('books.ejs', {
      books: books,
      user: req.user

    })
  }
}
catch(err) {
  console.error(err)
}
})

// app.get('/search', (req, res) => {
//   const keyword = req.query.keyword; // get the search keyword from the query string
//   Book.findOne({nameOfBook: keyword}) // search for books with a title that matches the keyword (case-insensitive)
//     .then(book => {
//       if (book.nameOfBook != null) {
//         res.render('book.ejs', { book, user: req.user }); // render the search results view with the matched books
//       }
//     })
//     .catch(err => {
//       Book.find({})
//       .then((books) => {
//         res.render('books.ejs', {
//           books: books,
//           user: req.user
//         });
//       })
//       .catch((err) => {
//         console.error(err);
//         res.sendStatus(500);
//       });
//     });
// });

app.get('/search', async (req, res) => {
  try {
    const keyword = req.query.keyword; // get the search keyword from the query string
    const books = await Book.find({ nameOfBook: { $regex: keyword, $options: 'i' } });
    if (books.length === 0) {
      // If no matching book is found, render a view with a message
      res.render('no_books_found.ejs', { keyword });
    } else {
      // If at least one matching book is found, render the 'books' view with the search results
      res.render('books.ejs', {
        books: books,
        user: req.user
      });
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.listen(port, () => {
    console.log("Server is listening to port  " + port)
    console.log("go to browser and type in the url localhost:" + port)
})
