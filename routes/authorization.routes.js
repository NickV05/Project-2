const {Router} = require('express')
const mongoose = require('mongoose')
const User = require("../models/User.model")
const Virus = require("../models/Virus.model")
const EmployeeModel = require('../models/Employee.model')
const bcrypt = require("bcryptjs")
const salt = 12;
const router = new Router()

router.post('/validate', (req, res, next) => {
    const { number } = req.body;
    console.log("EmployeeID:",number)

    if (!number) {
        res.render('index.hbs', { errorMessage: 'Please provide the employee id number',user:req.session.user});
        return;
      }
      
      EmployeeModel.findOne(bcrypt.compareSync(number))
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
            )
          .then(() =>{
           return Virus.find()
          })
          .then((viruses) =>{
                console.log("Updated employee field", req.session.user.employee)
                console.log("isEmployee:",isEmployee)
                console.log("level:",level)
                console.log("viruses:",viruses)
                res.render("auth/indexEmployee.hbs",{user:req.session.user, isEmployee, level, employee, viruses, title:"Employees"})
            })
            .catch(error => next(error));
        }
      })
  });

  router.get('/validation/virus/:virusId', (req,res,next) => {
    Virus.findById(req.params.virusId)
    .then((foundVirus) => {
      console.log(foundVirus)
      res.render('auth/virus.hbs',{user:req.session.user,foundVirus,title:"Project Info"})
    })
    .catch((err) => {
      console.log(err)
      next(err)
  })
  })

   

module.exports = router;