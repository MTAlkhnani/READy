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

uri = 'mongodb+srv://admin:admin@cluster0.moh5hyj.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(uri,{useNewUrlParser: true});

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

  app.get('/', ensureAuthenticated, async (req, res) => {
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
    res.render('wishlist.ejs')
})
app.get('/cart', ensureAuthenticated, (req, res) => {
    res.render('cart.ejs')
})
app.post('/cart', (req, res) => {
  console.log(req.body.user_email);
  let book;
  Book.find({ nameOfBook: req.body.book_name}).then(books => {
  book = books[0];
  User.findOne({ email: req.body.user_email}).then(user => {
    console.log(user);
    console.log(book);
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
app.post('/wishlist', (req, res) => {
  console.log(req.body.user_email);
  let book;
  Book.find({ nameOfBook: req.body.book_name}).then(books => {
  book = books[0];
  User.findOne({ email: req.body.user_email}).then(user => {
    console.log(user);
    console.log(book);
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

app.get('/book', (req, res) => {
  const data = {
    img: req.query.img,
    name: req.query.name,
    price: req.query.price,
    rate: req.query.rate,
  };
  res.render('book.ejs', { data });
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