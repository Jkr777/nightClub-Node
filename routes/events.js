const express = require('express'),
      {Event, joiValidation} = require('../model/event'),
      AWS = require('aws-sdk'),
      _ = require('lodash'),
      auth = require('../middleware/auth'),
      s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESSKEY,
        secretAccessKey: process.env.AWS_SECRET,
        signatureVersion: 'v4',
        region: 'us-east-2'
      }),
      uuid = require('uuid'),
      router = express.Router();

router.get('/', async(req, res) => {
  const event = await Event.findOne({});
  res.status(200).send(_.pick(event, ['_id', 'guestImg', 'eventMessage', 'eventDate', 'prices']))
});  

router.get('/upload', auth, async(req, res) => {
  const key = `${req.user._id}/${uuid()}.jpeg`;

  s3.getSignedUrl('putObject', {
    Bucket: 'club-project666666',
    ContentType: 'image/jpeg',
    Key: key
  }, (err, url) => res.status(201).send({url, key}));
});

router.post('/', async(req, res) => {
  const { error } = joiValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  let prevEvent = await Event.findOne({});
  if(prevEvent) {
    s3.deleteObject({
      Bucket: 'club-project666666',
      Key: prevEvent.guestImg
    }, function(err, data) {
      if(err){
       console.log(err, err.stack);
      }
     console.log(data)
    });
  await Event.deleteOne({_id: prevEvent._id})
  };

  const event = new Event({
    guestImg: req.body.guestImg,
    eventMessage: req.body.eventMessage,
    eventDate: req.body.eventDate,
    prices: [req.body.entrancePositionPrice, req.body.middlePositionPrice, req.body.scenePositionPrice]
  });
  await event.save();

  res.status(201).send(_.pick(event, ['_id', 'guestImg', 'eventMessage', 'eventDate', 'prices']));
});   


module.exports = router;