import {SAVE_RECORDER,RESET_RECORDER,STOP_RECORDER,PERRMISSION_DENIED,
    UPDATE_CURRENT_TIME_RECORDER,START_RECORDER,PAUSE_RECORDER,RESUME_RECORDER} from '../actions/types'


const initialState = {
    otherPeerRecorder :null,
    pauseState:false,
    recorder:null,
    currentTime:null,
    downLoadUrl:null,
    blob:null,
    permissionDenied:false
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
        case PERRMISSION_DENIED:
            return{
                ...state,
                permissionDenied:true
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
                blob:null,
                permissionDenied:false
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