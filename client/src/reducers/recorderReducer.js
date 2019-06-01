import {SAVE_RECORDER} from '../actions/types'


const initialState = {
    otherPeerRecorder :null
}


export default function(state = initialState, action){
    switch(action.type){
        case SAVE_RECORDER:
            return{
                ...state,
                otherPeerRecorder:action.payload
            }
        default:
            return{
                ...state
            }
    }
}