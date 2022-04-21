const {DataTypes, Model} = require('sequelize');
const sequelize = require('../config/database');

class LearningUnit extends Model {
}

module.exports = LearningUnit.init({
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    completed: {
        type: DataTypes.BOOLEAN,
    },
    summary: {
        type: DataTypes.JSON,
    }
}, {
    sequelize,
    modelName: 'learningunit'
});
