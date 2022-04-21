import * as React from "react";
import Landing from '../src/components/Landing/Landing'
import {useContext, useEffect} from "react";
import {UserContext} from "../src/helpers/Context";

function index() {

    //Global user session-data
    const {currentUser, activeSession, setCurrentUser, setActiveSession} = useContext(UserContext);

    useEffect(() => {

    }, []);

    return (<Landing/>)
}

export default index
