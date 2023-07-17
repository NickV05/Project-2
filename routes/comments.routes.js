var express = require('express');
var router = express.Router();

// const Review = require('../models/Review');
// const Room = require('../models/Room');

// const isLoggedIn = require('../middleware/isLoggedIn')
// const isNotOwner = require('../middleware/isNotOwner')

router.post('/add-review/:ownerId/:roomId', (req, res, next) => {

    Review.create({
        user: req.session.user._id,
        comment: req.body.comment
    })
    .then((newReview) => {
        console.log("New review", newReview)
        return Room.findByIdAndUpdate(
            req.params.roomId,
            {
                $push: {reviews: newReview._id}
            },
            {new: true}
        )
    })
    .then((updatedRoom) => {
        console.log("Updated room", updatedRoom)
        res.redirect(`/rooms/details/${updatedRoom._id}`)
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })

})

module.exports = router;