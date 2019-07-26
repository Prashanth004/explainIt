import {REDIAL_MISSED,REDIAL_FAILED,CANCEL_DIAL } from './types';

export const dialFromMissed = (twitterHandle)=>(dispatch)=>{
    dispatch({
        type:REDIAL_MISSED,
        twitterhandle:twitterHandle
    })
}
export const dialFromFail = (twitterHandle, subject)=>(dispatch)=>{
    dispatch({
        type:REDIAL_FAILED,
        twitterhandle:twitterHandle,
        subject:subject
    })
}

export const cancelDialedOption = ()=>dispatch=>{
    dispatch({
        type:CANCEL_DIAL
    })
}