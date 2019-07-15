import {SECOND_SHARE_START,SECOND_SHARE_END } from '../actions/types'

const initialState={
    secondScreenShareStarted :false,
    secondScreenShareStoped : false,
    stream :null
}

export default function(state = initialState, action){
    switch(action.type){
        case SECOND_SHARE_START:
            return{
                ...state,
                secondScreenShareStarted:true,
                stream:action.stream
            }
        case SECOND_SHARE_END:
        return{
            ...state,
            secondScreenShareStoped:true,
            secondScreenShareStarted :false,
        }
        default:
        return{
            ...state
        }
    }
}