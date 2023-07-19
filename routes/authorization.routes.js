const {Router} = require('express')
const mongoose = require('mongoose')
const User = require("../models/User.model")
const Topic = require("../models/Topic.model")
const Review = require("../models/Review.model")
const EmployeeModel = require('../models/Employee.model')
const router = new Router()

router.post('/validate', (req, res, next) => {
    const { number } = req.body;
    console.log("EmployeeID:",number)

    if (!number) {
        res.render('index.hbs', { errorMessage: 'Please provide the employee id number' });
        return;
      }
      
      EmployeeModel.findOne({ number })
      .then(employee => {
        console.log("Found employee:", employee)
        if (!employee) {
          console.log("Employee not registered. ");
          res.render('index.hbs', { errorMessage: 'Employee not found',user:req.session.user });
          return;
        } else if (number == employee.number) {
  
          console.log("Session AFTER AUTHORIZATION", req.session)
          const isEmployee = number == employee.number;
          const level = employee.level;
          User.findByIdAndUpdate(
            req.session.user._id,
            {
                $set: {employee: true}
            },
            {new: true}
            ).then(() =>{
                console.log("Updated employee field", req.session.user.employee)
                console.log("isEmployee:",isEmployee)
                console.log("level:",level)
                res.render("auth/indexEmployee.hbs",{user:req.session.user, isEmployee, level})
            })
            .catch(error => next(error));
        }
      })
  });

module.exports = router;