import {SAVE_RECORDER,RESET_RECORDER,STOP_RECORDER,UPDATE_CURRENT_TIME_RECORDER,PAUSE_RECORDER,START_RECORDER,RESUME_RECORDER} from './types'
import config from '../config/config'
export const saveRecorder = ()=>(dispatch)=>{
    dispatch({
        type:SAVE_RECORDER
    })
}

export const pauseRecording = (recorder)=>dispatch =>{
    localStorage.setItem('infoDisplay', JSON.stringify(config.PAUSED_RECORDER_INFO))
    dispatch({
        type:PAUSE_RECORDER,
        payload:recorder
    })
}
export const updateRecorderTime =(currentTime) =>(dispatch)=>{
    dispatch({
        type:UPDATE_CURRENT_TIME_RECORDER,
        payload:currentTime
    })
}
export const resetRecorder = ()=>(dispatch)=>{
    dispatch({
        type:RESET_RECORDER,
    
    })
}
export const resumeRecording = (recorder)=>dispatch =>{
    localStorage.setItem('infoDisplay', JSON.stringify(config.RESUMED_RECORDER_INFO))
    dispatch({
        type:RESUME_RECORDER,
        payload:recorder
    })
}
export const startRecorder = (recorder)=>dispatch=>{

    dispatch({
        type:START_RECORDER,
        payload:recorder
    })
}



export const stopRecorder = (downLoadUrl,blob)=>(dispatch)=>{
    console.log("reaching action page with url : ",downLoadUrl);
    dispatch({
        type:STOP_RECORDER,
        downLoadUrl : downLoadUrl,
        blob:blob
        
    })
}
