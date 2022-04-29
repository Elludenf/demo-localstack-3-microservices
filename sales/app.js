var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const queue = require('./common/sqs')

var indexRouter = require('./routes/index');
var vehiclesRouter = require('./routes/vehicles');
var salesRouter = require('./routes/sales');


queue.startListening()

var app = express();

//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/', indexRouter);
app.use('/api/v1/vehicles', vehiclesRouter);
app.use('/api/v1/sales', salesRouter);

//app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.error(err)
  res.send({error: `error ${err}`});
});

module.exports = app;
