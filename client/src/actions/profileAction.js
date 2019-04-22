import { GET_PROFILE_DETAILS,
     GET_PROFILE_DETAILS_FAIL,
     UPDATE_USER_PROFILE_FAILED,
     OPEN_EDIT_PROFILE,
     CLOSE_EDIT_PROFILE,
     UPDATE_USER_PROFILE } from './types'
import config from '../config/config';
import axios from 'axios';


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
    console.log("userId : ", userId)

    axios({
        method: 'get',
        url: config.base_dir + '/api/users/id/' + userId,
        headers: {
            "Authorization": token,
        }
    }).then((response1) => {
        if (response1.status == 200 || response1.status == 304) {
            email = response1.data.data.email;
            userName = response1.data.data.username;
            profilepic = response1.data.data.profilepic;
            twitterHandle = response1.data.data.twitterhandle;
            cost = response1.data.data.cost;
            bio = response1.data.data.bio;
            twitterLink = response1.data.data.bio;
            angelLink = response1.data.data.angellist;
            linkinLink = response1.data.data.linkedin;
            githubLink = response1.data.data.github
            axios({
                method: 'get',
                url: config.base_dir + '/api/project/',
                headers: {
                    "Authorization": token,
                }
            }).then((response2) => {
                var participated = []
                console.log("response2.data.data , ", response2.data.data)
                if (profilePrivacy === config.SELF)
                    var myProjects = (response2.data.data).filter(project => (
                        project.email === response1.data.data.email

                    ))
                else if (profilePrivacy === config.VISIT_PROF) {
                    var myProjects = (response2.data.data).filter(project => (
                        project.email === response1.data.data.email &&
                        project.public === "1"

                    ))


                }

                var myIssue = myProjects.filter(project => (
                    project.isquestion === "true"

                ))

                // var issuIDMyProject = myProjects.map(project=>project.issueid)
                const distinctIssueId = [...new Set(myProjects.map(proj => proj.issueid))]
                console.log("distinct IssueID : ", distinctIssueId)
                response2.data.data.forEach(proj => {
                    if (distinctIssueId.includes(proj.issueid) && proj.isquestion == "true") {
                        participated.push(proj)
                    }
                });
                participated = participated.filter(x => !myIssue.includes(x));
                console.log("participated :", participated)
                var noOdprojectsCreated = myIssue.length
                var noOfProj = myProjects.length
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
                    twitterHandle: twitterHandle,
                    myIssue: myIssue,
                    participatedIssue: participated,
                    profilePic: profilepic,
                    noParticipated: noOfparticipation,
                    noCreated: noOdprojectsCreated
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
export const updateUserProfile=(bio, cost,linkedin,angellist,github)=>(dispatch)=>{
    var token = JSON.parse(localStorage.getItem('token'))
    
    console.log(bio,linkedin,angellist,cost, github);
   
    var postData = {
        bio: bio,
        cost:cost,
        angellist: angellist,
        linkedin:linkedin,
        github:github
      };
      let axiosConfig = {
        headers: {
            "Authorization":token,
        }
      };

    // console.log(bio,linkedin,angellist,cost, github);
    axios.post(config.base_dir+'/api/users/updateprofile',
       postData,
       axiosConfig
    ).then(response=>{
        console.log("response : : : : ",response)
        if(response.status ===200 || response.status ===304){
            dispatch({
                type:UPDATE_USER_PROFILE,
                cost : response.data.data.cost,
                bio : response.data.data.bio,
                angelLink : response.data.data.angellist,
                linkinLink : response.data.data.linkedin,
                githubLink : response.data.data.github,
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

    // var projectName = config.dataTime
    // var fd = new FormData();
    // fd.append('imageData', imgData);
    // fd.append('projectName', projectName);
    // fd.append('audioData', audioData);
    // fd.append('issueID',issueID);
    // fd.append('textExplain',textExplain);
    // fd.append('isquestion',isquestion);
    // fd.append('public', isPublic);
    // console.log("the project getting saved : ",fd)
    // axios({
    //     method: 'post',
    //     url: config.base_dir + '/api/project',
    //     headers: {
    //         "Authorization":token,
    //     },
    //     data: fd
}




