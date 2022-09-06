var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var path = require('path');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var holesRouter = require('./routes/holes');

var app = express();
app.listen(process.env.PORT || 3000);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/holes', holesRouter);

module.exports = app;
