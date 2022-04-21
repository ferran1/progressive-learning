import {Col, Menu, Row} from "antd";

import * as React from "react";
import {useState} from "react";

type DashboardProps = { style?: object, onChange: any };

function DashboardMenu(props: DashboardProps) {

    const [selectedTab, setSelectedTab] = useState(0)

    return (
        <Row style={props.style}>
            <Col span={24}>
                <Menu theme="light" mode="horizontal"
                      onSelect={(e) => {
                          setSelectedTab(e.key)
                          props.onChange(e.key)
                      }}
                >
                    <Menu.Item key={1}> Overview </Menu.Item>
                    <Menu.Item key={2}> Subjects </Menu.Item>
                    <Menu.Item key={3}> Learning goals </Menu.Item>
                </Menu>
            </Col>
        </Row>
    )
}


export default DashboardMenu
