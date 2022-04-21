import * as React from "react";
import ArticleComponent from "../src/components/Article/ArticleComponent";
import {useContext, useEffect} from "react";
import { UserContext } from "../src/helpers/Context";
const fetcher = url => fetch(url, {credentials: "include"}).then(r => r.json())

function ArticlePage() {

    //Global user session-data
    const {currentUser, activeSession} = useContext(UserContext)

    return (
        <div>
            {currentUser && currentUser.id != null ? <ArticleComponent user={currentUser}/> : null}
        </div>
    )
}

export default ArticlePage
