import {CLICKED_SUBMIT,CLICKED_SUBMIT_START,INVALID_TWITTER_HANDLE,CHANGE_FORM_INPUT} from './types';
import axios from 'axios'
import config from '../config/config'


export const clickAction =(twitterHandle)=>(dispatch)=>{
    dispatch({
        type:CLICKED_SUBMIT_START,
    })
    var data={
        twitterhandler : twitterHandle
    }
    axios({
        method: 'POST',
        url: config.base_dir + '/api/users/onboard',
        data:data
    }).then(response=>{
        console.log('response : ',response)
        if(response.status===200){
            if(response.data.success ===1){
                dispatch({
                    type:CLICKED_SUBMIT,
                })
            }
            else{
                console.log("dispacthinf invaid message")
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
export const changeTwiiterHandle = (twitterHandle)=>(dispatch)=>{
    dispatch({
        type:CHANGE_FORM_INPUT,
        payload:twitterHandle
    })
}