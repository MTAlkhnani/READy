const { authenticate } = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const User = require('./models/user')
const mongoose = require('mongoose')
uri = 'mongodb+srv://admin:admin@cluster0.moh5hyj.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(uri);

function initilaize(passport) {
    const authenticateUser = async (email, password, done) => {
        const user = await User.findOne({email: email})
        // console.log(user)
        // console.log(password)
        // console.log(user.password)
        if(user == null) {
            return done(null, false, {message: "no user with that email"})
        }
        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, {message: "Password is incorrect"})
            }
        } catch(e) {
            return done(e)
        }

    }
    passport.use(new LocalStrategy({usernameField: 'email'}, authenticateUser))
    
    passport.serializeUser((user, done) => {
        return done(null, user._id)
    })
    
    passport.deserializeUser((id, done) => {
        User.findById(id)
          .then(user => {
            done(null, user);
          })
          .catch(err => {
            done(err);
          });
      });
}

module.exports = initilaize