import config from '../config/config'
import {GET_PROFILE_BY_TWITTER_HANDLE ,GOT_NULL_BY_TWITTWRHANDLE } from './types'
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
        }
     
        }
        else{
        }

    })
    .catch(err=>{
        console.log("error : ",err)
    })

}