const { DataTypes, Model } =  require('sequelize');
const sequelize = require('../config/database');

class Comment extends Model {}

module.exports = Comment.init({
    content: {
        type: DataTypes.STRING(500),
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'comment'
});


