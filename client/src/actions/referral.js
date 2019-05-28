import { SAVE_REFERRAL} from './types';
import axios from 'axios';
import config from '../config/config';

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