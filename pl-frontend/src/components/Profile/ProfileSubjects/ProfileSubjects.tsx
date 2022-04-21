import React from "react";
import {Col, List, Row, Typography} from "antd";
import {Subject} from "../../../models/Subject";

const {Text} = Typography;

type ProfileSubjectsProps = { subjects: Subject[] }

function ProfileSubjects(props: ProfileSubjectsProps) {

    return (
        <Row className={'section'}>
            <Col xs={24}>
                <div className="section-wrapper">
                    <Text type={'secondary'} className={'section-tag'}>Subjects</Text>
                </div>
            </Col>
            <Col xs={24} id={'my-subjects'}>
                <List
                    itemLayout="horizontal"
                    dataSource={props.subjects}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                                title={<a href="#">{item.name}</a>}
                                description={item.description}
                            />
                        </List.Item>
                    )}
                />
            </Col>
        </Row>
    )
}

export default ProfileSubjects
