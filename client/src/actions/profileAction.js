import { GET_PROFILE_DETAILS,
     GET_PROFILE_DETAILS_FAIL,
     UPDATE_USER_PROFILE_FAILED,
     OPEN_EDIT_PROFILE,
     CLOSE_EDIT_PROFILE,
     CHANGE_ONLINE_STATUS,
     CHANGE_ONLINE_STATUS_FAILED,
     UPDATE_USER_PROFILE } from './types'
import config from '../config/config';
import axios from 'axios';

export const changeOnlinestatus = (status)=>(dispatch)=>{
    var token = JSON.parse(localStorage.getItem('token'));
    var data={
        onlineStatus:status
    }
    axios({
        method: 'put',
        url: config.base_dir + '/api/users/onlineStatus',
        data:data,
        headers: {
            "Authorization": token,
        }
    }).then(response=>{
        if(response.status===200 || response.status ===204)
        dispatch({
            type:CHANGE_ONLINE_STATUS,
            payload:status
        })
    }).catch(err=>{
        console.error("error : ",err)
        dispatch({
            type:CHANGE_ONLINE_STATUS_FAILED
        })
    })
}
export const getProfileDetails = (userId, profilePrivacy) => (dispatch) => {
    var token = JSON.parse(localStorage.getItem('token'))
    var email = null;
    var userName = null;
    var profilepic = null;
    var twitterHandle = null;
    var cost =null
    var bio = null
    var twitterLink = null;
    var angelLink = null;
    var linkinLink = null;
    var githubLink = null;
    var goodat = null;
    var works = null;
    var onlineStatus = null;

    axios({
        method: 'get',
        url: config.base_dir + '/api/users/id/' + userId,
        headers: {
            "Authorization": token,
        }
    }).then((response1) => {
        var myProjects =null;
        if (response1.status === 200 || response1.status === 304) {
            console.log("response1.data.data.online : ",response1.data.data.online)
            email = (response1.data.data.email===null)?(""):(response1.data.data.email);
            userName = (response1.data.data.username===null)?(""):(response1.data.data.username);
            profilepic = (response1.data.data.profilepic===null)?(""):(response1.data.data.profilepic);
            twitterHandle = response1.data.data.twitterhandle
            cost = response1.data.data.cost;
            bio =(response1.data.data.bio===null)?(""):(response1.data.data.bio);
            twitterLink =(response1.data.data.twitterlink===null)?(""):(response1.data.data.twitterlink);
            angelLink =(response1.data.data.angellist===null)?(""):(response1.data.data.angellist);
            linkinLink = (response1.data.data.linkedin===null)?(""):(response1.data.data.linkedin);
            githubLink = (response1.data.data.github===null)?(""):(response1.data.data.github);
            goodat=(response1.data.data.goodat===null)?(""):(response1.data.data.goodat);
            works=response1.data.data.works;
            onlineStatus=response1.data.data.online
            axios({
                method: 'get',
                url: config.base_dir + '/api/project/',
                headers: {
                    "Authorization": token,
                }
            }).then((response2) => {
                var participated = []
                var allProjects = response2.data.data.reverse()
                if (profilePrivacy === config.SELF)
                    myProjects = (allProjects).filter(project => (
                        project.userid === response1.data.data.id
                    ))
                else if (profilePrivacy === config.VISIT_PROF) {
                    myProjects = (allProjects).filter(project => (
                        project.userid === response1.data.data.id &&
                        project.public === "1"
                    ))
                }

                var myIssue = myProjects.filter(project => (
                    project.isquestion === "true"

                ))

                // var issuIDMyProject = myProjects.map(project=>project.issueid)
                const distinctIssueId = [...new Set(myProjects.map(proj => proj.issueid))]
                allProjects.forEach(proj => {
                    if (distinctIssueId.includes(proj.issueid) && proj.isquestion === "true") {
                        participated.push(proj)
                    }
                });
                participated = participated.filter(x => !myIssue.includes(x));
                var noOdprojectsCreated = myIssue.length
                // var noOfProj = myProjects.length
                var noOfparticipation = participated.length
                // var noOfparticipation = noOfProj - noOdprojectsCreated

                dispatch({
                    type: GET_PROFILE_DETAILS,
                    userName: userName,
                    email: email,
                    cost : cost,
                    bio : bio,
                    twitterLink : twitterLink,
                    angelLink : angelLink,
                    linkinLink : linkinLink,
                    githubLink : githubLink,
                    goodat:goodat,
                    works:works,
                    twitterHandle: twitterHandle,
                    myIssue: myIssue,
                    participatedIssue: participated,
                    profilePic: profilepic,
                    noParticipated: noOfparticipation,
                    noCreated: noOdprojectsCreated,
                    onlineStatus:onlineStatus,
                    allprojects:myProjects
                })
            }).catch((error) => {
                dispatch({
                    type: GET_PROFILE_DETAILS_FAIL,
                    error: error
                })
            })
        }
        else {
            dispatch({
                type: GET_PROFILE_DETAILS_FAIL,
                error: null
            })
        }
    }).catch((error) => {
        dispatch({
            type: GET_PROFILE_DETAILS_FAIL,
            error: error
        })

    })
}
export const openEditProfile=()=>(dispatch)=>{
    dispatch({
        type:OPEN_EDIT_PROFILE
    })
}
export const closeEditProfile=()=>(dispatch)=>{
    dispatch({
        type:CLOSE_EDIT_PROFILE
    })
}
export const updateUserProfile=(bio, cost,linkedin,angellist,github,goodat,works)=>(dispatch)=>{
    var token = JSON.parse(localStorage.getItem('token'))
    
   
    var postData = {
        bio: bio,
        cost:cost,
        angellist: angellist,
        linkedin:linkedin,
        github:github,
        goodat:goodat,
        works:works
      };
      let axiosConfig = {
        headers: {
            "Authorization":token,
        }
      };

    axios.post(config.base_dir+'/api/users/updateprofile',
       postData,
       axiosConfig
    ).then(response=>{
        if(response.status ===200 || response.status ===304){
            dispatch({
                type:UPDATE_USER_PROFILE,
                cost : response.data.data.cost,
                bio : response.data.data.bio,
                angelLink : response.data.data.angellist,
                linkinLink : response.data.data.linkedin,
                githubLink : response.data.data.github,
                goodat:response.data.data.goodat,
                works:response.data.data.works
            })
        }
        else{
            dispatch({
                type:UPDATE_USER_PROFILE_FAILED
            })
        }
    })
    .catch(error=>{
        console.error("error : ",error)
        dispatch({
            type:UPDATE_USER_PROFILE_FAILED
        })
    })


}




