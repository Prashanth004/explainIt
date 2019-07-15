import axios from "axios";
import config from '../config/config';
import {STARTED_ADD_TO_CONTACT,ADD_TO_CONTACT_FAILED_OWN_CONT,
    CONTACT_EXIST,CONTACT_DOESNT_EXIST,
    UPDAT_CONTACT_LIST,SWITCH_TO_ADD_TO_CONTACT,SWITCH_TO_CONTACT_LIST,
    GOT_ALL_CONTACTS,GOT_ALL_CONTACTS_FAILED,
    SUCCESS_ADDED_CONTACT,FAILED_TO_ADD_CONTACT} from './types'


export const addtoContact=(contactId)=>dispatch=>{
    dispatch({
        type:STARTED_ADD_TO_CONTACT
    })
    var token = JSON.parse(localStorage.getItem('token'))
    var postData = {
        contactid:contactId
      };
    axios({
        method:'post',
        url:config.base_dir+'/api/contact/',
        headers:{
            "Authorization":token,
        },
        data:postData
    }).then(response=>{

        if(response.status === 201 || response.status === 204){
                dispatch({
                    type:SUCCESS_ADDED_CONTACT,
                    payload:{contactId:contactId}})
        }
        else if(response.status === 450){
            dispatch({type:ADD_TO_CONTACT_FAILED_OWN_CONT})
        }
        else{
            console.log("i am hitiing here")
        }
    }).catch(error=>{
        dispatch({
            type:FAILED_TO_ADD_CONTACT,
            payload:{error:error}})
    })
}

export const getContactbyId = (contactid)=>(dispatch)=>{
    var token = JSON.parse(localStorage.getItem('token'))

    axios({
        method:'get',
        url:config.base_dir+'/api/contact/contact/'+contactid,
        headers:{
            "Authorization":token,
        },
    }).then(response=>{
        if(response.status === 200 || response.statud === 204 ){
            if(response.data.success ===1 )
                dispatch({type:CONTACT_EXIST})
            else
                dispatch({type:CONTACT_DOESNT_EXIST})
        }
        else{
            dispatch({
                type:CONTACT_DOESNT_EXIST,
            })
        }
    }).catch(error=>{
        dispatch({
            type:CONTACT_DOESNT_EXIST,
            error:error
        })
    })
}

export const switchToAddtoContact = ()=>(dispatch)=>{
    dispatch({
        type:SWITCH_TO_ADD_TO_CONTACT
    })
}

export const switchToContactList = ()=>(dispatch)=>{
    dispatch({
        type:SWITCH_TO_CONTACT_LIST
    })
}

export const updateContact = (newContactList) => (dispatch)=>{
    dispatch({
        type:UPDAT_CONTACT_LIST,
        newContactList : newContactList
    })
}

export const getAllContacts = ()=>(dispatch)=>{
    var token = JSON.parse(localStorage.getItem('token'));
    var contactData =[];
        axios({
        method:'get',
        url:config.base_dir+'/api/contact/',
        headers:{
            "Authorization":token,
        },
    }).then(response=>{
        console.log("response : ",response);
        var promises = [];
        if(response.status === 200 || response.status ===204){
            contactData = response.data.data
            var getUserDatils = new Promise(function(resolve, reject){
                contactData.forEach(function(projects, index){
               promises.push(axios.get(config.base_dir+'/api/users/id/'+projects.contactid))
            })
            axios.all(promises).then(function(results) {
               results.forEach(function(response, index) {
                   if(response.status===200){
                       const newTestJson = JSON.parse(JSON.stringify(contactData));
                               newTestJson[index]['profilepic']=response.data.data.profilepic;
                               newTestJson[index]['username']=response.data.data.username;
                               newTestJson[index]['twitterhandle']=response.data.data.twitterhandle;
                               contactData =newTestJson
                   }
               })
                dispatch({
                    type:GOT_ALL_CONTACTS,
                    data:contactData
                })
            })
        })
        getUserDatils.then(function(ansProj){
        })
         }
    }).catch(error=>{
        dispatch({
            type:GOT_ALL_CONTACTS_FAILED,
            error:error
        })
    })
}