const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

const router = express.Router();
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

const User = require("../models/user");

router.post("/register", (req, res) => {
  //Form validation
  const { errors, isValid } = validateRegisterInput(req.body);
  //Check validation
  if (!isValid) return res.status(400).json(errors);

  User.findOne({ username: req.body.username }).then(user => {
    if (user)
      return res.status(400).json({ username: "Хэрэглэгч бүртгэгдсэн байна." });
    const newUser = new User({
      username: req.body.username,
      password: req.body.password
    });
    //Hash password
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then(user => res.json(user))
          .catch(err => console.log(err));
      });
    });
  });
});

router.post("/login", (req, res) => {
  //Form validation
  const { errors, isValid } = validateLoginInput(req.body);
  //Check validation
  if (!isValid) return res.status(400).json(errors);

  const { username, password } = req.body;
  //Find user
  User.findOne({ username }).then(user => {
    //Check
    if (!user)
      return res
        .status(400)
        .json({ usernamenotfound: "Хэрэглэгчийн нэр буруу байна." });
    //Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = {
          id: user.id,
          username: user.username
        };
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 //1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Нууц үг буруу байна." });
      }
    });
  });
});

router.get("/users", (req, res) => {
  User.find((errors, users) => {
    if (errors) return res.status(500).json(errors);
    return res.status(200).json(users);
  });
});

module.exports = router;
