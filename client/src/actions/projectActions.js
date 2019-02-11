import {FETCH_PROJ_BY_ISSUE,
    AUTH_FAIL,
    CLEAR_ANSWER,
    UPDATE_ANSWER_WITH_IMAGE,
    CREATE_ISSUE_PROJECT_FAILED,
     CREATE_ISSUE_PROJECT,
     FETCH_STARTED} from './types'
import axios from 'axios'
import config from '../config/config'



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
        url:config.base_dir+'/project/issues/'+issueId,
        headers: {
            "Authorization": token,
        }
    }).then(response=>{
        if(response.status === 200){
            allProjects = response.data.data

             questProject =  allProjects.find(preojects=> preojects.isquestion =="true");
             answerProject = allProjects.filter(project => project.isquestion !="true")
             var finalProject =[]
             var getEmails = new Promise(function(resolve, reject){
             answerProject.forEach(function(projects, index){
                axios({
                    method:'get',
                    url:config.base_dir+'/users/email/'+projects.email,
                }).then(response=>{
                    if(response.status==200){
                        const newTestJson = JSON.parse(JSON.stringify(answerProject));
                        newTestJson[index]['profilepic']=response.data.data.profilepic;
                        answerProject =newTestJson
                    }
                    dispatch({
                        type: FETCH_PROJ_BY_ISSUE,
                        questProject: questProject,
                        answerProject: answerProject
                    })
                }).catch(err=>{
                    
                    console.log("error in fetch user data : ",err)
                })
             })
             dispatch({
                type: FETCH_PROJ_BY_ISSUE,
                questProject: questProject,
                answerProject: answerProject
            })
            })
            getEmails.then(function(ansProj){
                console.log("ansProj : ",ansProj)
            })

            
           
        }
        else{
            console.log(response)
        }
    }).catch(err=>{
        console.log("error : ",err)
    })
}
export const creatAnsProject =(textExplain, imgData, audioData, items,isquestion,issueIdFrmCpm)=> (dispatch) =>{
   console.log("got request")
   console.log("audio data : ", audioData)
  
   var token = JSON.parse(localStorage.getItem('token'))
    if(isquestion === "false"){
        console.log("isquestion : ",isquestion)
        console.log("issueIdFrmCpm : ",issueIdFrmCpm)
        var issueID = issueIdFrmCpm
    }
    else{
        var issueID = null
    }
   console.log("issueId : ",issueID)
    var projectName = config.dataTime
    var fd = new FormData();
    fd.append('imageData', imgData);
    fd.append('projectName', projectName);
    fd.append('audioData', audioData);
    fd.append('issueID',issueID);
    fd.append('textExplain',textExplain);
    fd.append('isquestion',isquestion);
    console.log("the project getting saved : ",fd)
    axios({
        method: 'post',
        url: config.base_dir + '/project',
        headers: {
            "Authorization":token,
        },
        data: fd
    }) .then(response => {
        console.log("response : ",response)
        if(response.status==201)
        {
            if(response.data.data.isquestion){
            dispatch({
                type:CREATE_ISSUE_PROJECT,
                payload:response.data.data
            })
            }
           
        }
        if(response.status == 500 || response.status == 450){
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
    console.log("emailOfanswers : ",emailOfanswers)
    console.log("projects : ",projects)
    var key =0
    for(var item in projects){
        console.log("item first : ",item)
        axios({
            method:'get',
            url:config.base_dir+'/users/email/'+projects[item].email,
        }).then(response=>{
        
            if(response.status==200){
                console.log("response.data.data.profilepic : ",response.data.data.profilepic)
                console.log("item : ",key)
               projects[key]["profilepic"]=response.data.data.profilepic
               key=key+1;
            }
        }).catch(err=>{
            console.log("error in fetch user data : ",err)
        })

       dispatch({
           type:UPDATE_ANSWER_WITH_IMAGE,
           payload:projects
       })
    }
}

