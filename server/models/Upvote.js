const { DataTypes, Model } =  require('sequelize');
const sequelize = require('../config/database');

class Upvote extends Model {}

module.exports = Upvote.init({


}, {
    sequelize,
    modelName: 'upvote'
});


