import {GET_PROFILE_DETAILS_ON_HOVER,HIDE_ACTIVITY,SHOW_CONTACTS,
    SHOW_ACTIVITY,SHOW_PROFILE,HIDE_LABEL,HIDE_PROFILE,HIDE_CONTACTS,
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
    showContacts:false
  
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
                ...state,
                showProfile:false,
                showActivity:true,
            }
        case SHOW_CONTACTS:
            return{
                ...state,
                showContacts:true
            }
        case HIDE_CONTACTS:
            return{
                ...state,
                showContacts:false
            }
        case SHOW_PROFILE :
            return{
                ...state,
                showProfile:true,
                showActivity:false,
                showContacts:false
            }
        case HIDE_LABEL:
            return{
                ...state,
                hodeLabel:true,
            }
        case HIDE_ACTIVITY:
            return{
                ...state,
            showProfile:false,
            showActivity:false,
        }
        case HIDE_PROFILE:
            return{
                ...state,
                showProfile:false,
                showActivity:true,
            }

        default :
            return state;
    }
}