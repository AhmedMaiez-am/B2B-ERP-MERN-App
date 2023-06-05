const express = require ('express');

const stripe = require ("stripe")("sk_test_51NFYMWC0bbJKKtql6lhEHTMMeaszy4gA1lpMWAzJJRVu5opJL2PcblkmSwEtO0JwujT7W9mSAuR7L8ikhJERJ1sA00niftSnmk");
const {v4: uuidv4} = require ('uuid');

const router = express.Router();

router.get('/', (req, res, next) => {
    console.log(("Get response from researcher"));
    res.json({
        message: 'Success'
    });
});

router.post("/pay", (req, res, next) => {
    console.log(req.body.token);
    const {token,amount} = req.body;
    const idempotemcyKey = uuidv4();

    return stripe.customers.create({
        email: token.email,
        source: token
    }).then (customer => {
        stripe.charges.create({
            amount: amount * 100,
            currency: 'eur',
            customer: customer.id,
            receipt_email: token.email
        }, {idempotemcyKey})
    }).then(result => {
        res.status(200).json(result)
    }).catch(err => {
        console.log(err);
    });
});
module.exports = router;
