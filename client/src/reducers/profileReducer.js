import {GET_PROFILE_DETAILS,
    UPDATE_USER_PROFILE,GET_PROFILE_VIDEO_LINK,
    UPDATE_USER_PROFILE_FAILED,PROGREESS_UPDATE,
    OPEN_EDIT_PROFILE,ADD_NEW_ANSWER_PROJECT,
    CLOSE_EDIT_PROFILE,ADD_MORE_CREATED,
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
    portfolio:"",
    onlineStatus:0,
    newAnswerProject:{},
    profileVidoeLink:null,
    noLoadMoreCreated:0,
    totalNoLoadMoreCreated:0,
    activeFiveCreated:[]
  
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
                portfolio:action.portfolio,
                twitterHandle:action.twitterHandle

            }

        case GET_PROFILE_VIDEO_LINK:
            return{
                ...state,
                profileVidoeLink:action.payload
            }
        case ADD_NEW_ANSWER_PROJECT:
            return{
                ...state,
                newAnswerProject:action.payload
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
            const noOfLoadCre = Math.floor((action.myIssue.length)/3)
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
                portfolio:action.portfolio,
                allprojects:action.allprojects,
                totalNoLoadMoreCreated:noOfLoadCre

            }
        case ADD_MORE_CREATED:
            const upatedNuber = state.noLoadMoreCreated + 1;
            const fiveActi =  state.myIssues.slice((upatedNuber*3),(upatedNuber*3)+3)
            return{
                ...state,
                noLoadMoreCreated:upatedNuber,
                activeFiveCreated:fiveActi

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