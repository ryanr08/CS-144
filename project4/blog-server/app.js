var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
let client = require('./db');
var blogRouter = require('./routes/blog');
var loginRouter = require('./routes/login');
var apiRouter = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

let privateKey = "C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c";
var jwt = require('jsonwebtoken');
app.all('/editor*', function(req, res, next) {
  let token = req.cookies.jwt;
  jwt.verify(token, privateKey, function(err, decoded) {
    if (err) {
      res.redirect(302, '/login?redirect=/editor/');
    }
    else {
      next();
    }
  });
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


// connect to Mongo on start
client.connect('mongodb://localhost:27017/', (err) => {
    if (err) {
        console.log('Unable to connect to Mongo.');
        process.exit(1);
    }
});

app.use('/blog', blogRouter);
app.use('/login', loginRouter);
app.use('/api/posts', apiRouter);

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
