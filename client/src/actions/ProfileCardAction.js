import {GET_PROFILE_DETAILS_ON_HOVER,GET_PROFILE_DETAILS_FAIL_ON_HOVER,SHOW_CONTACTS,
    SHOW_ACTIVITY,HIDE_CONTACTS,SHOW_PROFILE,HIDE_LABEL,HIDE_ACTIVITY,HIDE_PROFILE} from './types'
import config from '../config/config';
import axios from 'axios';


export const getProfileDetailsOnHover=(userId, profilePrivacy)=>(dispatch)=>{
    var token = JSON.parse(localStorage.getItem('token'))
  var email = null;
  var userName = null;
  var profilepic =null;
  var twitterHandle = null;

    axios({
        method: 'get',
        url: config.base_dir + '/api/users/id/'+userId,
        headers: {
            "Authorization": token,
        }
    }).then((response1)=>{
        if (response1.status === 200 || response1.status === 304) {
        email = response1.data.data.email;
        userName = response1.data.data.username;
        profilepic = response1.data.data.profilepic;
        twitterHandle = response1.data.data.twitterhandle
        axios({
            method:'get',
            url: config.base_dir+'/api/project/',
            headers: {
                "Authorization": token,
            }
        }).then((response2)=>{
            var myProjects = null;
           var participated = []
           if(profilePrivacy === config.SELF)
            myProjects = (response2.data.data).filter(project=>(
                project.email === response1.data.data.email 
              
            ))
            else if(profilePrivacy === config.VISIT_PROF){
                myProjects = (response2.data.data).filter(project=>(
                    project.email === response1.data.data.email &&
                    project.public === "1"
                  
                ))
            }
          
           var myIssue = myProjects.filter(project=>(
                project.isquestion === "true"
               
            ))
         
            // var issuIDMyProject = myProjects.map(project=>project.issueid)
            const distinctIssueId = [...new Set(myProjects.map(proj=>proj.issueid))]
            response2.data.data.forEach(proj => {
                if(distinctIssueId.includes(proj.issueid)&& proj.isquestion === "true"){
                    participated.push(proj) 
                }
            });
            participated = participated.filter(x => !myIssue.includes(x));
            var noOdprojectsCreated = myIssue.length
            var noOfparticipation = participated.length
            // var noOfparticipation = noOfProj - noOdprojectsCreated

            dispatch({
                type:GET_PROFILE_DETAILS_ON_HOVER,
                userName:userName,
                email:email,
                twitterHandle:twitterHandle,
                myIssue:myIssue,
                participatedIssue : participated,
                profilePic:profilepic,
                noParticipated:noOfparticipation,
                noCreated:noOdprojectsCreated
            })
         }).catch((error)=>{
            dispatch({
                type:GET_PROFILE_DETAILS_FAIL_ON_HOVER,
                error:error
            })
         })
    }
    else{
        dispatch({
            type:GET_PROFILE_DETAILS_FAIL_ON_HOVER,
            error:null
        })
    }
    }).catch((error)=>{
        dispatch({
            type:GET_PROFILE_DETAILS_FAIL_ON_HOVER,
            error:error
        })

    })
}


export const showActivitynow =()=>(dispatch)=>{
dispatch({
    type:SHOW_ACTIVITY,
})
}

export const showContactsAct = ()=>dispatch=>{
    dispatch({
        type:SHOW_CONTACTS
    })
    
}
export const hideContactAct = ()=>dispatch=>{
    dispatch({
        type:HIDE_CONTACTS
    });
}
export const hideActivity =()=>dispatch=>{
    dispatch({
        type:HIDE_ACTIVITY
    })
}
export const hideProfile = ()=>dispatch=>{
    dispatch({
        type:HIDE_PROFILE
    })
}
export const showProfileNow =()=>(dispatch)=>{
    dispatch({
        type:SHOW_PROFILE
    })
    }
export const hideLabel = ()=>(dispatch)=>{
    dispatch({
        type:HIDE_LABEL
    })
}
    

   


