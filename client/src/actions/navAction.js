import {OPEN_HOME,OPEN_INBOX,OPEN_SETING,OPEN_SETTING,
    OPEN_CREATED,OPEN_PARTICIPATED} from './types'


export const openHome = ()=> (dispatch)=>{
    dispatch({
        type:OPEN_HOME
    })
}
export const openInbox = ()=> (dispatch)=>{
    dispatch({
        type:OPEN_INBOX
    })
}
export const openCreated = ()=> (dispatch)=>{
    dispatch({
        type:OPEN_CREATED
    })
}
export const openParticipated = ()=> (dispatch)=>{
    dispatch({
        type:OPEN_PARTICIPATED
    })
}
export const openSettings =()=>(dispatch)=>{
    dispatch({
        type:OPEN_SETTING
    })
}