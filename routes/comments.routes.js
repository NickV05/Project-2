var express = require('express');
var router = express.Router();

const Review = require('../models/Review.model');
const Topic = require('../models/Topic.model');

router.post('/add-review/:topicId', (req, res, next) => {

    Review.create({
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
    .then((updatedTopic) => {
        console.log("Updated topic", updatedTopic)
        res.redirect(`/forum/details/${updatedTopic._id}`)
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })

})

module.exports = router;