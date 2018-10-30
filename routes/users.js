let User = require('../models/User');
let express = require('express');
let router = express.Router();
const bcrypt = require('bcrypt');
const saltRoudns = 10;

/* POST user creation */
router.post('/', (req, res) => {
    bcrypt.hash(req.body['password'], saltRoudns, (err, hash) => {
        let newUser = new User({
            name: req.body['name'],
            email: req.body['email'],
            password: hash
        });

        let error = newUser.validateSync();
        if (error != undefined) {
            return res.status(422).json({errors: error.message})
        }

        newUser
            .save()
            .then(user => res.json(user))
            // todo email unique error should be more expressive!!!!
            .catch(error => res.status(422).send(error.errorMessage));
    });
})

router.post('/login', (req, response) => {
    User.findOne({email: req.body['email']}, (err, user) => {
        bcrypt.compare(req.body['password'], user.password, (err, res) => {
            if (err || !res) {
                return response.status(401).json({errors: 'Authentication Failed'});
            }

            return response.status(200).json(user);
        })
    })
});


module.exports = router;
