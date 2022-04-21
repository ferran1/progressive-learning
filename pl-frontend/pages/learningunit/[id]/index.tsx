import * as React from 'react';
import {useContext, useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Breadcrumb, Button, Checkbox, Col, Divider, List, message, Row, Spin} from "antd";
import {LearningUnit} from "../../../src/models/LearningUnit";
import {convertFromRaw, convertToRaw, EditorState, RichUtils} from 'draft-js';
import Editor from '@draft-js-plugins/editor'
import createToolbarPlugin from '@draft-js-plugins/static-toolbar'
import {
    BlockquoteButton, BoldButton, CodeButton, HeadlineOneButton, HeadlineTwoButton, HeadlineThreeButton,
    ItalicButton, OrderedListButton, UnderlineButton, UnorderedListButton
} from '@draft-js-plugins/buttons'
import useSWR from "swr";
import {DEV_API_URL} from "../../../config";
import LearningUnitProvider from "../../../src/providers/LearningUnitProvider";
import {UserContext} from "../../../src/helpers/Context";
import ResourceList from "../../../src/components/Resource/list/ResourceList";
import {Resource} from "../../../src/models/Resource";

const fetcher = url => fetch(url, {credentials: "include"}).then(r => r.json())

const staticToolbarPlugin = createToolbarPlugin()
const {Toolbar} = staticToolbarPlugin
const plugins = [staticToolbarPlugin];

const emptyContentState = convertFromRaw({
    entityMap: {},
    blocks: [
        {
            text: "",
            key: "foo",
            type: "styled",
            entityRanges: [],
        },
    ],
});

const editorPlaceholder = "Write a summary about this topic!";

function LearningUnitDetail(props) {

    const router = useRouter()
    const {id} = router.query

    const {currentUser, activeSession} = useContext(UserContext)
    const {data: learningUnitData} = useSWR(`${DEV_API_URL}/learningUnits/${id}`, fetcher)

    const [learningUnit, setLearningUnit] = useState<LearningUnit>()
    const [completed, setCompleted] = useState<boolean>(false);
    const [editorState, setEditorState] = useState<EditorState>(
        () => EditorState.createEmpty(),
    );
    const [saving, setSaving] = useState<boolean>(false);

    const learningUnitProvider = new LearningUnitProvider();

    useEffect(() => {
        console.log(learningUnitData)
        if (learningUnitData) {
            setLearningUnit(LearningUnit.constructFromJSON(learningUnitData));
            setCompleted(learningUnitData.completed);
            if (learningUnitData.summary) {
                const parsedSummary = JSON.parse(learningUnitData.summary);
                parsedSummary.blocks.length > 0 ?  setEditorState(EditorState.createWithContent(convertFromRaw(parsedSummary))) : null;
            }
        }
    }, [learningUnitData])

    const handleKeyCommand = (command, editorState) => {
        const newState = RichUtils.handleKeyCommand(editorState, command)
        if (newState) {
            setEditorState(newState)
            return "handled"
        }
        return "not-handled"
    }

    const onSave = () => {
        setSaving(true);
        console.log("Save clicked");
        learningUnit.summary = convertToRaw(editorState.getCurrentContent());
        learningUnitProvider.saveLearningUnit(learningUnit.id, learningUnit).then((r) => {
            if (r.status == 200) {
                message.success("Successfully updated learning-unit!");
                setLearningUnit(r.data);
                setSaving(false);
            } else {
                message.error(`Error: ${r.data}`);
                setSaving(false);
            }
        });
        console.log(learningUnit)
    }

    const onResourceAdded = (lu: LearningUnit) => {
        setSaving(true)
        learningUnit.resources = lu.resources;
        setSaving(false)
    }

    const onResourceDeleted = (resource: Resource) => {
        setSaving(true)
        learningUnit.deleteResource(resource);
        setSaving(false)
    }

    return (
        <Row className={"ml-10"}>
            {learningUnit &&
            <Breadcrumb>
                <Breadcrumb.Item>{learningUnit.learningGoal?.subject?.name}</Breadcrumb.Item>
                <Breadcrumb.Item>{learningUnit.learningGoal?.goal}</Breadcrumb.Item>
                <Breadcrumb.Item>{learningUnit.title}</Breadcrumb.Item>
            </Breadcrumb>
            }
            <Divider><h1>Learning-unit: {learningUnit?.title}</h1></Divider>
            {!learningUnit && <Spin size={"large"} className={"w-100"}/>}
            {learningUnit &&
            <Col span={14} xs={24} sm={24} md={14} className={"flex-row"}>
                <h2>Summary</h2>
                <div className={"editor"}>
                    <Editor
                        handleKeyCommand={handleKeyCommand}
                        editorState={editorState}
                        onChange={setEditorState}
                        plugins={plugins}
                        /*ref={(element) => {editorState = element}}*/
                        placeholder={editorPlaceholder}
                        style={{minHeight: "200px"}}
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
                </div>
            </Col>}
            {learningUnit &&
            <Col offset={1} xs={24} sm={24} md={7}>
                <ResourceList learningUnit={learningUnit}
                              onResourceAdded={onResourceAdded}
                              onResourceDeleted={onResourceDeleted}
                              loading={saving}
                />
            </Col>
            }
            <Col span={12}>
                <div className={"flex flex-column"}>
                    <Checkbox className={"d-block m-5"} checked={completed}
                              onChange={(e) => {
                                  setCompleted(e.target.checked);
                                  learningUnit.completed = e.target.checked;
                              }}>
                        Completed</Checkbox>
                    <Button type={"primary"} block size={"large"} onClick={onSave}
                            loading={saving}>Save</Button>
                </div>
            </Col>
        </Row>
    );
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


export default LearningUnitDetail;
