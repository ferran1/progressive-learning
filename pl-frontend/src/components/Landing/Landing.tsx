import React from "react";
import {Button, Col, Image, Row, Space, Typography} from "antd";
import {Feature} from "../../models/Feature";
import Features from "./features/Features";
import FeaturedItems from "./featuredItems/FeaturedItems";
import {FeaturedItem} from "../../models/FeaturedItem";

const {Text, Title} = Typography;

const features: Feature[] = [
    new Feature(
        "Learning goals",
        "Got things you want to achieve? Maybe being a successful programmer or something else? Either way, we can help you achieve your goals. Create and manage your learning goals today.",
        "Start now",
        "#",
        ['far', "newspaper"]
    ),
    new Feature(
        "Articles",
        "Good ideas surrounding you. Read and share new knowledge about anything with the world",
        "Start now",
        "#",
        ['fas', "globe-europe"]
    ),
    new Feature(
        "Community",
        "With users from all of the world we all can help you achieve your goals. Take a look at the published articles & learning goals to get inspiration from others.",
        "Start now",
        "#",
        ['fas', "users"]
    ),
];

const featuredItems: FeaturedItem[] = [
    new FeaturedItem(
        "One structure for your goals",
        "An image of a person following a structure to achieve their goal",
        "https://images.pexels.com/photos/5946167/pexels-photo-5946167.jpeg?cs=srgb&dl=pexels-sajith-ranatunga-5946167.jpg&fm=jpg"
    ),
    new FeaturedItem(
        "Access to knowledge from around the world",
        "An image of a book collection representing shared knowledge from people around the world",
        "https://images.pexels.com/photos/1517355/pexels-photo-1517355.jpeg?cs=srgb&dl=pexels-nubia-navarro-%28nubikini%29-1517355.jpg&fm=jpg"
    ),
];

function Landing() {
    // Gutter spacing
    const spotlightHorizontal = {xs: 0, sm: 0, md: 0, lg: 100}
    const spotlightVertical = {xs: 16, sm: 16, md: 16, lg: 0}
    const featuresVertical = 30;
    const featuresChildHorizontal = {xs: 0, lg: 16}
    const featuresChildVertical = {xs: 8, sm: 8, md: 8, lg: 0}
    const featuredItemsHorizontal = {xs: 0, lg: 32}
    const featuredItemsVertical = {xs: 8, sm: 8, md: 8, lg: 0}
    const featuredContainer = 60;

    return (
        <div className={'landing container'}>
            <Row id={'spotlight'}
                 gutter={[
                     spotlightHorizontal,
                     spotlightVertical
                 ]}
                 align="middle">
                <Col xs={24} lg={12}>
                    <Row>
                        <Col xs={24}>
                            <Title>One place to manage & share your knowledge </Title>
                        </Col>
                        <Col xs={24}>
                            <h3>
                                It can be difficult for you to remember and retrieve all kinds of concepts, theories,
                                and information in general, but don't worry we got you covered. We provide you one place
                                to manage all your information through learning goals.
                            </h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24}>
                            <Space size={20}>
                                <Col xs={24} md={10} lg={8}>
                                    <Button type="primary" href={'/sign-in'} block>
                                        Start Today
                                    </Button>
                                </Col>
                                <Col xs={24} md={10} lg={8}>
                                    <Button block>
                                        Learn More
                                    </Button>
                                </Col>
                            </Space>
                        </Col>
                    </Row>
                </Col>
                <Col xs={24} lg={12}>
                    <Image
                        preview={false}
                        src={'https://images.pexels.com/photos/6408402/pexels-photo-6408402.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'}
                    />
                </Col>
            </Row>
            <Row id={'features'}
                 gutter={[
                     0,
                     featuresVertical
                 ]}>
                <Col xs={24}>
                    <Row>
                        <Col xs={24}>
                            <Text type={'secondary'} className={'section-tag'}>Our features</Text>
                        </Col>
                        <Col xs={24}>
                            <Title level={2}>What we provide</Title>
                        </Col>
                        <Col xs={24}>
                            <Text type={'secondary'}>We help you build up your knowledge through learning goals,
                                articles and our community!</Text>
                        </Col>
                    </Row>
                </Col>
                <Col xs={24}>
                    <Row gutter={[
                        featuresChildHorizontal,
                        featuresChildVertical
                    ]}>
                        <Features features={features}/>
                    </Row>
                </Col>
            </Row>
            <Row id={'featured-items'}
                 gutter={[
                     0,
                     featuredContainer
                 ]}>
                <Col xs={24}>
                    <Row>
                        <Col xs={24}>
                            <Text type={'secondary'} className={'section-tag'}>Our services</Text>
                        </Col>
                        <Col xs={24}>
                            <Title level={2}>What we give</Title>
                        </Col>
                        <Col xs={24}>
                            <Text type={'secondary'}>We help you achieve your learning goal by giving you access to our
                                users' knowledge from around the world. Next to that, we also provide you a structure
                                that should allow you to easily organize your work.</Text>
                        </Col>
                    </Row>
                </Col>
                <Col xs={24}>
                    <Row gutter={[
                        featuredItemsHorizontal,
                        featuredItemsVertical
                    ]}>
                        <FeaturedItems featuredItems={featuredItems}/>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

export default Landing

