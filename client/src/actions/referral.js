import { SAVE_REFERRAL,FAILED_TO_GET_REFERRALS,GOT_ALL_REFERRALS} from './types';
import axios from 'axios';
import config from '../config/config';
import { get } from 'https';

export const saveReferral = (problemOwner, referrer, referreetwitter, issue)=>(dispatch)=>{
    var token = JSON.parse(localStorage.getItem('token'));
    var postData={
        problemOwner : problemOwner,
        referrer : referrer, 
        referreetwitter : referreetwitter, 
        issue : issue
    }
    let axiosConfig = {
        headers: {
            "Authorization":token,
        }
      };

    axios.post(config.base_dir+'/api/referral', postData, axiosConfig)
    .then(response=>{
        if(response.status === 201){
            dispatch({
                type:SAVE_REFERRAL
            })
        }
    })
}

export const getAllReferral = ()=>(dispatch)=>{
    var token = JSON.parse(localStorage.getItem('token'));
    axios({
        methos:get,
        url:config.base_dir+'/api/referral/',
        headers: {
            "Authorization":token,
        }
    }).then(response=>{
        dispatch({
            type:GOT_ALL_REFERRALS,
            payload:response.data.data
        })
    })
    .catch(error=>{
        dispatch({
            type:FAILED_TO_GET_REFERRALS
        })
    })
}