const {Router} = require('express')
const mongoose = require('mongoose')
const User = require("../models/User.model")
const Topic = require("../models/Topic.model")
const Review = require("../models/Review.model")
const router = new Router()

const fileUploader = require('../middleware/cloudinary')

const { isLoggedIn} = require('../middleware/route-guard.js');

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

    if (!topicName|| !content) {
      Topic.find()
      .then((topics) =>{
        res.render('users/forum.hbs', { topics, errorMessage: 'All fields are mandatory. Please provide name for topic and your question', user:req.session.user });
      })
      return;
    }

    Topic.create({
      topicName,
      content,
      creator: req.session.user._id,
      photo: "https://res.cloudinary.com/dyto7dlgt/image/upload/v1689952959/project-2/r7q5izw2ybeabd3qdrve.jpg",
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
    .catch((error) => {
      console.error("Validation Error:", error, error.message);
      console.log("Error", error);
      if (error instanceof mongoose.Error.ValidationError) {
        console.log("MONGOOSE ERROR");
        Topic.find().then((topics) => {
          res
            .status(500)
            .render("users/forum.hbs", {
              topics,
              errorMessage2: "Too many characters in topic name field",
              user: req.session.user,
            });
        });
        return;
      }
      console.log(error);
      next(error);
    });

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

router.post('/edit/:topicId', fileUploader.single('photo'), (req, res, next) => {

  console.log("REQ.BODY", req.body)

  const {topicName, content, photo } = req.body
  if(!req.file){
    Topic.findByIdAndUpdate(
      req.params.topicId,
      {
        topicName,
        content
      },
      {new: true}
  )
  .then((updatedTopic) => {
    res.redirect(`/forum/details/${updatedTopic._id}`)
})
.catch((err) => {
    console.log(err)
    next(err)
})}
  
  else{
    Topic.findByIdAndUpdate(
        req.params.topicId,
        {
          topicName,
          content,
          photo: req.file.path
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
  }

})

router.get('/delete/:topicId', isLoggedIn, async (req, res, next) => {
  try {
    const topic = await Topic.findById(req.params.topicId);
    console.log("Topic that is found:", topic);
    for (const review of topic.reviews) {
      console.log("Each review:", review);
      await Review.findByIdAndDelete(review);
    }
    const deletedTopic = await Topic.findByIdAndDelete(req.params.topicId);
    console.log("Deleted topic:", deletedTopic);
    res.redirect('/forum');
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get('/getBlogs', (req, res, next) => {
  Topic.find()
    .populate('creator')
    .then((foundTopics) => {
        const filtered = foundTopics.filter(topic => topic._id.toString() !== "651473f3263b65a26bf6091d");
        const sorted = filtered.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
      
          return dateB - dateA;
        });

        const sliced = sorted.slice(0, 3); 
        const reducedTopics = sliced.map(topic => ({
          _id: topic._id,
          creator: {
            _id: topic.creator._id,
            fullName: topic.creator.fullName,
          },
          topicName: topic.topicName,
          photo: topic.photo,
        }));
      
        res.json(reducedTopics);
    })
    .catch((err) => {
        console.log(err);
        next(err);
    });
});


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
  .catch((err) => {
      console.log(err)
      next(err)
  })

})



module.exports = router;