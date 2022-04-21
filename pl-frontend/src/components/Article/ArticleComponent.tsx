import React, { Component, useContext, useState } from "react";
import { Button, Col, Form, Input, Layout, Select, Spin } from "antd"
import TextArea from "antd/lib/input/TextArea";
import ArticlesProvider from '../../providers/ArticlesProvider'
import { UserContext } from "../../helpers/Context";
import { Subject } from "../../models/Subject";
import SubjectProvider from "../../providers/SubjectProvider"
import createToolbarPlugin from '@draft-js-plugins/static-toolbar'

import { convertFromRaw, convertToRaw, EditorState, RichUtils } from 'draft-js';
import Editor from '@draft-js-plugins/editor'
import {
    BlockquoteButton, BoldButton, CodeButton, HeadlineOneButton, HeadlineTwoButton, HeadlineThreeButton,
    ItalicButton, OrderedListButton, UnderlineButton, UnorderedListButton
} from '@draft-js-plugins/buttons'

const staticToolbarPlugin = createToolbarPlugin()
const { Toolbar } = staticToolbarPlugin
const plugins = [staticToolbarPlugin];
type MyProps = {};
const articlesProvider = new ArticlesProvider();
let subjectProvider = new SubjectProvider();

var subjects: Subject[] = []

interface ArticleComponentState {
    storyHeight: number,
    userId: string,
    subjectsState: Subject[],
    editorState: EditorState
}

class ArticleComponent extends React.Component<MyProps, ArticleComponentState> {

    static contextType = UserContext

    state: ArticleComponentState = {
        storyHeight: 46,
        userId: "",
        subjectsState: [],
        editorState: EditorState.createEmpty()
    };

    handleKeyCommand = (command, editorState) => {
        const newState = RichUtils.handleKeyCommand(editorState, command)
        if (newState) {
            this.setState({ editorState: newState })
            return "handled"
        }
        return "not-handled"
    }

    userId: any;

    constructor(props: any) {
        super(props);
        if (props.user != null) {
            this.userId = props.user.id
        }
    }

    setStoryHeight(value: number) {
        console.log(value)
        this.setState({
            storyHeight: value
        })
    }

    searchInput: any;

    componentDidMount() {

        subjectProvider.getAllSubjects().then((data) => {
            subjects = data

            this.setState({
                subjectsState: subjects
            })
        })
    }

    render() {

        if (subjects == []) {
            console.log("test");
            return (
                <div>
                    <h1 className='center-screen'>loading...</h1>
                    <Spin style={{ width: '100%' }} size={"large"}></Spin>
                </div>
            )
        }

        // populate subjects list
        const subjectMenuItems = subjects.map((subject, index) =>
            <Select.Option
                value={subject.id}
                key={index}>
                {subject.name}
            </Select.Option>
        )

        const onFinish = (values: any) => {

            if (this.userId != null) {
                let article = {
                    title: values.title,
                    content: convertToRaw(this.state.editorState.getCurrentContent()),
                    userId: this.userId,
                    subjectId: values.subject
                }
                console.log(article);
                articlesProvider.saveArticle(article);

            } else {
                return -1
            }
        }

        return (

            <Form name={"form"}
                layout={"horizontal"} onFinish={onFinish}>
                <div>

                    <div className='titleArea'>
                        <Form.Item name={"title"}
                            rules={[{ required: true, message: 'Required Field' }]}>
                            <TextArea ref={inputEl => (this.searchInput = inputEl)} rows={1} style={{ fontSize: '36px' }}
                                placeholder='Title' bordered={false}
                            >
                            </TextArea>
                        </Form.Item>
                    </div>

                    <div className='txtArea'>
                        <Form.Item name={"description"}
                            
                        >
                            <Editor
                                handleKeyCommand={this.handleKeyCommand}
                                editorState={this.state.editorState}
                                onChange={(state) => this.setState({ editorState: state })}
                                plugins={plugins}

                                /*ref={(element) => {editorState = element}}*/
                                placeholder={"Write your story here ..."}
                                style={{ minHeight: "200px" }}
                            />
                            <Toolbar>
                                {
                                    // may be use React.Fragment instead of div to improve perfomance after React 16
                                    (externalProps) => (
                                        <div>
                                            <BoldButton {...externalProps} />
                                            <ItalicButton {...externalProps} />
                                            <UnderlineButton {...externalProps} />
                                            <CodeButton {...externalProps} />
                                            {/*<Separator {...externalProps} />*/}
                                            <HeadlinesButton {...externalProps} />
                                            <UnorderedListButton {...externalProps} />
                                            <OrderedListButton {...externalProps} />
                                            <BlockquoteButton {...externalProps} />
                                        </div>
                                    )
                                }
                            </Toolbar>
                        </Form.Item>
                    </div>

                    <div className={'subjectSelect'}>
                        <Form.Item name={"subject"} label={"Subject of the article"}
                            rules={[{ required: true, message: 'Required Field' }]}
                        >

                            <Select style={{ width: '150px' }} showArrow={true}>
                                {subjectMenuItems}
                            </Select>
                        </Form.Item>
                    </div>

                    <Form.Item>
                        <Button className="addArticleButton" type="primary" htmlType={"submit"} block>
                            Submit article
                        </Button>
                    </Form.Item>
                </div>
            </Form >
        )
    }
}

class HeadlinesPicker extends React.Component {
    componentDidMount() {
        setTimeout(() => {
            window.addEventListener('click', this.onWindowClick);
        });
    }

    componentWillUnmount() {
        window.removeEventListener('click', this.onWindowClick);
    }

    onWindowClick = () =>
        // Call `onOverrideContent` again with `undefined`
        // so the toolbar can show its regular content again.
        this.props.onOverrideContent(undefined);

    render() {
        const buttons = [HeadlineOneButton, HeadlineTwoButton, HeadlineThreeButton];
        return (
            <div>
                {buttons.map((Button, i) => (
                    // eslint-disable-next-line
                    <Button key={i} {...this.props} />
                ))}
            </div>
        );
    }
}

class HeadlinesButton extends React.Component {
    onClick = () =>
        // A button can call `onOverrideContent` to replace the content
        // of the toolbar. This can be useful for displaying sub
        // menus or requesting additional information from the user.
        this.props.onOverrideContent(HeadlinesPicker);

    render() {
        return (
            <div className={"headlineButtonWrapper"}>
                <button onClick={this.onClick} className={"headlineButton"}>
                    H
                </button>
            </div>
        );
    }
}

export default ArticleComponent
