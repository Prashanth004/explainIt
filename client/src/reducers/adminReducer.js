import {CHNAGE_ADMIN_USERNAME, 
    CHANGE_ADMIN_PASSWORD, 
    USERNAME_EMPTY,
    PASSWORD_EMPTY,
    AUTHENTICATE_ADMIN_DETAILS,
    AUTHENTICATE_ADMIN_FAILED} from '../actions/types';

const initialState={
    login:false,
    userName:"",
    password:"",
    emptyUserName:false,
    emptyPassword:false,
    authFail:false,
    userDetails:null,
    userName:null,
    password:null
}

export default function(state= initialState, action){
    switch(action.type){
        case CHNAGE_ADMIN_USERNAME:
        return {
            ...state,
            userName:action.payload,
            emptyUserName:false,
            authFail:false
        }
        case CHANGE_ADMIN_PASSWORD:
        return{
            ...state,
            password:action.payload,
            emptyPassword:false,
            authFail:false
        }
        case USERNAME_EMPTY:
        return{
            ...state,
            emptyUserName:true,
        }
        case PASSWORD_EMPTY:
        return {
            ...state,
            emptyPassword:true
        }
        case AUTHENTICATE_ADMIN_DETAILS:
        return{
            ...state,
            userDetails:action.payload,
            userName:action.username,
            password:action.password,
            authFail:false,
            login:true
        }
        case AUTHENTICATE_ADMIN_FAILED:
        return{
            ...state,
            userDetails:null,
            authFail:true
        }
        default:
        return {
            ...state
        }
    }
}