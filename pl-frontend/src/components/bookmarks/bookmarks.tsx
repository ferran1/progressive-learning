import { Avatar, List, Menu, Space } from "antd";
import React from "react";
import { MessageOutlined, LikeOutlined, StarOutlined } from '@ant-design/icons';


class Bookmarks extends React.Component {

    render() {

        const listData = [];
        for (let i = 0; i < 23; i++) {
            listData.push({
                href: 'https://ant.design',
                title: `Subject ${i}`,
                avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                description:
                    'Ant Design, a design language for background applications, is refined by Ant UED Team.',
                content:
                    'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
            });
        }

        const IconText = ({ icon, text }) => (
            <Space>
                {React.createElement(icon)}
                {text}
            </Space>
        );


        return (

            <div>


                {/* list div start */}
                <div className="center-screen">

                    <h1 style={{ fontSize: '28px' }}>Bookmarks</h1>
                    <Menu mode='horizontal'>
                        <Menu.Item>
                            bookmarks
                            </Menu.Item>
                        <Menu.Item>
                            history
                            </Menu.Item>
                    </Menu>


                    <List

                        itemLayout="vertical"
                        size="large"
                        pagination={{
                            onChange: page => {
                                console.log(page);
                            },
                            pageSize: 5,
                        }}
                        dataSource={listData}

                        renderItem={item => (
                            <List.Item
                                key={item.title}
                                actions={[
                                    <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
                                    <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
                                    <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
                                ]}

                            >
                                <h2>{item.title}</h2>
                                {item.content}
                            </List.Item>
                        )}
                    />

                </div>
            </div>
        );
    }
}

export default Bookmarks;