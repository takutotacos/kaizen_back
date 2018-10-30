let Ticket = require('../models/Ticket');
let express = require('express');
let router = express.Router();

/* GET ticket listing */
router.get('/', (req, res) => {
    Ticket.find((err, tickets) => {
        if (err) {
            console.log('error fetching tickets');
            tickets = [];
        }

        res.json(tickets);
    })
});

/* POST ticket creation */
router.post('/', (req, res) => {
    let newTicket = new Ticket({
        title: requestValue(req, 'title'),
        description: requestValue(req, 'description'),
        time: requestValue(req, 'time'),
        status: requestValue(req, 'status'),
        importance: requestValue(req, 'importance'),
        urgency: requestValue(req, 'urgency'),
        lasting_effect: requestValue(req, 'lasting_effect'),
        labels: requestValue(req, 'label_id'),
        owner: requestValue(req, 'owner_id'),
    });

    let error = newTicket.validateSync();
    if (error != undefined) {
        return res.status(422).json({errors: error.message})
    }

   newTicket
        .save()
        .then(ticket => res.json(ticket))
        .catch(error => res.status(422).send(error.errorMessage));
})

let enumValues = (value) => {
    return Ticket.schema.path(`ticket.${value}`).enumValues;
};

let requestValue = (req, value) => {
    return req.body[value];
}


module.exports = router;