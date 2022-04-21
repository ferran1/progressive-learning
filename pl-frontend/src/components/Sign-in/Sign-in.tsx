import {Row} from "antd";
import {Form, Input, Button, Checkbox, Divider, message} from 'antd';
import * as React from "react";
import {useContext, useEffect, useState} from "react";
import {DEFAULT_STEP_DATA, UserContext} from "../../helpers/Context";
import AuthProvider from "../../providers/AuthProvider";
import {useRouter} from "next/router";

const authProvider = new AuthProvider();

function SignIn() {

    const router = useRouter()
    const {setActiveSession, setCurrentUser} = useContext(UserContext)
    const [emailInputValue, setEmail] = useState('')
    const [passwordInputValue, setPassword] = useState('')

    let user = {email: emailInputValue, password: passwordInputValue}

    function handleLogin() {
        // Sign in and check if the user has successfully logged in
        authProvider.signIn(user).then((userData) => {
            console.log(userData)
            if (userData != null && userData.id) {
                setCurrentUser(userData)
                localStorage.setItem("gsdata", JSON.stringify(DEFAULT_STEP_DATA));
                setActiveSession(true)
                router.push("/dashboard")
            }

        });
    }

    return (
        <div>
            <Divider orientation={"center"}>Sign in</Divider>
            <Row className={'sign-in-row'} justify="center" style={{padding: '5%'}}>

                <Form
                    name="basic"
                    initialValues={{remember: true}}
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{required: true, message: 'Please fill in your email'}]}
                    >
                        <Input
                            onChange={event => setEmail(event.target.value)}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{required: true, message: 'Please fill in your password'}]}
                    >
                        <Input.Password
                            onChange={event => setPassword(event.target.value)}
                        />
                    </Form.Item>

                    <Form.Item name="remember" valuePropName="checked">
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" onClick={handleLogin}>
                            Sign in
                        </Button>
                    </Form.Item>

                    <Form.Item>
                        <p>Don't have an account yet? <a href="/sign-up">Sign up</a></p>
                    </Form.Item>
                </Form>
            </Row>
        </div>
    );
}

export default SignIn
