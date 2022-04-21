import * as React from "react";
import LearningGoalCard from '../../Learning-goal/card/LearningGoalCard';
import LearningGoalProvider from '../../../providers/LearningGoalProvider';
import {LearningGoal} from "../../../models/LearningGoal";
import {Avatar, Breadcrumb, Card, Checkbox, Col, Row, Spin, Tooltip, Progress, Typography} from "antd";
import CommentList from "../../Comment/list/CommentList";
import {Comment} from "../../../models/Comment";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Vote from "../vote/Vote";
import {Upvote} from "../../../models/Upvote";
import {Downvote} from "../../../models/Downvote";

const {Title, Text} = Typography;

let learningGoalProvider = new LearningGoalProvider()

interface learningGoalExploreProps {
    id: number
}

class LearningGoalExplore extends React.Component<learningGoalExploreProps, any> {

    id: number

    constructor(props: learningGoalExploreProps) {
        super(props)
        this.state = {learningGoal: LearningGoal}
        this.id = props.id
        this.addComment = this.addComment.bind(this)
        this.deleteComment = this.deleteComment.bind(this)
        this.addUpvote = this.addUpvote.bind(this)
        this.addDownvote = this.addDownvote.bind(this)
    }

    componentDidMount() {
        learningGoalProvider.getLearningGoal(this.id).then(data => {
            this.setState({learningGoal: LearningGoal.constructFromJSON(data.data)})
        })
    }

    /*
        componentDidUpdate() {
            console.log("Updating component..");
            learningGoalProvider.getLearningGoal(this.id).then(resp => {
                if(resp.data.comments && resp.data.comments.length > this.state.learningGoal.comments.length) {
                console.log("Updating learning-goal..");
                this.setState({learningGoal: LearningGoal.constructFromJSON(resp.data)});
                console.log(this.state.learningGoal);
                }
            });
        }
    */

    addComment(comment: Comment) {
        this.state.learningGoal.comments.push(comment)
    }

    deleteComment(comment: Comment) {
        let comments: [] = this.state.learningGoal.comments;
        this.state.learningGoal.comments = comments.filter((c: Comment) => c.id != comment.id)
    }

    addUpvote(upvote: Upvote) {
        this.state.learningGoal.upvotes.push(upvote)
        this.setState({learningGoal: this.state.learningGoal})
    }

    addDownvote(downvote: Downvote) {
        this.state.learningGoal.downvotes.push(downvote)
        this.setState({learningGoal: this.state.learningGoal})
    }

    render() {
        if (!this.state.learningGoal) {
            return <Spin style={{width: '100%'}} size={"large"}></Spin>
        } else return (
            <Row>
                <Col offset={2} xs={20} sm={20} md={18} lg={18}>
                    <Breadcrumb>
                        <Breadcrumb.Item>Explore</Breadcrumb.Item>
                        <Breadcrumb.Item>{this.state.learningGoal.goal}</Breadcrumb.Item>

                    </Breadcrumb>
                    <div>
                        <h1>Learning-goal</h1>
                        <LearningGoalCard editable={false} learningGoal={this.state.learningGoal}></LearningGoalCard>
                        {this.state.learningGoal.user &&
                        <div className={"mt-15"}>
                            <Avatar src={this.state.learningGoal.user.profile_picture}></Avatar>
                            <p className={"ml-10 d-inline"}>Created by <span style={{fontStyle: "italic"}}>
                                {`${this.state.learningGoal.user.first_name} ${this.state.learningGoal.user.last_name}`}</span>
                            </p>
                        </div>
                        }
                    </div>
                    <div>
                        <Vote learningGoal={this.state.learningGoal} upvotes={this.state.learningGoal.upvotes}
                              downvotes={this.state.learningGoal.downvotes}
                              upvoteAdded={this.addUpvote} downvoteAdded={this.addDownvote}/>
                    </div>
                    <div className={"mt-15"}>
                        <CommentList comments={this.state.learningGoal.comments}
                                     learningGoal={this.state.learningGoal}
                                     commentAdded={this.addComment}
                                     commentDeleted={this.deleteComment}/>

                    </div>
                </Col>
            </Row>
        )
    }
}

export default LearningGoalExplore


