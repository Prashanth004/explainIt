import config from '../config/config'
import {GET_PROFILE_BY_TWITTER_HANDLE,EMPTY_TWITTER_HANDLE,STARTED_TWEET_TEST,
     SHARE_TO_SELF,NO_INTERNET,UPDATE_TWITTER_HANDLE,RESET_TWITTER_VLUES,REST_VISIT_TWITTER_ACTION,
    GOT_NULL_BY_TWITTWRHANDLE,SET_VISIT_PROFILE_DETAILS } from './types'
import axios from 'axios'

export const getProfileByTwitterHandle = (TwitterHandle) => (dispatch)=>{
    var token = JSON.parse(localStorage.getItem('token'));
   
    axios({
        method: 'get',
        url: config.base_dir+'/api/users/twitterhandle/'+TwitterHandle,
        headers: {
            "Authorization": token,
        }
       
    }).then(response1=>{
        if (response1.status ===200 || response1.status === 304) {
        if(response1.data.data!==null){
            dispatch({
                type:GET_PROFILE_BY_TWITTER_HANDLE,
                email : response1.data.data.email,
                userName : response1.data.data.username,
                profilePic : response1.data.data.profilepic,
                id : response1.data.data.id,
                onlineStatus:response1.data.data.online,
                busyStatus:response1.data.data.busy
            })
        }
        else{
            dispatch({
                type:GOT_NULL_BY_TWITTWRHANDLE,
                payload:false
            })
        }}
    

    })
    .catch(err=>{
        console.log("error : ",err)
    })

}
export const setVisitProfile = (twitterhandle)=>(dispatch)=>{
    dispatch({
        type:SET_VISIT_PROFILE_DETAILS,
        payload:twitterhandle
    })
}

export const shareToSelfAction = ()=>(dispatch)=>{
    dispatch({
        type:SHARE_TO_SELF
    })
}
export const noInternetAction = ()=>dispatch =>{
    dispatch({
        type:NO_INTERNET
    })
}
export const updateTwitterHandle = (value)=>(dispatch)=>{
    dispatch({
        type:UPDATE_TWITTER_HANDLE,
        payload:value
    })
}
export const emptyTwitterHandleFunc = ()=>dispatch=>{
    dispatch({
        type:EMPTY_TWITTER_HANDLE,

    })
}
export const resetTwittervalues = ()=>dispatch=>{
    dispatch({
        type:RESET_TWITTER_VLUES
    })
}

export const strtedTweetTest =()=>(dispatch)=>{
    dispatch({
        type:STARTED_TWEET_TEST
    })
}
export const resetVisitTwitterAction =()=>dispatch=>{
    dispatch({
        type:REST_VISIT_TWITTER_ACTION
    })
}