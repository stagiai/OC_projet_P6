const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        console.log('user hash '+hash); // ---------------------- debug -------------------------------
        console.log('user req email '+req.body.email); // ------------------------- debug --------------------
        const user = new User({
            userEmail: req.body.email,
            userPassword: hash
        });
        user.save()
        .then(() => res.status(201).json({message: 'Utilisateur créé'}))
        .catch(error => {
            console.log(error); // ---------------------- debug -------------------------
            res.status(400).json(error)})
    })
    .catch(error => res.status(500).json({error}));

};

exports.login = (req, res, next) => {
    User.findOne({userEmail: req.body.email})
    .then(user => {
        if (user === null){
            console.log(user); // --------------- debug ------------------------------
            res.status(401).json({message: 'Paire identifiant/mot de passe incorrecte'});
        } else {
            bcrypt.compare(req.body.password, user.userPassword)
            .then(valid => {
                console.log('user password valid '+valid); // ------------------ debug ----------------------
                if (!valid) {
                    res.status(401).json({message: 'Paire identifiant/mot de passe incorrecte'});
                } else {
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            {userId: user._id},
                            process.env.SECRET_KEY,
                            {expiresIn: '24h'}
                        )
                    })
                    console.log('user / user id '+user._id);
                }

            })
            .catch(error => {
                res.status(500).json({ error });
            })
        }
    })
    .catch(error => {
        res.status(500).json({error});
    })
}

