import {LearningGoal} from "./LearningGoal";

export class Subject {

    name: string;
    description: string;
    id: number;
    learningGoals: LearningGoal[];

    constructor(name: string, description: string, learningGoals: LearningGoal[], id: number) {
        this.name = name;
        this.description = description;
        this.learningGoals = learningGoals;
        this.id = id;
    }


}
