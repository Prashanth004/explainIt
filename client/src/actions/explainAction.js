import {EXPLIN_BY_RECORD,EXPLIN_BY_SHARE,SAVE_TOPIC_OF_THE_CALL, RESET_EXPLAIN_ACTIONS, EXPLAIN_BY_REFER} from './types'
import config from '../config/config';
import axios from 'axios';
export const explainByRecord = (twitterhandle, twitterid, issueId,topic)=>(dispatch)=>{

    dispatch({
        type:EXPLIN_BY_RECORD,
        payload:{
            twitterhandle,
            twitterid,
            issueId
        }
    })
    dispatch({
        type:SAVE_TOPIC_OF_THE_CALL,
        payload:topic
    })
}
export const explainByShare =(twitterhandle,topic)=>dispatch=>{
    dispatch({
        type:EXPLIN_BY_SHARE,
        payload:twitterhandle
    });
    dispatch({
        type:SAVE_TOPIC_OF_THE_CALL,
        payload:topic
    })
}
export const explainByRefer = ()=>(dispatch)=>{
    dispatch({
        type:EXPLAIN_BY_REFER
    })
}

export const resetExplainAction = ()=>(dispatch)=>{
    dispatch({
        type:RESET_EXPLAIN_ACTIONS
    })
}
export const explainSuccessedUpate = (touser, topic, link)=>(dispatch)=>{
    var token = JSON.parse(localStorage.getItem('token'));
    var data={
        touser:touser,
        activity:config.EXPLAIN_SUCCESS,
        subject:topic,
        link:link,
        duration:null,
    }
    axios({
        method:'post',
        url:config.base_dir+'/api/activity/',
        headers:{
            "Authorization":token,
        },
        data:data
    }).then(data=>{

    })
    .catch(err=>{
        console.log("error in saving the call Success details : ", err)
    })

}