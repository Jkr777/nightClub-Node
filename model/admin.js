const mongoose = require('mongoose'),
      Joi = require('@hapi/joi'),
      jwt = require('jsonwebtoken'),
      bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
  adminUsername: {
    type: String,
    minlength: 3,
    maxlength: 55,
    trim: true,
    lowercase: true,
    required: true
  },
  email: {
    type: String,
    minlength: 5,
    maxlength: 255,
    trim: true,
    lowercase: true,
    required: true,
    unique: true
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 255,
    trim: true,
    required: true
  }
});

adminSchema.pre("save", async function(next) {
  if(!this.isDirectModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  return next();
});

adminSchema.methods.jwt = function() {
  const token = jwt.sign({_id: this._id}, process.env.CLUB_JWT, { expiresIn: '15h' });
  return token;
};

adminSchema.methods.passCheck = async function(pass) {
  const validation = await bcrypt.compare(pass, this.password);
  return validation;
};

const Admin = mongoose.model('Admin', adminSchema);

function joiValidation(data) {
  const schema = {
    adminUsername: Joi.string().min(3).max(55).lowercase().required(),
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
  };
    return Joi.validate(data, schema);
};

module.exports = { Admin, joiValidation };