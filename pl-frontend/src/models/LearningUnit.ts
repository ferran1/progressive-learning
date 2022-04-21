import {Resource} from "./Resource";
import {LearningGoal, VisibilityModifier} from "./LearningGoal";

export class LearningUnit {

    title: string
    summary: {blocks: []}
    completed: boolean
    resources: Resource[]
    learningGoal: LearningGoal
    id?: number

    constructor(title: string, completed: boolean,
                summary: {blocks: []}, resources: Resource[], learningGoal: LearningGoal, id?: number) {
        this.title = title;
        this.summary = summary;
        this.completed = completed;
        this.resources = resources;
        this.learningGoal = learningGoal
        this.id = id;
    }

    public addResource(resource: Resource) {
        this.resources.push(resource);
    }

    public deleteResource(resource: Resource) {
        this.resources = this.resources.filter((r) => r.id != resource.id);
    }

    static constructFromJSON(json: {title: string, summary: {blocks: []}, completed: boolean,
        resources: Resource[], learningGoal: LearningGoal, id: number}) {
        return new LearningUnit(json.title, json.completed, json.summary, json.resources,
            json.learningGoal, json.id)
    }

}
