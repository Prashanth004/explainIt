import {REDIAL_MISSED,REDIAL_FAILED,CANCEL_DIAL } from './types';

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

export const cancelDialedOption = ()=>dispatch=>{
    console.log("calcelling dialed action")
    dispatch({
        type:CANCEL_DIAL
    })
}