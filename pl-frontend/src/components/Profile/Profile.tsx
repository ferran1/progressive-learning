import React from "react";
import {Alert, Button, Col, Divider, Row, Spin} from "antd";
import ProfileInfo from "./UserInfo/ProfileInfo";
import ProfileTabs from "./Tabs/ProfileTabs";
import ProfileSubjects from "./ProfileSubjects/ProfileSubjects";
import RecentLearningGoals from "./RecentLearningGoals/RecentLearningGoals";
import useSWR from "swr";
import {DEV_API_URL} from "../../../config";

const contentResponsivenessHorizontal = {xs: 0, sm: 0, md: 0, lg: 40}
const contentResponsivenessVertical = {xs: 16, sm: 16, md: 16, lg: 0}

type ProfileProps = { id: number }

const fetcher = url => fetch(url, {credentials: "include"}).then(r => r.json())

function Profile(props: ProfileProps) {

    const {data: user} = useSWR(`${DEV_API_URL}/users/${props.id}`, fetcher);
    const {data: learningGoals} = useSWR(`${DEV_API_URL}/users/${props.id}/learning-goals`, fetcher);
    const {data: subjects} = useSWR(`${DEV_API_URL}/users/${props.id}/subjects`, fetcher);
    const {data: articles} = useSWR(`${DEV_API_URL}/users/${props.id}/articles`, fetcher);

    return (
        <div className={'profile-page container'}>
            <Row gutter={[
                contentResponsivenessHorizontal,
                contentResponsivenessVertical
            ]}>
                <Divider orientation={"center"}><h1>Profile</h1></Divider>

                {user == null &&
                <Col xs={24}>
                    <Spin size={"large"}/>
                </Col>
                }

                {user && user.status != 404 &&
                <>
                    <Col xs={24} sm={6} className={'side-content'}>
                        <Row>
                            <Col xs={24} md={16}>
                                <img alt="profile image"
                                     className={'profile-image'}
                                     src={user.profile_picture}/>
                            </Col>
                        </Row>
                        {learningGoals && !learningGoals.status &&
                        <RecentLearningGoals learningGoals={learningGoals.slice(0, 3)}/>
                        }
                        {subjects && !subjects.status &&
                        <ProfileSubjects subjects={subjects.slice(0, 3)}/>
                        }
                    </Col>
                    <Col xs={24} sm={18}>
                        <ProfileInfo user={user}/>
                        {(learningGoals && !learningGoals.status) ||
                        (articles && !articles.status) ? (
                            <ProfileTabs learningGoals={learningGoals} articles={articles}/>
                        ) : ("")}
                    </Col>
                </>
                }
                {user != null && user.status == 404 &&
                <Col xs={24}>
                    <Alert
                        message="No profile found"
                        description="We couldn't find any profile connected to given id."
                        type="info"
                        action={
                            <Button type={'primary'} href={'/'} size="large">
                                Go back to the homepage
                            </Button>
                        }
                        showIcon
                    />
                </Col>
                }
            </Row>
        </div>
    )
}

export default Profile

