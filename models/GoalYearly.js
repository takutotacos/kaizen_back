let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let GoalYearly = Schema({
  year: {
    type: Number,
    required: true,
    min: 2018,
    max: 2100
  },
  content: {
    type: String,
    required: true
  },
  completed: Boolean,
  user: {type: Schema.Types.ObjectId, ref: 'user'}
});

module.exports = mongoose.model('goal_yearly', GoalYearly);