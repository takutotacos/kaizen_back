let Comment = require('../models/Comment');
let express = require('express');
let router = express.Router({mergeParams: true});

/* GET comment listing */
router.get('/', (req, res) => {
    let ticket_id = req.params.ticket_id;
    Comment.find({ticket: ticket_id}, ((err, comments) => {
        if (err) {
            console.log('error fetching comments');
            comments = [];
        }

        res.json(comments);
    }));
})

/* POST comment creation */
router.post('/', (req, res) => {
    let comment = new Comment({
        content: requestValue(req, 'content'),
        user: requestValue(req, 'user_id'),
        ticket: req.params.ticket_id
    });

    let error = comment.validateSync();
    if (error != undefined) {
        return res.status(422).json({errors: error.message})
    }

    comment
        .save()
        .then(comment => res.json(comment))
        .catch(error => res.status(422).send(error.errorMessage));
});

let requestValue = (req, value) => {
    return req.body[value];
}

module.exports = router;