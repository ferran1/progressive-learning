import React from "react";
import {Col, List, Row, Typography} from "antd";
import {LearningGoal} from "../../../models/LearningGoal";

const {Text} = Typography;

type RecentLearningGoalsProps = { learningGoals: LearningGoal[] }

function RecentLearningGoals(props: RecentLearningGoalsProps) {

    return (
        <Row className={'section'}>
            <Col xs={24}>
                <div className="section-wrapper">
                    <Text type={'secondary'} className={'section-tag'}>Recent</Text>
                </div>
            </Col>
            <Col xs={24}>
                <List
                    itemLayout="horizontal"
                    dataSource={props.learningGoals}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                                title={<a href={'/explore/learning-goal?id=' + item.id}>{item.goal}</a>}
                                description={item.description}
                            />
                        </List.Item>
                    )}
                />
            </Col>
        </Row>
    )
}

export default RecentLearningGoals
