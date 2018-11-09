let GoalWeekly = require('../models/GoalWeekly');
let express = require('express');
let router = express.Router();

/* GET goal_weekly listing */
router.get('/', (req, res) => {
  GoalWeekly.find((err, goals) => {
    if (err) {
      console.log('error fetching goal_weeklies');
      goals = [];
    }

    res.json(goals);
  })
});

/* GET goal_weekly listing for a particular month */
router.get('/:year/:month', (req, res) => {
  params = {
    year: req.params.year,
    month: req.params.month
  };
  GoalWeekly.find(params, (err, goals) => {
    if (err) {
      console.log('error fetching goal_weeklies');
      goals = [];
    }

    let weeks = {};
    goals.forEach((e) => {
      if (weeks[e.week] === undefined ) {
        weeks[e.week] = [];
      }
      weeks[e.week].push(e)
    })

    res.json(weeks);
  })
});

/* POST goal_weekly */
router.post('/', (req, res) => {
  let goal = new GoalWeekly({
    year: req.body['year'],
    month: req.body['month'],
    week: req.body['week'],
    content: req.body['content'],
    user: req.body['user_id'],
  });

  let error = goal.validateSync();
  if (error != undefined) {
    return res.status(422).json({errors: error.message})
  }

  goal
    .save()
    .then(goal => res.json(goal))
    .catch(error => res.status(422).send(error.errorMessage));
})

/* PATCH update weekly goal */
router.patch('/:id', (req, res) => {
  let target = {_id: req.params.id};
  let update = {
    completed: true
  }
  GoalWeekly.findOneAndUpdate(target, update, (error, response) => {
    if (error != undefined) {
      return res.status(422).json({errors: error.errorMessage})
    }

    return res.status(201).json(response);
  })
});

module.exports = router;