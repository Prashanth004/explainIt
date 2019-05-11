import { combineReducers } from 'redux';
import signinReducer from './signinReducer';
import issueReducer from './issueReducer';
import projectReducer from './projectReducer';
import toolReducer from './toolReducer';
import profileReducer from './profileReducer';
import extensionReducer from './extensionReducer'
import visitProfileReducer from './visitProfileReducers'
import callReducer from './callReducer'
import messageReducer from './messageReducer'
import navReducer from './navReducer'
import twitterApiReducer from './twitterApiReducer';
import streamReducer from './streamReducer';
import canvasActionsReducer from './canvasActionReducer'
import profileHoverReducer from './profileHoverReducer'
import secondScreenShareReducer from './secondShareReducer'
import emailReducer from './emailReducer';
import adminReducer from './adminReducer'
 
export default combineReducers({
    email:emailReducer,
    auth : signinReducer,
    issues: issueReducer,
    projects: projectReducer,
    admin:adminReducer,
    tools: toolReducer,
    profile: profileReducer,
    extension:extensionReducer,
    visitProfile :visitProfileReducer,
    call : callReducer,
    message:messageReducer,
    nav:navReducer,
    twitterApi:twitterApiReducer,
    stream:streamReducer,
    canvasActions:canvasActionsReducer,
    profileHover:profileHoverReducer,
    secondScreenShare :secondScreenShareReducer
})