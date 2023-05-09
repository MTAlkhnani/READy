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

  app.get('/', ensureAuthenticated,async (req, res) => {
    // console.log(req.user instanceof mongoose.Model);
    
    Book.find({})
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

  res.redirect('/');
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

  res.redirect('/');
})



app.get('/books', (req, res) => {
    Book.find({})
    .then((books) => {
      res.render('books.ejs', {
        books: books
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
      res.render('Book.ejs', {book});
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
})
app.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/login');
    });
  });
  
  
app.listen(port, () => {
    console.log("Server is listening to port  " + port)
    console.log("go to browser and type in the url localhost:" + port)
})