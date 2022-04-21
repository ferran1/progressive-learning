import React, {useContext, useEffect, useState} from 'react';
import {Button, Card, Col, Result, Row, Spin, Statistic, Steps} from "antd";
import {LearningGoal} from "../../../models/LearningGoal";
import LearningGoalCard from "../../Learning-goal/card/LearningGoalCard";
import useSWR from "swr";
import {UserContext} from "../../../helpers/Context";
import {DEV_API_URL} from "../../../../config";
import {INTRO_TEXT, LEARNING_GOAL_TEXT, LEARNING_UNIT_TEXT, SUBJECT_TEXT} from "../../../helpers/TextConstants";
import {Comment} from "../../../models/Comment";

const {Step} = Steps;
const fetcher = (url: string) => fetch(url, {credentials: "include"}).then(r => r.json());

type OverviewProps = {};

const GETTING_STARTED_KEY = "gsdata"
const steps = [
    {
        title: "Introduction", content: INTRO_TEXT, completed: false
    },

    {
        title: "Add subject", content: SUBJECT_TEXT, completed: false
    },

    {
        title: "Create learning-goal", content: LEARNING_GOAL_TEXT, completed: false
    },

    {
        title: "Create learning-unit", content: LEARNING_UNIT_TEXT, completed: false
    }
]

function Overview(props: OverviewProps) {

    const {currentUser, activeSession} = useContext(UserContext)
    const {data: userLearningGoalsData} = useSWR(currentUser ? `${DEV_API_URL}/users/${currentUser.id}/learning-goals` : null, fetcher)

    const [learningGoals, setLearningGoals] = useState<[]>([]);
    const [currentStep, setCurrentStep] = useState(0)

    useEffect(() => {
        let stepsData = localStorage.getItem(GETTING_STARTED_KEY)
        const convertedData = userLearningGoalsData?.map((json: any) => LearningGoal.constructFromJSON(json))
        setLearningGoals(convertedData);
        applyStepsData(JSON.parse(stepsData!!))
    }, [userLearningGoalsData])

    const applyStepsData = (data: any) => {
        let highestStep = 0;
        if (data) {
            isStepCompleted(data);
            data.map((step: any, index: number) => step.completed ? highestStep = index + 1 : null);
            setCurrentStep(highestStep)
        }
    }

    const isStepCompleted = (data: any) => {
        if (learningGoals && learningGoals.length > 0) {
            data[1].completed = true;
            data[2].completed = true;
            learningGoals.map((lg: LearningGoal) => lg.learningUnits.length > 0 ? data[3].completed = true : null);
            localStorage.setItem(GETTING_STARTED_KEY, JSON.stringify(data));
        }
    }

    const nextStep = () => {
        let nextStepVal = currentStep + 1;
        if (nextStepVal <= steps.length) {
            steps[0].completed = true;
            localStorage.setItem(GETTING_STARTED_KEY, JSON.stringify(steps));
            setCurrentStep(nextStepVal)
        }
    }

    const previousStep = () => {
        let prevStepVal = currentStep - 1;
        prevStepVal >= 0 ? setCurrentStep(prevStepVal) : null;
    }

    const commentsReceived = () => {
        let totalCommentsCount = 0;
        learningGoals.map((lg: LearningGoal) => {
            console.log(lg.comments);
            totalCommentsCount += lg.comments?.length!!;
        });
        console.log(totalCommentsCount)
        return totalCommentsCount;
    }

    const upvotesReceived = () => {
        let totalUpvotes = 0;
        learningGoals.map((lg: LearningGoal) => {
            totalUpvotes += lg.upvotes?.length!!;
        });
        return totalUpvotes
    }

    const downvotesReceived = () => {
        let totalUpvotes = 0;
        learningGoals.map((lg: LearningGoal) => {
            totalUpvotes += lg.downvotes?.length!!;
        });
        return totalUpvotes
    }

    return (
        <div>
            <Row gutter={3} className={"section mb-15"}>
                <Col span={20} sm={24} md={23} lg={18}>
                    <h2 className={"w-100"}>Getting started</h2>
                    <Steps current={currentStep}>
                        {steps.map((item, index) =>
                            <Step key={index} title={item.title}/>
                        )}
                    </Steps>
                </Col>
                {currentStep >= steps.length ?
                    <Col span={20}>
                        <div className="steps-content">
                            <Result status={"success"}
                                    title={"You've successfully finished the getting started guide!"}/>
                        </div>
                    </Col> : <Col span={20}>
                        <div className="steps-content">{steps[currentStep].content}</div>
                    </Col>}

                <div className={"w-100 mt-10"}>
                    <Button type={"primary"} onClick={nextStep} className={"mr-10"}>Next</Button>
                    {currentStep > 0 &&
                    <Button onClick={previousStep}>Previous</Button>
                    }
                </div>
            </Row>
            <h2 className={"w-100"}>Latest updates</h2>
            {learningGoals ?
            <Row gutter={3} className={"section"}>
                    <Col span={6}>
                        <Card>
                            <Statistic title={"Comments received"} value={commentsReceived()}/>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic title={"Upvotes received"} value={upvotesReceived()}/>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic title={"Downvotes received"} value={downvotesReceived()}/>
                        </Card>
                    </Col>
            </Row> : <p>No updates</p>}
            {learningGoals ?
                <Row gutter={[3, 15]} className={"learning_goal-section"}>
                    <h2 className={"w-100"}>Learning-goals</h2>
                    {
                        learningGoals.slice(0, 3).map(
                            (lg, index) => {
                                return (<LearningGoalCard key={index} editable={true} learningGoal={lg}/>)
                            }
                        )
                    }
                </Row> : <Spin size={"large"}/>}
        </div>
    );
}

export default Overview;
