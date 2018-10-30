let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Label = Schema({
    name: {
        type: String,
        required: true

    },
    tickets: [{type: Schema.Types.ObjectId, ref: 'ticket'}]
}, {
    collection: 'labels'
});

module.exports = mongoose.model('label', Label);