import config from '../config/config'
import axios from 'axios'
import {SEND_OTP,
    SEND_OTP_FAILED,
    VARIFY_ACTIVATED,
    ACTIVATED_ACCOUNT,
    NOT_ACTIVATED_ACCOUNT,
    ACTIVATED_PROFILE,
    VARIFY_ACTIVATED_FAILED,
    RE_SEND_OTP,
    RE_SEND_OTP_FAILED,
    REPLY_EMAIL_SENT,
    SAVE_REPLY_EMAIL_OPTION,
    CANCEL_EMAIL_OPTION} from './types'


export const saveReplyEmailOption=(issueId, userid)=>(dispatch)=>{
    dispatch({
        type:SAVE_REPLY_EMAIL_OPTION,
        issueId:issueId,
        userid:userid
    })
}
export const cancelEmailOption=()=>(dispatch)=>{
    dispatch({
        type:CANCEL_EMAIL_OPTION
    })
}
export const sendEmail=(issueid,userid)=>(dispatch)=>{
    var token = JSON.parse(localStorage.getItem('token'));
    var data={
        issueid:issueid,
        replierId:userid
    }
    axios({
        method:'POST',
        url:config.base_dir+'/api/message/replyaction',
        data,
        headers:{
            "Authorization":token
        }
    }).then(response=>{
        console.log("its happened")
        if(response.status===201){
            dispatch({
                type:REPLY_EMAIL_SENT
            })
        }
    })
    .catch(err=>{
        console.log("it did not hapoend")
    })
}
export const resendOtp =(email)=>(dispatch)=>{
    var token = JSON.parse(localStorage.getItem('token'))
    var data={
        email:email,
    }
    axios({
        method:'post',
        url:config.base_dir+'/api/users/resendotp',
        data:data,
        headers:{
            "Authorization": token,
        }
    }).then(response=>{
        if(response.status===201|| response.status === 304){
            if(response.data.success ===1){
                dispatch({
                    type:RE_SEND_OTP,
                })
            }
            else{
                dispatch({
                    type:RE_SEND_OTP_FAILED
                })
            }
        }
        else{
            dispatch({
                type:RE_SEND_OTP_FAILED
            })
        }
    })
    .catch(error=>{
        dispatch({
            type:SEND_OTP_FAILED,
            error:error
        })
    })

}

export const sendOtp=(email,otp)=>(dispatch)=>{
    var token = JSON.parse(localStorage.getItem('token'))
    var data={
        email:email,
        otp:otp
    }
    axios({
        method:'post',
        url:config.base_dir+'/api/users/sendotp',
        data:data,
        headers:{
            "Authorization": token,
        }
    }).then(response=>{
        if(response.status===201|| response.status === 304){
            if(response.data.success ===1){
                dispatch({
                    type:SEND_OTP,
                })
            }
            else{
                dispatch({
                    type:SEND_OTP_FAILED
                })
            }
        }
        else{
            dispatch({
                type:SEND_OTP_FAILED
            })
        }
    })
    .catch(error=>{
        dispatch({
            type:SEND_OTP_FAILED,
            error:error
        })
    })
}
export const activateProfile=(email)=>(dispatch)=>{
    var token = JSON.parse(localStorage.getItem('token'))
    var data={
        email:email
    }
    axios({
        method:'put',
        url:config.base_dir+'/api/users/emailactivation',
        data:data,
        headers:{
            "Authorization":token
        }
    })
    .then((response)=>{

        if(response.status===200){
            if(response.data.success===1){
                var token = JSON.stringify(response.data.token)
                var storeToken = new Promise(function (resolve, reject) {
                        localStorage.setItem('token', token)
                        var token1 = JSON.parse(localStorage.getItem('token'))
                        resolve(token1)
                    });

                    storeToken.then(function (token) {
                        dispatch({
                            type:ACTIVATED_PROFILE
                        })
                    })
                
            }
        }
    })

}
export const varifyActivation=(twitterHandle)=>(dispatch)=>{
    axios({
        method:'get',
        url:config.base_dir+'/api/users/activationstatus/'+twitterHandle,
    })
    .then(response=>{
        if(response.status===200||response.status===304){
            if(response.data.success === 1)
                dispatch({
                    type:ACTIVATED_ACCOUNT,
                    isvarified:response.data.success
                })
            else
                dispatch({
                    type:NOT_ACTIVATED_ACCOUNT, 
                })
        }
        else{
            dispatch({
                type:NOT_ACTIVATED_ACCOUNT,
            })
        }
    })
    .catch(()=>{
        dispatch({
            type:NOT_ACTIVATED_ACCOUNT,
        })
    })

}

export const varifyEmail=()=>(dispatch)=>{
    var token = JSON.parse(localStorage.getItem('token'))
    axios({
        method:'get',
        url:config.base_dir+'/api/users/emailStatus',
        headers:{
            "Authorization": token,
        }
    })
    .then(response=>{
        if(response.status===200||response.status===304){
            dispatch({
                type:VARIFY_ACTIVATED,
                isvarified:response.data.success
            })
        }
        else{
            dispatch({
                type:VARIFY_ACTIVATED_FAILED,
            })
        }
    })
    .catch(()=>{
        dispatch({
            type:VARIFY_ACTIVATED_FAILED,
        })
    })

}