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

user.put("/login", (req, res) => {
  console.log(req.body);
  User.findOne({ username: req.body.username }, (err, foundUser) => {
    if (err) {
      res.json("Sorry, but the Database ran into a problem. Please try again.");
    } else {
      if (!foundUser) {
        res.json("This user was not found. Please try again.");
      } else if (bcrypt.compareSync(req.body.password, foundUser.password)) {
        res.json({ username: foundUser.username });
      } else {
        res.json("Password does not match. Please try again.");
      }
    }
  });
});

module.exports = user;
