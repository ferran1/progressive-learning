const express = require('express');
const router = express.Router();
const helpers = require('../utils/helpers');
const LearningGoal = require('../models/Learning-goal');
const LearningUnit = require('../models/LearningUnit');
const Subject = require('../models/Subject');
const Comment = require('../models/Comment');
const User = require('../models/User');
const Upvote = require('../models/Upvote');
const Downvote = require('../models/Downvote');
const { Op } = require('sequelize');


router.get('/api/learning-goals', async function (req, res) {
    let learningGoals = [];
    let visibility = req.query.visibility;
    if (visibility === 'PUBLIC') {
        learningGoals = await LearningGoal.findAll({
            where: {
                visibility: visibility
            },
            include: [LearningUnit, Subject, Upvote, Downvote, {
                model: User,
                attributes: ['first_name', 'last_name', 'profile_picture']
            }],
        });
    } else {
        learningGoals = await LearningGoal.findAll({
            include: [LearningUnit, Subject, Upvote, Downvote, {
                model: User,
                attributes: ['first_name', 'last_name', 'profile_picture']
            }]
        });
    }
    res.status(200).json(learningGoals);
});

router.get('/api/learning-goals/:id', async function (req, res) {
    const learningGoal = await LearningGoal.findByPk(req.params.id, {
        include: [LearningUnit, Subject, Upvote, Downvote, {
            model: Comment,
            include: User
        }, {
            model: User,
            attributes: {
                exclude: ['password', 'password_salt']
            }
        }]
    });

    if (!learningGoal) {
        res.status(400).json({message: 'No learning goal found with that ID'});
        res.end();
    } else
        res.status(200).json(learningGoal);
});

// router.get('/api/learning-goals/search/:search', async function (req, res) {
//     console.log()
//     const search = await req.params.search
//     const learningGoal = await LearningGoal.findAll({
//         where: {
//             goal: {[Op.like] : "%"+search+"%"}
//         },
//         include: [LearningUnit, Subject, Upvote, Downvote, {
//             model: Comment,
//             include: User
//         }, {
//             model: User,
//             attributes: {
//                 exclude: ['password', 'password_salt']
//             }
//         }],
//
//     });
//
//     if (!learningGoal) {
//         res.status(400).json({message: 'No learning goal found with that ID'});
//         res.end();
//     } else
//         res.status(200).json(learningGoal);
// });

router.put('/api/learning-goals/:id', async function (req, res) {
    let learningGoal = await LearningGoal.findByPk(req.params.id, {
        include: [LearningUnit, Subject, {
            model: User,
            attributes: {
                exclude: ['password', 'password_salt']
            }
        }]
    });

    if (!learningGoal || learningGoal.goal == null) {
        res.status(400).json({message: 'No learning goal found with that ID!'});
    } else {
        let updatedUnits = req.body.learningUnits;
        updatedUnits.forEach(unit => console.log(unit));
        await learningGoal.updateLearningUnits(updatedUnits);
        console.log(learningGoal.toJSON());
        await learningGoal.reload();
        learningGoal.goal = req.body.goal;
        learningGoal.progress = req.body.progress;
        learningGoal.description = req.body.description;
        learningGoal.subjectId = req.body.subjectId;
        learningGoal.visibility = req.body.visibility;
        await learningGoal.save();
        res.status(200).json(learningGoal);
    }
});

router.post('/api/learning-goals', async function (req, res) {
    const {goal, progress, description, visibility, learningUnits, subject, user} = req.body;
    console.log(user);
    console.log(req.body);

    if (!goal) {
        return res.status(400).json({message: 'No learning goal has been specified!'});
    }

    let learningGoal = await LearningGoal.create({
        goal: goal,
        progress: progress,
        description: description,
        visibility: visibility,
        learningunits: learningUnits,
        subjectId: subject ? subject.id : null,
        userId: user ? user.id : null
    }, {
        include: [LearningUnit]
    });

    learningGoal = await LearningGoal.findByPk(learningGoal.id, {
        include: [LearningUnit, Subject, User]
    });

    console.log(learningGoal.toJSON(), await learningGoal.getSubject());
    res.status(201).json(learningGoal);
});

