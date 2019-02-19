

import {SIGN_IN_WITH_GOOGLE,
    SIGN_IN_WITH_GIT,SIGN_OUT,CHECK_TOKEN_VALIDIDTY,AUTH_FAIL,SIGN_IN_WITH_TWITTER} from '../actions/types'

const initialState = {
    isAuthenticated:false,
    domainName :null,
    error :null,
    token:null,
    userName:null,
    profilePic:null
}

export default function(state = initialState, action){
    switch(action.type){
        case SIGN_IN_WITH_GOOGLE :
           
            return{
                ...state,
                isAuthenticated:action.payload,
                domainName: "google",
                token:action.token
            }
        case CHECK_TOKEN_VALIDIDTY:
            return{
                ...state,
                isAuthenticated :action.payload,
                profilePic:action.profilePic,
                userName:action.userName
            }
        case SIGN_IN_WITH_TWITTER :
           
            return{
                ...state,
                isAuthenticated:action.payload,
                domainName: "twitter",
                token:action.token
            }
        case AUTH_FAIL : 
            return{
                ...state,
                isAuthenticated:action.payload,
                profilePic:null,
                userName:null,
                domainName: null,
                token:null,
                error : action.error
            }
        case SIGN_OUT :
            return{
                ...state,
                isAuthenticated:action.payload,
                domainName:null,
                token:action.token

            }
        case SIGN_IN_WITH_GIT:
            return{
                ...state,
                isAuthenticated:action.payload,
                domainName: "github",
                token:action.token

            }
        default :
            return state;
    }
}