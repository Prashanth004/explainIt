import {EXPLIN_BY_RECORD, RESET_EXPLAIN_ACTIONS, EXPLAIN_BY_REFER} from './types'

export const explainByRecord = ()=>(dispatch)=>{

    dispatch({
        type:EXPLIN_BY_RECORD
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