import React from "react";
import {Col, Row, Tabs} from "antd";
import MyLearningGoals from "./MyLearningGoals/MyLearningGoals";
import {LearningGoal} from "../../../models/LearningGoal";
import MyArticles from "./MyArticles/MyArticles";
import {Article} from "../../../models/Article";

const {TabPane} = Tabs;

type ProfileTabsProps = { learningGoals: LearningGoal[], articles: Article[] }

function ProfileTabs(props: ProfileTabsProps) {
    
    return (
        <Row>
            <Col xs={24}>
                <Tabs defaultActiveKey="1">
                    <TabPane
                        tab={
                            <span>My learning goals</span>
                        }
                        key="1">
                        <MyLearningGoals learningGoals={props.learningGoals}/>
                    </TabPane>
                    <TabPane
                        tab={
                            <span>My articles</span>
                        }
                        key="2">
                        <MyArticles articles={props.articles}/>
                    </TabPane>
                </Tabs>
            </Col>
        </Row>
    )
}

export default ProfileTabs
