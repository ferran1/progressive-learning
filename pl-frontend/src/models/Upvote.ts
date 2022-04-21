export class Upvote {

    id?: number
    learningGoalId: number
    userId: number

    constructor(learningGoalId: number, userId: number,
                id?: number) {
        this.id = id;
        this.learningGoalId = learningGoalId;
        this.userId = userId;
    }

}
