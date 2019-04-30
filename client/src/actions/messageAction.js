import config from '../config/config'
import axios from 'axios'
import {SEND_MESSAGE,
     SEND_FAILED,
     FETCH_MESSAGES,
     FETCH_FAILED,
     CANCEL_MESSAGE_STATE,
     HIDE_TEXT_BOX_AFTER_RECORDONG,
     FROM_SHARE_TO_RECORD,
     GET_TOTAL_UNREAD,
     SUCCESS_IN_CHNAGE_READ_STATE,
     FAILURE_IN_CHNAGE_READ_STATE,
     SHOW_TEXT_BOX_AFTER_RECORDONG,
     EXPLAIN_ISSUE,
     JUST_RECORD} from './types'


     export const fromShareToRecord =()=>(dispatch)=>{
         dispatch({
             type:FROM_SHARE_TO_RECORD
         })
     }
     export const explainIssue =()=>(dispatch)=>{
         dispatch({
             type:EXPLAIN_ISSUE
         })
     }
     export const JustRecord = ()=>(dispatch)=>{
         dispatch({
             type:JUST_RECORD
         })
     }
export const getTotalUnread=()=>(dispatch)=>{
    var token = JSON.parse(localStorage.getItem('token'))
    axios({
        method:'get',
        url:config.base_dir+'/api/message/totalunread',
        headers:{
            "Authorization":token,
        }
    })
    .then(response=>{
        if(response.status===200 || response.status === 304)
        {

            dispatch({
                type:GET_TOTAL_UNREAD,
                payload:response.data.number
            })
        }
    })
    .catch(error=>{
        console.log("error : ", error)
        
    })
}
export const changeReadStatus = (messageId)=>(dispatch)=>{
    var token = JSON.parse(localStorage.getItem('token'))
    axios({
        method:'put',
        url:config.base_dir+'/api/message/changeunread/'+messageId,
        headers:{
            "Authorization":token,
        }
    }).then(response=>{
        if(response.status === 200 || response.status === 304){
            dispatch({
                type:SUCCESS_IN_CHNAGE_READ_STATE
            })
        }
        else{
            dispatch({
                type:FAILURE_IN_CHNAGE_READ_STATE
            })
        }
    }).catch(error=>{
        console.log("error : ",error)
        dispatch({
            type:FAILURE_IN_CHNAGE_READ_STATE
        })
    })
}
export const sendMessage = (link, fromId, ToId, subject)=>(dispatch)=>{
  
    var token = JSON.parse(localStorage.getItem('token'))
    var postData = {
        link: link,
        subject:subject,
        fromUser: fromId,
        touser:ToId
      };
      
      let axiosConfig = {
        headers: {
            "Authorization":token,
        }
      };

      axios.post(config.base_dir+'/api/message', postData, axiosConfig).then(response=>{
        if(response.status=== 201 || response.status === 301)
        {
            dispatch({
                type:SEND_MESSAGE,
                payload:true
            })
        }
        else{
            dispatch({
                type:SEND_FAILED,
                payload:true
            })
        }
    })

}
export const hideTextBoxAfterRecord=()=>(dispatch)=>{
    dispatch({
        type:HIDE_TEXT_BOX_AFTER_RECORDONG
    })
}
export const showTextBoxAfterRecord=()=>(dispatch)=>{
    dispatch({
        type:SHOW_TEXT_BOX_AFTER_RECORDONG
    })
}
export const cancelAllMessageAction=()=>(dispatch)=>{
    dispatch({
        type:CANCEL_MESSAGE_STATE
    })
}
export const getAllMessages=(userId)=>(dispatch)=>{
    var allMessage = null
    var token = JSON.parse(localStorage.getItem('token'))
    axios({
        method:'get',
        url:config.base_dir+'/api/message/'+userId,
        headers:{
            "Authorization":token,
        }
    }).then(response=>{
        if(response.status===200|| response.status === 301){
            allMessage = response.data.data;
            allMessage.forEach((message,index)=>{
                if(message.fromuser!==null){

                
                    axios({
                    method:'get',
                    url:config.base_dir+"/api/users/id/"+message.fromuser,
                    headers:{
                        "Authorization":token,
                    }
                }).then(res=>{
                    if(res.status=== 200 || res.status === 301){
                        const newTestJson = JSON.parse(JSON.stringify(allMessage));
                        newTestJson[index]['profilepic']=res.data.data.profilepic;
                        newTestJson[index]['username']=res.data.data.username;
                        allMessage =newTestJson
                    }
                    dispatch({
                        type: FETCH_MESSAGES,
                        allMessage: allMessage,
                       
                    })
                })
            
                .catch(error=>{
                    dispatch({
                        type:FETCH_FAILED
                    })
                })
               
            }
            })
            

        }
    }).catch(error=>{
        console.log("error : ",error)
    })

}