import axios from "axios";
import config from '../config/config';
import {STARTED_ADD_TO_CONTACT,ADD_TO_CONTACT_FAILED_OWN_CONT,
    CONTACT_EXIST,CONTACT_DOESNT_EXIST,
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

export const getAllContacts = ()=>(dispatch)=>{
    var token = JSON.parse(localStorage.getItem('token'));
    var payload =[];
        axios({
        method:'get',
        url:config.base_dir+'/api/contact/',
        headers:{
            "Authorization":token,
        },
    }).then(response=>{
        console.log("response : ",response)
        if(response.status === 200 || response.status ===204){
            console.log(response.data.data)
            payload.push(response.data.data)
            dispatch({
                type:GOT_ALL_CONTACTS,
                data:response.data.data
            })
        }
    }).catch(error=>{
        dispatch({
            type:GOT_ALL_CONTACTS_FAILED,
            error:error
        })
    })
}