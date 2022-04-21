import * as React from "react";
import Bookmarks from "../src/components/bookmarks/bookmarks";
import {useContext, useEffect} from "react";
import {LoginContext} from "../src/helpers/Context";

function BookmarksPage() {

    const {loggedIn, setLoggedIn} = useContext(LoginContext);

    useEffect(() => {
        if (localStorage.getItem('loggedInStateKey')) {
            setLoggedIn(localStorage.getItem('loggedInStateKey'));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('loggedInStateKey', loggedIn);
    }, [loggedIn]);

    return (
        <Bookmarks/>
    )
}

export default BookmarksPage


