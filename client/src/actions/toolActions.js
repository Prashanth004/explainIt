import {DISPLAY_SCREEN_SHARE,
    SCREEN_SHARE,
    DISPLAY_SCREEN_RECORD,
    SCREEN_RECORD,
    START_SHARING,
    START_RECORDING,
    STOP_SHARING,
    STOP_RECORDING,
    SET_VIDEO_BLOB,
    DISCARD_RECORD_CHANGES
} from './types'


export const displayShareScreen=()=>(dispatch)=>{
dispatch({
    type: DISPLAY_SCREEN_SHARE ,
    payload:SCREEN_SHARE
})
}

export const displayScrenRecord=()=>(dispatch)=>{
    dispatch({
        type:DISPLAY_SCREEN_RECORD,
        payload:SCREEN_RECORD
    })

}
export const StartedSharing=()=>(dispatch)=>{
    dispatch({
        type:START_SHARING,
        payload:true
    })

}
export const StartedRecording=()=>(dispatch)=>{
    dispatch({
        type:START_RECORDING,
        payload:true
    })

}
export const stopedSharing = () =>(dispatch)=>{
    dispatch({
        type:STOP_SHARING,
        payload:false
    })
}
export const stopedRcording = () =>(dispatch)=>{
    dispatch({
        type:STOP_RECORDING,
        payload:false
    })
}

export const saveVideoBlob = (videoBlob) => (dispatch)=>{
    console.log("videoBlob : ",videoBlob)
    var filedata = JSON.stringify(videoBlob)
    localStorage.setItem("filedata",filedata)
    dispatch({
        type:SET_VIDEO_BLOB,
        payload:filedata

    })
    
}

export const discardAfterRecord = () => (dispatch)=>
{
    dispatch({
        type:DISCARD_RECORD_CHANGES
    })

}