import React from "react";
import {Alert, Button, Col, Divider, Row, Typography} from "antd";
import {Article} from "../../../../models/Article";

const {Text, Link} = Typography;

type ArticlesProps = { articles: Article[] }

function MyArticles(props: ArticlesProps) {

    let dateOptions = {year: 'numeric', month: 'long', day: 'numeric'};
    let timeOptions = {hour: '2-digit', minute: '2-digit', hour12: false};

    let articles;
    if (!props.articles.status) {
        articles = props.articles.map(
            article => <Row key={article.id}>
                <Col xs={24}>
                    <Link href={'explore/article?id=' + article.id} className={'article-link'}>
                        {article.title}
                    </Link>
                    <br/>
                    <Text>
                        {
                            new Date(article.createdAt).toLocaleDateString('en-US', dateOptions)
                            + " at " +
                            new Date(article.createdAt).toLocaleTimeString('en-US', timeOptions)
                        }
                    </Text>
                </Col>

                <Divider/>
            </Row>
        )
    }

    return (
        <>
            {articles != undefined && articles.length > 0 ? (
                articles
            ) : (
                <Alert
                    message="No articles"
                    description="This user hasn't published any articles yet."
                    type="info"
                    action={
                        <Button type={'primary'} href={'/explore'} size="large">
                            Explore articles
                        </Button>
                    }
                    showIcon
                />
            )}
        </>
    )
}

export default MyArticles
