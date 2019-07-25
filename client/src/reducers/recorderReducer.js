import {SAVE_RECORDER,RESET_RECORDER,STOP_RECORDER,UPDATE_CURRENT_TIME_RECORDER,START_RECORDER,PAUSE_RECORDER,RESUME_RECORDER} from '../actions/types'


const initialState = {
    otherPeerRecorder :null,
    pauseState:false,
    recorder:null,
    currentTime:null,
    downLoadUrl:null,
    blob:null
}


export default function(state = initialState, action){
    switch(action.type){
        case SAVE_RECORDER:
            return{
                ...state,
                otherPeerRecorder:action.payload
            }
        case PAUSE_RECORDER:
            return{
                ...state,
                pauseState:true,
                recorder:action.payload
            }
        case RESUME_RECORDER:
            return{
                ...state,
                pauseState:false,
                recorder:action.payload

            }
        case UPDATE_CURRENT_TIME_RECORDER:
            return{
                ...state,
                currentTime:action.payload
            }
        case STOP_RECORDER:
            console.log("url in reducer : ",action.downLoadUrl)
            return{
                ...state,
                downLoadUrl:action.downLoadUrl,
                blob:action.blob
            }
        

        case RESET_RECORDER :
            return{
                ...state,
                otherPeerRecorder :null,
                pauseState:false,
                recorder:null,
                currentTime:null,
                downLoadUrl:null,
                blob:null
            }
        case START_RECORDER:
            return{
                ...state,
                recorder:action.payload
            }
        default:
            return{
                ...state
            }
    }
}