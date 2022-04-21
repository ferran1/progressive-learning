import { Spin } from "antd";
import * as React from "react";
import WrittenArticle from "../../src/components/Explore/article-detail/Article-Detail";
import articleProvider from "../../src/providers/ArticlesProvider"

const fetcher = url => fetch(url, { credentials: "include" }).then(r => r.json())

function WrittenArticlePage({ id }) {

    return (
        <WrittenArticle id={id} />
    )
}

WrittenArticlePage.getInitialProps = (appContext) => {
    return { id: appContext.query.id }
}

export default WrittenArticlePage
