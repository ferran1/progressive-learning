import React, {useEffect, useState} from 'react';
import {Button, Form, Input, Radio, Select} from "antd";
import {MinusCircleOutlined} from '@ant-design/icons';
import {LearningGoal, VisibilityModifier} from "../../../models/LearningGoal";
import {Subject} from "../../../models/Subject";
import {LearningUnit} from "../../../models/LearningUnit";
import LearningGoalProvider from "../../../providers/LearningGoalProvider";
import {User} from "../../../models/User";
import {useRouter} from "next/router";

type props = {
    subjects: Subject[],
    user: User
}

function LearningGoalCreate(props: props) {

    let learningGoalProvider = new LearningGoalProvider()
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const beforeunload = (e: any) => {
        e.preventDefault();
        e.returnValue = "Do you want to leave?";
    }

    useEffect(() => {
        window.addEventListener('beforeunload', beforeunload);
        return () => {
            window.removeEventListener('beforeunload', beforeunload);
        }
    })

    const onFinish = (values: any) => {
        setLoading(true);
        window.removeEventListener("beforeunload", beforeunload);
        const subject = props.subjects.find((sbj => sbj.id === values["subjectID"]))!
        const visibility: VisibilityModifier = values.visibility
        let learningGoal = new LearningGoal(values.goal, values.description, 0,
            values.learningUnits, subject, VisibilityModifier[visibility],
            props.user);
        console.log(learningGoal)
        learningGoalProvider.createLearningGoal(learningGoal).then(r => console.log(r))
        router.reload()
        setLoading(false);
    }

    const [form] = Form.useForm()
    const {Option} = Select

    return (
        <div style={{border: "1px", borderColor: "black"}}>
            <h1>Create learning-goal</h1>
            <Form form={form}
                  layout={"horizontal"} onFinish={onFinish}>
                <Form.Item name={"goal"} label={"Learning-goal"}
                           rules={[{required: true, message: 'Required Field'}]}>
                    <Input placeholder={"With this learning-goal I'd like to.."}/>
                </Form.Item>
                <Form.Item name="description" label={"Description"}>
                    <Input.TextArea placeholder={"Describe your learning-goal"} style={{minWidth: '300px'}}/>
                </Form.Item>
                <Form.List
                    name="learningUnits"
                    rules={[]}
                initialValue={[]}>
                    {(fields, {add, remove}) => (
                        <>
                            <div className={"learningUnit-list-section"}>
                            <h3>Learning-units</h3>
                            {fields.map((field, index) => (
                                    <Form.Item className={""} wrapperCol={{span: 24}}
                                               key={field.key}
                                               label={`${++index}`}>
                                        <Form.Item {...field}
                                                   rules={[{required: true, message: "Please enter a learning-unit topic!"}]}
                                                   name={[field.name, "title"]}
                                                   className={"w-75 d-inline-block"}
                                                   fieldKey={[field.name, "title"]}>
                                            <Input placeholder={"Enter the title of your learning-unit"}/>

                                        </Form.Item>
                                        <MinusCircleOutlined
                                            className={"ml-10"}
                                            onClick={() => remove(field.name)}/>
                                    </Form.Item>

                                )
                            )}
                            </div>
                            <Form.Item>
                                <Button
                                    type="dashed"
                                    onClick={() => add(new LearningUnit("",
                                        false, {blocks: []},
                                        [], {
                                            description: "",
                                            goal: "",
                                            learningUnits: [],
                                            progress: 0,
                                            subject: undefined,
                                            user: undefined,
                                            visibility: undefined
                                        }))}
                                    style={{width: '60%', float: 'right'}}>
                                    Add learning-unit
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
                <Form.Item name="visibility" label={"Visibility"} initialValue={VisibilityModifier.PRIVATE}>
                    <Radio.Group >
                        <Radio value={VisibilityModifier.PUBLIC} className={"d-block"}>
                            Public
                        </Radio>

                        <Radio value={VisibilityModifier.PRIVATE}>
                            Private
                        </Radio>
                    </Radio.Group>

                </Form.Item>
                <Form.Item name="subjectID" label={"Subject"} initialValue={props.subjects[0].id}>
                    <Select >
                        {props.subjects.map((sbj, index) =>
                            <Option key={index} value={sbj.id} >{sbj.name}</Option>
                        )}
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType={"submit"} block>
                        Create
                    </Button>
                </Form.Item>
            </Form>

        </div>

    );

}


export default LearningGoalCreate;
