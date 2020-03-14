const express = require('express'),
      { Admin } = require('../model/admin'),
      auth = require('../middleware/auth'),
      router = express.Router();

router.get('/', auth, async(req, res) => {
  const admin = await Admin.findById(req.user._id);
  if(!admin) return res.status(403).send("You need to be an Admin");

  res.status(200).send("Success");
});      

module.exports = router;