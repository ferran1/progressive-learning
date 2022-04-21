import React, {useContext, useEffect, useState} from 'react';
import {Avatar, Button, Form, Input, List} from "antd";
import {UserContext} from "../../../helpers/Context";
import {LearningGoal} from "../../../models/LearningGoal";
import {Comment} from "../../../models/Comment";
import LearningGoalProvider from "../../../providers/LearningGoalProvider";
import {User} from "../../../models/User";

interface commentListProps {
    learningGoal: LearningGoal
    comments: Comment[]
    commentAdded: (comment: Comment) => void
    commentDeleted: (comment: Comment) => void
}

function CommentList(props: commentListProps) {

    const learningGoalProvider = new LearningGoalProvider();
    const {currentUser, activeSession} = useContext(UserContext)
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)

    const onCommentAdded = (values: any) => {
        setLoading(true);
        let comment: Comment = new Comment(values.content, currentUser as unknown as User, props.learningGoal.id!!);
        learningGoalProvider.addCommentToLearningGoal(comment, comment.learningGoalId)
            .then((resp) => {
                comment = resp.data;
                props.commentAdded(comment);
            }).finally(() => setLoading(false));
    }

    const deleteComment = (comment: Comment) => {
        setLoading(true);
        learningGoalProvider.deleteCommentFromLearningGoal(comment, props.learningGoal.id!)
            .then((resp) => {
                if (resp.status == 204) {
                    props.commentDeleted(comment)
                }
            }).finally(() => setLoading(false));
    }

    const isCommentOfCurrentUser = (comment: Comment) => {
        if (currentUser) {
            return comment.user.id === currentUser.id
        } else return false
    }

    return (
        <div>
            <h1>Comment section</h1>
            <Form form={form} onFinish={onCommentAdded}>
                <Form.Item name={"content"}
                           rules={[{max: 500, message: "Comment cannot be longer than 500 characters!"}]}>
                    <Input.TextArea placeholder={"Leave a comment about the learning-goal"}
                                    style={{minHeight: "100px", maxHeight: "100px"}}/>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType={"submit"} className={"float-right"}
                            loading={loading}>Add comment</Button>
                </Form.Item>
                <hr/>
                <List dataSource={props.learningGoal.comments}
                      loading={loading}
                      renderItem={(item) => {
                          const commentOfCurrentUser: boolean = isCommentOfCurrentUser(item);
                          const dateCreated = new Date(item.createdAt);
                          return <List.Item key={item.id}>
                              <List.Item.Meta avatar={
                                  <div><Avatar src={item.user.profile_picture}/></div>}
                                              title={<div>
                                                  <a>{`${item.user.first_name} ${item.user.last_name}`}</a>
                                                  {commentOfCurrentUser &&
                                                  <Button className={"float-right"} type={"text"}
                                                          onClick={() => deleteComment(item)}
                                                          size={"small"} danger>Delete</Button>}
                                                  <p className={"d-inline float-right"}>{
                                                      `${dateCreated.getDay()}-${dateCreated.getMonth()}-${dateCreated.getFullYear()}`
                                                  }</p>
                                              </div>}
                                              description={item.content}
                              />
                          </List.Item>
                      }}/>
            </Form>
        </div>
    );
}

export default CommentList;
