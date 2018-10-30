let Sprint = require('../models/Sprint');
let express = require('express');
let router = express.Router();

router.get('/', (req, res) => {
    Sprint.find((err, sprints) => {
        if (err) {
            console.log('error fetching sprints');
            sprints = [];
        }

        res.json(sprints);
    });
});

router.post('/', (req, res) => {
    let newSprint = new Sprint({
        name: requestValue(req, 'name'),
        start_date: requestValue(req, 'start_date'),
        end_date: requestValue(req, 'end_date')
    });

    let error = newSprint.validateSync();
    if (error != undefined) {
        return res.status(422).json({errors: error.message})
    }

    newSprint
        .save()
        .then(sprint => res.json(sprint))
        .catch(error => res.status(422).send(error.errorMessage));
});

let requestValue = (req, value) => {
    return req.body[value];
}

module.exports = router;