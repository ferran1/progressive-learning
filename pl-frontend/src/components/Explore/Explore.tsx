import React, { Component, useState } from "react";
import "antd/dist/antd.css";
import { Avatar, Button, Card, Col, Divider, Dropdown, Input, Menu, Modal, Row, Select, Spin, Typography } from "antd";
import { LearningGoal, VisibilityModifier } from "../../models/LearningGoal";
import { Subject } from "../../models/Subject";
import Meta from "antd/lib/card/Meta";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Article } from "../../models/Article";
import Search from "antd/lib/input/Search";

import learingPorvider from "../../providers/LearningGoalProvider";
import articlePorvider from "../../providers/ArticlesProvider";
import subjectProvider from "../../providers/SubjectProvider";
import LearningGoalProvider from "../../providers/LearningGoalProvider";
import ArticlesProvider from "../../providers/ArticlesProvider";
import SubjectProvider from "../../providers/SubjectProvider";
import SearchBox from "./SearchBox/SearchBox";

const learningGoalProvider = new LearningGoalProvider();
const articlesProvider = new ArticlesProvider();
const subjectsProvider = new SubjectProvider();

library.add(fas);

const LG_CARDS_STYLE = { width: "430px", height: "170px", margin: "7px", borderColor: "grey", borderRadius: "4px" }
const ARTICLE_CARDS_STYLE = { width: "430px", height: "130px", margin: "7px", borderColor: "grey", borderRadius: "4px" }

const { Title, Text } = Typography;


interface ExploreProps {
    tabsToggle: boolean,
    subjectsButton: boolean,
    searchQuery: string,
    learningGoalsList: LearningGoal[],
    articlesList: Article[],
    subjects: Subject[],
}

class Explore extends Component<any, ExploreProps> {

    state = {
        tabsToggle: false,
        subjectsButton: false,
        searchQuery: '',
        learningGoalsList: [],
        articlesList: [],
        subjects: [],
    }

    copyOfAllLearningGoals: LearningGoal[] = [];
    copyOfAllArticles: Article[] = [];

    constructor(props: any) {
        super(props);
        this.filterCards = this.filterCards.bind(this);
    }

    componentDidMount() {
        this.setState({ learningGoalsList: this.props.learningGoals })
        this.setState({ articlesList: this.props.articles })
        this.setState({ subjects: this.props.subjects })

        this.copyOfAllArticles = this.props.articles;
        this.copyOfAllLearningGoals = this.props.learningGoals;
    }

    filterCards(subjectId: any) {
        if (!this.state.tabsToggle) {
            let lgs = this.copyOfAllLearningGoals;

            if (subjectId == "All") {
                this.setState({learningGoalsList: lgs})
            } else {
                let filteredLearningGoals = lgs.filter(function (learningGoal: LearningGoal) {
                    if (learningGoal.subject) {
                        return learningGoal.subject.id == subjectId;
                    }
                })
                this.setState({learningGoalsList: filteredLearningGoals})
            }
        } else {
            let articles = this.copyOfAllArticles;

            if (subjectId == "All") {
                this.setState({articlesList: articles})
            } else {
                let filteredArticles = articles.filter(function (article: Article) {
                    if (article.subjectId) {
                        return article.subjectId == subjectId;
                    }
                })
                this.setState({articlesList: filteredArticles})
            }
        }
    }


