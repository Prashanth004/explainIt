import {SET_STREAM , SET_STREAM_TO_NULL } from './types'

export const setStream = (audioStream,
     screenStream, 
     finalStream)=>(dispatch)=>{
         dispatch({
             type:SET_STREAM,
             audioStream:audioStream,
             screenStream:screenStream,
             finalStream:finalStream
         })

}

export const setStreanToNull = ()=>(dispatch)=>{
    dispatch({
        type:SET_STREAM_TO_NULL,
        
    })

}