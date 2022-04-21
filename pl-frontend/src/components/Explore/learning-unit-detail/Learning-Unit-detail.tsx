import React, { Suspense, useEffect, useState } from "react";
import LearningUnitProvider from '../../../providers/LearningUnitProvider';
import { Breadcrumb, Button, Col, Divider, List, Row, Spin } from "antd";
import Editor from '@draft-js-plugins/editor'
import { convertFromRaw, EditorState } from 'draft-js';
import { ResourceTypes } from "../../../models/Resource";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faBook, faImage, faNewspaper, faPager } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faWikipediaW, faYoutube } from "@fortawesome/free-brands-svg-icons";


let learningGoalProvider = new LearningUnitProvider()

let sources: any[] = [];

class LearningGoalDetail extends React.Component<any, any> {


    constructor(props: any) {
        super(props)
        this.state = { 
            learningUnit: '', 
            editorState: EditorState.createEmpty(), 
            sources: ''}
    }

    componentDidMount() {
        learningGoalProvider.getLearningUnit(this.props.id)
            .then(data => {
                this.setState({ learningUnit: data.data });
                this.setState({ sources: data.data.resources })
                const parsedSummary = JSON.parse(data.data.summary);
                parsedSummary.blocks.length > 0 ?
                    this.setState({ editorState: EditorState.createWithContent(convertFromRaw(parsedSummary)) })
                    : null;
            })
        
        //this.setState({editorstate: data.data})
    }


    getResourceIconFromType(type: ResourceTypes) {
        switch (type) {
            case ResourceTypes.Article:
                return <FontAwesomeIcon icon={faNewspaper} size={"lg"} />;
            case ResourceTypes.Book:
                return <FontAwesomeIcon icon={faBook} size={"lg"} />;
            case ResourceTypes.Image:
                return <FontAwesomeIcon icon={faImage} size={"lg"} />;
            case ResourceTypes.ScientificPaper:
                return <FontAwesomeIcon icon={faPager} size={"lg"} />;
            case ResourceTypes.Wikipedia:
                return <FontAwesomeIcon icon={faWikipediaW} size={"lg"} />;
            case ResourceTypes.Github:
                return <FontAwesomeIcon icon={faGithub} size={"lg"} />;
            case ResourceTypes.Youtube:
                return <FontAwesomeIcon icon={faYoutube} size={"lg"} />;
        }
    }

    render() {

        if (!this.state.learningUnit || this.state.sources == []) {
            return <Spin></Spin>
        }

        sources = this.state.sources

        return (


            <div>



                <Row className={"ml-10"}>
                    <Breadcrumb>
                        <Breadcrumb.Item>{this.state.learningUnit.learningGoal?.subject?.name}</Breadcrumb.Item>
                        <Breadcrumb.Item>{this.state.learningUnit.learningGoal?.goal}</Breadcrumb.Item>
                        <Breadcrumb.Item>{this.state.learningUnit.title}</Breadcrumb.Item>
                    </Breadcrumb>

                    <Divider><h1>{this.state.learningUnit.title}</h1></Divider>

                    <Col style={{backgroundColor: "white"}} span={14} xs={24} sm={24} md={14} className={"flex-row"} >

                        <Editor editorState={this.state.editorState} />
                        <div style={{ marginBottom: "3%", marginTop: "25%" }}>

                        </div>
                    </Col>

                    <Col offset={1} xs={24} sm={24} md={7}>
                        <h1>Sources</h1>
                        <List
                            dataSource={sources}
                            bordered={true}
                            renderItem={item => (
                                <List.Item style={{ wordBreak: "break-word", paddingRight: "10px" }}>
                                    <List.Item.Meta
                                        avatar={this.getResourceIconFromType(item.type)}
                                        title={<a href={item.url} target={"_blank"}>{item.url}</a>} />
                                </List.Item>
                            )}>
                        </List>
                    </Col>
                </Row>


            </div>
        )

    }

}

export default LearningGoalDetail
