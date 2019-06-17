import { SIGN_IN_WITH_GOOGLE,
    AUTH_FAIL_TWITTER,SIGN_IN_WITH_GIT, SIGN_IN_WITH_TWITTER, SIGN_OUT, AUTH_FAIL, CHECK_TOKEN_VALIDIDTY } from './types'
import axios from 'axios'
import config from '../config/config'

export const signInWithGoogle = (tokenBlob) => (dispatch) => {
    const options = {
        method: 'POST',
        body: tokenBlob,
    };
    fetch( config.base_dir + '/api/users/google', options)
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
    fetch( config.base_dir + '/api/users/git?code='+code)
        .then(r => {
            r.json().then(response => {
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
            dispatch({
                type: SIGN_IN_WITH_TWITTER,
                token: token,
                userName:body.user.username,
                profilePic:body.user.profilepic,
                email:body.user.email,
                id:body.user.id,
                twitterHandle:body.user.twitterhandle,
                payload: true
            })

        })


    });
}

export const twitterAuthFailure = (error) => (dispatch) => {
    dispatch({
        type: AUTH_FAIL_TWITTER,
        payload: false,
        error: error,
        token: null
    })
}

const userLogin = (dispatch, url)=>{
    var token = JSON.parse(localStorage.getItem('token'))
    axios({
        method: 'get',
        url: config.base_dir + url,
        headers: {
            "Authorization": token,
        }
    }).then(response => {
        if (response.status === 200 || response.status === 304 ||response.status === 204) {
            dispatch({
                type: CHECK_TOKEN_VALIDIDTY,
                userName:response.data.user.username,
                profilePic:response.data.user.profilepic,
                email:response.data.user.email,
                id:response.data.user.id,
                twitterHandle: response.data.user.twitterhandle,
                payload: true
            })
        }
        else if (response.status === 401) {
            // localStorage.removeItem("token");
            dispatch({
                type: AUTH_FAIL,
                payload: false
            })
        }
    })
    .catch(err=>{
        dispatch({
            type: AUTH_FAIL,
            payload: false
        })
    })
}
export const stillAuthenicated = () => (dispatch) => {
    userLogin(dispatch ,'/api/users/');
}

export const explainAuthentication =()=>dispatch=>{
    userLogin(dispatch ,'/api/users/explain');
}

export const signout =() => (dispatch)=>{

        localStorage.removeItem("token");
        dispatch({
            type:SIGN_OUT,
            payload:false,
            token:null
        })
}