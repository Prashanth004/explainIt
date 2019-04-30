import {SHOW_CANVAS, HIDE_CANVAS} from './types'

export const showCanvas =()=>(dispatch)=>{
    dispatch({
        type:SHOW_CANVAS,

    })

}

export const hideCanvas = ()=>(dispatch)=>{
    dispatch({
        type:HIDE_CANVAS,
    })

}