const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');

function decodeJWToken(token) {
    let decodedToken;
    try {
        decodedToken = jwt.decode(token);
    } catch (e) {
        console.log(e);
    }
    return decodedToken;
}

function isAuth(req, res, next) {
    let token;
    if (req.headers.authorization) {
        const authHeader = req.headers.authorization.split(' ');
        token = authHeader[1];
    }

    if (token) {
        const decodedJWToken = decodeJWToken(token);
        if (decodedJWToken.id === parseInt(req.params.userId)) {
            console.log(decodedJWToken.id, req.params.userId);
            next();
        } else {
            res.status(401).json({
                status: 401,
                message: 'You are not authorized to access this resource.'
            });
        }
    } else {
        res.status(400).json({
            status: 400,
            message: 'You are not authenticated, please log in.'
        });
    }
}


function isCookieAuth(req, res, next) {
    const token = req.session.token;
    console.log(token);
    if (token) {
        const decodedJWToken = decodeJWToken(token);
        if (decodedJWToken.id === parseInt(req.params.userId)) {
            console.log(decodedJWToken.id, req.params.userId);
            next();
        } else {
            res.status(401).json({
                status: 401,
                message: 'You are not authorized to access this resource.'
            });
        }
    } else {
        res.status(400).json({
            status: 400,
            message: 'You are not authenticated, please log in.'
        });
    }
}


async function isUser(req, res, next) {
    let token;
    if (req.session.token) {
        token = req.session.token;
    }

    console.log(token);

    if (token) {
        const decodedJWToken = decodeJWToken(token);

        const user = await User.findByPk(decodedJWToken.id, {
            attributes: {
                exclude: ['password', 'password_salt']
            }
        });

        if (user) {
            next();
        } else {
            res.status(401).json({
                status: 401,
                message: 'You are not authorized to access this resource.'
            });
        }
    }
}


function isPasswordCorrect(passwordAttempt, savedHash, savedSalt) {
    const iterations = 10000;
    return savedHash == crypto.pbkdf2Sync(passwordAttempt, savedSalt, iterations, 64, 'sha512').toString('hex');
}

function isAuthorized(userId, jwToken) {
    const decodedToken = jwt.decode(jwToken.split(' ')[1]);
    console.log(decodedToken, userId);
    return userId === parseInt(decodedToken.id);
}

function isCookieAuthorized(userId, jwtToken) {
    const decodedToken = jwt.decode(jwtToken);
    console.log(decodedToken, userId);
    return userId === parseInt(decodedToken.id);
}

module.exports = {
    decodeJWToken,
    isAuth,
    isCookieAuth,
    isCookieAuthorized,
    isUser,
    isPasswordCorrect,
    isAuthorized
};
