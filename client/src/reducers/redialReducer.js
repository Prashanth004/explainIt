import {REDIAL_MISSED,REDIAL_FAILED,CANCEL_DIAL} from '../actions/types'


const initialState = {
    twitterHandle:null,
    redialInitiated:false,
    subject:null
}


export default function(state = initialState, action){
    switch(action.type){
        case REDIAL_MISSED:
            return{
                ...state,
                redialInitiated:true,
                twitterHandle:action.twitterhandle,
                subject:action.subject
            }
        case REDIAL_FAILED:
            return{
                ...state,
                redialInitiated:true,
                twitterHandle:action.twitterHandle,
                subject:action.subject
            }
        case CANCEL_DIAL :
            return{
                ...state,
                redialInitiated:false,
                

            }
        default:
            return{
                ...state
            }
        }
    }
        
        



