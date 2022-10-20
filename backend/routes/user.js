const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 3, // limite chaque IP à 3 requêtes per windowMs
    message: "Too many requests, please try again after 1 minute"});

router.post('/signup', limiter, userCtrl.signup);
router.post('/login', limiter, userCtrl.login);


module.exports = router;