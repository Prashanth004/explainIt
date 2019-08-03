
import socketIOClient from "socket.io-client";
import { CREATE_SOCKET,REDUCE_WIDTH,REDUCE_LITTLE_WIDTH } from './types';
import config from '../config/config'

export const initiateSocket = ()=>(dispatch)=>{
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
    dispatch({type:CREATE_SOCKET,
    payload:{
        socket:socket
    }})
}

export const reduceWidth = (flag)=>(dispatch)=>{
    dispatch({
        type:REDUCE_WIDTH,
        payload:flag
    })
}
export const reducerLittleWidth = (flag)=>dispatch=>{
    dispatch({
        type:REDUCE_LITTLE_WIDTH,
        payload:flag
    })

}