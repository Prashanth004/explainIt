import {CALL_DETAILS_ACCEPT,
    ANSWER_CALL,MISS_CALL,
    SAVE_RECIEVER_DATA,
    INCREASE_CALL_BY_MINUTE,
    UPDATE_CURRENT_TIME,
    SET_PEER_ID,
    INITIATE_SEND,
    ANSWERED_CALL,
    RESET_CALL_ACTIONS,
    RETRY_UPDATE_NO_OF_MINUTES,
    GET_ALL_ACTIVITES,
    GET_ALL_ACTIVITES_FAILED,
    BASIC_INFO_OF_CALL,
    DISABLE_CALL_ACTION,
    MUTE_AUDIO,
    UNMUTE_AUDIO,
    DECREASE_CALL_BY_MINUTE,
    UPATE_CURRENT_TIME_TO_DISPLAY,
    SAVE_TOPIC_OF_THE_CALL,
    SET_NUMBER_MINUTES } from './types'
import axios from 'axios';
import config from '../config/config'

export const acceptCallDetails = (link, callerEmail, callerUserName, callerId,callerProfilePic,topicOfTheCall,timeAlloted)=>(dispatch)=>{
dispatch({
    type:CALL_DETAILS_ACCEPT,
    payload:{
        link:link,
        email:callerEmail,
        userName:callerUserName,
        id:callerId,
        profilePic:callerProfilePic,
        topicOfTheCall:topicOfTheCall,
        timeAlloted:timeAlloted
    }
})
}
export const setpeerId = (peerId)=>(dispatch)=>{
    dispatch({
        type:SET_PEER_ID,
        payload:peerId
    })
}
export const muteAudio = ()=>(dispatch)=>{
    dispatch({
        type:MUTE_AUDIO,
    })
}
export const unMuteAudio =()=>(dispatch)=>{
    dispatch({
        type:UNMUTE_AUDIO
    })
}
export const answeredCall = ()=>(dispatch)=>{
    dispatch({
        type:ANSWERED_CALL
    })
}

export const updateRemainingTime = (timeRem)=>dispatch=>{
    dispatch({
        type:UPATE_CURRENT_TIME_TO_DISPLAY,
        payload:timeRem
    })
    return true
}
export const disableCallAction = ()=>(dispatch)=>{
   dispatch({
        type:DISABLE_CALL_ACTION
   }) 
}
export const saveTopicOfTheCall = (topic)=>(dispatch)=>{
    dispatch({
        type:SAVE_TOPIC_OF_THE_CALL,
        payload:topic
    })
}
export const updateCurrentTime = (currentTime)=>(dispatch)=>{
    dispatch({
        type:UPDATE_CURRENT_TIME,
        payload:currentTime
    })
}
export const basicInfoCall = (touser, topic)=>(dispatch)=>{
    dispatch({
        type:BASIC_INFO_OF_CALL,
        payload:{
            touser:touser
        }
    })
}
export const increaseTimer = ()=>(dispatch)=>{
    dispatch({
        type:INCREASE_CALL_BY_MINUTE
    })
}
export const deacreaseTimer = ()=>(dispatch)=>{
    dispatch({
        type:DECREASE_CALL_BY_MINUTE
    })
}

export const retryCall = ()=>(dispatch)=>{
    dispatch({
        type:RETRY_UPDATE_NO_OF_MINUTES
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
export const resetCallAction = ()=>(dispatch)=>{
    dispatch({
        type:RESET_CALL_ACTIONS
    })
}
export const getAllActivities = ()=>(dispatch)=>{
    var token = JSON.parse(localStorage.getItem('token'));
    axios({
        method:'get',
        url:config.base_dir+'/api/activity/user',
        headers:{
            "Authorization":token,
        },
    }).then(response=>{
        if(response.status === 200 || response.status === 304){
            dispatch({
                type:GET_ALL_ACTIVITES,
                payload:response.data.data
            })
        }
    }).catch(error=>{
        dispatch({
            type:GET_ALL_ACTIVITES_FAILED,
            payload:error
        })
    })
}
export const callSuccessedUpate = (touser, topic, duration, link)=>{
    var token = JSON.parse(localStorage.getItem('token'));
    var data={
        touser:touser,
        activity:config.CALL_SUCCESSFULL,
        subject:topic,
        link:link,
        duration:duration,
    }
    axios({
        method:'post',
        url:config.base_dir+'/api/activity/',
        headers:{
            "Authorization":token,
        },
        data:data
    }).then(data=>{

    })
    .catch(err=>{
        console.log("error in saving the call Success details : ", err)
    })

}
export const initiateSend = ()=>(dispatch)=>{
    dispatch({
        type:INITIATE_SEND
    })
}
export const callFailedUpdate = ( touser, topic)=>(dispatch)=>{
    var token = JSON.parse(localStorage.getItem('token'));
    var data={
        touser:touser,
        activity:config.CALL_FAILED,
        subject:topic,
        link:null,
        duration:null,
    }
    axios({
        method:'post',
        url:config.base_dir+'/api/activity/',
        headers:{
            "Authorization":token,
        },
        data:data
    }).then(data=>{
    })
    .catch(err=>{
        console.log("error in saving the call fail details : ", err)
  
    })
}

export const missCall = () =>(dispatch)=>{
    dispatch({
        type:MISS_CALL
    });
 }

export const getRecieverData=(profileImage,profileName,userId)=>(dispatch)=>{
    dispatch({
        type:SAVE_RECIEVER_DATA,
        profileImage:profileImage,
        profileName:profileName,
        userId:userId
    })
}