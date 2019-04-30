import {SECOND_SHARE_START,SECOND_SHARE_END } from './types'


export const startSecodScreenShare=(stream)=>(dispatch)=>{
dispatch({
    type:SECOND_SHARE_START,
    stream:stream
})
}

export const endSecondScreenShare=()=>(dispatch)=>{
    dispatch({
        type:SECOND_SHARE_END
    })
}