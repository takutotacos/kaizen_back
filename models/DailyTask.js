let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let DailyTask = Schema({
  target_date: {
    type: Date,
    required: true,
  },
  start_date: Date,
  end_date: Date,
  time_spent: Date,
  completed: Boolean,
  user: {type: Schema.Types.ObjectId, ref: 'user'},
  ticket: {type: Schema.Types.ObjectId, ref: 'ticket'},
  ticket_title: String
})

module.exports = mongoose.model('daily_tasks', DailyTask);
