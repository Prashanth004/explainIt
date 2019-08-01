import {REDIAL_MISSED,REDIAL_FAILED,CANCEL_RECORD,
    CANCEL_DIAL,RE_RECORD_FAILED } from './types';

export const dialFromMissed = (twitterHandle,subject)=>(dispatch)=>{
    dispatch({
        type:REDIAL_MISSED,
        twitterhandle:twitterHandle,
         subject:subject
    })
}
export const dialFromFail = (twitterHandle, subject)=>(dispatch)=>{
    dispatch({
        type:REDIAL_FAILED,
        twitterhandle:twitterHandle,
        subject:subject
    })
}

export const recordFromFail = (twitterHandle,subject)=>dispatch=>{
dispatch({
    type:RE_RECORD_FAILED,
    subject:subject,
    twitterhandle:twitterHandle,

})
}

export const cancelDialedOption = ()=>dispatch=>{
    console.log("calcelling dialed action")
    dispatch({
        type:CANCEL_DIAL
    })
}
export const cancelReRecordOption = ()=>dispatch=>{
    dispatch({
        type:CANCEL_RECORD
    })
}