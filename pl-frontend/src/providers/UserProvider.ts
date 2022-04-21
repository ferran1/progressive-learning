import {message} from "antd"
import axios, {AxiosResponse} from "axios";
import {User} from "../models/User";
import { DEV_API_URL } from "../../config";

const userEndpoint = `${ DEV_API_URL }/users`;

export default class UserProvider { 

    static isAllFieldsFilledIn(user: any) {
        return !(user.email == "" ||
            user.first_name == "" ||
            user.last_name == ""
        );
    }

    static isPasswordFieldsFilledIn(values: any) {
        return !(values.confirm_password == "" ||
            values.current_password == "" ||
            values.new_password == ""
        );
    }

    static async updateProfileSettings(user: any) {
        let profileSettingsUrl = `${userEndpoint}/${user.id}/settings`;

        if (!this.isAllFieldsFilledIn(user)) {
            message.error('Please complete the form in order to update your information');
            return
        }

        let res = await axios.put(profileSettingsUrl, user)
        let data = res.data;

        console.log(data);

        if (res.status == 200) {
            message.success(data.message)
        } else if (res.status == 400) {
            message.warning(data.message);
        } else {
            message.warning(data.message);
        }
    }

    static async updatePassword(values: any) {
        let passwordChangeUrl = `${userEndpoint}/${values.id}/password`;

        if (!this.isPasswordFieldsFilledIn(values)) {
            message.error('Please complete the form in order to update your password');
            return
        }

        return await axios.put(passwordChangeUrl, values);
    }

    static async getUserById(id: number): Promise<User> {

        let bearerToken = localStorage.getItem("token");

        let url = userEndpoint + "/" + id;

        let user = new User("", "", "", "", false, id);

        const config = {
            headers: {Authorization: `${bearerToken}`}
        };

        try {
            const response = await axios.get(url, config)
                .then(function (response: AxiosResponse) {

                    user = new User(response.data.id, response.data.email, "", response.data.first_name, response.data.last_name, false);
                    user.aboutMe = response.data.about_me;
                    user.profilePicture = response.data.profile_picture;
                })
                .catch(function (error: any) {
                    console.log(error);
                });
            console.log(response);
        } catch (error) {
            console.error(error);

        }
        console.log(user);
        return user;
    }


}


