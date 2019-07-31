import {GET_PROFILE_DETAILS,
    UPDATE_USER_PROFILE,
    UPDATE_USER_PROFILE_FAILED,
    OPEN_EDIT_PROFILE,
    CLOSE_EDIT_PROFILE,
    CHANGE_ONLINE_STATUS,
    GET_PROFILE_DETAILS_FAIL} from '../actions/types';


const initialState = {
   donefetching:false,
    email:null,
    openEdirProfile:false,
    profilePic:"",
    userName:"",
    noParticipated:null,
    noCreated:null,
    errorFetchingProfileData:null,
    myIssues:null,
    participatedIssue:null,
    twitterHandle:null,
    doneUpdating:false,
    updateSuccess:true,
    cost : null,
    bio : "",
    twitterLink : "",
    angelLink : "",
    linkinLink : "",
    githubLink : "",
    goodat:"",
    works:"",
    onlineStatus:0,
  
}

export default function(state=initialState, action){
    switch(action.type){
        case UPDATE_USER_PROFILE:
            return{
                ...state,
                openEdirProfile:false,
                doneUpdating:true,
                updateSuccess:true,
                cost : action.cost,
                bio : action.bio,
                angelLink : action.angelLink,
                linkinLink : action.linkinLink,
                githubLink : action.githubLink,
                goodat:action.goodat,
                works:action.works,
                twitterHandle:action.twitterHandle

            }
        case CHANGE_ONLINE_STATUS:
        return{
            ...state,
            onlineStatus:action.payload
        }
    
        case OPEN_EDIT_PROFILE:
        return{
            ...state,
            openEdirProfile:true
        }
        case CLOSE_EDIT_PROFILE:
        return{
            ...state,
            openEdirProfile:false
        }
        case UPDATE_USER_PROFILE_FAILED:
        return{
            ...state,
            doneUpdating:true,
            updateSuccess:false,
        }
        
        case GET_PROFILE_DETAILS:
            return {
                ...state,
                donefetching:true,
                email:action.email,
                cost :action.cost,
                bio :action.bio,
                twitterLink : action.twitterLink,
                onlineStatus:action.onlineStatus,
                angelLink : action.angelLink,
                linkinLink : action.linkinLink,
                githubLink : action.githubLink,
                userName:action.userName,
                profilePic:action.profilePic,
                noParticipated:action.noParticipated,
                noCreated:action.noCreated,
                myIssues:action.myIssue,
                participatedIssue : action.participatedIssue,
                twitterHandle:action.twitterHandle,
                goodat:action.goodat,
                works:action.works,
                allprojects:action.allprojects

            }
        case GET_PROFILE_DETAILS_FAIL:
            return {
                ...state,
                errorFetchingProfileData:action.error
            }
        default :
            return state;
    }
}