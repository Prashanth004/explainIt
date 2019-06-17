import {SAVE_RECORDER,RESET_RECORDER,UPDATE_CURRENT_TIME_RECORDER,PAUSE_RECORDER,START_RECORDER,RESUME_RECORDER} from './types'

export const saveRecorder = ()=>(dispatch)=>{
    dispatch({
        type:SAVE_RECORDER
    })
}

export const pauseRecording = (recorder)=>dispatch =>{
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
    dispatch({
        type:RESUME_RECORDER,
        payload:recorder
    })
}
export const startRecorder = (recorder)=>dispatch=>{
    console.log("slknadkjn")
    // alert("asflknadfijh")
    dispatch({
        type:START_RECORDER,
        payload:recorder
    })
}
