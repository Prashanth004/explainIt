import {DISPLAY_SCREEN_SHARE,
    SCREEN_SHARE,
    DISPLAY_SCREEN_RECORD,
    SCREEN_RECORD,
    START_SHARING,
    START_RECORDING,
    STOP_SHARING,
    STOP_RECORDING,
    SET_VIDEO_BLOB,
    DISCARD_RECORD_CHANGES,
    FULL_START_SHARING,
    FULL_STOP_SHARING,
    DISPLAY_FULL_SHARE,
    FULL_SCREEN_SHARE,
    FULL_START_RECORD,
    FULL_STOP_RECORD,
    FULL_SCREEN_RECORD,
    DISPLAY_FULL_SCREEN_RECORD
} from '../actions/types'

const initialState ={
    screenAction : null,
    displayForm : false,
    isScreenSharing :false,
    isScreenRecording: false,
    isSharingCompleted:false,
    isRecordingCompleted:false,
    videoBlob:null,
    isFullScreenSharing:false,
    isFullSharingCompleted:false,
    isFullScreenRecording:false,
    isFullRecordCompleted:false,

}

export default (state=initialState, action)=>{
    switch(action.type){
        case DISPLAY_SCREEN_SHARE:
            return {
                ...state,
                screenAction:SCREEN_SHARE
            }
        case DISPLAY_SCREEN_RECORD:
            return{
                ...state,
                screenAction:SCREEN_RECORD,
            }
        case DISPLAY_FULL_SHARE:
            return{
                ...state,
                screenAction:FULL_SCREEN_SHARE,
            }
        case DISPLAY_FULL_SCREEN_RECORD:
            return{
                ...state,
                screenAction:FULL_SCREEN_RECORD,
            }
        case START_SHARING:
            return{
                ...state,
                isScreenSharing: action.payload,
                displayForm:true
            }
        case START_RECORDING:
            return{
                ...state,
                isScreenRecording: action.payload,
                displayForm:true
            }
        case STOP_SHARING:
            return{
                ...state,
                isScreenSharing: action.payload,
                isSharingCompleted:true
            }
        case STOP_RECORDING:
            return{
                ...state,
                isScreenRecording: action.payload,
                isRecordingCompleted:true
            }
        case SET_VIDEO_BLOB:
            return{
                ...state,
                videoBlob:action.payload
            }
        case DISCARD_RECORD_CHANGES:
            return{
                ...state,
                isRecordingCompleted:false,
                isScreenRecording:false,
                screenAction:SCREEN_RECORD,
                videoBlob:null,
                displayForm:true
            }
        case FULL_START_SHARING:
            return{
                ...state,
                isFullScreenSharing: action.payload,
            }
        case FULL_STOP_SHARING:
            return{
                ...state,
                isFullScreenSharing: action.payload,
                isFullSharingCompleted:true
            }
            case FULL_START_RECORD:
            return{
                ...state,
                isFullScreenRecording: true,
            }
        case FULL_STOP_RECORD:
            return{
                ...state,
                isFullScreenRecording: false,
                isFullRecordCompleted:true
            }
        default :
            return state
    }
}

