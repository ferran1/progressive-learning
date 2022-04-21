import axios from "axios";
import { DEV_API_URL } from "../../config";
import { LearningGoal } from "../models/LearningGoal";
import { Comment } from "../models/Comment";
import {Upvote} from "../models/Upvote";
import {Downvote} from "../models/Downvote";

export default class LearningGoalProvider {

    public async getAllLearningGoals() {
        try {
            const url = `${DEV_API_URL}/learning-goals?visibility=PUBLIC`
            const response = await axios(url)
            return response
        } catch (error) {
            return error
        }
    }

    // public async searchLearningGoals(search: string) {
    //     const url = `${DEV_API_URL}/learning-goals/search/${search}`
    //     const response = await axios(url)
    //     return response
    // }

    public async getLearningGoal(id: number) {
        const url = `${DEV_API_URL}/learning-goals/${id}`
        const response = await axios(url)
        return response
    }

    public async createLearningGoal(learningGoal: LearningGoal) {
        const url = `${DEV_API_URL}/learning-goals`
        const response = await axios.post(url, learningGoal)
        return response
    }

    public async updateLearningGoal(learningGoal: LearningGoal, id: number) {
        const url = `${DEV_API_URL}/learning-goals/${id}`
        const response = await axios.put(url, learningGoal)
        console.log(response)

        return response
    }

    public async deleteLearningGoal(id: number) {
        const url = `${DEV_API_URL}/learning-goals/${id}`
        const response = await axios.delete(url)
        console.log(response)
        return response
    }

    public async addCommentToLearningGoal(comment: Comment, id: number) {
        const url = `${DEV_API_URL}/learning-goals/${id}/comments`
        const response = await axios.post(url, comment, {
            withCredentials: true
        });
        console.log(response)
        return response
    }

    public async deleteCommentFromLearningGoal(comment: Comment, id: number) {
        const url = `${DEV_API_URL}/learning-goals/${id}/comments/${comment.id}`
        const response = await axios.delete(url, {
            withCredentials: true
        });
        console.log(response)
        return response
    }

    public async addUpvote(upvote: Upvote) {
        const url = `${DEV_API_URL}/learning-goals/${upvote.learningGoalId}/upvote`
        const response = await axios.post(url, upvote, {
            withCredentials: true
        });
        console.log(response)
        return response
    }

    public async addDownvote(downvote: Downvote) {
        const url = `${DEV_API_URL}/learning-goals/${downvote.learningGoalId}/downvote`
        const response = await axios.post(url, downvote, {
            withCredentials: true
        });
        console.log(response)
        return response
    }

}
