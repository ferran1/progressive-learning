import axios, {AxiosResponse} from "axios";
import router from "next/router";
import {message} from "antd"
import { DEV_API_URL } from "../../config";
import {Article} from "../models/Article";

const articlesURL = `${ DEV_API_URL }/articles`;

export default class ArticlesProvider {

    public async saveArticle(article: any) {

        try {
            const response = await axios.post(articlesURL, article)
                .then(function (res: AxiosResponse) {
                    console.log(res.statusText);
                    message.success("Article has successfully been added.", 2);

                    router.reload();
                })
                .catch(function (error: any) {
                    console.log(error);
                    message.error(error.message);
                });
            console.log(response);
        } catch (error) {
            message.error(error.message);
        }
    }

    public async getAllArticles(): Promise<Article[]> {

        let articles: Article[] = [];

        try {
            const response = await axios.get(articlesURL)
            articles = response.data
            return articles
        } catch (error) {
            return error
        }

    }

    public async getArticleById(id: number) {

        let url = articlesURL + "/" + id;
        const response = await axios.get(url)
        return response;

    }

}
