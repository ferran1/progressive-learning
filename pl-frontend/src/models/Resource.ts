import {faPlusCircle} from "@fortawesome/free-solid-svg-icons/faPlusCircle";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as React from "react";
import {faBook, faImage, faNewspaper, faPager} from "@fortawesome/free-solid-svg-icons";
import {faGithub, faWikipediaW, faYoutube} from "@fortawesome/free-brands-svg-icons";

export enum ResourceTypes {
    Wikipedia = "Wikipedia",
    Youtube = "Youtube",
    Github = "Github",
    Book = "Book",
    ScientificPaper = "Scientific paper",
    Article = "Article",
    Image = "Image"
}


export class Resource {
    id?: number
    url: string
    type: ResourceTypes

    constructor(url: string, urlType: ResourceTypes, id?: number) {
        this.url = url;
        this.type = urlType;
        this.id = id;
    }

    static resourceTypeFromString(text: string) {
        let resourceType: ResourceTypes = ResourceTypes.Book
        switch (text) {
            case ResourceTypes.Article:
                resourceType = ResourceTypes.Article
                break;
            case ResourceTypes.Book:
                resourceType = ResourceTypes.Book;
                break;
            case ResourceTypes.Image:
                resourceType = ResourceTypes.Image;
                break;
            case ResourceTypes.ScientificPaper:
                resourceType = ResourceTypes.ScientificPaper;
                break;
            case ResourceTypes.Wikipedia:
                resourceType = ResourceTypes.Wikipedia;
                break;
            case ResourceTypes.Github:
                resourceType = ResourceTypes.Github;
                break;
            case ResourceTypes.Youtube:
                resourceType = ResourceTypes.Youtube;
                break;
        }
        return resourceType;
    }

}
