import {FETCH_PROJ_BY_ISSUE,
    AUTH_FAIL,
    CLEAR_ANSWER,
    FILE_SIZE_TOO_LARGE,
    RESET_ISSUE_ACTION,
    UPDATE_ANSWER_WITH_IMAGE,
    CREATE_ISSUE_PROJECT_FAILED,
    CLEAR_SAVE_ACTIONS,
     CREATE_ISSUE_PROJECT,
     FETCH_STARTED,
     REST_PROJECT_ACTION,
     DELETE_SUCCESSFULL,
     UPDATE_TEXT_EXPLAIN,
     OPEN_EDIT_TEXT_MODAL,
     CLOSE_EDIT_TEXT_MODAL,
     UPDATE_LINK,
     GOT_NO_PROJECT,
     DELETE_FAILED} from './types'
import axios from 'axios'
import config from '../config/config';
import rn from 'random-number'
var options = {
    min: -1000000
    , max: 10000000
    , integer: true
}


export const checkPublicValue = (issueId) =>(dispatch)=>{
    var token = JSON.parse(localStorage.getItem('token'))
   
    axios({
        method:'get',
        url:config.base_dir+'/api/project/project/'+issueId,
        headers: {
            "Authorization": token,
        }
    }).then(response=>{
       
        if(response.status === 200 || response.status === 304){
          if(Number(response.data.data.public)){

              axios({
                  method:'put',
                  url:config.base_dir+'/api/project/private',
                  headers:{
                    "Authorization": token,
                  },
                  data:{
                    'projectId':issueId
                  }

              }).then(response=>{
              }).catch(error=>{
                  console.log(error)
              })
          }
        
        else{

            axios({
                method:'put',
                url:config.base_dir+'/api/project/public',
                headers:{
                  "Authorization": token,
                },
                data:{
                  'projectId':issueId
                }

            }).then(response=>{
            }).catch(error=>{
            })

        }
    }
    else{
    }

    }).catch(err=>{
        console.log("error : ",err)

    })
}

export const resetProjectActions = ()=>(dispatch)=>{
    dispatch({
        type:REST_PROJECT_ACTION
    })
}
export const openEditModal=(openEditModal)=>(dispatch)=>{
    dispatch({
        type:OPEN_EDIT_TEXT_MODAL,
        id:openEditModal

    })
}

export const closeEditModal=()=>(dispatch)=>{
    dispatch({
        type:CLOSE_EDIT_TEXT_MODAL
    })
}


export const updatProjectReason =(title,projectid)=>dispatch=>{
    var token = JSON.parse(localStorage.getItem('token'))
    var data={
        projectid :projectid,
        title:title
    }
    axios({
        method:'put',
        url:config.base_dir+'/api/project/edittext',
        data:data,
        headers:{
            "Authorization": token,
        }
    })
    .then(response=>{
        if(response.status===200 || response.status === 204){
           dispatch({
               type:UPDATE_TEXT_EXPLAIN
           })
        }
        else{
            console("error :")
        }
    })
    .catch(error=>{
        console.log('error : ',error)
    })
}



