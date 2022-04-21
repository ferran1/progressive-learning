import axios, {AxiosResponse} from "axios";
import {message} from "antd"
import {Subject} from "../models/Subject";
import { DEV_API_URL } from "../../config";

const SUBJECTS_ROUTE = `${ DEV_API_URL }/subjects`;
const USERS_ROUTE = `${ DEV_API_URL }/users`;

export default class SubjectProvider {

    public async getAllSubjects(): Promise<Subject[]> {

        let subjects: Subject[] = [];

        try {
            const response = await axios.get(SUBJECTS_ROUTE)
            subjects = response.data
        } catch (error) {
            return error
        }

        return subjects;
    }

    public async addSubjectToUser(userId: string, subjectId: number): Promise<Subject> {

        let subjectIdBody = {subjectId: subjectId}
        let subject = new Subject("", "", [], 0);


        try {
            await axios.post(`${USERS_ROUTE}/${userId}/subjects`, subjectIdBody, { withCredentials: true })
                .then(function (response: any) {
                    // console.log(response.data);
                    subject = response.data;
                    if (response.status == 201) {
                        message.success({content: 'The subject has successfully been added to your account.'});
                    }
                })
                .catch(function (error: any) {
                    console.log(error);
                    message.error({content: 'Error: Failed to add the subject to your account.'});
                });
        } catch (error) {
            console.error(error);
        }

        return subject;
    }

    public async deleteSubjectFromUser(userId: number, subjectId: number) {
        try {
            await axios.delete(`${USERS_ROUTE}/${userId}/subjects/${subjectId}`, {withCredentials: true})
                .then(function (response: any) {
                    if (response.status == 200) {
                        message.success({content: 'The subject has successfully been removed from your account.'});
                    }
                })
        } catch (e) {
            console.log(e)
            message.error({content: "Error: Failed to remove subject from your account."})
        }
    }

}
