import {SET_FLOATER_TIME,CHANGE_TO_MUTE_STATE,CHANGE_TO_UN_MUTE_STATE,SET_FLOATER_DISPLAY} from './types'

export const setTime =(time)=>(dispatch)=>{
   dispatch({
       type:SET_FLOATER_TIME,
       payload:time
   })
}
export const changeStateToMute = ()=>dispatch=>{
    dispatch({
        type:CHANGE_TO_MUTE_STATE
    })
}

export const changeStateToUnmute = ()=>dispatch=>{
    dispatch({
        type:CHANGE_TO_UN_MUTE_STATE
    })
}

export const setDiplayOfFloater = (vlaue)=>(dispatch)=>{
    
    dispatch({
        type:SET_FLOATER_DISPLAY,
        payload:vlaue
    })
 
}