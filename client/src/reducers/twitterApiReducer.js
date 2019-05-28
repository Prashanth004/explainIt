import {GOT_NO_PROFILE,
    GET_PROFILE_ID ,
     RESET_TWITTER_API_VALUES,
     SEND_TWEETS,SEND_TWEET_FAILED ,
       GET_TWITTER_HANDLE,
     GET_TWITTER_HANDLE_FAILED} from '../actions/types'

const initialState = {
    twitterId:null,
    profilePresent:false,
    doneFetching:false,
    twitterProfilePic:null,
    twitterHandle:null,
    name:null,
    tweeetSent:false,
    twitterHandles:[],
    fetchHanldesSuggest : false,
}

export default (state=initialState, action)=>{
    switch(action.type){
        case GET_PROFILE_ID:{
            return{
                ...state,
                twitterId:action.payload.id,
                twitterProfilePic:action.payload.profilePic,
                name:action.payload.name,
                twitterHandle:action.twitterHandle,
                doneFetching:true,
                profilePresent:true,
            }
        }
        case GOT_NO_PROFILE:{
            return{
                ...state,
                twitterId:null,
                twitterProfilePic:null,
                doneFetching:true,
                profilePresent:false,
                twitterHandle:null,
            }
        }
        case RESET_TWITTER_API_VALUES:{
            return{
                ...state,
                twitterId:null,
                profilePresent:false,
                doneFetching:false,
                twitterHandle:null ,
                tweeetSent:false, 
                name:null,
                twitterHandles:[],
                fetchHanldesSuggest : false,
            }
        }
        case SEND_TWEETS:
            return {
                ...state,
                tweeetSent:true,
                tweetDone:true
                
            }
        case SEND_TWEET_FAILED:
            return {
                ...state,
                tweeetSent:false,
                tweetDone:true
                
            }
        case GET_TWITTER_HANDLE:
        return{
            ...state,
            twitterHandles:action.payload,
            fetchHanldesSuggest:true
        }
       
        case GET_TWITTER_HANDLE_FAILED:
        return{
            ...state,
            twitterHandles:[],
            fetchHanldesSuggest:true
        }
        default :
            return{
                ...state
            }
    }
}