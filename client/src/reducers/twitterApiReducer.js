import {GOT_NO_PROFILE,
    GET_PROFILE_ID ,
     RESET_TWITTER_API_VALUES,
     SEND_TWEETS,SEND_TWEET_FAILED } from '../actions/types'

const initialState = {
    twitterId:null,
    profilePresent:false,
    doneFetching:false,
    twitterProfilePic:null,
    twitterHandle:null,
    name:null,
    tweeetSent:false
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
            }
        }
        case SEND_TWEETS:
            return {
                tweeetSent:true,
                tweetDone:true
                
            }
        case SEND_TWEET_FAILED:
            return {
                tweeetSent:false,
                tweetDone:true
                
            }
        default :
            return{
                ...state
            }
    }
}