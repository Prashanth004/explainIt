import {CALL_DETAILS_ACCEPT,
    ANSWER_CALL,MISS_CALL,
    SAVE_RECIEVER_DATA,
    SET_NUMBER_MINUTES } from './types'

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
export const setNoOfMinutes =(numberMinutes)=>(dispatch)=>{
dispatch({
    type:SET_NUMBER_MINUTES,
    payload:numberMinutes
})
}
export const answerCall = ()=>(dispatch)=>{
    dispatch({
        type:ANSWER_CALL
    })
}
export const missCall = () =>(dispatch)=>{
    dispatch({
        type:MISS_CALL
    })
}

export const getRecieverData=(profileImage,profileName,userId)=>(dispatch)=>{
    dispatch({
        type:SAVE_RECIEVER_DATA,
        profileImage:profileImage,
        profileName:profileName,
        userId:userId
    })
}