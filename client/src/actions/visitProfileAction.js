import config from '../config/config'
import {GET_PROFILE_BY_TWITTER_HANDLE } from './types'
import axios from 'axios'

export const getProfileByTwitterHandle = (encTwitterHandle) => (dispatch)=>{
    console.log("encTwitterHandle : ",encTwitterHandle)
    var token = JSON.parse(localStorage.getItem('token'));
    console.log("visitProfileActiion is being visited")
    axios({
        method: 'get',
        url: config.base_dir+'/users/twitterhandle/'+encTwitterHandle,
        headers: {
            "Authorization": token,
        }
    }).then(response1=>{
        if (response1.status == 200 || response1.status == 304) {
        console.log("response from server for usr by twitter Id :" ,response1.data)
        dispatch({
            type:GET_PROFILE_BY_TWITTER_HANDLE,
            email : response1.data.data.email,
            userName : response1.data.data.username,
            profilepic : response1.data.data.profilepic,
            id : response1.data.data.id

        })
        
        }
        else{
            console.log("something went wrong")
        }

    })
    .catch(err=>{
        console.log("error : ",err)
    })

}