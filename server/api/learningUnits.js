let express = require('express');
let router = express.Router();
const LearningUnit = require('../models/LearningUnit');
const Resource = require('../models/Resource');
const LearningGoal = require('../models/Learning-goal');
const Subject = require('../models/Subject');
const User = require('../models/User');
const helpers = require('../utils/helpers');

router.get('/api/learningUnits/:id', async function (req, res) {
    const learningUnit = await LearningUnit.findByPk(req.params.id, {
        include: [{model: LearningGoal, include: [User, Subject]}, Resource]
    });

    let authorized;
    if (learningUnit.learningGoal.visibility === 'PUBLIC') {
        authorized = true;
    } else authorized = helpers.isCookieAuthorized(learningUnit.learningGoal.userId, req.session.token);


    if (!learningUnit) {
        return res.status(404).json({
            message: 'No learningUnit found with that given ID'
        });
    } else if (!authorized) {
        return res.status(401).json({
            message: 'You are not authorized to access this resource'
        });
    } else return res.status(200).json(learningUnit);
});

router.get('/api/learningUnits/:id/resources', async function (req, res) {
    const learningUnitID = req.params.id;

    if (!learningUnitID) {
        return res.status(400).json({
            message: 'No learningUnit ID has been included in the request'
        });
    }

    const learningUnit = await LearningUnit.findByPk(learningUnitID, {
        include: Resource
    });

    if (!learningUnit) {
        return res.status(404).json({
            message: 'No learningUnit found with given ID'
        });
    } else {
        return res.status(200).json(learningUnit.resources);
    }

});

router.put('/api/learningUnits/:id', async function (req, res) {
    const {title, completed, summary} = req.body;

    let learningUnit = await LearningUnit.findByPk(req.params.id, {
        include: [ Resource, {
            model: LearningGoal,
            include: [Subject]
        }]
    });
    let learningGoal = await learningUnit.getLearningGoal();

    if (learningUnit) {
        learningUnit.title = title;
        learningUnit.completed = completed;
        learningUnit.summary = summary;
        await learningUnit.save();
        console.log(learningUnit.toJSON());
        await learningGoal.updateProgress();
        return res.status(200).json(learningUnit);
    } else {
        return res.status(404).json({message: 'Unit with given ID not found'});
    }

});

router.post('/api/learningUnits', async function (req, res) {
    const {title, completed, summary} = req.body;

    try {
        let learningUnit = await LearningUnit.create({
            title: title,
            completed: completed,
            summary: summary
        });
        return res.status(201).json(learningUnit);
    } catch (e) {
        return res.status(400).json({
            message: `Error occurred when creating a learningUnit: ${e}`
        });
    }

});

router.post('/api/learningUnits/:id/resources', async function (req, res) {
    const learningUnitID = req.params.id;
    const {url, type} = req.body;

    if (!learningUnitID) {
        return res.status(400).json({
            message: 'No learningUnit ID has been included in the request'
        });
    } else if (!url || !type) {
        return res.status(400).json({
            message: 'No resource URL or type has been included in the request'
        });
    }

    const learningUnit = await LearningUnit.findByPk(learningUnitID, {
        include: Resource
    });
    const resource = await Resource.findOrCreate(
        {
            where: {
                url: url,
                type: type
            },
            defaults: {
                url: url,
                type: type
            }
        });

    await learningUnit.addResource(resource[0].id);
    await learningUnit.reload({
        include: Resource
    });
    return res.status(200).json(learningUnit.resources);
});

router.delete('/api/learningUnits/:id', async function (req, res) {
    const learningUnit = await LearningUnit.findByPk(req.params.id);

    if (!learningUnit) {
        return res.status(404).json({
            message: 'No learningUnit found with given id.'
        });
    } else {
        await learningUnit.destroy();
        return res.status(204)
            .json(`Deleted learningUnit with ic: ${req.params.id} successfully`);
    }

});

module.exports = router;




