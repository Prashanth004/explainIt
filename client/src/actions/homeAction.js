
import socketIOClient from "socket.io-client";
import {
    CREATE_SOCKET, REDUCE_WIDTH, REDUCE_LITTLE_WIDTH, PROFLE_HANDLE_ON_EXPLAIN,
    PROFILE_NOT_PRESENT_ON_TWITTER, PROFILE_PRESENT_ON_TWITTER_NOT_EXPALIN
} from './types';
import config from '../config/config'
import axios from 'axios'

export const initiateSocket = () => (dispatch) => {
    const socket = socketIOClient(config.base_dir, { origins: "*" });
    socket.on('reconnect_attempt', () => {
        socket.io.opts.transports = ['polling', 'websocket'];
    });
    socket.on('connect_failed', function () {
        console.log("connection failed : ")
    })
    socket.on('error', function (err) {
        console.log("socket error : ", err)
    });
    socket.on('connect_timeout', function (err) {
        console.log("socket onnection_timeout : ", err)
    });
    socket.on("disconnect", () => {
        console.log("socket disconnected")
    })
    socket.io.on("connect_error", () => {
        console.log("connection_error")
    })
    dispatch({
        type: CREATE_SOCKET,
        payload: {
            socket: socket
        }
    })
}

export const reduceWidth = (flag) => (dispatch) => {
    dispatch({
        type: REDUCE_WIDTH,
        payload: flag
    })
}
export const reducerLittleWidth = (flag) => dispatch => {
    dispatch({
        type: REDUCE_LITTLE_WIDTH,
        payload: flag
    })
}
export const validateTwitterHandle = (twitterHandle) => dispatch => {
    var token = JSON.parse(localStorage.getItem('token'))
    axios({
        method: 'get',
        url: config.base_dir + '/api/users/twitterhandle/' + twitterHandle,
        headers: {
            "Authorization": token,
        }

    }).then(response1 => {
        if (response1.status === 200 || response1.status === 304) {
            if (response1.data.data !== null) {
                dispatch({
                    type: PROFLE_HANDLE_ON_EXPLAIN,
                    email: response1.data.data.email,
                    userName: response1.data.data.username,
                    profilePic: response1.data.data.profilepic,
                    id: response1.data.data.id,
                    onlineStatus: response1.data.data.online,
                    busyStatus: response1.data.data.busy,
                    twitterHandle: twitterHandle,
                })
            }
            else {
                var data = {
                    id: null,
                    twitterhandle: twitterHandle
                }
                axios({
                    method: 'post',
                    url: config.base_dir + '/api/tweetactions/getid',
                    headers: {
                        "Authorization": token,
                    },
                    data: data
                }).then(res => {
                    if (res.data.success === 1) {
                        dispatch({
                            type: PROFILE_PRESENT_ON_TWITTER_NOT_EXPALIN,
                            twitterHandle: twitterHandle,
                            email: null,
                            userName:res.data.name,
                            profilePic: res.data.profilePic,
                            id: res.data.id,
                            onlineStatus: 0,
                            busyStatus: 0,
                        })
                    }
                    else {
                        dispatch({
                            type: PROFILE_NOT_PRESENT_ON_TWITTER,
                            payload: false
                        })
                    }

                }).catch(err => {
                    console.log("error : ", err)
                })

            }
        }


    })
        .catch(err => {
            console.log("error : ", err)
        })



}