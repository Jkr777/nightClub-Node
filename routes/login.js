const express = require('express'),
      { Admin } = require('../model/admin'),
      Joi = require('@hapi/joi'),
      _ = require('lodash'),
      router = express.Router();

router.post('/', async(req, res) => {
  const { error } = joiValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  let user = await Admin.findOne({ email: req.body.email });
  if(!user) return res.status(401).send("Invalid email");

  const pass = await user.passCheck(req.body.password);
  if(!pass) return res.status(401).send("Invalid password");

  await user.save();
  const token = user.jwt();

  res.status(200).header("x-auth", token).send("Success");
});

function joiValidation(data) {
  const schema = {
    email: Joi.string().email({minDomainSegments: 2}).min(5).max(255).required(),
    password: Joi.string()
    .min(5)
    .max(255)
    .regex(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])"))
    .required()
    .error((errors) => {
      return errors.map(e => {
        console.log(e);
      switch(e.type) {
        case "string.min":
          return {message: "password must be of minimum 5 characters length"};
        case "string.max":
          return {message: "password must be of maximum 255 characters length"};
        case "string.regex.base":
          return {message: "the password must contain: At least 1 lowercase alphabetical character, 1 uppercase alphabetical character, 1 numeric character and 1 special character."}
        case "any.required":
          return {message: `"password" is required`}
      }
    })
    })
  }
  return Joi.validate(data, schema);
};

module.exports = router;