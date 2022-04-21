import {createContext} from 'react'
import {User} from "../models/User";
import {INTRO_TEXT, LEARNING_GOAL_TEXT, LEARNING_UNIT_TEXT, SUBJECT_TEXT} from "./TextConstants";


export const UserContext = createContext({
    currentUser: {id: null, firstName: null,
        lastName: null,
        email: null,
        password: null,
        admin: null,
        aboutMe: null,
        profilePicture: null},
    activeSession: false,
    setActiveSession: (bool: boolean) => {},
    setCurrentUser: (user: any) => {}
});

export const DEFAULT_STEP_DATA = [
    {
        title: "Introduction", content: INTRO_TEXT, completed: false
    },

    {
        title: "Add subject", content: SUBJECT_TEXT, completed: false
    },

    {
        title: "Create learning-goal", content: LEARNING_GOAL_TEXT, completed: false
    },

    {
        title: "Create learning-unit", content: LEARNING_UNIT_TEXT, completed: false
    }
]


