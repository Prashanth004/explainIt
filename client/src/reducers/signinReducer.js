

import {SIGN_IN_WITH_GOOGLE,
    SIGN_IN_WITH_GIT,SIGN_OUT,CHECK_TOKEN_VALIDIDTY,AUTH_FAIL,SIGN_IN_WITH_TWITTER} from '../actions/types'

const initialState = {
    authAction:false,
    isAuthenticated:false,
    domainName :null,
    error :null,
    token:null,
    userName:null,
    profilePic:null,
    email:null,
    id:null,
    twitterHandle:null,
    logoutSuccess:false

}

export default function(state = initialState, action){
    switch(action.type){
        case SIGN_IN_WITH_GOOGLE :
           
            return{
                ...state,
                authAction:true,
                logoutSuccess:false,
                isAuthenticated:action.payload,
                domainName: "google",
                token:action.token,
                profilePic:action.profilePic,
                userName:action.userName,
                email:action.email,
                id:action.id
            }
        case CHECK_TOKEN_VALIDIDTY:
            return{
                ...state,
                authAction:true,
                logoutSuccess:false,
                isAuthenticated :action.payload,
                profilePic:action.profilePic,
                userName:action.userName,
                email:action.email,
                id:action.id,
                twitterHandle:action.twitterHandle
            }
        case SIGN_IN_WITH_TWITTER :
           
            return{
                ...state,
                logoutSuccess:false,
                isAuthenticated:action.payload,                
                domainName: "twitter",
                token:action.token,
                profilePic:action.profilePic,
                userName:action.userName,
                email:action.email,
                id:action.id,
                twitterHandle:action.twitterHandle
 }
        case AUTH_FAIL : 
            return{
                ...state,
                authAction:true,
                isAuthenticated:action.payload,
                userName: null,
                profilePic:null,
                email:null,
                id:null,
                domainName: null,
                token:null,
                error : action.error
            }
        case SIGN_OUT :
            return{
                ...state,
                logoutSuccess:true,
                isAuthenticated:action.payload,
                domainName:null,
                token:action.token,
                userName: null,
                profilePic:null,
                email:null,
                id:null

            }
        case SIGN_IN_WITH_GIT:
            return{
                ...state,
                logoutSuccess:false,
                isAuthenticated:action.payload,
                domainName: "github",
                token:action.token,
                profilePic:action.profilePic,
                userName:action.userName,
                email:action.email,
                id:action.id

            }
        default :
            return state;
    }
}