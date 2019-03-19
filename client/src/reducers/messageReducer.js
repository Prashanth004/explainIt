import {SEND_MESSAGE, 
    SEND_FAILED, 
    FETCH_MESSAGES,
    FETCH_FAILED,
    CANCEL_MESSAGE_STATE} from '../actions/types'

const initialState = {
    sendSuccess:false,
    sendFail:false,
    allMessage:null,
    fetchFailed:false
}

export default function(state=initialState, action){
    switch(action.type){
        case SEND_MESSAGE:
        return{
            ...state,
            sendSuccess:true
        }
        case CANCEL_MESSAGE_STATE:
        return{
            ...state,
            sendSuccess:false,
            sendFail:false,
            allMessage:null,
            fetchFailed:false
        }
        case SEND_FAILED:
        return{
            ...state,
            sendFail:true
        }
        case FETCH_MESSAGES:
        return{
            ...state,
            allMessage:action.allMessage
        }
        case FETCH_FAILED:
        return{
            ...state,
            fetchFailed:true
        }
        default :
        return{
            ...state
        }
    }
}