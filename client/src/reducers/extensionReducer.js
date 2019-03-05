import {SAVE_EXTENSION_DETAILS, GET_SOURCE_ID} from '../actions/types'    

const initialState ={
  source:null,
  origin:null,
  sourceId:null
}  

export default function(state = initialState, action){
    switch(action.type){
        case SAVE_EXTENSION_DETAILS:
            return{
                ...state,
                source:action.source,
                origin:action.origin
            }
        case GET_SOURCE_ID : 
            return{
                ...state,
                sourceId:action.sourceId               
            }
        
        default:
            return state;
    }
}

