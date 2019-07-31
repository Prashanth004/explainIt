import {GET_PROFILE_BY_TWITTER_HANDLE,SHARE_TO_SELF,RESET_TWITTER_VLUES,REST_VISIT_TWITTER_ACTION,
    NO_INTERNET,UPDATE_TWITTER_HANDLE,EMPTY_TWITTER_HANDLE,STARTED_TWEET_TEST,
    SET_VISIT_PROFILE_DETAILS,GOT_NULL_BY_TWITTWRHANDLE} from '../actions/types'

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
    selfShare:false,
    twitterHandle:"",
    emptyTwitterHandle:false,
    noInternet:false,
    testedTweet:false
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
        case SHARE_TO_SELF:
                return{
                    selfShare:true
                }
        case NO_INTERNET:
            return{
                noInternet:true
            }
        case UPDATE_TWITTER_HANDLE:
            return{
                ...state,
                twitterHandle:action.payload,
                selfShare:false,
                noInternet:false,
                emptyTwitterHandle:false
            }
        case EMPTY_TWITTER_HANDLE:
            return{
                ...state,
                emptyTwitterHandle:true
            }
        case STARTED_TWEET_TEST:
            return{
                ...state,
                testedTweet:true
            }
        case REST_VISIT_TWITTER_ACTION:
            return{
                ...state,
                fetchProfile:false,
                twitterHandle:"",
                emptyTwitterHandle:false,
                noInternet:false,
                testedTweet:false
            }
        case RESET_TWITTER_VLUES:
            return{
                ...state,
                fetchProfile:false,
                userName:null,
                profilePic:null,
                email:null,
                id:null,
                isPresent:false,
                onlineStatus:0,
                busyStatus:0,
                visitedTiwtterHandle:null,
                selfShare:false,
                twitterHandle:"",
                emptyTwitterHandle:false,
                noInternet:false
            }
        default :
            return state;
      
    }
}