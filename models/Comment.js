let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Comment = Schema({
    content: {
        type: String,
        required: true
    },
    user: {type: Schema.Types.ObjectId, ref: 'user'},
    ticket: {type: Schema.Types.ObjectId, ref: 'ticket'}
}, {
    collections: 'comments'
});

module.exports = mongoose.model('comment', Comment);