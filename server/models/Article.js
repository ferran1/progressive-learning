const { DataTypes, Model } =  require('sequelize');
const sequelize = require('../config/database');

class Article extends Model {}

module.exports = Article.init({
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.JSON,
        allowNull: true
    },
}, {
    sequelize,
    modelName: 'article'
});


