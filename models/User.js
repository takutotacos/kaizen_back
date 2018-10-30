let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let User = Schema({
    name: {
        type: String,
        required: true,
        max: 20,
    },
    email: {
        type: String,
        unique: true,

        // todo how to check if the format is right?
        // validate: {
        //     validator: check(this.email).isEmail(),
        // },
        required: [true, 'Email is necessary']
    },
    password: {
        type: String,
        required: true,
        min: [6, "Password should be minimum 6 length"],
    },
});

module.exports = mongoose.model('user', User);