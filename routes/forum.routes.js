const {Router} = require('express')
const mongoose = require('mongoose')
const User = require("../models/User.model")
const Topic = require("../models/Topic.model")
const router = new Router()


const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');

router.get('/', (req,res,next) => {
  Topic.find()
    .populate('creator')
    .then((foundTopics) => {       
        res.render('users/forum.hbs', { topics: foundTopics, user: req.session.user })
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })
  });

  router.get('/details/:topicId', (req, res, next) => {

    Topic.findById(req.params.topicId)
    .populate('creator')
    .then((foundTopic) => {
        console.log("Found Topic", foundTopic)
        res.render('users/forum-details.hbs', foundTopic)
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })

})


  router.post('/createTopic', isLoggedIn, (req, res, next) => {

    const {topicName, content } = req.body

    Topic.create({
       topicName,
       content,
       creator: req.session.user._id
    })
    .then((createdTopic) => {
        console.log("Created Topic:", createdTopic)
        res.redirect('/forum')
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })

})


module.exports = router;