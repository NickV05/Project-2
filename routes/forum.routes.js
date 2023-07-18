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
        console.log(foundTopics)       
        res.render('users/forum.hbs', { topics: foundTopics, user: req.session.user })
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })
  });

  router.post('/createTopic', isLoggedIn, (req, res, next) => {

    const {topicName, content} = req.body

    Topic.create({
       topicName,
       content,
       creator: req.session.user._id,
       photo:"topic.jpg"
    })
    .then((addToUser) => {
      console.log("Adding topic to profile", addToUser)
      return User.findByIdAndUpdate(
          req.session.user._id,
          {
              $push: {discussions: addToUser._id}
          },
          {new: true}
      )
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

router.get('/edit/:topicId',isLoggedIn, (req, res, next) => {

  Topic.findById(req.params.topicId)
  .populate('creator')
  .then((foundTopic) => {
      console.log("Found Topic", foundTopic)
      res.render('users/edit-topic.hbs', {foundTopic, user: req.session.user})
  })
  .catch((err) => {
      console.log(err)
      next(err)
  })

})

router.post('/edit/:topicId', (req, res, next) => {

  const {topicName, content, photo } = req.body

  Topic.findByIdAndUpdate(
      req.params.topicId,
      {
        topicName,
        content,
        photo
      },
      {new: true}
  )
  .then((updatedTopic) => {
      res.redirect(`/forum/details/${updatedTopic._id}`)
  })
  .catch((err) => {
      console.log(err)
      next(err)
  })

})

router.get('/delete/:topicId', isLoggedIn, (req, res, next) => {
  
  Topic.findByIdAndDelete(req.params.topicId)
  .then((deletedTopic) => {
      console.log("Deleted topic:", deletedTopic)
      res.redirect('/forum')
  })
  .catch((err) => {
      console.log(err)
      next(err)
  })

})


router.get('/details/:topicId', (req, res, next) => {

  Topic.findById(req.params.topicId)
  .populate('creator')
  .populate({
    path: 'reviews',
    populate: { path: 'user' },
})
  .then((foundTopic) => {
      console.log("Found Topic", foundTopic)
      const userIsOwner = foundTopic.creator._id.toString() === req.session.user._id;
      const reviewOfOwner = foundTopic.reviews.filter((review) => review.user._id.toString() === req.session.user._id);
      const reviewOfNotOwner = foundTopic.reviews.filter((review) => review.user._id.toString() !== req.session.user._id);
      res.render('users/forum-details.hbs', {foundTopic, user: req.session.user, userIsOwner, reviewOfOwner, reviewOfNotOwner})
  })
  .catch((err) => {
      console.log(err)
      next(err)
  })

})



module.exports = router;