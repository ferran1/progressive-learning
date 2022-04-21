import React, {useContext, useEffect, useState} from "react";
import "antd/dist/antd.css";
import {useRouter} from 'next/router';
import {Row, Col, Button, Drawer} from 'antd';
import AuthProvider from '../../providers/AuthProvider'
import {UserContext} from "../../helpers/Context";
import {Anchor} from 'antd'

const {Link} = Anchor

const title = 'Progressive Learning';
const authProvider = new AuthProvider()

function HeaderSection() {

    const {currentUser, activeSession, setCurrentUser, setActiveSession} = useContext(UserContext);
    const [visible, setVisible] = useState(false);
    const [loggedIn, setLoggedIn] = useState(activeSession)

    useEffect(() => setLoggedIn(activeSession));

    const showDrawer = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };

    const router = useRouter()

    function handleLogout() {
        setCurrentUser(null);
        setActiveSession(false);
        setLoggedIn(false);
        authProvider.signOut().then((isLoggedOut: boolean) =>
            isLoggedOut ? router.push("/sign-in") : null);
    }

    return (
        <div>
            <div className="container-fluid">
                <div className="header">
                    <div>
                        <Row>
                            <Col>
                                <a href={"/"}>
                                    <img className="header-img" src={"/upward-icon.png"}
                                         alt={"Progressive learning icon"}
                                         height={35} width={35}/>
                                </a>
                            </Col>

                            <Col style={{paddingLeft: "1.5em"}}>
                                <a href={"/"}><h1 className={"headerTitle"}>{title}</h1></a>
                            </Col>
                        </Row>
                    </div>
                    <div className="mobileHidden">
                        {loggedIn ? <Anchor>
                                <Link href="/" title="Home"/>
                                <Link href="/explore" title="Explore"/>
                                <Link href="/dashboard" title="Dashboard"/>
                                <Link href="/article" title="Article"/>
                                <Link href={`/profile?id=${currentUser?.id}`} title="Profile"/>
                                <a style={{paddingLeft: "3em"}}/>
                                <a onClick={handleLogout}>Logout</a>
                            </Anchor>
                            :

                            <Anchor>
                                <Link href="/" title="Home"/>
                                <Link href="/about" title="About"/>
                                <Link href="/explore" title="Explore"/>
                                <Link href="/how-it-works" title="How it works"/>
                                <Link href="/contact" title="Contact"/>
                                <a style={{paddingLeft: "3em"}}/>
                                <Link href="/sign-up" title='Sign Up'/>
                                <Link href="/sign-in" title="Sign In"/>
                            </Anchor>
                        }
                    </div>
                    <div className="mobileVisible">
                        <Button type="primary" onClick={showDrawer}>
                            <i className="fas fa-bars"/>
                        </Button>
                        <Drawer
                            placement="right"
                            closable={false}
                            onClose={onClose}
                            visible={visible}
                        >
                            {loggedIn ? <Anchor>
                                    <Link href="/" title="Home"/>
                                    <Link href="/dashboard" title="Dashboard"/>
                                    <Link href="/explore" title="Explore"/>
                                    <Link href="/article" title="Article"/>
                                    <Link href="/about" title="About"/>
                                    <Link href="/how-it-works" title="How it works"/>
                                    <Link href="/" title="Contact"/>
                                </Anchor> :
                                <Anchor>
                                    <Link href="/" title="Home"/>
                                    <Link href="/about" title="About"/>
                                    <Link href="/explore" title="Explore"/>
                                    <Link href="/how-it-works" title="How it works"/>
                                    <Link href="/sign-up" title='Sign Up'/>
                                    <Link href="/sign-in" title="Sign In"/>
                                    <Link href="/" title="Contact"/>
                                </Anchor>}
                        </Drawer>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeaderSection
