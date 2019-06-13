
import axios from 'axios'
import {GET_PROFILE_ID,
    SEND_TWEETS,
    SEND_TWEET_FAILED,
     GOT_NO_PROFILE,
     RESET_TWITTER_API_VALUES,
     GET_TWITTER_HANDLE,
     GET_TWITTER_HANDLE_FAILED} from './types'
import config from '../config/config'


export const getRecpientId = (twitterHandle,userid) =>(dispatch)=>{
    var token = JSON.parse(localStorage.getItem('token'))
    var data = {
        id:userid,
        twitterhandle:twitterHandle
    }
    axios({
        method:'post',
        url:config.base_dir+'/api/tweetactions/getid',
        headers: {
            "Authorization": token,
        },
        data:data
    }).then(res=>{
        if(res.data.success===1){
            dispatch({
                type:GET_PROFILE_ID,
                payload:res.data,
                twitterHandle :twitterHandle
            })
        }
        else{
            dispatch({
                type:GOT_NO_PROFILE,
                payload:false
            })
        }
     
    }).catch(err=>{
        console.log("error : ", err)
    })





}

export const getTwitterHandles=()=>(dispatch)=>{
    var token = JSON.parse(localStorage.getItem('token'))
    
    axios({
        method:'get',
        url:config.base_dir+'/api/tweetactions/twitterhandles',
        headers: {
            "Authorization":token,
        }
    })
    .then(response=>{
        if(response.status===200 || response.status ===304){
        dispatch({
            type:GET_TWITTER_HANDLE,
            payload:response.data.data
        })
    }
    })
    .catch(err=>{
        dispatch({
            type:GET_TWITTER_HANDLE_FAILED
         
        })
    })

}

export const sendTweet=(sendTwHandle, 
recTwiandle, ProjectAccessLink)=>(dispatch)=>{
    var token = JSON.parse(localStorage.getItem('token'))
    var postData = {
        rectwiHandle: recTwiandle,
        caltwiHandle:sendTwHandle,
        LinktoAccess: ProjectAccessLink       
      };
      
      let axiosConfig = {
        headers: {
            "Authorization":token,
        }
      };
      axios.post(config.base_dir+'/api/tweetactions/tweet', postData, axiosConfig).then(response=>{
        if(response.status=== 200 || response.status === 301)
        {
            dispatch({
                type:SEND_TWEETS,
                payload:true
            })
        }
        else{
            dispatch({
                type:SEND_TWEET_FAILED,
                payload:false
            })

        }
    }).catch(err=>{
        dispatch({
            type:SEND_TWEET_FAILED,
            payload:false
        })
    })

}

export const resetValues =()=> (dispatch)=>{
    dispatch({
        type:RESET_TWITTER_API_VALUES
    })
}
  