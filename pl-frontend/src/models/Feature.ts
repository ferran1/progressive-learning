import {IconProp} from "@fortawesome/fontawesome-svg-core";

export class Feature {

    name: string;
    description: string;
    buttonLabel: string;
    buttonUrl: string;
    icon: IconProp;

    constructor(name: string, description: string, buttonLabel: string, buttonUrl: string, icon: IconProp) {
        this.name = name;
        this.description = description;
        this.buttonLabel = buttonLabel;
        this.buttonUrl = buttonUrl;
        this.icon = icon;
    }

}
