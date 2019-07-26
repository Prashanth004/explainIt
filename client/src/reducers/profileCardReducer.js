import {GET_PROFILE_DETAILS_ON_HOVER,HIDE_ACTIVITY,
    SHOW_ACTIVITY,SHOW_PROFILE,HIDE_LABEL,HIDE_PROFILE,
    GET_PROFILE_DETAILS_FAIL_ON_HOVER} from '../actions/types'

const initialState = {
   
    email:null,
    profilePic:null,
    userName:null,
    noParticipated:null,
    noCreated:null,
    errorFetchingProfileData:null,
    myIssues:null,
    participatedIssue:null,
    twitterHandle:null,
    showProfile:false,
    showActivity:false,
    hodeLabel:false,
  
}

export default function(state=initialState, action){
    switch(action.type){
        case GET_PROFILE_DETAILS_ON_HOVER:
            return {
                ...state,
                email:action.email,
                userName:action.userName,
                profilePic:action.profilePic,
                noParticipated:action.noParticipated,
                noCreated:action.noCreated,
                myIssues:action.myIssue,
                participatedIssue : action.participatedIssue,
                twitterHandle:action.twitterHandle
            }
        case GET_PROFILE_DETAILS_FAIL_ON_HOVER:
            return {
                ...state,
                errorFetchingProfileData:action.error
            } 
        case SHOW_ACTIVITY:
            return{
                showProfile:false,
                showActivity:true,
            }
        case SHOW_PROFILE :
            return{
                showProfile:true,
                showActivity:false,
            }
        case HIDE_LABEL:
            return{
                hodeLabel:true,
            }
        case HIDE_ACTIVITY:
            return{
            showProfile:false,
            showActivity:false,
        }
        case HIDE_PROFILE:
            return{
                showProfile:false,
                showActivity:false,
            }

        default :
            return state;
    }
}