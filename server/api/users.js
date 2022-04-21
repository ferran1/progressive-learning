const express = require('express');
const {where} = require('../models/User');
const router = express.Router();
const User = require('../models/User');
const Subject = require('../models/Subject');
const helpers = require('../utils/helpers');

const minimumLengthPassword = 8;

router.get('/api/users', helpers.isAuth, async function (req, res) {
    const users = User.findAll();
    res.status(200).json(users);
});

router.get('/api/users/:userId', async function (req, res) {
    const id = req.params.userId;
    const user = await User.findByPk(id, {
        attributes: {
            exclude: ['password', 'password_salt']
        }
    });

    if (!user) {
        res.status(404).json({
            status: 404,
            message: 'User not found'
        });
    } else {
        res.status(200).json(user);
    }

});

router.put('/api/users/:id', helpers.isAuth, async function (req, res) {
    const {email, admin} = req.body;
    let user = await User.findByPk(req.params.id);
    if (user) {
        user.admin = admin;
        user.email = email;
        await user.save().then((r) => {
            console.log(r);
            res.status(200).json(user);
        }).catch((e) => {
            console.log(e);
            res.status(400).json({
                status: 400,
                name: `${e.name}`,
                message: `${e.errors[0].message}`
            });
        });
    } else {
        res.status(400).json({
            message: 'No user found with given ID'
        });
    }
});

router.put('/api/users/:id/settings', async function (req, res) {
    const {firstName, lastName, email, aboutMe} = req.body;
    let user = await User.findByPk(req.params.id);
    if (user) {
        user.first_name = firstName;
        user.last_name = lastName;
        if (email !== user.email)
            user.email = email;
        user.about_me = aboutMe;

        if (req.body.profilePicture !== undefined)
            user.profile_picture = req.body.profilePicture;

        await user.save().then((r) => {
            console.log(r);
            res.status(200).json({
                status: 200,
                message: 'Successfully updated the profile information'
            });
        }).catch((e) => {
            console.log(e);
            res.status(400).json({
                status: 400,
                name: `${e.name}`,
                message: `${e.errors[0].message}`
            });
        });
    } else {
        res.status(400).json({
            message: 'No user found with given ID'
        });
    }
});

router.put('/api/users/:id/password', async function (req, res) {
    const {current_password, new_password, confirm_password} = req.body;

    let user = await User.findByPk(req.params.id);

    if (!user) {
        res.status(400).json({
            message: 'No user found with given ID'
        });
    }

    let passwordCorrect = user ? helpers.isPasswordCorrect(current_password, user.password, user.password_salt) : false;
    if (!passwordCorrect) {
        res.status(400).json({
            message: 'The given current password is not correct'
        });
    }

    if (new_password !== confirm_password) {
        res.status(400).json({
            message: 'The given new password is not equal to the confirmed input.'
        });
    }

    const passwordHash = User.hashPassword(new_password);
    user.password = passwordHash.hash.toString('hex');
    user.password_salt = passwordHash.salt;

    await user.save().then((r) => {
        console.log(r);
        res.status(200).json(user);
    }).catch((e) => {
        console.log(e);
        res.status(400).json({
            status: 400,
            name: `${e.name}`,
            message: `${e.errors[0].message}`
        });
    });
});

function isPasswordValid(password) {

    return !(password === '' || password.length < minimumLengthPassword);
}

router.post('/api/users', async function (req, res) {

    const {email, password, admin} = req.body;
    const passwordHash = User.hashPassword(password);

    if (!isPasswordValid(password)) {
        res.status(409).json({
            message: `Error occurred while creating a user: the password must contain at least ${minimumLengthPassword} characters.`
        });
        return;
    }

    const found = await User.findAll({
        where: {
            email: email
        }
    });

    console.log(found);

    if (found > []) {
        console.log('user already exists');
        res.status(200).json({
            message: 'User already exists'
        });
    } else {
        const newUser = await User.create({
            email: email,
            password: passwordHash.hash.toString('hex'),
            password_salt: passwordHash.salt,
            admin: admin
        }).catch(e => {
            console.log(e);
            res.status(404).json({
                message: e

            });
        });

        if (newUser) {
            res.status(201).json({
                message: 'User was created succesfully!'
            });

        } else res.status(400).json({
            message: 'No user created'
        });
    }
});


module.exports = router;
