import React, {useContext} from "react";
import {Button, Col, Row, Space, Typography} from "antd";
import {fas} from "@fortawesome/free-solid-svg-icons";
import {library} from "@fortawesome/fontawesome-svg-core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {UserContext} from "../../../helpers/Context";

library.add(fas);
const {Text, Title} = Typography;

type ProfileProps = { user: any }

function ProfileInfo(props: ProfileProps) {

    const {currentUser, activeSession} = useContext(UserContext);
    let isSignedInUser = false;

    if (currentUser != null && currentUser.id == props.user.id) {
        isSignedInUser = true;
    }

    return (
        <Row>
            {isSignedInUser ? (
                <>
                    <Col xs={24} md={18}>
                        <Title level={2}>{props.user.first_name} {props.user.last_name}</Title>
                    </Col>
                    <Col xs={24} md={6}>
                        <Button type="primary" href={'/profile-settings'}
                                icon={<FontAwesomeIcon icon={'user-cog'} className={'mr-10'} size={'lg'}/>}>
                            Edit profile settings
                        </Button>
                    </Col>
                </>
            ) : (
                <Col xs={24}>
                    <Title level={2}>{props.user.first_name} {props.user.last_name}</Title>
                </Col>
            )}

            <Col xs={24}>
                <Space size={0} direction="vertical">
                    <Text type="secondary">Email address</Text>
                    <Title level={5}>{props.user.email}</Title>
                </Space>
            </Col>
            {
                props.user.about_me != null ? (
                    <Col xs={24}>
                        <Space size={0} direction="vertical">
                            <Text type="secondary">About me</Text>
                            <Title level={5} className={'about-me-block'}>{props.user.about_me}</Title>
                        </Space>
                    </Col>
                ) : ("")
            }
        </Row>
    )
}

export default ProfileInfo