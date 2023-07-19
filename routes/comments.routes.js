var express = require('express');
var router = express.Router();

const User = require('../models/User.model');
const Review = require('../models/Review.model');
const Topic = require('../models/Topic.model');

router.post('/add-review/:topicId', (req, res, next) => {

    const {comment} = req.body

    if (!comment) {
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
            const updateTime = foundTopic.createdAt.toString() != foundTopic.updatedAt.toString();
            const createdDate = new Date(`${foundTopic.createdAt}`).toLocaleDateString(); 
            const createdTime =new Date(`${foundTopic.createdAt}`).toLocaleTimeString();
            const updDate = new Date(`${foundTopic.updatedAt}`).toLocaleDateString(); 
            const updTime =new Date(`${foundTopic.updatedAt}`).toLocaleTimeString();
      
            let reviewOfOwner1 = reviewOfOwner.map((review) => {
              return {...review._doc, createdAt: review.createdAt.toLocaleDateString(), time: review.createdAt.toLocaleTimeString(),
                updatedAt: review.updatedAt.toLocaleDateString(), timeUpdated: review.updatedAt.toLocaleTimeString()}
            });
            let reviewOfNotOwner1 = reviewOfNotOwner.map((review) => {
              return {...review._doc, createdAt: review.createdAt.toLocaleDateString(), time: review.createdAt.toLocaleTimeString(),
                updatedAt: review.updatedAt.toLocaleDateString(), timeUpdated: review.updatedAt.toLocaleTimeString(),}
            });
            
            
            res.render('users/forum-details.hbs', {
            errorMessage: 'All fields are mandatory. Please provide name for topic and your question',
              foundTopic, 
              user: req.session.user, 
              userIsOwner, 
              reviewOfOwner1, 
              reviewOfNotOwner1, 
              createdDate, 
              createdTime,
              updateTime,
              updDate,
              updTime,
            })
        })
      return;
    }

    Review.create({
        topic: req.params.topicId,
        user: req.session.user._id,
        comment: req.body.comment
    })
    .then((newReview) => {
        console.log("New review", newReview)
        Topic.findByIdAndUpdate(
            req.params.topicId,
            {
                $push: {reviews: newReview._id}
            },
            {new: true}
        ).then(() => {
            User.findByIdAndUpdate(
                req.session.user._id,
                {
                    $push: {reviews: newReview._id}
                },
                {new: true}
                ).then(() =>{
                    res.redirect(`/forum/details/${req.params.topicId}`)
                })
                .catch((err) => {
                    console.log(err)
                    next(err)
                })
        
        }).catch((err) => {
            console.log(err)
            next(err)
        })
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