let DailyTask = require('../models/DailyTask');
let express = require('express');
let router = express.Router();
let log4js = require('log4js');
let logger = log4js.getLogger();
logger.level = 'debug';

router.get('/:year/:month/:day', (req, res) => {
  logger.debug(req.params);

  let {year, month, day} = req.params;
  let request_params = {
    target_date: `${year}/${month}/${day}`,
    user: req.user.id
  };

  logger.debug(`the request for daily_schedule of ${year}/${month}/${day}`);

  DailyTask
    .find(request_params)
    .populate('ticket')
    .exec((err, daily_tasks) => {
    if (err) {
      logger.debug('error fetching daily_tasks');
      daily_tasks = [];
    }

    res.json(daily_tasks);
  })
});

router.post('/:year/:month/:day', (req, res) => {
  logger.debug(req.body);

  let {year, month, day} = req.params;
  let daily_task_param = new DailyTask({
    target_date: `${year}/${month}/${day}`,
    start_date: req.body['start_date'],
    end_date: req.body['end_date'],
    completed: false,
    ticket: req.body['ticket_id'],
    ticket_title: req.body['ticket_title'],
    user: req.user.id
  });

  logger.debug(daily_task_param);

  let newDailyTask = new DailyTask(daily_task_param);
  let error = newDailyTask.validateSync();
  if (error !== undefined) {
    logger.debug(error.message);
    return res.status(422).json({errors: error.message});
  }

  newDailyTask
    .save()
    .then(daily_task => {
      logger.debug(daily_task);
      res.json(daily_task);
    })
    .catch(error => {
      logger.debug(error.errorMessage);
      res.status(422).send(error.errorMessage)
    });
});

router.patch('/:year/:month/:day', (req, res) => {
  logger.debug(req.body);

  let {year, month, day} = req.params;
  let schedule_id = req.body['schedule_id'];
  let daily_task_param = {
    target_date: `${year}/${month}/${day}`,
    start_date: req.body['start_date'],
    end_date: req.body['end_date'],
    completed: false,
    ticket: req.body['ticket_id'],
    user: req.user.id
  };

  logger.debug(daily_task_param);

  DailyTask.findOneAndUpdate({_id: schedule_id}, daily_task_param, {upsert: true, new: true}, (err, raw) => {
    if (err) {
      logger.debug(err.message);
      res.status(422).send(err.errorMessage);
      return;
    }

    logger.debug(raw);
    res.json(raw);
  });
});

router.delete('/:year/:month/:day/:schedule_id', (req, res) => {
  logger.debug(req.params);

  let {year, month, day, schedule_id} = req.params;
  let params = {
    target_date: `${year}/${month}/${day}`,
    _id: schedule_id
  };

  logger.debug(params);

  DailyTask.deleteOne(params, (err) => {
    if (err) {
      logger.debug(err.message);
      res.status(404).send(err.errorMessage);
      return;
    }

    res.status(202).send();
  })
});

module.exports = router;
