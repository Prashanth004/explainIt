
import { FETCH_ISSUE,
    CANCEL_PROJ_CREATION_SUCCESS,
     CANCEL_PROJ_CREATION_ERROR, 
     SET_ISUUE_ID, 
     FETCH_DETAILS_OF_EXPLAINED,
     IS_ISSUE} from './types'
import axios from 'axios'
import config from '../config/config'

export const fetchIssues = () => dispatch => {
    var token = JSON.parse(localStorage.getItem('token'))
    console.log("this is token i am passing : ",token)
    axios({
        method: 'get',
        url: config.base_dir + '/issues',
       
    }).then(response => {
        if (response.status == 200) {
            console.log("length of issues : ",(response.data.data).length)
            dispatch({
                type: FETCH_ISSUE,
                payload: (response.data.data).reverse()
                
            })
        }
        else{
            console.log(response)
        }
    }).catch(err=>{
        console.log("error : ",err)
    })
} 


export const setIssueId = id => dispatch =>{
    dispatch({
        type: SET_ISUUE_ID,
        payload: id
    })
}
export const cancelValidationErrors = () =>dispath=>{
    dispath({
        type:CANCEL_PROJ_CREATION_ERROR,
        payload:false
    })
}

export const cancelSuucessMessage =() =>dispatch=>{
dispatch ({
    type:CANCEL_PROJ_CREATION_SUCCESS,
    payload:false
})
}

export const getDetailsOfExplained =(issueId)=>(dispatch)=>{
    // console.log("even the actions is beig called")
    // var token = JSON.parse(localStorage.getItem('token'))
    // axios({
    //     method:'get',
    //     url:config.base_dir+'/project/issues/'+issueId,
    //     headers: {
    //         "Authorization": token,
    //     }

    // }).then((response)=>{
       
    //     if(response.status === 200){
    //         var allProjects = response.data.data
    //         var answerProject = allProjects.filter(project => project.isquestion !="true")
    //         var ExplainPeople = new Object();
    //         answerProject.forEach(function(projects, index){
              
    //             axios({
    //                 method:'get',
    //                 url:config.base_dir+'/users/email/'+projects.email,

    //             }).then(response=>{
    //                 console.log("final response: ", response)
    //                 if(response.status==200){
    //                 const newTestJson = JSON.parse(JSON.stringify(answerProject));
    //                 newTestJson[index]['profilepic']=response.data.data.profilepic;
    //                 newTestJson[index]['username']=response.data.data.username;
    //                 answerProject =newTestJson
                   
    //                 }
                  
                   

    //             })
    //             .catch(err=>{
    //                 console.log("error : ",err)

    //             })
               
    //         })
           
          
    //     }

    // })
    // .catch((error)=>{

    // })

}