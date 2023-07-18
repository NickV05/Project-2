var express = require('express');
var router = express.Router();

const User = require('../models/User.model');
const Review = require('../models/Review.model');
const Topic = require('../models/Topic.model');

router.post('/add-review/:topicId', (req, res, next) => {

    Review.create({
        topic: req.params.topicId,
        user: req.session.user._id,
        comment: req.body.comment
    })
    .then((newReview) => {
        console.log("New review", newReview)
        return Topic.findByIdAndUpdate(
            req.params.topicId,
            {
                $push: {reviews: newReview._id}
            },
            {new: true}
        )
    })
    .then((addToUser) => {
        console.log("Adding review to profile", addToUser)
        return User.findByIdAndUpdate(
            req.session.user._id,
            {
                $push: {reviews: addToUser._id}
            },
            {new: true}
        )
    })
    .then((updatedTopic) => {
        console.log("Updated topic", updatedTopic)
        res.redirect(`/forum/details/${req.params.topicId}`)
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })

})

router.get('/delete/:commentId', (req, res, next) => {
  
    Review.findByIdAndDelete(req.params.commentId)
    .then((deletedReview) => {
        console.log("Deleted review:", deletedReview)
        res.redirect(`/forum/details/${deletedReview.topic._id}`)
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })
  
  })

  router.get('/edit/:commentId', (req, res, next) => {
    Review.findById(req.params.commentId)
    .populate('user')
    .then((foundReview) => {
        console.log("Found Review", foundReview)
        res.render("users/edit-review.hbs", {foundReview})
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })
  
  })

  router.post('/edit/:commentsId', (req, res, next) => {

    const {comment} = req.body
  
    Review.findByIdAndUpdate(
        req.params.commentsId,
        {
          comment
        },
        {new: true}
    )
    .then((updatedReview) => {
        res.redirect(`/forum/details/${updatedReview.topic._id}`)
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })
  
  })

module.exports = router;