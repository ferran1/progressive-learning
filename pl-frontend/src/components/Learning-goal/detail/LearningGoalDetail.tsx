import React, {useEffect, useState} from 'react';
import {LearningGoal, VisibilityModifier} from "../../../models/LearningGoal";
import {Breadcrumb, Button, Col, Spin} from "antd";
import LearningGoalCard from "../card/LearningGoalCard";
import LearningGoalProvider from "../../../providers/LearningGoalProvider";

type props = {
    learningGoalID: number
    onEdit: any
    onDelete: any
}

const EDIT_KEY = "EDIT-LG"
const DELETE_KEY = "DELETE-LG"

function LearningGoalDetail(props: props) {

    const learningGoalProvider = new LearningGoalProvider()

    const [learningGoal, setLearningGoal] = useState<LearningGoal>()

    useEffect(() => {
        learningGoalProvider.getLearningGoal(props.learningGoalID).then(
            (r) => {
                let lg = LearningGoal.constructFromJSON(r.data);
                setLearningGoal(lg)
            });
    }, [learningGoal])

    const onEdit = () => {
        props.onEdit(EDIT_KEY, learningGoal)
    }

    const onDelete = () => {
        props.onDelete(DELETE_KEY)
        learningGoal ?
            learningGoalProvider.deleteLearningGoal(learningGoal.id!!) : null
    }

    return (
        <Col span={24}>

            {learningGoal && <div className={"flex flex-column"}>
                <Breadcrumb>
                    <Breadcrumb.Item>{learningGoal.subject.name}</Breadcrumb.Item>
                    <Breadcrumb.Item>{learningGoal.goal}</Breadcrumb.Item>
                </Breadcrumb>
                <h1>Learning-goal</h1>
                <LearningGoalCard editable={true} learningGoal={learningGoal}/>

                <div className={"mt-15"}>
                    <Button type={"primary"} className={"sm-button edit-button"} onClick={onEdit}>Edit</Button>
                    <Button type={"primary"} danger className={"sm-button"} onClick={onDelete}>Delete</Button>
                </div>
            </div>}
            {!learningGoal && <Spin size={"large"}/>}
        </Col>
    );
}

export default LearningGoalDetail;
