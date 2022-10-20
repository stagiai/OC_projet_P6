const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // limite chaque IP à 3 requêtes per windowMs
    message: "Too many requests, please try again after 15 minutes"});

router.post('/signup', limiter, userCtrl.signup);
router.post('/login', limiter, userCtrl.login);


module.exports = router;