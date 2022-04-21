import * as React from "react";
import {useContext, useEffect} from "react";
import Profile from "../src/components/Profile/Profile";
import {UserContext} from "../src/helpers/Context";

function ProfilePage({id}) {

    //Global user session-data
    const {currentUser, activeSession} = useContext(UserContext);

    useEffect(() => {
    }, []);

    return (
        <Profile id={id}/>
    )
}

ProfilePage.getInitialProps = (appContext) => {
    return {id: appContext.query.id}
}

export default ProfilePage
