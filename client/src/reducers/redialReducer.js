import {REDIAL_MISSED,REDIAL_FAILED,CANCEL_RECORD,
    CANCEL_DIAL,RE_RECORD_FAILED} from '../actions/types'


const initialState = {
    redialtwitterHandle:null,
    redialInitiated:false,
    subject:null,
    reRecordInitiated:false,
}


export default function(state = initialState, action){
    switch(action.type){
        case REDIAL_MISSED:
            return{
                ...state,
                redialInitiated:true,
                redialtwitterHandle:action.twitterhandle,
                subject:action.subject
            }
        case REDIAL_FAILED:
            return{
                ...state,
                redialInitiated:true,
                redialtwitterHandle:action.twitterhandle,
                subject:action.subject
            }
        case RE_RECORD_FAILED:
            return{
                ...state,
                reRecordInitiated:true,
                redialtwitterHandle:action.twitterhandle,
                subject:action.subject
            }
        case CANCEL_DIAL :
            return{
                ...state,
                redialInitiated:false,
            }
        case CANCEL_RECORD:
            return{
                ...state,
                reRecordInitiated:false
            }
        default:
            return{
                ...state
            }
        }
    }
        
        



