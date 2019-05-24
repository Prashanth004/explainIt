import {DISPLAY_SCREEN_SHARE,
    SCREEN_SHARE,
    DISPLAY_INBOX,
    DISPLAY_SCREEN_RECORD,
    SCREEN_RECORD,
    START_SHARING,
    START_RECORDING,
    STOP_SHARING,
    STOP_RECORDING,
    SET_VIDEO_BLOB,
    DISCARD_RECORD_CHANGES,
    FULL_SCREEN_SHARE,
    FULL_START_SHARING,
    FULL_STOP_SHARING,
    DISPLAY_FULL_SHARE,
    FULL_START_RECORD,
    FULL_STOP_RECORD,
    DISPLAY_FULL_SCREEN_RECORD,
    FULL_SCREEN_RECORD,
    RESET_TOOL_STATES,
    CANCEL_MESSAGE_STATE,
    CANCEL_CREATION

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
export const displayFullScreShare=()=>(dispatch)=>{
    dispatch({
        type:DISPLAY_FULL_SHARE,
        payload:FULL_SCREEN_SHARE
    })

}
export const displayInox= ()=>(dispatch)=>{
    dispatch({
        type:DISPLAY_INBOX,
        payload:FULL_SCREEN_SHARE
    })
}

export const displayFullScrenRecord=()=>(dispatch)=>{
    dispatch({
        type:DISPLAY_FULL_SCREEN_RECORD,
        payload:FULL_SCREEN_RECORD
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
export const fullStartedSharing = () =>(dispatch)=>{
    dispatch({
        type:FULL_START_SHARING,
        payload:true
    })
}
export const fullStopedSharing = () =>(dispatch)=>{
    dispatch({
        type:FULL_STOP_SHARING,
        payload:false
    })
}
export const stopedRcording = () =>(dispatch)=>{
    dispatch({
        type:STOP_RECORDING,
        payload:false
    })
}


export const fullStartedRecording = () =>(dispatch)=>{
    dispatch({
        type:FULL_START_RECORD,
        payload:true
    })
}
export const fullStopedRecording = () =>(dispatch)=>{
    dispatch({
        type:FULL_STOP_RECORD,
        payload:false
    })
}



export const saveVideoBlob = (videoBlob) => (dispatch)=>{
    var filedata = JSON.stringify(videoBlob)
    localStorage.setItem("filedata",filedata)
    dispatch({
        type:SET_VIDEO_BLOB,
        payload:filedata

    })
    
}

export const restAllToolValue = () =>(dispatch)=>{
    dispatch({
        type:RESET_TOOL_STATES
    })
    dispatch({
        type:CANCEL_MESSAGE_STATE
    })
    // dispatch({
    //     type:CANCEL_CREATION
    // })

}

export const discardAfterRecord = () => (dispatch)=>
{
    dispatch({
        type:DISCARD_RECORD_CHANGES
    })

}