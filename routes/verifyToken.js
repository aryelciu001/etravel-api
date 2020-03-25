// ACTS AS MIDDLEWARE TO VERIFY WHETHER USER LOGGED IN OR NOT

const jwt = require('jsonwebtoken');

module.exports = function (req, res, next){
    const token = req.header('auth-token');
    if(!token){
        return res.status(401).send('Access Denied');
    }
    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.currentUser = verified;            // verified is _id of currently logged in user
        next();
    } catch (err){
        res.status(400).send('Invalid Token');
    }
}

