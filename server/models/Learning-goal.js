const {DataTypes, Model} = require('sequelize');
const LearningUnit = require('./LearningUnit');
const sequelize = require('../config/database');

class LearningGoal extends Model {
    async updateProgress() {
        console.log('Updating progress..');
        let progressPercentage = 0;
        let completedLearningUnits = 0;
        let learningUnits = await LearningUnit.findAll({
            where: {
                learningGoalId: this.id
            }
        });
        // console.log(tasks);
        learningUnits.forEach(unit => {
            unit.completed ? completedLearningUnits++ : null;
        });
        if (learningUnits.length > 0) {
            progressPercentage = (100 / learningUnits.length) * completedLearningUnits;
            progressPercentage = Math.round((progressPercentage + Number.EPSILON) * 100 / 100);
        }
        this.progress = progressPercentage;
        console.log(this.progress);
        await this.save();
    }

    async updateLearningUnits(updatedLearningUnits) {
        for (let updatedLearningUnit of updatedLearningUnits) {
            if (!updatedLearningUnit.id) {
                const learningUnit = await LearningUnit.build({
                    title: updatedLearningUnit.title,
                    completed: updatedLearningUnit.completed,
                    learningGoalId: this.id
                });
                await learningUnit.save();
                console.log(learningUnit.toJSON());
            } else if (updatedLearningUnit.id) {
                let learningUnit = await LearningUnit.findByPk(updatedLearningUnit.id);
                learningUnit.title = updatedLearningUnit.title;
                learningUnit.completed = updatedLearningUnit.completed;
                await learningUnit.save();
            }
        }
    }
}

module.exports = LearningGoal.init({
    goal: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT({length: 'long'}),
    },
    progress: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0
    },
    visibility: {
        type: DataTypes.ENUM('PUBLIC', 'PRIVATE')
    }
}, {
    sequelize,
    modelName: 'learningGoal',
});
