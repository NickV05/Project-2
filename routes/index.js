var express = require('express');
var router = express.Router();
const mongoose = require('mongoose')
const User = require("../models/User.model")

router.get('/', function(req, res, next) {
  res.render('index',{user: req.session.user});
});

module.exports = router;
