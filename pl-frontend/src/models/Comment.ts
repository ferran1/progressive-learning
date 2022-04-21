import {User} from "./User";

export class Comment {

    id?: number
    content: string
    learningGoalId: number
    user: User

    constructor(content: string, user: User, learningGoalId: number,
                id?: number) {
        this.id = id;
        this.content = content;
        this.user = user;
        this.learningGoalId = learningGoalId;
    }

}
