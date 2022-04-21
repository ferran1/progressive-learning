import React, { useEffect, useState } from "react";
import useSWR from "swr";
import articleProvider from "../../../providers/ArticlesProvider";
import { Article } from "../../../models/Article"
import { DEV_API_URL } from "../../../../config";
import { Alert, Button, Spin } from "antd";
import Avatar from "antd/lib/avatar/avatar";
import { stat } from "node:fs";
import Editor from '@draft-js-plugins/editor'
import { convertFromRaw, EditorState } from 'draft-js';

var artProvider = new articleProvider()

class ArticleDetail extends React.Component<any, any> {
    id: number

    constructor(props: any) {
        super(props)
        this.id = props.id
        this.state = { article: '', editorState: EditorState.createEmpty() }
    }

    componentDidMount() {
        artProvider.getArticleById(this.id).then(data => {
            this.setState({ article: data.data });
            const parsedSummary = JSON.parse(data.data.content);
            parsedSummary.blocks.length > 0 ?
                this.setState({ editorState: EditorState.createWithContent(convertFromRaw(parsedSummary)) })
                : null;
        })
    }

    render() {

        if (!this.state.article) {

            return <Spin style={{ width: '100%' }} size={"large"}></Spin>

        } else
            return (
                <div>
                    <div>
                        <h1 className='titleArea'><Avatar
                            src={this.state.article.user.profile_picture}></Avatar> {this.state.article.user.first_name} {this.state.article.user.last_name}
                        </h1>

                        <div className='titleArea'>
                            <h1 style={{fontSize: "40px"}}>{this.state.article.title}</h1>
                        </div>
                        <div className='txtArea' style={{backgroundColor: "white", padding: "2%", borderRadius: "5px"}}>
                            <Editor editorState={this.state.editorState} />
                        </div>
                    </div>
                </div>
            )
    }
}


export default ArticleDetail
