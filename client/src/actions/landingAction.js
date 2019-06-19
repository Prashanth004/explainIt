import {CLICKED_SUBMIT,RESET_LANDING_ACTION,CLICKED_SUBMIT_START,INVALID_TWITTER_HANDLE,CHANGE_FORM_INPUT} from './types';
import axios from 'axios'
import config from '../config/config'


export const clickAction =(twitterHandle, isreferr)=>(dispatch)=>{
    
    dispatch({
        type:CLICKED_SUBMIT_START,
    })
    var data={
        twitterhandler : twitterHandle
    }
    if(isreferr!== "referr"){
   
    axios({
        method: 'POST',
        url: config.base_dir + '/api/users/onboard',
        data:data
    }).then(response=>{
        if(response.status===200){
            if(response.data.success ===1){
                dispatch({
                    type:CLICKED_SUBMIT,
                })
            }
            else{
                dispatch({
                    type:INVALID_TWITTER_HANDLE,
                })
            }
        }
    }).catch(error=>{
        dispatch({
            type:CLICKED_SUBMIT,
        })
    })
}


   else{
    var token = JSON.parse(localStorage.getItem('token'))
    var data2={
        twitterhandle : twitterHandle
    }
    axios({
        method:'post',
        url:config.base_dir+'/api/tweetactions/getid',
        headers: {
            "Authorization": token,
        },
        data:data2
    }).then(res=>{
        if(res.data.success===1){
            dispatch({
                type:CLICKED_SUBMIT,
                payload:res.data,
                twitterHandle :twitterHandle
            })
        }
        else{
            dispatch({
                type:INVALID_TWITTER_HANDLE,
                payload:false
            })
        }
     
    }).catch(err=>{
        dispatch({
            type:CLICKED_SUBMIT,
        })
    })
}
    
    
}
export const changeTwiiterHandle = (twitterHandle)=>(dispatch)=>{
    dispatch({
        type:CHANGE_FORM_INPUT,
        payload:twitterHandle
    })
}
export const resetLandingAction = ()=>(dispatch)=>{
    dispatch({
        type:RESET_LANDING_ACTION,
        })
}