import {EXPLIN_BY_RECORD,EXPLIN_BY_SHARE, RESET_EXPLAIN_ACTIONS, EXPLAIN_BY_REFER} from './types'

export const explainByRecord = ()=>(dispatch)=>{

    dispatch({
        type:EXPLIN_BY_RECORD
    })
}
export const explainByShare =(twitterhandle)=>dispatch=>{
    dispatch({
        type:EXPLIN_BY_SHARE,
        payload:twitterhandle
    })
}
export const explainByRefer = ()=>(dispatch)=>{
    dispatch({
        type:EXPLAIN_BY_REFER
    })
}

export const resetExplainAction = ()=>(dispatch)=>{
    dispatch({
        type:RESET_EXPLAIN_ACTIONS
    })
}