export const fetchProjectbyIssue = (issueId)=>dispatch =>{
    const UNAUTHORIZED = 401;
    axios.interceptors.response.use(
      response => response,
      error => {
          const {status} = error.response;
          if (status === UNAUTHORIZED) {
            localStorage.removeItem("token");
            dispatch({
                type: AUTH_FAIL,
                payload: false
            })
          }
          return Promise.reject(error);
     }
    );
    var allProjects = []
    var questProject = {}
    var answerProject = []
    var token = JSON.parse(localStorage.getItem('token'))
    dispatch({
        type: FETCH_STARTED
    })
    axios({
        method:'get',
        url:config.base_dir+'/api/project/issues/'+issueId,
        headers: {
            "Authorization": token,
        }
    }).then(response=>{
        var promises = [];
        if(response.status === 200){
            allProjects = response.data.data
             var getEmails = new Promise(function(resolve, reject){
                allProjects.forEach(function(projects, index){
                promises.push(axios.get(config.base_dir+'/api/users/email/'+projects.email))
             })
             axios.all(promises).then(function(results) {
                results.forEach(function(response, index) {
                    if(response.status===200){
                        const newTestJson = JSON.parse(JSON.stringify(allProjects));
                                newTestJson[index]['profilepic']=response.data.data.profilepic;
                                newTestJson[index]['username']=response.data.data.username;
                                newTestJson[index]['twitterhandle']=response.data.data.twitterhandle;
                                allProjects =newTestJson
                    }
                })
                questProject =  allProjects.find(preojects=> preojects.isquestion ==="true");
                answerProject = allProjects.filter(project => project.isquestion !=="true")
                dispatch({
                    type: FETCH_PROJ_BY_ISSUE,
                    questProject: questProject,
                    answerProject: answerProject
                })
             })
            })
            getEmails.then(function(ansProj){
            })

            
           
        }
        else{
            dispatch({
                type:GOT_NO_PROJECT
            })
        }
    }).catch(err=>{
        dispatch({
            type:GOT_NO_PROJECT
        })
        console.log("error : ",err)
    })
}
export const creatAnsProject =(textExplain, imgData, videoData,audioData,items,isquestion,issueIdFrmCpm,isPublic,action )=> (dispatch) =>{
    var rand = rn(options)
    var rand2 = rn(options)
    localStorage.setItem('newIssueId', JSON.stringify(rand2))
    dispatch({
        type:UPDATE_LINK,
        payload : rand2
    })
    var videoFile = new File([videoData], 'video.mkv', {
        type: 'video/mkv'
    });
    if(action === config.SERVER_SHARING)
    var AudioFile = new File([audioData], 'audio.mp3',{
        type:'audio/mp3'
    })

   var issueID
   var token = JSON.parse(localStorage.getItem('token'))
    if(isquestion === "false"){
      
        issueID = issueIdFrmCpm
    }
    else{
        issueID = rand2
    }
    if(issueID === undefined ){
        isquestion = "true";
        issueID = rand2
    }
    var fd = new FormData();
    var projectName = config.dataTime
    if(action === config.SERVER_SHARING){
        fd.append('imageData', imgData);
        fd.append('projectName', projectName);
        fd.append('videoData', videoFile);
        fd.append('videoData', AudioFile);
        fd.append('issueID',issueID);
        fd.append('textExplain',textExplain);
        fd.append('isquestion',isquestion);
        fd.append('public', isPublic);
        fd.append('action',config.SERVER_SHARING);
        fd.append('projectid',rand)
    }
    else{
        fd.append('imageData', imgData);
        fd.append('projectName', projectName);
        fd.append('videoData', videoFile);
        fd.append('issueID',issueID);
        fd.append('textExplain',textExplain);
        fd.append('isquestion',isquestion);
        fd.append('public', isPublic);
        fd.append('projectid',rand);
        fd.append('action',config.SERVER_RECORDING);
    }
   
    axios({
        method:'post',
        url: config.base_dir + '/api/project/file',
        headers: {
            "Authorization":token,
        },
        data: fd,
        onUploadProgress: (progressEvent) => {
            // const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
            // if (totalLength !== null) {
            //     this.updateProgressBarValue(Math.round( (progressEvent.loaded * 100) / totalLength ));
            // }
        }
    }).then(response => {
        if(response.status===201)
        {
            if(response.data.data.isquestion){
            dispatch({
                type:CREATE_ISSUE_PROJECT,
                payload:response.data.data
            })
            }
           
        }
       
    }).catch(error=>{
        if(error.response.status === config.ERROR_CODE_FILE_TOO_LARGE){
            dispatch({
                type:FILE_SIZE_TOO_LARGE
            })
        }
        else if(error.response.status === 500 || error.response.status === 451){
            dispatch({
                type:CREATE_ISSUE_PROJECT_FAILED,
                error:true
            })

        }
        else{
            dispatch({
                type:CREATE_ISSUE_PROJECT_FAILED,
                error : true
            })
          
        }
        console.log("error : ",error.response)
    })
}
export const clearAnswers = ()=>(dispatch)=>{
    dispatch({
        type:CLEAR_ANSWER
    })
}

export const ClearSavedActions = ()=>(dispatch)=>{
    dispatch({
        type:CLEAR_SAVE_ACTIONS
    })
}

export const getImagesByemail = (emailOfanswers,projects)=>(dispatch)=>{
    var promises = []
    projects.forEach((project,index)=>{
        promises.push(axios.get(config.base_dir+'/api/users/email/'+projects[index].email))
    })
    axios.all(promises).then(results=>{
        results.forEach(function(response, index) {
            if(response.staus === 200){
                projects[index]["profilepic"]=response.data.data.profilepic;
                projects[index]["username"]=response.data.data.username;
                projects[index]["twitterhandle"]=response.data.data.twitterhandle
            }
        })
        dispatch({
            type:UPDATE_ANSWER_WITH_IMAGE,
            payload:projects
        })

    }).catch(err=>{
        console.log("error in fetch user data : ",err)
    })

}

export const resetIssueActions =()=>dispatch=>{
    dispatch({
        type:RESET_ISSUE_ACTION
    })
}

export const deleteProjects =(issueId)=>(dispatch)=>{
  
    var token = JSON.parse(localStorage.getItem('token'))
    axios({
        method: 'delete',
        url: config.base_dir + '/api/project/'+issueId,
        headers: {
            "Authorization":token,
        },
      
    }).then(response => {
        dispatch({
            type:DELETE_SUCCESSFULL
        })
    })
    .catch(err=>{
        dispatch({
            type:DELETE_FAILED
        })
    })


}

