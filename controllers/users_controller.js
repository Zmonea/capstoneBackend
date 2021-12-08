const bcrypt = require("bcrypt");
const express = require("express");
const user = express.Router();
const User = require("../models/users.js");

user.get("/", (req, res) => {
  res.json("Hello World");
});

user.post("/createaccount", (req, res) => {
  req.body.password = bcrypt.hashSync(
    req.body.password,
    bcrypt.genSaltSync(10)
  );
  console.log(req.body);
  User.create(req.body, (err, createdUser) => {
    if (err) {
      console.log(err);
      res.json(err.message);
    } else {
      console.log("user is created", createdUser);
      res.json(createdUser);
    }
  });
});

user.post("/login", (req, res) => {
  console.log(req.body);
  console.log(req.body.username +" /login - Username from Req Body");
  User.findOne({ username: req.body.username }, (err, foundUser) => {
    console.log(foundUser + "/login - user was found");
    if (err) {
      console.log(err + " logging error post conditional");
      res.json("Sorry, but the Database ran into a problem. Please try again.");
    } else {
      if (!foundUser) {
        console.log(foundUser + " /login - there is no user found");
        res.json("This user was not found. Please try again.");
      } else if (bcrypt.compareSync(req.body.password, foundUser.password)) {
        res.json({ username: foundUser.username });
      } else {
        console.log(" /login - password did not match or everything else");
        res.json("Password does not match. Please try again.");
      }
    }
  });
});

module.exports = user;
