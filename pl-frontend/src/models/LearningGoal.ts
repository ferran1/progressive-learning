import {LearningUnit} from "./LearningUnit";
import SubjectProvider from "../providers/SubjectProvider";
import {Subject} from "./Subject";
import {User} from "./User";
import { Comment } from "../models/Comment"
import {Upvote} from "./Upvote";
import {Downvote} from "./Downvote";

export enum VisibilityModifier {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE"
}

export class LearningGoal {

    id?: number
    comments?: Comment[]
    goal: string
    description: string
    progress: number
    learningUnits: LearningUnit[]
    subject: Subject
    user: User
    visibility: VisibilityModifier
    upvotes?: Upvote[]
    downvotes?: Downvote[]

    constructor(goal: string, description: string,
                progress: number, learningUnits: LearningUnit[], subject: Subject,
                visibility: VisibilityModifier, user: User, comments?: Comment[], upvotes?: Upvote[], downvotes?: Downvote[], id?: number) {

        this.id = id;
        this.goal = goal;
        this.description = description;
        this.progress = progress
        this.learningUnits = learningUnits
        this.subject = subject
        this.user = user
        this.visibility = visibility
        this.comments = comments
        this.upvotes = upvotes
        this.downvotes = downvotes
    }

    static constructFromJSON(json: {goal: string, description: string, progress: number,
        learningunits: any[], subject: any, visibility: any, user: any, comments: any[], upvotes: any[], downvotes: any[], id: number}) {
        json.learningunits = json.learningunits.map((lu: LearningUnit) =>
             new LearningUnit(lu.title, lu.completed, lu.summary, lu.resources, lu.learningGoal, lu.id)
        )
        // console.log(json)
        return new LearningGoal(json.goal, json.description, json.progress,
            json.learningunits, json.subject, json.visibility, json.user, json.comments, json.upvotes, json.downvotes, json.id)
    }

}
