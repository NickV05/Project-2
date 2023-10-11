const {Router} = require('express')
const User = require("../models/User.model")
const Virus = require("../models/Virus.model")
const EmployeeModel = require('../models/Employee.model')
const bcrypt = require("bcryptjs")
const router = new Router()

  router.post('/validate', (req, res, next) => {
    const { number, password } = req.body;

    if (!number|| !password) {
        res.render('index.hbs', { errorMessage: 'Please provide both the employee id number and password',user:req.session.user});
        return;
      }
      
      EmployeeModel.findOne({number})
    .then(employee => {
      if (!employee) {
        res.render('index.hbs', { errorMessage: 'Employee not found and/or incorrect password.', user:req.session.user});
        return;
      } else if (bcrypt.compareSync(password, employee.password)) {
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
                res.render("auth/indexEmployee.hbs",{user:req.session.user, isEmployee, level, employee, viruses, title:"Employees"})
            })
            .catch(error => next(error));
        }
      else {
        res.render('index.hbs', { errorMessage: 'Employee not found and/or incorrect password.', user:req.session.user });
      }
    })

});

  router.get('/validation/virus/:virusId', (req,res,next) => {
    Virus.findById(req.params.virusId)
    .then((foundVirus) => {
      res.render('auth/virus.hbs',{user:req.session.user,foundVirus,title:"Project Info"})
    })
    .catch((err) => {
      console.log(err)
      next(err)
  })
  })

   

module.exports = router;