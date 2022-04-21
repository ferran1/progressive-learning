import * as React from "react";
import Explore from "../src/components/Explore/Explore";
import { useContext, useEffect } from "react";

import { UserContext } from "../src/helpers/Context";
import useSWR from 'swr'
import { DEV_API_URL } from "../config";
import { Spin } from "antd";

const fetcher = url => fetch(url, { credentials: "include" }).then(r => r.json())

function ExplorePage() {

    const { data: user } = useSWR(`${DEV_API_URL}/authentication/session-token`, fetcher)
    const { data: subjects } = useSWR(`${DEV_API_URL}/subjects`, fetcher)
    const { currentUser, activeSession } = useContext(UserContext);

    const { data: learningGoals, error: learningGoals_err } = useSWR(`${DEV_API_URL}/learning-goals?visibility=PUBLIC`, fetcher)
    const { data: articlesAll, error: articles_err } = useSWR(`${DEV_API_URL}/articles`, fetcher)
    const { data: subjectsAll, error: subjects_err } = useSWR(`${DEV_API_URL}/subjects`, fetcher)

    if (learningGoals_err || articles_err || subjects_err) return <Spin size={"large"}>Failed to load</Spin>
    return (
        <div>
            {!subjectsAll && !learningGoals && !articlesAll &&
                <div>
                    <h1 className='center-screen'>Loading...</h1>
                    <Spin style={{ width: '100%' }} size={"large"}></Spin>
                </div>
            }

            {subjectsAll && learningGoals && articlesAll &&
                <Explore learningGoals={learningGoals} articles={articlesAll} subjects={subjectsAll} />
            }
        </div>
    )
}

export default ExplorePage