router.delete('/api/learning-goals/:id', async function (req, res) {
    const learningGoal = await LearningGoal.findByPk(req.params.id, {
        include: [LearningUnit]
    });
    const learningUnits = learningGoal.learningunits;
    console.log(learningGoal.toJSON());
    for (let learningUnit of learningUnits) {
        learningUnit = await LearningUnit.findByPk(learningUnit.id);
        learningUnit.destroy();
    }
    await learningGoal.reload();
    await learningGoal.updateProgress();

    if (learningGoal) {
        await learningGoal.destroy();
        res.status(204).json({
            message: `Successfully deleted learningGoal with ID: ${req.params.id}`
        });
    } else {
        res.status(400).json({message: 'No learning goal found to delete'});
    }
});

// User-learning goal routes
router.get('/api/users/:userId/learning-goals', helpers.isUser, async function (req, res) {
    const user = await User.findByPk(req.params.userId, {
        attributes: ['id', 'email', 'admin', 'createdAt', 'updatedAt']
    });
    let test = helpers.isCookieAuthorized(user.id, req.session.token);

    if (user) {
        let learningGoals;
        if (test) {
            learningGoals = await user.getLearningGoals({
                include: [LearningUnit, Subject, Comment, Upvote, Downvote]
            });
        } else {
            learningGoals = await user.getLearningGoals({
                include: [LearningUnit, Subject],
                where: {
                    visibility: 'PUBLIC'
                }
            });
        }
        res.status(200).json(learningGoals);
    } else {
        res.status(404).json({
            status: 404,
            message: 'User not found!'
        });
    }
});


//Learning-goal comments routes
router.get('/api/learning-goals/:id/comments', async function (req, res) {
    const learningGoal = await LearningGoal.findByPk(req.params.id, {
        include: [Comment]
    });
    const comments = learningGoal.comments;

    if (comments) {
        res.status(200).json(comments);
    } else {
        res.status(404).json({message: 'Unable to fetch comments'});
    }
});


router.delete('/api/learning-goals/:id/comments/:commentId', async function (req, res) {
    const commentToDelete = await Comment.findByPk(req.params.commentId);

    if (commentToDelete) {
        await commentToDelete.destroy();
        res.status(204).json({
            message: `Successfully deleted comment with ID: ${req.params.commentId}`
        });
    } else {
        res.status(400).json({message: 'No comment found to delete'});
    }
});

router.post('/api/learning-goals/:id/comments', async function (req, res) {
    const {content, user} = req.body;
    const learningGoal = await LearningGoal.findByPk(req.params.id);
    const newComment = await Comment.create({
        content: content,
        userId: user.id
    }, {
        include: [User]
    });

    await learningGoal.addComment(newComment);
    await newComment.reload();

    if (newComment) {
        res.status(201).json(newComment);
    } else {
        res.status(400).json('Error: Unable to create comment!');
    }
});

router.post('/api/learning-goals/:id/upvote', async function (req, res) {
    const {userId} = req.body;
    const learningGoal = await LearningGoal.findByPk(req.params.id);
    const newUpvote = await Upvote.create({
        learningGoal: learningGoal,
        userId: userId
    }, {
        include: [User]
    });

    await learningGoal.addUpvote(newUpvote);

    res.status(200).json(newUpvote);
});

router.post('/api/learning-goals/:id/downvote', async function (req, res) {
    const {userId} = req.body;
    const learningGoal = await LearningGoal.findByPk(req.params.id);
    const newDownvote = await Downvote.create({
        learningGoal: learningGoal,
        userId: userId
    }, {
        include: [User]
    });

    await learningGoal.addDownvote(newDownvote);

    res.status(200).json(newDownvote);
});


module.exports = router;
