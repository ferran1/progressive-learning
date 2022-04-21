import {Button, Checkbox, Divider, Form, Input, Row} from "antd";
import * as React from "react";
import {useContext, useState} from "react";
import AuthProvider from "../../providers/AuthProvider";
import {UserContext} from "../../helpers/Context";

const MIN_LENGTH_PASSWORD = 8;
const authProvider = new AuthProvider();

function SignUp() {

    const {setActiveSession, setCurrentUser} = useContext(UserContext)
    const [emailInputValue, setEmail] = useState('')
    const [passwordInputValue, setPassword] = useState('')
    const [firstNameInputValue, setFirstName] = useState('')
    const [lastNameInputValue, setLastName] = useState('')

    let user = {
        email: emailInputValue,
        password: passwordInputValue,
        first_name: firstNameInputValue,
        last_name: lastNameInputValue,
        admin: 0
    }

    async function handleSignUp() {
        await authProvider.signUp(user);
    }

    return (
        <div>
            <Divider orientation={"center"}>Sign up</Divider>
            <Row className={'sign-up-row'} justify="center" style={{padding: '5%'}}>

                <Form
                    name="basic"
                    initialValues={{remember: true}}
                >

                    <Form.Item className={"sign-in-ref"}>
                        <p>Already have an account? <a href="/sign-in">Sign in</a></p>
                    </Form.Item>

                    <Form.Item
                        label="First name"
                        name="first_name"
                        rules={[{required: true, message: 'Please fill in your first name'}]}
                    >
                        <Input onChange={event => setFirstName(event.target.value)}/>
                    </Form.Item>

                    <Form.Item
                        label="Last name"
                        name="last_name"
                        rules={[{required: true, message: 'Please fill in your last name'}]}
                    >
                        <Input onChange={event => setLastName(event.target.value)}/>
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Please fill in your email'
                            },
                            {
                                type: 'email',
                                message: 'Please input a valid e-mail address',
                            }
                        ]}
                    >
                        <Input onChange={event => setEmail(event.target.value)}/>
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please fill in your password'
                            },
                            {
                                min: MIN_LENGTH_PASSWORD,
                                message: `Please use at least ${MIN_LENGTH_PASSWORD} characters in your new password`
                            }
                        ]}
                    >
                        <Input.Password onChange={event => setPassword(event.target.value)}/>
                    </Form.Item>

                    <Form.Item
                        label="Confirm Password"
                        name="confirm-password"
                        rules={[
                            {
                                required: true,
                                message: 'Please confirm your password'
                            },
                            ({getFieldValue}) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The two passwords that you entered do not match'));
                                },
                            }),
                            {
                                min: MIN_LENGTH_PASSWORD,
                                message: `Please use at least ${MIN_LENGTH_PASSWORD} characters in your new password`
                            }
                        ]}
                    >
                        <Input.Password/>
                    </Form.Item>

                    <Form.Item name="tos" valuePropName="checked">
                        <Checkbox>I accept the Terms of Use & Privacy Policy.</Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" onClick={handleSignUp}>
                            Sign up
                        </Button>
                    </Form.Item>

                </Form>

            </Row>
        </div>
    );
}

export default SignUp
