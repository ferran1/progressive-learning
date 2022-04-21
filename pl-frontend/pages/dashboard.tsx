import * as React from "react";
import {useContext, useEffect, useState} from "react";
import {Card, Col, Divider, List, Row, Spin} from "antd";
import {LearningGoal} from "../src/models/LearningGoal"
import {Subject} from "../src/models/Subject";
import Overview from "../src/components/Dashboard/overview/Overview";
import DashboardSideBar from "../src/components/Dashboard/sidebar/Dashboard-sidebar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlusCircle} from "@fortawesome/free-solid-svg-icons/faPlusCircle";
import LearningGoalDetail from "../src/components/Learning-goal/detail/LearningGoalDetail";
import LearningGoalCreate from "../src/components/Learning-goal/create/LearningGoalCreate";
import {DEV_API_URL} from "../config";
import {useRouter} from "next/router";
import useSWR from 'swr'

import {UserContext} from "../src/helpers/Context";
import LearningGoalEdit from "../src/components/Learning-goal/edit/LearningGoalEdit";
import {faMinusCircle} from "@fortawesome/free-solid-svg-icons";
import SubjectProvider from "../src/providers/SubjectProvider";

const KEY_ADD_SUBJECT = "ADD-SBJ";
const KEY_EDIT_LG = "EDIT-LG";
const KEY_DELETE_LG = "DELETE-LG";

const fetcher = url => fetch(url, {credentials: "include"}).then(r => r.json())

function Dashboard() {

    const {currentUser, activeSession} = useContext(UserContext)
    const router = useRouter()

    const subjectProvider = new SubjectProvider()

    const {data: allSubjectsData} = useSWR(`${DEV_API_URL}/subjects`, fetcher)
    const {data: userSubjectsData} = useSWR(() => `${DEV_API_URL}/users/${currentUser.id}/subjects`, fetcher)

    useEffect(() => {
        if (userSubjectsData) {
            setUserSubjects(userSubjectsData);
        }
        console.log(userSubjects);
    }, [userSubjectsData]);

    const [selectedTab, setSelectedTab] = useState(0);
    const [selectedLG, setSelectedLearningGoal] = useState(null);
    const [addSBJ, setAddSBJ] = useState(false);
    const [editLG, setEditLG] = useState(false);
    const [userSubjects, setUserSubjects] = useState([]);

    function displayContent(content: any, data?: any) {
        const isAllowedToSwitch = isSwitchingFromContent(content);
        isAllowedToSwitch ? resetAllContent() : null;

        if(isAllowedToSwitch) {
            if (content instanceof LearningGoal) {
                setSelectedLearningGoal(content);
            } else if (content === KEY_ADD_SUBJECT) {
                setAddSBJ(true);
            } else if (content === KEY_EDIT_LG) {
                console.log(data);
                setSelectedLearningGoal(data);
                setEditLG(true);
            } else if (content === KEY_DELETE_LG) {
                console.log(data);
                setSelectedLearningGoal(null);
                setEditLG(false);
                router.reload();
            } else if (content => 0)  {
                setSelectedTab(content);
            }
        }
    }

    return (

        <Row className="ml-10" gutter={[0, 10]}>
            <Divider orientation={"center"}><h1>Dashboard</h1></Divider>
            {userSubjects && currentUser &&
            <Col span={6} xs={24} sm={24} md={7} lg={4}>
                <DashboardSideBar
                    subjects={userSubjects}
                    onMenuItemSelected={displayContent}
                    onLearningGoalSelected={displayContent}
                    onCreateLearningGoalSelected={displayContent}
                />
            </Col>}


            {selectedTab == 1 &&
            <Col offset={1} span={16} xs={24} sm={24} md={12} lg={10}>
                <LearningGoalCreate subjects={userSubjects} user={currentUser}/>
            </Col>
            }


            {selectedTab == 2 && currentUser &&
            <Col offset={1} span={16} xs={24} sm={24} md={24} lg={19}>
                <Overview/>
            </Col>
            }


            {selectedLG && !editLG &&
            <Col offset={1} span={16} xs={24} sm={24} md={16} lg={10}>
                <LearningGoalDetail learningGoalID={selectedLG.id} onEdit={displayContent}
                                    onDelete={displayContent}/>
            </Col>
            }

            {editLG && selectedLG ?
                <Col offset={1} span={16} xs={24} sm={24} md={12} lg={10}>
                    <LearningGoalEdit learningGoal={selectedLG} subjects={userSubjectsData}/>
                </Col>
                : null
            }

            {addSBJ ?
                <Col offset={1} span={24} xs={24} sm={24} md={16}
                     style={{marginTop: "30px"}}>
                    <List
                        grid={{
                            gutter: 10,
                            xs: 1,
                            sm: 2,
                            md: 3,
                            lg: 3,
                            xl: 4,
                            xxl: 4
                        }}
                        dataSource={allSubjectsData} renderItem={
                        (item: Subject) => {
                            const addedSubject = userSubjects.find((sbj) => sbj.id == item.id)

                            return <List.Item>
                                <Card title={item.name} className="subject-item"
                                      bodyStyle={{height: "150px", overflowY: "auto"}}
                                      extra={addedSubject ?
                                          <a onClick={() => removeSubject(item.id)}>
                                              <FontAwesomeIcon icon={faMinusCircle} size={"lg"}
                                                               color={"red"}/>
                                          </a> : <a onClick={() => addSubject(item.id)}>
                                              <FontAwesomeIcon icon={faPlusCircle} size={"lg"}/>
                                          </a>}>
                                    <p>{item.description}</p>
                                </Card>
                            </List.Item>
                        }
                    }>
                    </List>
                </Col> : null
            }

            {!allSubjectsData && !currentUser &&
            <Col offset={12}>
                <Spin size={"large"}/>
            </Col>}

        </Row>

    )

    function resetAllContent() {
        console.log("Resetting all content")
        setSelectedTab(null)
        setSelectedLearningGoal(null)
        setAddSBJ(false)
        setEditLG(false)
    }

    function isSwitchingFromContent(content) {
        if (editLG === true || selectedTab == 1) {
            return window.confirm("Are you sure you want to leave this page? Unsaved changes will be deleted.")
        } else return true
    }

    function addSubject(subjectId: number) {
        let userId = currentUser.id;
        subjectProvider.addSubjectToUser(userId, subjectId);
        let addedSubject = allSubjectsData.find((sbj) => sbj.id == subjectId)
        const clonedArr = userSubjects.length > 0 ? [...userSubjects] : [];
        clonedArr.push(addedSubject);
        setUserSubjects(clonedArr);
    }

    function removeSubject(subjectId: number) {
        let userId = currentUser.id;
        subjectProvider.deleteSubjectFromUser(currentUser.id, subjectId)
        let removedSubject = userSubjects.find((sbj) => sbj.id == subjectId)
        const clonedArr = userSubjects.filter((sbj) => sbj.id != subjectId)
        setUserSubjects(clonedArr);
    }

}

export default Dashboard
