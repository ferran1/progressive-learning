import * as React from "react";
import ProfileSettings from "../src/components/Profile-settings/ProfileSettings";
import {useContext, useEffect} from "react";
import { UserContext } from "../src/helpers/Context";

function ProfileSettingsPage() {

    //Global user session-data
    const { currentUser, activeSession } = useContext(UserContext);

    useEffect(() => {

    }, []);

    return (
        <ProfileSettings/>
    )
}

export default ProfileSettingsPage
