const {Sequelize} = require('sequelize');

// Mysql database
module.exports = new Sequelize(process.env.DB_NAME, process.env.DB_USER,
    process.env.DB_PASS, {
        host: process.env.HOST,
        dialect: 'mysql',
        logging: console.log
    });

// Sqlite database
// module.exports = new Sequelize({
//     dialect: 'sqlite',
//     logging: console.log
// });

const LearningGoal = require('../models/Learning-goal');
const LearningUnit = require('../models/LearningUnit');
const Resource = require('../models/Resource');
const User = require('../models/User');
const Subject = require('../models/Subject');
const Article = require('../models/Article');
const Comment = require('../models/Comment');
const Upvote = require('../models/Upvote');
const Downvote = require('../models/Downvote');



// LearningGoal.upvotes = LearningGoal.belongsToMany(User, {through: 'Upvotes'});
//
// LearningGoal.downvotes = LearningGoal.belongsToMany(LearningGoal, {through: 'Downvotes'});

// LearningGoal.user = User.belongsTo(LearningGoal, {through: 'Upvotes'});
// User.user = LearningGoal.belongsTo(User, {through: 'Upvotes'});
//
// LearningGoal.user = User.belongsTo(LearningGoal, {through: 'Downvotes'});
// User.user = LearningGoal.belongsTo(User, {through: 'Downvotes'});

// Sequelize associations
Subject.user = User.belongsToMany(Subject, {through: 'User_Subjects'});
User.subjects = Subject.belongsToMany(User, {through: 'User_Subjects'});
User.learningGoals = User.hasMany(LearningGoal);
User.articles = User.hasMany(Article);
// User.upvotes = User.hasMany(Upvote);
// User.downvotes = User.hasMany(Downvote);
Article.user = Article.belongsTo(User);
LearningGoal.learningUnits = LearningGoal.hasMany(LearningUnit);
LearningGoal.user = LearningGoal.belongsTo(User, {
    allowNull: false
});
LearningGoal.subject = LearningGoal.belongsTo(Subject, {
    allowNull: false
});
LearningGoal.comments = LearningGoal.hasMany(Comment, {
    allowNull: true
});
Comment.learningGoal = Comment.belongsTo(LearningGoal, {
    allowNull: false
});
User.comments = User.hasMany(Comment);
Comment.user = Comment.belongsTo(User);
LearningGoal.upvotes = LearningGoal.hasMany(Upvote, {
    allowNull: false
});
LearningGoal.downvotes = LearningGoal.hasMany(Downvote, {
    allowNull: false
});
Upvote.user = Upvote.belongsTo(User, {
    allowNull: false
});
Upvote.learningGoal = Upvote.belongsTo(LearningGoal, {
    allowNull: false
});
Downvote.user = Downvote.belongsTo(User, {
    allowNull: false
});
Downvote.learningGoal = Downvote.belongsTo(LearningGoal, {
    allowNull: false
});
LearningUnit.learningGoal = LearningUnit.belongsTo(LearningGoal, {
    allowNull: false
});
LearningUnit.resources = LearningUnit.hasMany(Resource);
Resource.belongsTo(LearningUnit, {
    allowNull: false
});
Subject.learningGoals = Subject.hasMany(LearningGoal);
Subject.articles = Subject.hasMany(Article);

(async () => {

    const subjects = await Subject.findAll();
    if (subjects.length === 0) {

    await Subject.bulkCreate([
        {
            name: 'ICT',
            description: 'Information and communications technology (ICT) is an extensional term for information technology (IT) that stresses the role of unified communications and the integration of telecommunications (telephone lines and wireless signals) and computers'
        },
        {
            name: 'Physics',
            description: 'The branch of science concerned with the nature and properties of matter and energy.'
        },
        {
            name: 'Biology',
            description: 'The study of living organisms, divided into many specialized fields that cover their morphology, physiology, anatomy, behaviour, origin, and distribution'
        },
        {
            name: 'Economics',
            description: 'Economics is a social science concerned with the production, distribution, and consumption of goods and services.'
        },
        {name: 'Languages', description: 'The principle method of human communication'},
        {name: 'Engineering', description: 'The subject of engineering.'},
        {name: 'Philosophy', description: 'The study of the fundamental nature of knowledge, reality, and existence.'},
        {name: 'History', description: 'The study of past events, particularly in human affairs.'},
        {
            name: 'Arithmetic',
            description: 'Arithmetic is an elementary part of number theory, and number theory is considered to be one of the top-level divisions of modern mathematics,'
        },
        {
            name: 'Literacy',
            description: 'Literacy is the ability to read, write, speak and listen in a way that lets us communicate effectively and make sense of the world.'
        },
        {
            name: 'Geography',
            description: 'the study of the physical features of the earth and its atmosphere, and of human activity as it affects and is affected by these, including the distribution of populations and resources and political and economic activities.'
        },
        {
            name: 'Psychology',
            description: 'The scientific study of the human mind and its functions, especially those affecting behaviour in a given context.'
        },
        {
            name: 'Design technology',
            description: 'Design technology, or D.T., is the study, design, development, application, implementation, support and management of computer and non-computer based technologies for the express purpose of communicating product design intent and constructability.'
        },
        {
            name: 'Chemistry',
            description: 'The branch of science concerned with the substances of which matter is composed, the investigation of their properties and reactions, and the use of such reactions to form new substances.'
        },
        {
            name: 'Astronomy',
            description: 'Astronomy is the study of the sun, moon, stars, planets and other objects and phenomena in space.'
        },
        {
            name: 'Ecology',
            description: 'The branch of biology that deals with the relations of organisms to one another and to their physical surroundings.'
        },
        {
            name: 'Sport science',
            description: 'Sport Science is a multi-disciplinary field concerned with the understanding and enhancement of human performance.'
        },
        {
            name: 'Nutrition',
            description: 'Nutrition is the study of nutrients in food, how the body uses them, and the relationship between diet and health.'
        },
        {
            name: 'Communication skills',
            description: 'Communication skills are the abilities you use when giving and receiving different kinds of information.'
        },
        {
            name: 'Mathematics',
            description: 'Mathematics includes the study of such topics as quantity (number theory), structure (algebra), space (geometry), and change (analysis). It has no generally accepted definition.'
        }
    ], );
    }

})();


