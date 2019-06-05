import {SET_FLOATER_TIME,SET_FLOATER_DISPLAY} from './types'

export const setTime =(time)=>(dispatch)=>{
   dispatch({
       type:SET_FLOATER_TIME,
       payload:time
   })
}

export const setDiplayOfFloater = (vlaue)=>(dispatch)=>{
    
    dispatch({
        type:SET_FLOATER_DISPLAY,
        payload:vlaue
    })
 
}