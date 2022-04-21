export class Article {

    id: number
    title: string
    content: string
    userId: number
    subjectId: number

    constructor(id: number, title: string, content: string, userId: number, subjectId: number) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.userId = userId;
        this.subjectId = subjectId;
    }

}

