import axios from 'axios'
import { DEV_API_URL } from "../../config";
import {LearningUnit} from "../models/LearningUnit";
import {Resource} from "../models/Resource";
import {message} from "antd";

export default class LearningUnitProvider {

    async deleteLearningUnit(id: number) {
        const url = `${ DEV_API_URL }/learningUnits/${id}`;
        const response = await axios.delete(url);
        return response;
    }

    async getLearningUnit(id: number) {
        const url = `${ DEV_API_URL }/learningUnits/${id}`;
        const response = await axios.get(url);
        return response;
    }

    async saveLearningUnit(id: number, learningUnit: LearningUnit) {
        const url = `${ DEV_API_URL }/learningUnits/${id}`;
        const response = await axios.put(url, learningUnit);
        return response;
    }

    async addResourceToLU(id: number, resource: Resource) {
        console.log(id);
        const url = `${ DEV_API_URL }/learningUnits/${id}/resources`;
        const response = await axios.post(url, resource);
        response.status == 200 ? message.success(`Successfully added resource to learning-unit`) :
            message.error(`Error: ${response.data}`);
        return response;
    }

    async deleteResource(id: number) {
        const url = `${ DEV_API_URL }/resources/${id}`;
        const response = await axios.delete(url);
        response.status == 204 ? message.success(`Successfully deleted resource from learning-unit`) :
            message.error(`Error: ${response.data}`);
        return response;
    }

}
