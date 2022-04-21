import * as React from "react";
import {useEffect, useState} from "react";
import {Button, Menu} from "antd";
import Sider from "antd/lib/layout/Sider";
import SubMenu from "antd/lib/menu/SubMenu";
import {Subject} from "../../../models/Subject";
import {LearningGoal} from "../../../models/LearningGoal";

type sidebarProps = {
    subjects: Subject[], onMenuItemSelected: any,
    onLearningGoalSelected: any, onCreateLearningGoalSelected: any
}

function DashboardSideBar(props: sidebarProps) {

    const KEY_ADD_SUBJECT = "ADD-SBJ";

    const [mounted, setMounted] = useState<boolean>(false)
    const [selectedItem, setSelectedItem] = useState(0)
    const [selectedLearningGoal, setSelectedLearningGoal] = useState(null)
    const [selectedKeys, setSelectedKeys] = useState<string[]>(['2'])

    useEffect(() => {
        setMounted(true);
        setSelectedItem(2);
        props.onMenuItemSelected(2)
    }, [mounted]);

    const allLearningGoals = () => {
        const lgArray: LearningGoal[] = []
        props.subjects.map((sbj) => {
            lgArray.push(...sbj.learningGoals)
        })
        return lgArray
    }

    return (
        <Sider width={"100%"} style={{backgroundColor: '#f0f2f5'}}>
            <Button type={"primary"} className={"mb-5"} block
                    onClick={() => {
                        props.onCreateLearningGoalSelected(KEY_ADD_SUBJECT)
                        setSelectedKeys([])
                    }}>Add subject</Button>
            <Menu
                mode={"vertical"}
                selectedKeys={selectedKeys}
                defaultSelectedKeys={['2']}
                theme="light"
                style={{height: '100%', borderRight: 0}}

                onSelect={(e) => {

                    if (e.key.toString().startsWith("lg-")) {
                        setSelectedKeys([e.key.toString()]);
                        const learningGoals: LearningGoal[] = allLearningGoals()
                        const learningGoalId: number = getIDFromKey(e.key.toString())

                        let learningGoal: any = learningGoals.find(
                            (lg: LearningGoal) => lg.id == learningGoalId)
                        learningGoal = LearningGoal.constructFromJSON(learningGoal)

                        setSelectedLearningGoal(learningGoal)
                        props.onLearningGoalSelected(learningGoal)
                    } else {
                        setSelectedKeys([e.key.toString()])
                        const key = e.key.toString()
                        setSelectedItem(parseInt(key))
                        props.onMenuItemSelected(e.key)
                    }
                }
                }

            >
                <Menu.Item key="1">Create new learning-goal</Menu.Item>
                <Menu.Divider/>
                <Menu.Item key="2">Overview</Menu.Item>
                <SubMenu key="3" title={"My subjects"}>
                    {props.subjects.length > 0 ?
                        props.subjects.map((subject, index) => {
                            return <SubMenu key={`sb-${subject.id}`} title={subject.name}>
                                <Menu.ItemGroup
                                    title={subject.learningGoals ? "Learning-goals" : "No learning-goals"}>
                                    {subject?.learningGoals?.map((lg, index) => {
                                        return <Menu.Item key={`lg-${lg.id}`}>
                                            {lg.goal}
                                        </Menu.Item>
                                    })}
                                </Menu.ItemGroup>

                            </SubMenu>
                        }) : null
                    }
                </SubMenu>
            </Menu>
        </Sider>
    )
}

// Extracts id from keys: lg-[id]/sb-[id] by splitting from -
function getIDFromKey(key: string): number {
    const id = key.toString().split("-")[1]
    return parseInt(id)
}

export default DashboardSideBar
