import React, {useEffect} from 'react';
import {LearningGoal} from "../../../models/LearningGoal";
import {Card, Checkbox, Col, Progress, Row, Tooltip} from "antd";
import Link from "next/link";

type learningGoalCardProps = {
    learningGoal: LearningGoal
    editable: boolean
}

function LearningGoalCard(props: learningGoalCardProps) {

    return (
        <Col span={8} xs={24} sm={24} md={12}>
            <Card className={"learning_goal-card pb-5"}
                  title={props.learningGoal.goal} bodyStyle={{padding: 0}}>

                <div className={"card-section"}>
                    <h3>Description</h3>
                    <p>{props.learningGoal.description}</p>
                </div>
                <div className={"card-section"}>
                    <h3>Learning-units</h3>
                    {props.learningGoal.learningUnits?.length > 0 ?
                        <div className={"learning_unit-list"}>
                            {props.learningGoal.learningUnits?.map(
                                (lu, index) =>
                                    <div key={index} className={"learning_unit-item d-flex flex-row"}>
                                        { props.editable ?
                                            <Link href={{
                                                pathname: "/learningunit/[id]",
                                                query: {id: lu?.id}
                                            }}>{lu.title}</Link> :
                                            <a href={"/explore/learning-unit?id=" + lu.id}>{lu.title}</a>
                                        }
                                        <Tooltip title={lu.completed ? "Completed" : "Incomplete"}>
                                            <Checkbox className={"float-right"} checked={lu.completed}/>
                                        </Tooltip>
                                    </div>
                            )}
                        </div> : <div className={"ml-15"}>No learning-units</div>}
                </div>
                <div className={"progress-section card-section"}>
                    <h3 className={"d-block mr-15"}>Progress</h3>
                    <Progress className={"ml-15 w-75"} strokeLinecap="square"
                              strokeWidth={15} percent={props.learningGoal.progress}/>
                </div>
                <div className={"card-section"}>
                    <h3>Visibility</h3>
                    <p>{props.learningGoal.visibility}</p>
                </div>
            </Card>
        </Col>
    );
}

export default LearningGoalCard;
