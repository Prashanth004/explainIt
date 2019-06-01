import {SAVE_RECORDER} from './types'

export const saveRecorder = ()=>(dispatch)=>{
    dispatch({
        type:SAVE_RECORDER
    })
}