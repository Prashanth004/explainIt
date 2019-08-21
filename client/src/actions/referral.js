import { SAVE_REFERRAL,TOGGLE_CONTACT_DISPLAY,UPDATE_TWITTER_HANDLE_TEXT,
    SELF_REFERAL,ALREADY_EXPLAINED,ALREADY_REFERRED,START_TWITTER_ID_FETCH,RESET_TWITTER_API_VALUES,
    FAILED_TO_GET_REFERRALS,GOT_ALL_REFERRALS,RESET_ALL_REFERRAL_ACTION} from './types';
import axios from 'axios';
import config from '../config/config';
import { get } from 'https';

export const saveReferral = (problemOwner, referrer, referreetwitter,referreeid, issue)=>(dispatch)=>{
    var token = JSON.parse(localStorage.getItem('token'));
    var postData={
        problemOwner : problemOwner,
        referrer : referrer, 
        referreetwitter : referreetwitter, 
        issue : issue,
        referreeid:referreeid
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
    }).catch(error=>{
        console.log("referral.js : saveReferral : error : ",error)
    })
}

export const getAllReferral = ()=>(dispatch)=>{
    // var token = JSON.parse(localStorage.getItem('token'));
    // axios({
    //     method:get,
    //     url:config.base_dir+'/api/referral/',
    //     headers: {
    //         "Authorization":token,
    //     }
    // }).then(response=>{
    //     dispatch({
    //         type:GOT_ALL_REFERRALS,
    //         payload:response.data.data
    //     })
    // })
    // .catch(error=>{
    //     dispatch({
    //         type:FAILED_TO_GET_REFERRALS
    //     })
    // })
}

export const toggleContactsDisplay =()=>(dispatch)=>{
    dispatch({
        type:TOGGLE_CONTACT_DISPLAY
    })


}
export const updateTwitterHandleInput = (vlaue)=>(dispatch)=>{
    dispatch({
        type:RESET_TWITTER_API_VALUES
    })
    dispatch({
        type:UPDATE_TWITTER_HANDLE_TEXT,
        payload:vlaue
    })

}
export const selfReferAct = ()=>(dispatch)=>{
    dispatch({
        type:SELF_REFERAL
    })

}
export const resetAllReferralAction = ()=>dispatch=>{
    dispatch({
        type:RESET_ALL_REFERRAL_ACTION
    })
}
export const alreadyExplainedAct = ()=>(dispatch)=>{
    dispatch({
            type:ALREADY_EXPLAINED        
    })

}
export const alreadyReferredAct = ()=>(dispatch)=>{
    dispatch({
        type:ALREADY_REFERRED
    })

}
export const startTestTwitterHandle = ()=>dispatch=>{
    dispatch({
        type:START_TWITTER_ID_FETCH
    })
}
