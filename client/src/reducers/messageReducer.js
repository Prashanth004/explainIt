import {SEND_MESSAGE, 
    SEND_FAILED, 
    FETCH_MESSAGES,
    HIDE_TEXT_BOX_AFTER_RECORDONG,
    SHOW_TEXT_BOX_AFTER_RECORDONG,
    FETCH_FAILED,
    FROM_SHARE_TO_RECORD,
    CANCEL_MESSAGE_STATE} from '../actions/types'

const initialState = {
    sendSuccess:false,
    sendFail:false,
    allMessage:null,
    fetchFailed:false,
    showTextAftRec : true ,
    fromShareToRecord:false
}

export default function(state=initialState, action){
    switch(action.type){
        case SEND_MESSAGE:
        return{
            ...state,
            sendSuccess:true
        }
        case HIDE_TEXT_BOX_AFTER_RECORDONG:
        return{
            ...state,
            showTextAftRec:false
        }
        case FROM_SHARE_TO_RECORD:
        return{
            ...state,
            fromShareToRecord:true
        }
        case SHOW_TEXT_BOX_AFTER_RECORDONG:
        return{
            ...state,
            showTextAftRec:true
        }
        case CANCEL_MESSAGE_STATE:
        return{
            ...state,
            sendSuccess:false,
            sendFail:false,
            allMessage:null,
            fetchFailed:false,
            showTextAftRec : true ,
            fromShareToRecord:false
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