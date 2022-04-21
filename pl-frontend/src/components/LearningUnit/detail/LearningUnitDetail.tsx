import React from 'react';
import {LearningUnit} from "../../../models/LearningUnit";
import {Divider, Row} from "antd";

type props = {
    learningUnit: LearningUnit
}

function LearningUnitDetail(props: props) {

    return (
        <Row >
            <Divider><h1>{props.learningUnit.title}</h1></Divider>

        </Row>
    );
}

export default LearningUnitDetail;
