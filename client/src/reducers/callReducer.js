import {CALL_DETAILS_ACCEPT, ANSWER_CALL,MISS_CALL} from '../actions/types'

const initialState={
    link:null,
    userName:null,
    email:null,
    id:null,
    profilePic:null,
    incommingCall :false
}

export default function(state= initialState, action){
    switch(action.type){
        case CALL_DETAILS_ACCEPT:
            return {
                ...state,
                incommingCall:true,
                link:action.payload.link,
                userName:action.payload.userName,
                email:action.payload.email,
                id: action.payload.id,
                profilePic:action.payload.profilePic                
            }
        case ANSWER_CALL:
            return {
                ...state,
                incommingCall:false
            }
        case MISS_CALL:
            return{
                ...state,
                incommingCall:false
            }
    default:
            return {
                ...state
            }

    }
   
        
    
}