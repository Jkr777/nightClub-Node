const express = require('express'),
      cors = require('cors'),
      corsOptions = {
        exposedHeaders: 'X-Auth', 
      },
      admin = require('../routes/admin'),
      event = require('../routes/events'),
      login = require('../routes/login'),
      register = require('../routes/register'),
      errorHandler = require('../middleware/error');

module.exports = app => {
  app.use(express.json());
  app.use(cors(corsOptions));
  app.use('/admin', admin);
  app.use('/events', event);
  app.use('/login', login);
  app.use('/register', register);
  app.use(function(req, res) {
    return res.status(404).send("Page not found!");
  });
  app.use(errorHandler);
};