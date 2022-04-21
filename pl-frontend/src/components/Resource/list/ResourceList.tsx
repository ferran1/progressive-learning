import React, {useState} from 'react';
import {Button, Form, Input, List, Modal, Select} from "antd";
import {LearningUnit} from "../../../models/LearningUnit";
import {Resource, ResourceTypes} from "../../../models/Resource";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBook, faImage, faNewspaper, faPager} from "@fortawesome/free-solid-svg-icons";
import {faGithub, faWikipediaW, faYoutube} from "@fortawesome/free-brands-svg-icons";
import LearningUnitProvider from "../../../providers/LearningUnitProvider";

type props = {
    learningUnit: LearningUnit,
    loading: boolean,
    onResourceAdded: any,
    onResourceDeleted: any
}
const {Option} = Select

function ResourceList(props: props) {

    const learningUnitProvider = new LearningUnitProvider();
    const [form] = Form.useForm()

    const [addResourceModalVisible, setAddModalVisible] = useState(false);
    const [mediaModalVisible, setMediaModalVisible] = useState(false);
    const [selectedMediaResource, setSelectedMediaResource] = useState<Resource>();
    const [loading, setLoading] = useState(false);

    const showAddResourceModal = () => {
        setAddModalVisible(true);
    }

    const showMediaModal = (resource: Resource) => {
        setSelectedMediaResource(resource);
        setMediaModalVisible(true);
    }

    const closeModal = () => {
        setAddModalVisible(false);
        setMediaModalVisible(false);
    }

    const addResource = () => {
        setLoading(true)
        console.log("Adding resource..", props.learningUnit)
        const values = form.getFieldsValue();
        const resource: Resource = new Resource(values.url, Resource.resourceTypeFromString(values.urlType))
        learningUnitProvider.addResourceToLU(props.learningUnit.id!!, resource)
            .then((r) => {
                props.learningUnit.resources = r.data
            });
        setTimeout(() => props.onResourceAdded(props.learningUnit));
        setAddModalVisible(false);
        setLoading(false);
        form.resetFields()
    }

    const deleteResource = (resource: any) => {
        setLoading(true)
        setTimeout(() => props.onResourceDeleted(resource));
        learningUnitProvider.deleteResource(resource.id);
        setLoading(false);
    }

    return (
        <div>
            <h3>Resources</h3>
            <List
                dataSource={props.learningUnit.resources}
                bordered={true}
                loading={loading}
                renderItem={item => (
                    <List.Item style={{wordBreak: "break-word", paddingRight: "10px"}}>
                        <List.Item.Meta
                            avatar={getResourceIconFromType(item.type)}
                            title={isMediaResource(item.type) &&
                            <a onClick={() => showMediaModal(item)}>{item.url}</a> ||
                            !isMediaResource(item.type) &&
                            <a href={item.url} target={"_blank"}>{item.url}</a>
                            }/>
                        <Button danger size={"small"} style={{marginLeft: "10px"}} shape={"round"}
                                onClick={() => deleteResource(item)}>
                            Delete</Button>
                    </List.Item>
                )}>
            </List>
            <Button type={"primary"} className={"mt-5"}
                    onClick={showAddResourceModal} ghost>Add resource</Button>
            <Modal title={`${selectedMediaResource?.type} resource`}
                   destroyOnClose={true}
                   visible={mediaModalVisible}
                   onCancel={closeModal}
                   onOk={closeModal}>
                {
                    selectedMediaResource?.type === ResourceTypes.Youtube &&
                    <iframe width={"100%"} height={"300"} src={selectedMediaResource.url}></iframe>
                }
                {selectedMediaResource?.type === ResourceTypes.Image &&
                    <img width={"100%"} src={selectedMediaResource.url}/>
                }
            </Modal>
            <Modal title={`Add URL resource to ${props.learningUnit.title}`}
                   destroyOnClose={true}
                   visible={addResourceModalVisible}
                   onCancel={closeModal}
                   onOk={() => form.submit()}>
                <Form form={form} onFinish={addResource}>
                    <Form.Item name={"url"} label={"URL"}>
                        <Input autoComplete={"off"}/>
                    </Form.Item>
                    <Form.Item name={"urlType"} label={"URL-type"}>
                        <Select>
                            {Object.keys(ResourceTypes).map((key, index) =>
                                <Option key={index} value={key}>{key}</Option>
                            )}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

function isMediaResource(type: ResourceTypes) {
    return type === ResourceTypes.Image ||  type === ResourceTypes.Youtube;
}

function getResourceIconFromType(type: ResourceTypes) {
    switch (type) {
        case ResourceTypes.Article:
            return <FontAwesomeIcon icon={faNewspaper} size={"lg"}/>;
        case ResourceTypes.Book:
            return <FontAwesomeIcon icon={faBook} size={"lg"}/>;
        case ResourceTypes.Image:
            return <FontAwesomeIcon icon={faImage} size={"lg"}/>;
        case ResourceTypes.ScientificPaper:
            return <FontAwesomeIcon icon={faPager} size={"lg"}/>;
        case ResourceTypes.Wikipedia:
            return <FontAwesomeIcon icon={faWikipediaW} size={"lg"}/>;
        case ResourceTypes.Github:
            return <FontAwesomeIcon icon={faGithub} size={"lg"}/>;
        case ResourceTypes.Youtube:
            return <FontAwesomeIcon icon={faYoutube} size={"lg"}/>;
    }
}

export default ResourceList;
