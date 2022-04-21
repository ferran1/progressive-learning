const { DataTypes, Model } =  require('sequelize');
const sequelize = require('../config/database');

class Downvote extends Model {}

module.exports = Downvote.init({

}, {
    sequelize,
    modelName: 'downvote'
});


