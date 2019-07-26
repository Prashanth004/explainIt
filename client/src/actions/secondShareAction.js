import {SECOND_SHARE_START,SECOND_SHARE_END,SECOND_SHARE_START_AGAIN } from './types'


export const startSecodScreenShare=(stream)=>(dispatch)=>{
dispatch({
    type:SECOND_SHARE_START,
    stream:stream
})
}

export const startSecodScreenAgain = ()=>dispatch=>{
    dispatch({
        type:SECOND_SHARE_START_AGAIN,
    })
}

export const endSecondScreenShare=()=>(dispatch)=>{
    dispatch({
        type:SECOND_SHARE_END
    })
}
