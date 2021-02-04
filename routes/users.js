const { User, validate } = require('../models/User');
const _ = require('lodash');
const auth = require("../middleware/auth");
const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

// get info about the user from his JWT Token
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password -__v -_id");
  res.send(user);
});

//	Creating a new user
router.post("/users", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send({ message: 'User already registered.' });

  if (req.body.password !== req.body.confirm_password)
    return res.status(400).send({ message: 'Passwords don\'t match.' });

  user = new User({
    ..._.pick(req.body, [
      'firstname',
      'lastname',
      'phone',
      'email',
      'password',
      'isGraduated',
      'university',
      'faculty',
      'department',
      'graduationYear'
    ]),
    isAdmin: true
  });

  // hashing password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  res.status(200).send({ message: "You have registered successfully. Please log in!" });
});

function validate_update(user) {
  const passwordValidations = {
    min: 8,
    max: 1024,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 0,
    requirementCount: 4
  }

  const schema = Joi.object({
    firstname: Joi.string().min(2).max(50).required(),
    lastname: Joi.string().min(2).max(50).required(),
    phone: Joi.string().min(7).max(15).required(),
    password: passwordComplexity(passwordValidations).required(),
    confirm_password: passwordComplexity(passwordValidations).required(),
    university: Joi.string().min(2).max(100).required(),
    faculty: Joi.string().min(2).max(100).required(),
    department: Joi.string().min(2).max(100).allow(""),
    graduationYear: Joi.number()
      .min(new Date(Date.now()).getFullYear() - 7)
      .max(new Date(Date.now()).getFullYear() + 7)
      .required(),
    isGraduated: Joi.boolean()
  });
  return schema.validate(user);
};

router.put("/users", auth, async (req, res) => {
  const { error } = validate_update(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // get id of the user from his JWT Token 
  let user = await User.findById(req.user._id);

  if (!req.body.password) {
    user.name = req.body.name;
    await user.save();

    // return response the token and user properties
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'firstname', 'lastname', 'email']));

  }
  else {
    user.name = req.body.name;
    user.password = req.body.password;
    // hashing password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    // return response the token and user properties
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'firstname', 'lastname', 'email']));
  }
});

router.delete("/users", auth, async (req, res) => {
  try {
    User.findByIdAndRemove(req.user._id, (err, user) => {
      if (err) throw err;
      if (user == null) {
        res.sendStatus(404);
      }
      else {
        res.send(user.name + " has been Deleted")
      }
    });
  } catch (err) {
    console.log(err.message);
    res.sendStatus(500);
  }
});

module.exports = router;