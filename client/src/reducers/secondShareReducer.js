import {SECOND_SHARE_START,SECOND_SHARE_END,SECOND_SHARE_START_AGAIN } from '../actions/types'

const initialState={
    secondScreenShareStarted :false,
    secondScreenShareStoped : false,
    isSecondScreenSharing:false,
    stream :null
}

export default function(state = initialState, action){
    switch(action.type){
        case SECOND_SHARE_START:
            return{
                ...state,
                secondScreenShareStarted:true,
                stream:action.stream,
                isSecondScreenSharing:true
            }
        case SECOND_SHARE_END:
        return{
            ...state,
            secondScreenShareStoped:true,
            secondScreenShareStarted :false,
            isSecondScreenSharing:false
        }
        case SECOND_SHARE_START_AGAIN:
            return{
                ...state,
                isSecondScreenSharing:true
            }
        default:
        return{
            ...state
        }
    }
}