import {SAVE_EXTENSION_DETAILS, GET_SOURCE_ID} from './types';
import config from '../config/config'


export const saveExtensionDetails = (source,origin)=>(dispatch)=>{
    dispatch({
        type:SAVE_EXTENSION_DETAILS,
        source:source,
        origin:origin
    })
}

export const addExtraTimerfromReciever = (source,origin)=>dispatch=>{
    const addTimer = {
        
        type:config.ADD_EXTRA_MIUTE_TO_EXTENSION_RECIEVER,
        data:{}
    }
    if (source !== null)
        source.postMessage(addTimer, origin);
    else
        window.postMessage(addTimer, '*');
}

export const displayScreenSharebutton = (source,origin)=>(dispatch)=>{
    console.log("got herr to host")
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

export const postStartCall = (action,origin,otherPersonPic,extSource,timeAloted,otherPersonProfileId)=>(dispatch)=>{
    const token = JSON.parse(localStorage.getItem('token'));
    localStorage.setItem('action',JSON.stringify(action))
    var callStart = null;
    console.log("uploading action :",action)
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
        localStorage.setItem('timer',JSON.stringify(timeAloted));
        callStart = {
            type:config.START_CALL,
            data:{
                timer:timeAloted,
                action:action,
                token:token,
            }
        }

    }
    else{
        localStorage.setItem('shareDisplay',JSON.stringify("block"));
        console.log("otherPersonPic : ",otherPersonPic)
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
   
    if (extSource !== null) {
        extSource.postMessage(callStart, origin);
    }
    else{
        window.postMessage(callStart, "*")
    }
}