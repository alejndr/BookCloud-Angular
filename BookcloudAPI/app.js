'use strict';

require('rootpath')();
const functions = require('firebase-functions');  
var createError = require('http-errors');
var express = require('express');
var cors = require('cors')
var app = express();
var path = require('path');
var reviews = require('./reviews/review.controller');
var jwt = require('./_helpers/jwt');
var indexRouter = require('./routes/index');
var mongoose = require('mongoose');
let server = require('http').Server(app);
var bodyParser = require('body-parser');
var books = require('./books/Book.controller');

app.use(express.static(path.join(__dirname, './public')));
app.use(cors())
app.options('*', cors())




const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log("App is running on port " + port);
});


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// MongoDB

mongoose.Promise = global.Promise;
var mongoDB = "mongodb://bookAdmin:bookAdmin1@ds127961.mlab.com:27961/bookcloud";

mongoose.connect(mongoDB, {useCreateIndex: true, useNewUrlParser: true})
  .then(() =>  console.log('connection succesful'))
  .catch((err) => console.error(err));

app.use(jwt());

app.use('/users', require('./users/users.controller'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');




app.use('/books', books);
app.use('/reviews', reviews);
app.use('/', indexRouter);


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
  res.render('error');
});

module.exports = app;

exports.api = functions.https.onRequest(app);
