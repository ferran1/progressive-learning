import {message} from "antd"
import axios from "axios";
import router from "next/router";
import { DEV_API_URL } from "../../config";

const loginSuccessMessage = () => {
    message.loading({content: 'Logging in...', key});
    message.success({content: 'Logged in successfully!', key, duration: 2});
};

const loginUrl = `${ DEV_API_URL }/authentication/login`;
const logoutUrl = `${ DEV_API_URL }/authentication/logout`;
const signUpUrl = `${ DEV_API_URL }/authentication/sign-up`;
const key = 'updatable';

export default class AuthProvider {

    async isAllFieldsFilledIn(user: any) {
        return !(user.email == "" ||
            user.password == "" ||
            user.first_name == "" ||
            user.last_name == ""
        );
    }

    async signUp(user: any) {
        if (!this.isAllFieldsFilledIn(user)) {
            message.error('Please complete the form in order to sign up');
            return
        }

        let res = await axios.post(signUpUrl, user)
        let data = res.data;

        console.log(data);

        if (res.status == 201) {
            message.success("Successfully signed-up!")
            router.push("/sign-in")
        } else if (res.status == 400) {
            message.warning(data.message);
        } else {
            message.warning(data.message);
        }

    }

    async signIn(user: any): Promise<any> {

        let data = null

        try {
            const response = await axios.post(loginUrl, user, { withCredentials: true })
                .then(function (response: any) {
                    data = response.data

                    loginSuccessMessage();
                    return response
                })
                .catch(function (err: any) {
                    message.error(err.message);
                });
            console.log(response);
        } catch (error) {
            console.error(error);
        }
        return data;
    }

    async signOut(): Promise<boolean> {

        let loggedOut: boolean = false;

        try {
            await axios.post(logoutUrl, {}, { withCredentials: true })
                .then(function (response: any) {
                    console.log("Logged out successfully.");
                    console.log(response);
                    loggedOut = true;
                })
                .catch(function (error: any) {
                    console.log(error);
                });
        } catch (error) {
            console.error(error);
        }

        return loggedOut;
    }
}


