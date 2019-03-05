import {SAVE_EXTENSION_DETAILS, GET_SOURCE_ID} from './types'


export const saveExtensionDetails = (source,origin)=>(dispatch)=>{
    dispatch({
        type:SAVE_EXTENSION_DETAILS,
        source:source,
        origin:origin
    })
}

export const saveSourceId = (sourceId)=>(dispatch)=>{
    dispatch({
        type:GET_SOURCE_ID,
        sourceId:sourceId
    })

}