const {Router} = require('express')
const mongoose = require('mongoose')
const User = require("../models/User.model")
const bcrypt = require("bcryptjs")
const router = new Router()

const salt = 12;

const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');

router.get("/signup",isLoggedOut, (req,res) => {
    res.render('auth/signup.hbs')
})


router.post("/signup", (req, res, next) => {
    const { username, fullName, password } = req.body;
  
    if (!username|| !password|| !fullName) {
        res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username, full name and password.' });
        return;
      }

  //     const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  // if (!regex.test(password)) {
  //   res
  //     .status(500)
  //     .render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
  //   return;
  // }

    bcrypt
      .genSalt(salt)
      .then((salts) => {
        return bcrypt.hash(password, salts);
      })
      .then((hashedPass) =>
        User.create({ username, fullName, passwordHash: hashedPass }).then(
          (createdUser) => {
            req.session.user = createdUser;
            res.redirect(`/auth/userProfile/${createdUser._id}`)}
        )
      )
      .catch(error => {
        console.log(error)
        if (error instanceof mongoose.Error.ValidationError) {
          res.status(500).render('auth/signup', { errorMessage: error.message });
        } else if (error.code === 11000) {
   
          console.log(" Username needs to be unique. Username is already used. ");
   
          res.status(500).render('auth/signup', {
             errorMessage: 'Username already exists.'
          });
        } else {
          next(error);
        }
      });
  });


router.get('/login', (req,res,next) => {
  res.render('auth/login.hbs')
})

router.post('/login', (req, res, next) => {
  console.log('SESSION =====> ', req.session);
  const { username, password } = req.body;
 
  if (username === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both, username and password to login.'
    });
    return;
  }
 
  User.findOne({ username })
    .then(user => {
      if (!user) {
        console.log("Username not registered. ");
        res.render('auth/login', { errorMessage: 'User not found and/or incorrect password.' });
        return;
      } else if (bcrypt.compareSync(password, user.passwordHash)) {
        
        req.session.user = user;

        console.log("Session AFTER login", req.session)

        res.render("index",{user})
      } else {
        console.log("Incorrect password. ");
        res.render('auth/login', { errorMessage: 'User not found and/or incorrect password.' });
      }
    })
    .catch(error => next(error));
});

router.post('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect('/auth/login');
  });
});

router.get("/userProfile/:userID", isLoggedIn, (req, res) => {
const { username, password, reviews, discussions } = req.session.user;
console.log(req.session.user)
if(!req.session.user.avatar){
  req.session.user.avatar = 'vector.png'
}
  res.render('users/user-profile.hbs', {user: req.session.user});
});

router.post("/userProfile/:userID", isLoggedIn, (req, res) => {
  const { fullName, avatar, username} = req.body
  if(avatar == ""){
    User.findByIdAndUpdate(
      req.params.userID,
        {
            fullName,
            username,
            avatar:req.session.user.avatar
        },
        {new: true}
    )
    .then((updatedUser) => {
      console.log("line 127:", updatedUser)
      req.session.user = updatedUser
      res.redirect(`/auth/userProfile/${updatedUser._id}`);
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })
  }
  else{
    User.findByIdAndUpdate(
      req.params.userID,
        {
            fullName,
            avatar,
            username
        },
        {new: true}
    )
    .then((updatedUser) => {
      console.log("line 127:", updatedUser)
      req.session.user = updatedUser
      res.redirect(`/auth/userProfile/${updatedUser._id}`);
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })
  }
  });

module.exports = router;