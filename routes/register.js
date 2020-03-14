const express = require('express'),
      { Admin, joiValidation } = require('../model/admin'),
      _ = require('lodash'),
      router = express.Router();

router.post('/', async(req, res) => {
  const { error } = joiValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  let admin = await Admin.find({});
  if(admin.length !== 0) return res.status(403).send("You can't have multiple admins");

  admin = new Admin(_.pick(req.body, ["adminUsername", "email", "password"]));
  await admin.save();
  const token = admin.jwt();

  res.status(201).header("x-auth", token).send("Admin created");
});

module.exports = router;