    render() {
        // populate subjects list
        const subjectMenuItems = this.state.subjects.map((subject: Subject, index) =>
            <Select.Option
                value={subject.id}
                key={index+1}>
                {subject.name}
            </Select.Option>
        )

        // ARTICLE CARDS Loop there are HTML elements in here
        let articlesCards = this.state.articlesList.filter((article: Article) => { //Filter for the searchbar
                if (this.state.searchQuery == "") {
                    return article
                } else if (article.title.toLowerCase().includes(this.state.searchQuery.toLowerCase())) {
                    return article
                }
            }).map((article: Article) =>
            <Col>
                <a href={"explore/article?id=" + article.id}>
                    <Card style={ARTICLE_CARDS_STYLE} hoverable><Meta
                        avatar={<Avatar src={article.user.profile_picture} />}
                        title={article.title}
                    />
                        <p>{article.user.first_name} {article.user.last_name}</p>
                        <p>{this.state.subjects.map((subject: Subject, idx) => {
                        })}</p>
                    </Card>
                </a>
            </Col>
        )

        // LEARNING GOAL Cards Loop there are HTML elements in here
            let lgoalsCards = this.state.learningGoalsList.filter((learningGoal: LearningGoal) => {
                if (this.state.searchQuery == "" && learningGoal.visibility == VisibilityModifier.PUBLIC) {
                    return learningGoal
                } else if (learningGoal.goal.toLowerCase().includes(this.state.searchQuery.toLowerCase()) && learningGoal.visibility == VisibilityModifier.PUBLIC) {
                    return learningGoal
                }
            }).map((learningGoal: LearningGoal) =>
            <Col>
                <a href={"/explore/learning-goal?id=" + learningGoal.id}>
                    <Card style={LG_CARDS_STYLE} hoverable>
                        <Meta
                            avatar={<Avatar src={learningGoal.user.profile_picture} />}
                            title={learningGoal.goal}
                        />
                        <p>{learningGoal.user.first_name} {learningGoal.user.last_name}</p>
                        <div className={"ant-card-actions"}>
                            <Row>
                                <Col xs={12} className={'mt-5'}>
                                    <FontAwesomeIcon icon={'caret-up'} className={'vote-icon mr-5'}
                                        size={'2x'} />
                                    <Text type={'secondary'} className={'vote-label'}>Upvote</Text><br />
                                    <Title type={'secondary'} className={'vote-label'}
                                        level={3}>{learningGoal.upvotes.length}</Title>
                                </Col>
                                <Col xs={12} className={'mt-5'}>
                                    <FontAwesomeIcon icon={'caret-down'} className={'vote-icon mr-5'}
                                        size={'2x'} />
                                    <Text type={'secondary'} className={'vote-label'}>Downvote</Text><br />
                                    <Title type={'secondary'} className={'vote-label'}
                                        level={3}>{learningGoal.downvotes.length}</Title>
                                </Col>
                            </Row>
                        </div>
                    </Card>
                </a>
            </Col>
        )


        return (
            <div>
                {/* START navbar */}
                <div className='center-screen' style={{ paddingLeft: '10%', paddingTop: '3px' }}>
                    <h1 style={{ paddingLeft: '1%', fontSize: '3em' }}>Explore</h1>
                    <Menu mode="horizontal">
                        <Menu.Item className="menuItem" onClick={() => {
                            this.setState({ tabsToggle: true })
                        }}><a>Articles</a></Menu.Item>
                        <Menu.Item className="menuItem" onClick={() => {
                            this.setState({ tabsToggle: false })
                        }}><a>Learning-goals</a></Menu.Item>

                    </Menu>
                </div>

                <div className='center-screen'>
                    <Row>

                        <Col>
                            <Select style={{ width: '150px', marginTop: '6px' }} showArrow={true}
                                onChange={this.filterCards}>
                                <Select.Option value={"All"} key={"0"}>All</Select.Option>
                                {subjectMenuItems}
                            </Select>
                        </Col>

                        <Col>
                            <SearchBox placeholder="Search.."
                                       handleChange={(e: any) => this.setState({searchQuery: e.target.value})}/>
                        </Col>

                    </Row>

                </div>

                {/* END navbar */}

                {/* START The cards are loaded in here */}

                <div className='center-screen'>

                    {this.state.tabsToggle ?
                        <div>
                            <h1>Articles</h1>
                            <Row>
                                {this.state.articlesList != [] ? <Row>{articlesCards}</Row> : <p>its empty</p>}
                            </Row>
                        </div>
                        :
                        <div>
                            <h1>Learning Goals</h1>

                            {this.state.learningGoalsList != [] ? <Row>{lgoalsCards}</Row> : <p>its empty</p>}

                        </div>
                    }
                </div>

                {/* END The cards are loaded in here */}

            </div>
        )
    }
}


export default Explore

