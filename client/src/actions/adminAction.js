import {CHNAGE_ADMIN_USERNAME, 
    CHANGE_ADMIN_PASSWORD, 
    USERNAME_EMPTY,
    PASSWORD_EMPTY,
    AUTHENTICATE_ADMIN_DETAILS,
    AUTHENTICATE_ADMIN_FAILED} from './types';
import axios from 'axios';
import config from '../config/config'
import conf from '../config/config';

export const changeAdminUserName=(e)=>(dispatch)=>{
    dispatch({
        type:CHNAGE_ADMIN_USERNAME,
        payload:e.target.value
    })
}
export const activateUser = (userid,userNameValue, password)=>(dispatch)=>{
    var data = {
        username: userNameValue,
        password: password,
        userid:userid
    }
    axios({
        method:'PUT',
        url:config.base_dir+'/api/users/activate',
        data:data
    }).then(response=>{
     var button = document.getElementById(userid);
     button.value = "Deactivate"
    }).catch(error=>{
        console.log("adminAction : activateUser : error : ",error);
    })
}

export const deactivateUser = (userid,userNameValue, password)=>(dispatch)=>{
var data = {
    username: userNameValue,
    password: password,
    userid:userid
}
axios({
    method:'PUT',
    url:config.base_dir+'/api/users/deactivate',
    data:data
}).then(response=>{
    
})
.catch(error=>{
    console.log(error)
})

}
export const changeAdminPassword=(e)=>(dispatch)=>{
   
    dispatch({
        type:CHANGE_ADMIN_PASSWORD,
        payload:e.target.value
    })
}
export const deactivate = (userid)=>(dispatch)=>{
    
}
export const submitAdminDetails=(userNameValue, password)=>(dispatch)=>{
    var token = JSON.parse(localStorage.getItem('token'));
    var data = {
        username: userNameValue,
        password: password
    }
    if(userNameValue.length===0){
        dispatch({
            type:USERNAME_EMPTY,
        })
    }
    else if(password.length===0){
        dispatch({
            type:PASSWORD_EMPTY
        })
    }
    else{
        axios({
            method:'POST',
            url:config.base_dir+'/api/admin/authenticate',
            data,
            headers:{
                "Authorization":token
            }
        }).then(response=>{
            if(response.status === 200){
                
                    axios({
                    method:'POST',
                    url:conf.base_dir+'/api/users/all',
                    data
                  
                }).then(response=>{
                    if(response.status ===200){
                        dispatch({
                            type:AUTHENTICATE_ADMIN_DETAILS,
                            payload : response.data.data,
                            username: userNameValue,
                            password: password
                         })
                        
                    }
                })
                .catch(error=>{
                    console.log(error)
                })
            }
        })
        .catch(error=>{
            console.log(error)
            dispatch({
                type:AUTHENTICATE_ADMIN_FAILED
            })
        })
        
    }
}
