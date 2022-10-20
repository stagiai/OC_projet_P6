const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
    try {
        console.log(req.path);
        const token = req.headers.authorization.split(' ')[1];
        console.log('auth / token : '+token); // -------------------- debug ----------------
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        }
        next();
    } catch(error) {
        res.status(401).json({error: new Error('Invalid request !')});
    }
};