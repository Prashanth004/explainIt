import {FETCH_PROJ_BY_ISSUE,
    AUTH_FAIL,
    CLEAR_ANSWER,
    FILE_SIZE_TOO_LARGE,
    UPDATE_ANSWER_WITH_IMAGE,
    CREATE_ISSUE_PROJECT_FAILED,
     CREATE_ISSUE_PROJECT,
     FETCH_STARTED,
     DELETE_SUCCESSFULL,
     UPDATE_TEXT_EXPLAIN,
     OPEN_EDIT_TEXT_MODAL,
     CLOSE_EDIT_TEXT_MODAL,
     DELETE_FAILED} from './types'
import axios from 'axios'
import config from '../config/config'

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
                    console.log("response : ",response)
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
        }
    }).catch(err=>{
        console.log("error : ",err)
    })
}
export const creatAnsProject =(textExplain, imgData, audioData, items,isquestion,issueIdFrmCpm,isPublic)=> (dispatch) =>{
    var file = new File([audioData], 'filename.webm', {
        type: 'video/webm'
    });
   var issueID
   var token = JSON.parse(localStorage.getItem('token'))
    if(isquestion === "false"){
      
        issueID = issueIdFrmCpm
    }
    else{
        issueID = null
    }
    if(issueID === undefined ){
        isquestion = "true";
        issueID = null
    }

    var projectName = config.dataTime
    var fd = new FormData();
    fd.append('imageData', imgData);
    fd.append('projectName', projectName);
    fd.append('audioData', file);
    fd.append('issueID',issueID);
    fd.append('textExplain',textExplain);
    fd.append('isquestion',isquestion);
    fd.append('public', isPublic);
    axios({
        method:'post',
        url: config.base_dir + '/api/project',
        headers: {
            "Authorization":token,
        },
        data: fd
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
        if(response.status === 450){
            dispatch({
                type:FILE_SIZE_TOO_LARGE
            })
        }
        if(response.status === 500 || response.status === 450){
            dispatch({
                type:CREATE_ISSUE_PROJECT_FAILED,
                error:true
            })

        }
       
    }).catch(err=>{

        dispatch({
            type:CREATE_ISSUE_PROJECT_FAILED,
            error : true
        })
        console.log("error : ",err)
    })
}
export const clearAnswers = ()=>(dispatch)=>{
    dispatch({
        type:CLEAR_ANSWER
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

