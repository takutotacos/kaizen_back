require('dotenv').config();
let createError = require('http-errors');
let express = require('express');
let bodyParser = require('body-parser');
let cors = require('cors');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let mongoose = require('mongoose');
let port = 4200;

mongoose.Promise = require('bluebird');
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:27017/kaizen`)
    .then(() => {
        console.log('Connected to db');
    })
    .catch(err => {
        console.log('APp connecting to db error: ' + err.stack);
    });

let app = express();
app.use(express.static('public'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(logger('dev'));

let usersRouter = require('./routes/users');
let labelRouter = require('./routes/labels');
let sprintRouter = require('./routes/sprints');
let ticketRouter = require('./routes/tickets');
let commentRouter = require('./routes/comments');

app.use('/users', usersRouter);
app.use('/labels', labelRouter);
app.use('/sprints', sprintRouter);
app.use('/tickets', ticketRouter);
ticketRouter.use('/:ticket_id/comments', commentRouter);

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
  res.send('error');
});

app.listen(port, function () {});
module.exports = app;
