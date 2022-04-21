import React, {useContext, useEffect, useState} from 'react';
import {Button, Col, Form, Row, Typography} from "antd";
import {UserContext} from "../../../helpers/Context";
import {LearningGoal} from "../../../models/LearningGoal";
import {Comment} from "../../../models/Comment";
import LearningGoalProvider from "../../../providers/LearningGoalProvider";
import {fas} from "@fortawesome/free-solid-svg-icons";
import {library} from "@fortawesome/fontawesome-svg-core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Upvote} from "../../../models/Upvote";
import {Downvote} from "../../../models/Downvote";
import {User} from "../../../models/User";

library.add(fas);

const {Title, Text} = Typography;

interface voteProps {
    learningGoal: LearningGoal,
    upvotes: Upvote[],
    downvotes: Downvote[],
    upvoteAdded: (upvote: Upvote) => void,
    downvoteAdded: (downvote: Downvote) => void
}

function Vote(props: voteProps) {

    const learningGoalProvider = new LearningGoalProvider();
    const {currentUser, activeSession} = useContext(UserContext)
    const [isVoted, setIsVoted] = useState(false);
    const [isVotesChecked, setIsVotesChecked] = useState(false);

    const isVotedAlready = () => {
        if(isVotesChecked)
            return;

        setIsVotesChecked(true);

        let user: User = currentUser as unknown as User
        let isVotedAlready: boolean = false;

        props.upvotes.forEach(value => {
            if (value.userId === user.id) {
                isVotedAlready = true
            }
        })

        // Only start looking in downvotes if there was no vote found in upvotes
        if (!isVotedAlready)
            props.downvotes.forEach(value => {
                if (value.userId === user.id) {
                    isVotedAlready = true
                }
            })

        setIsVoted(isVotedAlready);

        return isVotedAlready
    }

    if(props.upvotes != undefined && props.downvotes != undefined && currentUser != undefined)
        isVotedAlready();

    const onUpvoteClick = () => {
        if (!isVotedAlready()) {
            setIsVoted(true);
            let upvote: Upvote = new Upvote(props.learningGoal.id!!, currentUser.id!!);
            learningGoalProvider.addUpvote(upvote).then((resp) => {
                upvote = resp.data;
                props.upvoteAdded(upvote);
            });
        }
    }

    const onDownvoteClick = () => {
        if (!isVotedAlready()) {
            setIsVoted(true);
            let downvote: Downvote = new Downvote(props.learningGoal.id!!, currentUser.id!!);
            learningGoalProvider.addDownvote(downvote).then((resp) => {
                downvote = resp.data;
                props.downvoteAdded(downvote);
            });
        }
    }

    return (
        <Row>
            {props.upvotes && props.downvotes &&
            <>
                <Col xs={12} className={'mt-5'}>
                    <Row>
                        <Col xs={12}>
                            <Row>
                                <Col>
                                    <FontAwesomeIcon icon={'caret-up'} className={'vote-icon-inline mr-5'} size={'2x'}/>
                                </Col>
                                <Col>
                                    <Text type={'secondary'} className={'vote-label-inline'}>Upvotes</Text><br/>
                                </Col>
                                <Col>
                                    <Title type={'secondary'} className={'ml-5 mb-0'}
                                           level={3}>{props.upvotes.length}</Title>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={{span: 4, offset: 4}} md={{span: 4, offset: 5}}>
                            <Button type="primary" onClick={() => onUpvoteClick()} disabled={isVoted}>Upvote</Button>
                        </Col>
                    </Row>
                </Col>
                <Col xs={12} className={'mt-5'}>
                    <Row>
                        <Col xs={12}>
                            <Row>
                                <Col>
                                    <FontAwesomeIcon icon={'caret-down'} className={'vote-icon-inline mr-5'}
                                                     size={'2x'}/>
                                </Col>
                                <Col>
                                    <Text type={'secondary'} className={'vote-label-inline'}>Downvotes</Text><br/>
                                </Col>
                                <Col>
                                    <Title type={'secondary'} className={'ml-5 mb-0'}
                                           level={3}>{props.downvotes.length}</Title>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={{span: 4, offset: 4}} md={{span: 4, offset: 5}}>
                            <Button type="primary" onClick={() => onDownvoteClick()} disabled={isVoted}>Downvote</Button>
                        </Col>
                    </Row>
                </Col>
            </>
            }
        </Row>
    );
}

export default Vote;
