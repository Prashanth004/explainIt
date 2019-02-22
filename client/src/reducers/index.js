import { combineReducers } from 'redux';
import signinReducer from './signinReducer';
import issueReducer from './issueReducer';
import projectReducer from './projectReducer';
import toolReducer from './toolReducer'
import profileReducer from './profileReducer'
 
export default combineReducers({
    auth : signinReducer,
    issues: issueReducer,
    projects: projectReducer,
    tools: toolReducer,
    profile: profileReducer
})