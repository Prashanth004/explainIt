
import axios from 'axios'
import {GET_PROFILE_ID, GOT_NO_PROFILE} from './types'
import config from '../config/config'


export const getRecpientId = (twitterHandle) =>(dispatch)=>{
    console.log("Get Recpient Id of ",twitterHandle)
    var token = JSON.parse(localStorage.getItem('token'))
    axios({
        method:'get',
        url:config.base_dir+'/api/tweetactions/getid/'+twitterHandle,
        headers: {
            "Authorization": token,
        }
    }).then(res=>{
        if(res.data.success===1){
            dispatch({
                type:GET_PROFILE_ID,
                payload:res.data.id
            })
        }
        else{
            console.log(res.data)
            dispatch({
                type:GOT_NO_PROFILE,
                payload:false
            })
        }
     
    }).catch(err=>{
        console.log("error : ", err)
    })





}

  