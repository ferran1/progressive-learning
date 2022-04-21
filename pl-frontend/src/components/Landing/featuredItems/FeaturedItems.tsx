import React from "react";
import {Card, Col} from "antd";
import {FeaturedItem} from "../../../models/FeaturedItem";

type FeaturedItemProps = { featuredItems: FeaturedItem[] }

function FeaturedItems(props: FeaturedItemProps) {
    const featuredItems = props.featuredItems.map(
        featuredItem => <Col xs={24} lg={12} key={featuredItem.name}>
            <Card className='cover-inline' cover={
                <>
                    <img alt={featuredItem.imageLabel} src={featuredItem.imageUrl}/>
                    <h3 className={'featured-item-text'}>{featuredItem.name}</h3>
                </>
            }/>
        </Col>
    )

    return (
        <>
            {featuredItems}
        </>
    )
}

export default FeaturedItems