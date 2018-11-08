let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let GoalWeekly = Schema({
  year: {
    type: Number,
    required: true,
    min: 2018,
    max: 2100
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  week: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  content: {
    type: String,
    required: true
  },
  completed: Boolean,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  }
});

module.exports = mongoose.model('goal_weekly', GoalWeekly);