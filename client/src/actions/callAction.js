import {CALL_DETAILS_ACCEPT,ANSWER_CALL } from './types'

export const acceptCallDetails = (link, callerEmail, callerUserName, callerId,callerProfilePic)=>(dispatch)=>{
dispatch({
    type:CALL_DETAILS_ACCEPT,
    payload:{
        link:link,
        email:callerEmail,
        userName:callerUserName,
        id:callerId,
        profilePic:callerProfilePic
    }
})
}
export const answerCall = ()=>(dispatch)=>{
    dispatch({
        type:ANSWER_CALL
    })
}