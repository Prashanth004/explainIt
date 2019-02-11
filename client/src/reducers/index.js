import { combineReducers } from 'redux';
import signinReducer from './signinReducer';
import issueReducer from './issueReducer';
import projectReducer from './projectReducer';

 
export default combineReducers({
    auth : signinReducer,
    issues: issueReducer,
    projects: projectReducer
 
    
})