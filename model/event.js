const mongoose = require('mongoose'),
      Joi = require('@hapi/joi');

const eventSchema = new mongoose.Schema({
  guestImg: {
    type: String,
    required: true
  },
  eventMessage: {
    type: String,
    trim: true,
    minlength: 5,
    maxlength: 55,
    required: true
  },
  eventDate: {
    type: String,
    trim: true,
    required: true
  },
  prices: [String]
});

const Event = mongoose.model("Event", eventSchema);

function joiValidation(data) {
  const schema = {
    eventMessage: Joi.string().min(5).max(55).required(),
    eventDate: Joi.string().required(),
    guestImg: Joi.string().required(),
    entrancePositionPrice: Joi.string().required(),
    middlePositionPrice: Joi.string().required(),
    scenePositionPrice: Joi.string().required()
  };
  return Joi.validate(data, schema)
}

module.exports = { Event, joiValidation };