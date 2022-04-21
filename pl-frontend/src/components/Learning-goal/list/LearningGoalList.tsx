import React from 'react';
import { LearningGoal } from "../../../models/LearningGoal";
import {List, Progress} from "antd";

type props = { learningGoalList: LearningGoal[], style?: object }

function LearningGoalList(props: props) {

    const list = props.learningGoalList.map(
        lg => <List.Item>{lg.goal}</List.Item>
    )

    return (
                <List style={props.style}
                      size={"large"}
                      bordered={true}
                      split={false}
                    dataSource={props.learningGoalList}
                    renderItem={item => (
                        <List.Item className={"lg-item"}>
                            <List.Item.Meta
                                title={<a href="">{item.goal}</a>}/>
                        <div className={"progress-bar"}>
                            <Progress percent={item.progress} size={"small"}/>
                        </div>
                        </List.Item>
                    )}/>
    );
}

export default LearningGoalList;
