require('dotenv').config();
let log4js = require('log4js');
let logger = log4js.getLogger();
logger.level = 'debug';
let helmet = require('helmet');
let createError = require('http-errors');
let express = require('express');
let bodyParser = require('body-parser');
let cors = require('cors');
let cookieParser = require('cookie-parser');
let mongoose = require('mongoose');
let port = 4200;
const basicAuth = require('./helper/basic_auth');

mongoose.Promise = require('bluebird');
logger.debug(process.env.NODE_ENV);
let mongoDb = process.env.NODE_ENV === 'production'
  ? process.env.DB_URI
  : "mongodb://database/kaizen";

// mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:27017/kaizen`)
mongoose
  .connect(mongoDb)
  .then(() => console.log('Connected to db'))
  .catch(err => console.log('APp connecting to db error: ' + err.stack));

let app = express();
app.use(helmet());
app.use(express.static('public'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(basicAuth);

let usersRouter = require('./routes/users');
let labelRouter = require('./routes/labels');
let sprintRouter = require('./routes/sprints');
let ticketRouter = require('./routes/tickets');
let commentRouter = require('./routes/comments');
let goalWeeklyRouter = require('./routes/goal_weekly');
let dailyTaskRouter = require('./routes/daily_task');

app.use('/users', usersRouter);
app.use('/labels', labelRouter);
app.use('/sprints', sprintRouter);
app.use('/tickets', ticketRouter);
ticketRouter.use('/:ticket_id/comments', commentRouter);
app.use('/goal_weekly', goalWeeklyRouter);
app.use('/daily_task', dailyTaskRouter);

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
