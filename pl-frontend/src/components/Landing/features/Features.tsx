import React from "react";
import {Button, Card, Col} from "antd";
import {Feature} from "../../../models/Feature";
import {library} from "@fortawesome/fontawesome-svg-core";
import {far} from "@fortawesome/free-regular-svg-icons"
import {fas} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

library.add(far, fas);

type FeatureProps = { features: Feature[] }

function Features(props: FeatureProps) {
    const features = props.features.map(
        feature => <Col xs={24} lg={8} key={feature.name}>
            <Card bordered={true} style={{height: '100%'}}>
                <div className={'icon-wrapper'}>
                    <div className={'icon-container'}>
                        <FontAwesomeIcon icon={feature.icon} size={'lg'}/>
                    </div>
                </div>
                <h3>{feature.name}</h3>
                <p>{feature.description}</p>
                <Button type={"link"} href={feature.buttonUrl}>{feature.buttonLabel}</Button>
            </Card>
        </Col>
    )

    return (
        <>
            {features}
        </>
    )
}

export default Features
