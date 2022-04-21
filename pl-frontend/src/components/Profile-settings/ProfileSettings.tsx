import React, {useContext, useEffect, useState} from "react";
import {Alert, Button, Divider, Form, Input, message, Typography} from "antd";
import {Content} from "antd/lib/layout/layout";
import {User} from "../../models/User";
import userProvider from '../../providers/UserProvider'
import {UserContext} from "../../helpers/Context";

const {Text, Title} = Typography;

const user = new User('', '', '', "", false);

const minimumLengthPassword = 8;
const maximumLengthAboutMe = 280;

const layout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16},
};
const tailLayout = {
    wrapperCol: {offset: 8, span: 16},
};

const fileToDataUri = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
        resolve(event.target.result)
    };
    reader.readAsDataURL(file);
})

function ProfileSettings() {

    const {currentUser, activeSession} = useContext(UserContext)
    const [passwordForm] = Form.useForm();
    const [profileForm] = Form.useForm();
    const [showUpdatedMsg, setShowUpdatedMsg] = useState(false);
    const [isTouched, setIsTouched] = useState(false);
    const [isFormInitialized, setIsFormInitialized] = useState(false);

    const beforeunload = (e:any) => {
        e.preventDefault();
        if(isTouched)
            e.returnValue = "Do you want to leave?";
    }

    useEffect(() => {
        console.log(profileForm.getFieldsValue());
        if (currentUser != null && !isFormInitialized) {
            console.log('test');
            profileForm.setFieldsValue({
                first_name: currentUser.first_name,
                last_name: currentUser.last_name,
                email: currentUser.email,
                about_me: currentUser.about_me
            })
            setIsFormInitialized(true);
        }

        window.addEventListener('beforeunload', beforeunload);
        return () => {
            window.removeEventListener('beforeunload', beforeunload);
        }
    })

    const onFieldsChange = () => {
        setIsTouched(true);
    }

    const onChange = (event) => {
        let file = event.nativeEvent.target.files[0];

        console.log(file);

        if (!file) {
            return;
        }

        fileToDataUri(file)
            .then(dataUri => {
                let blob: String = dataUri;
                user.profilePicture = blob
            })
    }

    const onFinishInformation = (values: any) => {
        setIsTouched(false);
        user.id = currentUser.id;
        user.firstName = values.first_name;
        user.lastName = values.last_name;
        user.email = values.email;
        user.aboutMe = values.about_me;

        userProvider.updateProfileSettings(user);
        setShowUpdatedMsg(true);
        profileForm.setFieldsValue({
            first_name: user.firstName,
            last_name: user.lastName,
            email: user.email,
            about_me: user.aboutMe
        })
        window.removeEventListener('beforeunload', beforeunload);
    };

    const onFinishPassword = (values: any) => {
        setIsTouched(false);
        values.id = currentUser.id;
        userProvider.updatePassword(values).then(value => {
            message.success("Your password is successfully updated");
            passwordForm.resetFields();
        }).catch(reason => {
            message.error(reason.response.data.message);
        }).then(value => {
            console.log(value);
        });
        window.removeEventListener('beforeunload', beforeunload);
    };

    const onFinishFailed = () => {
        message.error('Please complete the form in order to update your information.');
    };

    return (
        <Content className="profile-settings container">
            <div className={'content-container'}>
                <Title level={3}>Profile settings</Title>
                <Text>
                    Edit your profile settings on this page to make sure the information is up-to-date.
                </Text>

                <Divider/>

                {currentUser != null &&
                    <div id={'profile-updated-msg'} className={(showUpdatedMsg ? 'visible' : 'invisible')}>
                    <Alert
                        message="Profile updated"
                        description="Your profile's information is updated. Check the recent changes on your profile."
                        type="success"
                        action={
                            <Button type={'primary'} href={'/profile?id=' + currentUser.id} size="large">
                                Go to my profile
                            </Button>
                        }
                        showIcon
                    />

                    <br/>
                    </div>
                }

                <Form
                    {...layout}
                    form={profileForm}
                    name="basic"
                    initialValues={
                        {
                            remember: true,
                            first_name: user.firstName,
                            last_name: user.lastName,
                            email: user.email,
                            about_me: user.aboutMe
                        }
                    }
                    onFieldsChange={onFieldsChange}
                    onFinish={onFinishInformation}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        label="First name"
                        name="first_name"
                        rules={[{required: true, message: 'Please input your first name'}]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        label="Last name"
                        name="last_name"
                        rules={[{required: true, message: 'Please input your last name'}]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        label="E-mail address"
                        name="email"
                        rules={[
                            {
                                type: 'email',
                                message: 'Please input a valid e-mail address',
                            },
                            {
                                required: true,
                                message: 'Please input a valid e-mail address',
                            },
                        ]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        label="About me"
                        name="about_me"
                        rules={[{
                            max: maximumLengthAboutMe,
                            message: `Please don't use more than ${maximumLengthAboutMe} characters`
                        }]}
                    >
                        <Input.TextArea/>
                    </Form.Item>

                    <Form.Item label="Profile picture">
                        <Form.Item name="profile_picture" noStyle>
                            <input name="avatar" type="file" onChange={onChange}/>
                        </Form.Item>
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">
                            Update profile information
                        </Button>
                    </Form.Item>
                </Form>

                <Divider/>

                <Form
                    {...layout}
                    form={passwordForm}
                    name="basic"
                    onFieldsChange={onFieldsChange}
                    onFinish={onFinishPassword}
                    onFinishFailed={onFinishFailed}
                    id={'form-2'}
                >

                    <Form.Item
                        label="Current password"
                        name="current_password"
                        rules={[{required: true, message: 'Please input your current password!'}]}
                    >
                        <Input.Password/>
                    </Form.Item>

                    <Form.Item
                        label="New password"
                        name="new_password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your new password'
                            }, {
                                min: minimumLengthPassword,
                                message: `Please use at least ${minimumLengthPassword} characters in your new password`
                            }
                        ]}
                    >
                        <Input.Password/>
                    </Form.Item>

                    <Form.Item
                        label="Confirm new password"
                        name="confirm_password"
                        rules={
                            [
                                {required: true, message: 'Please confirm your new password'},
                                ({getFieldValue}) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('new_password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('The two passwords you entered do not match'));
                                    },
                                }),
                                {
                                    min: minimumLengthPassword,
                                    message: `Please use at least ${minimumLengthPassword} characters in your new password`
                                }
                            ]}
                    >
                        <Input.Password/>
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">
                            Update password settings
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </Content>
    );
}

export default ProfileSettings

