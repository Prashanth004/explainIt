import {GET_PROFILE_BY_TWITTER_HANDLE,SET_VISIT_PROFILE_DETAILS,GOT_NULL_BY_TWITTWRHANDLE} from '../actions/types'

const initalState = {
    fetchProfile:false,
    userName:null,
    profilePic:null,
    email:null,
    id:null,
    isPresent:false,
    onlineStatus:0,
    busyStatus:0,
    visitedTiwtterHandle:null,
}


export default function(state = initalState, action){
    switch(action.type){
        case GET_PROFILE_BY_TWITTER_HANDLE:
            return{
                ...state,
                isPresent:true,
                fetchProfile:true,
                onlineStatus:action.onlineStatus,
                busyStatus:action.busyStatus,
                userName:action.userName,
                profilePic:action.profilePic,
                id:action.id,
                email:action.email
            }
        case SET_VISIT_PROFILE_DETAILS:
            return{
                ...state,
                visitedTiwtterHandle:action.payload
            }
        case GOT_NULL_BY_TWITTWRHANDLE:
            return{
                ...state,
                fetchProfile:true,
                isPresent:false,
            }
        default :
            return state;
    }
}