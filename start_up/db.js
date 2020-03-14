const mongoose = require('mongoose'),
      logger = require('./loggin')(__filename);

module.exports = () => {
  mongoose.connect(process.env.CLUB_DB, { useNewUrlParser: true, useCreateIndex: true })
  .then(() => logger.info('mongoDb connected'))
  .catch(err => logger.info(err));
};