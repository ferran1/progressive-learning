import React, {useEffect} from 'react';
import {Button, Form, Input, Radio, Select} from "antd";
import {LearningUnit} from "../../../models/LearningUnit";
import {LearningGoal, VisibilityModifier} from "../../../models/LearningGoal";
import {Subject} from "../../../models/Subject";
import {MinusCircleOutlined} from '@ant-design/icons';
import LearningGoalProvider from "../../../providers/LearningGoalProvider";
import {useRouter} from "next/router";
import LearningUnitProvider from "../../../providers/LearningUnitProvider";

const { Option } = Select

type props = {
    subjects: Subject[]
    learningGoal: LearningGoal
}

function LearningGoalEdit(props: props) {

    const learningGoalProvider = new LearningGoalProvider()
    const learningUnitProvider = new LearningUnitProvider()

    const router = useRouter()
    const [form] = Form.useForm()

    let learningUnitIDsToDelete: any[] = []

    const beforeunload = (e:any) => {
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
        window.removeEventListener('beforeunload', beforeunload);
        learningUnitIDsToDelete.forEach((id) => {
            values.learningUnits = values.learningUnits.filter((lu: LearningUnit) => lu.id != id);
            learningUnitProvider.deleteLearningUnit(id);
        })
        console.log(values);
        learningGoalProvider.updateLearningGoal(values, props.learningGoal.id!!)
            .then((r) => {
                console.log(r)
                router.reload()
            });

    }

    const onLearningUnitDelete = (learningUnit: LearningUnit) => {
        console.log(`LearningUnit to delete: ${learningUnit.id}`)
        learningUnitIDsToDelete.push(learningUnit.id)
    }

    return (
        <div>
            <h1>Edit learning-goal</h1>
            <Form form={form}
                  layout={"horizontal"}
                  onFinish={onFinish}>

                <Form.Item name={"goal"} label={"Learning-goal"}
                           rules={[]} initialValue={props.learningGoal.goal}>
                    <Input value={props.learningGoal.goal} />
                </Form.Item>
                <Form.Item name="description" label={"Description"}
                           initialValue={props.learningGoal.description}>
                    <Input.TextArea value={props.learningGoal.description} />
                </Form.Item>
                <Form.List
                    name="learningUnits"
                    initialValue={props.learningGoal.learningUnits}
                    rules={[]}>
                    {(fields, {add, remove}) => (
                        <>
                        <div className={"learningUnit-list-section"}>
                            <h3>Learning-units</h3>
                        {fields.map((field, index) => (
                                    <Form.Item wrapperCol={{span: 24}}
                                               key={field.key}
                                               label={ `${++index}`}
                                               >
                                        <Form.Item {...field}
                                                   rules={[{required: true, message: "Please enter a learning-unit topic!"}]}
                                                   name={[field.name, "title"]}
                                                   className={"w-75 d-inline-block"}
                                                   fieldKey={[field.name, "title"]}>
                                            <Input placeholder={"Enter the title of your learning-unit"}/>

                                        </Form.Item>
                                        <MinusCircleOutlined
                                            className={"ml-10"}
                                            onClick={() => {
                                                const learningUnit = props.learningGoal.learningUnits[field.name]
                                                if (learningUnit) {
                                                    onLearningUnitDelete(learningUnit)
                                                    remove(field.name)
                                                } else remove(field.name)
                                            }}/>

                                    </Form.Item>
                            ))}
                            </div>
                            <Form.Item>
                                <Button
                                    type="dashed"
                                    onClick={() => add(new LearningUnit("",
                                        false, "",
                                        []))}
                                    style={{width: '60%', float: 'right'}}>
                                    Add learning-unit
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>

                <Form.Item name="visibility" label={"Visibility"} initialValue={props.learningGoal.visibility}>
                    <Radio.Group value={props.learningGoal.visibility}>
                        <Radio value={VisibilityModifier.PUBLIC} className={"d-block"}>
                            Public
                        </Radio>

                        <Radio value={VisibilityModifier.PRIVATE}>
                            Private
                        </Radio>
                    </Radio.Group>

                </Form.Item>
                <Form.Item name="subjectId" label={"Subject"} initialValue={props.learningGoal.subject.id}>
                    <Select >
                        {props.subjects.map((sbj, index) =>
                            <Option key={index} value={sbj.id}>{sbj.name}</Option>
                        )}
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType={"submit"} block>
                        Save
                    </Button>
                </Form.Item>
            </Form>

        </div>
    );
}

export default LearningGoalEdit;
