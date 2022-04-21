const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const User = require('../models/User');

router.get('/api/articles/:articleId', async function (req, res) {
    const id = req.params.articleId;
    const articles = await Article.findByPk(id,{
        include: [{model: User, attributes:['first_name', 'last_name', 'profile_picture']}], 
    });
    res.status(200).json(articles);
});

const helpers = require('../utils/helpers');
router.get('/api/articles', async function (req, res) {
    const articles = await Article.findAll({
        attributes: {
            exclude: ['content'],
        },
        include: [{model: User, attributes:['first_name', 'last_name', 'profile_picture']}],
    });
    res.status(200).json(articles);
});

router.get('/api/users/:userId/articles', helpers.isUser, async function (req, res) {
    const userID = req.params.userId;
    const user = await User.findByPk(userID);

    if (!user) res.status(400).json({
        message: 'No user found with that given ID'
    });

    const articles = await Article.findAll({
        where: {
            userId: user.id
        }
    });
    res.status(200).json(articles);
});

router.post('/api/articles', async function (req, res) {
    const { title, content, userId, subjectId } = req.body;
    try {
        let article = await Article.create({
            title: title,
            content: content,
            userId: userId,
            subjectId: subjectId
        });
        return res.status(200).json(article);
    } catch (e) {
        return res.status(400).json({
            message: `Error occurred when creating an article: ${e}`
        });
    }
});

module.exports = router;
