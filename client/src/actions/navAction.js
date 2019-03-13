import {OPEN_HOME ,OPEN_CREATED,OPEN_PARTICIPATED} from './types'
import config  from '../config/config'

export const openHome = ()=> (dispatch)=>{
    dispatch({
        type:OPEN_HOME
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