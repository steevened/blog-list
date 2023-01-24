const express = require('express');
const cors = require('cors');
const config = require('./utils/config');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const mongoose = require('mongoose');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const userExtractor = require('./utils/middleware').userExtractor;
require('express-async-errors');
const app = express();

logger.info('connecting to', config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to mongodb');
  })
  .catch(() => {
    logger.error('error connection to mongodb:', error.message);
  });

app.use(cors());
app.use(express.json());
app.use(middleware.tokenExtractor);
// app.use(middleware.userExtractor);
// app.use(express.static('build'))
app.use('/api/blogs', userExtractor, blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
