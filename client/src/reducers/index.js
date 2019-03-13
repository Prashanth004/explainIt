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
 
export default combineReducers({
    auth : signinReducer,
    issues: issueReducer,
    projects: projectReducer,
    tools: toolReducer,
    profile: profileReducer,
    extension:extensionReducer,
    visitProfile :visitProfileReducer,
    call : callReducer,
    message:messageReducer,
    nav:navReducer
})