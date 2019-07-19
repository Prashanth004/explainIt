import {SAVE_EXTENSION_DETAILS, GET_SOURCE_ID} from './types';
import config from '../config/config'


export const saveExtensionDetails = (source,origin)=>(dispatch)=>{
    dispatch({
        type:SAVE_EXTENSION_DETAILS,
        source:source,
        origin:origin
    })
}

export const otherPeerShareScreen = (source,origin) =>(dispatch)=>{
    const peerScreenShare = {
        
        type:config.SCREEN_FROM_OTHER_PEEER_TO_EXTENSION,
        data:{}
    }
    if (source !== null)
        source.postMessage(peerScreenShare, origin);
    else
        window.postMessage(peerScreenShare, '*');

}
export const pauseRecorderFromFloater = (callTabid)=>(dispatch)=>{
    localStorage.setItem('infoDisplay', JSON.stringify(config.PAUSED_RECORDER_INFO))
    localStorage.setItem('pauseState', config.PAUSED_RECORDER);
    const  pauseRecorder ={
        'type':config.PAUSE_FROM_FLOATER,
        'data': {
            'tabId': callTabid
        }
    }
    window.parent.postMessage(pauseRecorder, "*");
   
   
}
export const resumeRecorderFromFloater = (callTabid)=>(dispatch)=>{
    localStorage.setItem('infoDisplay', JSON.stringify(config.RESUMED_RECORDER_INFO))
    localStorage.setItem('pauseState', config.RESUMED_RECORDER);
    const  pauseRecorder ={
        type:config.RESUME_FROM_FLOATER,
        'data': {
            'tabId': callTabid
        }
    }
    window.parent.postMessage(pauseRecorder, "*");
  
}



export const addExtraTimerfromReciever = (source,origin)=>dispatch=>{
    localStorage.setItem('infoDisplay', JSON.stringify(config.ADDED_EXTRA_MINTUE_INFO))
    const addTimer = {
        
        type:config.ADD_EXTRA_MIUTE_TO_EXTENSION_RECIEVER,
        data:{}
    }
    if (source !== null)
        source.postMessage(addTimer, origin);
    else
        window.postMessage(addTimer, '*');
}
export const decreaseTimerfromReciever = (source,origin)=>dispatch=>{
    localStorage.setItem('infoDisplay', JSON.stringify(config.ADDED_EXTRA_MINTUE_INFO))
    const addTimer = {
        
        type:config.DECREASE_MINUTE_TO_EXTENSION_RECIEVER,
        data:{}
    }
    if (source !== null)
        source.postMessage(addTimer, origin);
    else
        window.postMessage(addTimer, '*');
}

export const displayScreenSharebutton = (source,origin)=>(dispatch)=>{
    localStorage.setItem('infoDisplay', JSON.stringify(config.PEER_SHARE_SCREEN_INFO))
    const displayIcon = {
        type:config.DISPLAY_SHARE_ICON_TO_EXTENSION,
        data:{}
    }
    if (source !== null)
        source.postMessage(displayIcon, origin);
    else
        window.postMessage(displayIcon, '*');
}
export const HideScreenSharebutton = ()=>(dispatch)=>{
    localStorage.setItem('infoDisplay', JSON.stringify(config.YOU_SHARED_SCREEN_INFO))
    const hideIcon = {
        type:config.HIDE_SHARE_ICON_TO_EXTENSION,
        data:{}
    }
    window.parent.postMessage(hideIcon, "*");
}
export const saveSourceId = (sourceId)=>(dispatch)=>{
    dispatch({
        type:GET_SOURCE_ID,
        sourceId:sourceId
    })

}
export const postEndCall = (action,source,origin)=>dispatch=>{
    localStorage.setItem('infoDisplay', JSON.stringify(config.SCREEN_SHARE_ENDED_INFO))
    const callEnd = {
        type: action,
        data: {}
    }
    if (source !== null)
        source.postMessage(callEnd, origin);
    else
        window.postMessage(callEnd, '*');
}

export const refreshExtension = (action,source,origin)=>dispatch=>{
    localStorage.setItem('muteState',JSON.stringify(config.UN_MUTED))
    localStorage.setItem('action',JSON.stringify(action))
    const refreshFloater = {
        type: config.REFRESH_EXPLAIN_FLOATER,
        data: {

        }
    }
    if (source !== null) {
        source.postMessage(refreshFloater, origin);
    }
    else {
        window.postMessage(refreshFloater, "*")
    }
}
export const otherPeerMute = (source,origin,muteState)=>dispatch=>{
    console.log("I am reacting action Page")
    const muteMsg =(muteState === "muted")?"Peer Muted":"Peer Unmuted";
    console.log("AP : muteMsg ",muteMsg)
    const refreshFloater = {
        type: config.OTHER_PEER_MUTE_UNMUTE_FROM_WEB,
        data: {
            muteMsg:muteMsg
        }
    }
    if (source !== null) {
        source.postMessage(refreshFloater, origin);
    }
    else {
        window.postMessage(refreshFloater, "*")
    }
}
export const postStartCall = (action,origin,otherPersonPic,extSource,timeAloted,otherPersonProfileId)=>(dispatch)=>{
    var curTime = {
        'hours':0,
        'minutes':config.RECORD_TIME,
        'seconds':0}
    localStorage.setItem('curTime',JSON.stringify(curTime));
    localStorage.setItem('pauseState', JSON.stringify(config.RESUMED_RECORDER))
    localStorage.setItem('muteState',JSON.stringify(config.UN_MUTED))
    const token = JSON.parse(localStorage.getItem('token'));
    localStorage.setItem('action',JSON.stringify(action))
    var callStart = null;
    if(action === config.FULL_SCREEN_SHARE){
        localStorage.setItem('shareDisplay',JSON.stringify("none"))
        localStorage.setItem('profilePic',JSON.stringify(otherPersonPic));
        callStart = {
            type:config.START_CALL,
            data:{
                timer:timeAloted,
                profilePic:otherPersonPic,
                action:action,
                token:token,
                receiverId : otherPersonProfileId
            }
        }
    }
    else if(action === config.FULL_SCREEN_RECORD){
       
        callStart = {
            type:config.START_CALL,
            data:{
                timer:curTime,
                action:action,
                token:token,
                pauseState:config.RESUMED_RECORDER
            }
        }

    }
    else{
        localStorage.setItem('shareDisplay',JSON.stringify("block"));
        localStorage.setItem('profilePic',JSON.stringify(otherPersonPic));
        callStart = {
            type:config.START_CALL,
            data:{
                timer:timeAloted,
                profilePic:otherPersonPic,
                action:action,
                token:token
            }
        }
    }
   
    if (extSource === null || extSource === undefined) {
        window.postMessage(callStart, "*")
    }
    else{
        extSource.postMessage(callStart, origin);
    }
}