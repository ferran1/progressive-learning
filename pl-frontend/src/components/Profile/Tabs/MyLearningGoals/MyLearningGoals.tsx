import React from "react";
import {Alert, Button, Col, Divider, Row, Typography} from "antd";
import {LearningGoal} from "../../../../models/LearningGoal";

const {Text, Link} = Typography;

type LearningGoalProps = { learningGoals: LearningGoal[] }

function MyLearningGoals(props: LearningGoalProps) {
    let learningGoals = undefined;

    if (props.learningGoals != undefined) {
        learningGoals = props.learningGoals.map(
            learningGoal => <Row key={learningGoal.id}>
                <Col xs={24}>
                    <Link href={'/explore/learning-goal?id=' + learningGoal.id} className={'learning-goal-link'}>
                        {learningGoal.goal}
                    </Link>
                    <br/>
                    <Text>
                        {learningGoal.description}
                    </Text>
                </Col>

                <Divider/>
            </Row>
        )
    }

    return (
        <>
            {learningGoals != undefined &&
            learningGoals.length > 0 ? (
                learningGoals
            ) : (
                <Alert
                    message="No learning goals"
                    description="This user hasn't published any learning goals yet."
                    type="info"
                    action={
                        <Button type={'primary'} href={'/explore'} size="large">
                            Explore learning goals
                        </Button>
                    }
                    showIcon
                />
            )}
        </>
    )
}

export default MyLearningGoals
