import {GET_PROFILE_DETAILS,GET_PROFILE_DETAILS_FAIL } from './types'
import config from '../config/config';
import axios from 'axios';

export const getProfileDetails=(userId)=>(dispatch)=>{
    var token = JSON.parse(localStorage.getItem('token'))
  var email = null;
  var userName = null;
  var profilepic =null;


    axios({
        method: 'get',
        url: config.base_dir + '/users/id/'+userId,
        headers: {
            "Authorization": token,
        }
    }).then((response1)=>{
        if (response1.status == 200 || response1.status == 304) {
        email = response1.data.data.email;
        userName = response1.data.data.username;
        profilepic = response1.data.data.profilepic;
        axios({
            method:'get',
            url: config.base_dir+'/project/',
            headers: {
                "Authorization": token,
            }
        }).then((response2)=>{
           
            var myProjects = (response2.data.data).filter(project=>(
                project.email === response1.data.data.email
            ))
           var myIssue = myProjects.filter(project=>(
                project.isquestion === "true"
            ))
            // var issuIDMyProject = myProjects.map(project=>project.issueid)
            var noOdprojectsCreated = myIssue.length
            var noOfProj = myProjects.length
            var noOfparticipation = noOfProj - noOdprojectsCreated

            dispatch({
                type:GET_PROFILE_DETAILS,
                userName:userName,
                email:email,
                myIssue:myIssue,
                profilePic:profilepic,
                noParticipated:noOfparticipation,
                noCreated:noOdprojectsCreated
            })
         }).catch((error)=>{
            dispatch({
                type:GET_PROFILE_DETAILS_FAIL,
                error:error
            })
         })
    }
    else{
        dispatch({
            type:GET_PROFILE_DETAILS_FAIL,
            error:null
        })
    }
    }).catch((error)=>{
        dispatch({
            type:GET_PROFILE_DETAILS_FAIL,
            error:error
        })

    })
}

   


