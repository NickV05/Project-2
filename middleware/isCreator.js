const Topic = require('../models/Toopic')

const isCreator = (req, res, next) => {

    Topic.findById(req.params.roomId)
    .populate('creator')
    .then((foundTopic) => {
        if(foundTopic.creator._id.toString() === req.session.user._id) {
            next()
        } else {
            res.redirect('/forum')
        }
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })

}

module.exports = isCreator