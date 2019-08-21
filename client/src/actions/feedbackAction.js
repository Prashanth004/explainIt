import { CHNAGE_SHARE_EXP,CHANGE_USABILITY,SAVED_RECORDING,NOTHING_FILLED,
    RESET_FEEDBACK_ACTIONS,SAVE_FEEDBACK_INITIATED,SAVED_FEEDBACK,
    RECORD_CLICKED,CHANGE_SUGGESTION,DISCARD_RECORDING,UPDATE_FEDDBACK_TEST} from './types';
import config from '../config/config'
import axios from 'axios';

export const changeShareExperience =(value)=>(dispatch)=>{
    dispatch({
        type: CHNAGE_SHARE_EXP,
        payload:value
    })
}
export const changeUability =(value)=>(dispatch)=>{
    dispatch({
        type: CHANGE_USABILITY,
        payload:value
    })
}
export const changeSuggestion = (value)=>(dispatch)=>{
    dispatch({
        type: CHANGE_SUGGESTION,
        payload:value
    })
}
export const clickRecord = ()=>dispatch =>{
    dispatch({
        type:RECORD_CLICKED,
    })
}

export const resetFeedback =()=>(dispatch)=>{
    dispatch({
        type:RESET_FEEDBACK_ACTIONS
    })
}

export const discardRecorded = ()=>dispatch=>{
    dispatch({
        type: DISCARD_RECORDING
    })
}

export const saveRecording = (blob)=>(dispatch)=>{
    var projectName = config.dataTime;
    dispatch({
        type:SAVED_RECORDING,
        filepath :  config.base_dir + '/public/audio/'+ projectName+'video.mkv'
    });
    var videoFile = new File([blob], 'video.mkv', {
        type: 'video/mkv'
    });
    var fd = new FormData();
    fd.append('projectName', projectName);
    fd.append('videoData', videoFile);
  
    var token = JSON.parse(localStorage.getItem('token'))
    // Axios.post(/api/feedback')
    axios({
        method:'post',
        url: config.base_dir + '/api/feedback/savefile',
        headers: {
            "Authorization":token,
        },
        data: fd,
        onUploadProgress: (progressEvent) => {
            var percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
               console.log("Progress:-"+percentCompleted);
        }
    }).then(response=>{
        if(response.status===201)
        {   
           
           
        }
    }).catch(error=>{
        console.log("error : ",error)
    })
   
}


export const saveFeedback = (userid,experience,usability,suggestion,videofilepath)=>(dispatch)=>{
    dispatch({
        type:SAVE_FEEDBACK_INITIATED
    })
    const postData={
        userid:userid,
        experience:experience,
        usability:usability,
        suggestion:suggestion,
        videofilepath:videofilepath
    };
    var token = JSON.parse(localStorage.getItem('token'));
    axios({
        method:'post',
        url: config.base_dir + '/api/feedback/',
        headers: {
            "Authorization":token,
        },
        data: postData,
    }).then(response=>{
        if(response.status===201)
        {
            dispatch({
                type: SAVED_FEEDBACK
            })   
           
        }
    }).catch(error=>{
        console.log("error : ",error)
    })

}

export const getFeedBackValididty = ()=>(dispatch)=>{
    var token = JSON.parse(localStorage.getItem('token'));
    axios({
        method:'get',
        url: config.base_dir + '/api/feedback/user',
        headers: {
            "Authorization":token,
        }
    }).then(response=>{
        if(response.status===200 || response === 304)
        {   
            if(response.data.success ===1){
               
                if(response.data.data.length > 0){
                    dispatch({
                        type : UPDATE_FEDDBACK_TEST,
                        payload:true
                    })
                }
                else{
                    dispatch({
                        type : UPDATE_FEDDBACK_TEST,
                        payload:false
                    }) 
                }
            }
               
            else{
                dispatch({
                    type : UPDATE_FEDDBACK_TEST,
                    payload:false
                }) 
            }
           
        }
    }).catch(error=>{
        dispatch({
            type : UPDATE_FEDDBACK_TEST,
            payload:false
        }) 
        console.log("error : ",error)
    })
}

export const nothingfilled =()=>(dispatch)=>{
    dispatch({
        type:NOTHING_FILLED
    })
}

// user
