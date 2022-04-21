import type {AppProps} from 'next/app'
import 'antd/dist/antd.css';
import '../src/global.css';
import 'draft-js/dist/Draft.css'
import '../src/components/Header/Header.css';
import '../src/components/Landing/Landing.css';
import '../src/components/Profile/Profile.css';
import '../src/components/Profile-settings/ProfileSettings.css';
import '../src/components/Explore/Explore.css';
import '../src/components/Sign-in/Sign-in.css'
import '../src/components/Sign-up/Sign-up.css'
import '../src/components/Dashboard/Overview/Overview.css';
import '../src/components/Article/Article.css';
import '../src/components/Learning-goal/detail/LearningGoalDetail.css';
import '../src/components/Learning-goal/card/LearningGoalCard.css';
import '../src/components/Learning-goal/edit/LearningGoalEdit.css';
import '@draft-js-plugins/static-toolbar/lib/plugin.css';
import '../src/components/bookmarks/bookmarks.css';
import '../src/components/Explore/article-detail/Article-Detail'
import Header from '../src/components/Header/Header';
import Footer from '../src/components/Footer/Footer';
import {Layout} from 'antd';
import * as React from "react";
import Head from "next/head";
import {UserContext} from "../src/helpers/Context";
import {useEffect, useState} from "react";
import {DEV_API_URL} from "../config";
import useSWR from "swr";
import {useRouter} from "next/router";

const {Content} = Layout
const fetcher = url => fetch(url, {credentials: "include"}).then(r => r.json())

function ProgressiveLearningApp({Component, pageProps}: AppProps) {

    const [currentUser, setCurrentUser] = useState(null)
    const [activeSession, setActiveSession] = useState(false)
    const {data: user} = useSWR(`${DEV_API_URL}/authentication/session-token`, fetcher)

    useEffect(() => {
        if (user && user.id != null) {
            setCurrentUser(user);
            setActiveSession(true)
        } else {
            setCurrentUser(null)
            setActiveSession(false)
        }
    }, [user]);

    return (
        <UserContext.Provider value={{
            currentUser: currentUser,
            activeSession: activeSession,
            setActiveSession,
            setCurrentUser
        }}>
            <Layout>
                <Head>
                    <title>Progressive Learning</title>
                    {/* Set character encoding for the document */}
                    <meta charSet="utf-8"/>
                    {/* Viewport for responsive web design */}
                    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/>
                    <meta name="description"
                          content="Progressive learning is an educational and knowledge base platform for all"/>
                    {/*<link rel="icon" type="image/x-icon" href="https://example.com/favicon.ico" />*/}

                </Head>
                <div>
                    <Header/>
                    <Content className="main-container">
                        <Component {...pageProps} />
                    </Content>
                    <Footer/>
                </div>
            </Layout>
        </UserContext.Provider>
    )
}

export default ProgressiveLearningApp

