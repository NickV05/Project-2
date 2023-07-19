require('dotenv').config()

const mongoose = require('mongoose');
const Employee = require('./models/Employee.model');

const employees = [
    {
        number: "4040",
        level: "1",
        position: "Junior Researcher",
       },
       {
        number: "5050",
        level: "2",
        position: "Lab Manager",
       },
    {
        number: "6060",
        level: "3",
        position: "Local Head of Security",
       },
  ];

mongoose
  .connect(process.env.MONGODB_URI)
  .then(x => {
    console.log(`Seed.js connected to Mongo database: "${x.connections.name}"`);
    return Employee.create(employees);
  })
  .then(employeesFromDB => {
    console.log(`Created ${employeesFromDB.length} employees`);
    return mongoose.connection.close();
  })
  .then(() => {
    console.log('DB connection closed!');
  })
  .catch(err => {
    console.log(`An error occurred while creating books from the DB: ${err}`);
  });