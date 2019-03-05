import { SIGN_IN_WITH_GOOGLE,SIGN_IN_WITH_GIT, SIGN_IN_WITH_TWITTER, SIGN_OUT, AUTH_FAIL, CHECK_TOKEN_VALIDIDTY } from './types'
import axios from 'axios'
import config from '../config/config'

export const signInWithGoogle = (tokenBlob) => (dispatch) => {
    const options = {
        method: 'POST',
        body: tokenBlob,
    };
    fetch( config.base_dir + '/users/google', options)
        .then(r => {
            r.json().then(response => {
                var storeToken = new Promise(function (resolve, reject) {
                    localStorage.setItem('token', JSON.stringify(response.token))
                    var token1 = JSON.parse(localStorage.getItem('token'))
                    resolve(token1)
                });
                storeToken.then(function (token) {
                    dispatch({
                        type: SIGN_IN_WITH_GOOGLE,
                        userName:response.user.username,
                        profilePic:response.user.profilepic,
                        email:response.user.email,
                        id:response.user.id,
                        token: token,
                        payload: true
                    })
                })
            })
        })
        .catch(err => {
            console.log("error", err)
            dispatch({
                type: AUTH_FAIL,
                payload: false,
                token: null,
                error: err
            })
        })
}

export const signInWithGitHub = (code) =>(dispatch)=>{
   console.log("*************************code : ",code)
    fetch( config.base_dir + '/users/git?code='+code)
        .then(r => {
            r.json().then(response => {
                console.log("########### response ########",response)
                var storeToken = new Promise(function (resolve, reject) {
                    localStorage.setItem('token', JSON.stringify(response.token))
                    var token1 = JSON.parse(localStorage.getItem('token'))
                    resolve(token1)
                });
                storeToken.then(function (token) {
                    dispatch({
                        type: SIGN_IN_WITH_GIT,
                        userName:response.user.username,
                        profilePic:response.user.profilepic,
                        email:response.user.email,
                        id:response.user.id,
                        token: token,
                        payload: true
                    })
                })
            })
        })
        .catch(err => {
            console.log("error", err)
            dispatch({
                type: AUTH_FAIL,
                payload: false,
                token: null,
                error: err
            })
        })

}

export const signInWithTwitter = (response) => (dispatch) => {
    response.json().then(body => {
        var responseBody = (body);
        var token = JSON.stringify(responseBody.token)

        var storeToken = new Promise(function (resolve, reject) {
            localStorage.setItem('token', token)
            var token1 = JSON.parse(localStorage.getItem('token'))
            resolve(token1)
        });
        storeToken.then(function (token) {
            console.log("i am getiing excevuted")
            dispatch({
                type: SIGN_IN_WITH_TWITTER,
                token: token,
                payload: true
            })

        })


    });
}

export const twitterAuthFailure = (error) => (dispatch) => {
    dispatch({
        type: AUTH_FAIL,
        payload: false,
        error: error,
        token: null
    })
}
export const stillAuthenicated = () => (dispatch) => {
 var token = JSON.parse(localStorage.getItem('token'))
 console.log("this is getting called")
    axios({
        method: 'get',
        url: config.base_dir + '/users/',
        headers: {
            "Authorization": token,
        }
    }).then(response => {
        if (response.status == 200 || response.status == 304) {
            console.log(response.data)
            dispatch({
                type: CHECK_TOKEN_VALIDIDTY,
                userName:response.data.user.username,
                profilePic:response.data.user.profilepic,
                email:response.data.user.email,
                id:response.data.user.id,
                payload: true
            })
        }
        else if (response.status == 401) {
            localStorage.removeItem("token");
            dispatch({
                type: AUTH_FAIL,
                payload: false
            })
        }
    })
    .catch(err=>{
        console.log("error",err)
    })
   
}

export const signout =() => (dispatch)=>{

        localStorage.removeItem("token");
        dispatch({
            type:SIGN_OUT,
            payload:false,
            token:null
        })
}