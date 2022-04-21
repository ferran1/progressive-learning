const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const LearningGoal = require('../models/Learning-goal');
const LearningUnit = require('../models/LearningUnit');
const User = require('../models/User');
const helpers = require('../utils/helpers');

router.post('/api/subjects', async function (req, res) {
    const {name, description, userId} = req.body;
    if (!name || !userId) {
        res.status(400).json({
            message: 'No name or userID included'
        });
    }

    const subject = await Subject.create({
        name: name,
        description: description,
        userId: userId,
    }, {
        include: [Subject.learningGoals]
    });

    res.status(201).json(subject);

});

router.get('/api/subjects', async function (req, res) {
    const subjects = await Subject.findAll();
    res.status(200).json(subjects);
});


router.get('/api/subjects/:id', async function (req, res) {
    const subjectID = req.params.id;
    const subject = await Subject.findByPk(subjectID, {
        include: [
            {
                model: LearningGoal, include: [LearningUnit, Subject, {
                    model: User, attributes: ['id', 'email', 'admin', 'createdAt', 'updatedAt']
                }]
            }
        ]
    });

    const authorized = helpers.isAuthorized(subject.userId, req.headers.authorization);

    if (!subject) {
        res.status(400).json({
            message: 'No subject found with that given ID'
        });
    } else if (!authorized) {
        res.status(401).json({
            message: 'You are not authorized to access this resource'
        });
    } else res.status(200).json(subject);
});

router.put('/api/subjects/:id', async function (req, res) {
    const subjectID = req.params.id;
    const name = req.name;
    const subject = await Subject.findByPk(subjectID, {});

    if (!subject) res.status(400).json({
        message: 'No subject found with that given ID'
    });
    try {
        subject.name = name;
        await subject.save();
    } catch (e) {
        res.status(500).json({
            message: `Unable to update subject due to error: ${e}`
        });
    }

    res.status(200).json(subject);
});

router.delete('/api/subjects/:id', async function (req, res) {
    const subjectID = req.params.id;
    const subject = await Subject.findByPk(subjectID, {});
    if (subject) {
        try {
            await subject.destroy();
            res.status(200).end();
        } catch (error) {
            res.status(400).json({
                message: 'Unable to delete subject'
            });
        }
    } else {
        res.status(400).json({
            message: 'No subject found with given ID'
        });
    }
});


router.post('/api/users/:userId/subjects', helpers.isCookieAuth, async function (req, res) {

    const {subjectId} = req.body;

    let subject = await Subject.findByPk(subjectId);

    try {
        await User.findByPk(req.params.userId).then(user => {
            user.addSubjects([subjectId]).then(result => {
                console.log(result);
                return res.status(201).json(subject);
            });
        });
    } catch (e) {
        return res.status(400).json({
            message: `Error occurred when adding a subject to the user: ${e}`
        });
    }
});

router.get('/api/users/:userId/subjects', async function (req, res) {

    const userID = req.params.userId;

    try {
        //Retrieves all the subjects a user has attached to its account,
        // includes the learning-goals attached to the subjects.
        const user = await User.findByPk(req.params.userId, {
            include: {
                model: Subject,
                include: {
                    model: LearningGoal,
                    separate: true,
                    where: {
                        userId: userID
                    },
                    include: [LearningUnit, Subject]
                },

            }
        });
        console.log(user);

        if (user.subjects) {
            return res.status(200).json(user.subjects);
        }

    } catch (e) {
        return res.status(400).json({
            message: `Error occurred when trying to fetch all the user subjects: ${e}`

        });
    }
});


router.delete('/api/users/:userId/subjects/:subjectId', helpers.isCookieAuth, async function (req, res) {
    const subjectId = req.params.subjectId;
    const userId = req.params.userId;

    try {
        let user = await User.findByPk(userId);
        // let subject = Subject.findByPk(subjectId);
        await user.removeSubject(subjectId);
        return res.status(200).json(`Successfully deleted subject ${subjectId} from user ${userId}`);
    } catch (e) {
        return res.status(400).json({
            message: `Error occurred when trying to delete subject with id: ${subjectId} from
            user ${userId}. Error: ${e}`
        });
    }


});


module.exports = router;

