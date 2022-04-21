export class FeaturedItem {

    name: string;
    imageLabel: string;
    imageUrl: string;

    constructor(name: string, buttonLabel: string, buttonUrl: string) {
        this.name = name;
        this.imageLabel = buttonLabel;
        this.imageUrl = buttonUrl;
    }

}
